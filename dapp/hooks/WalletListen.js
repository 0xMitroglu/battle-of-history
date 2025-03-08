import React from "react"
import { useEffect } from "react"
import { ethers } from "ethers"
import { networkData, requiredNetwork, requiredChainId } from "../constants/networkData"
const WalletListen = (props) => {
    if (typeof ethereum === "undefined") {
        return
    } else {
        const getBalance = async (address) => {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const balance = await provider.getBalance(address)
            const number = ethers.utils.formatEther(balance)
            props.setBalance(number)
        }
        if (typeof window !== "undefined") {
            ethereum.on("accountsChanged", async function (accounts) {
                // Time to reload your interface with accounts[0]!
                if (accounts[0]) {
                    props.setAccount(accounts[0])
                    getBalance(accounts[0])
                    // we have to look here also for the chainId because after locking the wallet
                    // we wont have the chainId if we dont look for it here
                    const provider = new ethers.providers.Web3Provider(window.ethereum)
                    const signer = provider.getSigner()
                    const { chainId } = await provider.getNetwork()
                    props.setChainId(parseInt(chainId))
                    if (requiredChainId == parseInt(chainId)) {
                        props.setCorrectNetwork(true)
                    } else {
                        props.setCorrectNetwork(false)
                    }
                } else {
                    props.setAccount("") //if wallet gets locked we want to se it to empty string
                    props.setChainId("")
                    props.setBalance("")
                    // so we check in the callContract if empty string is true...
                    console.log("Wallet locked ...")
                }
            })
            ethereum.on("chainChanged", async (chain) => {
                // when we change the chain, so this will listen to it and set the chain Id to the current
                props.setChainId(parseInt(chain)) // we do parse Int because the chain is in hex decimals
                console.log("Changed CHAIN ID to ", parseInt(chain))
                const accounts = await ethereum.request({ method: "eth_accounts" })
                if (accounts[0]) getBalance(accounts[0])
                if (requiredChainId == parseInt(chain)) {
                    props.setCorrectNetwork(true)
                } else {
                    props.setCorrectNetwork(false)
                }
            })
        }
        // This checks, before rendering if the wallet is already connected
        const checkIfWalletIsConnected = async () => {
            const { ethereum } = window
            if (!ethereum) {
                console.log("Make sure you have metamask installed!")
                return
            } else {
                console.log("We have the ethereum object")
            }

            const accounts = await ethereum.request({ method: "eth_accounts" })

            if (accounts.length !== 0) {
                const account = accounts[0]
                console.log("Authorized account: ", account)
                props.setAccount(account)
                getBalance(accounts[0])
                // we do this so we can render always the informations when we first load the page
                const chain = async () => {
                    const provider = new ethers.providers.Web3Provider(window.ethereum)
                    const signer = provider.getSigner()
                    const { chainId } = await provider.getNetwork()
                    props.setChainId(parseInt(chainId))
                    if (requiredChainId == parseInt(chainId)) {
                        props.setCorrectNetwork(true)
                    } else {
                        props.setCorrectNetwork(false)
                    }
                }
                chain()
            } else {
                console.log("not authorized account")
            }
        }
        useEffect(() => {
            checkIfWalletIsConnected()
        }, [])
    }
    return <></>
}
export default WalletListen
