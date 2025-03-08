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
              ])
              contract = await ethers.getContract("UserContract", deployer)
              nftBox = await ethers.getContract("NftBox")
              nftTrade = await ethers.getContract("TradeNft")
              vrfCoordinatorV2Mock = await ethers.getContract(
                  "VRFCoordinatorV2Mock",
                  deployer
              )
              mockV3Aggregator = await ethers.getContract(
                  "MockV3Aggregator",
                  deployer
              )
              const accounts = await ethers.getSigners()
              account2Connected = nftBox.connect(accounts[1])
              account2address = accounts[1].address
          })
          describe("buy Boxes", () => {
              it("hi", async () => {
                  const normalBoxAmount = "6250000000000000"
                  const rareBoxAmount = "31250000000000000"
                  const legendaryBoxAmount = "62500000000000000"
                  const reponse = await nftBox.buyNormalBox({
                      value: `${normalBoxAmount}`,
                  })
                  await reponse.wait(1)
                  const reponse1 = await nftBox.buyNormalBox({
                      value: `${normalBoxAmount}`,
                  })
                  await reponse1.wait(1)
                  const reponse2 = await nftBox.buyRareBox({
                      value: `${rareBoxAmount}`,
                  })
                  await reponse2.wait(1)
                  const reponse3 = await nftBox.buyLegendaryBox({
                      value: `${legendaryBoxAmount}`,
                  })
                  await reponse3.wait(1)

                  const mappingLength = await nftBox.getLengthTokenIdArray(
                      deployer
                  )
                  for (let i = 0; i < mappingLength; i++) {
                      const reponse = await nftBox.mappingAddressToToken(
                          deployer,
                          i
                      )
                      console.log(reponse)
                  }
                  const mappingLength2 =
                      await account2Connected.getLengthTokenIdArray(
                          account2address
                      )
                  for (let i = 0; i < mappingLength2; i++) {
                      const reponse =
                          await account2Connected.mappingAddressToToken(
                              account2Connected,
                              i
                          )
                      console.log(reponse)
                  }
                  const open = await nftBox.openBox(0)
                  for (let i = 0; i < 4; i++) {
                      const nft = await nftBox.getNft(i)
                      console.log(nft)
                  }
              })
          })
      })
