pragma solidity ^0.4.23;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";
import "./OraclizeStringUtils.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

/// @title Base contract for CryptoStrikers. Defines what a card is and how to mint one.
/// @author The CryptoStrikers Team
contract StrikersBase is ERC721Token("CryptoStrikers", "STRK"), OraclizeStringUtils, Ownable {
  // TODO: make sure to switch to prod API before mainnet deploy!!!
  string constant API_URL = "https://us-central1-cryptostrikers-api.cloudfunctions.net/cards/";

  /// @dev Emit this event whenever we mint a new card
  ///  For Base Set cards, this occurs when a pack is purchased.
  ///  For Daily Challenge cards, this occurs when you claim your prize for a correct response.
  event CardMinted(uint256 cardId);

  /// @dev The struct representing the game's main object, a sports trading card.
  struct Card {
    // The timestamp at which this card was minted.
    uint64 mintTime;

    // The checklist item represented by this card. See the Checklist contract for more info.
    uint8 checklistId;

    // The sale in which this card was sold
    // TODO: does this really matter???
    uint8 saleId;

    // Cards for a given player have a serial number, which gets
    // incremented in sequence. If we mint 1000 Messis, the third one
    // to be minted has serialNumber = 3 (out of 1000, for example).
    uint16 serialNumber;
  }

  /*** STORAGE ***/

  /// @dev All the cards that have been minted, indexed by cardId.
  Card[] public cards;

  mapping (uint8 => uint16) cardCountForChecklistId;

  /*** FUNCTIONS ***/

  /// @dev Returns the API URL for each card
  ///   ex: https://us-central1-cryptostrikers-api.cloudfunctions.net/cards/22
  ///   The API will then return a JSON blob according to OpenSea's spec
  ///   see: https://developers.opensea.io/getting-started.html
  function tokenURI(uint256 _tokenId) public view returns (string) {
    require(exists(_tokenId), "Card does not exist.");
    string memory _id = uint2str(_tokenId);
    return strConcat(API_URL, _id);
  }

  /// @dev For a given owner, returns two arrays. The first contains the IDs of every card owned
  ///   by this address. The second returns the corresponding checklist ID for each of these cards.
  ///   There are a few places we need this info in the web app and short of being able to return an
  ///   actual array of Cards, this is the best solution we could come up with...
  function cardAndChecklistIdsForOwner(address _owner) external view returns (uint256[], uint8[]) {
    uint256[] memory cardIds = ownedTokens[_owner];
    uint256 cardCount = cardIds.length;
    uint8[] memory checklistIds = new uint8[](cardCount);

    for (uint256 i = 0; i < cardCount; i++) {
      uint256 cardId = cardIds[i];
      checklistIds[i] = cards[cardId].checklistId;
    }

    return (cardIds, checklistIds);
  }

  /// @dev An internal method that creates a new card and stores it.
  ///  Emits both a CardMinted and a Transfer event.
  /// @param _checklistId The ID of the checklistItem represented by the card (see Checklist.sol)
  /// @param _saleId The sale in which this card was sold
  /// @param _owner The card's first owner!
  function _mintCard(
    uint8 _checklistId,
    uint8 _saleId,
    address _owner
  )
    internal
    returns (uint256)
  {
    uint16 serialNumber = ++cardCountForChecklistId[_checklistId];
    Card memory newCard = Card({
      mintTime: uint64(now),
      checklistId: _checklistId,
      saleId: _saleId,
      serialNumber: serialNumber
    });
    uint256 newCardId = cards.push(newCard) - 1;
    emit CardMinted(newCardId);
    _mint(_owner, newCardId);
    return newCardId;
  }
}
