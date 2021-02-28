const HexGridStore = artifacts.require("../contracts/HexGridStore.sol")

module.exports = function (deployer) {
  deployer.deploy(HexGridStore)
}
