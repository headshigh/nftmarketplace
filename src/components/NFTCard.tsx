import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { NFT } from "../state/nft-market/interfaces";
import useSigner from "../state/signer";
import { ipfsToHTTPS } from "../helpers";
import classNames from "classnames";
import AddressAvatar from "./AddressAvatar";
import SellPopup from "./SellPopup";
import { BigNumber } from "ethers";
import useNFTMarket from "../state/nft-market";
import { toast } from "react-toastify";
import Button from "./Button";
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
  const [loading, setLoading] = useState(false);
  const [sellPopupOpen, setSellPopupOpen] = useState(false);
  const forSale = nft.price != "0";
  const router = useRouter();
  const owned = nft.owner == address?.toLowerCase();
  const { listNFT, cancelListing, buyNFT } = useNFTMarket();
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
  const showErrorToast = () => toast.warn("Something went worng!");
  const onButtonClick = async () => {
    if (owned) {
      if (forSale) onCancelClicked();
      else setSellPopupOpen(true);
    } else {
      if (forSale) onBuyClicked();
      else {
        throw new Error(
          "On Button Click called when nft is not owned and is not listed this should never hapened"
        );
      }
    }
  };
  const onBuyClicked = async () => {
    setLoading(true);
    try {
      await buyNFT(nft);
      router.push("/owned");
    } catch (e) {
      showErrorToast();
      alert(
        e.toString().substring(0, 52) +
          "," +
          "Load sepoli eth into your account: https://faucet-sepolia.rockx.com/"
      );
      console.log(e);
    }
    setLoading(false);
  };
  const onCancelClicked = async () => {
    setLoading(true);
    try {
      await cancelListing(nft.id);
      toast.success(
        "You canceled this listing. Changes will be reflected shortly"
      );
    } catch (err) {
      showErrorToast();
      console.log(err);
    }
    setLoading(false);
  };
  const onSellConfirmed = async (price: BigNumber) => {
    setSellPopupOpen(false);
    setLoading(true);
    console.log("clicked");
    try {
      await listNFT(nft.id, price);
      console.log("listed for sale");
      toast.success(
        "You listed this NFT for sale,Changes will be reflected shortly"
      );
    } catch (err) {
      showErrorToast();
      console.log(err);
    }
    setLoading(false);
  };
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
      <button
        onClick={onButtonClick}
        className="group flex h-16 items-center justify-center bg-black text-lg font-semibold text-white"
      >
        {loading && "Busy..."}
        {!loading && (
          <>
            {!loading && (
              <>
                {!forSale && "SELL"}
                {forSale && owned && (
                  <>
                    <span>{nft.price}ETH</span>
                    <span className="hidden group-hover:inline">CANCEL</span>
                  </>
                )}
                {forSale && !owned && (
                  <>
                    <span className="group-hover:hidden">{nft.price} ETH</span>
                    <span className="hidden group-hover:inline">BUY</span>
                  </>
                )}
              </>
            )}
          </>
        )}
      </button>
      <SellPopup
        onSubmit={onSellConfirmed}
        open={sellPopupOpen}
        onClose={() => setSellPopupOpen(false)}
      />
    </div>
  );
}

export default NFTCard;
