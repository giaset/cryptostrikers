pragma solidity ^0.4.19;

import "./StrikersPackFactory.sol";

contract StrikersSale is StrikersPackFactory {
  uint public ethPriceUSD;
  uint public packPriceUSD;

  uint packsSold;

  struct Pack {
    uint cardIds;
  }

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

  function buyPack() public returns (uint32) {
    // require proper ether amount
    require(shuffledPacks.length > 0);
    uint32 pack = _removePackAtIndex(0);
    return pack;
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
