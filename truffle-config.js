const path = require("path")
const HDWalletProvider = require("@truffle/hdwallet-provider")
const mnemonic = process.env.CRYPTO_EARTH_MNEMONIC
const infuraProjectID = process.env.INFURA_PROJECT_ID

module.exports = {
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      port: 7545,
      network_id: 5777,
    },
    ropsten: {
      provider: function () {
        return new HDWalletProvider(
          mnemonic,
          `https://ropsten.infura.io/v3/${infuraProjectID}`
        )
      },
      network_id: "3",
    },
    live: {
      provider: function () {
        return new HDWalletProvider(
          mnemonic,
          `https://mainnet.infura.io/v3/${infuraProjectID}`
        )
      },
      network_id: 1,
      gasPrice: 100000000000,
    },
  },
}
