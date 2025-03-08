const goerli = {
  chainId: "0x5",
  rpcUrls: ["https://rpc.goerli.mudit.blog/"],
  chainName: "Goerli",
  nativeCurrency: {
    name: "Goerli Ether",
    symbol: "GOETH",
    decimals: 18,
  },
  blockExplorerUrls: ["https://goerli.etherscan.io/"],
}
const sepolia = {
  chainId: "0xaa36a7",
  rpcUrls: ["https://sepolia.infura.io/v3/"],
  chainName: "Sepolia",
  nativeCurrency: {
    name: "Sepolia test network",
    symbol: "SepoliaETH",
    decimals: 18,
  },
  blockExplorerUrls: ["https://sepolia.etherscan.io"],
}
const hardhat = {
  chainId: "0x7a69", // This is 31337 in hexadecimal notation
  rpcUrls: ["http://127.0.0.1:8545/"], // Replace with your own RPC endpoint if different
  chainName: "Hardhat Localhost",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  blockExplorerUrls: null, // No block explorer available for localhost
}
const polygon = {
  chainId: "0x89", // Chain ID for Polygon
  chainName: "Polygon",
  rpcUrls: ["https://polygon-rpc.com/"], // RPC endpoint for Polygon mainnet
  nativeCurrency: {
    name: "MATIC",
    symbol: "MATIC",
    decimals: 18,
  },
  blockExplorerUrls: ["https://polygonscan.com/"], // Block explorer URL for Polygon
}

const networkData = {
  goerli,
  hardhat,
  polygon,
  sepolia,
}
const requiredChainId = 11155111
const requiredNetwork = "sepolia"
/* const requiredChainId = 31337
const requiredNetwork = "hardhat" */
module.exports = {
  networkData,
  requiredNetwork,
  requiredChainId,
}
