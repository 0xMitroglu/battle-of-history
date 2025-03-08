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
    : describe("Trade Nft", () => {
          let deployer,
              contract,
              vrfCoordinatorV2Mock,
              mockV3Aggregator,
              account2address,
              account2Connected,
              account2ConnectedNftBox,
              account2addressNftBox
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
              nftbox = await ethers.getContract("NftBox", deployer)
              contract = await ethers.getContract("TradeNft", deployer)
              vrfCoordinatorV2Mock = await ethers.getContract(
                  "VRFCoordinatorV2Mock",
                  deployer
              )
              mockV3Aggregator = await ethers.getContract(
                  "MockV3Aggregator",
                  deployer
              )
              const accounts = await ethers.getSigners()
              account2ConnectedNftBox = nftbox.connect(accounts[1])
              account2addressNftBox = accounts[1].address
              account2Connected = contract.connect(accounts[1])
              account2address = accounts[1].address
              const setAddress = await nftbox.setTradeNftAddress(
                  contract.address
              )
              await setAddress.wait(1)
          })
          describe("constructor", () => {
              it("sets NftAddress", async () => {
                  const reponse = await contract.getNftAddress()
                  assert.equal(
                      nftbox.address.toLowerCase().toString(),
                      reponse.toLowerCase().toString()
                  )
              })
          })
          describe("Sell Nft", () => {
              const normalBoxAmount = "6250000000000000"
              const rareBoxAmount = "31250000000000000"
              const legendaryBoxAmount = "62500000000000000"
              beforeEach(async function () {
                  const reponse1 = await nftbox.buyNormalBox({
                      value: `${normalBoxAmount}`,
                  })
                  await reponse1.wait(1)
                  const approve = await nftbox.approve(contract.address, 0)
                  const reponse2 = await nftbox.buyNormalBox({
                      value: `${normalBoxAmount}`,
                  })
                  await reponse2.wait(1)
              })
              it("Sets NFT on sale", async () => {
                  const price = ethers.utils.parseEther("10")
                  let mapping = await contract.getNft(0)
                  assert.equal(mapping.sell, false)
                  assert.equal(mapping.price.toString(), "0")
                  const reponse = await contract.sellNft(0, price)
                  const reponseTx = await reponse.wait(1)
                  mapping = await contract.getNft(0)
                  assert.equal(mapping.sell, true)
                  assert.equal(
                      parseInt(ethers.utils.formatEther(mapping.price)),
                      10
                  )
              })
              it("Listens for event after set on sale", async () => {
                  const price = ethers.utils.parseEther("5")
                  const tokenId = 0
                  await new Promise(async (resolve, reject) => {
                      try {
                          const reponse = await contract.sellNft(tokenId, price)
                          contract.on(
                              "SellNft",
                              async (
                                  owner,
                                  tokenId,
                                  price,
                                  sale,
                                  eventArray
                              ) => {
                                  const event = eventArray.args
                                  assert.equal(
                                      deployer.toLowerCase().toString(),
                                      event.owner.toLowerCase().toString()
                                  )
                                  assert.equal(
                                      event.tokenId.toString(),
                                      tokenId.toString()
                                  )
                                  assert.equal(
                                      parseInt(
                                          ethers.utils.formatEther(
                                              `${event.price}`
                                          )
                                      ),
                                      5
                                  )
                                  assert.equal(event.sell, true)
                                  resolve()
                              }
                          )
                      } catch (e) {
                          console.log(e)
                          reject()
                      }
                  })
              })
              it("checks the mapping of the Nfts after sell", async () => {
                  const tokenId = 0
                  let mapping = await contract.getNft(tokenId)
                  let mappingNftBox = await nftbox.getNft(tokenId)
                  assert.equal(mapping.price.toString(), "0")
                  assert.equal(mapping.sell, false)
                  assert.equal(mappingNftBox.price.toString(), "0")
                  assert.equal(mappingNftBox.sell, false)
                  const reponse = await contract.sellNft(
                      tokenId,
                      ethers.utils.parseEther("10")
                  )
                  await reponse.wait(1)
                  mapping = await contract.getNft(tokenId)
                  mappingNftBox = await nftbox.getNft(tokenId)
                  assert.equal(
                      parseInt(
                          ethers.utils.formatEther(mapping.price.toString())
                      ),
                      10
                  )
                  assert.equal(mapping.sell, true)
                  assert.equal(
                      parseInt(
                          ethers.utils.formatEther(
                              mappingNftBox.price.toString()
                          )
                      ),
                      10
                  )
                  assert.equal(mappingNftBox.sell, true)
              })
              it("reverts if no price or negative", async () => {
                  await expect(contract.sellNft(0, 0)).to.be.revertedWith(
                      "TradeNft__PriceMustBeAboveZero"
                  )
              })
              it("reverts if already on sale", async () => {
                  const tokenId = 0
                  const reponse = await contract.sellNft(
                      tokenId,
                      ethers.utils.parseEther("10")
                  )
                  await reponse.wait(1)
                  await expect(contract.sellNft(0, 2)).to.be.revertedWith(
                      "TradeNft__AlreadyOnSale"
                  )
              })
              it("reverts if tokenId not approved", async () => {
                  await expect(contract.sellNft(1, 3)).to.be.revertedWith(
                      "TradeNft__NotApproved"
                  )
              })
              it("reverts if you are not the owner of tokenId", async () => {
                  await expect(
                      account2Connected.sellNft(0, 3)
                  ).to.be.revertedWith("TradeNft__NotOwner")
              })
          })
          describe("Take down an NFT", () => {
              const normalBoxAmount = "6250000000000000"
              const rareBoxAmount = "31250000000000000"
              const legendaryBoxAmount = "62500000000000000"
              beforeEach(async function () {
                  const reponse1 = await nftbox.buyNormalBox({
                      value: `${normalBoxAmount}`,
                  })
                  await reponse1.wait(1)
                  const approve = await nftbox.approve(contract.address, 0)
                  const sellNft0 = await contract.sellNft(
                      0,
                      ethers.utils.parseEther("10")
                  )
                  await sellNft0.wait(1)
                  const reponse2 = await nftbox.buyNormalBox({
                      value: `${normalBoxAmount}`,
                  })
                  await reponse2.wait(1)
              })
              it("takes down Nft", async () => {
                  await new Promise(async (resolve, reject) => {
                      let mapping = await nftbox.getNft(0)
                      try {
                          const reponse = await contract.takeDownNft(0)
                          contract.on(
                              "TakeDownNft",
                              async (
                                  owner,
                                  tokenId,
                                  price,
                                  sell,
                                  eventArray
                              ) => {
                                  mapping = await nftbox.getNft(0)
                                  assert.equal(
                                      parseInt(mapping.price.toString()),
                                      0
                                  )
                                  assert.equal(mapping.sell, false)
                                  const event = eventArray.args
                                  assert.equal(
                                      parseInt(event.price.toString()),
                                      0
                                  )
                                  assert.equal(event.sell, false)

                                  resolve()
                              }
                          )
                      } catch (e) {
                          console.log(e)
                          reject()
                      }
                  })
              })
              it("reverts if not owner", async () => {
                  await expect(
                      account2Connected.takeDownNft(0)
                  ).to.be.revertedWith("TradeNft__NotOwner")
              })
              it("reverts if not for sale", async () => {
                  await expect(contract.takeDownNft(1)).to.be.revertedWith(
                      "TradeNft__IsNotListed"
                  )
              })
          })
          describe("Update Nft price", () => {
              const normalBoxAmount = "6250000000000000"
              const rareBoxAmount = "31250000000000000"
              const legendaryBoxAmount = "62500000000000000"
              beforeEach(async function () {
                  const reponse1 = await nftbox.buyNormalBox({
                      value: `${normalBoxAmount}`,
                  })
                  await reponse1.wait(1)
                  const approve = await nftbox.approve(contract.address, 0)
                  const sellNft0 = await contract.sellNft(
                      0,
                      ethers.utils.parseEther("10")
                  )
                  await sellNft0.wait(1)
                  const reponse2 = await nftbox.buyNormalBox({
                      value: `${normalBoxAmount}`,
                  })
                  await reponse2.wait(1)
              })
              it("check event", async () => {
                  await new Promise(async (resolve, reject) => {
                      try {
                          const changePrice = await contract.updateNftPrice(
                              0,
                              ethers.utils.parseEther("3")
                          )
                          contract.on(
                              "TakeDownNft",
                              async (
                                  owner,
                                  tokenId,
                                  price,
                                  sell,
                                  eventArray
                              ) => {
                                  const event = eventArray.args
                                  assert.equal(
                                      owner.toLowerCase().toString(),
                                      deployer.toLowerCase().toString()
                                  )
                                  assert.equal(tokenId.toString(), "0")
                                  assert.equal(
                                      parseInt(
                                          ethers.utils.formatEther(`${price}`)
                                      ),
                                      3
                                  )
                                  assert.equal(sell, true)
                                  resolve()
                              }
                          )
                      } catch (e) {
                          console.log(e)
                          reject(e)
                      }
                  })
              })
              it("checks mapping", async () => {
                  let mapping = await nftbox.getNft(0)
                  assert.equal(
                      parseInt(ethers.utils.formatEther(`${mapping.price}`)),
                      10
                  )
                  const changePrice = await contract.updateNftPrice(
                      0,
                      ethers.utils.parseEther("3")
                  )
                  await changePrice.wait(1)
                  mapping = await nftbox.getNft(0)
                  assert.equal(
                      parseInt(ethers.utils.formatEther(`${mapping.price}`)),
                      3
                  )
              })
              it("reverts if not owner", async () => {
                  await expect(
                      account2Connected.updateNftPrice(
                          0,
                          ethers.utils.parseEther("1")
                      )
                  ).to.be.revertedWith("TradeNft__NotOwner")
              })
              it("reverts if not on sale", async () => {
                  await expect(
                      contract.updateNftPrice(1, ethers.utils.parseEther("1"))
                  ).to.be.revertedWith("TradeNft__IsNotListed")
              })
          })
          describe("Buy Nft", () => {
              const normalBoxAmount = "6250000000000000"
              const rareBoxAmount = "31250000000000000"
              const legendaryBoxAmount = "62500000000000000"
              beforeEach(async function () {
                  const reponse1 = await nftbox.buyNormalBox({
                      value: `${normalBoxAmount}`,
                  })
                  await reponse1.wait(1)
                  const approve = await nftbox.approve(contract.address, 0)
                  const sellNft0 = await contract.sellNft(
                      0,
                      ethers.utils.parseEther("10")
                  )
                  await sellNft0.wait(1)
                  const reponse2 = await nftbox.buyNormalBox({
                      value: `${normalBoxAmount}`,
                  })
                  await reponse2.wait(1)
              })
              it("checks event", async () => {
                  await new Promise(async (resolve, reject) => {
                      try {
                          const buy = await account2Connected.buyNft(0, {
                              value: ethers.utils.parseEther("10"),
                          })
                          contract.on(
                              "BuyNft",
                              async (
                                  sender,
                                  formerOwner,
                                  tokenId,
                                  price,
                                  sell,
                                  eventArray
                              ) => {
                                  const event = eventArray.args
                                  assert.equal(
                                      event.newOwner.toLowerCase().toString(),
                                      account2address.toLowerCase().toString()
                                  )
                                  assert.equal(
                                      event.seller.toLowerCase().toString(),
                                      deployer.toLowerCase().toString()
                                  )
                                  assert.equal(event.tokenId.toString(), "0")
                                  assert.equal(
                                      0,
                                      parseInt(
                                          ethers.utils.formatEther(
                                              `${event.price}`
                                          )
                                      )
                                  )
                                  assert.equal(event.sell, false)
                                  assert.equal(
                                      eventArray.event.toString(),
                                      "BuyNft"
                                  )
                                  resolve()
                              }
                          )
                      } catch (e) {
                          console.log(e)
                      }
                  })
              })
              it("checks mapping", async () => {
                  let mapping = await contract.getNft(0)
                  assert.equal(
                      mapping.owner.toLowerCase().toString(),
                      deployer.toLowerCase().toString()
                  )
                  assert.equal(
                      parseInt(ethers.utils.formatEther(`${mapping.price}`)),
                      10
                  )
                  assert.equal(mapping.sell, true)
                  const buyNft = await account2Connected.buyNft(0, {
                      value: ethers.utils.parseEther("10"),
                  })
                  const tx = await buyNft.wait(1)
                  mapping = await contract.getNft(0)
                  assert.equal(
                      mapping.owner.toLowerCase().toString(),
                      account2address.toLowerCase().toString()
                  )
                  assert.equal(
                      parseInt(ethers.utils.formatEther(`${mapping.price}`)),
                      0
                  )
                  assert.equal(mapping.sell, false)
              })
              it("reverts if not listed", async () => {
                  await expect(
                      account2Connected.buyNft(1, {
                          value: ethers.utils.parseEther("10"),
                      })
                  ).to.be.revertedWith("TradeNft__IsNotListed")
              })
              it("reverts if you are owner and wants to buy own NFT", async () => {
                  await expect(
                      contract.buyNft(0, {
                          value: ethers.utils.parseEther("10"),
                      })
                  ).to.be.revertedWith("TradeNft__AlreadyOwner")
              })
              it("reverts if the price isn't met", async () => {
                  await expect(
                      account2Connected.buyNft(0, {
                          value: ethers.utils.parseEther("0.1"),
                      })
                  ).to.be.revertedWith("TradeNft__PriceNotMet")
              })
          })
          describe("Withdraw Proceeds", () => {
              const normalBoxAmount = "6250000000000000"
              const rareBoxAmount = "31250000000000000"
              const legendaryBoxAmount = "62500000000000000"
              beforeEach(async function () {
                  const reponse1 = await nftbox.buyNormalBox({
                      value: `${normalBoxAmount}`,
                  })
                  await reponse1.wait(1)
                  const approve = await nftbox.approve(contract.address, 0)
                  const sellNft0 = await contract.sellNft(
                      0,
                      ethers.utils.parseEther("10")
                  )
                  await sellNft0.wait(1)
                  const buy = await account2Connected.buyNft(0, {
                      value: ethers.utils.parseEther("10"),
                  })
              })
              it("account2 withdraws proceeds", async () => {
                  await new Promise(async (resolve, reject) => {
                      try {
                          const collect = await contract.withdrawProceeds()
                          contract.on(
                              "ProceedsSent",
                              async (sender, amount, event) => {
                                  assert.equal(
                                      10,
                                      parseInt(
                                          ethers.utils
                                              .formatEther(`${amount}`)
                                              .toString()
                                      )
                                  )
                                  assert.equal("ProceedsSent", event.event)
                                  resolve()
                              }
                          )
                      } catch (e) {
                          console.log(e)
                          reject()
                      }
                  })
              })
              it("checks the mapping", async () => {
                  let mapping = await contract.getProceeds(deployer)
                  assert.equal(
                      mapping.toString(),
                      ethers.utils.parseEther("10").toString()
                  )
                  const collect = await contract.withdrawProceeds()
                  await collect.wait(1)
                  mapping = await contract.getProceeds(deployer)

                  assert.equal(mapping.toString(), "0")
              })
              it("reverts if no proceeds", async () => {
                  const collect = await contract.withdrawProceeds()
                  await collect.wait(1)
                  await expect(contract.withdrawProceeds()).to.be.revertedWith(
                      "TradeNft__NoProceeds"
                  )
              })
              it("deployer can collect his money", async () => {
                  let balance = await ethers.provider.getBalance(
                      contract.address
                  )
                  assert.equal(
                      parseInt(balance),
                      parseInt(ethers.utils.parseEther("10").toString())
                  )
                  const balanceDeployerBeginning =
                      await ethers.provider.getBalance(deployer)
                  const reponse = await contract.withdrawProceeds()
                  const receipt = await reponse.wait(1)
                  const { gasUsed, effectiveGasPrice } = receipt
                  const gasCost = gasUsed.mul(effectiveGasPrice)
                  balance = await ethers.provider.getBalance(contract.address)
                  assert.equal(parseInt(balance), 0)
                  const balanceDeployerAfter = await ethers.provider.getBalance(
                      deployer
                  )
                  const balanceAll = balanceDeployerAfter
                      .add(gasCost)
                      .toString()
                  const beginning = balanceDeployerBeginning
                      .add(ethers.utils.parseEther("10").toString())
                      .toString()
                  assert.equal(balanceAll, beginning)
              })
          })
      })
