pragma solidity ^0.4.23;

import "./PackSaleFactory.sol";
import "openzeppelin-solidity/contracts/token/ERC721/ERC721Basic.sol";

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

  /// @dev We use/increment this nonce when grabbing a random pack in _removeRandomPack()
  uint256 randNonce = 0;

  /// @dev A reference to the CryptoKitties contract so we can transfer cats
  ERC721Basic public kittiesContract;

  /// @dev A reference to the contract where the cards are actually minted
  StrikersMintingInterface public strikersMinting;


  /// @dev Constructor. Can't change strikersMinting address once it's been initialized
  constructor(address _kittiesContractAddress, address _strikersMintingAddress) public {
    kittiesContract = ERC721Basic(_kittiesContractAddress);
    strikersMinting = StrikersMintingInterface(_strikersMintingAddress);
  }

  // TODO: buyPack for someone else (giftPack?)
  // TODO: handle return false better
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

  /// @dev Needs prior approval!!!
  function buyPackWithKitty(uint8 _saleId, uint256 _kittyId) external {
    require(sales[_saleId].packPrice == 0, "You are trying to use a Kitty to buy from an ETH Sale.");

    if (_buyPack(_saleId)) {
      // Will throw/revert if this contract hasn't been approved first.
      // Transferring to "this" burns the cat!
      kittiesContract.transferFrom(msg.sender, this, _kittyId);
    }
  }

  function _buyPack(uint8 _saleId) internal returns (bool) {
    if (!saleInProgress(_saleId) || shuffledPacksForSale[_saleId].length <= 0) {
      return false;
    }

    uint32[] storage nextPacks = _getNextPacks(_saleId);
    if (nextPacks.length <= 0) {
      return false;
    }

    // TODO: this could throw and we need to return true/false for our external buy functions... bad?
    uint32 pack = _removeRandomPack(nextPacks);
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

  function _removeRandomPack(uint32[] storage _packs) internal returns (uint32) {
    randNonce++;
    uint256 randomIndex = uint256(keccak256(now, msg.sender, randNonce)) % _packs.length;
    return _removePackAtIndex(randomIndex, _packs);
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
