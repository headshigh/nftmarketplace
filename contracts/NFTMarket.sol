// contracts/GameItem.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
//adds new private variable owner and modifies connstructor to assign owner var with the address of deployer of the contract

struct NFTListing {
    uint256 price;
    address seller;
}

contract NFTMarket is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter public _tokenIds;
    mapping(uint256 => NFTListing) private _listings;

    constructor() ERC721("FiveIdiot's  NFT", "FIN") {}

    event NFTTransfer(
        uint256 tokenID,
        address from,
        address to,
        string tokenURI,
        uint256 price
    );

    function createNFT(string calldata tokenURI) public {
        _tokenIds.increment();
        uint256 currentId = _tokenIds.current();
        _safeMint(msg.sender, currentId);
        _setTokenURI(currentId, tokenURI);
        emit NFTTransfer(currentId, address(0), msg.sender, tokenURI, 0);
    }

    function listNFT(uint256 tokenID, uint price) public {
        require(price > 0, "NFTMarket:Price should be greater the zero");
        transferFrom(msg.sender, address(this), tokenID);
        _listings[tokenID] = NFTListing(price, msg.sender); //the token i.e nft is now on the contract
        emit NFTTransfer(tokenID, msg.sender, address(this), "", price);
    }

    function buyNFT(uint256 tokenID) public payable {
        NFTListing memory listing = _listings[tokenID];
        require(listing.price > 0, "NFTMarket:nft not listed for sale");
        require(msg.value == listing.price, "NFTMarket:Incorrect price");
        ERC721(address(this)).transferFrom(address(this), msg.sender, tokenID); //this is beauty i.e the nft is transferred from contract adress to buyers
        payable(listing.seller).transfer((listing.price * 95) / (100)); //transfer 95 percent to owner
        clearListing(tokenID);
        emit NFTTransfer(tokenID, address(this), msg.sender, "", 0);
    }

    function cancelListing(uint256 tokenId) public {
        NFTListing memory listing = _listings[tokenId];
        require(listing.price > 0, "NFTMarket:nft is not listed for sale");
        require(
            listing.seller == msg.sender,
            "NFTMarktet:Not allowed to cancel listing"
        );
        ERC721(address(this)).transferFrom(
            address(this),
            listing.seller,
            tokenId
        );
        clearListing(tokenId);
        emit NFTTransfer(tokenId, address(this), listing.seller, "", 0);
    }

    function withdrawFunds() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "NFTMarket:balance is zero");
        payable(msg.sender).transfer(balance);
    } //withdraw funds on the contract

    function clearListing(uint tokenID) private {
        _listings[tokenID].price = 0;
        _listings[tokenID].seller = address(0);
    }
}
