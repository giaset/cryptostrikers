pragma solidity ^0.4.21;

import "./PackSaleFactory.sol";

/// @dev We use the interface here (instead of importing StrikersMinting) to avoid circular imports
///   (StrikersMinting already imports StrikersPackSale to make sure only it can call mintBaseCard)
contract StrikersMintingInterface {
  function mintBaseCard(uint8 _playerId, uint8 _saleId, address _owner) external returns (uint256);
}

contract StrikersPackSale is PackSaleFactory {
  /*** EVENTS ***/
  event PackBought(address indexed buyer, uint256[] pack);
  event PackPriceChanged(uint256 packPrice);

  /*** STORAGE ***/

  /// @dev The price, in wei, for 1 pack of cards.
  uint256 public packPrice = 0.03 ether;

  mapping (uint8 => uint32) public packsSoldForSale;

  /// @dev A reference to the contract where the cards are actually minted
  StrikersMintingInterface public strikersMinting;


  /// @dev Constructor. Can't change strikersMinting address once it's been initialized
  function StrikersPackSale(address _strikersMintingAddress) public {
    strikersMinting = StrikersMintingInterface(_strikersMintingAddress);
  }

  // TODO: maybe don't allow this while a sale is in progress?
  function setPackPrice(uint _packPrice) external onlyOwner {
    packPrice = _packPrice;
    emit PackPriceChanged(packPrice);
  }

  // TODO: buyPack for someone else (giftPack?)
  function buyPack(uint8 _saleId) public {
    require(saleInProgress(_saleId));
    // TODO: require proper ether amount
    uint32[] storage  nextPacks = shuffledPacksForSale[_saleId][0];
    require(nextPacks.length > 0);
    uint32 pack = _removePackAtIndex(0, nextPacks);

    // TODO: if (nextPacks.length == 0 && shuffledPacksForRun[currentRunNumber].length > 0)

    uint8 mask = 255;
    uint256[] memory newCards = new uint256[](PACK_SIZE);
    for (uint8 i = 1; i <= PACK_SIZE; i++) {
      uint8 shift = 32 - (i * 8);
      uint8 playerId = uint8((pack >> shift) & mask);
      uint256 cardId = strikersMinting.mintBaseCard(playerId, _saleId, msg.sender);
      newCards[i-1] = cardId;
    }
    packsSoldForSale[_saleId]++;
    emit PackBought(msg.sender, newCards);
  }

  function _removePackAtIndex(uint256 _index, uint32[] storage _packs) internal returns (uint32) {
    uint256 lastIndex = _packs.length - 1;
    require(_index <= lastIndex);
    uint32 pack = _packs[_index];
    _packs[_index] = _packs[lastIndex];
    _packs.length--;
    return pack;
  }
}
