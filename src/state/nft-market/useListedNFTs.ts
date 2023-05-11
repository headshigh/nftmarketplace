import { gql, useQuery } from "@apollo/client";
import useSigner from "../signer";
import { parseRawNFT } from "./helpers";

import {
  GetListedNFTs,
  GetListedNFTsVariables,
} from "./__generated__/GetListedNFTs";
import { NFT_MARKET_ADDRESS } from "./config";
import { parse } from "path";
const useListedNFTs = () => {
  const { address } = useSigner();
  const { data } = useQuery<GetListedNFTs, GetListedNFTsVariables>(
    GET_LISTED_NFTS,
    { variables: { currentAddress: address ?? "" }, skip: !address }
  );
  console.log("unparsed", data);
  const listedNFTs = data?.nfts.map(parseRawNFT);
  return { listedNFTs };
};
const GET_LISTED_NFTS = gql`query GetListedNFTs($currentAddress:String!){
    nfts(
        where:{
            to:"${"0x47da158b97eAfE14ba90b6BC3608a4cC1f5E9895"}"
            from_not:$currentAddress
        }
    ){
        id
        from
        to 
        tokenURI
        price
    }
}`;
export default useListedNFTs;
