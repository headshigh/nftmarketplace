export type NFT = {
  id: string;
  //owner of nft if nft is listed for sale this will be seller address
  owner: string;
  //if price>0 the nft is for sale
  price: string;
  tokenURI: string;
};
