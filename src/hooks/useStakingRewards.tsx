import { useEffect, useState, useMemo } from 'react';
import { getAddress } from "../utils.tsx";
import { ethers, JsonRpcProvider } from "ethers";

const {formatEther} = ethers;

const ERC20Abi = [
    "function totalSupply() view returns (uint)", 
    "function balanceOf(address) view returns (uint)",
]

const useStakingRewards = (address, network) => {

    const [earned, setEarned] = useState(0); 

     // Setup Provider
    const provider = useMemo(() => new JsonRpcProvider(
     network == "ganache" ? "http://localhost:8545" : process.env.REACT_APP_PROVIDER_URL 
    ), 
      [process.env.REACT_APP_PROVIDER_URL]
    ); 
    
     useEffect(() => {

        const fetchStakingInfo = async () => {
            try {
                
                // Dynamically import the required JSONs based on the network
                const StakingRewardsArtifact = await import(`../core/StakingRewards.json`);
                const StakingRewardsAbi = StakingRewardsArtifact.abi;
                
                const stakingRewardsAddress = await getAddress("StakingRewards", network);

                const StakingRewardsContract = new ethers
                .Contract(
                    stakingRewardsAddress,
                    StakingRewardsAbi, 
                    provider
                );
                                            
                const earned =  await StakingRewardsContract.earned(address);
                console.log(`Earned ${earned}`)

                setEarned(formatEther(earned));

            } catch (error) {
                console.error(`Failed to connect : ${error}`);
            }
        }

        fetchStakingInfo();

        // Refresh data every 5 seconds
        const intervalId = setInterval(fetchStakingInfo, 1000);

        // Clear the interval when the component unmounts
        return () => clearInterval(intervalId)

    }, [address, provider, network]);  // Added network to the dependency array


    return { stakingData: earned };
}

export default useStakingRewards;
