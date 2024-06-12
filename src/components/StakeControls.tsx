import {
    Box,
    VStack,
    HStack,
    Button,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
} from '@chakra-ui/react';
import { isMobile } from "react-device-detect";

function StakeControls({amountToStake, walletBalance, sideButtonsGroupSize, approve, handleStakeMax}) {
  return (
    <Box>
      <VStack>
        <Box mt={10} ml={isMobile? -160 : 0}>
        <HStack>
          <Button isDisabled={walletBalance == 0} size={sideButtonsGroupSize} borderRadius={10} mt={5} onClick={() => handleStakeMax("25")}>25%</Button>&nbsp;
          <Button isDisabled={walletBalance == 0} size={sideButtonsGroupSize} borderRadius={10} mt={5} onClick={() => handleStakeMax("50")}>50%</Button>&nbsp;
          </HStack>
        <HStack>
        <Button isDisabled={walletBalance == 0} size={sideButtonsGroupSize} borderRadius={10} mt={5} onClick={() => handleStakeMax("75")}>75%</Button>&nbsp;
        <Button isDisabled={walletBalance == 0} size={sideButtonsGroupSize} borderRadius={10} mt={5} onClick={() => handleStakeMax("100")}>MAX</Button>&nbsp;
        </HStack>      
        </Box>

        {isMobile && walletBalance > 0 ? 
          <Button
            ml={isMobile? -160 : 0} 
            isDisabled={walletBalance == 0}
            width={"120px"} 
            style={{ border:"1px solid white", borderRadius:"10px"}}
            onClick={() => approve()}
        > 
        &nbsp;Stake 
        </Button> : <></>}
      </VStack>
    </Box>
  )
}

export default StakeControls;

