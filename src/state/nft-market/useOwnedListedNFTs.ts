import { gql, useQuery } from "@apollo/client";
import useSigner from "../signer";
import { parseRawNFT } from "./helpers";
import {
  GetOwnedListedNFTs,
  GetOwnedListedNFTsVariables,
} from "./__generated__/GetOwnedListedNFTs";
const useOwnedListedNFTs = () => {
  const { address } = useSigner();
  const { data } = useQuery<GetOwnedListedNFTs, GetOwnedListedNFTsVariables>(
    GET_OWNED_LISTED_NFTS,
    {
      variables: {
        owner: address ?? "",
      },
      skip: !address,
    }
  );
  const ownedListedNFTs = data?.nfts.map(parseRawNFT);
  return { ownedListedNFTs };
};
const GET_OWNED_LISTED_NFTS = gql`
  query GetOwnedListedNFTs($owner: String!) {
    nfts(
      where: { to: "0x47da158b97eAfE14ba90b6BC3608a4cC1f5E9895", from: $owner }
    ) {
      id
      from
      to
      tokenURI
      price
    }
  }
`;
export default useOwnedListedNFTs;
