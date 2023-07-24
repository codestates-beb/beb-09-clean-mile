async function main() {
      const [deployer] = await ethers.getSigners();
      console.log('Deploying contracts with the account:', deployer.address);
    
      // Step 1: Import necessary modules and contracts
      const Badge = await ethers.getContractFactory("BadgeContract");
      const DNFT = await ethers.getContractFactory("DNFT");
      const Token  = await ethers.getContractFactory("TokenContract");
    
      // Step 2: Fetch contract source code
      const dnftContract = await DNFT.deploy("","");
      const badgeContract = await Badge.deploy("");
      const tokenContract = await Token.deploy("ECO Token", "EM");
    
      console.log("DNFT contract address:",dnftContract.target);
      console.log("badge contract address:",badgeContract.target);
      console.log("token contract address:",tokenContract.target);
    }
    // Execute the deploy function
    main()
      .then(() => process.exit(0))
      .catch((error) => {
        console.error(error);
        process.exit(1);
      });
