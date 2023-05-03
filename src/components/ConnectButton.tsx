import React from "react";
import useSigner from "../state/signer";
import AddressAvatar from "./AddressAvatar";

function ConnectButton() {
  const { address, loading, connectWallet } = useSigner();
  if (address) return <AddressAvatar address={address} />;
  return (
    <button
      onClick={connectWallet}
      className="flex  h-10 w-36 items-center justify-center rounded-full bg-black px-4 font-semibold text-white"
    >
      {loading ? "busy.." : "Connect Wallet"}
    </button>
  );
}

export default ConnectButton;
