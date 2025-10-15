// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {IERC20Metadata} from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import {EscrowUniversal} from "./EscrowUniversal.sol";
import {Transaction, NATIVE, Party, Status, IERC20} from "./interfaces/Types.sol";

/// @title EscrowView
/// @notice A view contract for EscrowUniversal to facilitate the display of ruling options.
contract EscrowView {
    EscrowUniversal public immutable escrow;

    /// @notice Initialize the view contract with the address of the EscrowUniversal contract.
    /// @param _escrow The address of the EscrowUniversal contract.
    constructor(address _escrow) {
        escrow = EscrowUniversal(_escrow);
    }

    /// @notice Get the payout messages for a transaction *once* a dispute is created.
    /// @notice The amounts are exclusive of arbitration fees for clarity.
    /// @notice The amounts pre-dispute are imprecise as the arbitration fees are not paid yet by either or both parties.
    /// @return noWinner The payout message for the case where nobody wins.
    /// @return buyerWins The payout message for the case where the buyer wins.
    /// @return sellerWins The payout message for the case where the seller wins.
    function getPayoutMessages(
        uint256 _transactionID
    ) external view returns (string memory noWinner, string memory buyerWins, string memory sellerWins) {
        (
            ,
            ,
            uint256 amount,
            ,
            ,
            ,
            ,
            uint256 buyerFee,
            uint256 sellerFee,
            ,
            ,
            IERC20 token
        ) = escrow.transactions(_transactionID);

        (uint256 noWinnerPayout, uint256 noWinnerPayoutToken, , ) = escrow.getPayouts(_transactionID, Party.None);
        (, , uint256 buyerWinsCost, uint256 buyerWinsCostToken) = escrow.getPayouts(_transactionID, Party.Buyer);
        (, , uint256 sellerWinsCost, uint256 sellerWinsCostToken) = escrow.getPayouts(_transactionID, Party.Seller);

        if (token == NATIVE) {
            string memory amountStr = formatEth(amount);
            noWinner = string.concat(
                "Buyer and Seller get ",
                formatEth(noWinnerPayout - (buyerFee / 2)),
                " back and half of the arbitration fees."
            );
            string memory insteadStr = buyerWinsCost != amount ? string.concat(" instead of ", amountStr) : "";
            buyerWins = string.concat(
                "Buyer pays ",
                formatEth(buyerWinsCost), // Exclusive of arbitration fees
                insteadStr,
                ", gets the arbitration fees back."
            );
            insteadStr = sellerWinsCost - sellerFee != amount ? string.concat(" instead of ", amountStr) : "";
            sellerWins = string.concat(
                "Buyer pays ",
                formatEth(sellerWinsCost - sellerFee), // Including of arbitration fees, deduct them
                insteadStr,
                ", Seller gets the arbitration fees back."
            );
        } else {
            string memory amountTokenStr = formatToken(amount, address(token));
            noWinner = string.concat(
                "Buyer and Seller get ",
                formatToken(noWinnerPayoutToken, address(token)),
                " back and half of the arbitration fees."
            );
            string memory insteadStr = buyerWinsCost != amount ? string.concat(" instead of ", amountTokenStr) : "";
            buyerWins = string.concat(
                "Buyer pays ",
                formatToken(buyerWinsCostToken, address(token)),
                insteadStr,
                ", gets the arbitration fees back."
            );
            insteadStr = sellerWinsCost - sellerFee != amount ? string.concat(" instead of ", amountTokenStr) : "";
            sellerWins = string.concat(
                "Buyer pays ",
                formatToken(sellerWinsCostToken, address(token)),
                insteadStr,
                ", Seller gets the arbitration fees back."
            );
        }
    }

    /// @notice Format an amount in ETH to 3 decimal places.
    /// @param _amountWei The amount in wei.
    /// @return The formatted amount.
    function formatEth(uint256 _amountWei) public pure returns (string memory) {
        uint256 ethWhole = _amountWei / 1 ether;
        uint256 ethFraction = (_amountWei % 1 ether) / 1e15; // Get the first 3 decimal digits

        // Convert the whole and fractional parts to strings
        string memory ethWholeStr = Strings.toString(ethWhole);

        // If the fractional part is zero, return only the whole part
        if (ethFraction == 0) {
            return string.concat(ethWholeStr, " ETH");
        }

        // Convert the fractional part to string with leading zeros if necessary
        string memory ethFractionStr = Strings.toString(ethFraction);

        // Pad the fractional part with leading zeros to ensure three digits
        while (bytes(ethFractionStr).length < 3) {
            ethFractionStr = string.concat("0", ethFractionStr);
        }

        // Remove trailing zeros from the fractional part
        bytes memory fractionBytes = bytes(ethFractionStr);
        uint256 fractionLength = fractionBytes.length;
        while (fractionLength > 0 && fractionBytes[fractionLength - 1] == "0") {
            fractionLength--;
        }

        if (fractionLength == 0) {
            return ethWholeStr;
        } else {
            bytes memory fractionTrimmed = new bytes(fractionLength);
            for (uint256 i = 0; i < fractionLength; i++) {
                fractionTrimmed[i] = fractionBytes[i];
            }
            return string.concat(ethWholeStr, ".", string(fractionTrimmed), " ETH");
        }
    }

    /// @notice Format an amount in a token to 3 decimal places.
    /// @param _amountWei The amount in wei.
    /// @param _token The address of the token.
    /// @return The formatted amount.
    function formatToken(uint256 _amountWei, address _token) public view returns (string memory) {
        require(_token != address(0), "Invalid token address");
        IERC20Metadata token = IERC20Metadata(_token);
        uint8 decimals = token.decimals();
        string memory symbol = token.symbol();

        uint256 tenToDecimals = uint256(10) ** uint256(decimals);
        uint256 tokenWhole = _amountWei / tenToDecimals;

        uint256 tokenFraction;
        uint8 fractionDigits;

        if (decimals >= 3) {
            uint256 divider = uint256(10) ** uint256(decimals - 3);
            tokenFraction = (_amountWei % tenToDecimals) / divider;
            fractionDigits = 3;
        } else {
            tokenFraction = _amountWei % tenToDecimals;
            fractionDigits = decimals;
        }

        string memory tokenWholeStr = Strings.toString(tokenWhole);

        if (tokenFraction == 0) {
            return string.concat(tokenWholeStr, " ", symbol);
        }

        string memory tokenFractionStr = Strings.toString(tokenFraction);

        while (bytes(tokenFractionStr).length < fractionDigits) {
            tokenFractionStr = string.concat("0", tokenFractionStr);
        }

        bytes memory fractionBytes = bytes(tokenFractionStr);
        uint256 fractionLength = fractionBytes.length;
        while (fractionLength > 0 && fractionBytes[fractionLength - 1] == bytes1("0")) {
            fractionLength--;
        }

        if (fractionLength == 0) {
            return string.concat(tokenWholeStr, " ", symbol);
        } else {
            bytes memory fractionTrimmed = new bytes(fractionLength);
            for (uint256 i = 0; i < fractionLength; i++) {
                fractionTrimmed[i] = fractionBytes[i];
            }
            return string.concat(tokenWholeStr, ".", string(fractionTrimmed), " ", symbol);
        }
    }
}
