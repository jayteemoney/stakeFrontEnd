import { useState } from "react";
import { parseEther } from "ethers";

const StakingActions = ({ stakingContract, onActionComplete }) => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleStake = async () => {
    if (!amount) return alert("Please enter an amount");
    try {
      setLoading(true);
      const tx = await stakingContract.stake({ value: parseEther(amount) });
      await tx.wait();
      alert("Staked successfully!");
      setAmount("");
      onActionComplete(); 
    } catch (error) {
      console.error(error);
      alert("Stake failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleUnstake = async () => {
    try {
      setLoading(true);
      const tx = await stakingContract.unstake();
      await tx.wait();
      alert("Unstaked successfully!");
      onActionComplete();
    } catch (error) {
      console.error(error);
      alert("Unstake failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async () => {
    try {
      setLoading(true);
      const tx = await stakingContract.claimRewards();
      await tx.wait();
      alert("Rewards claimed!");
      onActionComplete();
    } catch (error) {
      console.error(error);
      alert("Claim failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 mt-10">
      <input
        type="number"
        step="0.001"
        placeholder="Enter ETH amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="border border-gray-400 rounded-lg p-2 w-64"
      />
      <div className="flex gap-4">
        <button
          onClick={handleStake}
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
        >
          Stake
        </button>
        <button
          onClick={handleUnstake}
          disabled={loading}
          className="bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
        >
          Unstake
        </button>
        <button
          onClick={handleClaim}
          disabled={loading}
          className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition disabled:opacity-50"
        >
          Claim Rewards
        </button>
      </div>
    </div>
  );
};

export default StakingActions;
