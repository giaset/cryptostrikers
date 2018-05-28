pragma solidity ^0.4.24;

import "./PackSaleFactory.sol";
import "./StrikersMinting.sol";
import "openzeppelin-solidity/contracts/token/ERC721/ERC721Basic.sol";

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
  StrikersMinting public mintingContract;

  /// @dev Constructor. Can't change mintingContract address once it's been initialized
  constructor(address _kittiesContractAddress, address _mintingContractAddress) public {
    kittiesContract = ERC721Basic(_kittiesContractAddress);
    mintingContract = StrikersMinting(_mintingContractAddress);
  }

  // TODO: buyPack for someone else (giftPack?)
  function buyPackWithETH(uint8 _saleId) external payable {
    uint256 packPrice = sales[_saleId].packPrice;
    require(packPrice > 0, "You are trying to use ETH to buy from a Kitty Sale.");
    require(msg.value >= packPrice, "Insufficient ETH sent to buy this pack.");
    _buyPack(_saleId);
    // Return excess funds
    msg.sender.transfer(msg.value - packPrice);
  }

  /// @notice Magically transform a CryptoKitty into a free pack of cards!
  /// @param _saleId The pack sale we want to buy from.
  /// @param _kittyId The cat we are giving up.
  /// @dev Note that the user must first give this contract approval by
  ///   calling approve(address(this), _kittyId) on the CK contract.
  ///   Otherwise, buyPackWithKitty() throws on transferFrom().
  function buyPackWithKitty(uint8 _saleId, uint256 _kittyId) external {
    require(sales[_saleId].packPrice == 0, "You are trying to use a Kitty to buy from an ETH Sale.");

    // Will throw/revert if this contract hasn't been given approval first.
    // Also, with no way of retrieving kitties from this contract,
    // transferring to "this" burns the cat! (desired behaviour)
    kittiesContract.transferFrom(msg.sender, this, _kittyId);
    _buyPack(_saleId);
  }

  function _buyPack(uint8 _saleId) internal returns (bool) {
    require(saleInProgress(_saleId), "This sale is not currently in progress.");

    uint32[] storage nextBatch = _getNextBatch(_saleId);
    uint32 pack = _removeRandomPack(nextBatch);
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
      uint8 checklistId = uint8((_pack >> shift) & mask);
      uint256 cardId = mintingContract.mintCard(checklistId, _saleId, msg.sender);
      newCards[i-1] = cardId;
    }

    return newCards;
  }

  function _getNextBatch(uint8 _saleId) internal returns (uint32[] storage) {
    uint32[][] storage batches = batchesForSale[_saleId];
    require(batches.length > 0, "Sanity check failed: there are no batches for this sale.");

    // If we've sold all the packs in the first batch, move the last batch to the front!
    if (batches[0].length <= 0 && batches.length > 1) {
      batches[0] = batches[batches.length - 1];
      batches.length--;
    }

    require(batches[0].length > 0, "This sale is sold out!");
    return batches[0];
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
