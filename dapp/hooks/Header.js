import React from "react"
import { ethers } from "ethers"
import { networkData, requiredNetwork, requiredChainId } from "../constants/networkData"
import ExportedImage from "next-image-export-optimizer"
import logo from "../public/image/logo22Logo.png"

import {
    faHome,
    faCartShopping,
    faUser,
    faGamepad,
    faRightLeft,
} from "@fortawesome/free-solid-svg-icons"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
const Header = (props) => {
    // Get Balance Function
    const getBalance = async (address) => {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(address)
        const number = ethers.utils.formatEther(balance)
        props.setBalance(number)
    }
    // Button
    const connectWallet = async () => {
        console.log("Clicked on Wallet Button")
        try {
            const { ethereum } = window

            if (!ethereum) {
                alert("Get Metamask!")
                return
            }

            const accounts = await ethereum.request({
                method: "eth_requestAccounts",
            })
            props.setAccount(accounts[0])
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            const { chainId } = await provider.getNetwork()
            props.setChainId(parseInt(chainId))
            if (requiredChainId == parseInt(chainId)) {
                props.setCorrectNetwork(true)
            } else {
                props.setCorrectNetwork(false)
            }
            getBalance(accounts[0])
        } catch (error) {
            console.log(error)
        }
    }
    const changeToNetwork = async () => {
        if (!props.correctNetwork) {
            if (props.account === "") connectWallet()
            try {
                await window.ethereum.request({
                    method: "wallet_switchEthereumChain",
                    params: [
                        {
                            chainId: networkData[requiredNetwork].chainId,
                        },
                    ],
                })
            } catch (e) {
                console.log("Adding the network to the walllet", e)
                if (
                    e.message == "walllet User rejected the request." ||
                    e.message == "User rejected the request."
                ) {
                    return // we dont want that the user gets spammed
                }
                await window.ethereum.request({
                    method: "wallet_addEthereumChain",
                    params: [
                        {
                            chainId: networkData[requiredNetwork].chainId,
                            rpcUrls: networkData[requiredNetwork].rpcUrls,
                            chainName: networkData[requiredNetwork].chainName,
                            nativeCurrency: networkData[requiredNetwork].nativeCurrency,
                            blockExplorerUrls: networkData[requiredNetwork].blockExplorerUrls,
                        },
                    ],
                })
            }
        }
    }

    return (
        <nav>
            <div className="nav-logo">
                <ExportedImage src={logo} alt="Orginal, unoptimized image" unoptimized={true} />
            </div>
            <ul className="nav-links">
                <li
                    className="nav-item"
                    onClick={() => {
                        props.setShowHome(true)
                        props.setShowUser(false)
                        props.setShowBoxes(false)
                        props.setShowSell(false)
                        props.setShowPlay(false)
                    }}
                >
                    Home
                </li>
                <li
                    className="nav-item"
                    onClick={() => {
                        props.setShowHome(false)
                        props.setShowUser(true)
                        props.setShowBoxes(false)
                        props.setShowSell(false)
                        props.setShowPlay(false)
                    }}
                >
                    User
                </li>

                <li
                    className="nav-item"
                    onClick={() => {
                        props.setShowHome(false)
                        props.setShowUser(false)
                        props.setShowBoxes(true)
                        props.setShowSell(false)
                        props.setShowPlay(false)
                    }}
                >
                    Boxes
                </li>
                <li
                    className="nav-item"
                    onClick={() => {
                        props.setShowHome(false)
                        props.setShowUser(false)
                        props.setShowBoxes(false)
                        props.setShowSell(true)
                        props.setShowPlay(false)
                    }}
                >
                    Sell
                </li>
                <li
                    className="nav-item"
                    onClick={() => {
                        props.setShowHome(false)
                        props.setShowUser(false)
                        props.setShowBoxes(false)
                        props.setShowSell(false)
                        props.setShowPlay(true)
                    }}
                >
                    Play
                </li>
                <li className="nav__connect__mobile">
                    {props.account === "" ? (
                        <div
                            onClick={() => {
                                changeToNetwork()
                            }}
                            className="red"
                        >
                            {" "}
                            Connect
                        </div>
                    ) : !props.correctNetwork ? (
                        <div
                            onClick={() => {
                                changeToNetwork()
                            }}
                            className="red"
                        >
                            Connect
                        </div>
                    ) : (
                        <>Connected</>
                    )}
                </li>
            </ul>
            <div className="nav-account">
                {props.account === "" ? (
                    <button
                        onClick={() => {
                            changeToNetwork()
                        }}
                        className="connectWallet"
                    >
                        CONNECT TO WALLET
                    </button>
                ) : !props.correctNetwork ? (
                    <button
                        onClick={() => {
                            changeToNetwork()
                        }}
                        className="connectWallet"
                    >
                        Change Network
                    </button>
                ) : (
                    <div className="nav-user">
                        <p>{`Connected to ${props.account.slice(0, 6)}...${props.account.slice(
                            props.account.length - 4
                        )}`}</p>
                        <p> {`Current Balance: ${props.balance.slice(0, 6)}`}</p>
                    </div>
                )}
            </div>
        </nav>
    )
}

export default Header
