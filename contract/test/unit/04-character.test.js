const { assert, expect } = require("chai")
const { network, getNamedAccounts, deployments, ethers } = require("hardhat")
const {
    developmentChains,
    networkConfig,
} = require("../../helper-hardhat-config")
const { rare, normal, legendary } = require("../../cardUris")

const normalBoxUri = "ipfs://QmS1SZj3MeMaTpuhaioWMFPrf6aANDtpAojZFmf33qsGn1"
const rareBoxUri = "ipfs://QmQerPLVrcinFHuDUnodkb4A4U9mTLjUy6kmV2R3cjKgR3"
const legendaryBoxUri = "ipfs://QmQvWPQmUujiWktPbrgXCDMKHSXipni7Qbya2RGCrMwQPk"
const boxUrisArray = [normalBoxUri, rareBoxUri, legendaryBoxUri]
developmentChains.includes(network.name)
    ? describe.skip
    : describe("Box and Card NFT", () => {
          let deployer,
              contract,
              vrfCoordinatorV2Mock,
              mockV3Aggregator,
              account2address,
              account2Connected,
              nftBox,
              nftTrade
          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer
              await deployments.fixture([
                  "mocks",
                  "usercontract",
                  "nftcard",
                  "tradenft",
                  "setaddress",
                  "characters",
              ])
              contract = await ethers.getContract("Characters", deployer)
          })
          it("hi", async () => {
              const getArray = await contract.normalPersons(0)
              console.log(getArray.tokenUri)
          })
      })
