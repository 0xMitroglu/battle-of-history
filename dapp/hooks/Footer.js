import React from "react"
import { faCode, faUserTie } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import ExportedImage from "next-image-export-optimizer"
import logo from "../public/image/title.png"
const Footer = (props) => {
  return (
    <>
      <hr></hr>
      <div className="footer">
        <div className="footer__col-left">
          <div className="footer__col-left__text">
            <h4>Features</h4>
            <p style={{ cursor: "pointer" }}>Marketplace</p>
            <p style={{ cursor: "pointer" }}>NFT Game</p>
          </div>
          <div className="footer__col-left__text">
            <h4>Our Team</h4>
            <p>
              <FontAwesomeIcon icon={faCode} className="fa" /> 0xMitroglu
            </p>
            <p>
              <FontAwesomeIcon icon={faUserTie} className="fa" /> 0xMitroglu
            </p>
          </div>
          <div className="footer__col-left__text">
            <h4>Support</h4>
            <p style={{ cursor: "pointer" }}>FAQ</p>
            <p style={{ cursor: "pointer" }}>Contact Us</p>
          </div>
        </div>

        <div className="footer__col-right">
          <div className="footer__col-right__image">
            <ExportedImage src={logo} unoptimized={true} />
          </div>
          <div className="footer__col-right__text">
            <p>support@battle-history.com</p>
            <p>&copy; {"2023"} Battle Of History</p>
          </div>
        </div>
      </div>
    </>
  )
}
export default Footer
