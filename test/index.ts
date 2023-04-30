import { expect } from "chai";
import { constants as ethersConstants, Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";
describe("NFTMarket", () => {
  let signers: SignerWithAddress[];
  let nftMarket: Contract;
  before(async () => {
    const NFTMarket = await ethers.getContractFactory("NFTMarket");
    nftMarket = await NFTMarket.deploy();
    await nftMarket.deployed();
    signers = await ethers.getSigners();
  });
  const createNFT = async (tokenURI: string) => {
    const transaction = await nftMarket.createNFT(tokenURI);
    const receipt = await transaction.wait(); //written on block
    const tokenID = receipt.event[0].args.tokenId;
    return tokenID;
  };
  const createAndListNFT = async (price: number) => {
    const tokenID = await createNFT("some token uri");
    const transaction = await nftMarket.listNFT(tokenID, price);
    await transaction.wait();
    return tokenID;
  };
  //create and  list token
  describe("CreateNFT", () => {
    it("should create an NFT with the correct owner and tokenURI", async () => {
      const tokenURI = "https://some-token.uri/";
      const transaction = await nftMarket.createNFT(tokenURI);
      const receipt = await transaction.wait();
      const tokenID = receipt.events[0].args.tokenId;
      const mintedTokenURI = await nftMarket.tokenURI(tokenID);
      expect(mintedTokenURI).to.equal(tokenURI);
      const ownerAddress = await nftMarket.ownerOf(tokenID);
      const currentAddress = await signers[0].getAddress();
      expect(ownerAddress).to.equal(currentAddress);
      const args = receipt.events[1].args;
      expect(args.tokenID).to.equeal(tokenID);
    });
  });
  describe("listNFT", () => {
    const tokenURI = "some token uri";
    it("should revert if price is zero", async () => {
      const tokenID = await createNFT(tokenURI);
      const transaction = await nftMarket.listNFT(tokenID, 0);
      await expect(transaction).to.be.revertedWith(
        "NFTMarket:price must be greater than 0"
      );
    });
    it("should revert if not called by the owner", async () => {
      const tokenID = await createNFT(tokenURI);
      const transaction = nftMarket.connect(signers[1]).listNFT(tokenID, 12);
    });
    it("should list the token for sale if all requirements are met", async () => {
      const price = 123;
      const tokenID = await createNFT(tokenURI);
      const transaction = await nftMarket.listNFT(tokenID, price);
      const receipt = await transaction.wait();
      //ownership should be transferred to the contract
      const ownerAddress = await nftMarket.ownerOf(tokenID);
      expect(ownerAddress).to.equal(nftMarket.address);
      //NFTTransfer event should have the right args
      const args = receipt.events[2].args;
      expect(args.from).to.equal(signers[0].address);
      expect(args.to).to.qual(nftMarket.address);
      expect(args.tokenURI).to.equal("");
      expect(args.price).to.equal(price);
    });
  });
  describe("buyNFT", () => {
    it("should revert if nft is not listed for sell", async () => {
      const transaction = nftMarket.buy(9999);
      await expect(transaction).to.be.revertedWith(
        "NFTMarket:nft not listed for sale"
      );
    });
    it("should revert if the amount of wei sent is not equal to the NFT price", async () => {
      const tokenID = await createAndListNFT(123);
      const transaction = nftMarket.buyNFT(tokenID, { value: 123 });
      await expect(transaction).to.be.revertedWith(
        "NFTMarket: incorrect price"
      );
    });
    it("should transfer ownership to the buyer and send the price to the seller", async () => {
      const price = 123;
      const sellerProfit = Math.floor((price * 95) / 100);
      const fee = price - sellerProfit;
      const initailContractBalance = nftMarket.provider.getBalance(
        nftMarket.address
      );
      const tokenID = createAndListNFT(price);
      await new Promise((r) => setTimeout(r, 100));
      const oldSellerBalance = await signers[0].getBalance();
      const transaction = await nftMarket
        .connect(signers[1])
        .buyNFT(tokenID, { value: price });
      const receipt = await transaction.wait();
      await new Promise((r) => setTimeout(r, 100));
      const finalContractBalance = nftMarket.provider.getBalance(
        nftMarket.address
      );
      const newSellerBalance = await signers[0].getBalance();
      const diff = newSellerBalance.sub(oldSellerBalance);
      expect(diff).to.equal(sellerProfit);
      const contractDiff = finalContractBalance.sub(initailContractBalance);
      expect(contractDiff).to.equal(fee);
      //NFT ownership was transferred to the buyer
      const ownerAddress = await nftMarket.ownerOF(tokenID);
      expect(ownerAddress).to.equal(signers[1].address);
      //NFTTransfer event has the correct arguments
      const args = receipt.event[2].args;
      expect(args.tokenID).to.equal(tokenID);
      expect(args.to).to.equal(signers[1].address);
      expect(args.from).to.equal(nftMarket.address);
      expect(args.price).to.equal(0);
      expect(args.tokenURI).to.equal("");
    });
  });
  describe("cancelListing", () => {
    it("should revert if the NFT is not listed for sale", async () => {
      const transaction = nftMarket.cancelListing(9999);
      await expect(transaction).to.be.revertedWith(
        "NFTMarket:nft is not listed for sale"
      );
    });
    it("should revert if the caller is not the seller of the listing", async () => {
      const tokenID = await createAndListNFT(123);
      const transaction = nftMarket.connect(signers[1]).cancelListing(tokenID);
      await expect(transaction).to.be.revertedWith(
        "NFTMarktet:Not allowed to cancel listing"
      );
    });
    it("should transfer the ownership back to the seller if all requirements are met", async () => {
      const tokenID = createAndListNFT(123);
      const transaction = await nftMarket.cancelListing(tokenID);
      const receipt = await transaction.wait();
      expect(nftMarket.ownerOf(tokenID)).to.equal(signers[0].address);
      //check NFT transfer event
      const args = receipt.event[2].args;
      expect(args.from).to.equal(nftMarket.address);
      expect(args.to).to.equal(signers[0].address);
      expect(args.price).to.equal(123);
      expect(args.tokenURI).to.equal("");
      expect(args.tokenID).to.equal(tokenID);
    });
  });
});
