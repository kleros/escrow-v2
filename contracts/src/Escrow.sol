// SPDX-License-Identifier: MIT

/// @authors: [@unknownunknown1, @jaybuidl]
/// @reviewers: []
/// @auditors: []
/// @bounties: []

pragma solidity 0.8.18;

import {IArbitrableV2, IArbitratorV2} from "@kleros/kleros-v2-contracts/arbitration/interfaces/IArbitrableV2.sol";
import "@kleros/kleros-v2-contracts/arbitration/interfaces/IDisputeTemplateRegistry.sol";
import "./interfaces/IEscrow.sol";

/// @title Escrow for a sale paid in ETH and without platform fees.
/// @dev Adapted from MultipleArbitrableTransaction contract: https://github.com/kleros/kleros-interaction/blob/master/contracts/standard/arbitration/MultipleArbitrableTransaction.sol
contract Escrow is IEscrow, IArbitrableV2 {
    // ************************************* //
    // *             Storage               * //
    // ************************************* //

    uint256 public constant AMOUNT_OF_CHOICES = 2;
    address public governor;
    IArbitratorV2 public arbitrator; // Address of the arbitrator contract.
    bytes public arbitratorExtraData; // Extra data to set up the arbitration.
    IDisputeTemplateRegistry public templateRegistry; // The dispute template registry.
    uint256 public templateId; // The current dispute template identifier.
    uint256 public feeTimeout; // Time in seconds a party can take to pay arbitration fees before being considered unresponsive and lose the dispute.
    uint256 public settlementTimeout; // Time in seconds a party can take to accept or propose a settlement before being considered unresponsive.
    Transaction[] public transactions; // List of all created transactions.
    mapping(uint256 => uint256) public disputeIDtoTransactionID; // Naps dispute ID to tx ID.

    // ************************************* //
    // *        Function Modifiers         * //
    // ************************************* //

    modifier onlyByGovernor() {
        if (governor != msg.sender) revert GovernorOnly();
        _;
    }

    // ************************************* //
    // *            Constructor            * //
    // ************************************* //

    /// @dev Constructor.
    /// @param _arbitrator The arbitrator of the contract.
    /// @param _arbitratorExtraData Extra data for the arbitrator.
    /// @param _templateData The dispute template data.
    /// @param _templateDataMappings The dispute template data mappings.
    /// @param _templateRegistry The dispute template registry.
    /// @param _feeTimeout Arbitration fee timeout for the parties.
    /// @param _settlementTimeout Settlement timeout for the parties.
    constructor(
        IArbitratorV2 _arbitrator,
        bytes memory _arbitratorExtraData,
        string memory _templateData,
        string memory _templateDataMappings,
        IDisputeTemplateRegistry _templateRegistry,
        uint256 _feeTimeout,
        uint256 _settlementTimeout
    ) {
        governor = msg.sender;
        arbitrator = _arbitrator;
        arbitratorExtraData = _arbitratorExtraData;
        templateRegistry = _templateRegistry;
        feeTimeout = _feeTimeout;
        settlementTimeout = _settlementTimeout;
        templateId = templateRegistry.setDisputeTemplate("", _templateData, _templateDataMappings);

        emit ParameterUpdated(_feeTimeout, _settlementTimeout, _arbitratorExtraData);
    }

    // ************************************* //
    // *             Governance            * //
    // ************************************* //

    function changeGovernor(address _governor) external onlyByGovernor {
        governor = _governor;
    }

    function changeArbitrator(IArbitratorV2 _arbitrator) external onlyByGovernor {
        arbitrator = _arbitrator;
    }

    function changeArbitratorExtraData(bytes calldata _arbitratorExtraData) external onlyByGovernor {
        arbitratorExtraData = _arbitratorExtraData;
        emit ParameterUpdated(feeTimeout, settlementTimeout, _arbitratorExtraData);
    }

    function changeTemplateRegistry(IDisputeTemplateRegistry _templateRegistry) external onlyByGovernor {
        templateRegistry = _templateRegistry;
    }

    function changeDisputeTemplate(
        string memory _templateData,
        string memory _templateDataMappings
    ) external onlyByGovernor {
        templateId = templateRegistry.setDisputeTemplate("", _templateData, _templateDataMappings);
    }

    function changeFeeTimeout(uint256 _feeTimeout) external onlyByGovernor {
        feeTimeout = _feeTimeout;
        emit ParameterUpdated(_feeTimeout, settlementTimeout, arbitratorExtraData);
    }

    function changeSettlementTimeout(uint256 _settlementTimeout) external onlyByGovernor {
        settlementTimeout = _settlementTimeout;
        emit ParameterUpdated(feeTimeout, _settlementTimeout, arbitratorExtraData);
    }

    // ************************************* //
    // *         State Modifiers           * //
    // ************************************* //

    /// @inheritdoc IEscrow
    function createNativeTransaction(
        uint256 _deadline,
        string memory _transactionUri,
        address payable _seller,
        string memory _templateData,
        string memory _templateDataMappings
    ) external payable override returns (uint256 transactionID) {
        Transaction storage transaction = transactions.push();
        transaction.buyer = payable(msg.sender);
        transaction.seller = _seller;
        transaction.amount = msg.value;
        transaction.deadline = _deadline;
        transaction.templateData = _templateData;
        transaction.templateDataMappings = _templateDataMappings;

        transactionID = transactions.length - 1;

        emit NativeTransactionCreated(
            transactionID,
            _transactionUri,
            msg.sender,
            _seller,
            msg.value,
            transaction.deadline
        );
    }

    /// @inheritdoc IEscrow
    function createERC20Transaction(
        uint256,
        IERC20,
        uint256,
        string memory,
        address payable,
        string memory,
        string memory
    ) external pure override returns (uint256) {
        revert NotSupported();
    }

    /// @inheritdoc IEscrow
    function pay(uint256 _transactionID, uint256 _amount) external override {
        Transaction storage transaction = transactions[_transactionID];
        if (transaction.buyer != msg.sender) revert BuyerOnly();
        if (transaction.status != Status.NoDispute) revert TransactionDisputed();
        if (_amount > transaction.amount) revert MaximumPaymentAmountExceeded();

        transaction.seller.send(_amount); // It is the user responsibility to accept ETH.
        transaction.amount -= _amount;

        emit Payment(_transactionID, _amount, msg.sender);
    }

    /// @inheritdoc IEscrow
    function reimburse(uint256 _transactionID, uint256 _amountReimbursed) external override {
        Transaction storage transaction = transactions[_transactionID];
        if (transaction.seller != msg.sender) revert SellerOnly();
        if (transaction.status != Status.NoDispute) revert TransactionDisputed();
        if (_amountReimbursed > transaction.amount) revert MaximumPaymentAmountExceeded();

        transaction.buyer.send(_amountReimbursed); // It is the user responsibility to accept ETH.
        transaction.amount -= _amountReimbursed;

        emit Payment(_transactionID, _amountReimbursed, msg.sender);
    }

    /// @inheritdoc IEscrow
    function executeTransaction(uint256 _transactionID) external override {
        Transaction storage transaction = transactions[_transactionID];
        if (block.timestamp < transaction.deadline) revert DeadlineNotPassed();
        if (transaction.status != Status.NoDispute) revert TransactionDisputed();

        transaction.seller.send(transaction.amount); // It is the user responsibility to accept ETH.
        transaction.amount = 0;
        transaction.status = Status.TransactionResolved;

        emit TransactionResolved(_transactionID, Resolution.TransactionExecuted);
    }

    /// @inheritdoc IEscrow
    function proposeSettlement(uint256 _transactionID, uint256 _amount) external override {
        Transaction storage transaction = transactions[_transactionID];
        if (transaction.status == Status.NoDispute && block.timestamp >= transaction.deadline)
            revert TransactionExpired();
        if (transaction.status >= Status.WaitingBuyer) revert TransactionEscalatedForArbitration();
        if (_amount > transaction.amount) revert MaximumPaymentAmountExceeded();

        Party party;
        transaction.lastFeePaymentTime = block.timestamp;
        if (transaction.status == Status.WaitingSettlementBuyer) {
            if (msg.sender != transaction.buyer) revert BuyerOnly();
            transaction.settlementBuyer = _amount;
            transaction.status = Status.WaitingSettlementSeller;
            party = Party.Buyer;
        } else if (transaction.status == Status.WaitingSettlementSeller) {
            if (msg.sender != transaction.seller) revert SellerOnly();
            transaction.settlementSeller = _amount;
            transaction.status = Status.WaitingSettlementBuyer;
            party = Party.Seller;
        } else {
            if (msg.sender == transaction.buyer) {
                transaction.settlementBuyer = _amount;
                transaction.status = Status.WaitingSettlementSeller;
                party = Party.Buyer;
            } else if (msg.sender == transaction.seller) {
                transaction.settlementSeller = _amount;
                transaction.status = Status.WaitingSettlementBuyer;
                party = Party.Seller;
            } else revert BuyerOrSellerOnly();
        }
        emit SettlementProposed(_transactionID, party, _amount);
    }

    /// @inheritdoc IEscrow
    function acceptSettlement(uint256 _transactionID) external override {
        Transaction storage transaction = transactions[_transactionID];
        uint256 settlementAmount;
        if (transaction.status == Status.WaitingSettlementBuyer) {
            if (msg.sender != transaction.buyer) revert BuyerOnly();
            settlementAmount = transaction.settlementSeller;
        } else if (transaction.status == Status.WaitingSettlementSeller) {
            if (msg.sender != transaction.seller) revert SellerOnly();
            settlementAmount = transaction.settlementBuyer;
        } else revert NoSettlementProposedOrTransactionMovedOnAcceptSettlement();

        uint256 remainingAmount = transaction.amount - settlementAmount;

        transaction.amount = 0;
        transaction.settlementBuyer = 0;
        transaction.settlementSeller = 0;
        transaction.status = Status.TransactionResolved;

        // It is the users' responsibility to accept ETH.
        transaction.buyer.send(remainingAmount);
        transaction.seller.send(settlementAmount);

        emit TransactionResolved(_transactionID, Resolution.SettlementReached);
    }

    /// @inheritdoc IEscrow
    function payArbitrationFeeByBuyer(uint256 _transactionID) external payable override {
        Transaction storage transaction = transactions[_transactionID];
        if (
            transaction.status != Status.WaitingSettlementBuyer &&
            transaction.status != Status.WaitingSettlementSeller &&
            transaction.status != Status.WaitingBuyer
        ) revert NoSettlementProposedOrTransactionMovedOnPayFeeBuyer();

        // Allow the other party enough time to respond to a settlement before allowing the proposer to raise a dispute.
        if (
            transaction.status == Status.WaitingSettlementSeller &&
            block.timestamp - transaction.lastFeePaymentTime < settlementTimeout
        ) revert SettlementPeriodNotOver();

        if (msg.sender != transaction.buyer) revert BuyerOnly();

        transaction.buyerFee += msg.value;
        uint256 arbitrationCost = arbitrator.arbitrationCost(arbitratorExtraData);
        if (transaction.buyerFee < arbitrationCost) revert BuyerFeeNotCoverArbitrationCosts();

        transaction.lastFeePaymentTime = block.timestamp;

        if (transaction.sellerFee < arbitrationCost) {
            // The seller still has to pay. This can also happen if he has paid, but arbitrationCost has increased.
            transaction.status = Status.WaitingSeller;
            emit HasToPayFee(_transactionID, Party.Seller);
        } else {
            // The seller has also paid the fee. We create the dispute.
            raiseDispute(_transactionID, arbitrationCost);
        }
    }

    /// @inheritdoc IEscrow
    function payArbitrationFeeBySeller(uint256 _transactionID) external payable override {
        Transaction storage transaction = transactions[_transactionID];
        if (
            transaction.status != Status.WaitingSettlementBuyer &&
            transaction.status != Status.WaitingSettlementSeller &&
            transaction.status != Status.WaitingSeller
        ) revert NoSettlementProposedOrTransactionMovedOnPayFeeSeller();

        // Allow the other party enough time to respond to a settlement before allowing the proposer to raise a dispute.
        if (
            transaction.status == Status.WaitingSettlementBuyer &&
            block.timestamp - transaction.lastFeePaymentTime < settlementTimeout
        ) revert SettlementPeriodNotOver();

        if (msg.sender != transaction.seller) revert SellerOnly();

        transaction.sellerFee += msg.value;
        uint256 arbitrationCost = arbitrator.arbitrationCost(arbitratorExtraData);
        if (transaction.sellerFee < arbitrationCost) revert SellerFeeNotCoverArbitrationCosts();

        transaction.lastFeePaymentTime = block.timestamp;

        if (transaction.buyerFee < arbitrationCost) {
            // The buyer still has to pay. This can also happen if he has paid, but arbitrationCost has increased.
            transaction.status = Status.WaitingBuyer;
            emit HasToPayFee(_transactionID, Party.Buyer);
        } else {
            // The buyer has also paid the fee. We create the dispute.
            raiseDispute(_transactionID, arbitrationCost);
        }
    }

    /// @inheritdoc IEscrow
    function timeOutByBuyer(uint256 _transactionID) external override {
        Transaction storage transaction = transactions[_transactionID];
        if (transaction.status != Status.WaitingSeller) revert NotWaitingForSellerFees();
        if (block.timestamp - transaction.lastFeePaymentTime < feeTimeout) revert TimeoutNotPassed();

        uint256 amount = transaction.sellerFee;
        transaction.sellerFee = 0;

        executeRuling(_transactionID, uint256(Party.Buyer));

        if (amount != 0) {
            transaction.seller.send(amount); // It is the user responsibility to accept ETH.
        }

        emit TransactionResolved(_transactionID, Resolution.TimeoutByBuyer);
    }

    /// @inheritdoc IEscrow
    function timeOutBySeller(uint256 _transactionID) external override {
        Transaction storage transaction = transactions[_transactionID];
        if (transaction.status != Status.WaitingBuyer) revert NotWaitingForBuyerFees();
        if (block.timestamp - transaction.lastFeePaymentTime < feeTimeout) revert TimeoutNotPassed();

        uint256 amount = transaction.buyerFee;
        transaction.buyerFee = 0;

        executeRuling(_transactionID, uint256(Party.Seller));

        if (amount != 0) {
            transaction.buyer.send(amount); // It is the user responsibility to accept ETH.
        }

        emit TransactionResolved(_transactionID, Resolution.TimeoutBySeller);
    }

    /// @inheritdoc IArbitrableV2
    function rule(uint256 _disputeID, uint256 _ruling) external override {
        if (msg.sender != address(arbitrator)) revert ArbitratorOnly();
        if (_ruling > AMOUNT_OF_CHOICES) revert InvalidRuling();

        uint256 transactionID = disputeIDtoTransactionID[_disputeID];
        Transaction storage transaction = transactions[transactionID];
        if (transaction.status != Status.DisputeCreated) revert DisputeAlreadyResolved();

        emit Ruling(arbitrator, _disputeID, _ruling);
        executeRuling(transactionID, _ruling);
    }

    // ************************************* //
    // *            Internal               * //
    // ************************************* //

    /// @dev Create a dispute.
    /// @param _transactionID The index of the transaction.
    /// @param _arbitrationCost Amount to pay the arbitrator.
    function raiseDispute(uint256 _transactionID, uint256 _arbitrationCost) internal {
        Transaction storage transaction = transactions[_transactionID];
        transaction.status = Status.DisputeCreated;
        transaction.disputeID = arbitrator.createDispute{value: _arbitrationCost}(
            AMOUNT_OF_CHOICES,
            arbitratorExtraData
        );
        disputeIDtoTransactionID[transaction.disputeID] = _transactionID;
        emit DisputeRequest(arbitrator, transaction.disputeID, _transactionID, templateId, "");

        // Refund buyer if he overpaid.
        if (transaction.buyerFee > _arbitrationCost) {
            uint256 extraFeeBuyer = transaction.buyerFee - _arbitrationCost;
            transaction.buyerFee = _arbitrationCost;
            transaction.buyer.send(extraFeeBuyer); // It is the user responsibility to accept ETH.
        }

        // Refund seller if he overpaid.
        if (transaction.sellerFee > _arbitrationCost) {
            uint256 extraFeeSeller = transaction.sellerFee - _arbitrationCost;
            transaction.sellerFee = _arbitrationCost;
            transaction.seller.send(extraFeeSeller); // It is the user responsibility to accept ETH.
        }
    }

    /// @dev Execute a ruling of a dispute. It reimburses the fee to the winning party.
    /// @param _transactionID The index of the transaction.
    /// @param _ruling Ruling given by the arbitrator. 1 : Reimburse the seller. 2 : Pay the buyer.
    function executeRuling(uint256 _transactionID, uint256 _ruling) internal {
        Transaction storage transaction = transactions[_transactionID];
        uint256 amount = transaction.amount;
        uint256 settlementBuyer = transaction.settlementBuyer;
        uint256 settlementSeller = transaction.settlementSeller;
        uint256 buyerFee = transaction.buyerFee;
        uint256 sellerFee = transaction.sellerFee;

        transaction.amount = 0;
        transaction.settlementBuyer = 0;
        transaction.settlementSeller = 0;
        transaction.buyerFee = 0;
        transaction.sellerFee = 0;
        transaction.status = Status.TransactionResolved;

        // Give the arbitration fee back.
        // Note that we use send to prevent a party from blocking the execution.
        if (_ruling == uint256(Party.Buyer)) {
            // If there was a settlement amount proposed
            // we use that to make the partial payment and refund the rest.
            if (settlementBuyer != 0) {
                transaction.buyer.send(buyerFee + amount - settlementBuyer);
                transaction.seller.send(settlementBuyer);
            } else {
                transaction.buyer.send(buyerFee + amount);
            }
        } else if (_ruling == uint256(Party.Seller)) {
            // If there was a settlement amount proposed
            // we use that to make the partial payment and refund the rest to buyer.
            if (settlementSeller != 0) {
                transaction.buyer.send(amount - settlementSeller);
                transaction.seller.send(sellerFee + settlementSeller);
            } else {
                transaction.seller.send(sellerFee + amount);
            }
        } else {
            uint256 splitAmount = (buyerFee + amount) / 2;
            transaction.buyer.send(splitAmount);
            transaction.seller.send(splitAmount);
        }

        emit TransactionResolved(_transactionID, Resolution.RulingEnforced);
    }

    // ************************************* //
    // *           Public Views            * //
    // ************************************* //

    /// @inheritdoc IEscrow
    function getTransactionCount() external view override returns (uint256) {
        return transactions.length;
    }
}
