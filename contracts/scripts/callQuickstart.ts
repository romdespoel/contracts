import {Contract, ethers, Wallet} from "ethers";
import ABI from "./ChatGpt.json";
import * as readline from 'readline';

require("dotenv").config()

async function main() {
const rpcUrl = "https://devnet.galadriel.com"
if (!rpcUrl) throw Error("Missing RPC_URL in .env")
const privateKey = process.env.PRIVATE_KEY_GALADRIEL
if (!privateKey) throw Error("Missing PRIVATE_KEY in .env")
const contractAddress = "0x31dFb03362Bac5933f4f750fa502a13d63844910"
if (!contractAddress) throw Error("Missing SIMPLE_LLM_CONTRACT_ADDRESS in .env")

const providers = new ethers.JsonRpcProvider(rpcUrl)
const wallets = new Wallet(
  privateKey, providers
)
const contracts = new Contract(contractAddress, ABI, wallets)

// The message you want to start the chat with
const message = await getUserInput()

// Call the sendMessage function
const transactionResponse = await contracts.startChat(message)
const receipt = await transactionResponse.wait()
console.log(`Message sent, tx hash: ${receipt.hash}`)
console.log(`Chat started with message: "${message}"`)

const repl = require('repl');

// Start the REPL
repl.start({
  prompt: 'Enter command > '
});
  // Read the LLM response on-chain
  while (true) {
    const response = await contracts.chatRuns();
    if (response) {
      console.log("Response from contract:", response);
      break;
    }
    await new Promise(resolve => setTimeout(resolve, 2000))
  }
}

async function getUserInput(): Promise<string | undefined> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  const question = (query: string): Promise<string> => {
    return new Promise((resolve) => {
      rl.question(query, (answer) => {
        resolve(answer)
      })
    })
  }

  try {
    const input = await question("Message ChatGPT: ")
    rl.close()
    return input
  } catch (err) {
    console.error('Error getting user input:', err)
    rl.close()
  }
}


main()
  .then(() => console.log("Done"))