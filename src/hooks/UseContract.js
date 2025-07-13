import { ethers } from "ethers";
import stakingAbi from "../abi/StakingContract.json";
import tokenAbi from "../abi/W3BToken.json";
import { STAKING_CONTRACT_ADDRESS, W3B_TOKEN_ADDRESS } from "../config/Addresses";

export const UseContract = async (provider) => {
  try {
    // Validate ABIs
    if (!Array.isArray(stakingAbi.abi)) {
      throw new Error("StakingContract ABI is not an array");
    }
    if (!Array.isArray(tokenAbi.abi)) {
      throw new Error("W3BToken ABI is not an array");
    }

    const signer = await provider.getSigner();

    const stakingContract = new ethers.Contract(
      STAKING_CONTRACT_ADDRESS,
      stakingAbi.abi, // Use the .abi property
      signer
    );

    const w3bTokenContract = new ethers.Contract(
      W3B_TOKEN_ADDRESS,
      tokenAbi.abi, // Use the .abi property
      signer
    );

    return { stakingContract, w3bTokenContract };
  } catch (error) {
    console.error("Error initializing contracts:", error);
    throw error;
  }
};