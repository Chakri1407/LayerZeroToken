import { EndpointId } from '@layerzerolabs/lz-definitions'

async function configurePeers() {
    const hre = require('hardhat')
    
    const contractName = 'LayerZeroToken'
    const LayerZeroToken = await hre.ethers.getContractFactory(contractName)
    
    // Get deployed contract address
    const deployments = await hre.deployments.all()
    const layerZeroTokenDeployment = deployments[contractName]
    
    if (!layerZeroTokenDeployment) {
        throw new Error(`${contractName} deployment not found`)
    }
    
    const layerZeroToken = LayerZeroToken.attach(layerZeroTokenDeployment.address)
    const [deployer] = await hre.ethers.getSigners()
    
    console.log(`Network: ${hre.network.name}`)
    console.log(`Contract: ${layerZeroToken.address}`)
    console.log(`Deployer: ${deployer.address}`)
    
    // Configure peers based on current network
    if (hre.network.name === 'holesky') {
        // Set Amoy as peer for Holesky contract
        const amoyEid = EndpointId.AMOY_V2_TESTNET
        
        // Amoy contract address
        const amoyContractAddress = "0x4301f0EB12a33B9108648845A770d4149e045450"
        
        console.log(`Setting peer: Amoy EID ${amoyEid}`)
        
        // Convert address to bytes32
        const peerAddress = hre.ethers.utils.hexZeroPad(amoyContractAddress, 32)
        
        const tx = await layerZeroToken.setPeer(amoyEid, peerAddress)
        console.log(`Transaction: ${tx.hash}`)
        
        await tx.wait()
        console.log('Peer set successfully!')
        
    } else if (hre.network.name === 'amoy') {
        // Set Holesky as peer for Amoy contract
        const holeskyEid = EndpointId.HOLESKY_V2_TESTNET
        
        // Holesky contract address
        const holeskyContractAddress = "0x30333A70F7F110874b50c149e09f8721A7F22637"
        
        console.log(`Setting peer: Holesky EID ${holeskyEid}`)
        
        // Convert address to bytes32
        const peerAddress = hre.ethers.utils.hexZeroPad(holeskyContractAddress, 32)
        
        const tx = await layerZeroToken.setPeer(holeskyEid, peerAddress)
        console.log(`Transaction: ${tx.hash}`)
        
        await tx.wait()
        console.log('Peer set successfully!')
    }
}

configurePeers()
    .then(() => process.exit(0))
    .catch((error: any) => {
        console.error('Error:', error)
        process.exit(1)
    }) 