import useNFTMarket from "../../state/nft-market";
import EmptyState from "../../components/EmptyState";
import useSigner from "../../state/signer";
import { GetOwnedListedNFTs } from "../../state/nft-market/__generated__/GetOwnedListedNFTs";
import NFTCard from "../../components/NFTCard";
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
        </>
      )}
    </div>
  );
};
export default OwnedPage;
