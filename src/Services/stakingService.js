import { ethers } from "ethers";
import stakingAbi from "../abi/StakingContract.json";
import tokenAbi from "../abi/W3BToken.json";

// Deployed addresses (replace with your deployed addresses)
const STAKING_CONTRACT_ADDRESS = "0x16Bf5bd1B37c9EDae26B8593131358b04cfE3AAC";
const TOKEN_CONTRACT_ADDRESS = "0x5B303d8F68C3995372FA7E9d7fd9B143E45612A6";

export async function getProvider() {
  if (!window.ethereum) throw new Error("Please install MetaMask");
  await window.ethereum.request({ method: "eth_requestAccounts" });
  return new ethers.BrowserProvider(window.ethereum);
}

export async function getContracts() {
  const provider = await getProvider();
  const signer = await provider.getSigner();

  const staking = new ethers.Contract(STAKING_CONTRACT_ADDRESS, stakingAbi.abi, signer);
  const token = new ethers.Contract(TOKEN_CONTRACT_ADDRESS, tokenAbi.abi, signer);
  return { staking, token, signer };
}

export async function stakeETH() {
  const { staking } = await getContracts();
  const tx = await staking.stake({ value: ethers.parseEther("0.001") });
  return await tx.wait();
}

export async function claimRewards() {
  const { staking } = await getContracts();
  const tx = await staking.claimRewards();
  return await tx.wait();
}

export async function unstakeETH() {
  const { staking } = await getContracts();
  const tx = await staking.unstake();
  return await tx.wait();
}

export async function getStakeInfo(userAddress) {
  const { staking } = await getContracts();
  const stake = await staking.stakes(userAddress);
  return {
    amount: ethers.formatEther(stake.amount),
    timestamp: Number(stake.timestamp),
    claimed: stake.claimed,
  };
}
