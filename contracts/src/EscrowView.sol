// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;

import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {IERC20Metadata} from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import {EscrowUniversal, Transaction, NATIVE, Party, Status, IERC20} from "./EscrowUniversal.sol";

contract EscrowView {
    EscrowUniversal public immutable escrow;

    constructor(address _escrow) {
        escrow = EscrowUniversal(_escrow);
    }

    /// @notice Get the payout messages for a transaction once a dispute is created.
    /// @notice The amounts pre-dispute are imprecise as the arbitration fees are not paid yet by either or both parties.
    function getPayoutMessages(
        uint256 _transactionID
    ) external view returns (string memory noWinner, string memory buyerWins, string memory sellerWins) {
        (, , uint256 amount, , , , , , , , , IERC20 token) = escrow.transactions(_transactionID);

        (uint256 noWinnerPayout, uint256 noWinnerPayoutToken, , ) = escrow.getPayouts(_transactionID, Party.None);
        (, , uint256 buyerWinsCost, uint256 buyerWinsCostToken) = escrow.getPayouts(_transactionID, Party.Buyer);
        (, , uint256 sellerWinsCost, uint256 sellerWinsCostToken) = escrow.getPayouts(_transactionID, Party.Seller);

        string memory amountStr = formatEth(amount);
        string memory amountTokenStr = formatToken(amount, address(token));

        if (token == NATIVE) {
            noWinner = string.concat(
                "Buyer and Seller get ",
                formatEth(noWinnerPayout),
                " back and pay half of the arbitration fees each."
            );
            buyerWins = string.concat(
                "Buyer pays ",
                formatEth(buyerWinsCost),
                " instead of ",
                amountStr,
                ", Seller pays for arbitration."
            );
            sellerWins = string.concat(
                "Buyer pays ",
                formatEth(sellerWinsCost),
                " instead of ",
                amountStr,
                ", Buyer pays for arbitration."
            );
        } else {
            noWinner = string.concat(
                "Buyer and Seller get ",
                formatToken(noWinnerPayoutToken, address(token)),
                " back and pay half of the arbitration fees each."
            );
            buyerWins = string.concat(
                "Buyer pays ",
                formatToken(buyerWinsCostToken, address(token)),
                " instead of ",
                amountTokenStr,
                ", Seller pays for arbitration."
            );
            sellerWins = string.concat(
                "Buyer pays ",
                formatToken(sellerWinsCostToken, address(token)),
                " instead of ",
                amountTokenStr,
                ", Buyer pays for arbitration."
            );
        }
    }

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

    function formatToken(uint256 _amountWei, address _token) public view returns (string memory) {
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
