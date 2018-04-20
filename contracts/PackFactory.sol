pragma solidity ^0.4.21;

import './PackSaleState.sol';

/// @dev The contract that allows the contract owner to load shuffled packs of cards
contract PackFactory is PackSaleState {

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
  event PacksLoaded(uint8 indexed runNumber, uint32[] packs);
  event FinishedMinting(uint8 runNumber);

  // The number of cards in a pack
  uint8 public constant PACK_SIZE = 4;

  // Sets a hard cap on the number of packs that will ever be minted
  uint32 public constant PACKS_MINTED_LIMIT = 200000;

  // Keeps track of the packs minted to make sure we don't go over the limit
  uint32 public totalPacksMinted;

  uint8 public currentRunNumber;

  mapping (uint8 => uint32) public packsMintedForRun;

  /// @dev We are only able to load about 500 packs at a time (as an array of 500 uint32s),
  ///   so for a run of 20,000 packs we will end up loading 40 arrays of 500 packs.
  ///   This is why we need a 2d array here, because it saves a lot of gas pushing each
  ///   new array of 500 packs to this 2d array versus looping on the 500 packs and pushing
  ///   each one into a 20,000 element array. To make it slightly more annoying to see upcoming packs,
  ///   we mark this mapping as "internal", but people can still verify that we are respecting
  ///   our declared player rarities by analyzing all the PacksLoaded events for a given run.
  mapping (uint8 => uint32[][]) internal shuffledPacksForRun;

  // All below is for Series 1 only
  function startNewRun() external onlyOwner requireState(SaleState.WaitingForNextRun) {
    currentRunNumber++;
    emit StartedMinting(currentRunNumber);
    changeState(SaleState.LoadingPacks);
  }

  function loadShuffledPacks(uint32[] _shuffledPacks) external onlyOwner requireState(SaleState.LoadingPacks) {
    uint32 newPackCount = uint32(_shuffledPacks.length);
    require(totalPacksMinted + newPackCount <= PACKS_MINTED_LIMIT);
    shuffledPacksForRun[currentRunNumber].push(_shuffledPacks);
    totalPacksMinted += newPackCount;
    packsMintedForRun[currentRunNumber] += newPackCount;
    emit PacksLoaded(currentRunNumber, _shuffledPacks);
  }

  function finishRun() external onlyOwner requireState(SaleState.LoadingPacks) {
    emit FinishedMinting(currentRunNumber);
    changeState(SaleState.DoneLoadingPacks);
  }
}
