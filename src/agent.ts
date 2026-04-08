import { getTokenData } from './tokenData.js';
import { runPrivateAnalysis } from './privateQuery.js';

export async function runAgent(tokenId: string): Promise<void> {
  console.log(`\nFetching token data for: ${tokenId}`);
  console.log('----------------------------------------');

  const tokenData = await getTokenData(tokenId);

  console.log(`Symbol:     ${tokenData.symbol}`);
  console.log(`Price:      $${tokenData.price.toFixed(4)}`);
  console.log(`24h Volume: $${(tokenData.volume24h / 1_000_000).toFixed(2)}M`);
  console.log(`24h Change: ${tokenData.priceChange24h.toFixed(2)}%`);
  console.log('----------------------------------------\n');

  const analysis = await runPrivateAnalysis(
    tokenData.symbol,
    tokenData.price,
    tokenData.volume24h,
    tokenData.priceChange24h
  );

  console.log('ENCRYPTED ANALYSIS RESULT:');
  console.log('----------------------------------------');
  console.log(analysis);
  console.log('----------------------------------------\n');
}
