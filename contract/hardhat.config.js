require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-etherscan")
require("hardhat-deploy")
require("solidity-coverage")
require("hardhat-gas-reporter")
require("hardhat-contract-sizer")
require("dotenv").config()
/** @type import('hardhat/config').HardhatUserConfig */
const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL || ""
const PRIVATE_KEY = process.env.PRIVATE_KEY || ""
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || ""
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || ""
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || ""
module.exports = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            chainId: 31337,
            blockConfirmations: 1,
            /*    allowUnlimitedContractSize: true, */
        },
        localhost: {
            chainId: 31337,
            /*  allowUnlimitedContractSize: true, */
        },
        goerli: {
            url: GOERLI_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 5,
            blockConfirmations: 6, // so every command has to wait 6 confirmations
            // we wait 6 because we want etherscan to index our transaction
        },
        sepolia: {
            url: SEPOLIA_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 11155111,
            blockConfirmations: 6, // so every command has to wait 6 confirmations
            // we wait 6 because we want etherscan to index our transaction
        },
    },
    gasReporter: {
        enabled: false,
        outputFile: "gas-report.txt",
        noColors: true,
    },
    solidity: {
        // now we have more compiler versions :)
        compilers: [{ version: "0.8.7" }, { version: "0.6.6" }],
    },
    namedAccounts: {
        deployer: {
            default: 0,
            //4:1, which means on the chain 4 -> goerli the second account will be deployer
        },
        player /* same as User */: {
            default: 1,
        },
    },
    mocha: {
        timeout: 300000, //300 secs max -> if network is busy then increase this number !!!!
    },
    etherscan: {
        // yarn hardhat verify --network <NETWORK> <CONTRACT_ADDRESS> <CONSTRUCTOR_PARAMETERS>
        apiKey: {
            goerli: ETHERSCAN_API_KEY,
            sepolia: ETHERSCAN_API_KEY,
        },
        customChains: [
            {
                network: "goerli",
                chainId: 5,
                urls: {
                    apiURL: "https://api-goerli.etherscan.io/api" /* https://hardhat.org/hardhat-runner/plugins/nomiclabs-hardhat-etherscan */,
                    browserURL: "https://goerli.etherscan.io",
                },
            },
            {
                network: "sepolia",
                chainId: 11155111,
                urls: {
                    apiURL: "https://api-sepolia.etherscan.io/api" /* https://hardhat.org/hardhat-runner/plugins/nomiclabs-hardhat-etherscan */,
                    browserURL: "https://sepolia.etherscan.io",
                },
            },
        ],
    },
}
