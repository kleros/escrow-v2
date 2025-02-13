// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {IERC20} from "../libraries/SafeERC20.sol";

IERC20 constant NATIVE = IERC20(address(0));

enum Party {
    None,
    Buyer, // Makes a purchase in native currency or ERC20 token.
    Seller // Provides a good or service in exchange for native currency or ERC20 token.
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
    Status status;
    IERC20 token; // Token to pay the seller with.
}
