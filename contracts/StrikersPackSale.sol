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

  function buyPacksWithETH(uint8 _saleId) external payable {
    uint256 balanceLeft = msg.value;

    while (balanceLeft >= packPrice) {
      bool success = _buyPack(_saleId);
      if (success) {
        balanceLeft -= packPrice;
      } else {
        break;
      }
    }

    msg.sender.transfer(balanceLeft);
  }


  function _buyPack(uint8 _saleId) internal returns (bool) {
    if (!saleInProgress(_saleId) || shuffledPacksForSale[_saleId].length <= 0) {
      return false;
    }

    uint32[] storage nextPacks = _getNextPacks(_saleId);
    if (nextPacks.length <= 0) {
      return false;
    }

    uint32 pack = _removePackAtIndex(0, nextPacks);
    uint256[] memory cards = _mintCards(pack, _saleId);
    sales[_saleId].packsSold++;
    emit PackBought(msg.sender, cards);
    return true;
  }

  function _mintCards(uint32 _pack, uint8 _saleId) internal returns (uint256[]) {
    uint8 mask = 255;
    uint256[] memory newCards = new uint256[](PACK_SIZE);

    for (uint8 i = 1; i <= PACK_SIZE; i++) {
      uint8 shift = 32 - (i * 8);
      uint8 playerId = uint8((_pack >> shift) & mask);
      uint256 cardId = strikersMinting.mintBaseCard(playerId, _saleId, msg.sender);
      newCards[i-1] = cardId;
    }

    return newCards;
  }

  function _getNextPacks(uint8 _saleId) internal returns (uint32[] storage) {
    uint32[][] storage packsForSale = shuffledPacksForSale[_saleId];

    if (packsForSale[0].length <= 0 && packsForSale.length > 1) {
      packsForSale[0] = packsForSale[packsForSale.length - 1];
      packsForSale.length--;
    }

    return packsForSale[0];
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
