import React, { useContext } from "react";
import { Address, useAccount, useContractRead, } from "wagmi";
import TOKENABI from "../core/TokenABI.json";
import { parseEther, formatEther } from "ethers";

import { Link } from "react-router-dom";
import StackedCards from "../components/StackedCards.tsx";
import { LanguageContext, LanguageContextType } from "../core/LanguageProvider";
import { isMobile } from 'react-device-detect';
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
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@chakra-ui/react';
import { chainIdToNetwork, commify, tickToPrice} from "../utils.tsx";

import Chart from '../components/Chart'; // The path to your chart component

import useVaultInfo from '../hooks/useVaultInfo';
import {RemoveScrollBar} from 'react-remove-scroll-bar';
import SlideControls  from "../components/SlideControls.tsx";

import { Theme, SwapWidget } from '@uniswap/widgets'
const Swap: React.FC = () => {

  const ctx = useContext<LanguageContextType>(LanguageContext);

  const { 
    data, 
    liquidityRatio, 
    underlyingBalances, 
    circulatingSupply,
    spotPrice,
    capacity
  } = useVaultInfo(
    process.env.REACT_APP_DEPLOYER_ADDRESS, 
    chainIdToNetwork(4216) || "arbitrum"
  );

  const { address, isConnected } = useAccount();
  const theme: Theme = {
    borderRadius: 0,
    fontFamily: '"Helvetica"',
  }

// You can also pass a token list as JSON, as long as it matches the schema
const MY_TOKEN_LIST = [
    {
        "chainId": 42161,
        "address": "0xa4907fdc7d04af3475722f622c6f002a4ca48f24",
        "name": "Test Noma",
        "symbol": "tAMPHR",
        "decimals": 18,
        "logoURI": "https://assets.coingecko.com/coins/images/26718/standard/Twitter_icon.png?1696525788",
        "extensions": {
          "bridgeInfo": {
          }
        }
    },
    {
        "chainId": 42161,
        "address": "0xdA07fdA01Fd20c2aaC600067dD87539944926547",
        "name": "Mock wETH",
        "symbol": "mWETH",
        "decimals": 18,
        "logoURI": "https://assets.coingecko.com/coins/images/26718/standard/Twitter_icon.png?1696525788",
        "extensions": {
          "bridgeInfo": {
          }
        }
    },    
]  
  return (
    <> 
    <br /><br /><br /><br /><br /><br /><br /><br />
        <Box ml={"25%"}>
            <SwapWidget theme={theme} tokenList={MY_TOKEN_LIST}/>
        </Box>
    </>
  );
};

export default Swap;
