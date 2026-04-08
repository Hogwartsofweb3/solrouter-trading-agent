import { runAgent } from './agent.js';

const tokenId = process.argv[2] || 'solana';

console.log('\nSolRouter Private Trading Agent');
console.log('================================');
console.log('Strategy queries are encrypted before leaving your device.');
console.log('Your edge never hits a public server in plaintext.\n');

runAgent(tokenId).catch(console.error);
