pragma solidity ^0.4.19;

import "./StrikersBase.sol";

/// @dev The contract that allows the contract owner to load shuffled packs of cards
contract StrikersPackFactory is StrikersBase {

  // The only way to buy Series 1 cards is in packs of 4.
  // NB: we generate and store the shuffled packs in advance but only actually mint the cards when a pack is sold (see PackSale contract).
  // To save on storage, we use uint32 to represent a pack, with each of the 4 groups of 8 bits representing a playerId (see WorldCupInfo contract).
  // For example:
  // Pack = 00011000000001100000001000010010
  // Card 1 = 00011000 = playerId 24
  // Card 2 = 00000110 = playerId 6
  // Card 3 = 00000010 = playerId 2
  // Card 4 = 00010010 = playerId 18

  event RunMinted(uint8 runNumber);

  // The number of cards in a pack
  uint8 public constant PACK_SIZE = 4;

  // Sets a hard cap on the number of packs that will ever be minted
  uint32 public constant PACKS_MINTED_LIMIT = 200000;

  // Keeps track of the packs minted to make sure we don't go over the limit
  uint32 public packsMinted;

  uint8 public currentRunNumber;

  mapping (uint8 => uint32) public runNumberToRunSize;

  //mapping (uint8 => mapping (uint8 => uint16)) public playerCountForRun;

  // Maybe this shouldn't be public
  uint32[] public shuffledPacks;

  // Series 1 only
  function loadShuffledPacks(uint32[] _shuffledPacks) external onlyOwner {
    uint32 runSize = uint32(_shuffledPacks.length) * PACK_SIZE;
    require(packsMinted + runSize <= PACKS_MINTED_LIMIT);
    packsMinted += runSize;
    uint8 runNumber = currentRunNumber++;
    runNumberToRunSize[runNumber] = runSize;
    shuffledPacks = _shuffledPacks;
    RunMinted(runNumber);
  }
}
