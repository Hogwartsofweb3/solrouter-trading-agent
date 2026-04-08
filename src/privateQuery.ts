import * as dotenv from 'dotenv';
dotenv.config();

import { SolRouter } from '@solrouter/sdk';

const client = new SolRouter({
  apiKey: process.env.SOLROUTER_API_KEY!
});

export async function runPrivateAnalysis(
  symbol: string,
  price: number,
  volume24h: number,
  priceChange24h: number
): Promise<string> {

  const prompt = `
    You are a DeFi trading risk analyst.

    Token: ${symbol}
    Current Price: $${price.toFixed(4)}
    24h Volume: $${(volume24h / 1_000_000).toFixed(2)}M
    24h Price Change: ${priceChange24h.toFixed(2)}%

    Provide a concise risk assessment for a short-term position.
    Cover: volatility risk, liquidity risk, momentum signal.
    Keep response under 150 words.
  `;

  console.log('Sending encrypted query to SolRouter...');
  console.log('Prompt is encrypted before leaving your device.\n');

  // client.chat() is the documented SDK method — E2E encrypted via Arcium RescueCipher
  const response = await client.chat(prompt);

  return response.message;
}
