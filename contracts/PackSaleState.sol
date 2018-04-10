pragma solidity ^0.4.21;

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

contract PackSaleState is Ownable {
  /// @dev Emit this event when the owner changes the contract state.
  event SaleStateChanged(SaleState state);

  /// @dev All the possible states of the PackSale
  enum SaleState {
    // We still have the possiblity of minting more runs.
    WaitingForNextRun,

    // Owner is in the process of loading packs into the contract
    LoadingPacks,

    // Done loading packs for this run, but not yet selling
    DoneLoadingPacks,

    // Sale is on!
    Selling,

    // For some reason, we had to pause the sale (TODO: maybe make this a public boolean? see Pausable)
    SalePaused,

    // We have sold out and will not be minting any more cards.
    SaleComplete
  }

  // @dev Sanity check that allows us to ensure that we are pointing to the
  //  right auction in our setSiringAuctionAddress() call.
  bool public isPackSale = true;

  /// @dev The contract's current state. Defaults to WaitingForNextRun (0)
  SaleState public state;

  /// @dev Modifier to make a function callable only when the contract is a given state.
  modifier requireState(SaleState _state) {
    require(state == _state);
    _;
  }

  /// @dev Modifier to make a function callable only when the contract is NOT a given state.
  modifier requireNotState(SaleState _state) {
    require(state != _state);
    _;
  }

  /// @dev Called by owner to change the contract's state
  function changeState(SaleState _state) public onlyOwner {
    state = _state;
    emit SaleStateChanged(state);
  }
}
