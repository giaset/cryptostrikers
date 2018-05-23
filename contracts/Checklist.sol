pragma solidity ^0.4.24;

import './WorldCupInfo.sol';

contract Checklist is WorldCupInfo {
  struct ChecklistItem {
    uint8 playerId;
    uint16 totalIssuance;
  }

  mapping (uint8 => ChecklistItem[]) public setIdToChecklistItems;

  constructor() public {
    // Base Set
    setIdToChecklistItems[0].push(ChecklistItem(0, 8000));
    setIdToChecklistItems[0].push(ChecklistItem(1, 8000));
    setIdToChecklistItems[0].push(ChecklistItem(2, 8000));
    setIdToChecklistItems[0].push(ChecklistItem(3, 8000));
    setIdToChecklistItems[0].push(ChecklistItem(4, 8000));
    setIdToChecklistItems[0].push(ChecklistItem(5, 8000));
    setIdToChecklistItems[0].push(ChecklistItem(6, 8000));
    setIdToChecklistItems[0].push(ChecklistItem(7, 8000));
    setIdToChecklistItems[0].push(ChecklistItem(8, 8000));
    setIdToChecklistItems[0].push(ChecklistItem(9, 8000));
    setIdToChecklistItems[0].push(ChecklistItem(10, 8000));
    setIdToChecklistItems[0].push(ChecklistItem(11, 8000));
    setIdToChecklistItems[0].push(ChecklistItem(12, 8000));
    setIdToChecklistItems[0].push(ChecklistItem(13, 8000));
    setIdToChecklistItems[0].push(ChecklistItem(14, 8000));
    setIdToChecklistItems[0].push(ChecklistItem(15, 8000));
    setIdToChecklistItems[0].push(ChecklistItem(16, 8000));
    setIdToChecklistItems[0].push(ChecklistItem(17, 8000));
    setIdToChecklistItems[0].push(ChecklistItem(18, 8000));
    setIdToChecklistItems[0].push(ChecklistItem(19, 8000));
    setIdToChecklistItems[0].push(ChecklistItem(20, 8000));
    setIdToChecklistItems[0].push(ChecklistItem(21, 8000));
    setIdToChecklistItems[0].push(ChecklistItem(22, 8000));
    setIdToChecklistItems[0].push(ChecklistItem(23, 8000));
    setIdToChecklistItems[0].push(ChecklistItem(24, 8000));

    // Award Set (issuance doesn't matter for these)
    setIdToChecklistItems[1].push(ChecklistItem(0, 0));
    setIdToChecklistItems[1].push(ChecklistItem(1, 0));
    setIdToChecklistItems[1].push(ChecklistItem(2, 0));
    setIdToChecklistItems[1].push(ChecklistItem(3, 0));
    setIdToChecklistItems[1].push(ChecklistItem(4, 0));
    setIdToChecklistItems[1].push(ChecklistItem(5, 0));
    setIdToChecklistItems[1].push(ChecklistItem(6, 0));
    setIdToChecklistItems[1].push(ChecklistItem(7, 0));
    setIdToChecklistItems[1].push(ChecklistItem(8, 0));
    setIdToChecklistItems[1].push(ChecklistItem(9, 0));
    setIdToChecklistItems[1].push(ChecklistItem(10, 0));
    setIdToChecklistItems[1].push(ChecklistItem(11, 0));
    setIdToChecklistItems[1].push(ChecklistItem(12, 0));
    setIdToChecklistItems[1].push(ChecklistItem(15, 0));
    setIdToChecklistItems[1].push(ChecklistItem(16, 0));
    setIdToChecklistItems[1].push(ChecklistItem(17, 0));
    setIdToChecklistItems[1].push(ChecklistItem(18, 0));
    setIdToChecklistItems[1].push(ChecklistItem(19, 0));
    setIdToChecklistItems[1].push(ChecklistItem(21, 0));
    setIdToChecklistItems[1].push(ChecklistItem(24, 0));
  }

  function addChecklistItem(
    uint8 _setId,
    uint8 _playerId,
    uint16 _totalIssuance
  ) external onlyOwner {
    require(_setId > 1, "Creating new sets is fine, but don't add cards to the original 2!");
    setIdToChecklistItems[_setId].push(ChecklistItem({
      playerId: _playerId,
      totalIssuance: _totalIssuance
    }));
  }
}
