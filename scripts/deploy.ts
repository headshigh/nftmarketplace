import { ethers } from "hardhat";
import { NFTMarket } from "../typechain-types/contracts/NFTMarket";

async function main() {
  const NFTMarket = await ethers.getContractFactory("NFTMarket");
  const nftMarket = await NFTMarket.deploy();
  await nftMarket.deployed();
  console.log("Deployed to", nftMarket.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
console.log("Test");
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
