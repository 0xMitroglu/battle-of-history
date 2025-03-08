import React from "react"
import { ethers } from "ethers"
import { useState, useEffect } from "react"

import { nftBoxAbi, nftBoxContractAddress } from "../constants/constants"
const ContractBoxes = (props) => {
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
                props.setContract(contract)
                setBoxes(contract)
            }
            getData()
        } else {
            props.setContract("")
        }
    }, [props.account])
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
                props.setContract(contract)
                setBoxes(contract)
            }
            getData()
        }
    }, [props.correctNetwork])

    const setBoxes = async (contract) => {
        const array = []
        const normalBoxPrice = await contract.PRICE_NORMAL_BOX_USD()
        const rareBoxPrice = await contract.PRICE_RARE_BOX_USD()
        const legendaryBoxPrice = await contract.PRICE_LEGENDARY_BOX_USD()

        for (let i = 0; i < 3; i++) {
            const boxUri = await contract.getNftBoxesUri(i)
            const ipfsUri = boxUri
            const ipfsHash = ipfsUri.replace("ipfs://", "")
            const gatewayUrl = "https://ipfs.io/ipfs/"
            const boxUrl = gatewayUrl + ipfsHash

            // Fetch the content using the Fetch API
            const response = await fetch(boxUrl)
            const convertedPrice = await contract.priceFeedUsdToEth(
                i == 0
                    ? parseFloat(normalBoxPrice)
                    : i == 1
                    ? parseFloat(rareBoxPrice)
                    : parseFloat(legendaryBoxPrice)
            )
            const data = await response.json()
            const boxData = {
                name: data.name,
                index: i,
                description: data.description,
                image: data.image,
                boxType: data.attributes[0].value,
                price:
                    i == 0
                        ? parseFloat(normalBoxPrice)
                        : i == 1
                        ? parseFloat(rareBoxPrice)
                        : parseFloat(legendaryBoxPrice),
                priceWei: convertedPrice,
            }
            array.push(boxData)
        }
        props.setBoxes(array)
    }

    return <></>
}

export default ContractBoxes
