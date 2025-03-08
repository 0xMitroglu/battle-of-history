import React from "react"
import { useState } from "react"
import ContractSell from "../back-end/ContractSell"
import ExportedImage from "next-image-export-optimizer"
import { ethers } from "ethers"
import { tradeNftAddress } from "../constants/constants"
import { useEffect } from "react"
const Sell = (props) => {
    const [showMyNft, setShowMyNft] = useState(false)
    const [contract, setContract] = useState("")
    const [tradeContract, setTradeContract] = useState("")
    const [nft, setNft] = useState([])
    const [refresh, setRefresh] = useState(false)
    const [proceeds, setProceeds] = useState(0)
    useEffect(() => {
        const body = document.querySelector(".body")
        body.style.paddingTop = "75px"
        const nav = document.querySelector("nav")
    }, [])
    const nftItems = nft.map((obj) => {
        return (
            <div className="sell-nft" key={obj.tokenId}>
                <div
                    className={
                        obj.boxtype == 0
                            ? "sell-border-normal"
                            : obj.boxtype == 1
                            ? "sell-border-rare"
                            : obj.boxtype == 2
                            ? "sell-border-legendary"
                            : ""
                    }
                >
                    <div className="sell-nft-image">
                        <img src={obj.image} alt={obj.name} className="sell-img" />
                    </div>
                    <div className="sell-nft-name nowrap">{obj.name}</div>
                    <div className="sell-nft-price">
                        Price:{" "}
                        {obj.price == 0 ? (
                            <span className="bold">/ ETH</span>
                        ) : (
                            <span className="bold">
                                {ethers.utils.formatEther(`${obj.price}`)} ETH
                            </span>
                        )}
                    </div>
                    {showMyNft ? (
                        <div className="sell-nft-options">
                            <div className="sell-nft-myNft">
                                <div className="sell-nft-upload">
                                    <input
                                        type="number"
                                        className="sell-nft-upload-input"
                                        placeholder="Price in ETH"
                                    ></input>
                                    <div className="sell-nft-upload-buttons">
                                        <button
                                            className="sell-nft-upload-button"
                                            onClick={() => {
                                                sellNft(
                                                    props.account,
                                                    obj.index,
                                                    obj.tokenId,
                                                    obj.sell
                                                )
                                            }}
                                        >
                                            Upload
                                        </button>
                                        <button
                                            className="sell-nft-upload-cancel"
                                            onClick={() => {
                                                cancelSellNft(obj.index)
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                                <div
                                    className={
                                        obj.price == 0 ? "sell-nft-buttons " : "sell-nft-buttons"
                                    }
                                >
                                    <button
                                        className="sell-sell-button"
                                        onClick={() => {
                                            enterSellNft(props.account, obj.index)
                                        }}
                                    >
                                        {obj.price == 0 ? "Sell" : "Change Price"}
                                    </button>
                                    {obj.price == 0 ? (
                                        <p>
                                            After clicking on sell, you allow the contract to be
                                            approved for the NFT.
                                        </p>
                                    ) : (
                                        <button
                                            className="sell-delete-button"
                                            onClick={() => {
                                                takeDownNft(obj.index, obj.tokenId)
                                            }}
                                        >
                                            Take down
                                        </button>
                                    )}
                                </div>
                                <div className="sell-nft-center-loading">
                                    <div className="loading-ring">
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="sell-nft-buy">
                                <div className="sell-nft-info">
                                    <div className="sell-nft-price ">
                                        Owner:
                                        <span className="bold">
                                            {obj.owner.toLowerCase() ==
                                            props.account.toLowerCase() ? (
                                                "You"
                                            ) : (
                                                <>
                                                    {" "}
                                                    {obj.owner.slice(0, 6)}...
                                                    {obj.owner.slice(obj.owner.length - 4)}{" "}
                                                </>
                                            )}
                                        </span>
                                    </div>
                                    <div className="sell-nft-price">
                                        Attack : {console.log(obj)}
                                        <span className="bold">{obj.attributes[1].value}</span>
                                    </div>
                                    <div className="sell-nft-price">
                                        Defence:
                                        <span className="bold"> {obj.attributes[2].value}</span>
                                    </div>
                                    <div className="sell-nft-price">
                                        Tactics:{" "}
                                        <span className="bold">{obj.attributes[3].value}</span>
                                    </div>
                                </div>
                                <div className="sell-nft-buy-button">
                                    {obj.owner.toLowerCase() == props.account.toLowerCase() ? (
                                        ""
                                    ) : (
                                        <div className="center">
                                            <button
                                                onClick={() => {
                                                    buy(obj.tokenId, obj.index, obj.price)
                                                }}
                                            >
                                                Buy
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className="sell-nft-center-loading">
                                    <div className="loading-ring">
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        )
    })
    const buy = async (tokenId, index, price) => {
        console.log(price)
        console.log(tokenId, index, price)
        const divInfo = document.querySelectorAll(".sell-nft-buy-button")
        const loaderDiv = document.querySelectorAll(".sell-nft-center-loading")
        const loaders = document.querySelectorAll(".loading-ring")

        divInfo.forEach((div, indexDiv) => {
            if (indexDiv == index) {
                div.style.display = "none"
            }
        })
        loaderDiv.forEach((div, indexDiv) => {
            if (indexDiv == index) {
                div.style.display = "flex"
            }
        })
        loaders.forEach((div, indexDiv) => {
            if (indexDiv == index) {
                div.style.display = "block"
            }
        })
        await new Promise(async (resolve, reject) => {
            try {
                const buy = await tradeContract.buyNft(tokenId, { value: price.toString() })
                if (props.chainId == "31337") await buy.wait(1)
                tradeContract.on("BuyNft", (sender, formerOwner, tokenId, price, sell, event) => {
                    console.log(event)
                    divInfo.forEach((div, indexDiv) => {
                        if (indexDiv == index) {
                            div.style.display = "block"
                        }
                    })
                    loaderDiv.forEach((div, indexDiv) => {
                        if (indexDiv == index) {
                            div.style.display = "none"
                        }
                    })
                    loaders.forEach((div, indexDiv) => {
                        if (indexDiv == index) {
                            div.style.display = "none"
                        }
                    })
                    setRefresh(true)
                    resolve()
                })
            } catch (e) {
                divInfo.forEach((div, indexDiv) => {
                    if (indexDiv == index) {
                        div.style.display = "block"
                    }
                })
                loaderDiv.forEach((div, indexDiv) => {
                    if (indexDiv == index) {
                        div.style.display = "none"
                    }
                })
                loaders.forEach((div, indexDiv) => {
                    if (indexDiv == index) {
                        div.style.display = "none"
                    }
                })
                setRefresh(true)
                console.log(e)
                reject()
            }
        })
    }
    const takeDownNft = async (index, tokenId) => {
        const buttonsDiv = document.querySelectorAll(".sell-nft-buttons")
        const loadingDiv = document.querySelectorAll(".sell-nft-center-loading")

        buttonsDiv.forEach((div, indexDiv) => {
            if (index == indexDiv) {
                div.style.display = "none"
            }
        })
        loadingDiv.forEach((div, indexDiv) => {
            if (index == indexDiv) {
                div.style.display = "flex"
            }
        })
        const loading = document.querySelectorAll(".loading-ring")
        loading.forEach((div, divIndex) => {
            if (divIndex == index) {
                div.style.display = "block"
            }
        })
        await new Promise(async (resolve, reject) => {
            try {
                const reponse = await tradeContract.takeDownNft(tokenId)
                console.log(reponse)
                if (props.chainId == "31337") await reponse.wait(1)
                tradeContract.on("TakeDownNft", (owner, tokenId, price, sell, event) => {
                    console.log("event", event)
                    loading.forEach((div, divIndex) => {
                        if (divIndex == index) {
                            div.style.display = "none"
                        }
                    })
                    loadingDiv.forEach((div, divIndex) => {
                        if (divIndex == index) {
                            div.style.display = "none"
                        }
                    })
                    const divButton = document.querySelectorAll(".sell-nft-buttons")
                    divButton.forEach((div, indexDiv) => {
                        if (index == indexDiv) {
                            div.style.display = "flex"
                        }
                    })
                    setNft([])
                    setRefresh(true)
                    resolve()
                })
            } catch (e) {
                loading.forEach((div, divIndex) => {
                    if (divIndex == index) {
                        div.style.display = "none"
                    }
                })
                loadingDiv.forEach((div, divIndex) => {
                    if (divIndex == index) {
                        div.style.display = "none"
                    }
                })
                const divButton = document.querySelectorAll(".sell-nft-buttons")
                divButton.forEach((div, indexDiv) => {
                    if (index == indexDiv) {
                        div.style.display = "flex"
                    }
                })
                console.log(e)
                reject()
            }
        })
    }
    const sellNft = async (account, index, tokenId, sell) => {
        const approvedAddress = await contract.getApproved(tokenId)
        const divUpload = document.querySelectorAll(".sell-nft-upload")
        const marginTop = document.querySelectorAll(".sell-nft-center-loading")
        divUpload.forEach((div, divIndex) => {
            if (divIndex == index) {
                div.style.display = "none"
            }
        })
        const loading = document.querySelectorAll(".loading-ring")
        loading.forEach((div, divIndex) => {
            if (divIndex == index) {
                div.style.display = "block"
            }
        })
        marginTop.forEach((div, divIndex) => {
            if (divIndex == index) {
                div.style.display = "flex"
            }
        })
        await new Promise(async (resolve, reject) => {
            try {
                if (
                    approvedAddress.toLowerCase().toString() !=
                    tradeNftAddress.toLowerCase().toString()
                ) {
                    console.log("1")
                    const run = async () => {
                        try {
                            const approveResponse = await contract.approve(
                                tradeContract.address,
                                tokenId
                            )
                            await approveResponse.wait(1)

                            console.log(event)
                            let price
                            const inputs = document.querySelectorAll(".sell-nft-upload-input")
                            inputs.forEach((div, divIndex) => {
                                if (divIndex == index) {
                                    price = ethers.utils.parseEther(`${div.value}`)
                                }
                            })

                            const reponse = await tradeContract.sellNft(tokenId, price)
                            if (props.chainId == "31337") await reponse.wait(1)
                            tradeContract.on(
                                "SellNft",
                                async (owner, tokenId, price, sell, event) => {
                                    console.log(event)
                                    loading.forEach((div, divIndex) => {
                                        if (divIndex == index) {
                                            div.style.display = "none"
                                        }
                                    })
                                    marginTop.forEach((div, divIndex) => {
                                        if (divIndex == index) {
                                            div.style.display = "none"
                                        }
                                    })
                                    const divButton =
                                        document.querySelectorAll(".sell-nft-buttons")
                                    divButton.forEach((div, indexDiv) => {
                                        if (index == indexDiv) {
                                            div.style.display = "flex"
                                        }
                                    })
                                    setNft([])
                                    setRefresh(true)
                                    resolve()
                                }
                            )
                        } catch (e) {
                            console.log("Errorr....")
                            loading.forEach((div, divIndex) => {
                                if (divIndex == index) {
                                    div.style.display = "none"
                                }
                            })
                            marginTop.forEach((div, divIndex) => {
                                if (divIndex == index) {
                                    div.style.display = "none"
                                }
                            })
                            const divButton = document.querySelectorAll(".sell-nft-buttons")
                            divButton.forEach((div, indexDiv) => {
                                if (index == indexDiv) {
                                    div.style.display = "flex"
                                }
                            })
                            console.log(e)
                            reject()
                        }
                    }

                    run()
                } else if (
                    approvedAddress.toLowerCase().toString() ==
                        tradeNftAddress.toLowerCase().toString() &&
                    !sell
                ) {
                    console.log("2", sell)
                    let price
                    const inputs = document.querySelectorAll(".sell-nft-upload-input")
                    inputs.forEach((div, divIndex) => {
                        if (divIndex == index) {
                            price = ethers.utils.parseEther(`${div.value}`)
                        }
                    })
                    const reponse = await tradeContract.sellNft(tokenId, price)
                    if (props.chainId == "31337") await reponse.wait(1)
                    tradeContract.on("SellNft", async (owner, tokenId, price, sell, event) => {
                        console.log(event)
                        loading.forEach((div, divIndex) => {
                            if (divIndex == index) {
                                div.style.display = "none"
                            }
                        })
                        marginTop.forEach((div, divIndex) => {
                            if (divIndex == index) {
                                div.style.display = "none"
                            }
                        })
                        const divButton = document.querySelectorAll(".sell-nft-buttons")
                        divButton.forEach((div, indexDiv) => {
                            if (index == indexDiv) {
                                div.style.display = "flex"
                            }
                        })
                        setNft([])
                        setRefresh(true)
                        resolve()
                    })
                } else {
                    console.log("3", tokenId)
                    let price
                    const inputs = document.querySelectorAll(".sell-nft-upload-input")
                    inputs.forEach((div, divIndex) => {
                        if (divIndex == index) {
                            price = ethers.utils.parseEther(`${div.value}`)
                        }
                    })
                    const reponse = await tradeContract.updateNftPrice(
                        tokenId,
                        parseFloat(price).toString()
                    )
                    if (props.chainId == "31337") await reponse.wait(1)
                    tradeContract.on(
                        "UpdateNftPrice",
                        async (owner, tokenId, price, sell, event) => {
                            console.log(event)
                            loading.forEach((div, divIndex) => {
                                if (divIndex == index) {
                                    div.style.display = "none"
                                }
                            })
                            marginTop.forEach((div, divIndex) => {
                                if (divIndex == index) {
                                    div.style.display = "none"
                                }
                            })
                            const divButton = document.querySelectorAll(".sell-nft-buttons")
                            divButton.forEach((div, indexDiv) => {
                                if (index == indexDiv) {
                                    div.style.display = "flex"
                                }
                            })
                            setNft([])
                            setRefresh(true)
                            resolve()
                        }
                    )
                }
            } catch (e) {
                console.log("Errorr....")
                loading.forEach((div, divIndex) => {
                    if (divIndex == index) {
                        div.style.display = "none"
                    }
                })
                marginTop.forEach((div, divIndex) => {
                    if (divIndex == index) {
                        div.style.display = "none"
                    }
                })
                const divButton = document.querySelectorAll(".sell-nft-buttons")
                divButton.forEach((div, indexDiv) => {
                    if (index == indexDiv) {
                        div.style.display = "flex"
                    }
                })
                console.log(e)
                reject()
            }
        })
    }
    const enterSellNft = async (account, index) => {
        console.log("hi", index)
        const divButton = document.querySelectorAll(".sell-nft-buttons")
        const divUpload = document.querySelectorAll(".sell-nft-upload")
        divButton.forEach((div, indexDiv) => {
            if (index == indexDiv) {
                div.style.display = "none"
            }
        })
        divUpload.forEach((div, divIndex) => {
            if (divIndex == index) {
                div.style.display = "flex"
            }
        })
    }
    const cancelSellNft = async (index) => {
        const divButton = document.querySelectorAll(".sell-nft-buttons")
        const divUpload = document.querySelectorAll(".sell-nft-upload")
        divButton.forEach((div, indexDiv) => {
            if (index == indexDiv) {
                div.style.display = "flex"
            }
        })
        divUpload.forEach((div, divIndex) => {
            if (divIndex == index) {
                div.style.display = "none"
            }
        })
    }
    const collectProceeds = async (proceeds) => {
        const button = document.querySelector(".proceeds-button")
        button.disabled = true
        await new Promise(async (resolve, reject) => {
            try {
                const response = await tradeContract.withdrawProceeds()
                if (props.chainId == 31337) await response.wait()
                tradeContract.on("ProceedsSent", () => {
                    button.disabled = false
                    button.style.display = "none"
                    resolve()
                })
            } catch (e) {
                console.log(e)
                button.disabled = false
                reject()
            }
        })
    }
    return (
        <>
            <div className="sell-page">
                {contract !== "" ? (
                    <>
                        <div className="sell-button-view">
                            {proceeds != 0 ? (
                                <button
                                    className="sell-button-view-button proceeds-button"
                                    onClick={() => {
                                        collectProceeds(proceeds)
                                    }}
                                >
                                    Claim your money:
                                    <span className="bold">
                                        {" "}
                                        {ethers.utils.formatEther(`${proceeds}`)} ETH
                                    </span>
                                </button>
                            ) : (
                                ""
                            )}
                            <button
                                className="sell-button-view-button"
                                onClick={() => {
                                    setNft([])
                                    setShowMyNft((last) => {
                                        return !last
                                    })
                                }}
                            >
                                {showMyNft ? "View NFTs on Sale" : "View your NFTs"}
                            </button>
                        </div>
                        {nft.length == 0 ? (
                            <h1 className="error">Loading...</h1>
                        ) : (
                            <>
                                <div className="nft-sell-object">{nftItems}</div>
                            </>
                        )}
                    </>
                ) : (
                    <h1 className="error">Connect to your wallet via Metamask please!</h1>
                )}
                <ContractSell
                    contract={contract}
                    setContract={setContract}
                    account={props.account}
                    correctNetwork={props.correctNetwork}
                    showMyNft={showMyNft}
                    setNft={setNft}
                    setProceeds={setProceeds}
                    setTradeContract={setTradeContract}
                    tradeContract={tradeContract}
                    setRefresh={setRefresh}
                    refresh={refresh}
                />
            </div>
        </>
    )
}

export default Sell
