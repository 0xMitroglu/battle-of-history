import React from "react"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import ContractUser from "../back-end/ContractUser"
import personLogo from "../public/image/personLogo.png"
import ExportedImage from "next-image-export-optimizer"
import { faArrowRight, faArrowDown } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { vrfAbi, vrfCoordinatorV2Mock } from "../constants/constants"
const User = (props) => {
  const [contract, setContract] = useState("")
  const [tokenIdUser, setTokenIdUser] = useState([])
  const [refresh, setRefresh] = useState(false)
  const [selectedValue, setSelectedValue] = useState("tokenId")
  const [showSelect, setShowSelect] = useState(false)
  useEffect(() => {
    const body = document.querySelector(".body")
    body.style.paddingTop = "75px"
    const nav = document.querySelector("nav")
  }, [])
  const handleChange = (value) => {
    setTokenIdUser([])
    setSelectedValue(value)
  }
  const tokenIdObjects = tokenIdUser.map((obj) => {
    return (
      <div className="user-object" key={obj.tokenId}>
        <div
          className={
            obj.boxtype == 0
              ? "user-normalBox"
              : obj.boxtype == 1
              ? "user-rareBox"
              : obj.boxtype == 2
              ? "user-legendaryBox"
              : ""
          }
        >
          <div className="user-nft-description">
            <div className="user-nft-description-text">{obj.description}</div>
            <div className="user-nft-return">
              <button
                className={
                  obj.boxtype == 0
                    ? "user-openBox-normal"
                    : obj.boxtype == 1
                    ? "user-openBox-rare"
                    : obj.boxtype == 2
                    ? "user-openBox-legendary"
                    : ""
                }
                onClick={() => {
                  hideDescription(obj.index)
                }}
              >
                Return
              </button>
            </div>
          </div>
          <div className="user-nft-info">
            <div className="user-object-image-div">
              <img src={obj.image} alt={obj.tokenId} className="user-object-image" />
            </div>
            <div className="user-object-title">{obj.name}</div>
            <div className="user-object-info">
              <div className="user-object-info-arg">
                Type:
                <span className="user-info-value">{obj.attributes[0].value}</span>
              </div>
              {obj.open ? (
                <>
                  <div className="user-object-info-arg">
                    Attack:
                    <span className="user-info-value">{obj.attributes[1].value}</span>
                  </div>
                  <div className="user-object-info-arg">
                    Defence:
                    <span className="user-info-value">{obj.attributes[2].value}</span>
                  </div>
                  <div className="user-object-info-arg">
                    Tactics:
                    <span className="user-info-value">{obj.attributes[3].value}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="user-object-info-arg">Attack: {"  "} /</div>
                  <div className="user-object-info-arg">
                    Defence:
                    {"  "} /
                  </div>
                  <div className="user-object-info-arg">
                    Tactics:
                    {"  "} /
                  </div>
                </>
              )}
              <div className="user-object-button-sell">
                <button
                  className={
                    obj.boxtype == 0
                      ? "user-openBox-normal"
                      : obj.boxtype == 1
                      ? "user-openBox-rare"
                      : obj.boxtype == 2
                      ? "user-openBox-legendary"
                      : ""
                  }
                  onClick={() => {
                    if (!obj.open) {
                      openBox(obj.tokenId, obj.index)
                    } else {
                      showDescription(obj.index, obj.description, obj.boxtype)
                    }
                  }}
                >
                  {!obj.open ? <>Open Box</> : <>Description</>}
                </button>
                <div className="edit"></div>
                <div className="loading-ring">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  })
  const showDescription = async (index) => {
    const userobjects = document.querySelectorAll(".user-nft-info")
    const descriptionDivs = document.querySelectorAll(".user-nft-description")
    userobjects.forEach((divUser, indexDiv) => {
      if (index == indexDiv) {
        divUser.style.display = "none"
      }
      descriptionDivs.forEach((divDes, desIndex) => {
        if (desIndex == index) {
          divDes.style.display = "block"
        }
      })
    })
  }
  const hideDescription = async (index) => {
    const userobjects = document.querySelectorAll(".user-nft-info")
    const descriptionDivs = document.querySelectorAll(".user-nft-description")
    userobjects.forEach((divUser, indexDiv) => {
      if (index == indexDiv) {
        divUser.style.display = "block"
      }
      descriptionDivs.forEach((divDes, desIndex) => {
        if (desIndex == index) {
          divDes.style.display = "none"
        }
      })
    })
  }

  const openBox = async (tokenId, indexButton) => {
    loaderChangeButton(indexButton, true)
    await new Promise(async (resolve, reject) => {
      try {
        const reponse = await contract.openBox(tokenId)
        if (props.chainId == 31337 && props.correctNetwork) {
          const tx = await reponse.wait(1)
          async function mockVrf(requestId, raffle) {
            console.log("We on a local network? Ok let's pretend...")
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            const vrfCoordinatorV2MockContract = new ethers.Contract(
              vrfCoordinatorV2Mock,
              vrfAbi,
              signer
            ) // Here we craete the mock contract
            const transRespons = await vrfCoordinatorV2MockContract.fulfillRandomWords(
              // for this function we need the request Id and the raffle adress
              requestId,
              raffle.address
            )
            const receipt = await transRespons.wait(1) // THIS IS EXTREMELY IMPORTANT
            // With this we wait untill our fullfil is done and we have a winner
            // else the UI wont update because there hasnt been any event
            console.log("Responded!")
          }
          mockVrf(tx.events[1].args.requestId, contract)
        }
        contract.on("BoxOpened", (e) => {
          // now we can listen for the event
          console.log("Winner picked: ", e) // the e is the winner which is returned from the event
          setTokenIdUser([])
          setRefresh(true)

          loaderChangeButton(indexButton, false)
          resolve()
        })
      } catch (e) {
        loaderChangeButton(indexButton, false)
        console.log(e)
      }
    })
  }
  const loaderChangeButton = async (index, loaderShow) => {
    const loaders = document.querySelectorAll(".loading-ring")
    const div = document.querySelectorAll(".user-object-button-sell")
    const buttons = document.querySelectorAll("button")
    loaders.forEach((loaderDiv, loaderIndex) => {
      if (loaderIndex == index && loaderShow) {
        loaderDiv.style.display = "inline-block"
        buttons.forEach((button) => {
          button.disabled = true
        })
      } else if (loaderIndex == index && !loaderShow) {
        loaderDiv.style.display = "none"
        buttons.forEach((button) => {
          button.disabled = false
        })
      }
      div.forEach((div, indexDiv) => {
        if (indexDiv == index && loaderShow) {
          const button = div.querySelector("button")
          button.style.display = "none"
        } else if (indexDiv == index && !loaderShow) {
          const button = div.querySelector("button")
          button.style.display = "block"
        }
      })
    })
  }
  return (
    <div className="user-page">
      <div class="user-select">
        <div
          className={showSelect ? "select-trigger roundedBorders" : "select-trigger"}
          onClick={() => {
            setShowSelect((prev) => {
              return !prev
            })
          }}
        >
          {selectedValue == "tokenId" || selectedValue == "rarity" ? (
            <p>Sort by {selectedValue == "tokenId" ? "bought" : selectedValue}</p>
          ) : (
            <p>Show only {selectedValue}</p>
          )}
          <FontAwesomeIcon icon={!showSelect ? faArrowRight : faArrowDown} className="fa" />
        </div>
        {showSelect ? (
          <div class="options">
            {selectedValue == "tokenId" ? (
              ""
            ) : (
              <div
                class="option"
                onClick={() => {
                  handleChange("tokenId")
                  setShowSelect((prev) => {
                    return !prev
                  })
                }}
              >
                Sort by bought
              </div>
            )}
            {selectedValue == "rarity" ? (
              ""
            ) : (
              <div
                class="option"
                onClick={() => {
                  handleChange("rarity")
                  setShowSelect((prev) => {
                    return !prev
                  })
                }}
              >
                Sort by rarity
              </div>
            )}
            {selectedValue == "boxes" ? (
              ""
            ) : (
              <div
                class="option"
                onClick={() => {
                  handleChange("boxes")
                  setShowSelect((prev) => {
                    return !prev
                  })
                }}
              >
                Show only boxes
              </div>
            )}
            {selectedValue == "legendary" ? (
              ""
            ) : (
              <div
                class="option"
                onClick={() => {
                  handleChange("legendary")
                  setShowSelect((prev) => {
                    return !prev
                  })
                }}
              >
                Show only legendary
              </div>
            )}
            {selectedValue == "rare" ? (
              ""
            ) : (
              <div
                class="option"
                onClick={() => {
                  handleChange("rare")
                  setShowSelect((prev) => {
                    return !prev
                  })
                }}
              >
                Show only rare
              </div>
            )}
            {selectedValue == "normal" ? (
              ""
            ) : (
              <div
                class="option"
                onClick={() => {
                  handleChange("normal")
                  setShowSelect((prev) => {
                    return !prev
                  })
                }}
              >
                Show only normal
              </div>
            )}
          </div>
        ) : (
          ""
        )}
      </div>
      {contract !== "" ? (
        <>
          {tokenIdUser.length != 0 ? (
            <div className="user-container"> {tokenIdObjects}</div>
          ) : (
            <h1 className="error">Loading...</h1>
          )}
        </>
      ) : (
        <h1 className="error">Connect to your wallet via Metamask please!</h1>
      )}

      <ContractUser
        account={props.account}
        contract={contract}
        setContract={setContract}
        correctNetwork={props.correctNetwork}
        setTokenIdUser={setTokenIdUser}
        refresh={refresh}
        setRefresh={setRefresh}
        selectedValue={selectedValue}
      />
    </div>
  )
}

export default User
