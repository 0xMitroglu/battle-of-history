import Head from "next/head"
import Image from "next/image"
import { useState, useEffect } from "react"

//Import hooks
import WalletListen from "../hooks/WalletListen" // listens to any change ex. if we switch chainId or switch Account
import Header from "../hooks/Header"
import Boxes from "../hooks/Boxes"
import HomePage from "../hooks/HomePage"
import Play from "../hooks/Play"
import Sell from "../hooks/Sell"
import User from "../hooks/User"

export default function Home() {
    const [account, setAccount] = useState("")
    const [chainId, setChainId] = useState("")
    const [balance, setBalance] = useState("")
    const [correctNetwork, setCorrectNetwork] = useState(false)
    const [showHome, setShowHome] = useState(true)
    const [showUser, setShowUser] = useState(false)
    const [showBoxes, setShowBoxes] = useState(false)
    const [showSell, setShowSell] = useState(false)
    const [showPlay, setShowPlay] = useState(false)

    return (
        <>
            <Head>
                <title>Battle Of History</title>
                <meta name="description" content="Decentralized Online Game" />
                <link rel="icon" href="/image/logo2Empty.png" />
            </Head>
            <WalletListen
                setAccount={setAccount}
                account={account}
                setChainId={setChainId}
                chainId={chainId}
                balance={balance}
                setBalance={setBalance}
                correctNetwork={correctNetwork}
                setCorrectNetwork={setCorrectNetwork}
            />
            <div className="body">
                <Header
                    setAccount={setAccount}
                    account={account}
                    setChainId={setChainId}
                    chainId={chainId}
                    balance={balance}
                    setBalance={setBalance}
                    correctNetwork={correctNetwork}
                    setCorrectNetwork={setCorrectNetwork}
                    setShowHome={setShowHome}
                    setShowUser={setShowUser}
                    setShowBoxes={setShowBoxes}
                    setShowSell={setShowSell}
                    setShowPlay={setShowPlay}
                />
                {showHome ? (
                    <HomePage
                        correctNetwork={correctNetwork}
                        chainId={chainId}
                        balance={balance}
                        account={account}
                        setShowPlay={setShowPlay}
                        setShowHome={setShowHome}
                        setShowBoxes={setShowBoxes}
                        setShowSell={setShowSell}
                    />
                ) : (
                    ""
                )}
                {showUser ? (
                    <User
                        correctNetwork={correctNetwork}
                        chainId={chainId}
                        balance={balance}
                        account={account}
                    />
                ) : (
                    ""
                )}
                {showBoxes ? (
                    <Boxes
                        correctNetwork={correctNetwork}
                        chainId={chainId}
                        balance={balance}
                        account={account}
                    />
                ) : (
                    ""
                )}
                {showSell ? (
                    <Sell
                        correctNetwork={correctNetwork}
                        chainId={chainId}
                        balance={balance}
                        account={account}
                    />
                ) : (
                    ""
                )}
                {showPlay ? (
                    <Play
                        correctNetwork={correctNetwork}
                        chainId={chainId}
                        balance={balance}
                        account={account}
                    />
                ) : (
                    ""
                )}
            </div>
        </>
    )
}
