pragma solidity ^0.4.24;

import "./StrikersPackFactory.sol";

contract StrikersWhitelist is StrikersPackFactory {
  event WhitelistAllocationIncreased(address addr, uint16 amount, Whitelist list);

  enum Whitelist {
    Standard,
    Premium
  }

  uint16[2] public whitelistLimits = [
    1000, // Standard
    100 // Premium
  ];

  uint16[2] public currentWhitelistCounts;

  mapping (address => uint8)[2] whitelists;

  function addToWhitelistAllocation(Whitelist _list, address _addr, uint8 _additionalPacks) public onlyOwner {
    uint8 listIndex = uint8(_list);
    require(currentWhitelistCounts[listIndex] + _additionalPacks <= whitelistLimits[listIndex]);
    currentWhitelistCounts[listIndex] += _additionalPacks;
    whitelists[listIndex][_addr] += _additionalPacks;
    emit WhitelistAllocationIncreased(_addr, _additionalPacks, _list);
  }

  function addAddressesToWhitelist(Whitelist _list, address[] _addrs) external onlyOwner {
    for (uint256 i = 0; i < _addrs.length; i++) {
      addToWhitelistAllocation(_list, _addrs[i], 1);
    }
  }
}
