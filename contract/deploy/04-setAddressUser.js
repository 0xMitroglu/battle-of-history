const { network, ethers } = require("hardhat")
const { MIN_DELAY } = require("../helper-hardhat-config")
/* const { verify } = require("../utils/verify.js"); */
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const userContract = await ethers.getContract("UserContract")
    const nftBox = await ethers.getContract("NftBox")
    const nftTrade = await ethers.getContract("TradeNft")
    log("----------------------")
    const reponse = await userContract.setAddresses(
        nftBox.address,
        nftTrade.address
    )
    await reponse.wait(1)
}
module.exports.tags = ["all", "setaddress", "main"]
