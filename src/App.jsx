import React, { useEffect, useState } from 'react'

import { createAppKit } from '@reown/appkit/react'

import { useDisconnect, WagmiProvider } from 'wagmi'
import { arbitrum, mainnet, optimism, polygon } from '@reown/appkit/networks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { useAppKitAccount } from "@reown/appkit/react";
import { useAppKitNetwork } from "@reown/appkit/react";
import { useAppKitBalance } from "@reown/appkit/react";
import { useAppKitState } from "@reown/appkit/react";
import { useAppKit } from "@reown/appkit/react";

import { useAccount, useReadContracts } from 'wagmi';
import { formatUnits } from 'viem';

import BUIDLPurchase from "./BUIDLPurchase";


// 0. Setup queryClient
const queryClient = new QueryClient()

// 1. Get projectId from https://cloud.reown.com
const projectId = '9d05d4b1b35fad1c007771dc63f9911d'

// 2. Create a metadata object - optional
const metadata = {
  name: 'AppKit',
  description: 'AppKit Example',
  url: 'https://example.com', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/179229932']
}

// 3. Set the networks
// const networks = [mainnet, arbitrum, polygon, optimism]
const networks = [mainnet]

// 4. Create Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: false, // Set to true if you want to use SSR
})

// 5. Create modal
createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  enableWalletGuide: false,
  features: {
    analytics: true,
    onramp: false,
    swaps: false,
    email: false,
    socials: [],
  }
})

export function AppKitProvider({ children }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}

function NativeBalanceDisplay() {
  const { fetchBalance } = useAppKitBalance();
  const [balance, setBalance] = useState();
  const { isConnected } = useAppKitAccount();

  useEffect(() => {
    if (isConnected) {
      fetchBalance().then(setBalance);
    }
  }, [isConnected, fetchBalance]);

  return (
    <div>
      {balance && (
        <p>Balance: {balance.data?.balance} {balance.data?.symbol}</p>
      )}
    </div>
  );
}

const erc20Contract = {
  abi: [
    {
      constant: true,
      inputs: [{ name: 'account', type: 'address' }],
      name: 'balanceOf',
      outputs: [{ name: '', type: 'uint256' }],
      type: 'function',
      stateMutability: 'view',
    },
    {
      constant: true,
      inputs: [],
      name: 'decimals',
      outputs: [{ name: '', type: 'uint8' }],
      stateMutability: 'view',
      type: 'function'
    }
  ],
};

const usdcAddresses = {
  1: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',       // Ethereum Mainnet
  137: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',     // Polygon
  42161: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',   // Arbitrum
  10: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85'       //Optimism 
};

function USDCBalance() {
  const { address } = useAccount();
  const { chainId } = useAppKitNetwork();

  const results = useReadContracts({
    contracts: [
      {
        address: chainId ? usdcAddresses[chainId] : undefined,
        abi: erc20Contract.abi,
        functionName: 'balanceOf',
        args: [address],
        chainId,
      },
      {
        address: chainId ? usdcAddresses[chainId] : undefined,
        abi: erc20Contract.abi,
        functionName: 'decimals',
        chainId,
      }
    ],
    query: {
      enabled: !!address && !!chainId && !!usdcAddresses[chainId],
    },
  });

  const balanceResult = results.data?.[0]?.result;
  const decimals = results.data?.[1]?.result;

  console.log('Chain ID:', chainId);
  console.log('Network Balance Result:', results.data);
  console.log('USDC Balance Result:', balanceResult);
  console.log('USDC Decimals:', decimals);
  const formatted = balanceResult && decimals
    ? formatUnits(balanceResult, decimals)
    : null;

  return <div>{formatted && <p>USDC Balance: {formatted}</p>}</div>;
}


export default function App() {
  const { address, isConnected, caipAddress, status, embeddedWalletInfo } = useAppKitAccount();
  const { caipNetwork, caipNetworkId, chainId, switchNetwork } = useAppKitNetwork()
  const { initialized, open: isModalOpen, loading, selectedNetworkId, activeChain } = useAppKitState();
  const { open, close } = useAppKit();
  const { disconnect } = useDisconnect();

  return (
    <>

      {/* <appkit-button size='sm' balance='hide' /> */}
      <BUIDLPurchase />
      {/* 
      {isConnected && (
        <>
          <p>Address: {address}</p>
          <p>CAIP Address: {caipAddress}</p>
          <p>Status: {status}</p>
          <p>ChainID: {chainId}</p>
          <p>CAIP Network ID: {caipNetworkId}</p>
          <NativeBalanceDisplay />
          <USDCBalance />
          <p>Selected Network ID: {selectedNetworkId}</p>
          <p>Active Chain: {activeChain}</p>
          <button onClick={() => switchNetwork(mainnet)}> Switch to Ethereum Mainnet </button>
          <button onClick={() => switchNetwork(arbitrum)}> Switch to Arbitrum </button>
          <button onClick={() => switchNetwork(polygon)}> Switch to Polygon </button>
          <button onClick={() => switchNetwork(optimism)}> Switch to Optimism </button>
        </>
      )}

      <p>Modal is {isModalOpen ? 'open' : 'closed'}</p>
      {isConnected ? (
        <div>
          <button onClick={() => disconnect()}>Disconnect Wallet</button>
        </div>
      ) : (
        <button onClick={open}>Connect Wallet</button>
      )}
        */}
    </>
  )
}