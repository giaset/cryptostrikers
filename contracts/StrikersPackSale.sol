pragma solidity ^0.4.23;

import "./PackSaleFactory.sol";

/// @dev To avoid having to go through the approve + transferFrom flow,
///   we just use CK's transfer() method, which didn't make it to the final
///   ERC721 spec. CK's implementation of transferFrom requires that msg.sender
///   be approved for the given kitty, even if it's already the kitty's owner,
///   and we don't want to deal with that extra step...
contract CryptoKittiesInterface {
  function ownerOf(uint256 _tokenId) external view returns (address owner);
  function transfer(address _to, uint256 _tokenId) external;
}

/// @dev We use the interface here (instead of importing StrikersMinting) to avoid circular imports
///   (StrikersMinting already imports StrikersPackSale to make sure only it can call mintBaseCard)
contract StrikersMintingInterface {
  function mintBaseCard(uint8 _playerId, uint8 _saleId, address _owner) external returns (uint256);
}

contract StrikersPackSale is PackSaleFactory {
  /*** EVENTS ***/
  // TODO: maybe track packID with a counter?
  event PackBought(address indexed buyer, uint256[] pack);

  /*** STORAGE ***/

  /// @dev A reference to the CryptoKitties contract so we can transfer cats
  CryptoKittiesInterface public kittiesContract;

  /// @dev A reference to the contract where the cards are actually minted
  StrikersMintingInterface public strikersMinting;


  /// @dev Constructor. Can't change strikersMinting address once it's been initialized
  constructor(address _kittiesContractAddress, address _strikersMintingAddress) public {
    kittiesContract = CryptoKittiesInterface(_kittiesContractAddress);
    strikersMinting = StrikersMintingInterface(_strikersMintingAddress);
  }

  // TODO: buyPack for someone else (giftPack?)

  function buyPacksWithETH(uint8 _saleId) external payable {
    uint256 packPrice = sales[_saleId].packPrice;
    require(packPrice > 0, "You are trying to use ETH to buy from a Kitty Sale.");

    uint256 balanceLeft = msg.value;
    while (balanceLeft >= packPrice) {
      if (!_buyPack(_saleId)) {
        break;
      }

      // NOTE: impossible for this to underflow because
      // we only enter the while loop if balanceLeft >= packPrice
      balanceLeft -= packPrice;
    }

    // Return excess funds
    msg.sender.transfer(balanceLeft);
  }

  function buyPackWithKitty(uint8 _saleId, uint256 _kittyId) external {
    require(sales[_saleId].packPrice == 0, "You are trying to use a Kitty to buy from an ETH Sale.");

    if (_buyPack(_saleId)) {
      kittiesContract.transfer(owner, _kittyId);
    }
  }

  function ownerOfKitty(uint256 _kittyId) external view returns (address) {
    return kittiesContract.ownerOf(_kittyId);
  }

  function _buyPack(uint8 _saleId) internal returns (bool) {
    if (!saleInProgress(_saleId) || shuffledPacksForSale[_saleId].length <= 0) {
      return false;
    }

    uint32[] storage nextPacks = _getNextPacks(_saleId);
    if (nextPacks.length <= 0) {
      return false;
    }

    // TODO: this could throw... bad?
    uint32 pack = _removePackAtIndex(0, nextPacks);
    uint256[] memory cards = _mintCards(pack, _saleId);
    sales[_saleId].packsSold++;
    emit PackBought(msg.sender, cards);
    return true;
  }

  function _mintCards(uint32 _pack, uint8 _saleId) internal returns (uint256[]) {
    uint8 mask = 255;
    uint256[] memory newCards = new uint256[](PACK_SIZE);

    for (uint8 i = 1; i <= PACK_SIZE; i++) {
      uint8 shift = 32 - (i * 8);
      uint8 playerId = uint8((_pack >> shift) & mask);
      uint256 cardId = strikersMinting.mintBaseCard(playerId, _saleId, msg.sender);
      newCards[i-1] = cardId;
    }

    return newCards;
  }

  function _getNextPacks(uint8 _saleId) internal returns (uint32[] storage) {
    uint32[][] storage packsForSale = shuffledPacksForSale[_saleId];

    if (packsForSale[0].length <= 0 && packsForSale.length > 1) {
      packsForSale[0] = packsForSale[packsForSale.length - 1];
      packsForSale.length--;
    }

    return packsForSale[0];
  }

  function _removePackAtIndex(uint256 _index, uint32[] storage _packs) internal returns (uint32) {
    uint256 lastIndex = _packs.length - 1;
    require(_index <= lastIndex);
    uint32 pack = _packs[_index];
    _packs[_index] = _packs[lastIndex];
    _packs.length--;
    return pack;
  }
}
