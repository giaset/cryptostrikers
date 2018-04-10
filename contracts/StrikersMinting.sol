pragma solidity ^0.4.21;

import "./PackSale.sol";
import "./StrikersBase.sol";

contract StrikersMinting is StrikersBase {
  /// @dev The address of the contract that manages the pack sale.
  PackSale public packSale;

  /// @dev Only the owner can update the address of the pack sale contract.
  /// @param _address The address of the new PackSale contract.
  function setPackSaleAddress(address _address) external onlyOwner {
    PackSale candidateContract = PackSale(_address);
    // Sanity check to make sure we're actually setting a PackSale contract...
    require(candidateContract.isPackSale());
    packSale = candidateContract;
  }

  function mintSeries1Card(
    uint8 _playerId,
    uint8 _runId,
    uint16 _mintNumber,
    address _owner
  )
    external
    returns (uint256)
  {
    // Only the PackSale contract can mint Series 1 cards!!!
    require(msg.sender == address(packSale));
    return _mintCard(_playerId, 1, _runId, _mintNumber, _owner);
  }
}
