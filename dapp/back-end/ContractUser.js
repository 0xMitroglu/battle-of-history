import React from "react"
import { ethers } from "ethers"
import { useState, useEffect } from "react"

import { nftBoxAbi, nftBoxContractAddress } from "../constants/constants"
const ContractUser = (props) => {
    const [contract, setContract] = useState("")
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
                const contract = await createContract(nftBoxContractAddress, nftBoxAbi, signer)
                setContract(contract)
                getUserTokenId(props.account, contract, props.selectedValue)
                props.setContract(contract)
            }
            getData()
        } else {
            props.setContract("")
        }
    }, [props.account])

    useEffect(() => {
        if (typeof window !== "undefined" && !props.correctNetwork) {
            props.setContract("")
            props.setTokenIdUser([])
        } else if (typeof window !== "undefined" && props.account !== "" && props.correctNetwork) {
            const getData = async () => {
                // so when we switch the user -> we will load the NFT again
                provider = new ethers.providers.Web3Provider(window.ethereum)
                signer = provider.getSigner()
                const contract = await createContract(nftBoxContractAddress, nftBoxAbi, signer)
                setContract(contract)
                getUserTokenId(props.account, contract, props.selectedValue)
                props.setContract(contract)
            }
            getData()
        }
    }, [props.correctNetwork])
    const getUserTokenId = async (user, contract, selectedValue) => {
        const array = []
        let nftArray = []

        if (selectedValue == "tokenId") {
            /* for (let i = 0; i < length; i++) {
                const tokenIdNft = await contract.mappingAddressToToken(user, i)
                const nft = await contract.getNft(tokenIdNft)
                nftArray.push(nft)
            } */
            const tokenIds = await contract.getTokenIds(props.account)
            for (let i = 0; i < tokenIds.length; i++) {
                const nft = await contract.getNft(tokenIds[i])
                nftArray.push(nft)
            }
        } else if (selectedValue == "rarity") {
            const tokenIds = await contract.getTokenIds(props.account)
            for (let i = 0; i < tokenIds.length; i++) {
                const nft = await contract.getNft(tokenIds[i])
                if (nft.boxType == 2) {
                    nftArray.push(nft)
                }
            }

            for (let i = 0; i < tokenIds.length; i++) {
                const nft = await contract.getNft(tokenIds[i])
                if (nft.boxType == 1) {
                    nftArray.push(nft)
                }
            }
            for (let i = 0; i < tokenIds.length; i++) {
                const nft = await contract.getNft(tokenIds[i])
                if (nft.boxType == 0) {
                    nftArray.push(nft)
                }
            }
        } else if (selectedValue == "legendary") {
            const tokenIds = await contract.getTokenIds(props.account)
            for (let i = 0; i < tokenIds.length; i++) {
                const nft = await contract.getNft(tokenIds[i])
                if (nft.boxType == 2) {
                    nftArray.push(nft)
                }
            }
        } else if (selectedValue == "rare") {
            const tokenIds = await contract.getTokenIds(props.account)
            for (let i = 0; i < tokenIds.length; i++) {
                const nft = await contract.getNft(tokenIds[i])
                if (nft.boxType == 1) {
                    nftArray.push(nft)
                }
            }
        } else if (selectedValue == "normal") {
            const tokenIds = await contract.getTokenIds(props.account)
            for (let i = 0; i < tokenIds.length; i++) {
                const nft = await contract.getNft(tokenIds[i])
                if (nft.boxType == 0) {
                    nftArray.push(nft)
                }
            }
        } else if (selectedValue == "boxes") {
            const tokenIds = await contract.getTokenIds(props.account)
            for (let i = 0; i < tokenIds.length; i++) {
                const nft = await contract.getNft(tokenIds[i])
                if (!nft.Boxopened) {
                    nftArray.push(nft)
                }
            }
        }
        for (let i = 0; i < nftArray.length; i++) {
            /* const tokenIdNft = await contract.mappingAddressToToken(user, i)
            const nft = await contract.getNft(tokenIdNft) */
            const nft = nftArray[i]

            const uri = nft.tokenUri
            const ipfsHash = uri.replace("ipfs://", "")
            const gatewayUrl = "https://ipfs.io/ipfs/"
            const tokenUri = gatewayUrl + ipfsHash
            try {
                const response = await fetch(tokenUri)
                const data = await response.json()
                const object = {
                    index: i,
                    owner: nft.owner,
                    price: parseFloat(nft.price),
                    sell: nft.sell,
                    tokenId: parseInt(nft.tokenId),
                    image: data.image,
                    open: nft.Boxopened,
                    boxtype: parseInt(nft.boxType),
                    attributes: data.attributes,
                    name: data.name,
                    description: data.description,
                }
                array.push(object)
            } catch (e) {
                console.log("error....", e)
            }
        }
        props.setTokenIdUser(array)
    }
    useEffect(() => {
        if (props.refresh == true) {
            getUserTokenId(props.account, contract, props.selectedValue)
            props.setRefresh(false)
        } else {
            return
        }
    }, [props.refresh])
    useEffect(() => {
        if (contract !== "" && props.selectedValue !== "    ") {
            getUserTokenId(props.account, contract, props.selectedValue)
        }
    }, [props.selectedValue])
    return <></>
}

export default ContractUser
