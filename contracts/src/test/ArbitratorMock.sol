// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;

import {IArbitrableV2, IArbitratorV2} from "@kleros/kleros-v2-contracts/arbitration/interfaces/IArbitrableV2.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @title ArbitratorMock
/// @dev Mock arbitrator for Foundry tests.
contract ArbitratorMock is IArbitratorV2 {
    address public owner = msg.sender;
    uint256 public arbitrationPrice;

    struct Dispute {
        IArbitrableV2 arbitrated; // The contract requiring arbitration.
        uint256 choices; // The amount of possible choices.
        uint256 fees; // The total amount of fees collected by the arbitrator.
        uint256 ruling; // The current ruling.
        bool ruled; // True if the dispute was ruled.
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Can only be called by the owner.");
        _;
    }

    Dispute[] public disputes;

    /// @dev Constructor. Set the initial arbitration price.
    /// @param _arbitrationPrice Amount to be paid for arbitration.
    constructor(uint256 _arbitrationPrice) {
        arbitrationPrice = _arbitrationPrice;
    }

    /// @inheritdoc IArbitratorV2
    function arbitrationCost(bytes memory) public view override returns (uint256 fee) {
        return arbitrationPrice;
    }

    /// @inheritdoc IArbitratorV2
    function arbitrationCost(
        bytes calldata /*_extraData*/,
        IERC20 /*_feeToken*/
    ) public pure override returns (uint256 /*cost*/) {
        revert("Not supported");
    }

    function setArbitrationPrice(uint256 _arbitrationPrice) external onlyOwner {
        arbitrationPrice = _arbitrationPrice;
    }

    /// @inheritdoc IArbitratorV2
    function createDispute(
        uint256 _choices,
        bytes memory _extraData
    ) public payable override returns (uint256 disputeID) {
        uint256 arbitrationFee = arbitrationCost(_extraData);
        require(msg.value >= arbitrationFee, "Value is less than required arbitration fee.");
        disputes.push(
            Dispute({
                arbitrated: IArbitrableV2(msg.sender),
                choices: _choices,
                fees: msg.value,
                ruling: 0,
                ruled: false
            })
        ); // Create the dispute and return its number.
        disputeID = disputes.length - 1;
        emit DisputeCreation(disputeID, IArbitrableV2(msg.sender));
    }

    /// @inheritdoc IArbitratorV2
    function createDispute(
        uint256 /*_choices*/,
        bytes calldata /*_extraData*/,
        IERC20 /*_feeToken*/,
        uint256 /*_feeAmount*/
    ) external pure override returns (uint256) {
        revert("Not supported");
    }

    /// @dev Give a ruling.
    /// @param _disputeID ID of the dispute to rule.
    /// @param _ruling Ruling given by the arbitrator.
    function giveRuling(uint256 _disputeID, uint256 _ruling) external onlyOwner {
        Dispute storage dispute = disputes[_disputeID];
        require(_ruling <= dispute.choices, "Invalid ruling.");
        require(!dispute.ruled, "The dispute must be waiting for arbitration.");

        dispute.ruling = _ruling;
        dispute.ruled = true;

        emit Ruling(dispute.arbitrated, _disputeID, _ruling);

        payable(msg.sender).send(dispute.fees); // Avoid blocking.
        dispute.arbitrated.rule(_disputeID, _ruling);
    }

    function currentRuling(
        uint256 /*_disputeID*/
    ) public pure returns (uint256 /*ruling*/, bool /*tied*/, bool /*overridden*/) {
        revert("Not supported");
    }
}