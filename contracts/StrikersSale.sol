pragma solidity ^0.4.19;

import "./StrikersPackFactory.sol";

contract StrikersSale is StrikersPackFactory {
  event PackBought(address indexed _buyer, uint256[] _pack);

  uint public ethPriceUSD;
  uint public packPriceUSD;

  uint packsSold;

  function StrikersSale(uint _ethPriceUSD, uint _packPriceUSD) public {
    ethPriceUSD = _ethPriceUSD;
    packPriceUSD = _packPriceUSD;
  }

  function setEthPriceUSD(uint _ethPriceUSD) public onlyOwner {
    ethPriceUSD = _ethPriceUSD;
  }

  function setPackPriceUSD(uint _packPriceUSD) public onlyOwner {
    packPriceUSD = _packPriceUSD;
  }

  function() external payable {
    buyPack();
  }

  function buyPack() public {
    // require proper ether amount
    require(shuffledPacks.length > 0);
    uint32 pack = _removePackAtIndex(0);
    uint8 mask = 255;
    uint256[] memory cards = new uint256[](PACK_SIZE);
    for (uint8 i = 1; i <= PACK_SIZE; i++) {
      uint8 shift = 32 - (i * 8);
      uint8 playerId = uint8((pack >> shift) & mask);
      uint256 cardId = _mintCard(playerId, 1, currentRunNumber, 0, msg.sender);
      cards[i-1] = cardId;
    }
    PackBought(msg.sender, cards);
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
