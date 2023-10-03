/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable prettier/prettier */
const fs = require('fs')
const path = require('path')

const ethers = require('ethers')

const addTokenAddress = () => {
    // get data folder
    const dataFolderPath = path.join(__dirname, '..', 'data')

    //getting subfolders from data folder
    const subfolders = fs.readdirSync(dataFolderPath)

    for (const subfolder of subfolders) {
        //join data folder and subfolder
        const subfolderPath = path.join(dataFolderPath, subfolder)

        try {
            // get the data.json file from the path
            const dataFilePath = path.join(subfolderPath, 'data.json')

            // read the data from there
            const data = fs.readFileSync(dataFilePath, 'utf-8')

            // parsing json to modify
            const jsonData = JSON.parse(data)

            // here manipulate the address that you want
            jsonData.tokens.mode = {
                address: '0x997cf63ab30BA8e591203228d5c5468Fc3834166',
            }

            //  writing the data
            //fs.writeFileSync(dataFilePath, JSON.stringify(jsonData, null, 2))
        } catch (error) {
            console.error(`Error reading data from ${subfolder}:`, error)
        }
    }

}


const deploy_v1 = async () => {
    const fname = "node_modules/@eth-optimism/contracts-bedrock/artifacts/contracts/universal/OptimismMintableERC20Factory.sol/OptimismMintableERC20Factory.json"
    const ftext = fs.readFileSync(fname).toString().replace(/\n/g, "")

    const optimismMintableERC20FactoryData = JSON.parse(ftext)

    const provider = new ethers.providers.JsonRpcProvider("provider_url_here");

    const signer = new ethers.Wallet("private_key", provider);

    console.log(signer, "signer")

    const optimismMintableERC20Factory = new ethers.Contract(
        "0x4200000000000000000000000000000000000012",
        optimismMintableERC20FactoryData.abi,
        signer
    )

    console.log(optimismMintableERC20Factory, "optimismMintableERC20Factory")

    // const txParams = { gasLimit: "5000000", maxPriorityFeePerGas: "2000000000", maxFeePerGas: "4000000000" }
    // const l1TokenAddress = "0xda9d4f9b69ac6C22e444eD9aF0CfC043b7a7f53f"
    // const tokenName = "USD Coin"
    // const tokenSymbol = "USDC"

    // const deployTx = await optimismMintableERC20Factory.createOptimismMintableERC20(l1TokenAddress, tokenName, tokenSymbol, txParams)
    // const deployRcpt = await deployTx.wait()
    // const deployEvent = deployRcpt.events.filter(x => x.event === "OptimismMintableERC20Created")[0]
    // const l2Addr = deployEvent.args.localToken

    // console.log(l2Addr, "l2address")


    // await optimismMintableERC20Factory.createOptimismMintableERC20(l1TokenAddress, tokenName, tokenSymbol, txParams)
}

addTokenAddress()
deploy_v1()