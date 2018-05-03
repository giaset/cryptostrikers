pragma solidity ^0.4.23;

import "./OpenSea/SaleClockAuction.sol";
import "./StrikersMinting.sol";

contract StrikersAuction is StrikersMinting {
  /// @dev The address of the OpenSea contract that handles p2p sales of cards.
  SaleClockAuction public saleAuctionContract;

  /// @dev Only the owner can update the address of the saleAuction contract.
  /// @param _address The address of the new SaleAuction contract.
  function setSaleAuctionAddress(address _address) external onlyOwner {
    saleAuctionContract = SaleClockAuction(_address);
  }
}
