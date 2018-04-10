pragma solidity ^0.4.21;

import "./PackFactory.sol";

/// @dev We use the interface here (instead of importing StrikersMinting) to avoid circular imports
///   (StrikersMinting already imports PackSale to make sure only it can call mintSeries1Card)
contract StrikersMintingInterface {
  function mintSeries1Card(uint8 _playerId, uint8 _runId, uint16 _mintNumber, address _owner) external returns (uint256);
}

contract PackSale is PackFactory {
  event PackBought(address indexed buyer, uint256[] pack);
  event PackPriceChanged(uint256 packPrice);

  event SaleStarted(uint8 runNumber);
  event SalePaused(uint8 runNumber);
  event SaleFinished(uint8 runNumber);

  // Can be adjusted as needed
  uint256 public packPrice = 0.03 ether;

  mapping (uint8 => uint32) public packsSoldForRun;

  // actually maybe we don't want to expose this...
  mapping (uint8 => mapping (uint8 => uint16)) playerCardsSoldForRun;

  StrikersMintingInterface public strikersMinting;

  function PackSale(address _strikersMintingAddress) public {
    strikersMinting = StrikersMintingInterface(_strikersMintingAddress);
  }

  function setPackPrice(uint _packPrice) public onlyOwner requireNotState(SaleState.Selling) {
    packPrice = _packPrice;
    emit PackPriceChanged(packPrice);
  }

  function() external payable {
    buyPack();
  }

  function startSale() external onlyOwner requireState(SaleState.DoneLoadingPacks) {
    emit SaleStarted(currentRunNumber);
    changeState(SaleState.Selling);
  }

  function pauseSale() external onlyOwner requireState(SaleState.Selling) {
    emit SalePaused(currentRunNumber);
    changeState(SaleState.SalePaused);
  }

  // TODO: buyPack for someone else (giftPack?)
  function buyPack() public requireState(SaleState.Selling) {
    // TODO: require proper ether amount
    require(shuffledPacks.length > 0);
    uint32 pack = _removePackAtIndex(0);
    uint8 mask = 255;
    uint256[] memory newCards = new uint256[](PACK_SIZE);
    for (uint8 i = 1; i <= PACK_SIZE; i++) {
      uint8 shift = 32 - (i * 8);
      uint8 playerId = uint8((pack >> shift) & mask);
      // TODO: mintNumber
      uint256 cardId = strikersMinting.mintSeries1Card(playerId, currentRunNumber, 0, msg.sender);
      newCards[i-1] = cardId;
    }
    packsSoldForRun[currentRunNumber]++;
    emit PackBought(msg.sender, newCards);
  }

  function _removePackAtIndex(uint256 _index) internal returns (uint32) {
    uint256 lastIndex = shuffledPacks.length - 1;
    require(_index <= lastIndex);
    uint32 pack = shuffledPacks[_index];
    shuffledPacks[_index] = shuffledPacks[lastIndex];
    shuffledPacks.length--;
    return pack;
  }
}
