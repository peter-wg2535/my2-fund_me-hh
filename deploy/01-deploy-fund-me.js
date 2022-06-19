const { network } = require("hardhat")

const { networkConfig,developmentChains }=require("../helper-hardhat-config")
const {  verify } =require("../utils/verify")

module.exports=async ({getNamedAccounts, deployments })=>{
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId=network.config.chainId  //const { network } = require("hardhat")
    log(chainId)

    let ETH_USD_address
    if (developmentChains.includes(network.name)){
    // if (chainId == 31337) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator") // get ("contract name")
        log("Get MockV3Aggregator for fake price feed.")
        ETH_USD_address= ethUsdAggregator.address
 
    } else {
        ETH_USD_address= networkConfig[chainId]["ethUsdPriceFeed"]
        log("Get Real Aggregator for real price feed.")
    }
    
    list_args=[ETH_USD_address]
    const fundMe_sct=await deploy("FundMe",
    { from: deployer,args:list_args,log:true, 
      waitConfirmations: network.config.blockConfirmations || 1, }
    )
    log("FundMe deployed at "+fundMe_sct.address)
    
//    if (developmentChains.includes(network.name)==false  && process.env.ETHERSCAN_API_KEY ){
//        await verify(fundMe_sct.address,list_args)
//    }
    
}
module.exports.tags = ["all", "fundme"]

// function deployFunc(){
//     console.log("Hi , get start with advance Hardhat")
// }
// module.exports.default = deployFunc
