import React, { useContext } from "react";
import { Address, useAccount, useContractRead, } from "wagmi";
import TOKENABI from "../core/TokenABI.json";
import { parseEther, formatEther } from "ethers";

import { Link } from "react-router-dom";
import { LanguageContext, LanguageContextType } from "../core/LanguageProvider";
import { isMobile } from 'react-device-detect';
import {
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
import { commify } from "../utils";

const StackedCards: React.FC = () => {
  const ctx = useContext<LanguageContextType>(LanguageContext);

  function Feature({ title, desc, ...rest }) {
    return (
      <Box p={5} shadow='md' borderWidth='1px' {...rest}>
        <Heading fontSize='xl'>{title}</Heading>
        <Text mt={4}>{desc}</Text>
      </Box>
    )
  }

  return (
    <Stack 
      direction={{ base: 'column', md: 'row' }} 
      spacing={5} 
      align="right"
      justify="space-around" 
      width="auto"
    >
      <Feature
        title={ctx.isSpanishCountry ? 'Guardar Dinero' : 'Save Money'}
        desc={ctx.isSpanishCountry ? 'Te mereces cosas buenas. Con un impresionante 10-15% de interés anual, haz crecer tus ahorros en tus propios términos con nuestro proceso completamente automatizado' : 'You deserve good things. With a whooping 10-15% interest rate per annum, grow your savings on your own terms with our completely automated process'}
      />
    </Stack>
  )
}

export default StackedCards;
