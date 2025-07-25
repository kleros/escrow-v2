// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Test} from "forge-std/Test.sol";
import {console} from "forge-std/console.sol"; // Import the console for logging
import {EscrowCustomBuyer} from "../src/EscrowCustomBuyer.sol";
import {ArbitratorMock} from "../src/test/ArbitratorMock.sol";
import {DisputeTemplateRegistryMock} from "../src/test/DisputeTemplateRegistryMock.sol";
import {TestERC20} from "../src/test/TestERC20.sol";
import "../src/interfaces/Types.sol";

contract EscrowCustomBuyerTest is Test {

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

    EscrowCustomBuyer escrow;
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
        escrow = new EscrowCustomBuyer(
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

    function test_createNativeTransactionCustomBuyer() public {
        uint256 deadline = block.timestamp + txTimeout;
        uint256 txId;
        vm.prank(buyer);
        vm.expectEmit(true, true, true, true);
        emit NativeTransactionCreated(txId, txUri, other, seller, 0.5 ether, deadline);
        escrow.createNativeTransactionCustomBuyer{value: txValue}(deadline, txUri, payable(other), payable(seller));

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

        assertEq(escrowBuyer, other, "Wrong custom buyer address");
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
        assertEq(buyer.balance, 9.5 ether, "Wrong balance of the buyer"); // tx creator
        assertEq(seller.balance, 0, "Seller balance should be 0");
        assertEq(other.balance, 0, "Balance of custom buyer should be 0"); // custom buyer did not have balance of his own
    }

    function test_createERC20TransactionCustomBuyer() public {
        uint256 deadline = block.timestamp + txTimeout;
        uint256 txId;
        vm.prank(buyer);
        vm.expectEmit(true, true, true, true);
        // Pay a bit less to differ between tests
        emit ERC20TransactionCreated(txId, txUri, other, seller, escrowToken, 0.4 ether, deadline);
        escrow.createERC20TransactionCustomBuyer(0.4 ether, escrowToken, deadline, txUri, payable(other), payable(seller));

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

        assertEq(escrowBuyer, other, "Wrong custom buyer address");
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
        assertEq(escrowToken.balanceOf(buyer), 0.6 ether, "Wrong token balance of buyer"); // tx creator
        assertEq(escrowToken.balanceOf(seller), 0, "Balance of seller should be 0");
        assertEq(escrowToken.balanceOf(other), 0, "Balance of custom buyer should be 0"); // custom buyer did not have balance of his own
    }
}
