const { network, ethers } = require("hardhat")
const { MIN_DELAY, developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify.js")
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const nftCard = await ethers.getContract("NftBox")
    log("----------------------")
    const args = [nftCard.address]
    const tradeNft = await deploy("TradeNft", {
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
        await verify(tradeNft.address, args)
    }
}
module.exports.tags = ["all", "tradenft", "main"]
