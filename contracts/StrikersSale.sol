pragma solidity ^0.4.21;

import "./StrikersPackFactory.sol";

contract StrikersSale is StrikersPackFactory {
  event PackBought(address indexed _buyer, uint256[] _pack);

  // Can be adjusted as needed
  uint public packPrice = 0.03 ether;

  mapping (uint8 => uint32) packsSoldForRun;
  mapping (uint8 => mapping (uint8 => uint16)) playerCardsSoldForRun;

  function setPackPrice(uint _packPrice) public onlyOwner {
    packPrice = _packPrice;
  }

  function() external payable {
    buyPack();
  }

  function buyPack() public {
    // TODO: require proper ether amount
    // TODO: require shuffledPacks.length > 0
    require(shuffledPacks.length > 0);
    uint32 pack = _removePackAtIndex(0);
    uint8 mask = 255;
    uint256[] memory newCards = new uint256[](PACK_SIZE);
    for (uint8 i = 1; i <= PACK_SIZE; i++) {
      uint8 shift = 32 - (i * 8);
      uint8 playerId = uint8((pack >> shift) & mask);
      uint256 cardId = _mintCard(playerId, 1, currentRunNumber, 0, msg.sender);
      newCards[i-1] = cardId;
    }
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
