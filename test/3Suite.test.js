const {
    BN,
    time,
    expect,
    expectEvent,
    constants,
    expectRevert,
    snapshot,
    ether
} = require("@openzeppelin/test-helpers");

require("chai")
    .use(require("chai-as-promised"))
    .use(require("chai-bn")(BN))
    .should();

const token = artifacts.require("3Suite");

contract("3Suite", function (accounts) {
    before(async function () {
        snapshotA = await snapshot();
        [
            owner,
            user1,
            user2,
            user3,
            ecosystem,
            treasury,
            forLiquidityPool,
            vault,
            vaultLP,
            vesting
        ] = accounts;
        initialSupply = ether("1000000000");
        tokenName = "3Suite Token";
        tokenSymbol = "3Suite";
        decimals = "18";
        amount = ether("100");
        threeSuite = await token.new();
        snapshotB = await snapshot();
    });

    after(async function () {
        await snapshotA.restore();
    });

    describe("3Suite Deploy Phase Test Cases", function () {
        it("should deploy with correct name", async () => {
            (await threeSuite.name()).should.equal(tokenName);
        });

        it("should deploy with correct symbol", async () => {
            (await threeSuite.symbol()).should.equal(tokenSymbol);
        });

        it("should deploy with correct decimals", async () => {
            (await threeSuite.decimals()).should.be.bignumber.equal(decimals);
        });

        it("should deploy with correct total supply", async () => {
            (await threeSuite.totalSupply()).should.be.bignumber.equal(initialSupply);
        });

    });

    describe("ERC20 Phase Test Cases", function () {

        after(async function () {
            await snapshotB.restore();
        });

        it("should transfer tokens correctly", async () => {
            await threeSuite.transferTo(owner, initialSupply);
            (await threeSuite.balanceOf(owner)).should.be.bignumber.equal(initialSupply);
            (await threeSuite.balanceOf(user1)).should.be.bignumber.equal(ether("0"));
            receipt = await threeSuite.transfer(user1, amount, { from: owner });
            (await threeSuite.balanceOf(user1)).should.be.bignumber.equal(amount);
            expectEvent(
                receipt,
                "Transfer",
                {
                    from: owner,
                    to: user1,
                    value: amount
                }
            );
        });

        it("shouldn't transfer tokens to the zero address", async () => {
            await expectRevert(
                threeSuite.transfer(constants.ZERO_ADDRESS, amount, { from: owner }),
                "ERC20: transfer to the zero address"
            );
        });

        it("shouldn't transfer tokens if transfer amount exceed balance", async () => {
            await expectRevert(
                threeSuite.transfer(user2, initialSupply, { from: user1 }),
                "ERC20: transfer amount exceeds balance"
            );
        });

        it("should approve correctly", async () => {
            receipt = await threeSuite.approve(user1, amount);
            (await threeSuite.allowance(owner, user1)).should.be.bignumber.equal(amount);
            expectEvent(
                receipt,
                "Approval",
                { owner: owner, spender: user1, value: amount }
            );
        });

        it("shouldn't approve to the zero address", async () => {
            await expectRevert(
                threeSuite.approve(constants.ZERO_ADDRESS, amount),
                "ERC20: approve to the zero address"
            );
        });

        it("should increase allowance correctly", async () => {
            await threeSuite.approve(user1, amount);
            (await threeSuite.allowance(owner, user1)).should.be.bignumber.equal(amount);
            receipt = await threeSuite.increaseAllowance(user1, amount);
            (await threeSuite.allowance(owner, user1)).should.be.bignumber.equal(ether("200"));
            expectEvent(
                receipt,
                "Approval",
                {
                    owner: owner,
                    spender: user1,
                    value: ether("200")
                }
            );
        });

        it("shouldn't increase allowance for zero address", async () => {
            await expectRevert(
                threeSuite.increaseAllowance(constants.ZERO_ADDRESS, amount),
                "ERC20: approve to the zero address"
            );
        });

        it("should decrease allowance correctly", async () => {
            await threeSuite.approve(user1, amount);
            (await threeSuite.allowance(owner, user1)).should.be.bignumber.equal(amount);
            receipt = await threeSuite.decreaseAllowance(user1, amount);
            (await threeSuite.allowance(owner, user1)).should.be.bignumber.equal(ether("0"));
            expectEvent(
                receipt,
                "Approval",
                {
                    owner: owner,
                    spender: user1,
                    value: ether("0")
                }
            );
        });

        it("shouldn't decrease allowance for zero address", async () => {
            await expectRevert(
                threeSuite.decreaseAllowance(constants.ZERO_ADDRESS, amount),
                "ERC20: decreased allowance below zero"
            );
        });

        it("shouldn't decrease allowance below zero", async () => {
            await expectRevert(
                threeSuite.decreaseAllowance(user1, amount),
                "ERC20: decreased allowance below zero"
            );
        });

        it("should transfer tokens from address correctly", async () => {
            await threeSuite.approve(user1, amount);
            (await threeSuite.balanceOf(user2)).should.be.bignumber.equal(ether("0"));
            receipt = await threeSuite.transferFrom(owner, user2, amount, { from: user1 });
            (await threeSuite.balanceOf(user2)).should.be.bignumber.equal(amount);
            expectEvent(
                receipt,
                "Transfer",
                {
                    from: owner,
                    to: user2,
                    value: amount
                }
            );
        });

        it("shouldn't transfer tokens from address if amount exceed allowance", async () => {
            await expectRevert(
                threeSuite.transferFrom(owner, user2, amount, { from: user1 }),
                "ERC20: insufficient allowance"
            );
        });
    });

    describe("3Suite Phase Test Cases", function () {

        it("should transfer to specified address correctly", async () => {
            contractBalanceBefore = await threeSuite.balanceOf(threeSuite.address);
            expectedBalanceOfContract = contractBalanceBefore.sub(amount);
            await threeSuite.transferTo(owner, amount);
            contractBalanceAfter = await threeSuite.balanceOf(threeSuite.address);
            ownerBalance = await threeSuite.balanceOf(owner);
            contractBalanceAfter.should.be.bignumber.equal(expectedBalanceOfContract);
            ownerBalance.should.be.bignumber.equal(amount);
        });

        it("shouldn't transfer to zero address", async () => {
            await expectRevert(
                threeSuite.transferTo(constants.ZERO_ADDRESS, amount),
                "ERC20: transfer to the zero address"
            );
        });

        it("should transfer to multiple addresses correctly", async () => {
            contractBalanceBefore = await threeSuite.balanceOf(threeSuite.address);
            expectedBalanceOfContract = contractBalanceBefore.sub(ether("300"));
            await threeSuite.transferToBatch([user1, user2, user3], [amount, amount, amount]);
            contractBalanceAfter = await threeSuite.balanceOf(threeSuite.address);
            user1Balance = await threeSuite.balanceOf(user1);
            user2Balance = await threeSuite.balanceOf(user2);
            user3Balance = await threeSuite.balanceOf(user3);
            contractBalanceAfter.should.be.bignumber.equal(expectedBalanceOfContract);
            user1Balance.should.be.bignumber.equal(amount);
            user2Balance.should.be.bignumber.equal(amount);
            user3Balance.should.be.bignumber.equal(amount);
        });

        it("shouldn't transfer to multiple addresses if parameters length mismatch", async () => {
            await expectRevert(
                threeSuite.transferToBatch([user1, user2], [amount, amount, amount]),
                "Parameters length mismatch"
            );
        });

        it("should burn tokens correctly", async () => {
            user1BalanceBefore = await threeSuite.balanceOf(user1);
            receipt = await threeSuite.burn(user1Balance, { from: user1 });
            user1BalanceAfter = await threeSuite.balanceOf(user1);
            user1BalanceAfter.should.be.bignumber.equal("0");
            await expectEvent(
                receipt,
                "Transfer",
                {
                    from: user1,
                    to: constants.ZERO_ADDRESS,
                    value: user1BalanceBefore
                }
            );
        });

        it("should burn token from address correctly", async () => {
            user2BalanceBefore = await threeSuite.balanceOf(user2);
            await threeSuite.approve(user1, user2BalanceBefore, { from: user2 });
            receipt = await threeSuite.burnFrom(user2, user2BalanceBefore, { from: user1 });
            user2BalanceAfter = await threeSuite.balanceOf(user2);
            user2BalanceAfter.should.be.bignumber.equal("0");
            await expectEvent(
                receipt,
                "Transfer",
                {
                    from: user2,
                    to: constants.ZERO_ADDRESS,
                    value: user2BalanceBefore
                }
            );
        });

        it("shouldn't burn token from address if amount exceed allowance", async () => {
            await expectRevert(
                threeSuite.burnFrom(user3, amount, { from: user2 }),
                "ERC20: burn amount exceeds allowance"
            );
        });
    });
});