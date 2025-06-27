import React, { useState, useEffect } from "react";

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

    return <div>{formatted && <p>  <span style={{ color: "#718096" }}> USDC Balance: {formatted} </span></p>}</div>;
}


function BUIDLPurchase() {
    const [amount, setAmount] = useState("");
    const { open } = useAppKit();
    const { isConnected } = useAppKitAccount();

    const handleInputChange = (e) => {
        setAmount(e.target.value);
    };

    const handleConnectWallet = () => {
        open();
    };

    const handlePurchase = () => {
        // Trigger the purchase action here
        console.log(`Purchasing ${amount} USDC worth of BUIDL`);
    };

    // If wallet is connected but not on Ethereum mainnet, show a prompt to switch
    const { chainId } = useAppKitNetwork();
    const ETHEREUM_MAINNET_ID = 1;

    // USDC balance state
    const { address } = useAccount();
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
    const usdcBalance = balanceResult && decimals ? Number(formatUnits(balanceResult, decimals)) : 0;

    // Validation for amount
    const isAmountValid = amount && !isNaN(amount) && Number(amount) > 0 && Number(amount) <= usdcBalance;

    return (
        <div style={{ border: "1px solid #e2e8f0", borderRadius: "12px", padding: "24px", maxWidth: "500px", margin: "0 auto", backgroundColor: "#fff" }}>
            <h2>BUIDL Purchase</h2>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <img
                    src="https://v0-dealer-site-woad.vercel.app/images/buidl-logo.png"
                    alt="BUIDL Logo"
                    style={{ width: "32px", height: "32px", borderRadius: "50%" }}
                />
                <span style={{ fontSize: "16px", color: "#2d3748" }}>
                    Blackrock USD Institutional Digital Liquidity Fund
                </span>
                <appkit-button size='sm' balance='hide' />
            </div>
            <div style={{ marginTop: "16px", color: "#4a5568" }}>
                <span style={{ color: "#718096" }}> Expected </span>
                <div style={{ fontSize: "18px", fontWeight: "bold", color: "#2d3748" }}>
                    <strong>1.00 BUIDL per 1.01 USDC</strong>
                </div>
            </div>
            <label htmlFor="amount" style={{ display: "block", marginTop: "16px" }}>
                <h2>Enter the amount to purchase</h2>
            </label>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    padding: "12px",
                    marginTop: "8px",
                }}
            >
                <input
                    id="amount"
                    type="number"
                    min="0"
                    value={amount}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    style={{
                        border: "none",
                        outline: "none",
                        fontSize: "18px",
                        flex: 1,
                    }}
                    max={usdcBalance || undefined}
                    disabled={!isConnected}
                />
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <img
                        src="https://images.seeklogo.com/logo-png/40/1/usd-coin-usdc-logo-png_seeklogo-408043.png"
                        alt="USDC"
                        style={{ width: "24px", height: "24px" }}
                    />
                    <span style={{ fontWeight: "500" }}>USDC</span>
                </div>
            </div>
            {amount && Number(amount) > usdcBalance && (
                <div style={{ color: "#dc2626", marginTop: "4px", fontSize: "14px" }}>
                    Amount exceeds your USDC balance.
                </div>
            )}
            <USDCBalance />
            {/* <p style={{ marginTop: "16px" }}>
                ↓  To
            </p>
            <div style={{ display: "flex", flexDirection: "row", gap: "18px", alignItems: "center", marginTop: "16px" }}>
                <img
                    src="https://v0-dealer-site-woad.vercel.app/images/buidl-logo.png"
                    alt="USDC"
                    style={{ width: "24px", height: "24px" }}
                />
                <div>
                    <strong>Buy BUIDL </strong> from <strong> Securitize </strong>
                </div>
            </div> */}
            <div>
                <strong>Buy BUIDL </strong> from <strong> Securitize </strong>
            </div>
            {isConnected ? (
                chainId !== ETHEREUM_MAINNET_ID ? (
                    <button
                        disabled
                        style={{
                            marginTop: "16px",
                            width: "100%",
                            padding: "20px",
                            backgroundColor: "#fde68a",
                            color: "#b45309",
                            border: "none",
                            borderRadius: "8px",
                            fontWeight: "500",
                            fontSize: "18px",
                            cursor: "not-allowed",
                        }}
                    >
                        Please switch to Ethereum Mainnet
                    </button>
                ) : (
                    <button
                        disabled={!isAmountValid}
                        style={{
                            marginTop: "16px",
                            width: "100%",
                            padding: "20px",
                            backgroundColor: isAmountValid ? "#3b82f6" : "#e5e7eb",
                            color: isAmountValid ? "#fff" : "#9ca3af",
                            border: "none",
                            borderRadius: "8px",
                            fontWeight: "500",
                            fontSize: "18px",
                            cursor: isAmountValid ? "pointer" : "not-allowed",
                        }}
                        onClick={isAmountValid ? handlePurchase : undefined}
                    >
                        {isAmountValid
                            ? (() => {
                                const buidlAmount = Number(amount) / 1.01;
                                const formatted = isFinite(buidlAmount) ? buidlAmount.toFixed(4) : "0.0000";
                                return `Purchase ${formatted} BUIDL`;
                            })()
                            : "Enter Valid Amount"}
                    </button>
                )
            ) : (
                <button
                    onClick={handleConnectWallet}
                    style={{
                        marginTop: "16px",
                        width: "100%",
                        padding: "12px",
                        backgroundColor: "#3b82f6",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: "bold",
                    }}
                >
                    Connect Wallet First
                </button>
            )}

            <p style={{ fontSize: "12px", color: "#4a5568", marginTop: "16px" }}>
                Each notice of redemption delivered to Securitize by any investor will
                be irrevocable unless the Sponsor determines otherwise in its sole
                discretion. No guarantee or representation is made that the Fund will
                achieve its investment objective.
            </p>
        </div>
    );
}

export default BUIDLPurchase;