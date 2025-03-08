// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
error User__NotOwner();
error User__NotPermitted();

contract UserContract {
    struct User {
        address userAddress;
        string name;
        string image;
    }
    address public i_tradeNft;
    address public i_nftBox;
    address public immutable i_owner;
    uint256 peopleRegistered = 0;
    mapping(address => User) public s_addressToUser;
    mapping(uint256 => address) public s_amountToAddress;

    // A mapping from all of the tokenIds to the address
    constructor(address owner) {
        i_owner = owner;
    }

    function setAddresses(address nftBox, address tradeNft) public {
        if (msg.sender == i_owner) {
            i_tradeNft = tradeNft;
            i_nftBox = nftBox;
        }
    }

    modifier isOwner(address user) {
        if (user != msg.sender) {
            revert User__NotOwner();
        }
        _;
    }

    function setUser(
        address userAddress,
        string memory name,
        string memory image
    ) public isOwner(userAddress) {
        bool userCheck = userExists(userAddress);
        if (userCheck) {} else {
            s_addressToUser[userAddress] = User(userAddress, name, image);
            s_amountToAddress[peopleRegistered + 1] = userAddress;
            peopleRegistered += 1;
        }
    }

    function changeUserInfo(
        address userAddress,
        string memory name,
        string memory image
    ) public isOwner(userAddress) {
        bool userCheck = userExists(userAddress);
        if (userCheck) {
            s_addressToUser[userAddress] = User(userAddress, name, image);
        } else {}
    }

    function userExists(address user) public returns (bool) {
        if (s_addressToUser[user].userAddress == user) {
            return true;
        } else {
            return false;
        }
    }
}
