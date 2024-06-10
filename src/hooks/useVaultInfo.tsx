import { useEffect, useState, useMemo } from 'react';
import { getAddress } from "../utils.tsx";
import { ethers, JsonRpcProvider } from "ethers";

const {formatEther} = ethers;

const ERC20Abi = [
    "function totalSupply() view returns (uint)", 
    "function balanceOf(address) view returns (uint)",
]

const useVaultInfo = (deployerAddress, network) => {

    const [vaultData, setVaultData] = useState({});
    const [liquidityRatio, setLiquidityRatio] = useState(0);
    const [underlyingBalances, setUnderlyingBalances] = useState({});
    const [circulatingSupply, setCirculatingSupply] = useState(0);
    const [spotPrice, setSpotPrice] = useState(0);
    const [capacity, setCapacity] = useState({});
    const [feesToken0, setFeesToken0] = useState(0);
    const [feesToken1, setFeesToken1] = useState(0);

     // Setup Provider
    const provider = useMemo(() => new JsonRpcProvider(
     network == "ganache" ? "http://localhost:8545" : process.env.REACT_APP_PROVIDER_URL 
    ), 
      [process.env.REACT_APP_PROVIDER_URL]
    ); 
    
     useEffect(() => {

        const fetchVaultInfo = async () => {
            try {
                
                // Dynamically import the required JSONs based on the network
                const Vault = await import(`../deployments/Vault.sol/Vault.json`);
                const VaultAbi = Vault.abi;
                
                const vaultAddress = await getAddress("Vault", network);

                const VaultContract = new ethers.Contract(
                    vaultAddress,
                    VaultAbi, 
                    provider
                );
                                            
                let data = {};
                
                const [
                    liquidityRatio, 
                    circulatingSupply, 
                    spotPrice, 
                    anchorCapacity, 
                    floorCapacity,
                    token0Address, 
                    token1Address,
                    newFloorPrice                    
                ] = 
                await VaultContract.getVaultInfo();
                
                setCirculatingSupply(circulatingSupply);
                setSpotPrice(spotPrice);
                
                // console.log(`Spot price is ${spotPrice}`)
                setCapacity({
                    anchor: anchorCapacity,
                    floor: floorCapacity
                });

                const token0Contract = new ethers.Contract(
                    token0Address,
                    ERC20Abi, 
                    provider
                );

                const token1Contract = new ethers.Contract(
                    token1Address,
                    ERC20Abi, 
                    provider
                );

                const token0BalanceVault = await token0Contract.balanceOf(vaultAddress);
                const token1BalanceVault = await token1Contract.balanceOf(vaultAddress);
                
                setUnderlyingBalances({
                    token0: token0BalanceVault,
                    token1: token1BalanceVault
                });

                const [lowerTickFloor, upperTickFloor, amount0Floor, amount1Floor] = 
                await VaultContract.getUnderlyingBalances(0);
                
                // console.log(lowerTickFloor, upperTickFloor, formatEther(amount0Floor), formatEther(amount1Floor));

                const [lowerTickAnchor, upperTickAnchor, amount0Anchor, amount1Anchor] = 
                await VaultContract.getUnderlyingBalances(1);

                // console.log(lowerTickAnchor, upperTickAnchor, formatEther(amount0Anchor), formatEther(amount1Anchor));

                data["Floor"] = {
                    lowerTick: lowerTickFloor,
                    upperTick: upperTickFloor,
                    amount0: amount0Floor,
                    amount1: amount1Floor
                }
 
                data["Anchor"] = {
                    lowerTick: lowerTickAnchor,
                    upperTick: upperTickAnchor,
                    amount0: amount0Anchor,
                    amount1: amount1Anchor
                }
                
                const [lowerTickDiscovery, upperTickDiscovery, amount0Discovery, amount1Discovery] = 
                await VaultContract.getUnderlyingBalances(2);

                // console.log(lowerTickDiscovery, upperTickDiscovery, formatEther(amount0Discovery), formatEther(amount1Discovery));
                
                data["Discovery"] = {
                    lowerTick: lowerTickDiscovery,
                    upperTick: upperTickDiscovery,
                    amount0: amount0Discovery,
                    amount1: amount1Discovery
                }
                
                setVaultData(data);
                setLiquidityRatio(liquidityRatio);

                const [feesToken0, feesToken1] = await VaultContract.getAccumulatedFees();
                console.log(feesToken0, feesToken1)
                
                setFeesToken0(feesToken0);
                setFeesToken1(feesToken1);

                    
            } catch (error) {
                console.error(`Failed to fetch pools: ${error}`);
            }
        }

        fetchVaultInfo();

        // Refresh data every 5 seconds
        const intervalId = setInterval(fetchVaultInfo, 5000);

        // Clear the interval when the component unmounts
        return () => clearInterval(intervalId)

    }, [deployerAddress, provider, network]);  // Added network to the dependency array

    const accumulatedFees = [feesToken0, feesToken1];

    return { data: vaultData, liquidityRatio, underlyingBalances, circulatingSupply, spotPrice, capacity, accumulatedFees};
}

export default useVaultInfo;
