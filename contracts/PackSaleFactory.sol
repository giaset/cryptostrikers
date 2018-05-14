pragma solidity ^0.4.23;

import './PackSaleBase.sol';

/// @dev The contract that allows the contract owner to load packs of cards into a sale, one batch at a time.
contract PackSaleFactory is PackSaleBase {

  /*** IMPORTANT ***/
  // Given the imperfect nature of on-chain "randomness", we have found that, for this game, the best tradeoff
  // is to generate the PACKS (each containing 4 random CARDS) off-chain and push them to a SALE in the smart
  // contract. Users can then buy a pack, which will be drawn pseudorandomly from the packs we have pre-loaded.
  //
  // To save on storage, we use uint32 to represent a pack, with each of the 4 groups of 8 bits representing a checklistId (see Checklist contract).
  // Given that right now we only have 132 checklist items (with the plan to *maybe* add ~10 more during the tournament),
  // uint8 is fine (max uint8 is 255...)
  //
  // For example:
  // Pack = 00011000000001100000001000010010
  // Card 1 = 00011000 = checklistId 24
  // Card 2 = 00000110 = checklistId 6
  // Card 3 = 00000010 = checklistId 2
  // Card 4 = 00010010 = checklistId 18
  //
  // Then, when a user buys a pack, he actually mints 4 NFTs, each corresponding to one of those checklistIds (see StrikersPackSale contract).
  //
  // In testing, we were only able to load ~500 packs (recall: each a uint32) per transaction before hititng the block gas limit,
  // which may be less than we need for any given sale, so we introduced the concept of BATCHES. This allows us to make multiple
  // transactions, each adding a batch of 500 packs, which allows us to run arbitrarily large sales (just in case).
  //
  // This is why batchesForSale returns a 2d array; it's an array of batches, each of which is itself an array of packs (uint32s).
  // We had tried just one big packsForSale array for each sale, and then looping over incoming bactches and pushing each pack
  // to this array, but it was way more expensive from a gas standpoint...


  /*** EVENTS ***/

  event PacksLoaded(uint8 indexed saleId, uint32[] packs);

  /*** CONSTANTS ***/

  // The number of cards in a pack
  uint8 public constant PACK_SIZE = 4;

  // TODO: these limits should be set on the Base/Core contracts, because if they are here,
  // we can just swap PackSale contracts and keep minting!

  // Sets a hard cap on the number of normal packs that will ever be offered for sale
  uint32 public constant NORMAL_SALE_PACK_LIMIT = 160000;

  // Sets a hard cap on the number of flash packs that will ever be offered for sale
  uint32 public constant FLASH_SALE_PACK_LIMIT = 40000;

  /*** STORAGE ***/

  // Keeps track of the normal packs offered to make sure we don't go over the limit
  uint32 public totalNormalSalePacksOffered;

  // Keeps track of the flash packs offered to make sure we don't go over the limit
  uint32 public totalFlashSalePacksOffered;

  /// @dev To make it slightly more annoying to see upcoming packs,
  ///   we mark this mapping as "internal", but people can still verify that we are respecting
  ///   our declared player rarities by analyzing all the PacksLoaded events for a given sale.
  mapping (uint8 => uint32[][]) internal batchesForSale;

  function addBatchToSale(uint8 _saleId, uint32[] _batch) external onlyOwner requireStateForSale(_saleId, SaleState.WaitingForPacks) {
    PackSale storage sale = sales[_saleId];
    bool isFlashSale = sale.duration > 0;
    uint16 newPackCount = uint16(_batch.length);

    if (isFlashSale) {
      require(totalFlashSalePacksOffered + newPackCount <= FLASH_SALE_PACK_LIMIT);
      totalFlashSalePacksOffered += newPackCount;
    } else {
      require(totalNormalSalePacksOffered + newPackCount <= NORMAL_SALE_PACK_LIMIT);
      totalNormalSalePacksOffered += newPackCount;
    }

    batchesForSale[_saleId].push(_batch);
    sale.packsOffered += newPackCount;
    emit PacksLoaded(_saleId, _batch);
  }
}
