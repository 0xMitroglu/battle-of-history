const { parseEther } = require("ethers/lib/utils")
const { ethers } = require("hardhat")

const networkConfig = {
    5: {
        name: "goerli", //https://docs.chain.link/vrf/v2/subscription/supported-networks/
        vrfCoordinatorV2: "0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D",
        mintFee: ethers.utils.parseEther("0.01"),
        gasLane:
            "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15",
        subscriptionId: "1956",
        callbackGasLimit: "500000",
        ethUsdPriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
    },
    31337: {
        name: "hardhat",
        mintFee: ethers.utils.parseEther("1"),
        gasLane:
            "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15", //it doesnt matter what we put as address here
        callbackGasLimit: "500000",
    },
    11155111: {
        name: "sepolia",
        vrfCoordinatorV2: "0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625",
        gasLane:
            "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c",
        subscriptionId: "1956",
        callbackGasLimit: "2000000",
        ethUsdPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
    },
}
const developmentChains = ["hardhat", "localhost"]
const DECIMALS = "18"
const INITIAL_PRICE = 160000000000
module.exports = { networkConfig, developmentChains, DECIMALS, INITIAL_PRICE }
/*
 */
