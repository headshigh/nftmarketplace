import { gql, useQuery } from "@apollo/client";
import useSigner from "../signer";
import { parseRawNFT } from "./helpers";
import {
  GetOwnedNFTs,
  GetOwnedNFTsVariables,
} from "./__generated__/GetOwnedNFTs";
const useOwnedNFTs = () => {
  const { address } = useSigner();
  console.log(address);
  const { data } = useQuery<GetOwnedNFTs, GetOwnedNFTsVariables>(
    GET_OWNED_NFTS,
    {
      variables: { owner: address ?? "" },
      skip: !address,
    }
  );
  console.log("data", data);
  const ownedNFTs = data?.nfts.map(parseRawNFT);
  return { ownedNFTs };
};
const GET_OWNED_NFTS = gql`
  query GetOwndeNFTs($owner: String!) {
    nfts(where: { to: $owner }) {
      id
      from
      to
      tokenURI
      price
    }
  }
`;
export default useOwnedNFTs;
