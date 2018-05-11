pragma solidity ^0.4.23;

contract StrikersTrading {
  /// @dev Calculates Keccak-256 hash of a trade with specified parameters.
  /// @param _maker Address of maker (i.e. the user who created the trade)
  /// @param _makerCardId The ID of the card the maker is trading away
  /// @param _taker Address of taker (i.e. the user who is filling the other side of the trade)
  /// @param _takerCardOrChecklistId If taker is the 0-address, then this is a checklist ID. If not, then it's a card ID.
  /// @param _salt A random uint256 to differentiate trades that have otherwise identical params.
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
      address(this),
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
