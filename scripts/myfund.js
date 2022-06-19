const { ethers, getNamedAccounts } = require("hardhat")

async function main() {
  // 0.05 ETH= 61.92 $
  // const my_eth="10"
  const my_eth_str="0.04"
  const my_amount=ethers.utils.parseEther(my_eth_str)
  
  const { deployer } = await getNamedAccounts()
  const fundMe = await ethers.getContract("FundMe", deployer)
  console.log("Interact FundMe at "+fundMe.address)
  console.log("Funding contract....................")


  const my_bal_before = await fundMe.provider.getBalance(deployer)
  console.log("My balance in wallet before deposite "+ ethers.utils.formatEther( my_bal_before.toString())+" ETH")
  const txResponse = await fundMe.fund({
    value: my_amount,
  })
  await txResponse.wait()

  const my_amont_in_fundme= await fundMe.getAddressToAmountFunded(deployer)
  const my_bal_after = await fundMe.provider.getBalance(deployer)
  console.log("My amount in FundMe "+ ethers.utils.formatEther( my_amont_in_fundme.toString())+" ETH")
  console.log("My balance in Wallet after deposite "+ ethers.utils.formatEther( my_bal_after.toString())+" ETH")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
