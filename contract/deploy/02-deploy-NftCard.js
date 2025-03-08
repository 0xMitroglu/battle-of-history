const { network, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify.js")
const { rareUri, normalUri, legendaryUri } = require("../cardUris")
module.exports = async ({ getNamedAccounts, deployments }) => {
    const user = await ethers.getContract("UserContract")
    const userAddress = user.address
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    const character = await ethers.getContract("Characters")
    log("----------------------")
    const FUND_AMOUNT = "1000000000000000000000"
    const normalBoxUri = "ipfs://QmQyXFajAPJ3MhhvxUGZa2jtbYk1TWbHSLLXHLmVQ9VU2M"
    const rareBoxUri = "ipfs://QmWsCaeuFt2piubFfm281twZnBWQd6gJTGNSuzUKjYDpdv"
    const legendaryBoxUri =
        "ipfs://QmeNs5VaSQVkfmqf7uNwMtTBwUKPZX3pNU61h8NMw3UQbW"
    const boxesUri = [normalBoxUri, rareBoxUri, legendaryBoxUri] /* 
    const normalCardUris = normalUri
    const rareCardUris = rareUri
    const legendaryCardUris = legendaryUri */
    let ethUsdPriceFeedAddress
    if (developmentChains.includes(network.name)) {
        const EthUsdAggregator = await ethers.getContract("MockV3Aggregator")
        ethUsdPriceFeedAddress = EthUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId].ethUsdPriceFeed
    }
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
        vrfCoordinatorV2Address,
        subscriptionId,
        networkConfig[chainId].gasLane,

        networkConfig[chainId].callbackGasLimit,
        boxesUri,
        ethUsdPriceFeedAddress,
        character.address,
    ]
    const nftBox = await deploy("NftBox", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    log("-------------------------")
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        log("Verifying......")
        await verify(nftBox.address, args)
    } else if (chainId == "31337") {
        const vrfCoordinatorV2Mock = await ethers.getContract(
            "VRFCoordinatorV2Mock"
        )
        await vrfCoordinatorV2Mock.addConsumer(subscriptionId, nftBox.address)
    }
    log("--------------------")
}
module.exports.tags = ["all", "nftcard", "main"]
