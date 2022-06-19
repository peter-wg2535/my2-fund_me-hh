const { assert } = require("chai")
const { network, ethers, getNamedAccounts } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe Staging Tests", async function () {
          let deployer
          let fundMe
          
          const sendValue = ethers.utils.parseEther("0.03")
          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer
              fundMe = await ethers.getContract("FundMe", deployer)
              console.log(deployer)
              console.log(fundMe.address)
              console.log(network.name)
          })

          it("allows people to fund and withdraw", async function () {
              tx_fund=await fundMe.fund({ value: sendValue })
              // await tx_fund.wait()

              tx_withdraw=await fundMe.withdraw()
              await tx_withdraw.wait()

              const endingFundMeBalance = await fundMe.provider.getBalance(
                  fundMe.address
              )
              assert.equal(endingFundMeBalance.toString(), "0")
          })
      })
