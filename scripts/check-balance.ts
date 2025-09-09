async function checkBalance() {
    const hre = require('hardhat')
    
    const contractName = 'LayerZeroToken'
    const LayerZeroToken = await hre.ethers.getContractFactory(contractName)
    
    const deployments = await hre.deployments.all()
    const layerZeroTokenDeployment = deployments[contractName]
    
    if (!layerZeroTokenDeployment) {
        throw new Error(`${contractName} deployment not found`)
    }
    
    const layerZeroToken = LayerZeroToken.attach(layerZeroTokenDeployment.address)
    const [deployer] = await hre.ethers.getSigners()
    
    console.log(`=== BALANCE CHECK FOR ${hre.network.name.toUpperCase()} ===`)
    console.log(`Contract: ${layerZeroToken.address}`)
    console.log(`Address: ${deployer.address}`)
    
    const balance = await layerZeroToken.balanceOf(deployer.address)
    const totalSupply = await layerZeroToken.totalSupply()
    
    console.log(`Balance: ${hre.ethers.utils.formatEther(balance)} LZT`)
    console.log(`Total Supply: ${hre.ethers.utils.formatEther(totalSupply)} LZT`)
    
    if (hre.network.name === 'amoy' && balance.gt(0)) {
        console.log('\nCross-chain transfer successful!')
        console.log('Tokens have arrived on Amoy!')
    } else if (hre.network.name === 'amoy' && balance.eq(0)) {
        console.log('\nNo tokens yet on Amoy.')
        console.log('If you just sent them, wait 2-5 minutes and check again.')
        console.log('LayerZero is still processing the cross-chain message.')
    }
}

checkBalance()
    .then(() => process.exit(0))
    .catch((error: any) => {
        console.error('Error:', error)
        process.exit(1)
    }) 