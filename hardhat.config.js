require("dotenv").config();

require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require("solidity-coverage");
require("hardhat-deploy")


module.exports = {
  solidity: {
    compilers: [
        {
            version: "0.8.8",
        },
        {
            version: "0.6.6",
        },
    ],
},
  defaultNetwork: "hardhat",
  networks: {
    rinkeby: {
      url: process.env.RINKEBY_URL,
      accounts:[process.env.PRIVATE_KEY] ,
      chainId: 4,
      blockConfirmation:6,
    },
    ganache: {
      url: "http://127.0.0.1:8545",
      chainId:1337,
    },
  },

  gasReporter: {
    enabled: true,
    currency: "USD",
    outputFile: "gas-report.txt",
    noColors: true,
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },

  //https://github.com/wighawag/hardhat-deploy#1-namedaccounts-ability-to-name-addresses
  namedAccounts: {
    deployer: {
        default: 0, // here this will by default take the first account as deployer
        //1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
        1337:'0xBEf5dc429aab8754194717be22433DEC3EDc514E'
    },
    user1:{
      default:1,
      1337:'0xE8F7D7c1DD8E21ABb017d26ca9fA8a087b198ba4'
    },
    user2:{
      default:2,
      1337:'0xe456524c8D3E56B42F416E224A772Ae1Aca091B7'
    }
},
};
