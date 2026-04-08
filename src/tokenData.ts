import axios from 'axios';

export interface TokenData {
  symbol: string;
  price: number;
  volume24h: number;
  priceChange24h: number;
  marketCap: number;
}

export async function getTokenData(tokenId: string): Promise<TokenData> {
  const url = `https://api.coingecko.com/api/v3/coins/${tokenId}`;
  const response = await axios.get(url);
  const data = response.data;

  return {
    symbol: data.symbol.toUpperCase(),
    price: data.market_data.current_price.usd,
    volume24h: data.market_data.total_volume.usd,
    priceChange24h: data.market_data.price_change_percentage_24h,
    marketCap: data.market_data.market_cap.usd
  };
}
