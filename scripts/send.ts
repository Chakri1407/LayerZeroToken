import { EndpointId } from '@layerzerolabs/lz-definitions'

async function sendTokens() {
    const hre = require('hardhat')
    
    const contractName = 'LayerZeroToken'
    const LayerZeroToken = await hre.ethers.getContractFactory(contractName)
    
    const deployments = await hre.deployments.all()
    const layerZeroTokenDeployment = deployments[contractName]
    
    if (!layerZeroTokenDeployment) {
        throw new Error(`${contractName} deployment not found`)
    }
    
    console.log(`Found ${contractName} at address: ${layerZeroTokenDeployment.address}`)
    
    const layerZeroToken = LayerZeroToken.attach(layerZeroTokenDeployment.address)
    
    // Get the deployer account
    const [deployer] = await hre.ethers.getSigners()
    
    // Destination endpoint ID (Amoy)
    const dstEid = EndpointId.AMOY_V2_TESTNET
    
    // Amount to send (100 tokens with 18 decimals)
    const amountToSend = hre.ethers.utils.parseEther('100')
    
    // Recipient address (same as sender for this example)
    const recipient = deployer.address
    
    console.log(`Network: ${hre.network.name}`)
    console.log(`Deployer: ${deployer.address}`)
    console.log(`Sending ${hre.ethers.utils.formatEther(amountToSend)} tokens from ${hre.network.name} to Amoy`)
    console.log(`Destination EID: ${dstEid}`)
    
    // Check current balance
    const balance = await layerZeroToken.balanceOf(deployer.address)
    console.log(`Current balance: ${hre.ethers.utils.formatEther(balance)} LZT`)
    
    if (balance.lt(amountToSend)) {
        throw new Error('Insufficient balance for transfer')
    }
    
    // Prepare send parameters
    const sendParam = {
        dstEid: dstEid,
        to: hre.ethers.utils.hexZeroPad(recipient, 32), // Convert address to bytes32
        amountLD: amountToSend,
        minAmountLD: amountToSend.mul(95).div(100), // 5% slippage tolerance
        extraOptions: '0x', // No extra options
        composeMsg: '0x', // No compose message
        oftCmd: '0x' // No OFT command
    }
    
    // Get quote for the transaction
    console.log('Getting quote for cross-chain transfer...')
    const quote = await layerZeroToken.quoteSend(sendParam, false)
    console.log(`Native fee required: ${hre.ethers.utils.formatEther(quote.nativeFee)} ETH`)
    
    // Send the tokens
    console.log('Initiating cross-chain transfer...')
    const tx = await layerZeroToken.send(
        sendParam,
        quote,
        deployer.address, // refund address
        {
            value: quote.nativeFee, // Pay the LayerZero fee
            gasLimit: 500000 // Set gas limit
        }
    )
    
    console.log(`Transaction submitted: ${tx.hash}`)
    console.log('Waiting for confirmation...')
    
    const receipt = await tx.wait()
    console.log(`Transaction confirmed in block: ${receipt.blockNumber}`)
    console.log(`Gas used: ${receipt.gasUsed}`)
    console.log('Cross-chain transfer initiated successfully!')
    
    console.log('\n=== TRACK YOUR TRANSFER ===')
    console.log(`LayerZero Scan: https://layerzeroscan.com/tx/${tx.hash}`)
    console.log(`Holesky Explorer: https://holesky.etherscan.io/tx/${tx.hash}`)
    
    console.log('\nThe tokens will appear on Amoy after LayerZero processes the message.')
    console.log('This usually takes 2-5 minutes.')
}

sendTokens()
    .then(() => process.exit(0))
    .catch((error: any) => {
        console.error('Error:', error)
        process.exit(1)
    }) 