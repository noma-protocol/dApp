import { Outlet } from "react-router-dom";
// import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { LanguageProvider } from "./core/LanguageProvider";

import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";
import { useMemo, useState } from "react";
import { WagmiConfig } from "wagmi";
import { bsc, arbitrum, localhost } from "viem/chains";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { switchNetwork, watchNetwork } from "wagmi/actions";
import { chainIdToNetwork } from "./utils.tsx";
import { ethers, JsonRpcProvider } from "ethers";

function App() {
  const [chainId, setChainId] = useState(null)

  // Setup Provider
  const localProvider = useMemo(() => new JsonRpcProvider(
     process.env.REACT_APP_PROVIDER_URL || "http://localhost:8545"
  ), 
    [chainIdToNetwork(chainId)]
  ); 
 
  const projectId = "1607c5f300e1191999e3033443961435";

  const metadata = {
    name: "Noma Protocol",
    description: "Decentralized Money",
    url: "https://web3modal.com",
    icons: ["https://avatars.githubusercontent.com/u/37784886"],
  };

  const chains = [bsc, arbitrum, localhost];
  const wagmiConfig = defaultWagmiConfig({
    chains,
    projectId,
    metadata,
  });

  createWeb3Modal({ wagmiConfig, projectId, chains });

  watchNetwork(async (network) => {
    // if (network.chain?.name != "bsc") {
    //   await switchNetwork({
    //     chainId: 56,
    //   });
    // }
    // if (network.chain?.name == "arbitrum") {
    //   await switchNetwork({
    //     chainId: 42161,
    //   });
    // }
    if (network.chain?.name == "arbitrum") {
      await switchNetwork({
        chainId: 1337,
      });
    }    
    console.log(`Network is ${network.chain?.name}`)
  });

  return (
    <WagmiConfig config={wagmiConfig}>
      <LanguageProvider>
        <Header chainId={chainId}/>
        <Outlet />
        <Footer />
        <ToastContainer theme="dark" />
      </LanguageProvider>
    </WagmiConfig>
  );
}

export default App;
