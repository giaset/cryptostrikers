pragma solidity ^0.4.21;

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

  event StartedMinting(uint8 runNumber);
  event FinishedMinting(uint8 runNumber);

  // The number of cards in a pack
  uint8 public constant PACK_SIZE = 4;

  // Sets a hard cap on the number of packs that will ever be minted
  uint32 public constant PACKS_MINTED_LIMIT = 200000;

  // Keeps track of the packs minted to make sure we don't go over the limit
  uint32 public totalPacksMinted;

  uint8 public currentRunNumber;

  mapping (uint8 => uint32) public packsMintedForRun;

  //mapping (uint8 => mapping (uint8 => uint16)) public playerCountForRun;

  // NOT public, but verifiable with an off-chain call
  uint32[] shuffledPacks;

  // All below is for Series 1 only
  function startNewRun() external onlyOwner requireState(State.WaitingForNextMint) {
    currentRunNumber++;
    emit StartedMinting(currentRunNumber);
    changeState(State.Minting);
  }

  function loadShuffledPacks(uint32[] _shuffledPacks) external onlyOwner requireState(State.Minting) {
    uint32 newPackCount = uint32(_shuffledPacks.length);
    require(totalPacksMinted + newPackCount <= PACKS_MINTED_LIMIT);
    shuffledPacks = _shuffledPacks;
    totalPacksMinted += newPackCount;
    packsMintedForRun[currentRunNumber] += newPackCount;
  }

  function finishRun() external onlyOwner requireState(State.Minting) {
    emit FinishedMinting(currentRunNumber);
    changeState(State.DoneMinting);
  }

  // TODO: only to be called off-chain
  /*function playerCountForRun(uint8 _runId, uint8 _playerId) external view returns (uint) {
    playerCardsSoldForRun[_runId][_playerId] + left to be sold
  }*/
}
