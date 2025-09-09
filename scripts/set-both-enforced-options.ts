import { EndpointId } from '@layerzerolabs/lz-definitions'

async function setBothEnforcedOptions() {
    const hre = require('hardhat')
    
    const contractName = 'LayerZeroToken'
    const LayerZeroToken = await hre.ethers.getContractFactory(contractName)
    
    const deployments = await hre.deployments.all()
    const layerZeroTokenDeployment = deployments[contractName]
    
    const layerZeroToken = LayerZeroToken.attach(layerZeroTokenDeployment.address)
    const [deployer] = await hre.ethers.getSigners()
    
    console.log(`Network: ${hre.network.name}`)
    console.log(`Contract: ${layerZeroToken.address}`)
    
    let dstEid: number
    let networkName: string
    
    if (hre.network.name === 'holesky') {
        dstEid = EndpointId.AMOY_V2_TESTNET
        networkName = 'Amoy'
    } else if (hre.network.name === 'amoy') {
        dstEid = EndpointId.HOLESKY_V2_TESTNET
        networkName = 'Holesky'
    } else {
        throw new Error(`Unsupported network: ${hre.network.name}`)
    }
    
    // Standard enforced options for OFT with 200k gas
    const enforcedOptionsBytes = '0x00030100110100000000000000000000000000030d40'
    
    const enforcedOptions = [
        {
            eid: dstEid,
            msgType: 1, // SEND message type
            options: enforcedOptionsBytes
        }
    ]
    
    try {
        console.log(`Setting enforced options for ${networkName} (EID ${dstEid})...`)
        
        const tx = await layerZeroToken.setEnforcedOptions(enforcedOptions)
        console.log(`Transaction: ${tx.hash}`)
        
        await tx.wait()
        console.log(`Enforced options set successfully for ${networkName}!`)
        
        // Verify the options were set
        try {
            const setOptions = await layerZeroToken.enforcedOptions(dstEid, 1)
            console.log(`Verified enforced options: ${setOptions}`)
        } catch (verifyErr: any) {
            console.log('Could not verify options, but setting transaction was successful')
        }
        
    } catch (err: any) {
        console.log(`Error: ${err.message}`)
    }
}

setBothEnforcedOptions()
    .then(() => process.exit(0))
    .catch((error: any) => {
        console.error('Error:', error)
        process.exit(1)
    }) 