// SPDX-License-Identifier: MIT

/// @authors: [@unknownunknown1, @jaybuidl]
/// @reviewers: []
/// @auditors: []
/// @bounties: []

pragma solidity 0.8.24;

import "./EscrowUniversal.sol";

/// @title EscrowCustomBuyer.
/// @dev Version of Escrow that allows to specify a buyer when transaction is created.
contract EscrowCustomBuyer is EscrowUniversal {
    using SafeERC20 for IERC20;

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
    ) EscrowUniversal(
        _arbitrator,
        _arbitratorExtraData,
        _templateData,
        _templateDataMappings,
        _templateRegistry,
        _feeTimeout,
        _settlementTimeout
    ) {}

    /// @dev Create a native transaction with custom buyer.
    /// @param _deadline Time after which a party can automatically execute the arbitrable transaction.
    /// @param _transactionUri The IPFS Uri Hash of the transaction.
    /// @param _buyer Buyer's address.
    /// @param _seller The recipient of the transaction.
    /// @return transactionID The index of the transaction.
    function createNativeTransactionCustomBuyer(
        uint256 _deadline,
        string memory _transactionUri,
        address payable _buyer,
        address payable _seller
    ) external payable shouldNotExceedCap(NATIVE, msg.value) returns (uint256 transactionID) {
        Transaction storage transaction = transactions.push();
        transaction.buyer = _buyer;
        transaction.seller = _seller;
        /// Note that in this version of the contract the amount is provided by the caller, not by the buyer.
        transaction.amount = msg.value;
        transaction.token = NATIVE;
        transaction.deadline = _deadline;

        transactionID = transactions.length - 1;

        emit NativeTransactionCreated(
            transactionID,
            _transactionUri,
            _buyer,
            _seller,
            msg.value,
            transaction.deadline
        );
    }
    
    /// @dev Create an ERC20 transaction with custom buyer address.
    /// @param _amount The amount of tokens in this transaction.
    /// @param _token The ERC20 token contract.
    /// @param _deadline Time after which a party can automatically execute the arbitrable transaction.
    /// @param _transactionUri The IPFS Uri Hash of the transaction.
    /// @param _buyer Buyer's address.
    /// @param _seller The recipient of the transaction.
    /// @return transactionID The index of the transaction.
    function createERC20TransactionCustomBuyer(
        uint256 _amount,
        IERC20 _token,
        uint256 _deadline,
        string memory _transactionUri,
        address payable _buyer,
        address payable _seller
    ) external shouldNotExceedCap(_token, _amount) returns (uint256 transactionID) {
        // Transfers token from sender wallet to contract. Note that in this version of the contract the amount is provided by the caller, not by the buyer.
        if (!_token.safeTransferFrom(msg.sender, address(this), _amount)) revert TokenTransferFailed();
        Transaction storage transaction = transactions.push();
        transaction.buyer = _buyer;
        transaction.seller = _seller;
        transaction.amount = _amount;
        transaction.token = _token;
        transaction.deadline = _deadline;

        transactionID = transactions.length - 1;

        emit ERC20TransactionCreated(
            transactionID,
            _transactionUri,
            _buyer,
            _seller,
            _token,
            _amount,
            transaction.deadline
        );
    }
}
