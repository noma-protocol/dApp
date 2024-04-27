import React, { useContext } from "react";
import { LanguageContext, LanguageContextType } from "../core/LanguageProvider";
import { Link } from "react-router-dom";
import {
  SimpleGrid,
  Container,
  Center,
  Square,
  Heading, 
  Box,
  Stack, 
  Image,
  Text,
  Input,
  Button,
  Flex,
  HStack,     
  VStack
} from '@chakra-ui/react';
const Footer: React.FC = () => {

  const ButtonMailto = ({ mailto, label }) => {
    return (
        <Link className="fa fa-envelope" 
            style={{ transform: "translateY(0)", display:"grid", gridTemplateColumns: "repeat(1, 100%)", placeItems:"center"}} 
            to='#'
            onClick={(e) => {
                window.location.href = mailto;
                e.preventDefault();
            }}
        >
        </Link>
    );
};
  const ctx = useContext<LanguageContextType>(LanguageContext);
  return (
    <footer className="footer-area">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 text-center">
            <div className="footer-items">
              <center>
                <p className="perelogo">Noma Protocol 2024</p>
              </center>

              <div className="social-icons d-flex justify-content-center my-4">

                  <Box  w="55vh" h="2vh">
                    <center>
                      <SimpleGrid columns={3} spacing={4}>
                        <Box >
                        <HStack maxWidth={"fit-content"}>
                        <i className="fa-brands fa-discord"></i>
                            <Link 
                              className="discord"
                              to="https://discord.gg/FW9XRhZE"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Discord
                            </Link>
                        </HStack>
                        </Box>
                        <Box>
                        <HStack  maxWidth={"fit-content"}>
                          <i className="fa-brands fa-github"></i>
                          <Link 
                          className="github"
                          to="https://github.com/noma-protocol"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Github
                        </Link>
                        </HStack>
                        </Box>
                        <Box>
                          <HStack  maxWidth={"fit-content"}>
                            <i className="fa-brands fa-twitter"></i>
                            <Link 
                              className="twitter"
                              to="https://twitter.com/nomaprotocol"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                            X/Twitter
                          </Link>
                          </HStack>
                        </Box>
                      </SimpleGrid>
                    </center>
                  </Box>
              </div> 
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
