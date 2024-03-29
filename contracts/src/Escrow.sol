// SPDX-License-Identifier: MIT

/// @authors: [@unknownunknown1, @fnanni-0, @shalzz, @jaybuidl]
/// @reviewers: []
/// @auditors: []
/// @bounties: []

pragma solidity 0.8.18;

import {IArbitrableV2, IArbitratorV2} from "@kleros/kleros-v2-contracts/arbitration/interfaces/IArbitrableV2.sol";
import "@kleros/kleros-v2-contracts/arbitration/interfaces/IDisputeTemplateRegistry.sol";

/// @title Escrow for a sale paid in ETH and no fees.
/// @dev MultipleArbitrableTransaction contract that is compatible with V2.
///      Adapted from https://github.com/kleros/kleros-interaction/blob/master/contracts/standard/arbitration/MultipleArbitrableTransaction.sol
contract Escrow is IArbitrableV2 {
    // ************************************* //
    // *         Enums / Structs           * //
    // ************************************* //

    enum Party {
        None,
        Buyer, // Makes a purchase in ETH.
        Seller // Provides a good or service in exchange for ETH.
    }

    enum Status {
        NoDispute,
        WaitingSettlementBuyer,
        WaitingSettlementSeller,
        WaitingBuyer,
        WaitingSeller,
        DisputeCreated,
        TransactionResolved
    }

    enum Resolution {
        TransactionExecuted,
        TimeoutByBuyer,
        TimeoutBySeller,
        RulingEnforced,
        SettlementReached
    }

    struct Transaction {
        address payable buyer;
        address payable seller;
        uint256 amount;
        uint256 settlementBuyer; // Settlement amount proposed by the buyer.
        uint256 settlementSeller; // Settlement amount proposed by the seller.
        uint256 deadline; // Timestamp at which the transaction can be automatically executed if not disputed.
        uint256 disputeID; // If dispute exists, the ID of the dispute.
        uint256 buyerFee; // Total fees paid by the buyer.
        uint256 sellerFee; // Total fees paid by the seller.
        uint256 lastFeePaymentTime; // Last time the dispute fees were paid by either party or settlement proposed.
        string templateData;
        string templateDataMappings;
        Status status;
    }

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
    // *              Events               * //
    // ************************************* //

    /// @dev To be emitted when Escrow parameters are updated.
    event ParameterUpdated(uint256 _feeTimeout, uint256 _settlementTimeout, bytes _arbitratorExtraData);

    /// @dev To be emitted when a party pays or reimburses the other.
    /// @param _transactionID The index of the transaction.
    /// @param _amount The amount paid.
    /// @param _party The party that paid.
    event Payment(uint256 indexed _transactionID, uint256 _amount, address _party);

    /// @dev Indicate that a party has to pay a fee or would otherwise be considered as losing.
    /// @param _transactionID The index of the transaction.
    /// @param _party The party who has to pay.
    event HasToPayFee(uint256 indexed _transactionID, Party _party);

    /// @dev Emitted when a party proposes a settlement.
    /// @param _transactionID The index of the transaction.
    /// @param _party The party that proposed a settlement.
    /// @param _amount The amount proposed.
    event SettlementProposed(uint256 indexed _transactionID, Party _party, uint256 _amount);

    /// @dev Emitted when a transaction is created.
    /// @param _transactionID The index of the transaction.
    /// @param _transactionUri The IPFS Uri Hash of the transaction.
    /// @param _buyer The address of the buyer.
    /// @param _seller The address of the seller.
    /// @param _amount The initial amount in the transaction.
    /// @param _asset The asset used ("native" for native chain token).
    /// @param _deadline The deadline of the transaction.
    event TransactionCreated(
        uint256 indexed _transactionID,
        string _transactionUri,
        address indexed _buyer,
        address indexed _seller,
        uint256 _amount,
        string _asset,
        uint256 _deadline
    );

    /// @dev To be emitted when a transaction is resolved, either by its
    ///      execution, a timeout or because a ruling was enforced.
    /// @param _transactionID The ID of the respective transaction.
    /// @param _resolution Short description of what caused the transaction to be solved.
    event TransactionResolved(uint256 indexed _transactionID, Resolution indexed _resolution);

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

    /// @dev Create a transaction.
    /// @param _timeoutPayment Time after which a party can automatically execute the arbitrable transaction.
    /// @param _transactionUri The IPFS Uri Hash of the transaction.
    /// @param _seller The recipient of the transaction.
    /// @param _templateData The dispute template data.
    /// @param _templateDataMappings The dispute template data mappings.
    /// @return transactionID The index of the transaction.
    function createTransaction(
        uint256 _timeoutPayment,
        string memory _transactionUri,
        address payable _seller,
        string memory _templateData,
        string memory _templateDataMappings
    ) external payable returns (uint256 transactionID) {
        Transaction storage transaction = transactions.push();
        transaction.buyer = payable(msg.sender);
        transaction.seller = _seller;
        transaction.amount = msg.value;
        transaction.deadline = block.timestamp + _timeoutPayment;
        transaction.templateData = _templateData;
        transaction.templateDataMappings = _templateDataMappings;

        transactionID = transactions.length - 1;

        emit TransactionCreated(
            transactionID,
            _transactionUri,
            msg.sender,
            _seller,
            msg.value,
            "native",
            transaction.deadline
        );
    }

    /// @dev Pay seller. To be called if the good or service is provided.
    /// @param _transactionID The index of the transaction.
    /// @param _amount Amount to pay in wei.
    function pay(uint256 _transactionID, uint256 _amount) external {
        Transaction storage transaction = transactions[_transactionID];
        if (transaction.buyer != msg.sender) revert BuyerOnly();
        if (transaction.status != Status.NoDispute) revert TransactionDisputed();
        if (_amount > transaction.amount) revert MaximumPaymentAmountExceeded();

        transaction.seller.send(_amount); // It is the user responsibility to accept ETH.
        transaction.amount -= _amount;

        emit Payment(_transactionID, _amount, msg.sender);
    }

    /// @dev Reimburse buyer. To be called if the good or service can't be fully provided.
    /// @param _transactionID The index of the transaction.
    /// @param _amountReimbursed Amount to reimburse in wei.
    function reimburse(uint256 _transactionID, uint256 _amountReimbursed) external {
        Transaction storage transaction = transactions[_transactionID];
        if (transaction.seller != msg.sender) revert SellerOnly();
        if (transaction.status != Status.NoDispute) revert TransactionDisputed();
        if (_amountReimbursed > transaction.amount) revert MaximumPaymentAmountExceeded();

        transaction.buyer.send(_amountReimbursed); // It is the user responsibility to accept ETH.
        transaction.amount -= _amountReimbursed;

        emit Payment(_transactionID, _amountReimbursed, msg.sender);
    }

    /// @dev Transfer the transaction's amount to the seller if the timeout has passed.
    /// @param _transactionID The index of the transaction.
    function executeTransaction(uint256 _transactionID) external {
        Transaction storage transaction = transactions[_transactionID];
        if (block.timestamp < transaction.deadline) revert DeadlineNotPassed();
        if (transaction.status != Status.NoDispute) revert TransactionDisputed();

        transaction.seller.send(transaction.amount); // It is the user responsibility to accept ETH.
        transaction.amount = 0;
        transaction.status = Status.TransactionResolved;

        emit TransactionResolved(_transactionID, Resolution.TransactionExecuted);
    }

    ///  @dev Propose a settlement as a compromise from the initial terms to the other party.
    ///  Note that a party can only propose a settlement again after the other party has
    ///  done so as well to prevent front running/griefing issues.
    ///  @param _transactionID The index of the transaction.
    ///  @param _amount The settlement amount.
    function proposeSettlement(uint256 _transactionID, uint256 _amount) external {
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

    /// @dev Accept a settlement proposed by the other party.
    /// @param _transactionID The index of the transaction.
    function acceptSettlement(uint256 _transactionID) external {
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

    /// @dev Pay the arbitration fee to raise a dispute. To be called by the buyer.
    /// Note that it can only be called after settlement proposition.
    /// Also note that the arbitrator can have createDispute throw, which will make
    ///      this function throw and therefore lead to a party being timed-out.
    ///      This is not a vulnerability as the arbitrator can rule in favor of one party anyway.
    /// @param _transactionID The index of the transaction.
    function payArbitrationFeeByBuyer(uint256 _transactionID) external payable {
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

    /// @dev Pay the arbitration fee to raise a dispute. To be called by the seller.
    /// Note that this function mirrors payArbitrationFeeByBuyer.
    /// @param _transactionID The index of the transaction.
    function payArbitrationFeeBySeller(uint256 _transactionID) external payable {
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

    /// @dev Reimburse buyer if seller fails to pay the fee.
    /// @param _transactionID The index of the transaction.
    function timeOutByBuyer(uint256 _transactionID) external {
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

    /// @dev Pay seller if buyer fails to pay the fee.
    /// @param _transactionID The index of the transaction.
    function timeOutBySeller(uint256 _transactionID) external {
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

    /// @dev Give a ruling for a dispute. Must be called by the arbitrator to enforce the final ruling.
    ///      The purpose of this function is to ensure that the address calling it has the right to rule on the contract.
    /// @param _disputeID ID of the dispute in the Arbitrator contract.
    /// @param _ruling Ruling given by the arbitrator. Note that 0 is reserved
    /// for "Refuse to arbitrate".
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

    /// @dev Getter to know the count of transactions.
    /// @return The count of transactions.
    function getCountTransactions() external view returns (uint256) {
        return transactions.length;
    }

    // ************************************* //
    // *              Errors               * //
    // ************************************* //

    error GovernorOnly();
    error BuyerOnly();
    error SellerOnly();
    error BuyerOrSellerOnly();
    error ArbitratorOnly();
    error TransactionDisputed();
    error MaximumPaymentAmountExceeded();
    error DeadlineNotPassed();
    error BuyerFeeNotCoverArbitrationCosts();
    error SellerFeeNotCoverArbitrationCosts();
    error NotWaitingForSellerFees();
    error NotWaitingForBuyerFees();
    error TimeoutNotPassed();
    error InvalidRuling();
    error DisputeAlreadyResolved();
    error TransactionExpired();
    error TransactionEscalatedForArbitration();
    error NoSettlementProposedOrTransactionMovedOnAcceptSettlement();
    error NoSettlementProposedOrTransactionMovedOnPayFeeBuyer();
    error NoSettlementProposedOrTransactionMovedOnPayFeeSeller();
    error SettlementPeriodNotOver();
}
