import useNFTMarket from "../../state/nft-market";
import EmptyState from "../../components/EmptyState";
import useSigner from "../../state/signer";
import { GetOwnedListedNFTs } from "../../state/nft-market/__generated__/GetOwnedListedNFTs";
import NFTCard from "../../components/NFTCard";
import Button from "../../components/Button";
import { toast } from "react-toastify";
const OwnedPage = () => {
  const { ownedNFTs, ownedListedNFTs } = useNFTMarket();
  console.log(ownedNFTs);
  const { signer } = useSigner();
  const notConnected = !signer;
  const loading = signer && !ownedNFTs && !ownedListedNFTs;
  const empty =
    signer &&
    ownedNFTs &&
    ownedListedNFTs &&
    ownedNFTs.length == 0 &&
    ownedListedNFTs.length == 0;
  const loaded =
    signer &&
    ((ownedNFTs && ownedNFTs.length) ||
      (ownedListedNFTs && ownedListedNFTs.length));
  return (
    <div className="flex w-full flex-col">
      {notConnected && <EmptyState>Connect Your wallet</EmptyState>}
      {loading && <EmptyState>Fetching your data please wait</EmptyState>}
      {empty && <EmptyState>Your poor ass doesnot own any nfts</EmptyState>}
      {loaded && (
        <>
          <div className="flex flex-wrap">
            {ownedNFTs?.map((nft) => (
              <NFTCard nft={nft} className="mr-2 mb-2" key={nft.id} />
            ))}
          </div>
          {/* divider */}
          {ownedListedNFTs && ownedListedNFTs.length > 0 && (
            <>
              <div
                style={{ backgroundColor: "#000000" }}
                className=" my-2 mb-8 h-[1px] w-full flex-shrink-0 bg-black"
              >
                <div className="flex justify-center px-2 font-mono text-xl font-semibold ">
                  ----------LISTED NFTS---------
                </div>
              </div>
              {/* owned listed nfts */}
              <div className="flex flex-wrap">
                {ownedListedNFTs?.map((nft) => (
                  <NFTCard nft={nft} className="mr-2 mb-2" key={nft.id} />
                ))}
              </div>
            </>
          )}
        </>
      )}
      <div
        onClick={() => {
          toast.success("sucess");
        }}
      >
        close
      </div>
    </div>
  );
};
export default OwnedPage;
