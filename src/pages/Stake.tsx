import React, { useContext, useEffect, useMemo, useState } from "react";
import { Address, useAccount, useContractRead, useContractWrite } from "wagmi";
import { CirclesWithBar } from "react-loader-spinner";

import { isMobile } from 'react-device-detect';
import {
  Select,
  Grid,
  GridItem,
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

import { getAddress } from "../utils.tsx";
import { ethers, JsonRpcProvider, parseEther } from "ethers";
const { formatEther } = ethers;

import IERC20Artifact from "../core/IERC20.json";
import StakingRewardsArtifact from "../core/StakingRewards.json";

import StakeControls from "../components/StakeControls.tsx";

import useStakingRewards from "../hooks/useStakingRewards.tsx";
const Stake: React.FC = () => {

    const { address, isConnected } = useAccount();
    const [tokenAddress, setTokenAddress] = useState<Address | null>(null);
    const [stakingContractAddress, setStakingContractAddress] = useState<Address | null>(null);
    const [selectedTime, setSelectedTime] = useState<string>("2592000");
    const [amountToStake, setAmountToStake] = useState(parseEther(`${0}`));
    const [isWaitingForApproval, setIsWaitingForApproval] = useState(false);
    const [selectedStake, setSelectedStake] = useState("0");
    const [stakesCount, setStakesCount] = useState(0);

    // const stakingData = useStakingRewards(address || "", chainIdToNetwork(1337) || "ganache");
    
    const { data: nomaBalance, refetch: refetchBalance } = 
    useContractRead({
      address: tokenAddress,
      abi: IERC20Artifact,
      functionName: "balanceOf",
      args: [address],
      watch: true
    });

    const { data: stakedBalance, refetch: refetchStakedBalance } = useContractRead({
      address: stakingContractAddress,
      abi: StakingRewardsArtifact.abi,
      functionName: "balanceOf",
      args: [address], 
      watch: true,  
    });

    const { data: earned, refetch: refetchEarned } = 
    useContractRead({
      address: stakingContractAddress,
      abi: StakingRewardsArtifact.abi,
      functionName: "earned",
      args: [address],
      watch: true
    });
    
    console.log(`Earned is ${earned} stakedBalance ${stakedBalance}`)

    const { data: stakes } = useContractRead({
      address: stakingContractAddress,
      abi: StakingRewardsArtifact.abi,
      functionName: "getAllStakes",
      args: [address],
    });
    
    console.log(stakes)

    const totalStaked = stakes?.reduce((acc, stake) => acc + stake.amount, 0n) || 0;

    console.log(`Total staked is ${totalStaked}`)

    useEffect(() => {
      const timer = setInterval(() => {
        refetchBalance();
        refetchEarned();
        refetchStakedBalance();
      }

      , 3000);
      return () => clearInterval(timer);
 
    }, [address]);
    
    const { isLoading: isLoadingApproval, write: approve } = 
    useContractWrite({
      address: tokenAddress,
      abi: IERC20Artifact,
      functionName: "approve",
      args: [stakingContractAddress, amountToStake],
      onSuccess: () => {
        setIsWaitingForApproval(true);
        setTimeout(() => {
          stake();
          setIsWaitingForApproval(false);
        }, 5000);
      },
      onError(data) {
        console.log(data)
        if (!isConnected) {
          // toast("Please connect your wallet first");
          // return;
        }
        // toast("Error, Approval unsuccessful.");
      },
    });

    console.log(`Selected time is ${selectedTime}`)
    
    const { isLoading: staking, write: stake } = 
    useContractWrite({
      address: stakingContractAddress,
      abi: StakingRewardsArtifact.abi,
      functionName: "stake",
      args: [amountToStake, selectedTime],
      onSuccess() {
        // toast(`Successfully staked your tokens !`);
 
  
        setTimeout(() => {
          window.location.reload();
        }, 5000);
      },
      onError(data) {
        console.log(data)
      }
    });

    useEffect(() => {
      const fetchTokenAddress = async () => {
        try {
          const tokenAddress = await getAddress("Noma", chainIdToNetwork(1337) || "ganache");
          const stakingContractAddress = await getAddress("StakingRewards", chainIdToNetwork(1337) || "ganache");

          setTokenAddress(tokenAddress);
          setStakingContractAddress(stakingContractAddress);
        } catch (error) {
          console.error(`Failed to connect : ${error}`);
        }
      }

      fetchTokenAddress();

    }
    , [address]);  // Added network to the dependency array

    const handleSelectTime = (value: string) => {
      setSelectedTime(value);
    }

    const handleStakeMax = () => {
      console.log(`Setting amountToStake to ${formatEther(nomaBalance)}`)
      setAmountToStake(
        nomaBalance
      );
    };

  return (
    <> 
      <Box as="section">
      <Box ml={"20%"}>
        <Heading as="h2" size="xl" mb={5}>
          Stake
        </Heading>
        {isConnected ? 
                <SimpleGrid columns={isMobile ? 1 : 2} spacing={10} mt={10} mr={isMobile ? 25 : 0} maxWidth={"75vh"}>
                <Box border="1px solid" w={"auto"}>
                 <Heading as="h5" size="xl" mb={5}>
                  Your wallet
                </Heading>
                <Input 
                  mt={4} 
                  value={commify(formatEther(nomaBalance?.toString() || 0))}
                  height={35} 
                  placeHolder="0.0000" 
                  style={{ border:"1px solid white", borderRadius:"10px", backgroundColor:"gray"}} 
                  width={180}
                  mb={10} 
                />
                <Heading as="h5" size="xl" mb={5}>
                  Staked balance
                </Heading>
                <Input 
                  mt={4} 
                  value={commify(formatEther(stakedBalance?.toString() || 0))}
                  height={35} 
                  placeHolder="0.0000" 
                  style={{ border:"1px solid white", borderRadius:"10px", backgroundColor:"gray"}} 
                  width={180}
                  mb={10} 
                />
                <Heading as="h5" size="xl" mb={5}>
                  Choose time
                </Heading>
                  <Select
                    placeholder='' 
                    defaultValue={0}
                    width={"140px"} 
                    height={40}
                    fontSize={13}
                    style={{border:"1px solid white", borderRadius:"10px", backgroundColor:"gray"}}
                    onChange={(ev) => handleSelectTime(ev.target.value)} 
                    mt={4} 
                  >
                    <option value={2592000}>30  days</option>
                    <option value={2592000 * 3}>90  days</option>
                    <option value={2592000 * 6}>180 days</option>
                    <option value={2592000 * 12}>365 days</option>
                  </Select>
                  <Heading as="h5" size="xl" mb={5}>
                    Choose amount
                  </Heading>
                  <Input 
                    type="text"
                    mt={isMobile ? -60 : 4} 
                    height={35}
                    placeholder={"type here..."} // Display the formatted value
                    value={commify(formatEther(amountToStake))}
                    style={{ border: "1px solid white", borderRadius: "10px", backgroundColor: "gray" }} 
                    width={180} 
                    onChange={(ev) => handleAmountToStake(ev.target.value)}
                  />
                  {isMobile ? 
                  <StakeControls
                    mr={150}
                    amountToStake={0}
                    walletBalance={nomaBalance}
                    // sideButtonsGroupSize={sideButtonsGroupSize}
                    approve={approve}
                    handleStakeMax={handleStakeMax}
                    /> : <></>}
      
                  <Box >
                    <HStack>
                    {!isMobile ? 
                    <Button 
                      mt={nomaBalance > 0 ? 0 : 20}
                      isDisabled={nomaBalance == 0}
                      width={"180px"} 
                      height={30}
                      style={{ border:"1px solid white", borderRadius:"10px"}}
                      onClick={() => approve()}
                    > 
                    &nbsp;Stake 
                    </Button> : <></>}
                    {isMobile || nomaBalance == 0 ? <></> : 
                    <Box ml={20}>
                      <StakeControls 
                        amountToStake={0}
                        walletBalance={nomaBalance}
                        approve={approve}
                        handleStakeMax={handleStakeMax}                         
                      />  
                      </Box>}
      
                    
                    </HStack>
                  </Box>              
                </Box>
                <Box  border="1px solid">
                <Heading as="h5" size="xl" mb={5}>
                   Your stakes
                  </Heading>
                  {stakes?.length > 0 ? 
                  <>
                  <Select
                    width={280} 
                    border="1px solid" 
                    borderRadius={"10px"} 
                    // onChange={(event) => handleSetSelectedStake(event.target.value)} 
                  >
                    {stakes?.map((stake, index) => {

                      return (
                        <>
                          <option key={index} value={index}>
                            #{index+1} - Unlock on : {new Date(Number(stake.lockEnd) * 1000).toLocaleString("en-US", {
                              year: 'numeric', // Use 'numeric' or '2-digit'
                              month: 'long',   // Use 'numeric', '2-digit', 'narrow', 'short', or 'long'
                              day: 'numeric'   // Use 'numeric' or '2-digit'
                            })}
                          </option>
                          <br />
                          {index == 0 ? <Heading as="h4" size="md">Details</Heading> : <>test</> }                
                        </>
                    )})}
                    </Select> 
                  </>
                    : <>No data</>} 
                </Box>
      
              </SimpleGrid> : <>Connect Wallet</>}

      </Box>
      </Box>
      {(isLoadingApproval || isWaitingForApproval) && (
        <Box className="loader">
          <CirclesWithBar
            height="100"
            width="100"
            color="#fff"
            outerCircleColor="#fff"
            innerCircleColor="#fff"
            barColor="#fff"
            wrapperStyle={{}}
            wrapperClass=""
            visible={
              isLoadingApproval ||
              isWaitingForApproval
            }
          />
        </Box>
      )}
    </>
  );
};

export default Stake;
