pragma solidity ^0.4.23;

import "./StrikersBase.sol";
import "./StrikersPackSale.sol";

contract StrikersMinting is StrikersBase {
  /// @dev The address of the contract that manages the pack sale.
  StrikersPackSale public packSaleContract;

  /// @dev Only the owner can update the address of the pack sale contract.
  /// @param _address The address of the new StrikersPackSale contract.
  function setPackSaleAddress(address _address) external onlyOwner {
    StrikersPackSale candidateContract = StrikersPackSale(_address);
    // Sanity check to make sure we're actually setting the right contract...
    require(candidateContract.isPackSaleContract());
    packSaleContract = candidateContract;
  }

  function mintBaseCard(
    uint8 _playerId,
    uint8 _saleId,
    address _owner
  )
    external
    returns (uint256)
  {
    // Only the pack sale contract can mint Base Set cards!!!
    require(msg.sender == address(packSaleContract));
    return _mintCard(_playerId, _saleId, 1, _owner);
  }
}
