pragma solidity ^0.4.21;

import "./WorldCupInfo.sol";

contract StrikersState is WorldCupInfo {
  /// @dev Emit this event when the owner changes the contract state.
  event StateChanged(State state);

  /// @dev Maybe paused should be a bool public?
  enum State { WaitingForNextMint, Minting, DoneMinting, Selling, SalePaused, SaleComplete }

  /// @dev The contract's current state. Defaults to WaitingForNextMint
  State public state;

  modifier requireState(State _state) {
    require(state == _state);
    _;
  }

  modifier requireNotState(State _state) {
    require(state != _state);
    _;
  }

  function changeState(State _state) public onlyOwner {
    state = _state;
    emit StateChanged(state);
  }
}
