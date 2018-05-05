pragma solidity ^0.4.23;

import "./StrikersAuction.sol";

contract StrikersCore is StrikersAuction {
  /// @dev Even though we don't actually use anything from Checklist
  /// or WorldCupInfo in the on-chain logic, we think it's nice to have
  /// a canonical source of truth for what the Player and ChecklistItem
  /// IDs refer to... It's sufficient to keep a record of the address,
  /// we don't really need to even initialize a contract instance.
  address public checklistAddress;

  constructor(address _checklistAddress) public {
    checklistAddress = _checklistAddress;
  }
}
