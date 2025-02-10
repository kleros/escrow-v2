// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import {IDisputeTemplateRegistry} from "@kleros/kleros-v2-contracts/arbitration/interfaces/IDisputeTemplateRegistry.sol";

/// @title Dispute Template Registry
/// @dev A contract to maintain a registry of dispute templates.
contract DisputeTemplateRegistryMock is IDisputeTemplateRegistry {
    uint256 public templates;

    function setDisputeTemplate(
        string memory _templateTag,
        string memory _templateData,
        string memory _templateDataMappings
    ) external returns (uint256 templateId) {
        templateId = templates++;
        emit DisputeTemplate(templateId, _templateTag, _templateData, _templateDataMappings);
    }
}