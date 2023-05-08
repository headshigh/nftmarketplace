import { ethers } from "ethers";
import { NFT } from "./interfaces";

export const parseRawNFT = (raw): NFT => {
  return {
    id: raw.id,
    owner: raw.price == "0" ? raw.to : raw.from, //when nft is minted this belongs to the one who minted it we are tracing nft transfer event
    price: raw.price == "0" ? "0" : ethers.utils.formatEther(raw.price),
    tokenURI: raw.tokenURI,
  };
};
