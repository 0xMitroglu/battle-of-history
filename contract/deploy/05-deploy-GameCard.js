const { network, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
/* const { verify } = require("../utils/verify.js"); */
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    const nftCard = await ethers.getContract("NftBox")
    const character = await ethers.getContract("Characters")
    const FUND_AMOUNT = "1000000000000000000000"
    log("----------------------")
    let vrfCoordinatorV2Address, subscriptionId
    if (developmentChains.includes(network.name)) {
        const vrfCoordinatorV2Mock = await ethers.getContract(
            "VRFCoordinatorV2Mock"
        )
        vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address
        const tx = await vrfCoordinatorV2Mock.createSubscription()
        const txReceipt = await tx.wait()
        subscriptionId = txReceipt.events[0].args.subId
        await vrfCoordinatorV2Mock.fundSubscription(subscriptionId, FUND_AMOUNT)
    } else {
        vrfCoordinatorV2Address = networkConfig[chainId].vrfCoordinatorV2
        subscriptionId = networkConfig[chainId].subscriptionId
    }
    log("--------------------------")

    const args = [
        nftCard.address,
        character.address,
        vrfCoordinatorV2Address,
        subscriptionId,
        networkConfig[chainId].gasLane,

        networkConfig[chainId].callbackGasLimit,
    ]
    const gameCard = await deploy("GameCard", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    if (chainId == "31337") {
        const vrfCoordinatorV2Mock = await ethers.getContract(
            "VRFCoordinatorV2Mock"
        )
        await vrfCoordinatorV2Mock.addConsumer(subscriptionId, gameCard.address)
    }
    /* const contract = await ethers.getContract("TradeNft")
    const mapping = await contract.i_nftContract()
    console.log("Mapping:", await contract.price()) */
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        log("Verifying......")
        await verify(gameCard.address, args)
    }
}
module.exports.tags = ["all", "gamecard", "main"]
