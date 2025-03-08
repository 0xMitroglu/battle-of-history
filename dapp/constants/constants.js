const nftBoxAbi = require("./NftBoxAbi.json")
const vrfAbi = require("./rfvAbi.json")
const nftTradeAbi = require("./TradeNftAbi.json")
const gameCardAbi = require("./GameCardAbi.json")

const vrfCoordinatorV2Mock = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
/* const tradeNftAddress = "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6"
const gameCardAddress = "0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0"
const nftBoxContractAddress = "0x0165878A594ca255338adfa4d48449f69242Eb8F" */
/* Sepolia */
const tradeNftAddress = "0x89E3da2E22c6b3dc37A470217af8B99da1a1c7d6"
const nftBoxContractAddress = "0xeF6d9D4c8D238Eea299897F26980B04DFf41B0e1"
const gameCardAddress = "0x2283a93a4d136b3fe2d9e9154d26a9307f8C71FF"

module.exports = {
  nftBoxAbi,
  nftBoxContractAddress,
  vrfAbi,
  vrfCoordinatorV2Mock,
  nftTradeAbi,
  tradeNftAddress,
  gameCardAbi,
  gameCardAddress,
}
