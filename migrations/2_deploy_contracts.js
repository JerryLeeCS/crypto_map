const MyStringStore = artifacts.require("../contracts/MyStringStore.sol")
const HexGridStore = artifacts.require("../contracts/HexGridStore.sol")

module.exports = function (deployer) {
  deployer.deploy(MyStringStore)
  deployer.deploy(HexGridStore)
}
