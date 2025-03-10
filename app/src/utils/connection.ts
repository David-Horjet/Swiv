import { Connection } from "@solana/web3.js";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import idlRaw from "../idl/contracts.json"; 
import { Idl } from "@coral-xyz/anchor";

import { AnchorWallet } from "@solana/wallet-adapter-react";

const idl = idlRaw as Idl;

// const PROGRAM_ID = new PublicKey("8cvPck4QVdw75bD6my4TCvQsYsF32yRtA1DFeQrmB7gd");
const network = "https://api.testnet.sonic.game"; // Sonic testnet RPC
const connection = new Connection(network, "processed");

// Ensure `wallet` is properly typed as `AnchorWallet`
export const getProvider = (wallet: AnchorWallet | null) => {
  if (!wallet) {
    throw new Error("Wallet is not connected");
  }
  
  return new AnchorProvider(connection, wallet, { preflightCommitment: "processed" });
};

export const getProgram = (wallet: AnchorWallet | null) => {
  if (!wallet) {
    throw new Error("Wallet is not connected");
  }

  const provider = getProvider(wallet);
  return new Program(idl,  provider);
};
