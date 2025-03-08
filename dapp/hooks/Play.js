import React from "react"
import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { networkData, requiredNetwork, requiredChainId } from "../constants/networkData"
import PlayContract from "../back-end/PlayContract"
import flag from "../public/image/flag.png"
import ExportedImage from "next-image-export-optimizer"
import { vrfAbi, vrfCoordinatorV2Mock } from "../constants/constants"
import dead from "../public/image/soldiers.png"
import soldier from "../public/image/soldier.png"
import draw from "../public/image/guns.png"
import swords from "../public/image/swords.png"
import swordLeft from "../public/image/swordLeft.png"
import swordRight from "../public/image/swordRight.png"
import vs from "../public/image/vs.png"
import laurel from "../public/image/laurel.png"
import skull from "../public/image/skull.png"
const Play = (props) => {
  const [contract, setContract] = useState("")
  const [contractBox, setContractBox] = useState("")
  const [userNft, setUserNft] = useState([]) /* tokenId, tokenUri, tokenId */
  const [selectedNft, setSelectedNft] = useState([])
  const [userInfo, setUserInfo] = useState("")
  const [gameHistory, setGameHistory] = useState([])
  const [endedGame, setEndedGame] = useState("")
  const [showDescription, setShowDescription] = useState(false)
  const [showBattleLog, setShowBattleLog] = useState(false)
  const [showStartGame, setShowStartGame] = useState(true)
  const [refresh, setRefresh] = useState(false)
  /* PlayerStatus {
        SEARCHING,-> entered Game
        FOUND, -> after match has found an opponent
        PLAYING, -> started the Game
        OVER, -> the match is over
    } */
  useEffect(() => {
    const body = document.querySelector(".body")
    body.style.paddingTop = "75px"
    const nav = document.querySelector("nav")
    nav.style.top = "0px"
  }, [])
  useEffect(() => {
    if (props.correctNetwork && contract !== "" && contractBox !== "") {
      getUserInfo()
      setSelectedNft([])
    }
  }, [props.account, props.correctNetwork, contract, contractBox])
  useEffect(() => {
    if (props.correctNetwork && contract !== "") {
      if (userInfo.status == 0) {
        console.log("Listen when it starts")
        listenMatchBeginsSoon(props.account.toLowerCase())
      } else if (userInfo.status == 2) {
        console.log("Listen to Match End")
        listenMatch(props.account.toLowerCase())
      }
      const getHistory = async () => {
        const account = props.account.toLowerCase()
        const indexGamesHex = await contract.s_gameCounter()
        const indexGames = parseInt(indexGamesHex)
        let array = []
        for (let i = indexGames - 1; i >= 0; i--) {
          const game = await contract.finshedGames(i)
          if (game.loser.toLowerCase() == account || game.winner.toLowerCase() == account) {
            array.push({
              draw: game.draw,
              winner: game.winner,
              loser: game.loser,
              id: i,
            })
          }
        }
        setGameHistory(array)
      }
      getHistory()
    }
  }, [userInfo])
  const getUserInfo = async () => {
    const info = await contract.s_addressInfo(props.account)
    let nft1 = "",
      nft2 = "",
      nft3 = ""
    let nft1Opponent = "",
      nft2Opponent = "",
      nft3Opponent = ""
    const tokenId1 = parseInt(await contract.getTokenIds(props.account, 0))
    const tokenId2 = parseInt(await contract.getTokenIds(props.account, 1))
    const tokenId3 = parseInt(await contract.getTokenIds(props.account, 2))
    if (tokenId1 !== 0 || tokenId2 !== 0 || tokenId3 !== 0) {
      const nft1Data = await contractBox.getNft(tokenId1)
      const uri1 = nft1Data.tokenUri
      const ipfsHash1 = uri1.replace("ipfs://", "")
      const gatewayUrl = "https://ipfs.io/ipfs/"
      const tokenUri1 = gatewayUrl + ipfsHash1
      const response1 = await fetch(tokenUri1)
      const data1 = await response1.json()
      nft1 = {
        name: data1.name,
        tokenId: tokenId1,
        image: data1.image,
        type: nft1Data.boxType,
        attack: data1.attributes[1],
        defence: data1.attributes[2],
        tactics: data1.attributes[3],
      }

      const nft2Data = await contractBox.getNft(tokenId2)
      const uri2 = nft2Data.tokenUri
      const ipfsHash2 = uri2.replace("ipfs://", "")
      const tokenUri2 = gatewayUrl + ipfsHash2
      const response2 = await fetch(tokenUri2)
      const data2 = await response2.json()
      nft2 = {
        name: data2.name,
        tokenId: tokenId2,
        image: data2.image,
        type: nft2Data.boxType,
        attack: data2.attributes[1],
        defence: data2.attributes[2],
        tactics: data2.attributes[3],
      }

      const nft3Data = await contractBox.getNft(tokenId3)
      const uri3 = nft3Data.tokenUri
      const ipfsHash3 = uri3.replace("ipfs://", "")
      const tokenUri3 = gatewayUrl + ipfsHash3
      const response3 = await fetch(tokenUri3)
      const data3 = await response3.json()
      nft3 = {
        name: data3.name,
        tokenId: tokenId3,
        image: data3.image,
        type: nft3Data.boxType,
        attack: data3.attributes[1],
        defence: data3.attributes[2],
        tactics: data3.attributes[3],
      }
    }
    let tokenId1Opponent, tokenId2Opponent, tokenId3Opponent
    if (info.status >= 2) {
      tokenId1Opponent = parseInt(await contract.getTokenIds(info.opponent, 0))
      tokenId2Opponent = parseInt(await contract.getTokenIds(info.opponent, 1))
      tokenId3Opponent = parseInt(await contract.getTokenIds(info.opponent, 2))

      const nft1Data = await contractBox.getNft(tokenId1Opponent)
      const uri1 = nft1Data.tokenUri
      const ipfsHash1 = uri1.replace("ipfs://", "")
      const gatewayUrl = "https://ipfs.io/ipfs/"
      const tokenUri1 = gatewayUrl + ipfsHash1
      const response1 = await fetch(tokenUri1)
      const data1 = await response1.json()
      nft1Opponent = {
        name: data1.name,
        tokenId: tokenId1,
        image: data1.image,
        type: nft1Data.boxType,
        attack: data1.attributes[1],
        defence: data1.attributes[2],
        tactics: data1.attributes[3],
      }

      const nft2Data = await contractBox.getNft(tokenId2Opponent)
      const uri2 = nft2Data.tokenUri
      const ipfsHash2 = uri2.replace("ipfs://", "")
      const tokenUri2 = gatewayUrl + ipfsHash2
      const response2 = await fetch(tokenUri2)
      const data2 = await response2.json()
      nft2Opponent = {
        name: data2.name,
        tokenId: tokenId2,
        image: data2.image,
        type: nft2Data.boxType,
        attack: data2.attributes[1],
        defence: data2.attributes[2],
        tactics: data2.attributes[3],
      }

      const nft3Data = await contractBox.getNft(tokenId3Opponent)
      const uri3 = nft3Data.tokenUri
      const ipfsHash3 = uri3.replace("ipfs://", "")
      const tokenUri3 = gatewayUrl + ipfsHash3
      const response3 = await fetch(tokenUri3)
      const data3 = await response3.json()
      nft3Opponent = {
        name: data3.name,
        tokenId: tokenId3,
        image: data3.image,
        type: nft3Data.boxType,
        attack: data3.attributes[1],
        defence: data3.attributes[2],
        tactics: data3.attributes[3],
      }
    }
    const obj = {
      player: info.player.toLowerCase(),
      opponent: info.opponent,
      status: info.status,
      game: parseFloat(info.game),
      nft1: nft1,
      nft2: nft2,
      nft3: nft3,
      opponentNfts: [nft1Opponent, nft2Opponent, nft3Opponent],
    }
    console.log(obj)
    setUserInfo(obj)
  }
  const battleHistory = gameHistory.map((el) => {
    console.log("hi")
    let you, opponent, win
    if (el.winner.toLowerCase() == props.account.toLowerCase()) {
      you = el.winner
      win = true
      opponent = el.loser
    } else {
      you = el.loser
      win = false
      opponent = el.winner
    }
    return (
      <div
        className={
          win && !el.draw
            ? "play-battle-log play-battle-log-win"
            : !win && !el.draw
            ? "play-battle-log play-battle-log-defeat"
            : "play-battle-log play-battle-log-draw"
        }
      >
        <div className="play-battle-log-you">
          <ExportedImage src={soldier} alt="Orginal, unoptimized image" unoptimized={true} />
          <h1>
            {/* {you.slice(0, 6)}... */}
            {/* {you.slice(you.length - 4)} */}
            Me
          </h1>
        </div>
        <div className="play-battle-log-result">
          <>
            {win && !el.draw ? (
              <>
                <ExportedImage src={flag} alt="Orginal, unoptimized image" unoptimized={true} />
                <h1>Game {el.id}: Victory</h1>
              </>
            ) : el.draw ? (
              <>
                <ExportedImage src={draw} alt="Orginal, unoptimized image" unoptimized={true} />
                <h1>Game {el.id}: Draw</h1>
              </>
            ) : (
              <>
                <ExportedImage src={dead} alt="Orginal, unoptimized image" unoptimized={true} />
                <h1>Game {el.id}: Defeat</h1>
              </>
            )}
          </>
        </div>
        <div className="play-battle-log-opponent">
          <ExportedImage src={soldier} alt="Orginal, unoptimized image" unoptimized={true} />
          <h1>
            {opponent.slice(0, 6)}...
            {opponent.slice(opponent.length - 4)}
          </h1>
        </div>
      </div>
    )
  })
  const nfts = userNft.map((el) => {
    return (
      <div
        key={el.tokenId}
        className={
          el.boxType == 0
            ? "game-menu-nft game-menu-nft-normal"
            : el.boxType == 1
            ? "game-menu-nft game-menu-nft-rare"
            : el.boxType == 2
            ? "game-menu-nft game-menu-nft-legendary"
            : ""
        }
      >
        <img src={el.image} width={"100px"} />
        <h4>{el.name}</h4>
        <p>
          Type:<span>{el.attributes[0].value}</span>{" "}
        </p>
        <p>
          Attack:<span> {el.attributes[1].value}</span>
        </p>
        <p>
          Defence:<span> {el.attributes[2].value}</span>
        </p>
        <p>
          Tactics: <span>{el.attributes[3].value}</span>
        </p>
        <div className="game-menu-nft-button">
          {!el.selected ? (
            <button
              onClick={() => {
                select(true, el)
              }}
            >
              Select
            </button>
          ) : (
            <>
              <button
                className="button-remove"
                onClick={() => {
                  remove(el)
                }}
              >
                Remove
              </button>
            </>
          )}
        </div>
      </div>
    )
  })
  const remove = async (el) => {
    let array = []
    for (let i = 0; i < selectedNft.length; i++) {
      if (selectedNft[i] == el.index) {
      } else {
        array.push(selectedNft[i])
      }
    }
    setSelectedNft("")
    setSelectedNft(array)

    let nftArray = []
    for (let i = 0; i < userNft.length; i++) {
      if (userNft[i].tokenId == el.tokenId) {
        const nft = {
          index: i,
          tokenId: el.tokenId,
          boxType: el.boxType,
          attributes: el.attributes,
          name: el.name,
          image: el.image,
          selected: false,
        }
        nftArray.push(nft)
      } else {
        nftArray.push(userNft[i])
      }
    }
    setUserNft(nftArray)
  }
  const select = async (select, el) => {
    if (selectedNft.length < 3) {
      let array = selectedNft
      array.push(el.index)
      setSelectedNft("")
      setSelectedNft(array)
      let nftArray = []
      for (let i = 0; i < userNft.length; i++) {
        if (userNft[i].tokenId == el.tokenId) {
          const nft = {
            index: i,
            tokenId: el.tokenId,
            boxType: el.boxType,
            attributes: el.attributes,
            name: el.name,
            image: el.image,
            selected: true,
          }
          nftArray.push(nft)
        } else {
          nftArray.push(userNft[i])
        }
      }
      setUserNft(nftArray)
    } else {
      let lastIndex = selectedNft[0]
      let removeNft = userNft[lastIndex]
      let array = []
      let nftArray = []
      for (let i = 0; i < 3; i++) {
        if (i == 2) {
          array.push(el.index)
        } else {
          array.push(selectedNft[i + 1])
        }
      }
      setSelectedNft("")
      setSelectedNft(array)
      for (let i = 0; i < userNft.length; i++) {
        if (userNft[i].tokenId == el.tokenId) {
          const nft = {
            index: i,
            tokenId: el.tokenId,
            boxType: el.boxType,
            attributes: el.attributes,
            name: el.name,
            image: el.image,
            selected: true,
          }
          nftArray.push(nft)
        } else if (userNft[i].tokenId == removeNft.tokenId) {
          const nft = {
            index: i,
            tokenId: removeNft.tokenId,
            boxType: removeNft.boxType,
            attributes: removeNft.attributes,
            name: removeNft.name,
            image: removeNft.image,
            selected: false,
          }
          nftArray.push(nft)
        } else {
          nftArray.push(userNft[i])
        }
      }
      setUserNft(nftArray)
    }
  }
  const enterGame = async () => {
    const tokenId1 = userNft[selectedNft[0]].tokenId
    const tokenId2 = userNft[selectedNft[1]].tokenId
    const tokenId3 = userNft[selectedNft[2]].tokenId
    const nfts = document.querySelectorAll(".game-menu-nft")
    for (let i = 0; i < nfts.length; i++) {
      const button = nfts[i].querySelector("button")
      nfts[i].style.opacity = "0.5"
      button.disabled = true
    }
    const buttonDiv = document.querySelector(".game-menu-button")
    const button = buttonDiv.querySelector("button")
    const loader = document.querySelector(".loading-ring")

    loader.style.display = "block"
    button.style.display = "none"
    await new Promise(async (resolve, reject) => {
      try {
        console.log(tokenId1, tokenId2, tokenId3)
        const reponse = await contract.enterGame(tokenId1, tokenId2, tokenId3)
        if (props.chainId == 31337) await reponse.wait(1)

        contract.on("AddedToList", (sender, tokenIdArray, opponent, searching, event) => {
          getUserInfo()
          for (let i = 0; i < nfts.length; i++) {
            const button = nfts[i].querySelector("button")
            nfts[i].style.opacity = "1"
            button.disabled = false
          }
          loader.style.display = "none"
          button.style.display = "flex"
          resolve()
        })
        /* contract.on("MatchFound", (sender, opponent, event) => {
                    console.log(event.args)
                    getUserInfo() */
        contract.on("MatchBeginsSoon", (player1, player2, requestId, event) => {
          if (props.chainId == 31337 && props.correctNetwork) {
            vrfGame(requestId)
          }

          getUserInfo()
          for (let i = 0; i < nfts.length; i++) {
            const button = nfts[i].querySelector("button")
            nfts[i].style.opacity = "1"
            button.disabled = false
          }
          loader.style.display = "none"
          button.style.display = "flex"
          resolve()
          /*   }) */
        })
      } catch (e) {
        console.log(e)
        for (let i = 0; i < nfts.length; i++) {
          const button = nfts[i].querySelector("button")
          nfts[i].style.opacity = "1"
          button.disabled = false
        }
        loader.style.display = "none"
        button.style.display = "flex"
        reject()
      }
    })
  }

  /* Only for Testing Purpose */
  const vrfGame = async (requestId) => {
    console.log("We on a local network? Ok let's pretend...")
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const vrfCoordinatorV2MockContract = new ethers.Contract(vrfCoordinatorV2Mock, vrfAbi, signer) // Here we craete the mock contract
    const transRespons = await vrfCoordinatorV2MockContract.fulfillRandomWords(
      // for this function we need the request Id and the raffle adress
      requestId,
      contract.address
    )
    const receipt = await transRespons.wait(1) // THIS IS EXTREMELY IMPORTANT
    // With this we wait untill our fullfil is done and we have a winner
    // else the UI wont update because there hasnt been any event
    console.log("Responded!")
    const index = userInfo.game
    const result = await contract.finshedGames(index)
    console.log(result)
  }
  const listenMatchBeginsSoon = async (player) => {
    await new Promise(async (resolve, reject) => {
      try {
        contract.on("MatchBeginsSoon", (player1, player2, requestId, event) => {
          if (
            player.toLowerCase() == player1.toLowerCase() ||
            player.toLowerCase() == player2.toLowerCase()
          ) {
            console.log("Found")
            getUserInfo()
            resolve()
          } else {
            listenMatchBeginsSoon(player)
            resolve()
          }
        })
      } catch (e) {
        console.log(e)
        reject()
      }
    })
  }
  const listenMatch = async (player) => {
    await new Promise(async (resolve, reject) => {
      try {
        contract.on("Match", (winner, loser, draw, event) => {
          console.log(event)
          getUserInfo()
          setEndedGame({ winner: winner, loser: loser, draw: draw })
          getUserInfo()
          console.log(userInfo)
          setSelectedNft([])
          setRefresh(true)
          resolve()
        })
      } catch (e) {
        console.log(e)
        reject()
      }
    })
  }
  return (
    <div className="play-page">
      <PlayContract
        account={props.account}
        contract={contract}
        setContract={setContract}
        correctNetwork={props.correctNetwork}
        setUserNft={setUserNft}
        getUserInfo={getUserInfo}
        setContractBox={setContractBox}
        refresh={refresh}
        setRefresh={setRefresh}
      />
      {contract !== "" ? (
        <>
          {userInfo.player == props.account && userInfo.status !== 3 ? (
            <>
              {userInfo.status == 0 ? (
                <div className="play-searching">
                  <div className="play-searching-images">
                    <ExportedImage
                      src={userInfo.nft1.image}
                      alt="Orginal, unoptimized image"
                      width="200"
                      height="200"
                      unoptimized={true}
                      className="moving-image  first-image"
                    />
                    <ExportedImage
                      src={userInfo.nft2.image}
                      alt="Orginal, unoptimized image"
                      width="200"
                      height="200"
                      unoptimized={true}
                      className="moving-image  second-image"
                    />
                    <ExportedImage
                      src={userInfo.nft3.image}
                      alt="Orginal, unoptimized image"
                      width="200"
                      height="200"
                      unoptimized={true}
                      className="moving-image third-image"
                    />
                  </div>
                  <h1>Searching for opponent...</h1>
                  <p>This may take some time. Please be patient</p>
                </div>
              ) : userInfo.status == 2 ? (
                <div className="play-found">
                  <div className="play-found-me">
                    <div className="play-found-me-nft">
                      <ExportedImage
                        src={userInfo.nft1.image}
                        alt="Orginal, unoptimized image"
                        width="200"
                        height="200"
                        unoptimized={true}
                      />
                    </div>
                    <div className="play-found-me-nft">
                      <ExportedImage
                        src={userInfo.nft2.image}
                        alt="Orginal, unoptimized image"
                        width="200"
                        height="200"
                        unoptimized={true}
                      />
                    </div>
                    <div className="play-found-me-nft">
                      <ExportedImage
                        src={userInfo.nft3.image}
                        alt="Orginal, unoptimized image"
                        width="200"
                        height="200"
                        unoptimized={true}
                      />
                    </div>
                  </div>
                  <div className="play-found-info">
                    <div className="play-found-swords">
                      <ExportedImage
                        src={swordLeft}
                        alt="Orginal, unoptimized image"
                        width="200"
                        height="200"
                        unoptimized={true}
                        className="moving-sword sword-left"
                      />
                      <ExportedImage
                        src={swordRight}
                        alt="Orginal, unoptimized image"
                        width="200"
                        height="200"
                        unoptimized={true}
                        className="moving-sword sword-right"
                      />
                    </div>
                    <h1>Game {userInfo.game}</h1>
                    <div className="play-found-players">
                      <h3 className="play-found-players-text-you">You</h3>
                      <ExportedImage
                        src={vs}
                        alt="Orginal, unoptimized image"
                        width="200"
                        height="200"
                        unoptimized={true}
                      />

                      <h3 className="play-found-players-text-opponent">
                        {userInfo.opponent.slice(0, 6)}...
                        {userInfo.opponent.slice(userInfo.opponent.length - 4)}
                      </h3>
                    </div>
                  </div>
                  <div className="play-found-opponent">
                    <div className="play-found-opponent-nft">
                      <ExportedImage
                        src={userInfo.opponentNfts[0].image}
                        alt="Orginal, unoptimized image"
                        width="200"
                        height="200"
                        unoptimized={true}
                      />
                    </div>
                    <div className="play-found-opponent-nft">
                      <ExportedImage
                        src={userInfo.opponentNfts[1].image}
                        alt="Orginal, unoptimized image"
                        width="200"
                        height="200"
                        unoptimized={true}
                      />
                    </div>
                    <div className="play-found-opponent-nft">
                      <ExportedImage
                        src={userInfo.opponentNfts[2].image}
                        alt="Orginal, unoptimized image"
                        width="200"
                        height="200"
                        unoptimized={true}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
            </>
          ) : (
            <>
              <>
                {endedGame == "" ? (
                  <>
                    <div className="play-buttons-nav">
                      <button
                        onClick={() => {
                          setShowStartGame((prev) => {
                            return true
                          })
                          setShowDescription(false)
                          setShowBattleLog(false)
                        }}
                      >
                        Game Menu
                      </button>
                      <button
                        onClick={() => {
                          setShowStartGame(false)
                          setShowBattleLog((prev) => {
                            return true
                          })
                          setShowDescription(false)
                        }}
                      >
                        Battle Log
                      </button>
                      <button
                        onClick={() => {
                          setShowStartGame(false)
                          setShowBattleLog(false)
                          setShowDescription((prev) => {
                            return true
                          })
                        }}
                      >
                        Description
                      </button>
                    </div>
                    {showStartGame && userNft.length >= 3 && !showBattleLog && !showDescription ? (
                      <>
                        <div className="game-menu-nfts">
                          {" "}
                          {selectedNft.length == 3 ? (
                            <div className="game-menu-button">
                              <button
                                onClick={() => {
                                  enterGame()
                                }}
                              >
                                Enter Game
                              </button>
                              <div className="play-home-center-loading">
                                <div className="loading-ring">
                                  <div></div>
                                  <div></div>
                                  <div></div>
                                  <div></div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="game-menu-nfts-error">
                              <h1>
                                Select{" "}
                                {selectedNft.length == 1
                                  ? "2 "
                                  : selectedNft.length == 2
                                  ? "1 "
                                  : selectedNft.length == 0
                                  ? "3 "
                                  : ""}
                                NFTs to enter Game
                              </h1>
                            </div>
                          )}
                          {nfts}
                        </div>
                      </>
                    ) : showStartGame && !showBattleLog && !showDescription ? (
                      <>
                        {" "}
                        <h1 className="error">Loading...</h1>
                        <p className="error-p">
                          <small>
                            Make sure you have at least 3 NFTs that you own and which are opened.
                          </small>
                        </p>
                      </>
                    ) : (
                      ""
                    )}
                    {showBattleLog ? (
                      <div className="play-battle-logs">
                        {gameHistory.length == 0 ? (
                          <>
                            <h1 className="error">Loading...</h1>
                            <p className="errorp">Make sure you have played at least 1 game.</p>
                          </>
                        ) : (
                          <> {battleHistory}</>
                        )}
                      </div>
                    ) : (
                      ""
                    )}
                    {showDescription ? (
                      <div className="play-battle-description">
                        <ol>
                          <li>Select 3 different NFTs that you own, which should be opened.</li>
                          <li>
                            Once you have made your selection, an opponent will be randomly
                            assigned to you. Both you and your opponent will then have to wait for
                            the oracle response, which will contain the Game Logic.
                          </li>
                          <li>
                            The Game Logic will randomly select three cards from a deck: one for
                            attack, one for defense, and one for tactics. You and your opponent
                            will then compete with your attack stats for the attack card, defense
                            stats for the defense card, and tactics for the tactics card. The
                            winner of each round will earn points, and the overall winner will be
                            determined by the total number of points earned across all three
                            rounds.
                          </li>
                          <li>
                            If there is a tie, then the game will end in a draw, and no points will
                            be awarded to either player. The winner of the game will earn online
                            points for their victory.
                          </li>
                        </ol>
                      </div>
                    ) : (
                      ""
                    )}
                  </>
                ) : (
                  <div className="play-battle-result">
                    <div
                      className={
                        props.account.toLowerCase() == endedGame.winner.toLowerCase() &&
                        !endedGame.draw
                          ? "play-battle-result-box play-battle-result-win"
                          : !endedGame.draw
                          ? "play-battle-result-box play-battle-result-defeat"
                          : "play-battle-result-box play-battle-result-draw"
                      }
                    >
                      {props.account.toLowerCase() == endedGame.winner.toLowerCase() &&
                      !endedGame.draw ? (
                        <>
                          <div className="play-battle-result-title">
                            <ExportedImage
                              src={laurel}
                              alt="Orginal, unoptimized image"
                              width="200"
                              height="200"
                              unoptimized={true}
                            />
                            <h1>Victory</h1>
                            <ExportedImage
                              src={laurel}
                              alt="Orginal, unoptimized image"
                              width="200"
                              height="200"
                              unoptimized={true}
                            />
                          </div>
                          <div className="play-battle-result-winner">
                            <h2 className="play-battle-result-info">
                              Winner: <span>You</span>
                            </h2>
                            <div className="play-battle-result-nfts">
                              <div className="play-battle-result-nft">
                                <ExportedImage
                                  src={userInfo.nft1.image}
                                  alt="Orginal, unoptimized image"
                                  width="200"
                                  height="200"
                                  unoptimized={true}
                                />
                                <p>Attack: {userInfo.nft1.attack.value}</p>
                                <p>Defence: {userInfo.nft1.defence.value}</p>
                                <p>Tactics: {userInfo.nft1.tactics.value}</p>
                              </div>
                              <div className="play-battle-result-nft">
                                <ExportedImage
                                  src={userInfo.nft2.image}
                                  alt="Orginal, unoptimized image"
                                  width="200"
                                  height="200"
                                  unoptimized={true}
                                />
                                <p>Attack: {userInfo.nft2.attack.value}</p>
                                <p>Defence: {userInfo.nft2.defence.value}</p>
                                <p>Tactics: {userInfo.nft2.tactics.value}</p>
                              </div>
                              <div className="play-battle-result-nft">
                                <ExportedImage
                                  src={userInfo.nft3.image}
                                  alt="Orginal, unoptimized image"
                                  width="200"
                                  height="200"
                                  unoptimized={true}
                                />
                                <p>Attack: {userInfo.nft3.attack.value}</p>
                                <p>Defence: {userInfo.nft3.defence.value}</p>
                                <p>Tactics: {userInfo.nft3.tactics.value}</p>
                              </div>
                            </div>
                          </div>
                          <div className="play-battle-result-winner">
                            <h2 className="play-battle-result-info">
                              Opponent:{" "}
                              <span>
                                {" "}
                                {endedGame.loser.slice(0, 6)}
                                ...
                                {endedGame.loser.slice(endedGame.loser.length - 4)}
                              </span>
                            </h2>
                            <div className="play-battle-result-nfts">
                              <div className="play-battle-result-nft">
                                <ExportedImage
                                  src={userInfo.opponentNfts[0].image}
                                  alt="Orginal, unoptimized image"
                                  width="200"
                                  height="200"
                                  unoptimized={true}
                                />
                                <p>Attack: {userInfo.opponentNfts[0].attack.value}</p>
                                <p>Defence: {userInfo.opponentNfts[0].defence.value}</p>
                                <p>Tactics: {userInfo.opponentNfts[0].tactics.value}</p>
                              </div>
                              <div className="play-battle-result-nft">
                                <ExportedImage
                                  src={userInfo.opponentNfts[1].image}
                                  alt="Orginal, unoptimized image"
                                  width="200"
                                  height="200"
                                  unoptimized={true}
                                />
                                <p>Attack: {userInfo.opponentNfts[1].attack.value}</p>
                                <p>Defence: {userInfo.opponentNfts[1].defence.value}</p>
                                <p>Tactics: {userInfo.opponentNfts[1].tactics.value}</p>
                              </div>
                              <div className="play-battle-result-nft">
                                <ExportedImage
                                  src={userInfo.opponentNfts[2].image}
                                  alt="Orginal, unoptimized image"
                                  width="200"
                                  height="200"
                                  unoptimized={true}
                                />
                                <p>Attack: {userInfo.opponentNfts[2].attack.value}</p>
                                <p>Defence: {userInfo.opponentNfts[2].defence.value}</p>
                                <p>Tactics: {userInfo.opponentNfts[2].tactics.value}</p>
                              </div>
                            </div>
                          </div>
                          <div className="play-battle-result-button">
                            <button
                              onClick={() => {
                                setEndedGame("")
                              }}
                            >
                              Start new Game
                            </button>
                          </div>
                        </>
                      ) : !endedGame.draw ? (
                        <>
                          <div className="play-battle-result-title">
                            <ExportedImage
                              src={skull}
                              alt="Orginal, unoptimized image"
                              width="200"
                              height="200"
                              unoptimized={true}
                            />
                            <h1>Defeat</h1>
                            <ExportedImage
                              src={skull}
                              alt="Orginal, unoptimized image"
                              width="200"
                              height="200"
                              unoptimized={true}
                            />
                          </div>
                          <div className="play-battle-result-winner">
                            <h2 className="play-battle-result-info">
                              Loser: <span>You</span>
                            </h2>
                            <div className="play-battle-result-nfts">
                              <div className="play-battle-result-nft">
                                <ExportedImage
                                  src={userInfo.nft1.image}
                                  alt="Orginal, unoptimized image"
                                  width="200"
                                  height="200"
                                  unoptimized={true}
                                />
                                <p>Attack: {userInfo.nft1.attack.value}</p>
                                <p>Defence: {userInfo.nft1.defence.value}</p>
                                <p>Tactics: {userInfo.nft1.tactics.value}</p>
                              </div>
                              <div className="play-battle-result-nft">
                                <ExportedImage
                                  src={userInfo.nft2.image}
                                  alt="Orginal, unoptimized image"
                                  width="200"
                                  height="200"
                                  unoptimized={true}
                                />
                                <p>Attack: {userInfo.nft2.attack.value}</p>
                                <p>Defence: {userInfo.nft2.defence.value}</p>
                                <p>Tactics: {userInfo.nft2.tactics.value}</p>
                              </div>
                              <div className="play-battle-result-nft">
                                <ExportedImage
                                  src={userInfo.nft3.image}
                                  alt="Orginal, unoptimized image"
                                  width="200"
                                  height="200"
                                  unoptimized={true}
                                />
                                <p>Attack: {userInfo.nft3.attack.value}</p>
                                <p>Defence: {userInfo.nft3.defence.value}</p>
                                <p>Tactics: {userInfo.nft3.tactics.value}</p>
                              </div>
                            </div>
                          </div>
                          <div className="play-battle-result-winner">
                            <h2 className="play-battle-result-info">
                              Winner:{" "}
                              <span>
                                {" "}
                                {endedGame.loser.slice(0, 6)}
                                ...
                                {endedGame.loser.slice(endedGame.loser.length - 4)}
                              </span>
                            </h2>
                            <div className="play-battle-result-nfts">
                              <div className="play-battle-result-nft">
                                <ExportedImage
                                  src={userInfo.opponentNfts[0].image}
                                  alt="Orginal, unoptimized image"
                                  width="200"
                                  height="200"
                                  unoptimized={true}
                                />
                                <p>Attack: {userInfo.opponentNfts[0].attack.value}</p>
                                <p>Defence: {userInfo.opponentNfts[0].defence.value}</p>
                                <p>Tactics: {userInfo.opponentNfts[0].tactics.value}</p>
                              </div>
                              <div className="play-battle-result-nft">
                                <ExportedImage
                                  src={userInfo.opponentNfts[1].image}
                                  alt="Orginal, unoptimized image"
                                  width="200"
                                  height="200"
                                  unoptimized={true}
                                />
                                <p>Attack: {userInfo.opponentNfts[1].attack.value}</p>
                                <p>Defence: {userInfo.opponentNfts[1].defence.value}</p>
                                <p>Tactics: {userInfo.opponentNfts[1].tactics.value}</p>
                              </div>
                              <div className="play-battle-result-nft">
                                <ExportedImage
                                  src={userInfo.opponentNfts[2].image}
                                  alt="Orginal, unoptimized image"
                                  width="200"
                                  height="200"
                                  unoptimized={true}
                                />
                                <p>Attack: {userInfo.opponentNfts[2].attack.value}</p>
                                <p>Defence: {userInfo.opponentNfts[2].defence.value}</p>
                                <p>Tactics: {userInfo.opponentNfts[2].tactics.value}</p>
                              </div>
                            </div>
                          </div>
                          <div className="play-battle-result-button">
                            <button
                              onClick={() => {
                                setEndedGame("")
                              }}
                            >
                              Start new Game
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="play-battle-result-title">
                            <ExportedImage
                              src={draw}
                              alt="Orginal, unoptimized image"
                              width="200"
                              height="200"
                              unoptimized={true}
                            />
                            <h1>Draw</h1>
                            <ExportedImage
                              src={draw}
                              alt="Orginal, unoptimized image"
                              width="200"
                              height="200"
                              unoptimized={true}
                            />
                          </div>
                          <div className="play-battle-result-winner">
                            <h2 className="play-battle-result-info">
                              Player 1: <span>You</span>
                            </h2>
                            <div className="play-battle-result-nfts">
                              <div className="play-battle-result-nft">
                                <ExportedImage
                                  src={userInfo.nft1.image}
                                  alt="Orginal, unoptimized image"
                                  width="200"
                                  height="200"
                                  unoptimized={true}
                                />
                                <p>Attack: {userInfo.nft1.attack.value}</p>
                                <p>Defence: {userInfo.nft1.defence.value}</p>
                                <p>Tactics: {userInfo.nft1.tactics.value}</p>
                              </div>
                              <div className="play-battle-result-nft">
                                <ExportedImage
                                  src={userInfo.nft2.image}
                                  alt="Orginal, unoptimized image"
                                  width="200"
                                  height="200"
                                  unoptimized={true}
                                />
                                <p>Attack: {userInfo.nft2.attack.value}</p>
                                <p>Defence: {userInfo.nft2.defence.value}</p>
                                <p>Tactics: {userInfo.nft2.tactics.value}</p>
                              </div>
                              <div className="play-battle-result-nft">
                                <ExportedImage
                                  src={userInfo.nft3.image}
                                  alt="Orginal, unoptimized image"
                                  width="200"
                                  height="200"
                                  unoptimized={true}
                                />
                                <p>Attack: {userInfo.nft3.attack.value}</p>
                                <p>Defence: {userInfo.nft3.defence.value}</p>
                                <p>Tactics: {userInfo.nft3.tactics.value}</p>
                              </div>
                            </div>
                          </div>
                          <div className="play-battle-result-winner">
                            <h2 className="play-battle-result-info">
                              Player 2:{" "}
                              <span>
                                {" "}
                                {userInfo.opponent.slice(0, 6)}
                                ...
                                {userInfo.opponent.slice(userInfo.opponent.length - 4)}
                              </span>
                            </h2>
                            <div className="play-battle-result-nfts">
                              <div className="play-battle-result-nft">
                                <ExportedImage
                                  src={userInfo.opponentNfts[0].image}
                                  alt="Orginal, unoptimized image"
                                  width="200"
                                  height="200"
                                  unoptimized={true}
                                />
                                <p>Attack: {userInfo.opponentNfts[0].attack.value}</p>
                                <p>Defence: {userInfo.opponentNfts[0].defence.value}</p>
                                <p>Tactics: {userInfo.opponentNfts[0].tactics.value}</p>
                              </div>
                              <div className="play-battle-result-nft">
                                <ExportedImage
                                  src={userInfo.opponentNfts[1].image}
                                  alt="Orginal, unoptimized image"
                                  width="200"
                                  height="200"
                                  unoptimized={true}
                                />
                                <p>Attack: {userInfo.opponentNfts[1].attack.value}</p>
                                <p>Defence: {userInfo.opponentNfts[1].defence.value}</p>
                                <p>Tactics: {userInfo.opponentNfts[1].tactics.value}</p>
                              </div>
                              <div className="play-battle-result-nft">
                                <ExportedImage
                                  src={userInfo.opponentNfts[2].image}
                                  alt="Orginal, unoptimized image"
                                  width="200"
                                  height="200"
                                  unoptimized={true}
                                />
                                <p>Attack: {userInfo.opponentNfts[2].attack.value}</p>
                                <p>Defence: {userInfo.opponentNfts[2].defence.value}</p>
                                <p>Tactics: {userInfo.opponentNfts[2].tactics.value}</p>
                              </div>
                            </div>
                          </div>
                          <div className="play-battle-result-button">
                            <button
                              onClick={() => {
                                setEndedGame("")
                              }}
                            >
                              Start new Game
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </>
            </>
          )}
        </>
      ) : (
        <h1 className="error">Connect to your wallet via Metamask please!</h1>
      )}
    </div>
  )
}

export default Play
