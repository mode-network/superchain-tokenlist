/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs')
const path = require('path')

const ethers = require('ethers')

// here the address is the address that we want to add in the tokenlist objects
const masterTokenList = ['AAVE', 'DAI']

const private_key = 'private_key_here'

const addTokenAddress = async (masterTokens, targetChain) => {
  // get data folder
  const dataFolderPath = path.join(__dirname, '..', 'data')

  //getting subfolders from data folder
  const subfolders = fs.readdirSync(dataFolderPath)

  for (const subfolder of subfolders) {
    if (!masterTokens.includes(subfolder)) {
      continue
    }

    const subfolderPath = path.join(dataFolderPath, subfolder)

    try {
      // get the data.json file from the path
      const dataFilePath = path.join(subfolderPath, 'data.json')

      // read the data from there
      const data = fs.readFileSync(dataFilePath, 'utf-8')

      // parsing json to modify
      const jsonData = JSON.parse(data)

      // here we need name, symbol, decimals, tokens.ethereum.address

      const {
        name,
        symbol,
        decimals,
        tokens: {
          ethereum: { address },
        },
      } = jsonData

      if (jsonData.tokens[targetChain]) {
        continue
      }

      const l2Address = await deploy_v1(name, symbol, address, decimals)

      console.log(l2Address, 'l2Address')

      // here manipulate the address that you want

      jsonData.tokens[targetChain] = {
        address: l2Address,
      }

      //  writing the data
      fs.writeFileSync(dataFilePath, JSON.stringify(jsonData, null, 2))
    } catch (error) {
      console.error(`Error reading data from ${subfolder}:`, error)
    }
  }
}

const deploy_v1 = async (name, symbol, l1Address, decimals) => {
  console.log(name, 'name')

  const fname =
    'node_modules/@eth-optimism/contracts-bedrock/artifacts/contracts/universal/OptimismMintableERC20Factory.sol/OptimismMintableERC20Factory.json'
  const ftext = fs.readFileSync(fname).toString().replace(/\n/g, '')

  const optimismMintableERC20FactoryData = JSON.parse(ftext)

  const provider = new ethers.providers.JsonRpcProvider(
    'https://sepolia.mode.network'
  ) //l2 bridge address

  const signer = new ethers.Wallet(private_key, provider)

  try {
    if (decimals === 18) {
      const optimismMintableERC20Factory = new ethers.Contract(
        '0x4200000000000000000000000000000000000012',
        optimismMintableERC20FactoryData.abi,
        signer
      )

      const txParams = {
        gasLimit: '5000000',
        maxPriorityFeePerGas: '2000000000',
        maxFeePerGas: '4000000000',
      }

      const deployTx =
        await optimismMintableERC20Factory.createOptimismMintableERC20(
          l1Address,
          name,
          symbol,
          txParams
        )
      const deployRcpt = await deployTx.wait()
      const deployEvent = deployRcpt.events.filter(
        (x) => x.event === 'OptimismMintableERC20Created'
      )[0]
      const l2Address = deployEvent.args.localToken

      return l2Address
    } else {
      //console.log(symbol)
    }
  } catch (error) {
    console.log(error, 'error')
  }
}

addTokenAddress(masterTokenList, 'mode')
