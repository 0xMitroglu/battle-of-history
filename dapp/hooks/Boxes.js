import React from "react"
import ContractBoxes from "../back-end/ContractBoxes"
import { useState, useEffect } from "react"
import { ethers } from "ethers"
const Boxes = (props) => {
    const [contract, setContract] = useState("")
    const [boxes, setBoxes] = useState([])
    console.log(boxes.length, contract)
    useEffect(() => {
        const body = document.querySelector(".body")
        body.style.paddingTop = "75px"
        const nav = document.querySelector("nav")
    }, [])
    const Boxes = boxes.map((box) => {
        return (
            <div key={box.name} className="boxes-box">
                <img src={box.image} alt={box.name} className="boxes-img" />
                <div className="box-name">{box.name}</div>
                <div className="box-price-usd">{box.price} $</div>
                <div className="box-price-eth">
                    {ethers.utils.formatEther(`${box.priceWei}`)} ETH
                </div>
                <div className="button-load-box">
                    <button
                        className="button-box"
                        onClick={() => {
                            buyBox(box.boxType, box.price)
                        }}
                    >
                        Buy
                    </button>
                    <div className="lds-ring">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
            </div>
        )
    })
    const buyBox = async (type, price) => {
        const loaders = document.querySelectorAll(".lds-ring")
        const buttons = document.querySelectorAll(".button-box")
        const convertedPrice = await contract.priceFeedUsdToEth(price)
        const ethersPrice = await ethers.utils.formatEther(`${convertedPrice}`)
        if (type == "NORMAL") {
            await new Promise(async (resolve, reject) => {
                try {
                    loaderChangeButton(0, true)
                    const buy = await contract.buyNormalBox({ value: convertedPrice })
                    if (props.chainId == 31337) await buy.wait(1)
                    contract.on(
                        "NormalBoxMinted",
                        async (sender, tokenId, tokenUri, price, event) => {
                            loaderChangeButton(0, false)

                            resolve()
                        }
                    )
                } catch (e) {
                    loaderChangeButton(0, false)
                    console.log(e)
                }
            })
        } else if (type == "RARE") {
            await new Promise(async (resolve, reject) => {
                try {
                    loaderChangeButton(1, true)
                    const buy = await contract.buyRareBox({ value: convertedPrice })
                    if (props.chainId == 31337) await buy.wait(1)
                    contract.on(
                        "RareBoxMinted",
                        async (sender, tokenId, tokenUri, price, event) => {
                            loaderChangeButton(1, false)

                            resolve()
                        }
                    )
                } catch (e) {
                    loaderChangeButton(1, false)
                    console.log(e)
                }
            })
        } else if (type == "LEGENDARY") {
            await new Promise(async (resolve, reject) => {
                try {
                    loaderChangeButton(2, true)
                    const buy = await contract.buyLegendaryBox({ value: convertedPrice })
                    if (props.chainId == 31337) await buy.wait(1)
                    contract.on(
                        "LegendaryBoxMinted",
                        async (sender, tokenId, tokenUri, price, event) => {
                            loaderChangeButton(2, false)

                            resolve()
                        }
                    )
                } catch (e) {
                    loaderChangeButton(2, false)
                    console.log(e)
                }
            })
        }
    }
    const loaderChangeButton = async (index, loaderShow) => {
        const loaders = document.querySelectorAll(".lds-ring")
        const buttons = document.querySelectorAll(".button-box")
        loaders.forEach((loaderDiv, loaderIndex) => {
            if (loaderIndex == index && loaderShow) {
                loaderDiv.style.display = "inline-block"
            } else if (loaderIndex == index && !loaderShow) {
                loaderDiv.style.display = "none"
            }
            buttons.forEach((button, indexButton) => {
                if (indexButton == index && loaderShow) {
                    button.style.display = "none"
                } else if (indexButton == index && !loaderShow) {
                    button.style.display = "block"
                }
            })
        })
    }

    return (
        <div className="boxes-page">
            {contract !== "" ? (
                <>{boxes.length == 3 ? <div className="boxes-container"> {Boxes}</div> : ""}</>
            ) : (
                <h1 className="error">Connect to your wallet via Metamask please!</h1>
            )}
            {boxes.length == 0 && contract !== "" ? (
                <>
                    {" "}
                    <h1 className="error">Loading...</h1>
                </>
            ) : (
                ""
            )}
            <ContractBoxes
                account={props.account}
                contract={contract}
                setContract={setContract}
                setBoxes={setBoxes}
                correctNetwork={props.correctNetwork}
            />
        </div>
    )
}

export default Boxes
