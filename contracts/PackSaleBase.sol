pragma solidity ^0.4.23;

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

/// @title Base contract for our PackSale. Defines all the models needed to sell cards in packs.
/// @author The CryptoStrikers Team
contract PackSaleBase is Ownable {

  /*** EVENTS ***/

  /// @dev Emit this event when the owner changes a sale's packPrice.
  event PackPriceChanged(uint8 saleId, uint256 packPrice);

  /// @dev Emit this event when the owner creates a sale.
  event SaleCreated(uint8 saleId, uint64 duration, uint256 packPrice);

  /// @dev Emit this event when the owner starts a sale.
  event SaleStarted(uint8 saleId);

  /// @dev Emit this event when the owner pauses a sale.
  event SalePaused(uint8 saleId);

  /// @dev Emit this event when the owner resumes a sale.
  event SaleResumed(uint8 saleId);

  /*** DATA TYPES ***/

  /// @dev All the possible states for a PackSale
  enum SaleState {
    // Sale just created, owner needs to load all the packs into the contract
    WaitingForPacks,

    // Sale is on!
    Selling,

    // For some reason, we had to pause the sale
    Paused
  }

  /// @dev The PackSale object
  struct PackSale {
    // The time at which the PackSale started
    uint64 startTime;

    // Sale duration (in seconds). Unsold packs are burned.
    // If the PackSale has a duration, it is a Flash Sale.
    // If not, it's just a Normal Sale.
    uint64 duration;

    // The price, in wei, for 1 pack of cards.
    uint256 packPrice;

    // The total number of packs offered in this sale
    uint16 packsOffered;

    // The number of packs sold so far in this sale
    uint16 packsSold;

    // The PackSale's current state (see above)
    SaleState state;
  }

  /*** STORAGE ***/

  /// @dev Sanity check that allows us to ensure that we are pointing to the
  ///  right contract in our setPackSaleAddress() call.
  bool public isPackSaleContract = true;

  /// @dev All the pack sales we have ever created (even expired ones)
  PackSale[] public sales;

  /*** MODIFIERS ***/

  /// @dev Modifier to make a function callable only when the sale is in a given state.
  modifier requireStateForSale(uint8 _saleId, SaleState _state) {
    require(sales[_saleId].state == _state);
    _;
  }

  /*** FUNCTIONS ***/

  function salesCount() external view returns (uint256) {
    return sales.length;
  }

  /// @dev Allows the contract owner to create a new pack sale
  /// @param _duration The duration of the pack sale (leave 0 for a Normal Sale, which are untimed)
  function createSale(uint64 _duration, uint256 _packPrice) external onlyOwner {
    PackSale memory sale = PackSale({
      startTime: 0,
      duration: _duration,
      packPrice: _packPrice,
      packsOffered: 0,
      packsSold: 0,
      state: SaleState.WaitingForPacks
    });
    uint256 saleId = sales.push(sale) - 1;
    emit SaleCreated(uint8(saleId), _duration, _packPrice);
  }

  function setPackPriceForSale(uint8 _saleId, uint256 _packPrice) external onlyOwner {
    sales[_saleId].packPrice = _packPrice;
    emit PackPriceChanged(_saleId, _packPrice);
  }

  function startSale(uint8 _saleId) external onlyOwner requireStateForSale(_saleId, SaleState.WaitingForPacks) {
    PackSale storage sale = sales[_saleId];
    sale.startTime = uint64(now);
    sale.state = SaleState.Selling;
    emit SaleStarted(_saleId);
  }

  function pauseSale(uint8 _saleId) external onlyOwner requireStateForSale(_saleId, SaleState.Selling) {
    sales[_saleId].state = SaleState.Paused;
    emit SalePaused(_saleId);
  }

  function resumeSale(uint8 _saleId) external onlyOwner requireStateForSale(_saleId, SaleState.Paused) {
    sales[_saleId].state = SaleState.Selling;
    emit SaleResumed(_saleId);
  }

  function saleInProgress(uint8 _saleId) public view returns (bool) {
    PackSale memory sale = sales[_saleId];
    bool validTime = (sale.duration == 0) || (now < sale.startTime + sale.duration);
    return validTime && sale.state == SaleState.Selling;
  }
}
