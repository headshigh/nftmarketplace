import React, { useEffect } from "react";
import { NFT } from "../state/nft-market/interfaces";
import useSigner from "../state/signer";
type NFTMetadata = {
  name: string;
  description: string;
  imageURL: string;
};
type NFTCardProps = {
  nft: NFT;
  className?: string;
};
function NFTCard(props: NFTCardProps) {
  const { nft, className } = props;
  const { address } = useSigner();
  useEffect(() => {
    const fetchMetadata = async () => {
      // const metadataResponse=await fetch()
    };
  }, [nft.tokenURI]);

  return <div>NFTCard</div>;
}

export default NFTCard;
