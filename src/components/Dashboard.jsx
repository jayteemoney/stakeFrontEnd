import { useEffect, useState } from "react";
import { formatEther, formatUnits } from "ethers";

const Dashboard = ({ provider, account, stakingContract, w3bTokenContract, refresh }) => {
  const [ethBalance, setEthBalance] = useState("0");
  const [staked, setStaked] = useState("0");
  const [tokenBalance, setTokenBalance] = useState("0");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const balance = await provider.getBalance(account);
        setEthBalance(formatEther(balance));

        try {
          const stake = await stakingContract.stakes(account);
          const amount = stake.amount || stake[0] || 0;
          setStaked(formatEther(amount));
        } catch (stakeError) {
          console.error("Error fetching stake:", stakeError);
          setStaked("0");
          setErrorMsg("Failed to fetch stake info: " + stakeError.message);
        }

        try {
          const tokenBal = await w3bTokenContract.balanceOf(account);
          setTokenBalance(formatUnits(tokenBal, 18));
        } catch (tokenError) {
          console.error("Error fetching token balance:", tokenError);
          setTokenBalance("0");
          setErrorMsg("Failed to fetch token balance: " + tokenError.message);
        }
      } catch (err) {
        console.error("General fetch error:", err);
        setErrorMsg("Failed to fetch data: " + err.message);
      }
    };

    if (provider && account && stakingContract && w3bTokenContract) {
      fetchData();
    }
  }, [provider, account, stakingContract, w3bTokenContract, refresh]);

  return (
    <div className="bg-gray-800 p-6 rounded-[20px] shadow-md w-full max-w-xl mx-auto mt-6">
      <p><strong>Wallet:</strong> {account}</p>
      <p><strong>ETH Balance:</strong> {parseFloat(ethBalance).toFixed(4)} ETH</p>
      <p><strong>Staked Amount:</strong> {parseFloat(staked).toFixed(4)} ETH</p>
      <p><strong>W3B Token Balance:</strong> {parseFloat(tokenBalance).toFixed(2)} W3B</p>
      {errorMsg && <p className="text-red-600 text-sm mt-2">{errorMsg}</p>}
    </div>
  );
};

export default Dashboard;
