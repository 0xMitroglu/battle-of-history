import React from "react"
import { ethers } from "ethers"
import { useState, useEffect } from "react"

import {
    nftBoxAbi,
    nftBoxContractAddress,
    nftTradeAbi,
    tradeNftAddress,
} from "../constants/constants"
const ContractSell = (props) => {
    const [contract, setContract] = useState("")
    const [tradeNft, setTradeNft] = useState("")
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
                const contract = createContract(nftBoxContractAddress, nftBoxAbi, signer)
                const tradeContract = createContract(tradeNftAddress, nftTradeAbi, signer)
                setTradeNft(tradeContract)
                setContract(contract)
                props.setContract(contract)
                props.setTradeContract(tradeContract)
                const getProceeds = async (contract, account) => {
                    try {
                        const proceeds = await contract.getProceeds(account)
                        props.setProceeds(parseFloat(proceeds))
                    } catch (e) {
                        console.log("Error")
                    }
                }
                if (props.correctNetwork) {
                    getProceeds(tradeContract, props.account)
                }
                if (props.showMyNft) {
                    showMyNfts(props.account, contract)
                } else {
                    console.log("Beginning")
                    showAllNfts(props.account, contract, tradeContract)
                }
            }
            getData()
        } else {
            props.setContract("")
        }
    }, [props.account])
    useEffect(() => {
        const run = async () => {
            if (props.account !== "" && props.correctNetwork && props.contract !== "") {
                if (props.showMyNft) {
                    showMyNfts(props.account)
                } else if (!props.showMyNft) {
                    console.log("Beginning")
                    showAllNfts(props.account, contract, tradeNft)
                }
            }
        }
        run()
    }, [props.showMyNft])
    const showMyNfts = async (account) => {
        let index = 0
        let nftArray = []
        const tokenIds = await contract.getTokenIds(account)
        for (let i = 0; i < parseInt(tokenIds.length); i++) {
            const tokenId = tokenIds[i]
            const nft = await contract.getNft(tokenId)
            const tradeNft = await props.tradeContract.tokenIdToNft(tokenId)
            if (
                tradeNft.owner.toLowerCase().toString() == account.toLowerCase().toString() &&
                nft.Boxopened
            ) {
                const uri = nft.tokenUri
                const ipfsHash = uri.replace("ipfs://", "")
                const gatewayUrl = "https://ipfs.io/ipfs/"
                const tokenUri = gatewayUrl + ipfsHash
                const response = await fetch(tokenUri)
                const data = await response.json()

                const object = {
                    index: index,
                    owner: props.account,
                    price: tradeNft.price,
                    sell: tradeNft.sell,
                    tokenId: parseInt(nft.tokenId),
                    image: data.image,
                    boxtype: parseInt(nft.boxType),
                    attributes: data.attributes,
                    name: data.name,
                }
                index++
                nftArray.push(object)
            } else if (nft.Boxopened) {
                const uri = nft.tokenUri
                const ipfsHash = uri.replace("ipfs://", "")
                const gatewayUrl = "https://ipfs.io/ipfs/"
                const tokenUri = gatewayUrl + ipfsHash
                const response = await fetch(tokenUri)
                const data = await response.json()
                const object = {
                    index: index,
                    owner: props.account,
                    price: 0,
                    sell: false,
                    tokenId: parseInt(nft.tokenId),
                    image: data.image,
                    boxtype: parseInt(nft.boxType),
                    attributes: data.attributes,
                    name: data.name,
                }
                index++
                nftArray.push(object)
            }
        }
        props.setNft(nftArray)
    }
    const showAllNfts = async (account, contract, trade) => {
        let index = 0
        let nftArray = []
        const getTokenCounter = await contract.getTokenCounter()
        for (let i = 0; i < parseFloat(getTokenCounter); i++) {
            const tokenId = i
            const nft = await contract.getNft(tokenId)
            let tradeNft
            try {
                tradeNft = await trade.tokenIdToNft(tokenId)
                if (tradeNft.sell) {
                    const uri = nft.tokenUri
                    const ipfsHash = uri.replace("ipfs://", "")
                    const gatewayUrl = "https://ipfs.io/ipfs/"
                    const tokenUri = gatewayUrl + ipfsHash
                    const response = await fetch(tokenUri)
                    const data = await response.json()
                    const object = {
                        index: index,
                        owner: tradeNft.owner,
                        price: tradeNft.price,
                        sell: tradeNft.sell,
                        tokenId: parseInt(nft.tokenId),
                        image: data.image,
                        boxtype: parseInt(nft.boxType),
                        attributes: data.attributes,
                        name: data.name,
                    }
                    index++
                    nftArray.push(object)
                    console.log(object)
                }
            } catch (e) {
                console.log(e)
            }
        }
        props.setNft(nftArray)
    }
    useEffect(() => {
        if (typeof window !== "undefined" && !props.correctNetwork) {
            props.setContract("")
        } else if (typeof window !== "undefined" && props.account !== "" && props.correctNetwork) {
            const getData = async () => {
                // so when we switch the user -> we will load the NFT again
                provider = new ethers.providers.Web3Provider(window.ethereum)
                signer = provider.getSigner()
                const contract = await createContract(nftBoxContractAddress, nftBoxAbi, signer)
                setContract(contract)
                const tradeContract = createContract(tradeNftAddress, nftTradeAbi, signer)
                setTradeNft(tradeContract)
                props.setTradeContract(tradeContract)
                if (props.showMyNft) {
                    showMyNfts(props.account)
                } else if (!props.showMyNft) {
                    console.log("Beginning")
                    showAllNfts(props.account, contract, tradeContract)
                }

                props.setContract(contract)
            }
            getData()
        }
    }, [props.correctNetwork])
    useEffect(() => {
        if (props.refresh) {
            if (props.showMyNft) {
                showMyNfts(props.account)
            } else if (!props.showMyNft) {
                showAllNfts(props.account, contract, tradeNft)
            }
            props.setRefresh(false)
        }
    }, [props.refresh])

    return <></>
}

export default ContractSell
