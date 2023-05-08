import "@nomiclabs/hardhat-waffle";
import "dotenv/config";
import { HardhatUserConfig } from "hardhat/config";

const RINKEBY_URL = process.env.RINKEBY_URL as string;
const PRIVATE_KEY = process.env.PRIVATE_KEY as string;
console.log(RINKEBY_URL);

const config: HardhatUserConfig = {
  solidity: "0.8.18",
  networks: {
    sepolia: {
      url: "https://sepolia.infura.io/v3/35a40ff5c4a34822bf0a544014cf4a9f",
      accounts: [
        "d63313159a7d359ab1538941c60b7a98da451353b2f9006436b498cc89f4fab6",
      ],
    },
  },
};

export default config;
