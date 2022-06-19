const { expect, assert, AssertionError } = require("chai");
const { deployments, ethers, getNamedAccounts } = require("hardhat");
/*  Note how to deploy on variouse ways
       const accounts=await ethers.getSigners() 
       const acc0=accounts
       OR
       const [deployer, artist, user1, user2, ...users] = await ethers.getSigners();
       it will get  from  hardhat.config.js accounts:[process.env.PRIVATE_KEY] network in hardhat.config.js
       */
describe("FundMe", function () {
    let fundMe
    let mockV3Agg
    let deployer
    let amount_to_fund = ethers.utils.parseEther("1")
    beforeEach(async function () {

        deployer = (await getNamedAccounts()).deployer // get the accout-0 in array as deployer
        await deployments.fixture(["all"])
        fundMe = await ethers.getContract("FundMe", deployer)
        mockV3Agg = await ethers.getContract("MockV3Aggregator", deployer)
    })

    describe("constructor", function () {
        it("Set the agg adress correctly", async function () {
            //function getPriceFeed() public view returns (AggregatorV3Interface)
            const aggV3_address = await fundMe.getPriceFeed()
            assert.equal(aggV3_address, mockV3Agg.address)
        })

    })
    describe("fund", function () {
        it("Fails if you don't send enough ETH", async function () {
            await expect(fundMe.fund()).to.be.revertedWith("You need to spend more ETH")
        })
        it("Deposite amount funded data structure", async function () {

            //function fund() public payable 
            await fundMe.fund({ value: amount_to_fund })
            //function getAddressToAmountFunded(address fundingAddress)
            const amount_bal = await fundMe.getAddressToAmountFunded(deployer)

            assert.equal(amount_bal.toString(), amount_to_fund.toString())
        })
        it("Check funder addreess index is the same as deployer", async function () {

            //function fund() public payable 
            await fundMe.fund({ value: amount_to_fund })
            //function getFunder(uint256 index) public view returns (address)
            const funder0 = await fundMe.getFunder(0)
            assert.equal(funder0, deployer)
        })

    })
    describe("withdraw", () => {
        const amount2_to_fund = ethers.utils.parseEther("10")
        const no_account_to_fund=4   // except accout0
        beforeEach(async () => {
            await fundMe.fund({ value: amount2_to_fund })
        })
        it("Widthdraw ETH from a single founder", async () => {

            const starting_FundBal = await fundMe.provider.getBalance(fundMe.address)
            const starting_DeployerBal = await fundMe.provider.getBalance(deployer)
            const s_eth_Fund = ethers.utils.formatEther(starting_FundBal.toString())
            const s_eth_Deploy = ethers.utils.formatEther(starting_DeployerBal.toString())

            // function withdraw() public payable onlyOwner
            const txResponse_Withdraw = await fundMe.withdraw()
            const txReceipt_Widthdraw = await txResponse_Withdraw.wait(1)
            const { gasUsed, effectiveGasPrice } = txReceipt_Widthdraw
            const gasCost = gasUsed.mul(effectiveGasPrice)

            const ending__FundBal = await fundMe.provider.getBalance(fundMe.address)
            const ending_DeployerBal = await fundMe.provider.getBalance(deployer)
            const e_eth_Fund = ethers.utils.formatEther(ending__FundBal.toString())
            const e_eth_Deploy = ethers.utils.formatEther(ending_DeployerBal.toString())

            assert.equal(ending__FundBal, 0)
            assert.equal(starting_FundBal.add(starting_DeployerBal).toString(),
                ending_DeployerBal.add(gasCost).toString())

        })

        it("Allows us to widthraw with multiple funders", async function () {
            //Arrange
            const accounts = await ethers.getSigners()
            // ignore the first account as deployer so we have to get start with index 1
            for (i = 1; i < no_account_to_fund; i++) {
                const acc_x_connect = await fundMe.connect(accounts[i])
                await acc_x_connect.fund({ value: amount2_to_fund })

            }
            const starting_FundBal = await fundMe.provider.getBalance(fundMe.address)
            const starting_DeployerBal = await fundMe.provider.getBalance(deployer)
            const s_eth_Fund = ethers.utils.formatEther(starting_FundBal.toString())
            const s_eth_Deploy = ethers.utils.formatEther(starting_DeployerBal.toString())

            //Act 
            const txResponse = await fundMe.withdraw()
            const txReceipt = await txResponse.wait(1)
            const { gasUsed, effectiveGasPrice } = txReceipt
            const gasCost = gasUsed.mul(effectiveGasPrice)

            //Assert
            const ending__FundBal = await fundMe.provider.getBalance(fundMe.address)
            const ending_DeployerBal = await fundMe.provider.getBalance(deployer)
            const e_eth_Fund = ethers.utils.formatEther(ending__FundBal.toString())
            const e_eth_Deploy = ethers.utils.formatEther(ending_DeployerBal.toString())

            assert.equal(ending__FundBal, 0)
            assert.equal(starting_FundBal.add(starting_DeployerBal).toString(),
                ending_DeployerBal.add(gasCost).toString())


            //Make sure that the funders are reset properly  account0=deployer
            await expect(fundMe.getFunder(0)).to.be.reverted

            //other accounts starting with acc1,acc2,acc3,acc4,acc5
            for (let i = 1; i < no_account_to_fund; i++) {

                //function getAddressToAmountFunded(address fundingAddress)
                bal_accx = await fundMe.getAddressToAmountFunded(accounts[i].address)
                assert.equal(bal_accx, 0)
            }



        })
        it("Only allows the owner to withdraw", async function () {
            const accounts = await ethers.getSigners()
            const attacker = accounts[1]

            attacker_connect = await fundMe.connect(attacker)

           //error FundMe__NotOwner();   in  FundMe.sol
            await expect(attacker_connect.withdraw()).to.be.revertedWith("FundMe__NotOwner")

        })

        it("Allows us to cheaper widthraw with multiple funders", async function () {
            //Arrange
            const accounts = await ethers.getSigners()
            // ignore the first account as deployer so we have to get start with index 1
            for (i = 1; i < no_account_to_fund; i++) {
                const acc_x_connect = await fundMe.connect(accounts[i])
                await acc_x_connect.fund({ value: amount2_to_fund })

            }
            const starting_FundBal = await fundMe.provider.getBalance(fundMe.address)
            const starting_DeployerBal = await fundMe.provider.getBalance(deployer)
            const s_eth_Fund = ethers.utils.formatEther(starting_FundBal.toString())
            const s_eth_Deploy = ethers.utils.formatEther(starting_DeployerBal.toString())

            //Act 
            const txResponse = await fundMe.cheaperWithdraw()
            const txReceipt = await txResponse.wait(1)
            const { gasUsed, effectiveGasPrice } = txReceipt
            const gasCost = gasUsed.mul(effectiveGasPrice)

            //Assert
            const ending__FundBal = await fundMe.provider.getBalance(fundMe.address)
            const ending_DeployerBal = await fundMe.provider.getBalance(deployer)
            const e_eth_Fund = ethers.utils.formatEther(ending__FundBal.toString())
            const e_eth_Deploy = ethers.utils.formatEther(ending_DeployerBal.toString())

            assert.equal(ending__FundBal, 0)
            assert.equal(starting_FundBal.add(starting_DeployerBal).toString(),
                ending_DeployerBal.add(gasCost).toString())


            //Make sure that the funders are reset properly  account0=deployer
            await expect(fundMe.getFunder(0)).to.be.reverted

            //other accounts starting with acc1,acc2,acc3,acc4,acc5
            for (let i = 1; i < no_account_to_fund; i++) {

                //function getAddressToAmountFunded(address fundingAddress)
                bal_accx = await fundMe.getAddressToAmountFunded(accounts[i].address)
                assert.equal(bal_accx, 0)
            }



        })

    })
})