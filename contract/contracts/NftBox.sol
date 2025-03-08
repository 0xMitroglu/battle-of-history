// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./Characters.sol";

error NftBox__NeedMoreETHSent();
error NftBox__NotOwner();
error NftBox__TokenIdNotExist();
error NftBox__AlreadyOpened();
error NftBox__TransferFailed();
error NftBox__NotNftAddressCalling();

contract NftBox is VRFConsumerBaseV2, ERC721URIStorage, Ownable {
    Characters public i_charactersContract;
    // Trade Nft Address for the setMapping
    address public tradeNftAddress;
    //TokenCounter
    uint256 private s_tokenCounter;
    //3 Types Of Boxes with their TokenUri
    string[] private NftBoxesUri;
    //Card Uris
    //Nft
    struct Nft {
        uint256 tokenId;
        string tokenUri;
        bool Boxopened;
        uint256 boxType /* 0 -> normal; 1-> rare; 2 -> legendary*/;
    }

    //Price Boxes
    uint256 public constant PRICE_NORMAL_BOX_USD = 10;
    uint256 public constant PRICE_RARE_BOX_USD = 50;
    uint256 public constant PRICE_LEGENDARY_BOX_USD = 100;
    // Random Request for the NFt Card
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    uint64 private immutable i_subscriptionId;
    bytes32 private immutable i_gasLane;
    uint32 private immutable i_callbackGasLimit;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 1;
    //Price Feed
    AggregatorV3Interface private immutable i_priceFeed;
    //mappings
    mapping(uint256 => Nft) public mappingNfts;
    mapping(uint256 => uint256) public mappingRequestToToken;

    //Events
    event NormalBoxMinted(
        address owner,
        uint256 tokenId,
        string tokenUri,
        uint256 price
    );
    event RareBoxMinted(
        address owner,
        uint256 tokenId,
        string tokenUri,
        uint256 price
    );
    event LegendaryBoxMinted(
        address owner,
        uint256 tokenId,
        string tokenUri,
        uint256 price
    );
    event OpenBoxRandomRequested(uint256 requestId, address sender);
    event BoxOpened(address owner, uint256 tokenId, string tokenUri);
    //modifiers
    modifier isOwner(uint256 tokenId, address spender) {
        address owner = ownerOf(tokenId);
        if (spender != owner) {
            revert NftBox__NotOwner();
        }
        _;
    }
    modifier tokenIdExists(address owner, uint256 tokenId) {
        bool success = _exists(tokenId);
        if (!success) {
            revert NftBox__TokenIdNotExist();
        }
        _;
    }

    constructor(
        address vrfCoordinatorV2,
        uint64 subscriptionId,
        bytes32 gasLane,
        uint32 callbackGasLimit,
        string[3] memory boxesUri,
        address priceFeedAddress,
        address charactersAddress
    )
        ERC721("CardBoxes", "CABO")
        VRFConsumerBaseV2(vrfCoordinatorV2)
        Ownable()
    {
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_subscriptionId = subscriptionId;
        i_gasLane = gasLane;
        i_callbackGasLimit = callbackGasLimit;
        NftBoxesUri = boxesUri;
        i_priceFeed = AggregatorV3Interface(priceFeedAddress);
        s_tokenCounter = 0;
        i_charactersContract = Characters(charactersAddress);
    }

    function buyNormalBox() public payable {
        uint256 usdPriceInEth = priceFeedUsdToEth(PRICE_NORMAL_BOX_USD);
        if (msg.value < usdPriceInEth) {
            revert NftBox__NeedMoreETHSent();
        }
        uint256 newTokenId = s_tokenCounter; // we save the tokenCounter in a variable before updating it
        s_tokenCounter = s_tokenCounter + 1;
        _safeMint(msg.sender, newTokenId);
        string memory tokenURI = NftBoxesUri[0];
        _setTokenURI(newTokenId, tokenURI);
        mappingNfts[newTokenId] = Nft(newTokenId, tokenURI, false, 0);

        emit NormalBoxMinted(
            msg.sender /* Owner*/,
            newTokenId,
            tokenURI,
            usdPriceInEth
        );
    }

    function buyRareBox() public payable {
        uint256 usdPriceInEth = priceFeedUsdToEth(PRICE_RARE_BOX_USD);
        if (msg.value < usdPriceInEth) {
            revert NftBox__NeedMoreETHSent();
        }
        uint256 newTokenId = s_tokenCounter; // we save the tokenCounter in a variable before updating it
        s_tokenCounter = s_tokenCounter + 1;
        _safeMint(msg.sender, newTokenId);
        string memory tokenURI = NftBoxesUri[1];
        _setTokenURI(newTokenId, tokenURI);
        mappingNfts[newTokenId] = Nft(newTokenId, tokenURI, false, 1);
        emit RareBoxMinted(
            msg.sender /* Owner*/,
            newTokenId,
            tokenURI,
            usdPriceInEth
        );
        /*  setTokenId(msg.sender, newTokenId); */
    }

    function buyLegendaryBox() public payable {
        uint256 usdPriceInEth = priceFeedUsdToEth(PRICE_LEGENDARY_BOX_USD);
        if (msg.value < usdPriceInEth) {
            revert NftBox__NeedMoreETHSent();
        }
        uint256 newTokenId = s_tokenCounter; // we save the tokenCounter in a variable before updating it
        s_tokenCounter = s_tokenCounter + 1;
        _safeMint(msg.sender, newTokenId);
        string memory tokenURI = NftBoxesUri[2];
        _setTokenURI(newTokenId, tokenURI);
        mappingNfts[newTokenId] = Nft(newTokenId, tokenURI, false, 2);
        emit LegendaryBoxMinted(
            msg.sender,
            newTokenId,
            tokenURI,
            usdPriceInEth
        );
    }

    function openBox(
        uint256 tokenId
    )
        public
        tokenIdExists(msg.sender, tokenId)
        isOwner(tokenId, msg.sender)
        returns (uint256 requestId)
    {
        Nft memory nft = mappingNfts[tokenId];
        if (nft.Boxopened) {
            revert NftBox__AlreadyOpened();
        }
        requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUM_WORDS
        );
        mappingRequestToToken[requestId] = tokenId;
        emit OpenBoxRandomRequested(requestId, msg.sender);
    }

    function fulfillRandomWords(
        uint256 requestId,
        uint256[] memory randomWords
    ) internal override {
        uint256 tokenId = mappingRequestToToken[requestId];
        Nft memory nft = mappingNfts[tokenId];
        if (nft.Boxopened) {
            revert NftBox__AlreadyOpened();
        }
        string memory newUri;
        if (nft.boxType == 0) {
            uint256 randomIndex = randomWords[0] %
                i_charactersContract.normalPersonsLength();
            (string memory uri, , , ) = i_charactersContract.normalPersons(
                randomIndex
            );
            newUri = uri;
        } else if (nft.boxType == 1) {
            uint256 randomIndex = randomWords[0] %
                i_charactersContract.rarePersonsLength();
            (string memory uri, , , ) = i_charactersContract.rarePersons(
                randomIndex
            );
            newUri = uri;
        } else if (nft.boxType == 2) {
            uint256 randomIndex = randomWords[0] %
                i_charactersContract.legendaryPersonsLength();
            (string memory uri, , , ) = i_charactersContract.legendaryPersons(
                randomIndex
            );
            newUri = uri;
        } else {
            revert NftBox__AlreadyOpened();
        }
        mappingNfts[tokenId] = Nft(tokenId, newUri, true, nft.boxType);
        _setTokenURI(tokenId, newUri);
        emit BoxOpened(msg.sender, tokenId, newUri);
    }

    function withdraw() public onlyOwner {
        uint256 amount = address(this).balance;
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        if (!success) {
            revert NftBox__TransferFailed();
        }
    }

    //
    function getTokenIds(address owner) public view returns (uint256[] memory) {
        uint256[] memory tokenArray = new uint256[](s_tokenCounter);
        uint256 count = 0;
        for (uint256 i = 0; i < s_tokenCounter; i++) {
            address spender = ownerOf(i);
            if (spender == owner) {
                tokenArray[count] = i;
                count++;
            }
        }
        // resize the array to remove any unused elements
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = tokenArray[i];
        }
        return result;
    }

    function getNormalCard(uint256 index) public view returns (string memory) {
        (string memory uri, , , ) = i_charactersContract.normalPersons(index);
        return uri;
    }

    function getRareCard(uint256 index) public view returns (string memory) {
        (string memory uri, , , ) = i_charactersContract.rarePersons(index);
        return uri;
    }

    function getLegendaryCard(
        uint256 index
    ) public view returns (string memory) {
        (string memory uri, , , ) = i_charactersContract.legendaryPersons(
            index
        );
        return uri;
    }

    function getNormalCardUrisLength() public view returns (uint256) {
        return i_charactersContract.normalPersonsLength();
    }

    function getRareCardUrisLength() public view returns (uint256) {
        return i_charactersContract.rarePersonsLength();
    }

    function getLegendaryCardUrisLength() public view returns (uint256) {
        return i_charactersContract.legendaryPersonsLength();
    }

    function getPriceFeed() public view returns (AggregatorV3Interface) {
        return i_priceFeed;
    }

    function getTokenCounter() public view returns (uint256) {
        return s_tokenCounter;
    }

    function getNft(uint256 tokenId) public view returns (Nft memory) {
        return mappingNfts[tokenId];
    }

    function getNftBoxesUri(uint256 index) public view returns (string memory) {
        return NftBoxesUri[index];
    }

    function priceFeedUsdToEth(uint256 usd) public view returns (uint256) {
        (, int256 Price, , , ) = i_priceFeed.latestRoundData();
        uint256 price = (usd * 1e36) / (uint256(Price) * 1e10);
        return uint256(price);
    }
}
