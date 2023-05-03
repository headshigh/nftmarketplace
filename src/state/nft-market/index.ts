import useSigner from "../signer";
import NFT_MARKET from "../../../artifacts/contracts/NFTMarket.sol/NFTMarket.json";
import { NFT_MARKET_ADDRESS } from "./config";

const useNFTMarket = () => {
  const { signer } = useSigner();
  const nftMarket = new Contract(NFT_MARKET_ADDRESS, NFT_MARKET.abi, signer);
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
      if (response.status == 200) {
        const json = await response.json();
        const transaction = await nftMarket.createNFT(json.uri);
      }
    } catch (err) {
      console.log(err);
    }
  };
  return { createNFT };
};
export default useNFTMarket;
