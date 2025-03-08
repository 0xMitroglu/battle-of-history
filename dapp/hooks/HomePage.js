import React from "react"
import ExportedImage from "next-image-export-optimizer"
import backgroundImage from "../public/image/cut.png"
import ceasarLegendary from "../public/image/characters/caesarLegendary.png"
import mussuliniRare from "../public/image/characters/mussuliniRare.png"
import bismarckLegendary from "../public/image/characters/bismarckLegendary.png"
import ceasarLegendary300 from "../public/image/characters/300caesarLegendary.png"
import mussuliniRare300 from "../public/image/characters/300mussuliniRare.png"
import bismarckLegendary300 from "../public/image/characters/300bismarckLegendary.png"
import legendaryBox from "../public/image/boxes/legendaryBox.png"
import rareBox from "../public/image/boxes/rareBox.png"
import normalBox from "../public/image/boxes/normalBox.png"
import colombusLegendary from "../public/image/characters/colombusLegendary.png"
import colombusRare from "../public/image/characters/colombusRare.png"
import colombusNormal from "../public/image/characters/colombusNormal.png"
import swords from "../public/image/swords.png"
import eth from "../public/image/eth.png"
import transfer from "../public/image/transfer.png"
import trade from "../public/image/trade.png"
import action from "../public/image/action.png"
import verified from "../public/image/verified.png"
import blockchain from "../public/image/blockchain.png"

import Footer from "./Footer"
import { useEffect } from "react"
import { faL } from "@fortawesome/free-solid-svg-icons"
const HomePage = (props) => {
    useEffect(() => {
        function handleScroll() {
            const scrollTop = window.scrollY
            animations(scrollTop)
            if (scrollTop !== 0) {
                const body = document.querySelector(".body")
                /* body.style.paddingTop = "75px" */
                const nav = document.querySelector("nav")
                nav.style.top = "0px"
            }
            if (scrollTop < window.innerHeight / 4) {
                const body = document.querySelector(".body")
                /* body.style.paddingTop = "75px" */
                const nav = document.querySelector("nav")
                nav.style.top = "-100px"
            }
        }

        window.addEventListener("scroll", handleScroll)

        return () => {
            window.removeEventListener("scroll", handleScroll)
        }
    }, [])
    useEffect(() => {
        const body = document.querySelector(".body")
        body.style.paddingTop = "0px"
        const nav = document.querySelector("nav")
        nav.style.top = "-100px"
    }, [])
    const animations = async (offset) => {
        const home__page1 = document.querySelector(".home__page2")
        const spaceTop = home__page1.offsetTop + 75
        /* --unique Nft--- */
        const container1 = document.querySelector(".home__page2__box1__col2")
        const text1 = document.querySelector(".home__page2__box1__col1")
        const image1 = document.querySelector(".box1__ceasar")
        const image2 = document.querySelector(".box1__mussulini")
        const image3 = document.querySelector(".box1__bismarck")
        if (
            container1.offsetTop + container1.offsetHeight + 100 + spaceTop <
            window.innerHeight + offset
        ) {
            text1.classList.add("animation1")
            image2.classList.add("animation1")
            image1.classList.add("animation1")
            image3.classList.add("animation1")
        }
        if (text1.offsetTop + text1.offsetHeight + 50 + spaceTop < window.innerHeight + offset) {
            text1.classList.add("animation1")
        }

        /* Boxes */
        const imageBox1 = document.querySelector(".home__box__normal")
        const imageBox2 = document.querySelector(".home__box__rare")
        const imageBox3 = document.querySelector(".home__box__legendary")
        const h1Box1 = document.querySelector(".home__box__h1__normal")
        const pBox1 = document.querySelector(".home__box__p__normal")
        const h1Box2 = document.querySelector(".home__box__h1__rare")
        const pBox2 = document.querySelector(".home__box__p__rare")
        const h1Box3 = document.querySelector(".home__box__h1__legendary")
        const pBox3 = document.querySelector(".home__box__p__legendary")
        if (pBox1.offsetTop + pBox1.offsetHeight + spaceTop < window.innerHeight + offset) {
            imageBox1.classList.add("animation1")
            h1Box1.classList.add("animation1")
            pBox1.classList.add("animation1")
        }
        if (pBox2.offsetTop + pBox2.offsetHeight + spaceTop < window.innerHeight + offset) {
            imageBox2.classList.add("animation1")
            h1Box2.classList.add("animation1")
            pBox2.classList.add("animation1")
        }
        if (pBox3.offsetTop + pBox3.offsetHeight + spaceTop < window.innerHeight + offset) {
            imageBox3.classList.add("animation1")
            h1Box3.classList.add("animation1")
            pBox3.classList.add("animation1")
        }
        /* -----normal, rare, legendary */
        const container3 = document.querySelector(".home__page2__box3__col2")
        const image1Box3 = document.querySelector(".home__box3__1")
        const image2Box3 = document.querySelector(".home__box3__2")
        const image3Box3 = document.querySelector(".home__box3__3")
        if (
            container3.offsetTop + container3.offsetHeight + spaceTop <
            window.innerHeight + offset
        ) {
            image1Box3.classList.add("animation1")
            image2Box3.classList.add("animation1")
            image3Box3.classList.add("animation1")
        }
        /* ----Game---- */
        const container4 = document.querySelector(".home__page2__box4__col2")
        const image1Box4 = document.querySelector(".home__game__1")
        const image2Box4 = document.querySelector(".home__game__2")
        const swords = document.querySelector(".swords")
        if (
            container4.offsetTop + container4.offsetHeight * 1.25 + spaceTop <
            window.innerHeight + offset
        ) {
            image1Box4.classList.add("animation1")
            image2Box4.classList.add("animation1")
            swords.classList.add("animation1")
        }
        /* ---------Selling Nft--------- */
        const text4 = document.querySelector(".home__page2__box5__col1")
        const image1Box5 = document.querySelector(".home__page2__box5__col2__ceasar")
        const image2Box5 = document.querySelector(".home__page2__box5__col2__eth")
        if (text4.offsetTop + text4.offsetHeight + 150 + spaceTop < window.innerHeight + offset) {
            text4.classList.add("animation1")
        }
        if (
            image1Box5.offsetTop + image1Box5.offsetHeight + spaceTop + 50 <
            window.innerHeight + offset
        ) {
            image1Box5.classList.add("animation1")
            image2Box5.classList.add("animation1")
        }
        /* -------------Benefits----------------- */
        const benefits1 = document.querySelector(".benefits1")
        const benefits2 = document.querySelector(".benefits2")
        const benefits3 = document.querySelector(".benefits3")
        const benefits4 = document.querySelector(".benefits4")
        if (
            benefits4.offsetTop + benefits4.offsetHeight + spaceTop + 100 <
            window.innerHeight + offset
        ) {
            benefits1.classList.add("animation1")
            benefits2.classList.add("animation1")
            benefits3.classList.add("animation1")
            benefits4.classList.add("animation1")
        }
    }
    return (
        <>
            <div className="HomePage">
                <ExportedImage
                    src={backgroundImage}
                    alt="Orginal, unoptimized image"
                    unoptimized={true}
                    objectPosition="center"
                    objectFit="cover"
                    className="imageBackground"
                />

                <div className="text">
                    <h1>Battle Of History</h1>
                    <p>
                        Rewrite history with every play: Experience the past in a whole new way
                        with our decentralized NFT game featuring game cards inspired by historic
                        wars.
                    </p>
                    <button
                        className="startNow"
                        onClick={() => {
                            props.setShowHome(false)
                            props.setShowPlay(true)
                        }}
                    >
                        Start Now
                    </button>
                </div>
                <div className="home__page2">
                    <div className="home__page2__box1">
                        <div className="home__page2__box1__col1">
                            <h1>
                                {/* <span className="nowrap"> */}Purchase Unique Historical NFTs
                                {/* </span> */}, <br />
                                {/* <span className="nowrap"> */} Own a Piece of History
                                {/* </span> */}
                            </h1>
                            <p>
                                Each box you buy contains a unique NFT that represents a
                                significant figure from history, giving you ownership of a
                                one-of-a-kind piece of history. Buy a box of our historical NFTs
                                today and start building your collection of valuable and unique
                                assets.
                            </p>
                        </div>
                        <div className="home__page2__box1__col2">
                            <ExportedImage
                                src={ceasarLegendary300}
                                alt="Orginal, unoptimized image"
                                unoptimized={true}
                                className="box1__ceasar"
                            />
                            <ExportedImage
                                src={mussuliniRare300}
                                alt="Orginal, unoptimized image"
                                unoptimized={true}
                                className="box1__mussulini"
                            />
                            <ExportedImage
                                src={bismarckLegendary300}
                                alt="Orginal, unoptimized image"
                                unoptimized={true}
                                className="box1__bismarck"
                            />
                        </div>
                    </div>
                    <div className="home__page2__box2">
                        <div className="home__page2__box2__col1">
                            <ExportedImage
                                src={normalBox}
                                alt="Orginal, unoptimized image"
                                unoptimized={true}
                                className="home__box__normal"
                            />
                            <h1 className="home__box__h1__normal">Normal Box</h1>
                            <p className="home__box__p__normal">
                                The Normal box contains NFTs that are still unique and valuable,
                                but not as rare or valuable as rare or legendary NFTs. These NFTs
                                still have their own unique attributes, making them valuable assets
                                in your collection.
                            </p>
                        </div>
                        <div className="home__page2__box2__col2">
                            <ExportedImage
                                src={rareBox}
                                alt="Orginal, unoptimized image"
                                unoptimized={true}
                                className="home__box__rare"
                            />
                            <h1 className="home__box__h1__rare">Rare Box</h1>
                            <p className="home__box__p__rare">
                                The Rare box contains only rare NFTs, which are also valuable and
                                unique but not as rare as legendary NFTs. These NFTs have their own
                                unique attributes and are highly sought after by collectors.
                            </p>
                        </div>
                        <div className="home__page2__box2__col3">
                            <ExportedImage
                                src={legendaryBox}
                                alt="Orginal, unoptimized image"
                                unoptimized={true}
                                className="home__box__legendary"
                            />
                            <h1 className="home__box__h1__legendary">Legendary Box</h1>
                            <p className="home__box__p__legendary">
                                The Legendary box contains legendary NFT cards, which are the
                                rarest and most valuable NFTs in our game. These NFTs have a higher
                                level of rarity and unique attributes that set them apart from
                                other NFTs.
                            </p>
                        </div>
                    </div>
                    <div className="home__page2__boxes__button">
                        <button
                            onClick={() => {
                                props.setShowHome(false)
                                props.setShowBoxes(true)
                            }}
                        >
                            Buy Now
                        </button>
                    </div>
                    <div className="home__page2__box3">
                        <div className="home__page2__box3__col1">
                            {" "}
                            <ExportedImage
                                src={colombusNormal}
                                alt="Orginal, unoptimized image"
                                unoptimized={true}
                                className="home__box3__1"
                            />
                            <ExportedImage
                                src={colombusRare}
                                alt="Orginal, unoptimized image"
                                unoptimized={true}
                                className="home__box3__2"
                            />
                            <ExportedImage
                                src={colombusLegendary}
                                alt="Orginal, unoptimized image"
                                unoptimized={true}
                                className="home__box3__3"
                            />
                        </div>
                        <div className="home__page2__box3__col2">
                            <h1>Normal, Rare, Legendary</h1>
                            <p>
                                Each historical figure NFT can be found in Rare, Legendary, or
                                Normal boxes, with the rarity affecting its value and uniqueness.
                                Additionally, each NFT character has its own unique set of stats,
                                such as attack power, defense power, and speed, making them more
                                valuable in certain situations. With such a variety of NFTs to
                                collect, you can build a diverse collection that reflects your
                                unique interests and play style.
                            </p>
                        </div>
                    </div>
                    <div className="home__page2__box4">
                        <div className="home__page2__box4__col1">
                            <h1>Play Our NFT Game</h1>
                            <p>
                                In our NFT game, select three historical NFTs to battle against
                                your opponent's NFTs. Each battle randomly selects a stat from your
                                NFT and a random NFT from your deck. Win the most battles to emerge
                                victorious and earn rewards. Join now to enter the exciting world
                                of NFT battles!
                            </p>
                            <div className="home__page2__playGameButton">
                                <button
                                    onClick={() => {
                                        props.setShowHome(false)
                                        props.setShowPlay(true)
                                    }}
                                >
                                    Join the Battle
                                </button>
                            </div>
                        </div>
                        <div className="home__page2__box4__col2">
                            <div className="home__page2__box4__col2__fight">
                                <div className="home__page2__box4__col2__nft home__game__1">
                                    <ExportedImage
                                        src={bismarckLegendary}
                                        alt="Orginal, unoptimized image"
                                        unoptimized={true}
                                    />
                                    <p>
                                        Type: <span className="bold">Legendary</span>
                                    </p>
                                    <p>
                                        Attack: <span className="bold">90</span>
                                    </p>
                                    <p>
                                        Defence:<span className="bold"> 85</span>
                                    </p>
                                    <p>
                                        Tactics:<span className="bold"> 89</span>
                                    </p>
                                </div>
                                <div className="swords">
                                    <ExportedImage
                                        src={swords}
                                        alt="Orginal, unoptimized image"
                                        unoptimized={true}
                                    />
                                </div>
                                <div className="home__page2__box4__col2__nft home__game__2">
                                    <ExportedImage
                                        src={mussuliniRare}
                                        alt="Orginal, unoptimized image"
                                        unoptimized={true}
                                    />
                                    <p>
                                        Type: <span className="bold">Rare</span>
                                    </p>
                                    <p>
                                        Attack:<span className="bold"> 80</span>
                                    </p>
                                    <p>
                                        Defence:<span className="bold"> 78</span>
                                    </p>
                                    <p>
                                        Tactics:<span className="bold"> 75</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="home__page2__box5">
                        <div className="home__page2__box5__col1">
                            <h1>Selling NFTs for Profit</h1>
                            <p>
                                Looking to turn your historical game NFTs into a profitable digital
                                asset? Our secure platform offers the perfect solution. With our
                                streamlined process, you can easily upload and list your NFTs for
                                sale to a global audience. And with our commitment to security, you
                                can rest assured that your transactions will be safe and secure.
                                Whether you're an avid gamer, collector, or investor, our platform
                                offers a profitable way to sell your historical game NFTs. And with
                                the rising popularity of NFTs, there has never been a better time
                                to turn your digital assets into profits. So why wait? Start
                                selling your historical game NFTs today on our secure platform and
                                take advantage of the booming NFT market.
                            </p>
                        </div>
                        <div className="home__page2__box5__col2">
                            <ExportedImage
                                src={ceasarLegendary}
                                alt="Orginal, unoptimized image"
                                unoptimized={true}
                                className="home__page2__box5__col2__ceasar"
                            />
                            <ExportedImage
                                src={transfer}
                                alt="Orginal, unoptimized image"
                                unoptimized={true}
                                className="home__page2__box5__col2__tranfer"
                            />
                            <ExportedImage
                                src={eth}
                                alt="Orginal, unoptimized image"
                                unoptimized={true}
                                className="home__page2__box5__col2__eth"
                            />
                        </div>
                        <button
                            className="home__page2__button__marketplace"
                            onClick={() => {
                                props.setShowHome(false)
                                props.setShowSell(true)
                            }}
                        >
                            Explore Marketplace
                        </button>
                    </div>
                    <div className="home__page2__box6">
                        <div className="home__page2__box6__col1">
                            <h1>Discover the Power of Our Game</h1>
                        </div>
                        <div className="home__page2__box6__col2">
                            <div className="benefits1">
                                <ExportedImage
                                    src={blockchain}
                                    alt="Orginal, unoptimized image"
                                    unoptimized={true}
                                />
                                <p>Decentralized</p>
                            </div>
                            <div className="benefits2">
                                <ExportedImage
                                    src={verified}
                                    alt="Orginal, unoptimized image"
                                    unoptimized={true}
                                />
                                <p>Secure</p>
                            </div>
                            <div className="benefits3">
                                <ExportedImage
                                    src={action}
                                    alt="Orginal, unoptimized image"
                                    unoptimized={true}
                                />
                                <p>Action</p>
                            </div>
                            <div className="benefits4">
                                <ExportedImage
                                    src={trade}
                                    alt="Orginal, unoptimized image"
                                    unoptimized={true}
                                />
                                <p>Trading</p>
                            </div>
                        </div>
                    </div>
                    <Footer />
                </div>
            </div>
        </>
    )
}

export default HomePage
