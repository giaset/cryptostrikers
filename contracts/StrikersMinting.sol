pragma solidity ^0.4.24;

import "./StrikersBase.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract StrikersMinting is StrikersBase, Ownable {
  /// @dev The address of the contract that manages the pack sale.
  address public packSaleAddress;

  /// @dev Only the owner can update the address of the pack sale contract.
  /// @param _address The address of the new StrikersPackSale contract.
  function setPackSaleAddress(address _address) external onlyOwner {
    packSaleAddress = _address;
  }

  function mintPackSaleCard(uint8 _checklistId, address _owner) external returns (uint256) {
    require(msg.sender == packSaleAddress, "Only the pack sale contract can mint here.");
    return _mintCard(_checklistId, _owner);
  }

  function mintUnreleasedCard(uint8 _checklistId, address _owner) external onlyOwner {
    require(_checklistId >= 200, "You can only use this to mint unreleased cards.");
    _mintCard(_checklistId, _owner);
  }
}
