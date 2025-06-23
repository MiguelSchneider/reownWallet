# 🦊 Reown Wallet Interface

This is a React-based demo dApp interface integrating the [Reown AppKit](https://reown.com/) SDK. It allows users to connect their Web3 wallet, view their native and USDC balances across multiple networks, and switch chains seamlessly.

---

## ✨ Features

- 🔐 Connect wallets via Reown AppKit
- 🌐 Multi-chain support: Ethereum Mainnet, Arbitrum, Polygon, Optimism
- 💰 Display native token balance
- 🪙 Display USDC ERC-20 token balance on each network
- 🔁 Switch between supported networks dynamically
- 🔍 Fully reactive to network and wallet changes

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- npm or yarn

### Installation

```bash
git clone https://github.com/miguelschneider/reown-wallet.git
cd reown-wallet
npm install
# or
yarn install
```

### Run the Dev Server

```bash
npm run dev
# or
yarn dev
```

---

## ⚙️ Configuration

The dApp uses the `@reown/appkit` and `wagmi` libraries to provide wallet and network functionality.

### Networks

The app is preconfigured to support:

- Ethereum Mainnet (Chain ID: 1)
- Arbitrum One (42161)
- Polygon (137)
- Optimism (10)

You can customize supported networks in:

```js
const networks = [mainnet, arbitrum, polygon, optimism];
```

### USDC Contracts

The USDC balance is fetched via `useReadContracts`, mapped per network:

```js
const usdcAddresses = {
  1:    '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',   // Ethereum
  137:  '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',   // Polygon
  42161:'0xaf88d065e77c8cC2239327C5EDb3A432268e5831',   // Arbitrum
  10:   '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85'    // Optimism
}
```

---

## 📂 Project Structure

```
src/
├── App.jsx         # Main UI logic and AppKit integration
├── components/     # Optional: for modular UI (not used yet)
├── index.html      # Root HTML entry
```

---

## 🔐 Reown AppKit Configuration

The Reown AppKit modal is configured using:

```js
createAppKit({
  adapters: [wagmiAdapter],
  projectId: 'YOUR_PROJECT_ID',
  metadata: {
    name: 'AppKit',
    description: 'AppKit Example',
    url: 'https://example.com',
    icons: [...]
  }
});
```

Replace `projectId` and metadata with your own values from the Reown Cloud dashboard.

---

## 🧪 Example UI

- Connect wallet with `<appkit-button />`
- View:
  - Address
  - Native balance
  - USDC token balance
- Switch networks
- Disconnect easily

Also, a direct control of wallet component is being provided:


 ```jsx
<p>Modal is {isModalOpen ? 'open' : 'closed'}</p>
{isConnected ? (
    <div>
        <button onClick={() => disconnect()}>Disconnect Wallet</button>
    </div>
) : (
    <button onClick={open}>Connect Wallet</button>    
)}
```

---

## 📜 License

This project is open source and available under the MIT License.