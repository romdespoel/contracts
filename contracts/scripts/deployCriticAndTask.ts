import {ethers} from "hardhat";


async function main() {
  if (!process.env.ORACLE_ADDRESS) {
    throw new Error("ORACLE_ADDRESS env variable is not set.");
  }
  const oracleAddress: string = process.env.ORACLE_ADDRESS;
  await deployAgents(oracleAddress);
}


async function deployAgents(oracleAddress: string) {
  const critic = await ethers.deployContract("ChatGptCritic", [oracleAddress, ""], {});
  await critic.waitForDeployment();
  console.log(`Critic contract deployed to ${critic.target}`);

  const agent = await ethers.deployContract("ChatGptTask", [oracleAddress, ""], {});
  await agent.waitForDeployment();
  console.log(`Task contract deployed to ${agent.target}`);



}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
