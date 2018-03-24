pragma solidity ^0.4.19;

import "./StrikersBase.sol";

contract StrikersPackFactory is StrikersBase {
  event RunMinted(uint8 runNumber);

  // The number of cards in a pack
  uint8 public constant PACK_SIZE = 4;

  // Sets a hard cap on the number of packs that will ever be minted
  uint32 public constant PACKS_MINTED_LIMIT = 200000;

  // Keeps track of the packs minted to make sure we don't go over the limit
  uint32 public packsMinted;

  uint8 public currentRunNumber;

  mapping (uint8 => uint32) public runNumberToRunSize;

  mapping (uint8 => mapping (uint8 => uint16)) public playerCountForRun;

  // Maybe this shouldn't be public
  uint8[][] public packs;

  // Series 1 only
  function mintRun(uint8[PACK_SIZE][] _shuffledPacks) external onlyOwner {
    uint32 runSize = uint32(_shuffledPacks.length) * PACK_SIZE;
    require (packsMinted + runSize <= PACKS_MINTED_LIMIT);
    packsMinted += runSize;
    uint8 runNumber = currentRunNumber++;
    runNumberToRunSize[runNumber] = runSize;
    packs = _shuffledPacks;
    RunMinted(runNumber);
  }
}
