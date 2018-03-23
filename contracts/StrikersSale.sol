pragma solidity ^0.4.19;

import "./StrikersFactory.sol";

contract StrikersSale is StrikersFactory {
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

  /*decide which pack is purchased by the hash of the block hash,
  the sender, and a per-sender nonce, modulo the number of packs left.
  Then give them the pack at that index, move the last pack to that index,
  and then decrement the total number of packs. Makes it much harder
  to influence which pack you get, since previously it was just a timing attack.
  Now they also have to influence the block hash as well as deal with other users
  re-shuffling the array every time a purchase is made. Basically impossible
  in a short time frame imo*/
  function() external payable {

  }
}
