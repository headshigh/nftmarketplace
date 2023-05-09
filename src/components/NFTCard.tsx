import React, { useEffect, useState } from "react";
import Image from "next/image";
import { NFT } from "../state/nft-market/interfaces";
import useSigner from "../state/signer";
import { ipfsToHTTPS } from "../helpers";
import classNames from "classnames";
import AddressAvatar from "./AddressAvatar";
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
  const [meta, setMeta] = useState<NFTMetadata>();
  useEffect(() => {
    const fetchMetadata = async () => {
      const metadataResponse = await fetch(ipfsToHTTPS(nft.tokenURI));
      if (metadataResponse.status != 200) return;
      const json = await metadataResponse.json();
      setMeta({
        name: json.name,
        description: json.description,
        imageURL: ipfsToHTTPS(json.image),
      });
    };
    void fetchMetadata();
  }, [nft.tokenURI]);
  return (
    <div
      className={classNames(
        "flex w-72 flex-shrink-0 flex-col overflow-hidden rounded-xl border font-semibold shadow-sm",
        className
      )}
    >
      {meta ? (
        <img
          src={meta?.imageURL}
          alt={meta?.name}
          className="h-80 w-full object-cover object-center"
        />
      ) : (
        <div className="flex h-80 w-full items-center justify-center">
          loading...
        </div>
      )}
      <div className="flex flex-col p-4">
        <p className="text-lg">{meta?.name ?? "..."}</p>
        <span className="text-sm font-normal">
          {meta?.description ?? "..."}
        </span>
        <AddressAvatar address={nft.owner} />
      </div>
    </div>
  );
}

export default NFTCard;
