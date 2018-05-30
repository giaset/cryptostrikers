pragma solidity ^0.4.24;

import "./StrikersMinting.sol";
import "./StrikersWhitelist.sol";
import "openzeppelin-solidity/contracts/token/ERC721/ERC721Basic.sol";

contract StrikersPackSale is StrikersWhitelist {
  /*** EVENTS ***/

  // TODO: maybe track packID with a counter?
  event PackBought(address indexed buyer, uint256[] pack);

  /*** CONSTANTS ***/

  /// @dev The number of cards in a pack.
  uint8 public constant PACK_SIZE = 4;

  /*** STORAGE ***/

  /// @dev We use/increment this nonce when grabbing a random pack in _removeRandomPack()
  uint256 randNonce;

  uint256 totalWeiRaised;

  /// @dev A reference to the CryptoKitties contract so we can transfer cats
  ERC721Basic public kittiesContract;

  /// @dev A reference to the contract where the cards are actually minted
  StrikersMinting public mintingContract;

  /// @dev Constructor. Can't change mintingContract address once it's been initialized
  constructor(
    uint256 _standardPackPrice,
    address _kittiesContractAddress,
    address _mintingContractAddress
  )
  StrikersPackFactory(_standardPackPrice)
  public
  {
    kittiesContract = ERC721Basic(_kittiesContractAddress);
    mintingContract = StrikersMinting(_mintingContractAddress);
  }

  function buyStandardPackWithETH() external payable {
    uint256 packPrice = standardSale.packPrice;
    require(msg.value >= packPrice, "Insufficiet ETH sent to buy this pack.");
    _buyPack(standardSale);
    totalWeiRaised += packPrice;
    // Return excess funds
    msg.sender.transfer(msg.value - packPrice);
  }

  function _buyPack(PackSale storage _sale) internal whenNotPaused {
    uint32 pack = _removeRandomPack(_sale.packs);
    uint256[] memory cards = _mintCards(pack);
    _sale.packsSold++;
    emit PackBought(msg.sender, cards);
  }

  /// @notice Magically transform a CryptoKitty into a free pack of cards!
  /// @param _kittyId The cat we are giving up.
  /// @dev Note that the user must first give this contract approval by
  ///   calling approve(address(this), _kittyId) on the CK contract.
  ///   Otherwise, buyPackWithKitty() throws on transferFrom().
  function buyStandardPackWithKitty(uint256 _kittyId) external {
    // Will throw/revert if this contract hasn't been given approval first.
    // Also, with no way of retrieving kitties from this contract,
    // transferring to "this" burns the cat! (desired behaviour)
    kittiesContract.transferFrom(msg.sender, this, _kittyId);
    _buyPack(standardSale);
  }

  function _mintCards(uint32 _pack) internal returns (uint256[]) {
    uint8 mask = 255;
    uint256[] memory newCards = new uint256[](PACK_SIZE);

    for (uint8 i = 1; i <= PACK_SIZE; i++) {
      uint8 shift = 32 - (i * 8);
      uint8 checklistId = uint8((_pack >> shift) & mask);
      uint256 cardId = mintingContract.mintPackSaleCard(checklistId, msg.sender);
      newCards[i-1] = cardId;
    }

    return newCards;
  }

  function _removeRandomPack(uint32[] storage _packs) internal returns (uint32) {
    randNonce++;
    bytes memory packed = abi.encodePacked(now, msg.sender, randNonce);
    uint256 randomIndex = uint256(keccak256(packed)) % _packs.length;
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
