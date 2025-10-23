// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import {IERC20, Party, Status, Resolution, Transaction} from "./Types.sol";

interface IEscrow {
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

    /// @dev Emitted when a transaction paid in native currency is created.
    /// @param _transactionID The index of the transaction.
    /// @param _transactionUri The IPFS Uri Hash of the transaction.
    /// @param _buyer The address of the buyer.
    /// @param _seller The address of the seller.
    /// @param _amount The initial amount in the transaction.
    /// @param _deadline The deadline of the transaction.
    event NativeTransactionCreated(
        uint256 indexed _transactionID,
        string _transactionUri,
        address indexed _buyer,
        address indexed _seller,
        uint256 _amount,
        uint256 _deadline
    );

    /// @dev Emitted when a transaction paid in ERC20 token is created.
    /// @param _transactionID The index of the transaction.
    /// @param _transactionUri The IPFS Uri Hash of the transaction.
    /// @param _buyer The address of the buyer.
    /// @param _seller The address of the seller.
    /// @param _token The token address.
    /// @param _amount The initial amount in the transaction.
    /// @param _deadline The deadline of the transaction.
    event ERC20TransactionCreated(
        uint256 indexed _transactionID,
        string _transactionUri,
        address indexed _buyer,
        address indexed _seller,
        IERC20 _token,
        uint256 _amount,
        uint256 _deadline
    );

    /// @dev To be emitted when a transaction is resolved, either by its
    ///      execution, a timeout or because a ruling was enforced.
    /// @param _transactionID The ID of the respective transaction.
    /// @param _resolution Short description of what caused the transaction to be solved.
    event TransactionResolved(uint256 indexed _transactionID, Resolution indexed _resolution);

    // ************************************* //
    // *         State Modifiers           * //
    // ************************************* //

    /// @dev Create a transaction.
    /// @param _deadline Time after which a party can automatically execute the arbitrable transaction.
    /// @param _transactionUri The IPFS Uri Hash of the transaction.
    /// @param _buyer Party that pays for the transaction. Note that msg.sender can provide finds on their behalf.
    /// @param _seller The recipient of the transaction.
    /// @return transactionID The index of the transaction.
    function createNativeTransaction(
        uint256 _deadline,
        string memory _transactionUri,
        address payable _buyer,
        address payable _seller
    ) external payable returns (uint256 transactionID);

    /// @dev Create a transaction.
    /// @param _amount The amount of tokens in this transaction.
    /// @param _token The ERC20 token contract.
    /// @param _deadline Time after which a party can automatically execute the arbitrable transaction.
    /// @param _transactionUri The IPFS Uri Hash of the transaction.
    /// @param _buyer Party that pays for the transaction. Note that msg.sender can provide finds on their behalf.
    /// @param _seller The recipient of the transaction.
    /// @return transactionID The index of the transaction.
    function createERC20Transaction(
        uint256 _amount,
        IERC20 _token,
        uint256 _deadline,
        string memory _transactionUri,
        address payable _buyer,
        address payable _seller
    ) external returns (uint256 transactionID);

    /// @dev Pay seller. To be called if the good or service is provided.
    /// @param _transactionID The index of the transaction.
    /// @param _amount Amount to pay in wei.
    function pay(uint256 _transactionID, uint256 _amount) external;

    /// @dev Reimburse buyer. To be called if the good or service can't be fully provided.
    /// @param _transactionID The index of the transaction.
    /// @param _amountReimbursed Amount to reimburse in wei.
    function reimburse(uint256 _transactionID, uint256 _amountReimbursed) external;

    /// @dev Transfer the transaction's amount to the seller if the timeout has passed.
    /// @param _transactionID The index of the transaction.
    function executeTransaction(uint256 _transactionID) external;

    ///  @dev Propose a settlement as a compromise from the initial terms to the other party.
    ///  Note that a party can only propose a settlement again after the other party has
    ///  done so as well to prevent front running/griefing issues.
    ///  @param _transactionID The index of the transaction.
    ///  @param _amount The settlement amount.
    function proposeSettlement(uint256 _transactionID, uint256 _amount) external;

    /// @dev Accept a settlement proposed by the other party.
    /// @param _transactionID The index of the transaction.
    function acceptSettlement(uint256 _transactionID) external;

    /// @dev Pay the arbitration fee to raise a dispute. To be called by the buyer.
    /// Note that it can only be called after settlement proposition.
    /// Also note that the arbitrator can have createDispute throw, which will make
    ///      this function throw and therefore lead to a party being timed-out.
    ///      This is not a vulnerability as the arbitrator can rule in favor of one party anyway.
    /// @param _transactionID The index of the transaction.
    function payArbitrationFeeByBuyer(uint256 _transactionID) external payable;

    /// @dev Pay the arbitration fee to raise a dispute. To be called by the seller.
    /// Note that this function mirrors payArbitrationFeeByBuyer.
    /// @param _transactionID The index of the transaction.
    function payArbitrationFeeBySeller(uint256 _transactionID) external payable;

    /// @dev Reimburse buyer if seller fails to pay the fee.
    /// @param _transactionID The index of the transaction.
    function timeOutByBuyer(uint256 _transactionID) external;

    /// @dev Pay seller if buyer fails to pay the fee.
    /// @param _transactionID The index of the transaction.
    function timeOutBySeller(uint256 _transactionID) external;

    // ************************************* //
    // *           Public Views            * //
    // ************************************* //

    /// @dev Getter to know the count of transactions.
    /// @return The count of transactions.
    function getTransactionCount() external view returns (uint256);

    /// @dev Getter for transaction details.
    /// @param _transactionID The index of the transaction.
    /// @return buyer The buyer address.
    /// @return seller The seller address.
    /// @return amount The escrowed amount.
    /// @return settlementBuyer Settlement amount proposed by the buyer.
    /// @return settlementSeller Settlement amount proposed by the seller.
    /// @return deadline The deadline timestamp.
    /// @return disputeID The dispute ID if any.
    /// @return buyerFee Total fees paid by the buyer.
    /// @return sellerFee Total fees paid by the seller.
    /// @return lastFeePaymentTime Timestamp of last fee payment or settlement proposal.
    /// @return status Current status.
    /// @return token Payment token (zero address for native).
    function transactions(uint256 _transactionID)
        external
        view
        returns (
            address payable buyer,
            address payable seller,
            uint256 amount,
            uint256 settlementBuyer,
            uint256 settlementSeller,
            uint256 deadline,
            uint256 disputeID,
            uint256 buyerFee,
            uint256 sellerFee,
            uint256 lastFeePaymentTime,
            Status status,
            IERC20 token
        );

    /// @dev Getter to map a dispute ID to its transaction ID.
    /// @param _disputeID The dispute identifier from the arbitrator.
    /// @return The corresponding transaction ID.
    function disputeIDtoTransactionID(uint256 _disputeID) external view returns (uint256);

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
    error NotSupported();
    error TokenTransferFailed();
    error AmountExceedsCap();
}
