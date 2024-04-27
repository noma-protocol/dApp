import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { LanguageContext, LanguageContextType } from "../core/LanguageProvider";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount } from "wagmi";
import Logo from "../assets/images/noma_logo_transparent.png";
import { isMobile } from 'react-device-detect';
import { 
  Heading, 
  Box,
  Stack, 
  Image,
  // Link,
  Text,
  Input,
  Button,
  Flex,
  HStack,     
  VStack
} from '@chakra-ui/react';
import { useNetwork } from 'wagmi'

const Header: React.FC = () => {
  const ctx = useContext<LanguageContextType>(LanguageContext);
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork()

  return (
    <header id="header">
      <nav className="navbar navbar-expand navbar-fixed-top" >
      <div className="container header">
        <Image
          src={Logo}
          alt="Noma Protocol"
          style={{ width: "50px", height: "50px" }}
        />

        {/* Remove the ml-auto class from here if it exists */}
        <div></div> 
        
        {/* Remove mx-auto class and add justify-content-start to align items to the left */}
        <ul className="navbar-nav items justify-content-start " >
          <li className="nav-item">
            <Link className="nav-link" to="/">
              {!ctx.isSpanishCountry ? "What's this?" : "Que es esto?"}
            </Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link" to="/">
              {!ctx.isSpanishCountry ? "Docs" : "Docs"}
            </Link>
          </li>        

          <li className="nav-item">
            <Link className="nav-link" to="/">
              {!ctx.isSpanishCountry ? "Go to dApp" : "Abre la dApp"}
            </Link>
          </li>                         
        </ul>

          <ul className="navbar-nav action">
            <li className="nav-item ml-2">
              <a
                className="btn ml-lg-auto btn-bordered-green"
                onClick={() => open()}
              >
                <p style={{color:"#54ff36"}}>
                {/* <i className="fa-solid fa-wallet mr-md-2 green-bg"></i> */}
                {isConnected
                  ? `${address?.slice(0, 6)}...${address?.slice(-6)}`
                  : !ctx.isSpanishCountry
                  ? "Wallet Connect"
                  : "Conectar billetera"}
                </p>
              </a>
            </li>
          </ul>
          <ul className="navbar-nav toggle">
            <li className="nav-item">
              <a
                className="nav-link"
                data-bs-toggle="modal"
                data-bs-target="#menu"
              >
                <i className="fa-solid fa-bars m-0"></i>
              </a>
            </li>
          </ul>


        </div>
      </nav>
      <div id="menu" className="modal fade p-0">
        <div className="modal-dialog dialog-animated">
          <div className="modal-content h-100">
            <div
              className="modal-header"
              data-bs-dismiss="modal"
              style={{ color: "#fff" }}
            >
              Menu <i className="far fa-times-circle icon-close"></i>
            </div>
            <div className="menu modal-body">
              <div className="row w-100">
                <div className="items p-0 col-12 text-center">
                  <ul className="navbar-nav items mx-auto">
                    <li
                      className="nav-item"
                      data-bs-dismiss="modal"
                      style={{ fontSize: "20px" }}
                    >
                      <Link className="nav-link" to="/">
                        {!ctx.isSpanishCountry ? "What's this?" : "Que es esto?"}
                      </Link>
                    </li>
                    <li
                      className="nav-item"
                      data-bs-dismiss="modal"
                      style={{ fontSize: "20px", marginTop:"20px"}}
                    >
                      <a
                        className="btn ml-lg-auto btn-bordered-white"
                        onClick={() => open}
                      >
                        <i className="fa-solid fa-wallet mr-md-2" ></i>
                        {isConnected
                          ? `${address?.slice(0, 6)}...${address?.slice(-6)}`
                          : !ctx.isSpanishCountry
                          ? "Wallet Connect"
                          : "Conectar billetera"}
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
