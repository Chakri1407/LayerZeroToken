async function mintTokens() {
    const hre = require('hardhat')
    
    // Use the LayerZeroToken contract
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
    
    // Amount to mint (1000 tokens with 18 decimals)
    const amount = hre.ethers.utils.parseEther('1000')
    
    console.log(`Network: ${hre.network.name}`)
    console.log(`Deployer: ${deployer.address}`)
    console.log(`Minting ${hre.ethers.utils.formatEther(amount)} tokens...`)
    
    // Mint tokens using the mint function
    const tx = await layerZeroToken.mint(deployer.address, amount)
    console.log(`Transaction submitted: ${tx.hash}`)
    
    // Wait for confirmation
    const receipt = await tx.wait()
    console.log(`Transaction confirmed in block: ${receipt.blockNumber}`)
    console.log('Tokens minted successfully!')
    
    // Check balance
    const balance = await layerZeroToken.balanceOf(deployer.address)
    console.log(`New balance: ${hre.ethers.utils.formatEther(balance)} LZT`)
    
    // Check total supply
    const totalSupply = await layerZeroToken.totalSupply()
    console.log(`Total supply: ${hre.ethers.utils.formatEther(totalSupply)} LZT`)
}

mintTokens()
    .then(() => process.exit(0))
    .catch((error: any) => {
        console.error('Error:', error)
        process.exit(1)
    }) 