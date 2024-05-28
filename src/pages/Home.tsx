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

const HomePage: React.FC = () => {
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

  return (
    <>
      {
        typeof data["Floor"] != "undefined" &&
        typeof data["Anchor"] != "undefined" ?
  
      <Box as="section" className="main-section">
        <Heading size="large" style={{color:"ivory"}} ml={isMobile ? "3vh" : "250px"} mb={30}>Liquidity</Heading>
        <center>
          <Chart positions={data} />
          {!isMobile ? 
          <Table style={{marginTop:"50px"}}  variant="simple" maxWidth={"80vh"} >
            <Thead>
              <Tr>
                <Th ></Th>
                <Th isNumeric>Floor</Th>
                <Th isNumeric>Anchor</Th>
                <Th isNumeric>Discovery</Th>
                <Th isNumeric>Unused</Th>
                <Th isNumeric>Total</Th>
              </Tr>
            </Thead>
            <Tbody style={{color:"ivory"}}> 
              <Tr>
                <Td>Reserves (WETH)</Td>
                <Td isNumeric>{commify(formatEther(data["Floor"]?.amount1))}</Td>
                <Td isNumeric>{commify(formatEther(data["Anchor"]?.amount1))}</Td>
                <Td isNumeric>{commify(formatEther(data["Discovery"]?.amount1))}</Td>
                <Td >{commify(formatEther(underlyingBalances.token1))}</Td>
                <Td isNumeric>{commify(formatEther(data["Floor"]?.amount1 + (data["Anchor"]?.amount1 + (data["Discovery"]?.amount1) + (underlyingBalances?.token1))))}</Td>
              </Tr>
              <Tr>
                <Td>Reserves (NOMA)</Td>
                
                <Td isNumeric>{commify(formatEther(data["Floor"]?.amount0))}</Td>
                <Td isNumeric>{commify(formatEther(data["Anchor"]?.amount0))}</Td>
                <Td isNumeric>{commify(formatEther(data["Discovery"]?.amount0))}</Td>
                <Td >{commify(formatEther(underlyingBalances?.token0))}</Td>
                <Td isNumeric>{commify(formatEther((data["Floor"]?.amount0) + (data["Anchor"]?.amount0) + (data["Discovery"]?.amount0) + (underlyingBalances?.token0)))}</Td>
              </Tr>
              <Tr>
                <Td>Capacity (NOMA)</Td>
                <Td isNumeric>{commify(formatEther(capacity?.floor))}</Td>
                <Td isNumeric>{commify(formatEther(capacity?.anchor))}</Td>
                <Td isNumeric>{"n/a"}</Td>
                <Td >{"n/a"}</Td>
                <Td isNumeric>{"n/a"}</Td>
              </Tr>          
              <Tr>
                <Td>Tick Lower</Td>
                <Td isNumeric>{commify(tickToPrice(data["Floor"]?.lowerTick)[0])}<Text color="gray" fontSize="13px">({Number(data["Floor"]?.lowerTick)})</Text></Td>
                <Td isNumeric>{commify(tickToPrice(data["Anchor"]?.lowerTick))}<Text color="gray" fontSize="13px">({Number(data["Anchor"]?.lowerTick)})</Text></Td>
                <Td isNumeric>{commify(tickToPrice(data["Discovery"]?.lowerTick))}<Text color="gray" fontSize="13px">({Number(data["Discovery"]?.lowerTick)})</Text></Td>
                <Td ></Td>
              </Tr>
              <Tr>
                <Td>Tick Upper</Td>
                <Td isNumeric>{commify(tickToPrice(data["Floor"]?.upperTick))}<Text color="gray" fontSize="13px">({Number(data["Floor"]?.upperTick)})</Text></Td>
                <Td isNumeric>{commify(tickToPrice(data["Anchor"]?.upperTick))}<Text color="gray" fontSize="13px">({Number(data["Anchor"]?.upperTick)})</Text></Td>
                <Td isNumeric>{commify(tickToPrice(data["Discovery"]?.upperTick))}<Text color="gray" fontSize="13px">({Number(data["Discovery"]?.upperTick)})</Text></Td>
                <Td ></Td>
              </Tr>          
            </Tbody>
          </Table> :
          <>Responsive table</>}
        </center>
      </Box> : <></>
      }
    </>
  );
};

export default HomePage;
