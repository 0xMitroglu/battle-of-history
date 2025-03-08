const { network, ethers } = require("hardhat")
const { MIN_DELAY, developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
/* const { verify } = require("../utils/verify.js"); */
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    log("----------------------")
    const args = [deployer]
    const userContract = await deploy("UserContract", {
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
        await verify(userContract.address, args)
    }
}
module.exports.tags = ["all", "usercontract", "main"]
