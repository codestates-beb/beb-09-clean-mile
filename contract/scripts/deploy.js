async function main() {
  const [deployer] = await ethers.getSigners();
  console.log('Deploying contracts with the account:', deployer.address);

  const Greeting = await ethers.getContractFactory('Greeting');

  const deployed = await Greeting.deploy();

  console.log('Deployed contract address:', deployed.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
