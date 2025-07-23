// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Test} from "forge-std/Test.sol";
import {console} from "forge-std/console.sol"; // Import the console for logging
import {IEscrow, EscrowUniversal} from "../src/EscrowUniversal.sol";
import {IArbitrableV2, IArbitratorV2, ArbitratorMock} from "../src/test/ArbitratorMock.sol";
import {IDisputeTemplateRegistry, DisputeTemplateRegistryMock} from "../src/test/DisputeTemplateRegistryMock.sol";
import {TestERC20} from "../src/test/TestERC20.sol";
import "../src/interfaces/Types.sol";

contract EscrowUniversalTest is Test {

    event DisputeTemplate(
        uint256 indexed _templateId,
        string indexed _templateTag,
        string _templateData,
        string _templateDataMappings
    );

    event ParameterUpdated(uint256 _feeTimeout, uint256 _settlementTimeout, bytes _arbitratorExtraData);

    event NativeTransactionCreated(
        uint256 indexed _transactionID,
        string _transactionUri,
        address indexed _buyer,
        address indexed _seller,
        uint256 _amount,
        uint256 _deadline
    );

    event ERC20TransactionCreated(
        uint256 indexed _transactionID,
        string _transactionUri,
        address indexed _buyer,
        address indexed _seller,
        IERC20 _token,
        uint256 _amount,
        uint256 _deadline
    );

    event Payment(uint256 indexed _transactionID, uint256 _amount, address _party);

    event TransactionResolved(uint256 indexed _transactionID, Resolution indexed _resolution);

    event SettlementProposed(uint256 indexed _transactionID, Party _party, uint256 _amount);

    event HasToPayFee(uint256 indexed _transactionID, Party _party);

    event DisputeCreation(uint256 indexed _disputeID, IArbitrableV2 indexed _arbitrable);

    event Ruling(IArbitrableV2 indexed _arbitrable, uint256 indexed _disputeID, uint256 _ruling);

    event Ruling(IArbitratorV2 indexed _arbitrator, uint256 indexed _disputeID, uint256 _ruling);

    event DisputeRequest(
        IArbitratorV2 indexed _arbitrator,
        uint256 indexed _arbitratorDisputeID,
        uint256 _externalDisputeID,
        uint256 _templateId,
        string _templateUri
    );

    EscrowUniversal escrow;
    ArbitratorMock arbitrator;
    TestERC20 escrowToken;
    DisputeTemplateRegistryMock registry;

    address governor;
    address buyer;
    address seller;
    address other;

    uint256 feeTimeout;
    uint256 settlementTimeout;
    bytes arbitratorExtraData;
    string templateData;
    string templateDataMappings;
    uint256 arbitrationCost;

    uint256 totalSupply = 1000000 ether;
    uint256 txValue = 0.5 ether;
    uint256 txTimeout = 1000;
    string txUri = "escrowTxUri";

    function setUp() public {
        governor = msg.sender;
        buyer = vm.addr(1);
        seller = vm.addr(2);
        other = vm.addr(9);

        vm.deal(buyer, 10 ether);

        feeTimeout = 200;
        settlementTimeout = 400;

        // Extradata is irrelevant for mock arbitrator and doesn't influence the arbitration cost.
        arbitratorExtraData = "0xfa";
        templateData = "AAA";
        templateDataMappings = "BBB";
        arbitrationCost = 0.03 ether;

        arbitrator = new ArbitratorMock(arbitrationCost);
        escrowToken = new TestERC20("Test", "TST");
        registry = new DisputeTemplateRegistryMock();

        vm.prank(governor);
        escrow = new EscrowUniversal(
            arbitrator,
            arbitratorExtraData,
            templateData,
            templateDataMappings,
            registry,
            feeTimeout,
            settlementTimeout
        );

        escrowToken.transfer(buyer, 1 ether);
        vm.prank(buyer);
        escrowToken.approve(address(escrow), 1 ether);

        vm.prank(governor);
        escrow.changeAmountCap(NATIVE, txValue);
        vm.prank(governor);
        escrow.changeAmountCap(escrowToken, txValue);
    }

    function test_setUp() public {
        assertEq(escrow.governor(), msg.sender, "Wrong governor");
        assertEq(address(escrow.arbitrator()), address(arbitrator), "Wrong arbitrator");
        assertEq(escrow.arbitratorExtraData(), "0xfa", "Wrong extra data");
        assertEq(address(escrow.templateRegistry()), address(registry), "Wrong template registry");
        assertEq(escrow.feeTimeout(), 200, "Wrong feeTimeout");
        assertEq(escrow.settlementTimeout(), 400, "Wrong settlementTimeout");
        assertEq(escrow.templateId(), 0, "Wrong templateId");
        assertEq(escrow.AMOUNT_OF_CHOICES(), 2, "Wrong number of choices");
        assertEq(escrow.getTransactionCount(), 0, "Transaction count should be 0");


        assertEq(arbitrator.arbitrationCost(arbitratorExtraData), 0.03 ether, "Wrong arbitration cost");

        assertEq(escrowToken.name(), "Test", "Wrong token name");
        assertEq(escrowToken.symbol(), "TST", "Wrong token symbol");
        assertEq(escrowToken.totalSupply(), 1000000 ether, "Wrong total supply");
        assertEq(escrowToken.balanceOf(address(this)), 999999 ether, "Wrong token balance of this contract");
        assertEq(escrowToken.balanceOf(buyer), 1 ether, "Wrong token balance of the buyer");

        assertEq(registry.templates(), 1, "Wrong templates index in the registry");

        assertEq(escrow.amountCaps(NATIVE), 0.5 ether, "Wrong amount cap NATIVE");
        assertEq(escrow.amountCaps(escrowToken), 0.5 ether, "Wrong amount cap for escrowToken");
    }

    function test_setUp_events() public {
        governor = msg.sender;
        buyer = vm.addr(1);
        seller = vm.addr(2);
        other = vm.addr(9);

        feeTimeout = 200;
        settlementTimeout = 400;

        arbitratorExtraData = "0xfa";
    
        uint256 templateId;
        templateData = "AAA";
        templateDataMappings = "BBB";
        arbitrationCost = 0.03 ether;

        arbitrator = new ArbitratorMock(arbitrationCost);
        escrowToken = new TestERC20("Test", "TST");
        registry = new DisputeTemplateRegistryMock();

        vm.prank(governor);
        vm.expectEmit(true, true, true, true);
        emit DisputeTemplate(0, "", templateData, templateDataMappings);
        vm.expectEmit(true, true, true, true);
        emit ParameterUpdated(feeTimeout, settlementTimeout, arbitratorExtraData);
        escrow = new EscrowUniversal(
            arbitrator,
            arbitratorExtraData,
            templateData,
            templateDataMappings,
            registry,
            feeTimeout,
            settlementTimeout
        );
    }

    // ****************************************** //
    // *             Governance  test           * //
    // ****************************************** //

    function test_changeGovernor() public {
        vm.expectRevert(IEscrow.GovernorOnly.selector);
        vm.prank(other);
        escrow.changeGovernor(other);
        vm.prank(governor);
        escrow.changeGovernor(other);
        assertEq(escrow.governor(), other, "Wrong governor");
    }

    function test_changeArbitrator() public {
        vm.expectRevert(IEscrow.GovernorOnly.selector);
        vm.prank(other);
        escrow.changeArbitrator(IArbitratorV2(other));
        vm.prank(governor);
        escrow.changeArbitrator(IArbitratorV2(other));
        assertEq(address(escrow.arbitrator()), other, "Wrong arbitrator");
    }

    function test_changeArbitratorExtraData() public {
        vm.expectRevert(IEscrow.GovernorOnly.selector);
        vm.prank(other);
        escrow.changeArbitratorExtraData("0xab");
        vm.prank(governor);
        vm.expectEmit(true, true, true, true);
        emit ParameterUpdated(feeTimeout, settlementTimeout, "0xab");
        escrow.changeArbitratorExtraData("0xab");
        assertEq(escrow.arbitratorExtraData(), "0xab", "Wrong extra data");
    }

    function test_changeTemplateRegistry() public {
        vm.expectRevert(IEscrow.GovernorOnly.selector);
        vm.prank(other);
        escrow.changeTemplateRegistry(IDisputeTemplateRegistry(other));
        vm.prank(governor);
        escrow.changeTemplateRegistry(IDisputeTemplateRegistry(other));
        assertEq(address(escrow.templateRegistry()), other, "Wrong template registry");
    }

    function test_changeDisputeTemplate() public {
        string memory newTemplateData = "Y";
        string memory newTemplateDataMappings = "Z";
        uint256 newTemplateId = 1;
        
        vm.expectRevert(IEscrow.GovernorOnly.selector);
        vm.prank(other);
        escrow.changeDisputeTemplate(newTemplateData, newTemplateDataMappings);
        vm.prank(governor);
        vm.expectEmit(true, true, true, true);
        emit DisputeTemplate(newTemplateId, "", newTemplateData, newTemplateDataMappings);
        escrow.changeDisputeTemplate(newTemplateData, newTemplateDataMappings);
        
        assertEq(escrow.templateId(), newTemplateId, "Wrong templateId");
        assertEq(registry.templates(), 2, "Wrong templates index in the registry");
    }

    function test_changeFeeTimeout() public {
        vm.expectRevert(IEscrow.GovernorOnly.selector);
        vm.prank(other);
        escrow.changeFeeTimeout(15);
        vm.prank(governor);
        vm.expectEmit(true, true, true, true);
        emit ParameterUpdated(15, settlementTimeout, arbitratorExtraData);
        escrow.changeFeeTimeout(15);
        assertEq(escrow.feeTimeout(), 15, "Wrong feeTimeout");
    }

    function test_changeSettlementTimeout() public {
        vm.expectRevert(IEscrow.GovernorOnly.selector);
        vm.prank(other);
        escrow.changeSettlementTimeout(47);
        vm.prank(governor);
        vm.expectEmit(true, true, true, true);
        emit ParameterUpdated(feeTimeout, 47, arbitratorExtraData);
        escrow.changeSettlementTimeout(47);
        assertEq(escrow.settlementTimeout(), 47, "Wrong settlementTimeout");
    }

    function test_changeAmountCap() public {
        vm.expectRevert(IEscrow.GovernorOnly.selector);
        vm.prank(other);
        escrow.changeAmountCap(escrowToken, 500);
        vm.prank(governor);
        escrow.changeAmountCap(escrowToken, 500);
        assertEq(escrow.amountCaps(escrowToken), 500, "Wrong amount cap");
    }

    // ************************************************ //
    // *             Escrow transaction test          * //
    // ************************************************ //

    function test_createNativeTransaction() public {
        uint256 deadline = block.timestamp + txTimeout;
        uint256 txId;
        vm.prank(buyer);
        vm.expectEmit(true, true, true, true);
        emit NativeTransactionCreated(txId, txUri, buyer, seller, 0.5 ether, deadline);
        escrow.createNativeTransaction{value: txValue}(deadline, txUri, payable(seller));

        (
            address escrowBuyer,
            address escrowSeller,
            uint256 amount,
            uint256 settlementBuyer,
            uint256 settlementSeller,
            uint256 escrowdeadline,
            uint256 disputeId,
            uint256 buyerFee,
            uint256 sellerFee,
            uint256 lastFeePaymentTime,
            Status status,
            IERC20 token
        ) = escrow.transactions(txId);

        assertEq(escrowBuyer, buyer, "Wrong buyer address");
        assertEq(escrowSeller, seller, "Wrong seller address");
        assertEq(amount, 0.5 ether, "Wrong escrow amount");
        assertEq(settlementBuyer, 0, "settlementBuyer should be 0");
        assertEq(settlementSeller, 0, "settlementSeller should be 0");
        assertEq(escrowdeadline, block.timestamp + 1000, "Wrong deadline");
        assertEq(disputeId, 0, "disputeId should be 0");
        assertEq(sellerFee, 0, "sellerFee should be 0");
        assertEq(lastFeePaymentTime, 0, "lastFeePaymentTime should be 0");
        assertEq(uint256(status), uint256(Status.NoDispute), "Wrong status");
        assertEq(address(token), address(NATIVE), "Should be 0 token");
        assertEq(escrow.getTransactionCount(), 1, "Wrong transaction count");

        assertEq(address(escrow).balance, 0.5 ether, "Wrong balance of the contract");
        assertEq(buyer.balance, 9.5 ether, "Wrong balance of the buyer");
        assertEq(seller.balance, 0, "Seller balance should be 0");
    }

    function test_createNativeTransaction_checkCap() public {
        uint256 deadline = block.timestamp + txTimeout;

        vm.prank(governor);
        escrow.changeAmountCap(NATIVE, 0);
        vm.expectRevert(IEscrow.AmountExceedsCap.selector);
        vm.prank(buyer);        
        escrow.createNativeTransaction{value: txValue}(deadline, txUri, payable(seller));

        vm.prank(governor);
        escrow.changeAmountCap(NATIVE, txValue - 1);
        vm.expectRevert(IEscrow.AmountExceedsCap.selector);
        vm.prank(buyer);        
        escrow.createNativeTransaction{value: txValue}(deadline, txUri, payable(seller));
    }

    function test_createERC20Transaction() public {
        uint256 deadline = block.timestamp + txTimeout;
        uint256 txId;
        vm.prank(buyer);
        vm.expectEmit(true, true, true, true);
        // Pay a bit less to differ between tests
        emit ERC20TransactionCreated(txId, txUri, buyer, seller, escrowToken, 0.4 ether, deadline);
        escrow.createERC20Transaction(0.4 ether, escrowToken, deadline, txUri, payable(seller));

        (
            address escrowBuyer,
            address escrowSeller,
            uint256 amount,
            uint256 settlementBuyer,
            uint256 settlementSeller,
            uint256 escrowdeadline,
            uint256 disputeId,
            uint256 buyerFee,
            uint256 sellerFee,
            uint256 lastFeePaymentTime,
            Status status,
            IERC20 token
        ) = escrow.transactions(txId);

        assertEq(escrowBuyer, buyer, "Wrong buyer address");
        assertEq(escrowSeller, seller, "Wrong seller address");
        assertEq(amount, 0.4 ether, "Wrong escrow amount");
        assertEq(settlementBuyer, 0, "settlementBuyer should be 0");
        assertEq(settlementSeller, 0, "settlementSeller should be 0");
        assertEq(escrowdeadline, block.timestamp + 1000, "Wrong deadline");
        assertEq(disputeId, 0, "disputeId should be 0");
        assertEq(sellerFee, 0, "sellerFee should be 0");
        assertEq(lastFeePaymentTime, 0, "lastFeePaymentTime should be 0");
        assertEq(uint256(status), uint256(Status.NoDispute), "Wrong status");
        assertEq(address(token), address(escrowToken), "Wrong token address");
        assertEq(escrow.getTransactionCount(), 1, "Wrong transaction count");

        assertEq(escrowToken.balanceOf(address(escrow)), 0.4 ether, "Wrong token balance of the escrow");
        assertEq(escrowToken.balanceOf(buyer), 0.6 ether, "Wrong token balance of buyer");
        assertEq(escrowToken.balanceOf(seller), 0, "Balance of seller should be 0");
    }

    function test_createNativeTransaction_approvalMissing() public {
        uint256 deadline = block.timestamp + txTimeout;

        escrowToken.transfer(other, 1 ether);
        
        // Should fail because no approval
        vm.expectRevert(IEscrow.TokenTransferFailed.selector);
        vm.prank(other);        
        escrow.createERC20Transaction(txValue, escrowToken, deadline, txUri, payable(seller));
    }

    function test_payNative() public {
        uint256 deadline = block.timestamp + txTimeout;
        uint256 amountToPay = 0.1 ether;
        uint256 txId;

        vm.prank(buyer);
        escrow.createNativeTransaction{value: txValue}(deadline, txUri, payable(seller));

        vm.expectRevert(IEscrow.BuyerOnly.selector);
        vm.prank(seller);
        escrow.pay(txId, amountToPay);

        vm.expectRevert(IEscrow.MaximumPaymentAmountExceeded.selector);
        vm.prank(buyer);
        escrow.pay(txId, txValue + 1);

        vm.prank(buyer);
        vm.expectEmit(true, true, true, true);
        emit Payment(txId, amountToPay, buyer);
        escrow.pay(txId, amountToPay);

        (,, uint256 amount,,,,,,,, Status status,) = escrow.transactions(txId);

        assertEq(amount, 0.4 ether, "Wrong escrow amount after payment");
        assertEq(uint256(status), uint256(Status.NoDispute), "Status should not change");

        assertEq(address(escrow).balance, 0.4 ether, "Wrong balance of the contract after payment");
        assertEq(buyer.balance, 9.5 ether, "Wrong balance of the buyer");
        assertEq(seller.balance, 0.1 ether, "Seller balance should be increased");

        // Resolve the tx by paying the rest
        vm.prank(buyer);
        vm.expectEmit(true, true, true, true);
        emit TransactionResolved(txId, Resolution.TransactionExecuted);
        escrow.pay(txId, txValue - amountToPay);

        (,, amount,,,,,,,, status,) = escrow.transactions(txId);

        assertEq(amount, 0, "Amount should be 0");
        assertEq(uint256(status), uint256(Status.TransactionResolved), "Status should be Resolved");

        assertEq(address(escrow).balance, 0, "Balance of the contract should be 0");
        assertEq(buyer.balance, 9.5 ether, "Wrong balance of the buyer");
        assertEq(seller.balance, 0.5 ether, "Seller should receive the full payment");
    }

    function test_payERC20() public {
        uint256 deadline = block.timestamp + txTimeout;
        uint256 txId;
        vm.prank(buyer);
        escrow.createERC20Transaction(0.4 ether, escrowToken, deadline, txUri, payable(seller));

        vm.prank(buyer);
        escrow.pay(txId, 0.1 ether);

        (,, uint256 amount,,,,,,,,,) = escrow.transactions(txId);

        assertEq(amount, 0.3 ether, "Wrong amount after payment");

        assertEq(escrowToken.balanceOf(address(escrow)), 0.3 ether, "Wrong token balance of the escrow");
        assertEq(escrowToken.balanceOf(buyer), 0.6 ether, "Wrong token balance of buyer");
        assertEq(escrowToken.balanceOf(seller), 0.1 ether, "Wrong balance of the seller");       
    }

    function test_reimburseNative() public {
        uint256 deadline = block.timestamp + txTimeout;
        uint256 amountToReimburse = 0.2 ether;
        uint256 txId;

        vm.prank(buyer);
        escrow.createNativeTransaction{value: txValue}(deadline, txUri, payable(seller));

        vm.expectRevert(IEscrow.SellerOnly.selector);
        vm.prank(buyer);
        escrow.reimburse(txId, amountToReimburse);

        vm.expectRevert(IEscrow.MaximumPaymentAmountExceeded.selector);
        vm.prank(seller);
        escrow.reimburse(txId, txValue + 1);

        vm.prank(seller);
        vm.expectEmit(true, true, true, true);
        emit Payment(txId, amountToReimburse, seller);
        escrow.reimburse(txId, amountToReimburse);

        (,, uint256 amount,,,,,,,, Status status,) = escrow.transactions(txId);

        assertEq(amount, 0.3 ether, "Wrong escrow amount after reimbursement");
        assertEq(uint256(status), uint256(Status.NoDispute), "Status should not change");

        assertEq(address(escrow).balance, 0.3 ether, "Wrong balance of the contract after reimbursement");
        assertEq(buyer.balance, 9.7 ether, "Wrong balance of the buyer");
        assertEq(seller.balance, 0, "Seller balance should be 0");

        // Resolve the tx by paying the rest
        vm.prank(seller);
        vm.expectEmit(true, true, true, true);
        emit TransactionResolved(txId, Resolution.TransactionExecuted);
        escrow.reimburse(txId, txValue - amountToReimburse);

        (,, amount,,,,,,,, status,) = escrow.transactions(txId);

        assertEq(amount, 0, "Amount should be 0");
        assertEq(uint256(status), uint256(Status.TransactionResolved), "Status should be Resolved");

        assertEq(address(escrow).balance, 0, "Balance of the contract should be 0");
        assertEq(buyer.balance, 10 ether, "Wrong balance of the buyer");
        assertEq(seller.balance, 0, "Seller balance should be 0");
    }

    function test_reimburseERC20() public {
        uint256 deadline = block.timestamp + txTimeout;
        uint256 txId;
        vm.prank(buyer);
        escrow.createERC20Transaction(0.4 ether, escrowToken, deadline, txUri, payable(seller));

        vm.prank(seller);
        escrow.reimburse(txId, 0.1 ether);

        (,, uint256 amount,,,,,,,,,) = escrow.transactions(txId);

        assertEq(amount, 0.3 ether, "Wrong amount after reimbursement");

        assertEq(escrowToken.balanceOf(address(escrow)), 0.3 ether, "Wrong token balance of the escrow");
        assertEq(escrowToken.balanceOf(buyer), 0.7 ether, "Wrong token balance of buyer");
        assertEq(escrowToken.balanceOf(seller), 0, "Seller balance should be 0");       
    }

    function test_executeTransactionNative() public {
        uint256 deadline = block.timestamp + txTimeout;
        uint256 txId;

        vm.prank(buyer);
        escrow.createNativeTransaction{value: txValue}(deadline, txUri, payable(seller));

        vm.expectRevert(IEscrow.DeadlineNotPassed.selector);
        vm.prank(other);
        escrow.executeTransaction(txId);

        vm.warp(deadline);

        vm.prank(other);
        vm.expectEmit(true, true, true, true);
        emit Payment(txId, txValue, buyer);
        vm.expectEmit(true, true, true, true);
        emit TransactionResolved(txId, Resolution.TransactionExecuted);
        escrow.executeTransaction(txId);

        (,, uint256 amount,,,,,,,, Status status,) = escrow.transactions(txId);

        assertEq(amount, 0, "Amount should be 0");
        assertEq(uint256(status), uint256(Status.TransactionResolved), "Status should be Resolved");

        assertEq(address(escrow).balance, 0, "Balance of the contract should be 0");
        assertEq(buyer.balance, 9.5 ether, "Wrong balance of the buyer");
        assertEq(seller.balance, 0.5 ether, "Seller should receive the full payment");
    }

    function test_executeTransactionERC20() public {
        uint256 deadline = block.timestamp + txTimeout;
        uint256 txId;

        vm.prank(buyer);
        escrow.createERC20Transaction(txValue, escrowToken, deadline, txUri, payable(seller));

        vm.warp(deadline);

        vm.prank(other);
        escrow.executeTransaction(txId);

        (,, uint256 amount,,,,,,,,,) = escrow.transactions(txId);

        assertEq(amount, 0, "Amount should be 0");

        assertEq(escrowToken.balanceOf(address(escrow)), 0, "Wrong token balance of the escrow after executing tx");
        assertEq(escrowToken.balanceOf(buyer), 0.5 ether, "Wrong token balance of the buyer");
        assertEq(escrowToken.balanceOf(seller), 0.5 ether, "Wrong token balance of the seller");  
    }

    function test_executeTransactionERC20_checkTransferRevert() public {
        uint256 deadline = block.timestamp + txTimeout;
        uint256 txId;

        vm.prank(buyer);
        escrow.createERC20Transaction(0.4 ether, escrowToken, deadline, txUri, payable(seller));

        // Make it so the contract has 0 balance to trigger the revert
        deal(address(escrowToken), address(escrow), 0 ether);
        assertEq(escrowToken.balanceOf(address(escrow)), 0, "Balance should be 0");

        vm.expectRevert(IEscrow.TokenTransferFailed.selector);
        vm.prank(buyer);
        escrow.pay(txId, 0.1 ether);

        vm.expectRevert(IEscrow.TokenTransferFailed.selector);
        vm.prank(seller);
        escrow.reimburse(txId, 0.1 ether);

        vm.warp(deadline);

        vm.expectRevert(IEscrow.TokenTransferFailed.selector);
        vm.prank(other);
        escrow.executeTransaction(txId);
    }

    function test_pay_checkStatusRevert() public {
        uint256 deadline = block.timestamp + txTimeout;
        uint256 txId;

        vm.prank(buyer);
        escrow.createNativeTransaction{value: txValue}(deadline, txUri, payable(seller));
        vm.prank(buyer);
        escrow.pay(txId, txValue);

        vm.expectRevert(IEscrow.TransactionDisputed.selector);
        vm.prank(buyer);
        escrow.pay(txId, 1);

        vm.expectRevert(IEscrow.TransactionDisputed.selector);
        vm.prank(seller);
        escrow.reimburse(txId, 1);

        vm.warp(deadline);

        vm.expectRevert(IEscrow.TransactionDisputed.selector);
        vm.prank(other);
        escrow.executeTransaction(txId);   
    }

    function test_proposeSettlement() public {
        uint256 deadline = block.timestamp + txTimeout;
        uint256 txId;

        vm.prank(buyer);
        escrow.createNativeTransaction{value: txValue}(deadline, txUri, payable(seller));

        vm.expectRevert(IEscrow.BuyerOrSellerOnly.selector);
        vm.prank(other);
        escrow.proposeSettlement(txId, 0.2 ether);

        vm.expectRevert(IEscrow.MaximumPaymentAmountExceeded.selector);
        vm.prank(seller);
        escrow.proposeSettlement(txId, txValue + 1);

        vm.prank(seller);
        vm.expectEmit(true, true, true, true);
        emit SettlementProposed(txId, Party.Seller, 0.2 ether);
        escrow.proposeSettlement(txId, 0.2 ether);

        (,, uint256 amount, uint256 settlementBuyer, uint256 settlementSeller,,,,, uint256 lastFeePaymentTime, Status status,) = escrow.transactions(txId);

        assertEq(amount, 0.5 ether, "Amount should not change");
        assertEq(uint256(status), uint256(Status.WaitingSettlementBuyer), "Status should be WaitingSettlementBuyer");
        assertEq(settlementBuyer, 0, "settlementBuyer should be 0");
        assertEq(settlementSeller, 0.2 ether, "settlementSeller is stored incorrectly");
        assertEq(lastFeePaymentTime, block.timestamp, "lastFeePaymentTime is stored incorrectly");

        vm.expectRevert(IEscrow.BuyerOnly.selector);
        vm.prank(seller);
        escrow.proposeSettlement(txId, 0.15 ether);

        vm.prank(buyer);
        vm.expectEmit(true, true, true, true);
        emit SettlementProposed(txId, Party.Buyer, 0.15 ether);
        escrow.proposeSettlement(txId, 0.15 ether);

        (,, amount, settlementBuyer, settlementSeller,,,,, lastFeePaymentTime, status,) = escrow.transactions(txId);

        assertEq(amount, 0.5 ether, "Amount should not change");
        assertEq(uint256(status), uint256(Status.WaitingSettlementSeller), "Status should be WaitingSettlementSeller");
        assertEq(settlementBuyer, 0.15 ether, "settlementBuyer is stored incorrectly");
        assertEq(settlementSeller, 0.2 ether, "settlementSeller should not change");
        assertEq(lastFeePaymentTime, block.timestamp, "lastFeePaymentTime is stored incorrectly");

        vm.expectRevert(IEscrow.SellerOnly.selector);
        vm.prank(buyer);
        escrow.proposeSettlement(txId, 0.17 ether);

        vm.prank(seller);
        vm.expectEmit(true, true, true, true);
        emit SettlementProposed(txId, Party.Seller, 0.17 ether);
        escrow.proposeSettlement(txId, 0.17 ether);

        (,, amount, settlementBuyer, settlementSeller,,,,, lastFeePaymentTime, status,) = escrow.transactions(txId);

        assertEq(amount, 0.5 ether, "Amount should not change");
        assertEq(uint256(status), uint256(Status.WaitingSettlementBuyer), "Status should be WaitingSettlementBuyer");
        assertEq(settlementBuyer, 0.15 ether, "settlementBuyer should not change");
        assertEq(settlementSeller, 0.17 ether, "settlementSeller is stored incorrectly");
        assertEq(lastFeePaymentTime, block.timestamp, "lastFeePaymentTime is stored incorrectly");
    }

    function test_proposeSettlement_buyerFirst() public {
        // Check that the data is stored correctly when buyer starts settlement
        uint256 deadline = block.timestamp + txTimeout;
        uint256 txId;

        vm.prank(buyer);
        escrow.createNativeTransaction{value: txValue}(deadline, txUri, payable(seller));

        vm.prank(buyer);
        vm.expectEmit(true, true, true, true);
        emit SettlementProposed(txId, Party.Buyer, 0.2 ether);
        escrow.proposeSettlement(txId, 0.2 ether);

        (,, uint256 amount, uint256 settlementBuyer, uint256 settlementSeller,,,,, uint256 lastFeePaymentTime, Status status,) = escrow.transactions(txId);

        assertEq(amount, 0.5 ether, "Amount should not change");
        assertEq(uint256(status), uint256(Status.WaitingSettlementSeller), "Status should be WaitingSettlementSeller");
        assertEq(settlementBuyer, 0.2 ether, "settlementBuyer is stored incorrectly");
        assertEq(settlementSeller, 0, "settlementSeller should be 0");
        assertEq(lastFeePaymentTime, block.timestamp, "lastFeePaymentTime is stored incorrectly");
    }

    function test_proposeSettlement_checkStatus() public {
        uint256 deadline = block.timestamp + txTimeout;
        uint256 txId;
        vm.prank(buyer);
        escrow.createNativeTransaction{value: txValue}(deadline, txUri, payable(seller));

        vm.warp(deadline);                       

        vm.expectRevert(IEscrow.TransactionExpired.selector);
        vm.prank(buyer);
        escrow.proposeSettlement(txId, 0.2 ether);

        // Create another tx to check the last require.
        deadline = block.timestamp + txTimeout;
        txId = 1;
        vm.prank(buyer);
        escrow.createNativeTransaction{value: txValue}(deadline, txUri, payable(seller));

        vm.prank(buyer);
        escrow.pay(txId, txValue);

        vm.expectRevert(IEscrow.TransactionEscalatedForArbitration.selector);
        vm.prank(seller);
        escrow.proposeSettlement(txId, 0.2 ether);
    }

    function test_acceptSettlement() public {
        uint256 deadline = block.timestamp + txTimeout;
        uint256 txId;
        vm.prank(buyer);
        escrow.createNativeTransaction{value: txValue}(deadline, txUri, payable(seller));

        vm.expectRevert(IEscrow.NoSettlementProposedOrTransactionMovedOnAcceptSettlement.selector);
        vm.prank(buyer);
        escrow.acceptSettlement(txId);

        vm.prank(buyer);
        escrow.proposeSettlement(txId, 0.2 ether);
        
        vm.expectRevert(IEscrow.SellerOnly.selector);
        vm.prank(buyer);
        escrow.acceptSettlement(txId);

        vm.prank(seller);
        escrow.proposeSettlement(txId, 0.27 ether);

        vm.expectRevert(IEscrow.BuyerOnly.selector);
        vm.prank(seller);
        escrow.acceptSettlement(txId);        

        vm.prank(buyer);
        vm.expectEmit(true, true, true, true);
        emit TransactionResolved(txId, Resolution.SettlementReached);
        escrow.acceptSettlement(txId);

        (,, uint256 amount, uint256 settlementBuyer, uint256 settlementSeller,,,,,, Status status,) = escrow.transactions(txId);

        assertEq(amount, 0, "Amount should be 0");
        assertEq(uint256(status), uint256(Status.TransactionResolved), "Should be resolved");
        assertEq(settlementBuyer, 0, "settlementSeller should be 0");
        assertEq(settlementSeller, 0, "settlementSeller should be 0");

        assertEq(address(escrow).balance, 0, "Balance of the contract should be 0");
        assertEq(buyer.balance, 9.73 ether, "Wrong balance of the buyer");
        assertEq(seller.balance, 0.27 ether, "Wrong balance of the seller");

        // Check that can't accept once resolved
        vm.expectRevert(IEscrow.NoSettlementProposedOrTransactionMovedOnAcceptSettlement.selector);
        vm.prank(buyer);
        escrow.acceptSettlement(txId);
    }

    function test_acceptSettlementERC20() public {
        uint256 deadline = block.timestamp + txTimeout;
        uint256 txId;
        vm.prank(buyer);
        escrow.createERC20Transaction(txValue, escrowToken, deadline, txUri, payable(seller));

        vm.prank(buyer);
        escrow.proposeSettlement(txId, 0.2 ether);

        vm.prank(seller);
        escrow.acceptSettlement(txId);       

        assertEq(escrowToken.balanceOf(address(escrow)), 0, "Escrow should have 0 balance");
        assertEq(escrowToken.balanceOf(buyer), 0.8 ether, "Wrong token balance of the buyer");
        assertEq(escrowToken.balanceOf(seller), 0.2 ether, "Wrong token balance of the seller");  
    }

    function test_payArbitrationFeeByBuyer() public {
        uint256 deadline = block.timestamp + txTimeout;
        uint256 txId;

        vm.prank(buyer);
        escrow.createNativeTransaction{value: txValue}(deadline, txUri, payable(seller));

        vm.expectRevert(IEscrow.NoSettlementProposedOrTransactionMovedOnPayFeeBuyer.selector);
        vm.prank(buyer);
        escrow.payArbitrationFeeByBuyer{value: arbitrationCost}(txId);

        vm.prank(seller);
        escrow.proposeSettlement(txId, 0.2 ether);

        vm.deal(seller, 1 ether);
        vm.expectRevert(IEscrow.BuyerOnly.selector);
        vm.prank(seller);
        escrow.payArbitrationFeeByBuyer{value: arbitrationCost}(txId);

        vm.expectRevert(IEscrow.BuyerFeeNotCoverArbitrationCosts.selector);
        vm.prank(buyer);
        escrow.payArbitrationFeeByBuyer{value: arbitrationCost - 1}(txId);

        vm.prank(buyer);
        vm.expectEmit(true, true, true, true);
        emit HasToPayFee(txId, Party.Seller);
        escrow.payArbitrationFeeByBuyer{value: arbitrationCost}(txId);

        (,,,,,,, uint256 buyerFee, uint256 sellerFee, uint256 lastFeePaymentTime, Status status,) = escrow.transactions(txId);

        assertEq(uint256(status), uint256(Status.WaitingSeller), "Should be WaitingSeller");
        assertEq(buyerFee, 0.03 ether, "buyerFee should be equal to arbitration cost");
        assertEq(sellerFee, 0, "sellerFee should be 0");
        assertEq(lastFeePaymentTime, block.timestamp, "lastFeePaymentTime is stored incorrectly");

        assertEq(address(escrow).balance, 0.53 ether, "Balance of the contract is incorrect");
        assertEq(buyer.balance, 9.47 ether, "Wrong balance of the buyer");
        assertEq(seller.balance, 1 ether, "Wrong balance of the seller");

        // Check that can't pay a 2nd time
        vm.expectRevert(IEscrow.NoSettlementProposedOrTransactionMovedOnPayFeeBuyer.selector);
        vm.prank(buyer);
        escrow.payArbitrationFeeByBuyer{value: arbitrationCost}(txId);
    }

    function test_payArbitrationFeeByBuyer_checkTimeout() public {
        uint256 deadline = block.timestamp + txTimeout;
        uint256 txId;

        vm.prank(buyer);
        escrow.createNativeTransaction{value: txValue}(deadline, txUri, payable(seller));

        vm.prank(buyer);
        escrow.proposeSettlement(txId, 0.2 ether);

        vm.expectRevert(IEscrow.SettlementPeriodNotOver.selector);
        vm.prank(buyer);
        escrow.payArbitrationFeeByBuyer{value: arbitrationCost}(txId);

        // warp the settlementTimeout to see that the call passes
        vm.warp(block.timestamp + settlementTimeout);

        vm.prank(buyer);
        vm.expectEmit(true, true, true, true);
        emit HasToPayFee(txId, Party.Seller);
        escrow.payArbitrationFeeByBuyer{value: arbitrationCost}(txId);
    }

    function test_payArbitrationFeeBySeller() public {
        uint256 deadline = block.timestamp + txTimeout;
        uint256 txId;
        vm.deal(seller, 1 ether);

        vm.prank(buyer);
        escrow.createNativeTransaction{value: txValue}(deadline, txUri, payable(seller));

        vm.expectRevert(IEscrow.NoSettlementProposedOrTransactionMovedOnPayFeeSeller.selector);
        vm.prank(seller);
        escrow.payArbitrationFeeBySeller{value: arbitrationCost}(txId);

        vm.prank(buyer);
        escrow.proposeSettlement(txId, 0.2 ether);

        vm.expectRevert(IEscrow.SellerOnly.selector);
        vm.prank(buyer);
        escrow.payArbitrationFeeBySeller{value: arbitrationCost}(txId);

        vm.expectRevert(IEscrow.SellerFeeNotCoverArbitrationCosts.selector);
        vm.prank(seller);
        escrow.payArbitrationFeeBySeller{value: arbitrationCost - 1}(txId);

        vm.prank(seller);
        vm.expectEmit(true, true, true, true);
        emit HasToPayFee(txId, Party.Buyer);
        escrow.payArbitrationFeeBySeller{value: arbitrationCost}(txId);

        (,,,,,,, uint256 buyerFee, uint256 sellerFee, uint256 lastFeePaymentTime, Status status,) = escrow.transactions(txId);

        assertEq(uint256(status), uint256(Status.WaitingBuyer), "Should be WaitingBuyer");
        assertEq(buyerFee, 0, "buyerFee should be 0");
        assertEq(sellerFee, 0.03 ether, "sellerFee should be equal to arbitration cost");
        
        assertEq(lastFeePaymentTime, block.timestamp, "lastFeePaymentTime is stored incorrectly");

        assertEq(address(escrow).balance, 0.53 ether, "Balance of the contract is incorrect");
        assertEq(buyer.balance, 9.5 ether, "Wrong balance of the buyer");
        assertEq(seller.balance, 0.97 ether, "Wrong balance of the seller");

        // Check that can't pay a 2nd time
        vm.expectRevert(IEscrow.NoSettlementProposedOrTransactionMovedOnPayFeeSeller.selector);
        vm.prank(seller);
        escrow.payArbitrationFeeBySeller{value: arbitrationCost}(txId);
    }

    function test_payArbitrationFeeBySeller_checkTimeout() public {
        uint256 deadline = block.timestamp + txTimeout;
        uint256 txId;
        vm.deal(seller, 1 ether);

        vm.prank(buyer);
        escrow.createNativeTransaction{value: txValue}(deadline, txUri, payable(seller));

        vm.prank(seller);
        escrow.proposeSettlement(txId, 0.2 ether);

        vm.expectRevert(IEscrow.SettlementPeriodNotOver.selector);
        vm.prank(seller);
        escrow.payArbitrationFeeBySeller{value: arbitrationCost}(txId);

        // warp the settlementTimeout to see that the call passes
        vm.warp(block.timestamp + settlementTimeout);

        vm.prank(seller);
        vm.expectEmit(true, true, true, true);
        emit HasToPayFee(txId, Party.Buyer);
        escrow.payArbitrationFeeBySeller{value: arbitrationCost}(txId);
    }

    function test_timeOutByBuyerNative_settlement() public {
        uint256 deadline = block.timestamp + txTimeout;
        uint256 txId;

        vm.prank(buyer);
        escrow.createNativeTransaction{value: txValue}(deadline, txUri, payable(seller));

        vm.expectRevert(IEscrow.NotWaitingForSellerFees.selector);
        vm.prank(buyer);
        escrow.timeOutByBuyer(txId);

        vm.prank(seller);
        escrow.proposeSettlement(txId, 0.2 ether);
        vm.prank(buyer);
        escrow.proposeSettlement(txId, 0.1 ether);

        // Let the seller fund to check reimbursement
        vm.deal(seller, 1 ether);
        vm.prank(seller);
        escrow.payArbitrationFeeBySeller{value: arbitrationCost}(txId);

        // Increase arbitration cost so the seller is not fully funded.
        arbitrator.setArbitrationPrice(0.04 ether);

        vm.prank(buyer);
        vm.expectEmit(true, true, true, true);
        emit HasToPayFee(txId, Party.Seller);
        escrow.payArbitrationFeeByBuyer{value: 0.04 ether}(txId);

        vm.expectRevert(IEscrow.TimeoutNotPassed.selector);
        vm.prank(buyer);
        escrow.timeOutByBuyer(txId);

        vm.warp(block.timestamp + feeTimeout);

        // Validate the state before the execution
        (,, uint256 amount, uint256 settlementBuyer, uint256 settlementSeller,,, uint256 buyerFee, uint256 sellerFee,, Status status,) = escrow.transactions(txId);
        assertEq(uint256(status), uint256(Status.WaitingSeller), "Should be WaitingSeller");
        assertEq(amount, 0.5 ether, "Wrong escrow amount");
        assertEq(buyerFee, 0.04 ether, "buyerFee should be equal to new arbitration cost");
        assertEq(sellerFee, 0.03 ether, "sellerFee should be equal to old arbitration cost");
        assertEq(settlementBuyer, 0.1 ether, "settlementBuyer is incorrect");
        assertEq(settlementSeller, 0.2 ether, "settlementSeller is incorrect");

        assertEq(address(escrow).balance, 0.57 ether, "Balance of the contract is incorrect");
        assertEq(buyer.balance, 9.46 ether, "Wrong balance of the buyer");
        assertEq(seller.balance, 0.97 ether, "Wrong balance of the seller");

        vm.prank(buyer);
        vm.expectEmit(true, true, true, true);
        emit TransactionResolved(txId, Resolution.TimeoutByBuyer);
        escrow.timeOutByBuyer(txId);

        (,, amount, settlementBuyer, settlementSeller,,, buyerFee, sellerFee,, status,) = escrow.transactions(txId);
        assertEq(uint256(status), uint256(Status.TransactionResolved), "Should be TransactionResolved");
        assertEq(amount, 0, "Amount should be 0");
        assertEq(buyerFee, 0, "buyerFee should be 0");
        assertEq(sellerFee, 0, "sellerFee should be 0");
        assertEq(settlementBuyer, 0, "settlementBuyer should be 0");
        assertEq(settlementSeller, 0, "settlementSeller should be 0");

        assertEq(address(escrow).balance, 0, "Balance of the contract should be 0");
        assertEq(buyer.balance, 9.9 ether, "Buyer has incorrect balance");
        assertEq(seller.balance, 1.1 ether, "Seller has incorrect balance");
    }

    function test_timeOutByBuyerNative_noSettlement() public {
        uint256 deadline = block.timestamp + txTimeout;
        uint256 txId;

        vm.prank(buyer);
        escrow.createNativeTransaction{value: txValue}(deadline, txUri, payable(seller));

        vm.prank(seller);
        escrow.proposeSettlement(txId, 0.2 ether);

        vm.prank(buyer);
        escrow.payArbitrationFeeByBuyer{value: arbitrationCost}(txId);

        vm.warp(block.timestamp + feeTimeout);

        vm.prank(buyer);
        escrow.timeOutByBuyer(txId);

        (,, uint256 amount,,,,, uint256 buyerFee, uint256 sellerFee,, Status status,) = escrow.transactions(txId);
        assertEq(uint256(status), uint256(Status.TransactionResolved), "Should be TransactionResolved");
        assertEq(amount, 0, "Amount should be 0");
        assertEq(buyerFee, 0, "buyerFee should be 0");
        assertEq(sellerFee, 0, "sellerFee should be 0");

        assertEq(address(escrow).balance, 0, "Balance of the contract should be 0");
        assertEq(buyer.balance, 10 ether, "Buyer has incorrect balance");
        assertEq(seller.balance, 0, "Seller has incorrect balance");
    }

    function test_timeOutByBuyerERC20_noSettlement() public {
        uint256 deadline = block.timestamp + txTimeout;
        uint256 txId;

        vm.prank(buyer);
        escrow.createERC20Transaction(txValue, escrowToken, deadline, txUri, payable(seller));

        vm.prank(seller);
        escrow.proposeSettlement(txId, 0.2 ether);

        vm.prank(buyer);
        escrow.payArbitrationFeeByBuyer{value: arbitrationCost}(txId);

        vm.warp(block.timestamp + feeTimeout);

        vm.prank(buyer);
        escrow.timeOutByBuyer(txId);

        assertEq(escrowToken.balanceOf(address(escrow)), 0, "Wrong token balance of the escrow");
        assertEq(escrowToken.balanceOf(buyer), 1 ether, "Wrong token balance of buyer");
        assertEq(escrowToken.balanceOf(seller), 0, "Seller balance should be 0");  
    }

    function test_timeOutBySellerNative_settlement() public {
        uint256 deadline = block.timestamp + txTimeout;
        uint256 txId;
        vm.deal(seller, 1 ether);

        vm.prank(buyer);
        escrow.createNativeTransaction{value: txValue}(deadline, txUri, payable(seller));

        vm.expectRevert(IEscrow.NotWaitingForBuyerFees.selector);
        vm.prank(seller);
        escrow.timeOutBySeller(txId);

        vm.prank(buyer);
        escrow.proposeSettlement(txId, 0.1 ether);
        vm.prank(seller);
        escrow.proposeSettlement(txId, 0.2 ether);

        // Let the buyer fund to check reimbursement       
        vm.prank(buyer);
        escrow.payArbitrationFeeByBuyer{value: arbitrationCost}(txId);

        // Increase arbitration cost so the seller is not fully funded.
        arbitrator.setArbitrationPrice(0.04 ether);

        vm.prank(seller);
        vm.expectEmit(true, true, true, true);
        emit HasToPayFee(txId, Party.Buyer);
        escrow.payArbitrationFeeBySeller{value: 0.04 ether}(txId);

        vm.expectRevert(IEscrow.TimeoutNotPassed.selector);
        vm.prank(seller);
        escrow.timeOutBySeller(txId);

        vm.warp(block.timestamp + feeTimeout);

        vm.prank(seller);
        vm.expectEmit(true, true, true, true);
        emit TransactionResolved(txId, Resolution.TimeoutBySeller);
        escrow.timeOutBySeller(txId);

        (,, uint256 amount, uint256 settlementBuyer, uint256 settlementSeller,,, uint256 buyerFee, uint256 sellerFee,, Status status,) = escrow.transactions(txId);
        assertEq(uint256(status), uint256(Status.TransactionResolved), "Should be TransactionResolved");
        assertEq(amount, 0, "Amount should be 0");
        assertEq(buyerFee, 0, "buyerFee should be 0");
        assertEq(sellerFee, 0, "sellerFee should be 0");
        assertEq(settlementBuyer, 0, "settlementBuyer should be 0");
        assertEq(settlementSeller, 0, "settlementSeller should be 0");

        assertEq(address(escrow).balance, 0, "Balance of the contract should be 0");
        assertEq(buyer.balance, 9.8 ether, "Buyer has incorrect balance");
        assertEq(seller.balance, 1.2 ether, "Seller has incorrect balance");
    }

    function test_timeOutBySellerNative_noSettlement() public {
        uint256 deadline = block.timestamp + txTimeout;
        uint256 txId;
        vm.deal(seller, 1 ether);

        vm.prank(buyer);
        escrow.createNativeTransaction{value: txValue}(deadline, txUri, payable(seller));

        vm.prank(buyer);
        escrow.proposeSettlement(txId, 0.1 ether);

        vm.prank(seller);
        escrow.payArbitrationFeeBySeller{value: arbitrationCost}(txId);

        vm.warp(block.timestamp + feeTimeout);

        vm.prank(seller);
        escrow.timeOutBySeller(txId);

        (,, uint256 amount,,,,, uint256 buyerFee, uint256 sellerFee,, Status status,) = escrow.transactions(txId);
        assertEq(uint256(status), uint256(Status.TransactionResolved), "Should be TransactionResolved");
        assertEq(amount, 0, "Amount should be 0");
        assertEq(buyerFee, 0, "buyerFee should be 0");
        assertEq(sellerFee, 0, "sellerFee should be 0");

        assertEq(address(escrow).balance, 0, "Balance of the contract should be 0");
        assertEq(buyer.balance, 9.5 ether, "Buyer has incorrect balance");
        assertEq(seller.balance, 1.5 ether, "Seller has incorrect balance");
    }

    function test_timeOutBySellerERC20_noSettlement() public {
        uint256 deadline = block.timestamp + txTimeout;
        uint256 txId;
        vm.deal(seller, 1 ether);

        vm.prank(buyer);
        escrow.createERC20Transaction(txValue, escrowToken, deadline, txUri, payable(seller));

        vm.prank(buyer);
        escrow.proposeSettlement(txId, 0.2 ether);

        vm.prank(seller);
        escrow.payArbitrationFeeBySeller{value: arbitrationCost}(txId);

        vm.warp(block.timestamp + feeTimeout);

        vm.prank(seller);
        escrow.timeOutBySeller(txId);

        assertEq(escrowToken.balanceOf(address(escrow)), 0, "Wrong token balance of the escrow");
        assertEq(escrowToken.balanceOf(buyer), 0.5 ether, "Wrong token balance of buyer");
        assertEq(escrowToken.balanceOf(seller), 0.5 ether, "Wrong token balance of seller");  
    }

    // ******************************* //
    // *         Arbitration         * //
    // ******************************* //

    function test_raiseDispute() public {
        uint256 deadline = block.timestamp + txTimeout;
        uint256 txId = 2;
        uint256 disputeId;
        uint256 templateId;

        // Create several tx so index is not default.
        vm.prank(buyer);
        escrow.createNativeTransaction{value: txValue}(deadline, txUri, payable(seller));
        vm.prank(buyer);
        escrow.createNativeTransaction{value: txValue}(deadline, txUri, payable(seller));
        vm.prank(buyer);
        escrow.createNativeTransaction{value: txValue}(deadline, txUri, payable(seller));

        vm.prank(buyer);
        escrow.proposeSettlement(txId, 0.1 ether);

        vm.deal(seller, 1 ether);
        vm.prank(seller);
        escrow.payArbitrationFeeBySeller{value: 1 ether}(txId); // Overpay to check reimbursement

        vm.prank(buyer);
        vm.expectEmit(true, true, true, true);
        emit DisputeCreation(disputeId, IArbitrableV2(address(escrow)));
        vm.expectEmit(true, true, true, true);
        emit DisputeRequest(arbitrator, disputeId, txId, templateId, "");
        escrow.payArbitrationFeeByBuyer{value: 1 ether}(txId);

        (,,,,,,, uint256 buyerFee, uint256 sellerFee,, Status status,) = escrow.transactions(txId);
        assertEq(uint256(status), uint256(Status.DisputeCreated), "Should be DisputeCreated");
        assertEq(buyerFee, 0.03 ether, "buyerFee should be equal to arbitration cost");
        assertEq(sellerFee, 0.03 ether, "sellerFee should be equal to arbitration cost");

        // Balances are a bit skewed because buyer created two more txs.
        assertEq(address(escrow).balance, 1.53 ether, "Balance of the contract is incorrect");
        assertEq(buyer.balance, 8.47 ether, "Wrong balance of the buyer");
        assertEq(seller.balance, 0.97 ether, "Wrong balance of the seller");
        assertEq(address(arbitrator).balance, 0.03 ether, "Wrong balance of the arbitrator");
        assertEq(escrow.disputeIDtoTransactionID(0), 2, "Wrong txId");

        (IArbitrableV2 arbitrated , uint256 choices, uint256 fees, uint256 ruling, bool ruled) = arbitrator.disputes(disputeId);
        assertEq(address(arbitrated), address(escrow), "Incorrect arbitrable");
        assertEq(choices, escrow.AMOUNT_OF_CHOICES(), "Wrong amount of choices");
        assertEq(fees, 0.03 ether, "Incorrect fees");
        assertEq(ruling, 0, "No ruling given yet");
        assertEq(ruled, false, "Not yet ruled");
    }

    function test_ruleNative() public {
        uint256 deadline = block.timestamp + txTimeout;
        uint256 txId;
        uint256 disputeId;

        vm.prank(buyer);
        escrow.createNativeTransaction{value: txValue}(deadline, txUri, payable(seller));

        vm.prank(buyer);
        escrow.proposeSettlement(txId, 0.1 ether);

        vm.deal(seller, 1 ether);
        vm.prank(seller);
        escrow.payArbitrationFeeBySeller{value: arbitrationCost}(txId);

        vm.prank(buyer);
        escrow.payArbitrationFeeByBuyer{value: arbitrationCost}(txId);

        vm.expectRevert(IEscrow.ArbitratorOnly.selector);
        vm.prank(other);
        escrow.rule(disputeId, 0);

        vm.expectRevert(IEscrow.InvalidRuling.selector);
        vm.prank(address(arbitrator));
        escrow.rule(disputeId, 3);

        vm.expectEmit(true, true, true, true);
        emit Ruling(IArbitrableV2(address(escrow)), disputeId, 0);
        vm.expectEmit(true, true, true, true);
        emit Ruling(IArbitratorV2(address(arbitrator)), disputeId, 0);
        vm.expectEmit(true, true, true, true);
        emit TransactionResolved(txId, Resolution.RulingEnforced);
        arbitrator.giveRuling(disputeId, 0); // Check 0 ruling

        assertEq(address(escrow).balance, 0, "Balance of the should be 0");
        // The balance is equally split. 0.03 eth is taken by the arbitrator
        // 0.03 + 0.5 is split equally, so 0.265 eth per party
        assertEq(buyer.balance, 9.735 ether, "Wrong balance of the buyer");
        assertEq(seller.balance, 1.235 ether, "Wrong balance of the seller");
        assertEq(address(arbitrator).balance, 0.03 ether, "Wrong balance of the arbitrator");

        (,,, uint256 ruling, bool ruled) = arbitrator.disputes(disputeId);
        assertEq(ruling, 0, "Incorrect ruling");
        assertEq(ruled, true, "Should be ruled");

        vm.expectRevert(IEscrow.DisputeAlreadyResolved.selector);
        vm.prank(address(arbitrator));
        escrow.rule(disputeId, 0);
    }

    function test_ruleERC20() public {
        uint256 deadline = block.timestamp + txTimeout;
        uint256 txId;
        uint256 disputeId;

        vm.prank(buyer);
        escrow.createERC20Transaction(txValue, escrowToken, deadline, txUri, payable(seller));

        vm.prank(buyer);
        escrow.proposeSettlement(txId, 0.1 ether);

        vm.deal(seller, 1 ether);
        vm.prank(seller);
        escrow.payArbitrationFeeBySeller{value: arbitrationCost}(txId);

        vm.prank(buyer);
        escrow.payArbitrationFeeByBuyer{value: arbitrationCost}(txId);

        arbitrator.giveRuling(disputeId, 0);

        assertEq(address(escrow).balance, 0, "Balance of the should be 0");
        assertEq(buyer.balance, 9.985 ether, "Wrong balance of the buyer");
        assertEq(seller.balance, 0.985 ether, "Wrong balance of the seller");
        assertEq(address(arbitrator).balance, 0.03 ether, "Wrong balance of the arbitrator");

        assertEq(escrowToken.balanceOf(address(escrow)), 0, "Wrong token balance of the escrow");
        assertEq(escrowToken.balanceOf(buyer), 0.75 ether, "Wrong token balance of buyer");
        assertEq(escrowToken.balanceOf(seller), 0.25 ether, "Wrong token balance of seller");
    }

    function test_ruleERC20_buyer_settlement() public {
        uint256 deadline = block.timestamp + txTimeout;
        uint256 txId;
        uint256 disputeId;

        vm.prank(buyer);
        escrow.createERC20Transaction(txValue, escrowToken, deadline, txUri, payable(seller));

        vm.prank(buyer);
        escrow.proposeSettlement(txId, 0.1 ether);
        vm.prank(seller);
        escrow.proposeSettlement(txId, 0.2 ether);

        vm.prank(buyer);
        escrow.payArbitrationFeeByBuyer{value: arbitrationCost}(txId);

        vm.deal(seller, 1 ether);
        vm.prank(seller);
        escrow.payArbitrationFeeBySeller{value: arbitrationCost}(txId);

        arbitrator.giveRuling(disputeId, 1);
        assertEq(address(escrow).balance, 0, "Balance of the should be 0");
        assertEq(buyer.balance, 10 ether, "Wrong balance of the buyer");
        assertEq(seller.balance, 0.97 ether, "Wrong balance of the seller");
        assertEq(address(arbitrator).balance, 0.03 ether, "Wrong balance of the arbitrator");

        assertEq(escrowToken.balanceOf(address(escrow)), 0, "Wrong token balance of the escrow");
        assertEq(escrowToken.balanceOf(buyer), 0.9 ether, "Wrong token balance of buyer");
        assertEq(escrowToken.balanceOf(seller), 0.1 ether, "Wrong token balance of seller");
    }

    function test_ruleERC20_seller_settlement() public {
        uint256 deadline = block.timestamp + txTimeout;
        uint256 txId;
        uint256 disputeId;

        vm.prank(buyer);
        escrow.createERC20Transaction(txValue, escrowToken, deadline, txUri, payable(seller));

        vm.prank(seller);
        escrow.proposeSettlement(txId, 0.1 ether);
        vm.prank(buyer);
        escrow.proposeSettlement(txId, 0.2 ether);
        
        vm.deal(seller, 1 ether);
        vm.prank(seller);
        escrow.payArbitrationFeeBySeller{value: arbitrationCost}(txId);

        vm.prank(buyer);
        escrow.payArbitrationFeeByBuyer{value: arbitrationCost}(txId);

        arbitrator.giveRuling(disputeId, 1);
        assertEq(address(escrow).balance, 0, "Balance of the should be 0");
        assertEq(buyer.balance, 10 ether, "Wrong balance of the buyer");
        assertEq(seller.balance, 0.97 ether, "Wrong balance of the seller");
        assertEq(address(arbitrator).balance, 0.03 ether, "Wrong balance of the arbitrator");

        assertEq(escrowToken.balanceOf(address(escrow)), 0, "Wrong token balance of the escrow");
        assertEq(escrowToken.balanceOf(buyer), 0.8 ether, "Wrong token balance of buyer");
        assertEq(escrowToken.balanceOf(seller), 0.2 ether, "Wrong token balance of seller");
    }
}
