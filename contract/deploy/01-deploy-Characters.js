const { network, ethers } = require("hardhat")
const { MIN_DELAY, developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
const {
    normalUri,
    normalStats,
    rareUri,
    rareStats,
    legendaryUri,
    legendaryStats,
} = require("../cardUris")
/* const { verify } = require("../utils/verify.js"); */
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    log("----------------------")
    const args = [
        normalUri,
        normalStats,
        rareUri,
        rareStats,
        legendaryUri,
        legendaryStats,
    ]
    const character = await deploy("Characters", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    /* const contract = await ethers.getContract("TradeNft")
    const mapping = await contract.i_nftContract()
    console.log("Mapping:", await contract.price()) */
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        log("Verifying......")
        await verify(character.address, args)
    }
}
module.exports.tags = ["all", "characters", "main"]
