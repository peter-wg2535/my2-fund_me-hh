const { ethers, getNamedAccounts } = require("hardhat")
//npx  hardhat run  scripts\myfund.js  --network ganache 
async function main() {
  // 0.05 ETH= 61.92 $
  // const my_eth="10"
  const my_eth_str="5"
  const my_amount=ethers.utils.parseEther(my_eth_str)
  
  const {deployer, user1,user2} = await getNamedAccounts()
  console.log("Deployer = "  +deployer)
  console.log("User1 = "  +user1)
  console.log("User2 = "  +user2)
  // const fundMe = await ethers.getContract("FundMe", deployer)
  const fundMe = await ethers.getContract("FundMe", user1)
  console.log("Interact FundMe at "+fundMe.address)
  console.log("Funding contract....................")


  // const my_bal_before = await fundMe.provider.getBalance(deployer)
  const my_bal_before = await fundMe.provider.getBalance(user1)
  console.log("My balance in wallet before deposite "+ ethers.utils.formatEther( my_bal_before.toString())+" ETH")
  const txResponse = await fundMe.fund({
    value: my_amount,
  })
  await txResponse.wait()

  //const my_amont_in_fundme= await fundMe.getAddressToAmountFunded(deployer)
  const my_amont_in_fundme= await fundMe.getAddressToAmountFunded(user1)
  const my_bal_after = await fundMe.provider.getBalance(user1)
  console.log("My amount in FundMe "+ ethers.utils.formatEther( my_amont_in_fundme.toString())+" ETH")
  console.log("My balance in Wallet after deposite "+ ethers.utils.formatEther( my_bal_after.toString())+" ETH")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
