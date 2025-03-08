// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./NftBox.sol";

error TradeNft__NotOwner();
error TradeNft__PriceMustBeAboveZero();
error TradeNft__AlreadyOnSale();
error TradeNft__NotApproved();
error TradeNft__IsNotListed();
error TradeNft__AlreadyOwner();
error TradeNft__PriceNotMet();
error TradeNft__NoProceeds();
error TradeNft__TransferFailed();

contract TradeNft is ReentrancyGuard {
    struct NftSale {
        uint256 tokenId;
        address owner;
        uint256 price;
        bool sell;
    }
    mapping(uint256 => NftSale) public tokenIdToNft;
    address private immutable i_nftAddress;
    IERC721 private immutable i_erc721Nft;
    NftBox public i_nftContract;

    modifier isOwner(uint256 tokenId, address spender) {
        IERC721 nft = IERC721(i_nftAddress);
        address owner = nft.ownerOf(tokenId);
        if (spender != owner) {
            revert TradeNft__NotOwner();
        }
        _;
    }

    event SellNft(address owner, uint256 tokenId, uint256 price, bool sell);
    event TakeDownNft(address owner, uint256 tokenId, uint256 price, bool sell);
    event UpdateNftPrice(
        address owner,
        uint256 tokenId,
        uint256 price,
        bool sell
    );
    event BuyNft(
        address newOwner,
        address seller,
        uint256 tokenId,
        uint256 price,
        bool sell
    );
    event ProceedsSent(address owner, uint256 proceeds);

    modifier isListed(uint256 tokenId) {
        NftSale memory nft = tokenIdToNft[tokenId];
        if (!nft.sell) {
            revert TradeNft__IsNotListed();
        }
        _;
    }
    mapping(address => uint256) private s_proceeds;

    constructor(address nftAddress) {
        i_nftAddress = nftAddress;
        i_erc721Nft = IERC721(nftAddress);
        i_nftContract = NftBox(nftAddress);
    }

    function sellNft(
        uint256 tokenId,
        uint256 price
    ) external isOwner(tokenId, msg.sender) nonReentrant {
        if (tokenIdToNft[tokenId].tokenId == tokenId) {
            NftSale memory nft = tokenIdToNft[tokenId];
            if (nft.sell) {
                revert TradeNft__AlreadyOnSale();
            }
        }

        if (price <= 0) {
            revert TradeNft__PriceMustBeAboveZero();
        }

        if (i_erc721Nft.getApproved(tokenId) != address(this)) {
            revert TradeNft__NotApproved();
        }
        tokenIdToNft[tokenId] = NftSale(tokenId, msg.sender, price, true);
        emit SellNft(msg.sender, tokenId, price, true);
    }

    function takeDownNft(
        uint256 tokenId
    ) public isOwner(tokenId, msg.sender) isListed(tokenId) nonReentrant {
        NftSale memory nft = tokenIdToNft[tokenId];
        tokenIdToNft[tokenId] = NftSale(tokenId, msg.sender, 0, false);
        emit TakeDownNft(nft.owner, nft.tokenId, 0, false);
    }

    function updateNftPrice(
        uint256 tokenId,
        uint256 price
    ) public isOwner(tokenId, msg.sender) isListed(tokenId) nonReentrant {
        if (price <= 0) {
            revert TradeNft__PriceMustBeAboveZero();
        }
        NftSale memory nft = tokenIdToNft[tokenId];
        tokenIdToNft[tokenId] = NftSale(tokenId, msg.sender, price, true);
        emit UpdateNftPrice(nft.owner, nft.tokenId, price, true);
    }

    function buyNft(
        uint256 tokenId
    ) public payable nonReentrant isListed(tokenId) {
        NftSale memory nft = tokenIdToNft[tokenId];
        // we cant buy our own NFT
        IERC721 nft721 = IERC721(i_nftAddress);
        address owner = nft721.ownerOf(tokenId);
        if (owner == msg.sender) {
            revert TradeNft__AlreadyOwner();
        }
        if (msg.value < nft.price) {
            revert TradeNft__PriceNotMet();
        }
        s_proceeds[nft.owner] = s_proceeds[nft.owner] + msg.value;
        address formOwner = nft.owner;
        IERC721(i_nftAddress).safeTransferFrom(formOwner, msg.sender, tokenId);
        tokenIdToNft[tokenId] = NftSale(tokenId, msg.sender, 0, false);
        emit BuyNft(msg.sender, formOwner, tokenId, 0, false);
    }

    function withdrawProceeds() external {
        uint256 proceeds = s_proceeds[msg.sender];
        if (proceeds <= 0) {
            revert TradeNft__NoProceeds();
        }
        s_proceeds[msg.sender] = 0;
        (bool success, ) = payable(msg.sender).call{value: proceeds}("");
        if (!success) {
            revert TradeNft__TransferFailed();
        }
        emit ProceedsSent(msg.sender, proceeds);
    }

    function getProceeds(address user) public view returns (uint256) {
        return s_proceeds[user];
    }

    function getNftAddress() public view returns (address) {
        return i_nftAddress;
    }
}
