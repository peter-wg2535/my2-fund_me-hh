const networkConfig = {
  31337: {
    name: "localhost",
  },
  1337: {
    name: "ganache",
  },
  // Price Feed Address, values can be obtained at https://docs.chain.link/docs/reference-contracts
  //https://docs.chain.link/docs/ethereum-addresses/
  // Default one is ETH/USD contract on Kovan
  4: {
    name: "rinkeby",
    ethUsdPriceFeed: "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e",
  },  
  42: {
    name: "kovan",
    ethUsdPriceFeed: "0x9326BFA02ADD2366b30bacB125260Af641031331",
  },
  137: {
    name: "polygon",
    ethUsdPriceFeed: "0xF9680D99D6C9589e2a93a78A04A279e509205945",
  },
  80001:
  {
    name: "mumbai",
    ethUsdPriceFeed: "0x0715A7794a1dc8e42615F059dD6e406A6594651A",
  },

}

const developmentChains = ["hardhat", "localhost","ganache"]

module.exports = {
  networkConfig,
  developmentChains,
}
