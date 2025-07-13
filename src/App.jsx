import { useState, useEffect } from "react";
import ConnectWallet from "./components/ConnectWallet";
import Dashboard from "./components/Dashboard";
import StakingActions from "./components/StakingAction";
import { UseContract } from "./hooks/UseContract";

function App() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState("");
  const [stakingContract, setStakingContract] = useState(null);
  const [w3bTokenContract, setW3bTokenContract] = useState(null);
  const [error, setError] = useState("");
  const [refreshCount, setRefreshCount] = useState(0);

  const refreshDashboard = () => {
    setRefreshCount((prev) => prev + 1);
  };

  useEffect(() => {
    if (provider) {
      const initContracts = async () => {
        try {
          const { stakingContract, w3bTokenContract } = await UseContract(provider);
          setStakingContract(stakingContract);
          setW3bTokenContract(w3bTokenContract);
          setError("");
        } catch (err) {
          console.error("Failed to initialize contracts:", err);
          setError("Failed to initialize contracts: " + err.message);
        }
      };
      initContracts();
    }
  }, [provider]);

  return (
    <div className="min-h-screen bg-[#0a192f] flex items-center justify-center px-4 py-8 text-white">
      <div className="w-full max-w-2xl bg-[#112240] shadow-2xl rounded-2xl p-6 md:p-10 space-y-8 transition-all duration-300 ease-in-out">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-100">
          ETH Staking DApp
        </h1>

        {!account ? (
          <ConnectWallet setProvider={setProvider} setAccount={setAccount} />
        ) : (
          <>
            {stakingContract && w3bTokenContract ? (
              <>
                <Dashboard
                  provider={provider}
                  account={account}
                  stakingContract={stakingContract}
                  w3bTokenContract={w3bTokenContract}
                  refresh={refreshCount}
                />
                <StakingActions
                  stakingContract={stakingContract}
                  onActionComplete={refreshDashboard}
                />
              </>
            ) : (
              <p className="text-center text-gray-400">Loading contracts...</p>
            )}
            {error && <p className="text-red-500 text-center">{error}</p>}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
