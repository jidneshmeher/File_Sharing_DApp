import { createContext, useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import Upload from "../../../contract/artifacts/contracts/Upload.sol/Upload.json";

export const ContractContext = createContext();

export function ContractContextProvider({ children }) {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const connectWallet = async () => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      try {
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);

        const contractInstance = new ethers.Contract(
          contractAddress,
          Upload.abi,
          signer
        );

        setContract(contractInstance);
        console.log("Wallet connected:", address);
        localStorage.setItem("isWalletConnected", "true"); // Save connection status
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      console.error("Metamask is not installed");
    }
  };

  // Auto-connect if previously connected
  useEffect(() => {
    const wasConnected = localStorage.getItem("isWalletConnected");
    if (wasConnected === "true") {
      connectWallet();
    }
  }, []);

  // 👇 Reload page on account change
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", () => {
        console.log("Account changed, reloading...");
        localStorage.removeItem("isWalletConnected");
        window.location.reload(); // Full page reload
      });
    }
  }, []);



  return (
    <ContractContext.Provider value={{ account, contract, connectWallet }}>
      {children}
    </ContractContext.Provider>
  );
}

export const useContract = () => useContext(ContractContext);
