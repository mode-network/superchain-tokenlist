/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: '0.8.19',
  'mode-sepolia': {
    chainId: 919,
    url: process.env.L2_RPC,
    accounts: [privateKey],
    gasPrice: 2000000000,
    gasLimit: 5000000,
    maxPriorityFeePerGas: 2000000000,
    maxFeePerGas: 4000000000,
  },
}
