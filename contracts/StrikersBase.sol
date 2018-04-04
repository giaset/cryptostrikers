pragma solidity ^0.4.21;

import "zeppelin-solidity/contracts/token/ERC721/ERC721BasicToken.sol";
import "./StrikersState.sol";

/// @title Base contract for CryptoStrikers. Defines what a card is and how to mint one.
/// @author The CryptoStrikers Team
contract StrikersBase is ERC721BasicToken, StrikersState {
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
    returns (uint)
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
    tokenOwner[newCardId] = _owner;
    ownedTokensCount[_owner]++;
    emit Transfer(0, _owner, newCardId);
    return newCardId;
  }
}
