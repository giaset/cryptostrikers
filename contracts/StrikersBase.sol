pragma solidity ^0.4.21;

import "zeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";
import "./OraclizeStringUtils.sol";
import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

/// @title Base contract for CryptoStrikers. Defines what a card is and how to mint one.
/// @author The CryptoStrikers Team
contract StrikersBase is ERC721Token("CryptoStrikers", "STRK"), OraclizeStringUtils, Ownable {
  string constant API_URL = "https://us-central1-cryptostrikers-api.cloudfunctions.net/cards/";

  /// @dev Emit this event whenever we mint a new card
  ///  For Series 1 cards, this occurs during the minting of packs.
  ///  For Series 2 cards, we mint and award them as a prize for the daily challenge.
  event CardMinted(uint256 cardId);

  /// @dev The struct representing the game's main object, a sports trading card.
  struct Card {
    // The timestamp at which this card was minted.
    uint64 mintTime;

    // For each run, cards for a given player have their mintNumber
    // incremented in sequence. If we mint 1000 Messis, the third one
    // to be minted has mintNumber = 3 (out of 1000).
    uint16 mintNumber;

    // The ID of the player on this card. See the players array in WorldCupInfo
    uint8 playerId;

    // We will be issuing 2 series of cards, each by a different illustrator.
    // See xxxxx.sol for more info
    uint8 seriesId;

    // We reserve the right to mint multiple runs of each series.
    // See xxxxx.sol for more info
    uint8 runId;
  }

  /// @dev All the cards that have been minted, indexed by cardId.
  Card[] public cards;

  /// @dev Returns the API URL for each card
  ///   ex: https://us-central1-cryptostrikers-api.cloudfunctions.net/cards/22
  ///   The API will then return a JSON blob according to OpenSea's spec
  ///   see: https://developers.opensea.io/getting-started.html
  function tokenURI(uint256 _tokenId) public view returns (string) {
    require(exists(_tokenId));
    string memory _id = uint2str(_tokenId);
    return strConcat(API_URL, _id);
  }

  function cardIdsForOwner(address _owner) external view returns (uint256[]) {
    return ownedTokens[_owner];
  }

  /// @dev An internal method that creates a new card and stores it.
  ///  Emits both a Birth and a Transfer event.
  /// @param _playerId The ID of the player on the card (see WorldCupInfo)
  /// @param _seriesId Series 1 or Series 2
  /// @param _runId The number of the run within the series
  /// @param _mintNumber The number of the card within the run
  function _mintCard(
    uint8 _playerId,
    uint8 _seriesId,
    uint8 _runId,
    uint16 _mintNumber,
    address _owner
  )
    internal
    returns (uint256)
  {
    Card memory newCard = Card({
      mintTime: uint64(now),
      mintNumber: _mintNumber,
      playerId: _playerId,
      seriesId: _seriesId,
      runId: _runId
    });
    uint256 newCardId = cards.push(newCard) - 1;
    emit CardMinted(newCardId);
    _mint(_owner, newCardId);
    return newCardId;
  }
}
