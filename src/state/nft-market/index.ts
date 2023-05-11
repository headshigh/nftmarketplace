import useSigner from "../signer";
import NFT_MARKET from "../../../artifacts/contracts/NFTMarket.sol/NFTMarket.json";
import { NFT_MARKET_ADDRESS } from "./config";
import { Contract, utils, ethers } from "ethers";
import { NFT } from "./interfaces";
import useOwnedNFTs from "./useOwnedNFTs";
import { GetOwnedNFTs } from "./__generated__/GetOwnedNFTs"; //ts
import { BigNumber } from "ethers";
import useOwnedListedNFTs from "./useOwnedListedNFTs";
import { TransactionResponse } from "@ethersproject/providers";
import useListedNFTs from "./useListedNFTs";
const useNFTMarket = () => {
  const { signer } = useSigner();
  const nftMarket = new Contract(
    "0x47da158b97eAfE14ba90b6BC3608a4cC1f5E9895",
    NFT_MARKET.abi,
    signer
  );
  const ownedNFTs = useOwnedNFTs();
  const ownedListedNFTs = useOwnedListedNFTs();
  const listedNFTs = useListedNFTs();

  const createNFT = async (values: any) => {
    try {
      const data = new FormData();
      data.append("name", values.name);
      data.append("description", values.description);
      data.append("image", values.image!);
      //this is for storing the image metadata on IPFS
      const response = await fetch("/api/nft-storage", {
        method: "POST",
        body: data,
      });
      console.log(response);
      if (response.status == 201) {
        console.log("uploaded on filestorage,uploading on blockchain");
        const json = await response.json();
        const transaction = await nftMarket.createNFT(json.uri);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const listNFT = async (tokenID: string, price: BigNumber) => {
    const transaction: TransactionResponse = await nftMarket.listNFT(
      tokenID,
      price
    );
    await transaction.wait();
  };
  const cancelListing = async (tokenID: string) => {
    const transaction = await nftMarket.cancelListing(tokenID);
    await transaction.wait();
  };
  const buyNFT = async (nft: NFT) => {
    const transaction = await nftMarket.buyNFT(nft.id, {
      value: ethers.utils.parseEther(nft.price),
    });
  };
  return {
    createNFT,
    listNFT,
    cancelListing,
    buyNFT,
    ...ownedNFTs,
    ...ownedListedNFTs,
    ...listedNFTs,
  };
};
export default useNFTMarket;
