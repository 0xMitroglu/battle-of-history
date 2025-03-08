import React from "react"
import { ethers } from "ethers"
import { useState, useEffect } from "react"

import {
    gameCardAbi,
    gameCardAddress,
    nftBoxAbi,
    nftBoxContractAddress,
} from "../constants/constants"
const PlayContract = (props) => {
    const [contract, setContract] = useState("")
    const [contractBox, setContractBox] = useState("")
    const createContract = (contractAddresstFromFunction, abi, signer) => {
        const contracts = new ethers.Contract(contractAddresstFromFunction, abi, signer)
        return contracts
    }
    let provider, signer
    // each time this gets rendered, it will check for the provider and the signer
    useEffect(() => {
        if (typeof window !== "undefined" && props.account !== "" && props.correctNetwork) {
            const getData = async () => {
                // so when we switch the user -> we will load the NFT again
                provider = new ethers.providers.Web3Provider(window.ethereum)
                signer = provider.getSigner()
                const contract = await createContract(gameCardAddress, gameCardAbi, signer)
                setContract(contract)
                props.setContract(contract)
                const contractBox = await createContract(nftBoxContractAddress, nftBoxAbi, signer)
                setContractBox(contractBox)
                props.setContractBox(contractBox)
            }
            getData()
        } else {
            props.setContract("")
            setContractBox("")
            props.setContractBox("")
        }
    }, [props.account])
    useEffect(() => {
        if (typeof window !== "undefined" && !props.correctNetwork) {
            props.setContract("")
            setContractBox("")
            props.setContractBox("")
        } else if (typeof window !== "undefined" && props.account !== "" && props.correctNetwork) {
            const getData = async () => {
                // so when we switch the user -> we will load the NFT again
                provider = new ethers.providers.Web3Provider(window.ethereum)
                signer = provider.getSigner()
                const contract = await createContract(gameCardAddress, gameCardAbi, signer)
                setContract(contract)
                props.setContract(contract)
                const contractBox = await createContract(nftBoxContractAddress, nftBoxAbi, signer)
                setContractBox(contractBox)
                props.setContractBox(contractBox)
            }
            getData()
        }
    }, [props.correctNetwork])
    useEffect(() => {
        let array = []
        if (contractBox !== "") {
            const getTokenIdArray = async () => {
                let tokenIdAll = []
                let index = 0
                const tokenIdHex = await contractBox.getTokenIds(props.account)
                for (let i = 0; i < tokenIdHex.length; i++) {
                    tokenIdAll.push(parseFloat(tokenIdHex[i]))
                }
                for (let i = 0; i < tokenIdAll.length; i++) {
                    const nft = await contractBox.getNft(tokenIdAll[i])
                    if (nft.Boxopened) {
                        const uri = nft.tokenUri
                        const ipfsHash = uri.replace("ipfs://", "")
                        const gatewayUrl = "https://ipfs.io/ipfs/"
                        const tokenUri = gatewayUrl + ipfsHash
                        const response = await fetch(tokenUri)
                        const data = await response.json()
                        if (nft.Boxopened) {
                            array.push({
                                index: index,
                                tokenId: tokenIdAll[i],
                                boxType: nft.boxType,
                                attributes: data.attributes,
                                name: data.name,
                                image: data.image,
                                selected: false,
                            })
                            index++
                        }
                    }
                }
                props.setUserNft(array)
            }
            getTokenIdArray()
        } else {
            props.setUserNft(array)
        }
    }, [contractBox])
    useEffect(() => {
        if (props.refresh) {
            let array = []
            const getTokenIdArray = async () => {
                let tokenIdAll = []
                let index = 0
                const tokenIdHex = await contractBox.getTokenIds(props.account)
                for (let i = 0; i < tokenIdHex.length; i++) {
                    tokenIdAll.push(parseFloat(tokenIdHex[i]))
                }
                for (let i = 0; i < tokenIdAll.length; i++) {
                    const nft = await contractBox.getNft(tokenIdAll[i])
                    if (nft.Boxopened) {
                        const uri = nft.tokenUri
                        const ipfsHash = uri.replace("ipfs://", "")
                        const gatewayUrl = "https://ipfs.io/ipfs/"
                        const tokenUri = gatewayUrl + ipfsHash
                        const response = await fetch(tokenUri)
                        const data = await response.json()
                        if (nft.Boxopened) {
                            array.push({
                                index: index,
                                tokenId: tokenIdAll[i],
                                boxType: nft.boxType,
                                attributes: data.attributes,
                                name: data.name,
                                image: data.image,
                                selected: false,
                            })
                            index++
                        }
                    }
                }
                props.setUserNft(array)
                props.setRefresh(false)
            }
            getTokenIdArray()
        }
    }, [props.refresh])

    return <></>
}
export default PlayContract
