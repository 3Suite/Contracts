const USD = artifacts.require("USD");

const {
    ether
} = require("@openzeppelin/test-helpers");

/**
 * 0x0275180B3842259f8194a72b0E0C2b5Cd9C77441
 */

module.exports = async function (deployer) {
    const totalSupply = ether("1000000000");
    await deployer.deploy(
        USD,
        totalSupply
    );
};