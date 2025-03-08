const { assert, expect } = require("chai")
const {
    network,
    getNamedAccounts,
    deployments,
    ethers,
    companionNetworks,
} = require("hardhat")
const {
    developmentChains,
    networkConfig,
} = require("../../helper-hardhat-config")
const { rare, normal, legendary } = require("../../cardUris")

const normalBoxUri = "ipfs://QmS1SZj3MeMaTpuhaioWMFPrf6aANDtpAojZFmf33qsGn1"
const rareBoxUri = "ipfs://QmQerPLVrcinFHuDUnodkb4A4U9mTLjUy6kmV2R3cjKgR3"
const legendaryBoxUri = "ipfs://QmQvWPQmUujiWktPbrgXCDMKHSXipni7Qbya2RGCrMwQPk"
const boxUrisArray = [normalBoxUri, rareBoxUri, legendaryBoxUri]
!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Box and Card NFT", () => {
          let deployer,
              contract,
              vrfCoordinatorV2Mock,
              account2address,
              account2Connected,
              nftBox,
              account2ConnectedNftBox,
              character
          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer
              await deployments.fixture([
                  "mocks",
                  "usercontract",
                  "nftcard",
                  "tradenft",
                  "setaddress",
                  "characters",
                  "gamecard",
              ])
              nftBox = await ethers.getContract("NftBox", deployer)
              contract = await ethers.getContract("GameCard", deployer)
              vrfCoordinatorV2Mock = await ethers.getContract(
                  "VRFCoordinatorV2Mock",
                  deployer
              )
              const accounts = await ethers.getSigners()
              account2Connected = contract.connect(accounts[1])
              account2ConnectedNftBox = nftBox.connect(accounts[1])
              account2address = accounts[1].address
              character = await ethers.getContract("Characters")
          })
          describe("test", () => {
              const normalBoxAmount = "6250000000000000"
              const rareBoxAmount = "31250000000000000"
              const legendaryBoxAmount = "62500000000000000"
              beforeEach(async function () {
                  /*  const normalLength = await character.normalPersonsLength()
                  const rareLength = await character.rarePersonsLength()
                  const legendaryLength =
                      await character.legendaryPersonsLength()
                  for (let i = 0; i < normalLength; i++) {
                      const response = await character.normalPersons(i)
                      console.log(response)
                  }
                  for (let i = 0; i < rareLength; i++) {
                      const response = await character.rarePersons(i)
                      console.log(response)
                  }
                  for (let i = 0; i < legendaryLength; i++) {
                      const response = await character.legendaryPersons(i)
                      console.log(response)
                  } */
                  const buyBox0 = await nftBox.buyNormalBox({
                      value: `${normalBoxAmount}`,
                  })
                  await buyBox0.wait(1)
                  const openResponse0 = await nftBox.openBox(0)
                  const txOpen0 = await openResponse0.wait(1)
                  let requestId0 = parseInt(txOpen0.events[1].args.requestId)
                  await new Promise(async (resolve, reject) => {
                      await vrfCoordinatorV2Mock.fulfillRandomWords(
                          requestId0,
                          nftBox.address
                      )
                      nftBox.on(
                          "BoxOpened",
                          async (owner, tokenId, uri, event) => {
                              console.log("opened", owner, uri, tokenId)
                              resolve()
                          }
                      )
                  })
                  const buyBox1 = await nftBox.buyRareBox({
                      value: `${rareBoxAmount}`,
                  })
                  await buyBox1.wait(1)
                  const openResponse1 = await nftBox.openBox(1)
                  const txOpen1 = await openResponse1.wait(1)
                  let requestId1 = parseInt(txOpen1.events[1].args.requestId)
                  await new Promise(async (resolve, reject) => {
                      await vrfCoordinatorV2Mock.fulfillRandomWords(
                          requestId1,
                          nftBox.address
                      )
                      nftBox.on(
                          "BoxOpened",
                          async (owner, tokenId, uri, event) => {
                              console.log("opened", owner, uri, tokenId)
                              resolve()
                          }
                      )
                  })
                  const buyBox2 = await nftBox.buyLegendaryBox({
                      value: `${legendaryBoxAmount}`,
                  })
                  await buyBox2.wait(1)
                  const openResponse2 = await nftBox.openBox(2)
                  const txOpen2 = await openResponse2.wait(1)
                  let requestId2 = parseInt(txOpen2.events[1].args.requestId)
                  await new Promise(async (resolve, reject) => {
                      await vrfCoordinatorV2Mock.fulfillRandomWords(
                          requestId2,
                          nftBox.address
                      )
                      nftBox.on(
                          "BoxOpened",
                          async (owner, tokenId, uri, event) => {
                              console.log("opened", owner, uri, tokenId)
                              resolve()
                          }
                      )
                  })
                  const buyBox3 = await account2ConnectedNftBox.buyNormalBox({
                      value: `${normalBoxAmount}`,
                  })
                  await buyBox3.wait(1)
                  const openResponse3 = await account2ConnectedNftBox.openBox(3)
                  const txOpen3 = await openResponse3.wait(1)
                  let requestId3 = parseInt(txOpen3.events[1].args.requestId)
                  await new Promise(async (resolve, reject) => {
                      await vrfCoordinatorV2Mock.fulfillRandomWords(
                          requestId3,
                          nftBox.address
                      )
                      nftBox.on(
                          "BoxOpened",
                          async (owner, tokenId, uri, event) => {
                              console.log("opened", owner, uri, tokenId)
                              resolve()
                          }
                      )
                  })
                  const buyBox4 = await account2ConnectedNftBox.buyRareBox({
                      value: `${rareBoxAmount}`,
                  })
                  await buyBox4.wait(1)
                  const openResponse4 = await account2ConnectedNftBox.openBox(4)
                  const txOpen4 = await openResponse4.wait(1)
                  let requestId4 = parseInt(txOpen4.events[1].args.requestId)
                  await new Promise(async (resolve, reject) => {
                      await vrfCoordinatorV2Mock.fulfillRandomWords(
                          requestId4,
                          nftBox.address
                      )
                      nftBox.on(
                          "BoxOpened",
                          async (owner, tokenId, uri, event) => {
                              console.log("opened", owner, uri, tokenId)
                              resolve()
                          }
                      )
                  })
                  const buyBox5 = await account2ConnectedNftBox.buyLegendaryBox(
                      {
                          value: `${legendaryBoxAmount}`,
                      }
                  )
                  await buyBox5.wait(1)
                  const openResponse5 = await account2ConnectedNftBox.openBox(5)
                  const txOpen5 = await openResponse5.wait(1)
                  let requestId5 = parseInt(txOpen5.events[1].args.requestId)
                  await new Promise(async (resolve, reject) => {
                      await vrfCoordinatorV2Mock.fulfillRandomWords(
                          requestId5,
                          nftBox.address
                      )
                      nftBox.on(
                          "BoxOpened",
                          async (owner, tokenId, uri, event) => {
                              console.log("opened", owner, uri, tokenId)
                              resolve()
                          }
                      )
                  })
              })
              describe("", () => {})
              it("test1", async () => {
                  await new Promise(async (resolve, reject) => {
                      const response = await contract.enterGame(0, 1, 2)
                      contract.on(
                          "AddedToList",
                          async (caller, tokenId, opponent, status, event) => {
                              const object = await contract.s_addressInfo(
                                  deployer
                              )
                              console.log(object)
                              resolve()
                          }
                      )
                  })
                  await new Promise(async (resolve, reject) => {
                      const response = await account2Connected.enterGame(
                          3,
                          4,
                          5
                      )
                      contract.on(
                          "MatchFound",
                          async (caller, opponent, event) => {
                              const object = await contract.s_addressInfo(
                                  account2address
                              )
                              console.log(object)
                              resolve()
                          }
                      )
                  })
                  console.log("Response ")
                  /* const response = await contract.playGame(
                      deployer,
                      account2address
                  ) */
                  let requestId
                  await new Promise(async (resolve, reject) => {
                      const response = await contract.playGame(
                          deployer,
                          account2address
                      )
                      console.log("hi")
                      contract.on(
                          "MatchBeginsSoon",
                          async (
                              character1,
                              character2,
                              requestIdEvent,
                              event
                          ) => {
                              let object = await contract.s_addressInfo(
                                  account2address
                              )
                              console.log(object)
                              object = await contract.s_addressInfo(deployer)
                              console.log(object)
                              requestId = parseInt(requestIdEvent)
                              console.log("hiNIggar", requestId)
                              await vrfCoordinatorV2Mock.fulfillRandomWords(
                                  requestId,
                                  contract.address
                              )
                              console.log("now lets wait ...")

                              contract.on(
                                  "Match",
                                  async (winner, loser, draw, event) => {
                                      console.log("Event found", event)
                                      let object = await contract.s_addressInfo(
                                          account2address
                                      )
                                      console.log(object)
                                      resolve()
                                  }
                              )
                          }
                      )
                  })
                  const response = await account2Connected.enterGame(3, 4, 5)
                  let object = await contract.s_addressInfo(account2address)
                  console.log(object)
                  let array = await contract.currentPlayers(0)
                  console.log(array)
                  let response1 = await contract.enterGame(0, 1, 2)

                  /*  await new Promise(async (resolve, reject) => {
                      console.log("hii", requestId)
                      await vrfCoordinatorV2Mock.fulfillRandomWords(
                          requestId,
                          contract.address
                      )
                      console.log("wait ...")
                      contract.on(
                          "Match",
                          async (winner, loser, draw, event) => {
                              console.log("Event found")
                              console.log(event.args)
                              resolve()
                          }
                      )
                  })
                  const reponse = await vrfCoordinatorV2Mock.fulfillRandomWords(
                      requestId,
                      contract.address
                  )
                  contract.on("Match", async (winner, loser, draw, event) => {
                      console.log("Event found")
                      console.log(event.args)
                  })
                  const tx = await reponse.wait(1)
                  console.log(tx) */
              })
          })
      })
