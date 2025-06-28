import React, { useState, useEffect } from "react";
import { useAccount, useReadContract } from "wagmi";
import { erc20Abi, formatUnits } from "viem";
import { useAppKit, useAppKitAccount, useAppKitNetwork } from "@reown/appkit/react";

const usdcAddresses = {
  1: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  137: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
  42161: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
  10: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85",
};

// 🪄 Styles
const containerStyle = {
  border: "1px solid #e2e8f0",
  borderRadius: "12px",
  padding: "24px",
  maxWidth: "550px",
  margin: "0 auto",
  backgroundColor: "#fff",
};

const headerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "8px",
  marginBottom: "8px",
};

const headerInfoStyle = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

const expectedStyle = {
  marginTop: "16px",
  color: "#4a5568",
};

const expectedRateStyle = {
  fontSize: "18px",
  fontWeight: "bold",
  color: "#2d3748",
};

const labelStyle = {
  display: "block",
  marginTop: "16px",
};

const inputContainerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  border: "1px solid #e2e8f0",
  borderRadius: "8px",
  padding: "12px",
  marginTop: "8px",
};

const inputStyle = {
  border: "none",
  outline: "none",
  fontSize: "18px",
  flex: 1,
  background: "transparent",
  appearance: "none",
  WebkitAppearance: "none",
  MozAppearance: "textfield",
  boxShadow: "none",
};

const tokenStyle = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
};

const balanceWarningStyle = {
  color: "#dc2626",
  marginTop: "4px",
  fontSize: "14px",
};

const balanceInfoStyle = {
  marginTop: "8px",
  color: "#718096",
};

const buyInfoStyle = {
  marginTop: "16px",
};

const disclaimerStyle = {
  fontSize: "12px",
  color: "#4a5568",
  marginTop: "16px",
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

  // Reset amount when disconnected
  useEffect(() => {
    if (!isConnected) {
      setAmount("");
    }
  }, [isConnected]);

  const decimals = 6;

  const { data: balanceData } = useReadContract({
    abi: erc20Abi,
    address: chainId ? usdcAddresses[chainId] : undefined,
    functionName: "balanceOf",
    args: [address],
    query: {
      enabled: !!address && !!chainId && !!usdcAddresses[chainId],
    },
  });

  const usdcBalance =
    balanceData ? Number(formatUnits(balanceData, decimals)) : 0;

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
    <div style={containerStyle}>
      <h2>BUIDL Purchase</h2>

      <div style={headerStyle}>
        <div style={headerInfoStyle}>
          <img
            src="https://v0-dealer-site-woad.vercel.app/images/buidl-logo.png"
            alt="BUIDL Logo"
            style={{ width: "32px", height: "32px", borderRadius: "50%" }}
          />
          <span style={{ fontSize: "16px", color: "#2d3748" }}>
            Blackrock USD Institutional Digital Liquidity Fund
          </span>
        </div>
        <appkit-button size="sm" balance="hide" style={{ whiteSpace: "nowrap" }} />
      </div>

      <div style={expectedStyle}>
        <span style={{ color: "#718096" }}>Expected</span>
        <div style={expectedRateStyle}>
          1.00 BUIDL per 1.01 USDC
        </div>
      </div>

      <label htmlFor="amount" style={labelStyle}>
        Enter the amount to purchase
      </label>

      <div style={inputContainerStyle}>
        <input
          id="amount"
          type="number"
          min="0"
          autoComplete="off"
          value={amount}
          onChange={(e) => {
            const value = e.target.value;
            if (value.includes(".")) {
              const [intPart, decPart] = value.split(".");
              setAmount(`${intPart}.${decPart.slice(0, 6)}`);
            } else {
              setAmount(value);
            }
          }}
          placeholder="0.00"
          style={inputStyle}
          max={usdcBalance || undefined}
          disabled={!isConnected}
        />
        <div style={tokenStyle}>
          <img
            src="https://images.seeklogo.com/logo-png/40/1/usd-coin-usdc-logo-png_seeklogo-408043.png"
            alt="USDC"
            style={{ width: "24px", height: "24px" }}
          />
          <span style={{ fontWeight: "500" }}>USDC</span>
        </div>
      </div>

      {amount && Number(amount) > usdcBalance && (
        <div style={balanceWarningStyle}>
          Amount exceeds your USDC balance.
        </div>
      )}

      {usdcBalance > 0 && (
        <p style={balanceInfoStyle}>
          USDC Balance: {usdcBalance.toFixed(2)}
        </p>
      )}

      <div style={buyInfoStyle}>
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

      <p style={disclaimerStyle}>
        Each notice of redemption delivered to Securitize by any investor will
        be irrevocable unless the Sponsor determines otherwise in its sole
        discretion. No guarantee or representation is made that the Fund will
        achieve its investment objective.
      </p>
    </div>
  );
}

export default BUIDLPurchase;