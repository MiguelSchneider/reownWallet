import React, { useState } from "react";
import { useAccount, useReadContracts } from "wagmi";
import { formatUnits } from "viem";
import { useAppKit, useAppKitAccount, useAppKitNetwork } from "@reown/appkit/react";

const erc20Contract = {
  abi: [
    {
      constant: true,
      inputs: [{ name: "account", type: "address" }],
      name: "balanceOf",
      outputs: [{ name: "", type: "uint256" }],
      type: "function",
      stateMutability: "view",
    },
    {
      constant: true,
      inputs: [],
      name: "decimals",
      outputs: [{ name: "", type: "uint8" }],
      stateMutability: "view",
      type: "function",
    },
  ],
};

const usdcAddresses = {
  1: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  137: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
  42161: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
  10: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85",
};

// 🪄 Reusable button styles
const buttonStyleBase = {
  marginTop: "16px",
  width: "100%",
  padding: "16px",
  border: "none",
  borderRadius: "8px",
  fontWeight: "500",
  fontSize: "18px",
};

const buttonStylePrimary = {
  ...buttonStyleBase,
  backgroundColor: "#3b82f6",
  color: "#fff",
  cursor: "pointer",
};

const buttonStyleDisabled = {
  ...buttonStyleBase,
  backgroundColor: "#e5e7eb",
  color: "#9ca3af",
  cursor: "not-allowed",
};

const buttonStyleWarning = {
  ...buttonStyleBase,
  backgroundColor: "#fde68a",
  color: "#b45309",
  cursor: "not-allowed",
};

function BUIDLPurchase() {
  const [amount, setAmount] = useState("");
  const { open } = useAppKit();
  const { isConnected } = useAppKitAccount();
  const { address } = useAccount();
  const { chainId } = useAppKitNetwork();
  const ETHEREUM_MAINNET_ID = 1;

  const { data } = useReadContracts({
    contracts: [
      {
        address: chainId ? usdcAddresses[chainId] : undefined,
        abi: erc20Contract.abi,
        functionName: "balanceOf",
        args: [address],
        chainId,
      },
      {
        address: chainId ? usdcAddresses[chainId] : undefined,
        abi: erc20Contract.abi,
        functionName: "decimals",
        chainId,
      },
    ],
    query: {
      enabled: !!address && !!chainId && !!usdcAddresses[chainId],
    },
  });

  const balanceResult = data?.[0]?.result;
  const decimals = data?.[1]?.result;
  const usdcBalance =
    balanceResult && decimals ? Number(formatUnits(balanceResult, decimals)) : 0;

  const isAmountValid =
    amount && !isNaN(amount) && Number(amount) > 0 && Number(amount) <= usdcBalance;

  const handlePurchase = () => {
    console.log(`Purchasing ${amount} USDC worth of BUIDL`);
  };

  const handleConnectWallet = () => {
    open();
  };

  const buidlAmount =
    amount && !isNaN(amount) ? (Number(amount) / 1.01).toFixed(4) : "0.0000";

  return (
    <div
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        padding: "24px",
        maxWidth: "550px",
        margin: "0 auto",
        backgroundColor: "#fff",
      }}
    >
      <h2>BUIDL Purchase</h2>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "8px",
          marginBottom: "8px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <img
            src="https://v0-dealer-site-woad.vercel.app/images/buidl-logo.png"
            alt="BUIDL Logo"
            style={{ width: "32px", height: "32px", borderRadius: "50%" }}
          />
          <span style={{ fontSize: "16px", color: "#2d3748" }}>
            Blackrock USD Institutional Digital Liquidity Fund
          </span>
        </div>
        <appkit-button size="sm" balance="hide" />
      </div>

      <div style={{ marginTop: "16px", color: "#4a5568" }}>
        <span style={{ color: "#718096" }}>Expected</span>
        <div
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            color: "#2d3748",
          }}
        >
          1.00 BUIDL per 1.01 USDC
        </div>
      </div>

      <label htmlFor="amount" style={{ display: "block", marginTop: "16px" }}>
        Enter the amount to purchase
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
          onChange={(e) => setAmount(e.target.value)}
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

      {usdcBalance > 0 && (
        <p style={{ marginTop: "8px", color: "#718096" }}>
          USDC Balance: {usdcBalance.toFixed(2)}
        </p>
      )}

      <div style={{ marginTop: "16px" }}>
        <strong>Buy BUIDL</strong> from <strong>Securitize</strong>
      </div>

      {!isConnected && (
        <button onClick={handleConnectWallet} style={buttonStylePrimary}>
          Connect Wallet First
        </button>
      )}

      {isConnected && chainId !== ETHEREUM_MAINNET_ID && (
        <button disabled style={buttonStyleWarning}>
          Please switch to Ethereum Mainnet
        </button>
      )}

      {isConnected && chainId === ETHEREUM_MAINNET_ID && (
        <button
          disabled={!isAmountValid}
          onClick={isAmountValid ? handlePurchase : undefined}
          style={isAmountValid ? buttonStylePrimary : buttonStyleDisabled}
        >
          {isAmountValid
            ? `Purchase ${buidlAmount} BUIDL`
            : "Enter Valid Amount"}
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