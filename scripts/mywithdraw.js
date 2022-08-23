const { ethers, getNamedAccounts } = require("hardhat")
//npx  hardhat run  scripts\mywithdraw.js  --network ganache 
async function main() {
  const { deployer } = await getNamedAccounts()
  const fundMe = await ethers.getContract("FundMe", deployer)

  const my_bal_before = await fundMe.provider.getBalance(deployer)
  console.log("My balance before remove all from contract "+ ethers.utils.formatEther( my_bal_before.toString())+" ETH")

  console.log("Interact FundMe at "+fundMe.address)
  console.log("Withdraw All from contract..........")
  const txResponse = await fundMe.withdraw()
  await txResponse.wait()
  console.log("Got it")
  const my_bal_after = await fundMe.provider.getBalance(deployer)
  console.log("My balance after take all  from contract "+ ethers.utils.formatEther( my_bal_after.toString())+" ETH")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
