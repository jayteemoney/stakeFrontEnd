import { useState, useEffect } from "react";
import { ethers } from "ethers";

const ConnectWallet = ({ setProvider, setAccount }) => {
  const [connected, setConnected] = useState(false);

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const [account] = await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(provider);
        setAccount(account);
        setConnected(true);
      } catch (err) {
        console.error("Connection error:", err);
        alert("Failed to connect wallet");
      }
    } else {
      alert("MetaMask not detected. Please install MetaMask.");
    }
  };

  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window.ethereum !== "undefined") {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          const provider = new ethers.BrowserProvider(window.ethereum);
          setProvider(provider);
          setAccount(accounts[0]);
          setConnected(true);
        }
      }
    };

    checkConnection();
  }, []);

  return (
    <div className="flex justify-center mt-8">
      <button
        className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
        onClick={connectWallet}
      >
        {connected ? "Wallet Connected" : "Connect Wallet"}
      </button>
    </div>
  );
};

export default ConnectWallet;
