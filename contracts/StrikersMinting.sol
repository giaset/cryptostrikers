pragma solidity ^0.4.24;

import "./StrikersBase.sol";

contract StrikersMinting is StrikersBase {
  /// @dev The address of the contract that manages the pack sale.
  address public packSaleAddress;

  /// @dev Only the owner can update the address of the pack sale contract.
  /// @param _address The address of the new StrikersPackSale contract.
  function setPackSaleAddress(address _address) external onlyOwner {
    packSaleAddress = _address;
  }

  function mintBaseCard(
    uint8 _checklistId,
    uint8 _saleId,
    address _owner
  )
    external
    returns (uint256)
  {
    require(msg.sender == packSaleAddress, "Only the pack sale contract can mint Base Set cards.");
    return _mintCard(_checklistId, _saleId, _owner);
  }
}
