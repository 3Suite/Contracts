const token = artifacts.require("3Suite");

/**
 * 0x105565c1e558ac7d5865573f0fa4778d58e04a69
 */
module.exports = async function (deployer) {
    await deployer.deploy(token);
};