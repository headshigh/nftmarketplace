import classNames from "classnames";
import { toast } from "react-toastify";
import useSigner from "../../state/signer";
import EmptyState from "../../components/EmptyState";
import useNFTMarket from "../../state/nft-market";
import CreationForm from "./CreationForm";
const CreationPage = () => {
  const { signer } = useSigner();
  const { createNFT } = useNFTMarket();
  const onSubmit = async (values: any) => {
    try {
      console.log("nft uploading");
      toast.success("You'll see your nft here shortly. Refresh the page");
      await createNFT(values);
    } catch (err) {
      toast.warn("something went wrong!");
      console.log(err);
    }
  };
  return (
    <div className="flex h-full w-full flex-col">
      {!signer && <EmptyState>Connect your wallet</EmptyState>}
      {signer && <CreationForm onSubmit={onSubmit} />}
    </div>
  );
};
export default CreationPage;
