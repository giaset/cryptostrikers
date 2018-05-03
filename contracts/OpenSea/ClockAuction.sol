pragma solidity ^0.4.18;

import "./ClockAuctionBase.sol";
import "openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";
import "openzeppelin-solidity/contracts/lifecycle/Pausable.sol";

/// @title Clock auction for non-fungible tokens.
contract ClockAuction is Pausable, ClockAuctionBase {

    /// @dev Constructor verifies the owner cut is in the valid range.
    /// @param _cut - percent cut the owner takes on each auction, must be
    ///  between 0-10,000.
    function ClockAuction(uint256 _cut) public {
        require(_cut <= 10000);
        ownerCut = _cut;
    }

    /// @dev Remove all Ether from the contract, which is the owner's cuts
    ///  as well as any Ether sent directly to the contract address.
    ///  Always transfers to the NFT contract, but can be called either by
    ///  the owner or the NFT contract.
    function withdrawBalance() external {
        require(
            msg.sender == owner
        );
        msg.sender.transfer(this.balance);
    }

    /// @dev Bids on an open auction, completing the auction and transferring
    ///  ownership of the NFT if enough Ether is supplied.
    /// @param _nftAddress - address of a deployed contract implementing
    ///  the Nonfungible Interface.
    /// @param _tokenId - ID of token to bid on.
    function purchase(address _nftAddress, uint256 _tokenId)
        public
        payable
        whenNotPaused
    {
        // _bid will throw if the bid or funds transfer fails
        _bid(_nftAddress, _tokenId, msg.value);
        _transfer(_nftAddress, msg.sender, _tokenId);
    }

    /// @dev Cancels an auction that hasn't been won yet.
    ///  Returns the NFT to original owner.
    /// @notice This is a state-modifying function that can
    ///  be called while the contract is paused.
    /// @param _nftAddress - Address of the NFT.
    /// @param _tokenId - ID of token on auction
    function cancelDutchAuction(address _nftAddress, uint256 _tokenId)
        public
    {
        Auction storage auction = nftToTokenIdToAuction[_nftAddress][_tokenId];
        require(_isOnAuction(auction));
        address seller = auction.seller;
        require(msg.sender == seller);
        _cancelAuction(_nftAddress, _tokenId, seller);
    }

    /// @dev Cancels an auction when the contract is paused.
    ///  Only the owner may do this, and NFTs are returned to
    ///  the seller. This should only be used in emergencies.
    /// @param _nftAddress - Address of the NFT.
    /// @param _tokenId - ID of the NFT on auction to cancel.
    function cancelWhenPaused(address _nftAddress, uint256 _tokenId)
        whenPaused
        onlyOwner
        public
    {
        Auction storage auction = nftToTokenIdToAuction[_nftAddress][_tokenId];
        require(_isOnAuction(auction));
        _cancelAuction(_nftAddress, _tokenId, auction.seller);
    }

    /// @dev Returns auction info for an NFT on auction.
    /// @param _nftAddress - Address of the NFT.
    /// @param _tokenId - ID of NFT on auction.
    function getDutchAuction(address _nftAddress, uint256 _tokenId)
        public
        view
        returns
    (
        address seller,
        uint256 startingPrice,
        uint256 endingPrice,
        uint256 duration,
        uint256 startedAt
    ) {
        Auction storage auction = nftToTokenIdToAuction[_nftAddress][_tokenId];
        require(_isOnAuction(auction));
        return (
            auction.seller,
            auction.startingPrice,
            auction.endingPrice,
            auction.duration,
            auction.startedAt
        );
    }

    /// @dev Returns the current price of an auction.
    /// @param _nftAddress - Address of the NFT.
    /// @param _tokenId - ID of the token price we are checking.
    function getCurrentPrice(address _nftAddress, uint256 _tokenId)
        public
        view
        returns (uint256)
    {
        Auction storage auction = nftToTokenIdToAuction[_nftAddress][_tokenId];
        require(_isOnAuction(auction));
        return _currentPrice(auction);
    }

}
