pragma solidity ^0.4.19;

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

contract PackSale is Ownable {

  uint public ethPriceUSD;
  uint public packPriceUSD;

  function PackSale(uint _ethPriceUSD, uint _packPriceUSD) public {
    ethPriceUSD = _ethPriceUSD;
    packPriceUSD = _packPriceUSD;
  }

  function setEthPriceUSD(uint _ethPriceUSD) public onlyOwner {
    ethPriceUSD = _ethPriceUSD;
  }

  function setPackPriceUSD(uint _packPriceUSD) public onlyOwner {
    packPriceUSD = _packPriceUSD;
  }
}
