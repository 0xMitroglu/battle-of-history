const { network, ethers } = require("hardhat")
const {
    developmentChains,
    DECIMALS,
    INITIAL_PRICE,
} = require("../helper-hardhat-config")
const BASE_FEE = "250000000000000000" // it's the premium It costs 0.25 LINK
const GAS_PRICE_LINK = 1e9 // link per gas, is this the gas lane? // 0.000000001 LINK per gas

//link per gas,  calculated value on the gas price of the chain
module.exports = async (hre) => {
    // when the deploy gets run hardhat auto passes the hre data in the function
    const { getNamedAccounts, deployments } = hre
    //hre.getNamedAccount + hre.deployments
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const args = [BASE_FEE, GAS_PRICE_LINK]
    if (developmentChains.includes(network.name)) {
        log("Local network detected!!! Deploying mocks.......")
        await deploy("VRFCoordinatorV2Mock", {
            from: deployer,
            log: true,
            args: args,
        })
        await deploy("MockV3Aggregator", {
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_PRICE],
        })
        log("Mocks Deployed!")
        log("-------------------------------------")
    }
}
module.exports.tags = ["all", "mocks"]
