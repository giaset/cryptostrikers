pragma solidity ^0.4.23;

import "./StrikersMinting.sol";
import "openzeppelin-solidity/contracts/lifecycle/Pausable.sol";

contract StrikersTrading is StrikersMinting, Pausable {
  enum TradeState {
    Valid,
    Filled,
    Cancelled
  }

  // Mapping of tradeHash => TradeState. Defaults to Valid.
  mapping (bytes32 => TradeState) public tradeStates;

  function fillTrade(
    address _maker,
    uint256 _makerCardId,
    address _taker,
    uint256 _takerCardOrChecklistId,
    uint256 _salt,
    uint256 _submittedCardId,
    uint8 v,
    bytes32 r,
    bytes32 s)
    external
    whenNotPaused
  {
    require(_maker != msg.sender, "You can't fill your own trade.");
    require(_taker == address(0) || _taker == msg.sender, "You are not authorized to fill this trade.");

    if (_taker == address(0)) {
      require(cards[_submittedCardId].checklistId == _takerCardOrChecklistId, "The card you submitted is not valid for this trade.");
    } else {
      require(_submittedCardId == _takerCardOrChecklistId, "The card you submitted is not valid for this trade.");
    }

    bytes32 tradeHash = getTradeHash(
      _maker,
      _makerCardId,
      _taker,
      _takerCardOrChecklistId,
      _salt
    );

    require(tradeStates[tradeHash] == TradeState.Valid, "This trade is no longer valid.");
    require(isValidSignature(_maker, tradeHash, v, r, s), "Invalid signature");

    tradeStates[tradeHash] = TradeState.Filled;

    // For better UX, we assume that by signing the trade, the maker has given
    // implicit approval for this token to be transferred. This saves us from an
    // extra approval transaction...
    tokenApprovals[_makerCardId] = msg.sender;

    safeTransferFrom(_maker, msg.sender, _makerCardId);
    safeTransferFrom(msg.sender, _maker, _submittedCardId);
  }

  /// @dev Allows the maker to cancel a trade that hasn't been filled yet.
  /// @param _maker The trade creator
  /// @param _makerCardId The card the maker has agreed to give up
  /// @param _taker The counterparty the maker wishes to trade with (if it's address(0), anybody can fill the trade!)
  /// @param _takerCardOrChecklistId If trading with a specific taker, this will be a cardId (e.g. "Lionel Messi #8/100").
  ///                                If not, it will be a checklistId (e.g. "any Lionel Messi")
  /// @param _salt To prevent replay attacks, we salt the tradeHash with the timestamp of when the trade was created.
  function cancelTrade(
    address _maker,
    uint256 _makerCardId,
    address _taker,
    uint256 _takerCardOrChecklistId,
    uint256 _salt)
    external
  {
    require(_maker == msg.sender, "Only the trade creator can cancel this trade.");

    bytes32 tradeHash = getTradeHash(
      _maker,
      _makerCardId,
      _taker,
      _takerCardOrChecklistId,
      _salt
    );

    require(tradeStates[tradeHash] == TradeState.Valid, "This trade has already been cancelled or filled.");
    tradeStates[tradeHash] = TradeState.Cancelled;
  }

  /// @dev Calculates Keccak-256 hash of a trade with specified parameters.
  /// @param _maker Address of maker (i.e. the user who created the trade)
  /// @param _makerCardId The ID of the card the maker is trading away
  /// @param _taker Address of taker (i.e. the user who is filling the other side of the trade)
  /// @param _takerCardOrChecklistId If taker is the 0-address, then this is a checklist ID. If not, then it's a card ID.
  /// @param _salt A uint256 timestamp to differentiate trades that have otherwise identical params.
  /// @return Keccak-256 hash of trade.
  function getTradeHash(
    address _maker,
    uint256 _makerCardId,
    address _taker,
    uint256 _takerCardOrChecklistId,
    uint256 _salt)
    public
    view
    returns (bytes32)
  {
    return keccak256(
      this,
      _maker,
      _makerCardId,
      _taker,
      _takerCardOrChecklistId,
      _salt
    );
  }

  /// @dev Verifies that a signed trade is valid.
  /// @param _signer address of signer.
  /// @param _tradeHash Signed Keccak-256 hash.
  /// @param _v ECDSA signature parameter v.
  /// @param _r ECDSA signature parameters r.
  /// @param _s ECDSA signature parameters s.
  /// @return Validity of trade signature.
  function isValidSignature(
    address _signer,
    bytes32 _tradeHash,
    uint8 _v,
    bytes32 _r,
    bytes32 _s)
    public
    pure
    returns (bool)
  {
    return _signer == ecrecover(
      keccak256("\x19Ethereum Signed Message:\n32", _tradeHash),
      _v,
      _r,
      _s
    );
  }
}
