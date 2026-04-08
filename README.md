# solrouter-trading-agent

A TypeScript CLI agent that fetches live token data and sends strategy analysis queries through SolRouter's encrypted inference. The query never reaches a public LLM in plaintext.

---

## The Problem

When you send a trading prompt to a standard LLM API — OpenAI, Anthropic, wherever — that prompt travels in plaintext to a server you don't control. The logs exist. The request is visible. For a generic question this rarely matters. For a trading strategy query, it does.

If your prompt includes a specific token address, a position size, or a time window you're watching, that's information with real monetary value. Public inference providers can log it, third parties can intercept it, and anyone with access to those logs can act on it before you do.

This isn't a theoretical risk. It's the same front-running problem that exists on-chain, applied to the AI layer.

---

## What This Does

- Accepts a token name as a CLI argument (`solana`, `bitcoin`, `ethereum`, or any CoinGecko coin ID)
- Fetches the token's current price, 24h volume, and price change from the CoinGecko public API
- Constructs a structured risk analysis prompt as a DeFi quant would phrase it
- Encrypts the prompt locally using Arcium RescueCipher (X25519 key exchange) before it leaves the machine
- Sends the encrypted payload to SolRouter's inference endpoint
- Decrypts and prints the risk assessment in the terminal

The on-chain data fetch is public and unencrypted — that's fine. Price data is already public. What stays private is the *strategy query* — what you're asking the model to do with that data.

---

## Why Private Inference Makes Sense Here

Standard encryption protects data in transit (TLS) and at rest. It doesn't protect the query once it reaches the server. The server decrypts it, processes it, and the plaintext prompt is briefly visible to the inference infrastructure.

SolRouter uses a Trusted Execution Environment (TEE) — a hardware-isolated compute enclave — to process the query. The model runs inside the enclave. Even the infrastructure operator can't read the prompt. What gets logged (if anything) is a ciphertext, not your strategy.

For trading specifically: the combination of a token address, a time window, and a "what's my entry?" prompt is enough to front-run a retail position. Encrypting at the query level closes that vector.

---

## Setup

**Prerequisites**
- Node.js 18 or higher
- npm
- A SolRouter API key — get one at [solrouter.com](https://solrouter.com) (no email, no KYC, connect wallet)

**Installation**

```bash
git clone https://github.com/YOURUSERNAME/solrouter-trading-agent.git
cd solrouter-trading-agent
npm install
```

**Configuration**

Copy the example env file and add your key:

```bash
cp .env.example .env
```

Open `.env` and replace the placeholder:

```
SOLROUTER_API_KEY=sk_solrouter_your_key_here
```

**Running the agent**

```bash
# Solana
npm start -- solana

# Bitcoin
npm start -- bitcoin

# Ethereum
npm start -- ethereum

# Any CoinGecko coin ID
npm start -- dogecoin
```

---

## Demo

*[Screenshot placeholder — terminal output showing SOL fetch + encrypted analysis]*

*[Video link — add your Loom or YouTube URL here]*

---

## Architecture

```
User Input (token name)
        │
        ▼
tokenData.ts  ──── CoinGecko API ────▶  price, volume, 24h change
        │
        ▼
agent.ts  ──── formats prompt with token metrics
        │
        ▼
privateQuery.ts  ──── encrypts via Arcium X25519
        │
        ▼
SolRouter TEE  ──── model runs inside hardware enclave
        │
        ▼
Response  ──── decrypted locally, printed to terminal
```

The LLM never sees the plaintext prompt outside the enclave. The CoinGecko request is public — price data is already on-chain and unauthenticated. Only the inference query is private.

---

## Project Structure

```
src/
  index.ts        — entry point, reads CLI args
  agent.ts        — orchestrates fetch and analysis
  tokenData.ts    — CoinGecko data fetch
  privateQuery.ts — SolRouter encrypted inference
.env.example      — environment variable template
```

---

## Tech

- [@solrouter/sdk](https://npmjs.com/package/@solrouter/sdk) — encrypted inference
- [axios](https://npmjs.com/package/axios) — HTTP client
- [tsx](https://npmjs.com/package/tsx) — TypeScript execution
- [CoinGecko API](https://www.coingecko.com/api/documentation) — market data

---

## License

MIT
