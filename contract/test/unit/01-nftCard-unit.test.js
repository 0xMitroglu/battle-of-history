const { assert, expect } = require("chai")
const { network, getNamedAccounts, deployments, ethers } = require("hardhat")
const {
    developmentChains,
    networkConfig,
} = require("../../helper-hardhat-config")
const { rareUri, normalUri, legendaryUri } = require("../../cardUris")

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
              account2Connected
          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer
              await deployments.fixture([
                  "mocks",
                  "characters",
                  "usercontract",
                  "nftcard",
                  "tradenft",
                  "setaddress",
              ])
              contract = await ethers.getContract("NftBox", deployer)
              vrfCoordinatorV2Mock = await ethers.getContract(
                  "VRFCoordinatorV2Mock",
                  deployer
              )
              mockV3Aggregator = await ethers.getContract(
                  "MockV3Aggregator",
                  deployer
              )
              const accounts = await ethers.getSigners()
              account2Connected = contract.connect(accounts[1])
              account2address = accounts[1].address
          })
          describe("constructor", () => {
              it("checks priceFeed address", async () => {
                  const priceFeedAddress = await contract.getPriceFeed()
                  assert.equal(
                      priceFeedAddress.toString(),
                      mockV3Aggregator.address.toString()
                  )
              })
              it("tokenCounter should be zero", async () => {
                  const tokenCounter = await contract.getTokenCounter()
                  assert.equal(tokenCounter.toString(), "0")
              })
              it("boxUris should contain 3 different Uris: normal, rare, legendary", async () => {
                  for (let i = 0; i <= 2; i++) {
                      const response = await contract.getNftBoxesUri(i)
                      assert.equal(
                          response.toString(),
                          boxUrisArray[i].toString()
                      )
                  }
              })
              it("checks the normal Card Uris", async () => {
                  const normalLength = await contract.getNormalCardUrisLength()
                  assert.equal(
                      normalLength.toString(),
                      normalUri.length.toString()
                  )
                  for (let i = 0; i < normalUri.length; i++) {
                      const normalUris = await contract.getNormalCard(i)
                      assert.equal(
                          normalUris.toString(),
                          normalUri[i].toString()
                      )
                  }
              })
              it("checks the rare Card Uris", async () => {
                  const rareLength = await contract.getRareCardUrisLength()
                  assert.equal(rareLength.toString(), rareUri.length.toString())
                  for (let i = 0; i < rareUri.length; i++) {
                      const rareUris = await contract.getRareCard(i)
                      assert.equal(rareUris.toString(), rareUri[i].toString())
                  }
              })
              it("checks the legendary Card Uris", async () => {
                  const legendaryLength =
                      await contract.getLegendaryCardUrisLength()
                  assert.equal(
                      legendaryLength.toString(),
                      legendaryUri.length.toString()
                  )
                  for (let i = 0; i < legendaryUri.length; i++) {
                      const legendaryUris = await contract.getLegendaryCard(i)
                      assert.equal(
                          legendaryUris.toString(),
                          legendaryUri[i].toString()
                      )
                  }
              })
              it("checks the price: 10$, 50$, 100$", async () => {
                  const normalPrice = await contract.PRICE_NORMAL_BOX_USD()
                  assert.equal(normalPrice.toString(), "10")
                  const rarePrice = await contract.PRICE_RARE_BOX_USD()
                  assert.equal(rarePrice.toString(), "50")
                  const legendaryPrice =
                      await contract.PRICE_LEGENDARY_BOX_USD()
                  assert.equal(legendaryPrice.toString(), "100")
              })
          })
          describe("Buy Boxes", () => {
              let normalBoxAmount, rareBoxAmount, legendaryBoxAmount
              beforeEach(async function () {
                  const priceFeed = await ethers.getContract(
                      "MockV3Aggregator",
                      deployer
                  )
                  const priceFeedAnswer = await priceFeed.latestRoundData()
                  // console.log(priceFeedAnswer[1] / 1)  So if we devide we convert hex to decimal
                  const ethPrice = priceFeedAnswer[1] / 1e8
                  const ethAmount = 10 / ethPrice

                  normalBoxAmount = ethAmount * 1e18
                  const ethAmountRare = 50 / ethPrice
                  rareBoxAmount = ethAmountRare * 1e18
                  const ethAmountLegendary = 100 / ethPrice
                  legendaryBoxAmount = ethAmountLegendary * 1e18
              })
              describe("priceFeedUsdToEth", () => {
                  it("converts correctly the price of Boxes", async () => {
                      const reponseNormal = await contract.priceFeedUsdToEth(10)
                      assert.equal(
                          normalBoxAmount.toString(),
                          reponseNormal.toString()
                      )
                      const reponseRare = await contract.priceFeedUsdToEth(50)
                      assert.equal(
                          rareBoxAmount.toString(),
                          reponseRare.toString()
                      )
                      const reponseLegendary = await contract.priceFeedUsdToEth(
                          100
                      )
                      assert.equal(
                          legendaryBoxAmount.toString(),
                          reponseLegendary.toString()
                      )
                  })
              })
              describe("buyNormalBox ", () => {
                  it("fails if not required amount passed", async () => {
                      const res = await contract.buyNormalBox({
                          value: normalBoxAmount.toString(),
                      })
                      const hexNormalAmount =
                          ethers.BigNumber.from(normalBoxAmount)
                      const result = hexNormalAmount.sub(
                          ethers.BigNumber.from(1)
                      )
                      await expect(
                          contract.buyNormalBox({ value: result })
                      ).to.be.revertedWith("NftBox__NeedMoreETHSent()")
                  })
                  it("buys normal Box, checks the event", async () => {
                      await new Promise(async (resolve, reject) => {
                          await contract.buyNormalBox({
                              value: normalBoxAmount.toString(),
                          })
                          contract.on(
                              "NormalBoxMinted",
                              async (
                                  sender,
                                  tokenId,
                                  tokenUri,
                                  priceInEth,
                                  event
                              ) => {
                                  assert.equal(
                                      sender.toLowerCase().toString(),
                                      deployer.toLowerCase().toString()
                                  )
                                  assert.equal(tokenId.toString(), "0")
                                  assert.equal(
                                      tokenUri.toString(),
                                      normalBoxUri.toString()
                                  )
                                  assert.equal(
                                      priceInEth.toString(),
                                      normalBoxAmount.toString()
                                  )
                                  assert.equal(
                                      event.event.toString(),
                                      "NormalBoxMinted"
                                  )

                                  resolve()
                              }
                          )
                      })
                  })
                  it("checks the data change after the BOX is bought", async () => {
                      const beginningTokenCounter =
                          await contract.getTokenCounter()
                      assert.equal(beginningTokenCounter.toString(), "0")
                      const response = await contract.buyNormalBox({
                          value: normalBoxAmount,
                      })
                      const tx = response.wait(1)
                      //

                      //
                      const afterTokenCounter = await contract.getTokenCounter()

                      assert.equal(afterTokenCounter.toString(), "1")
                      const tokenUri = await contract.tokenURI(0)
                      assert.equal(tokenUri.toString(), normalBoxUri.toString())
                      const data = await contract.mappingNfts(
                          parseInt(beginningTokenCounter)
                      )
                      assert.equal(data.Boxopened, false)
                      assert.equal(data.tokenId.toString(), "0")
                      assert.equal(
                          data.tokenUri.toString(),
                          normalBoxUri.toString()
                      )
                      assert.equal(
                          data.owner.toLowerCase().toString(),
                          deployer.toLowerCase().toString()
                      )
                      assert.equal(data.boxType.toString(), "0")
                  })
              })
              describe("buyRareBox", () => {
                  it("fails if not required amount passed in", async () => {
                      const hexNormalAmount = ethers.BigNumber.from(
                          `${rareBoxAmount}`
                      )
                      const hexResult =
                          ethers.BigNumber.from(hexNormalAmount).sub(1)
                      const result = ethers.BigNumber.from(hexResult)

                      // Perform the buyRareBox() operation
                      await expect(
                          contract.buyRareBox({ value: hexResult })
                      ).to.be.revertedWith("NftBox__NeedMoreETHSent()")
                  })
                  it("buys normal Box, checks the event", async () => {
                      await new Promise(async (resolve, reject) => {
                          await contract.buyRareBox({
                              value: rareBoxAmount.toString(),
                          })
                          contract.on(
                              "RareBoxMinted",
                              async (
                                  sender,
                                  tokenId,
                                  tokenUri,
                                  priceInEth,
                                  event
                              ) => {
                                  assert.equal(
                                      sender.toLowerCase().toString(),
                                      deployer.toLowerCase().toString()
                                  )
                                  assert.equal(tokenId.toString(), "0")
                                  assert.equal(
                                      tokenUri.toString(),
                                      rareBoxUri.toString()
                                  )
                                  assert.equal(
                                      priceInEth.toString(),
                                      rareBoxAmount.toString()
                                  )
                                  assert.equal(
                                      event.event.toString(),
                                      "RareBoxMinted"
                                  )
                                  resolve()
                              }
                          )
                      })
                  })
                  it("checks the data change after the BOX is bought", async () => {
                      const beginningTokenCounter =
                          await contract.getTokenCounter()
                      assert.equal(beginningTokenCounter.toString(), "0")
                      const response = await contract.buyRareBox({
                          value: rareBoxAmount.toString(),
                      })
                      const tx = response.wait(1)
                      const afterTokenCounter = await contract.getTokenCounter()
                      assert.equal(afterTokenCounter.toString(), "1")
                      const tokenUri = await contract.tokenURI(0)
                      assert.equal(tokenUri.toString(), rareBoxUri.toString())
                      const data = await contract.mappingNfts(
                          parseInt(beginningTokenCounter)
                      )
                      assert.equal(data.Boxopened, false)
                      assert.equal(data.tokenId.toString(), "0")
                      assert.equal(
                          data.tokenUri.toString(),
                          rareBoxUri.toString()
                      )
                      assert.equal(
                          data.owner.toLowerCase().toString(),
                          deployer.toLowerCase().toString()
                      )
                      assert.equal(data.boxType.toString(), "1")
                  })
              })
              describe("buyLegendaryBox", () => {
                  it("fails if not required amount passed in", async () => {
                      const hexNormalAmount = ethers.BigNumber.from(
                          `${legendaryBoxAmount}`
                      )
                      const hexResult =
                          ethers.BigNumber.from(hexNormalAmount).sub(1)
                      const result = ethers.BigNumber.from(hexResult)

                      // Perform the buyRareBox() operation
                      await expect(
                          contract.buyLegendaryBox({ value: hexResult })
                      ).to.be.revertedWith("NftBox__NeedMoreETHSent()")
                  })
                  it("buys legendary Box, checks the event", async () => {
                      await new Promise(async (resolve, reject) => {
                          await contract.buyLegendaryBox({
                              value: legendaryBoxAmount.toString(),
                          })
                          contract.on(
                              "LegendaryBoxMinted",
                              async (
                                  sender,
                                  tokenId,
                                  tokenUri,
                                  priceInEth,
                                  event
                              ) => {
                                  assert.equal(
                                      sender.toLowerCase().toString(),
                                      deployer.toLowerCase().toString()
                                  )
                                  assert.equal(tokenId.toString(), "0")
                                  assert.equal(
                                      tokenUri.toString(),
                                      legendaryBoxUri.toString()
                                  )
                                  assert.equal(
                                      priceInEth.toString(),
                                      legendaryBoxAmount.toString()
                                  )
                                  assert.equal(
                                      event.event.toString(),
                                      "LegendaryBoxMinted"
                                  )
                                  resolve()
                              }
                          )
                      })
                  })
                  it("checks the data change after the BOX is bought", async () => {
                      const beginningTokenCounter =
                          await contract.getTokenCounter()
                      assert.equal(beginningTokenCounter.toString(), "0")
                      const response = await contract.buyLegendaryBox({
                          value: legendaryBoxAmount.toString(),
                      })
                      const tx = response.wait(1)
                      const afterTokenCounter = await contract.getTokenCounter()
                      assert.equal(afterTokenCounter.toString(), "1")
                      const tokenUri = await contract.tokenURI(0)
                      assert.equal(
                          tokenUri.toString(),
                          legendaryBoxUri.toString()
                      )
                      const data = await contract.mappingNfts(
                          parseInt(beginningTokenCounter)
                      )
                      assert.equal(data.Boxopened, false)
                      assert.equal(data.tokenId.toString(), "0")
                      assert.equal(
                          data.tokenUri.toString(),
                          legendaryBoxUri.toString()
                      )
                      assert.equal(
                          data.owner.toLowerCase().toString(),
                          deployer.toLowerCase().toString()
                      )
                      assert.equal(data.boxType.toString(), "2")
                  })
              })
          })
          describe("Open Box", () => {
              const normalBoxAmount = "6250000000000000"
              const rareBoxAmount = "31250000000000000"
              const legendaryBoxAmount = "62500000000000000"
              beforeEach(async function () {
                  const reponse = await contract.buyNormalBox({
                      value: `${normalBoxAmount}`,
                  })
                  await reponse.wait(1)
              })
              it("reverts if not owner of tokenId", async () => {
                  await expect(account2Connected.openBox(0)).to.be.revertedWith(
                      "NftBox__NotOwner"
                  )
              })
              it("reverts if tokenId doesn't exist", async () => {
                  await expect(contract.openBox(1)).to.be.revertedWith(
                      "NftBox__TokenIdNotExist"
                  )
              })
              it("reverts if Box already opened", async () => {
                  const openResponse = await contract.openBox(0)
                  const txOpen = await openResponse.wait(1)
                  let requestId = parseInt(txOpen.events[1].args.requestId)
                  await new Promise(async (resolve, reject) => {
                      await vrfCoordinatorV2Mock.fulfillRandomWords(
                          requestId,
                          contract.address
                      )
                      contract.on(
                          "BoxOpened",
                          async (owner, tokenId, uri, event) => {
                              resolve()
                          }
                      )
                  })
                  await expect(contract.openBox(0)).to.be.revertedWith(
                      "NftBox__AlreadyOpened"
                  )
              })
              it("open Box and check event", async () => {
                  await new Promise(async (resolve, reject) => {
                      const reponseOpen = await contract.openBox(0)
                      contract.on(
                          "OpenBoxRandomRequested",
                          async (requestId, sender, eventarray) => {
                              const event = eventarray.args
                              const checkRequestId =
                                  await contract.mappingRequestToToken(
                                      event.requestId
                                  )
                              assert.equal("0", checkRequestId.toString())
                              assert.equal(
                                  event.sender.toLowerCase().toString(),
                                  deployer.toLowerCase().toString()
                              )
                              resolve()
                          }
                      )
                  })
              })
              describe("we get the random Card", () => {
                  const normalBoxAmount = "6250000000000000"
                  const rareBoxAmount = "31250000000000000"
                  const legendaryBoxAmount = "62500000000000000"
                  beforeEach(async function () {
                      const reponseNormalBox1 = await contract.buyNormalBox({
                          value: `${normalBoxAmount}`,
                      })
                      await reponseNormalBox1.wait(1)
                  })
                  it("fulfillRandomWords successfully", async () => {
                      await new Promise(async (resolve, reject) => {
                          await contract.openBox(1)
                          contract.on(
                              "OpenBoxRandomRequested",
                              async (requestId, sender, event) => {
                                  const reponse =
                                      await vrfCoordinatorV2Mock.fulfillRandomWords(
                                          requestId,
                                          contract.address
                                      )

                                  contract.on(
                                      "BoxOpened",
                                      async (
                                          owner,
                                          tokenId,
                                          tokenUri,
                                          event
                                      ) => {
                                          assert.equal(
                                              owner.toLowerCase().toString(),
                                              deployer.toLowerCase().toString()
                                          )
                                          assert.equal(tokenId.toString(), "1")
                                          assert.equal(
                                              normalUri[2].toString(),
                                              tokenUri.toString()
                                          )

                                          const nftObject =
                                              await contract.mappingNfts(1)
                                          assert.equal(
                                              nftObject.tokenId.toString(),
                                              "1"
                                          )
                                          assert.equal(
                                              nftObject.tokenUri.toString(),
                                              tokenUri.toString()
                                          )
                                          assert.equal(
                                              nftObject.owner
                                                  .toLowerCase()
                                                  .toString(),
                                              deployer.toLowerCase().toString()
                                          )
                                          assert.equal(
                                              nftObject.Boxopened,
                                              true
                                          )
                                          assert.equal(
                                              nftObject.boxType.toString(),
                                              "3"
                                          )
                                          resolve()
                                      }
                                  )
                              }
                          )
                      })
                  })
              })
          })
          describe("withdraw", () => {
              it("owner is deployer", async () => {
                  const owner = await contract.owner()
                  assert.equal(
                      owner.toLowerCase().toString(),
                      deployer.toLowerCase().toString()
                  )
              })
              it("withdraw fails because isn't the owner", async () => {
                  await expect(account2Connected.withdraw()).to.be.revertedWith(
                      ""
                  )
              })
              it("the owner can withdraw all of the money", async () => {
                  const balance = await ethers.provider.getBalance(
                      contract.address
                  )
                  assert.equal("0", parseInt(balance).toString())
                  const reponse = await account2Connected.buyNormalBox({
                      value: "6250000000000000",
                  })
                  reponse.wait(1)
                  const beginningMoney = await ethers.provider.getBalance(
                      contract.address
                  )
                  assert.equal(
                      parseInt("6250000000000000").toString(),
                      parseInt(beginningMoney).toString()
                  )
                  const withdraw = await contract.withdraw()
                  withdraw.wait(1)
                  const endingMoney = await ethers.provider.getBalance(
                      contract.address
                  )
                  assert.equal("0", parseInt(endingMoney).toString())
              })
          })
      })
