pragma solidity ^0.4.21;

import './PackSaleBase.sol';

/// @dev The contract that allows the contract owner to load shuffled packs of cards
contract PackSaleFactory is PackSaleBase {

  // The only way to buy Base Set cards is in packs of 4.
  // We generate and store the shuffled "packs" in advance but only actually mint the cards when a pack is sold (see PackSale contract).
  // To save on storage, we use uint32 to represent a pack, with each of the 4 groups of 8 bits representing a playerId (see WorldCupInfo contract).
  // For example:
  // Pack = 00011000000001100000001000010010
  // Card 1 = 00011000 = playerId 24
  // Card 2 = 00000110 = playerId 6
  // Card 3 = 00000010 = playerId 2
  // Card 4 = 00010010 = playerId 18

  /*** EVENTS ***/

  event PacksLoaded(uint8 indexed saleId, uint32[] packs);

  /*** CONSTANTS ***/

  // The number of cards in a pack
  uint8 public constant PACK_SIZE = 4;

  // Sets a hard cap on the number of normal packs that will ever be offered for sale
  uint32 public constant NORMAL_SALE_PACK_LIMIT = 160000;

  // Sets a hard cap on the number of flash packs that will ever be offered for sale
  uint32 public constant FLASH_SALE_PACK_LIMIT = 40000;

  /*** STORAGE ***/

  // Keeps track of the normal packs offered to make sure we don't go over the limit
  uint32 public totalNormalSalePacksOffered;

  // Keeps track of the flash packs offered to make sure we don't go over the limit
  uint32 public totalFlashSalePacksOffered;

  /// @dev We are only able to load about 500 packs at a time (as an array of 500 uint32s),
  ///   so for a sale of 20,000 packs we will end up loading 40 arrays of 500 packs.
  ///   This is why we need a 2d array here, because it saves a lot of gas pushing each
  ///   new array of 500 packs to this 2d array versus looping on the 500 packs and pushing
  ///   each one into a 20,000 element array. To make it slightly more annoying to see upcoming packs,
  ///   we mark this mapping as "internal", but people can still verify that we are respecting
  ///   our declared player rarities by analyzing all the PacksLoaded events for a given sale.
  mapping (uint8 => uint32[][]) internal shuffledPacksForSale;

  function loadShuffledPacks(uint8 _saleId, uint32[] _shuffledPacks) external onlyOwner requireStateForSale(_saleId, SaleState.WaitingForPacks) {
    PackSale storage sale = sales[_saleId];
    bool isFlashSale = sale.duration > 0;
    uint16 newPackCount = uint16(_shuffledPacks.length);

    if (isFlashSale) {
      require(totalFlashSalePacksOffered + newPackCount <= FLASH_SALE_PACK_LIMIT);
      totalFlashSalePacksOffered += newPackCount;
    } else {
      require(totalNormalSalePacksOffered + newPackCount <= NORMAL_SALE_PACK_LIMIT);
      totalNormalSalePacksOffered += newPackCount;
    }

    shuffledPacksForSale[_saleId].push(_shuffledPacks);
    sale.packCount += newPackCount;
    emit PacksLoaded(_saleId, _shuffledPacks);
  }
}
