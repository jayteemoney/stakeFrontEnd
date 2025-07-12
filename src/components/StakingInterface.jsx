import React, { useEffect, useState } from "react";
import {
  stakeETH,
  claimRewards,
  unstakeETH,
  getStakeInfo,
  getProvider,
} from "../services/stakingService";
import { ethers } from "ethers";

const StakingInterface = () => {
  const [account, setAccount] = useState("");
  const [stake, setStake] = useState(null);
  const [status, setStatus] = useState("");
  const [readyToClaim, setReadyToClaim] = useState(false);

  const REWARD_TIME = 15; // seconds

  const connectWallet = async () => {
    try {
      const provider = await getProvider();
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setAccount(address);
    } catch (error) {
      console.error(error.message);
    }
  };

  const loadStakeInfo = async () => {
    if (!account) return;
    const info = await getStakeInfo(account);
    setStake(info);
    const now = Math.floor(Date.now() / 1000);
    if (info.timestamp && now >= info.timestamp + REWARD_TIME) {
      setReadyToClaim(true);
    } else {
      setReadyToClaim(false);
    }
  };

  const handleStake = async () => {
    setStatus("Staking...");
    await stakeETH();
    setStatus("Stake successful!");
    await loadStakeInfo();
  };

  const handleClaim = async () => {
    setStatus("Claiming rewards...");
    await claimRewards();
    setStatus("Rewards claimed!");
    await loadStakeInfo();
  };

  const handleUnstake = async () => {
    setStatus("Unstaking...");
    await unstakeETH();
    setStatus("Unstaked successfully!");
    await loadStakeInfo();
  };

  useEffect(() => {
    connectWallet();
  }, []);

  useEffect(() => {
    if (account) loadStakeInfo();
  }, [account]);

  return (
    <div className="p-8 max-w-md mx-auto bg-white shadow-md rounded-xl mt-10">
      <h1 className="text-2xl font-bold mb-4 text-center">Staking DApp</h1>
      <p className="text-sm mb-2 text-center">Connected: {account || "Not connected"}</p>

      {stake && stake.amount > 0 ? (
        <>
          <p className="text-md mb-2">Staked: {stake.amount} ETH</p>
          <p className="text-md mb-2">Claimed: {stake.claimed ? "Yes" : "No"}</p>
          <button
            onClick={handleClaim}
            disabled={!readyToClaim || stake.claimed}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded mb-2 w-full disabled:bg-gray-300"
          >
            Claim Rewards
          </button>
          <button
            onClick={handleUnstake}
            disabled={!readyToClaim}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded w-full disabled:bg-gray-300"
          >
            Unstake
          </button>
        </>
      ) : (
        <button
          onClick={handleStake}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded w-full"
        >
          Stake 0.001 ETH
        </button>
      )}

      {status && <p className="text-center text-sm mt-4 text-gray-600">{status}</p>}
    </div>
  );
};

export default StakingInterface;
