pragma solidity ^0.4.19;

import "./StrikersBase.sol";

contract StrikersPackFactory is StrikersBase {
  event PackMinted(uint32[] cardIds);

  // The number of cards in a pack
  uint8 public constant PACK_SIZE = 5;

  // Sets a hard cap on the number of packs that will ever be minted
  uint32 public constant PACKS_MINTED_LIMIT = 200000;

  // Keeps track of the packs minted to make sure we don't go over the limit
  uint32 public packsMinted;

  struct Series {
    string name;
  }

  struct Run {
    uint8 seriesId;
    uint32 runSize;
  }

  mapping (uint8 => mapping (uint8 => uint16)) public playerCountForRun;

  Run[] public runs;

  // Maybe this shouldn't be public
  uint32[][] public packs;

  function mintRun(uint8 _seriesId, uint8[PACK_SIZE][] _shuffledPacks) external onlyOwner {
    uint32 runSize = uint32(_shuffledPacks.length) * PACK_SIZE;
    uint8 runId = uint8(runs.push(Run(_seriesId, runSize))) - 1;
    for (uint32 i = 0; i < _shuffledPacks.length; i++) {
      uint32[] memory pack = new uint32[](PACK_SIZE);
      for (uint8 j = 0; j < PACK_SIZE; j++) {
        uint8 playerId = _shuffledPacks[i][j];
        uint16 mintNumber = playerCountForRun[runId][playerId]++;
        uint newCardId = _mintCard(playerId, _seriesId, runId, mintNumber);
        pack[j] = uint32(newCardId);
      }
      packsMinted++;
      PackMinted(pack);
      packs.push(pack);
    }
  }
}
