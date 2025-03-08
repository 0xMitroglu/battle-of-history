// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
import "./NftBox.sol";
import "./Characters.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
error GameCard__NotOwner();
error GameCard__PlayerNotFound();
error GameCard__PlayerNotAllowed();
error GameCard__NotOpponent();
error GameCard__AlreadyOpponentFound();

contract GameCard is VRFConsumerBaseV2 {
    enum PlayerStatus {
        SEARCHING,
        FOUND,
        PLAYING,
        OVER
    }
    struct Player {
        uint256 game;
        address player;
        uint256[3] tokenIdArray;
        address opponent;
        PlayerStatus status;
    }
    struct Game {
        address winner;
        address loser;
        bool draw;
    }
    event MatchFound(address player1, address player2);
    event Match(address winner, address looser, bool draw);
    event AddedToList(
        address caller,
        uint256[3] tokenId,
        address opponent,
        PlayerStatus status
    );
    event MatchBeginsSoon(address player1, address player2, uint256 requestId);
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    uint64 private immutable i_subscriptionId;
    bytes32 private immutable i_gasLane;
    uint32 private immutable i_callbackGasLimit;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 3;
    mapping(address => Player) public s_addressInfo;
    mapping(uint256 => address[2]) public s_requestIdToPlayers;
    address[] public currentPlayers;
    NftBox public i_contractNftBox;
    address private immutable i_nftAddress;
    address private immutable i_characterAddress;

    Characters public i_contractCharacter;
    uint256 public s_gameCounter;
    mapping(uint256 => Game) public finshedGames;
    modifier checkPlayers(address player1, address player2) {
        if (
            s_addressInfo[player1].player != player1 ||
            s_addressInfo[player2].player != player2
        ) {
            revert GameCard__PlayerNotFound();
        }
        if (
            (s_addressInfo[player1].status != PlayerStatus.FOUND) ||
            (s_addressInfo[player2].status != PlayerStatus.FOUND)
        ) {
            revert GameCard__PlayerNotAllowed();
        }
        if (
            s_addressInfo[player1].opponent != player2 ||
            s_addressInfo[player2].opponent != player1
        ) {
            revert GameCard__NotOpponent();
        }
        _; /* this indicates that the rest of the main function will be run  */
    }

    constructor(
        address nftBoxAddress,
        address characterAddress,
        address vrfCoordinatorV2,
        uint64 subscriptionId,
        bytes32 gasLane,
        uint32 callbackGasLimit
    ) VRFConsumerBaseV2(vrfCoordinatorV2) {
        i_contractNftBox = NftBox(nftBoxAddress);
        i_nftAddress = nftBoxAddress;
        i_characterAddress = characterAddress;
        i_contractCharacter = Characters(characterAddress);
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_subscriptionId = subscriptionId;
        i_gasLane = gasLane;
        i_callbackGasLimit = callbackGasLimit;
        s_gameCounter = 0;
    }

    function enterGame(
        uint256 tokenId1,
        uint256 tokenId2,
        uint256 tokenId3
    ) public {
        IERC721 nft = IERC721(i_nftAddress);
        (, , bool opened1, ) = i_contractNftBox.mappingNfts(tokenId1);
        (, , bool opened2, ) = i_contractNftBox.mappingNfts(tokenId2);
        (, , bool opened3, ) = i_contractNftBox.mappingNfts(tokenId3);
        if (
            nft.ownerOf(tokenId1) != msg.sender ||
            !opened1 ||
            tokenId1 == tokenId2 ||
            tokenId2 == tokenId3 ||
            tokenId3 == tokenId1
        ) {
            revert GameCard__NotOwner();
        }

        if (nft.ownerOf(tokenId2) != msg.sender || !opened2) {
            revert GameCard__NotOwner();
        }

        if (nft.ownerOf(tokenId3) != msg.sender || !opened3) {
            revert GameCard__NotOwner();
        }
        if (s_addressInfo[msg.sender].status == PlayerStatus.FOUND) {
            revert GameCard__AlreadyOpponentFound();
        }
        if (currentPlayers.length == 0) {
            currentPlayers.push(msg.sender);
            s_addressInfo[msg.sender] = Player(
                s_gameCounter,
                msg.sender,
                [tokenId1, tokenId2, tokenId3],
                0x0000000000000000000000000000000000000000,
                PlayerStatus.SEARCHING
            );
            emit AddedToList(
                msg.sender,
                [tokenId1, tokenId2, tokenId3],
                0x0000000000000000000000000000000000000000,
                PlayerStatus.SEARCHING
            );
            s_gameCounter++;
        } else {
            address opponent = currentPlayers[0];
            if (opponent == msg.sender) {
                revert GameCard__PlayerNotAllowed();
            }
            Player memory opponentStruct = s_addressInfo[opponent];

            s_addressInfo[opponent] = Player(
                opponentStruct.game,
                opponent,
                opponentStruct.tokenIdArray,
                msg.sender,
                PlayerStatus.FOUND
            );
            s_addressInfo[msg.sender] = Player(
                opponentStruct.game,
                msg.sender,
                [tokenId1, tokenId2, tokenId3],
                opponent,
                PlayerStatus.FOUND
            );
            for (uint256 i = 0; i < currentPlayers.length; i++) {
                if (currentPlayers[i] == opponent) {
                    for (uint256 j = i; j < currentPlayers.length - 1; j++) {
                        currentPlayers[j] = currentPlayers[j + 1];
                    }
                    currentPlayers.pop();
                    break;
                }
            }
            emit MatchFound(msg.sender, opponent);
            playGame(msg.sender, opponent);
        }
    }

    function playGame(
        address player1Address,
        address player2Address
    )
        private
        checkPlayers(player1Address, player2Address)
        returns (uint256 requestId)
    {
        // Get Player1 Data of TokenId
        //We get the tokenUri and the
        Player memory player1 = s_addressInfo[player1Address];
        Player memory player2 = s_addressInfo[player2Address];

        s_addressInfo[player1Address] = Player(
            player1.game,
            player1Address,
            player1.tokenIdArray,
            player2Address,
            PlayerStatus.PLAYING
        );
        s_addressInfo[player2Address] = Player(
            player1.game,
            player2Address,
            player2.tokenIdArray,
            player1Address,
            PlayerStatus.PLAYING
        );
        requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUM_WORDS
        );
        s_requestIdToPlayers[requestId] = [player1Address, player2Address];
        emit MatchBeginsSoon(player1Address, player2Address, requestId);
    }

    function fulfillRandomWords(
        uint256 requestId,
        uint256[] memory randomWords
    ) internal override {
        address[2] memory players = s_requestIdToPlayers[requestId];
        Characters.Person[3] memory player1Characters = getCharacter(
            players[0]
        );
        Characters.Person[3] memory player2Characters = getCharacter(
            players[1]
        );

        s_addressInfo[players[0]] = Player(
            s_addressInfo[players[0]].game,
            players[0],
            s_addressInfo[players[0]].tokenIdArray,
            players[1],
            PlayerStatus.OVER
        );
        s_addressInfo[players[1]] = Player(
            s_addressInfo[players[1]].game,
            players[1],
            s_addressInfo[players[1]].tokenIdArray,
            players[0],
            PlayerStatus.OVER
        );
        // Round 1
        uint256 removedIndex = randomWords[0] % 3;

        uint256 player1Points = 0;
        uint256 player2Points = 0;
        player1Points = 0;
        player2Points = 0;
        if (
            player1Characters[removedIndex].attack >
            player2Characters[removedIndex].attack
        ) {
            player1Points++;
        } else if (
            player1Characters[removedIndex].attack <
            player2Characters[removedIndex].attack
        ) {
            player2Points++;
        } else {
            player1Points++;
            player2Points++;
        }
        uint256 game = s_addressInfo[s_requestIdToPlayers[requestId][0]].game;
        // Remove character from the array
        Characters.Person[2] memory player1Characters2;
        Characters.Person[2] memory player2Characters2;
        for (uint256 i = 0; i < 3; i++) {
            if (i == removedIndex) {
                continue;
            } else if (i < removedIndex) {
                player1Characters2[i] = player1Characters[i];
                player2Characters2[i] = player2Characters[i];
            } else {
                player1Characters2[i - 1] = player1Characters[i];
                player2Characters2[i - 1] = player2Characters[i];
            }
        }

        if (
            player1Characters2[randomWords[1] % 2].defence >
            player2Characters2[randomWords[1] % 2].defence
        ) {
            player1Points++;
        } else if (
            player1Characters2[randomWords[1] % 2].defence <
            player2Characters2[randomWords[1] % 2].defence
        ) {
            player2Points++;
        } else {
            player1Points++;
            player2Points++;
        }

        // Remove character from the array
        Characters.Person[1] memory player1Characters1;
        Characters.Person[1] memory player2Characters1;
        for (uint256 i = 0; i < 2; i++) {
            if (i == randomWords[1] % 2) {
                continue;
            } else if (i < randomWords[1] % 2) {
                player1Characters1[i] = player1Characters2[i];
                player2Characters1[i] = player2Characters2[i];
            } else {
                player1Characters1[i - 1] = player1Characters2[i];
                player2Characters1[i - 1] = player2Characters2[i];
            }
        }
        // Because of the stack is too deep
        address player1Address = players[0];
        address player2Address = players[1];

        // Round 3
        if (player1Characters1[0].tactics > player2Characters1[0].tactics) {
            player1Points++;
        } else if (
            player1Characters1[0].tactics < player2Characters1[0].tactics
        ) {
            player2Points++;
        } else {
            player1Points++;
            player2Points++;
        }

        (address winner, address loser, bool draw) = getResult(
            player1Address,
            player1Points,
            player2Address,
            player2Points,
            game
        );

        emit Match(winner, loser, draw);
    }

    function getResult(
        address player1,
        uint256 player1Points,
        address player2,
        uint256 player2Points,
        uint256 game
    ) private returns (address, address, bool) {
        if (player1Points > player2Points) {
            finshedGames[game] = Game(player1, player2, false);
            return (player1, player2, false);
        } else if (player2Points > player1Points) {
            finshedGames[game] = Game(player2, player1, false);
            return (player2, player1, false);
        } else {
            finshedGames[game] = Game(player1, player2, true);
            return (
                0x0000000000000000000000000000000000000000,
                0x0000000000000000000000000000000000000000,
                true
            );
        }
    }

    function getCharacter(
        address player
    ) private returns (Characters.Person[3] memory) {
        uint256[3] memory player1TokenArray = s_addressInfo[player]
            .tokenIdArray;
        (
            ,
            string memory player1tokenId1Uri,
            ,
            uint256 player1tokenId1BoxType
        ) = i_contractNftBox.mappingNfts(player1TokenArray[0]);
        (
            ,
            string memory player1tokenId2Uri,
            ,
            uint256 player1tokenId2BoxType
        ) = i_contractNftBox.mappingNfts(player1TokenArray[1]);
        (
            ,
            string memory player1tokenId3Uri,
            ,
            uint256 player1tokenId3BoxType
        ) = i_contractNftBox.mappingNfts(player1TokenArray[2]);

        Characters.Person memory character1 = getData(
            player1tokenId1BoxType,
            player1tokenId1Uri
        );
        Characters.Person memory character2 = getData(
            player1tokenId2BoxType,
            player1tokenId2Uri
        );
        Characters.Person memory character3 = getData(
            player1tokenId3BoxType,
            player1tokenId3Uri
        );
        Characters.Person[3] memory array = [
            character1,
            character2,
            character3
        ];
        return array;
    }

    function getData(
        uint256 boxType,
        string memory tokenUri
    ) private returns (Characters.Person memory) {
        if (boxType == 0) {
            for (
                uint256 i = 0;
                i < i_contractCharacter.normalPersonsLength();
                i++
            ) {
                (string memory tokenUriLoop, , , ) = i_contractCharacter
                    .normalPersons(i);
                if (
                    keccak256(abi.encodePacked(tokenUriLoop)) ==
                    keccak256(abi.encodePacked(tokenUri))
                ) {
                    (
                        string memory tokenUri,
                        uint256 strength,
                        uint256 dexterity,
                        uint256 intellect
                    ) = i_contractCharacter.normalPersons(i);

                    Characters.Person memory character = Characters.Person({
                        tokenUri: tokenUri,
                        attack: strength,
                        defence: dexterity,
                        tactics: intellect
                    });
                    return character;
                }
            }
        } else if (boxType == 1) {
            for (
                uint256 i = 0;
                i < i_contractCharacter.rarePersonsLength();
                i++
            ) {
                (string memory tokenUriLoop, , , ) = i_contractCharacter
                    .rarePersons(i);
                if (
                    keccak256(abi.encodePacked(tokenUriLoop)) ==
                    keccak256(abi.encodePacked(tokenUri))
                ) {
                    (
                        string memory tokenUri,
                        uint256 strength,
                        uint256 dexterity,
                        uint256 intellect
                    ) = i_contractCharacter.rarePersons(i);

                    Characters.Person memory character = Characters.Person({
                        tokenUri: tokenUri,
                        attack: strength,
                        defence: dexterity,
                        tactics: intellect
                    });
                    return character;
                }
            }
        } else if (boxType == 2) {
            for (
                uint256 i = 0;
                i < i_contractCharacter.legendaryPersonsLength();
                i++
            ) {
                (string memory tokenUriLoop, , , ) = i_contractCharacter
                    .legendaryPersons(i);
                if (
                    keccak256(abi.encodePacked(tokenUriLoop)) ==
                    keccak256(abi.encodePacked(tokenUri))
                ) {
                    (
                        string memory tokenUri,
                        uint256 strength,
                        uint256 dexterity,
                        uint256 intellect
                    ) = i_contractCharacter.legendaryPersons(i);

                    Characters.Person memory character = Characters.Person({
                        tokenUri: tokenUri,
                        attack: strength,
                        defence: dexterity,
                        tactics: intellect
                    });
                    return character;
                }
            }
        }
    }

    function getCurrentPlayers() public view returns (uint256) {
        return currentPlayers.length;
    }

    function getTokenIds(
        address user,
        uint256 index
    ) public view returns (uint256) {
        return s_addressInfo[user].tokenIdArray[index];
    }
}
