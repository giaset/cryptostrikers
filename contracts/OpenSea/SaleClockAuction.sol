pragma solidity ^0.4.18;

import "./ClockAuction.sol";

/// @title Clock auction modified for sale of kitties
contract SaleClockAuction is ClockAuction {

    // Delegate constructor
    function SaleClockAuction(uint256 _cut) public
        ClockAuction(_cut) {}

    /// @dev Creates and begins a new auction.
    /// @param _nftAddress - The address of the NFT.
    /// @param _tokenId - ID of token to auction, sender must be owner.
    /// @param _startingPrice - Price of item (in wei) at beginning of auction.
    /// @param _endingPrice - Price of item (in wei) at end of auction.
    /// @param _duration - Length of auction (in seconds).
    function createDutchAuction(
        address _nftAddress,
        uint256 _tokenId,
        uint256 _startingPrice,
        uint256 _endingPrice,
        uint256 _duration
    )
        public
        canBeStoredWith128Bits(_startingPrice)
        canBeStoredWith128Bits(_endingPrice)
        canBeStoredWith64Bits(_duration)
    {
        address seller = msg.sender;
        _escrow(_nftAddress, msg.sender, _tokenId);
        Auction memory auction = Auction(
            _nftAddress,
            seller,
            uint128(_startingPrice),
            uint128(_endingPrice),
            uint64(_duration),
            uint64(now)
        );
        _addAuction(_nftAddress, _tokenId, auction);
    }

    /// @dev Updates lastSalePrice if seller is the nft contract
    /// Otherwise, works the same as default bid method.
    function purchase(address _nftAddress, uint256 _tokenId)
        public
        payable
    {
        // _bid verifies token ID size
        address seller = nftToTokenIdToAuction[_nftAddress][_tokenId].seller;
        uint256 price = _bid(_nftAddress, _tokenId, msg.value);
        _transfer(_nftAddress, msg.sender, _tokenId);
    }
}
