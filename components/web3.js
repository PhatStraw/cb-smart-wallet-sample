import CoinbaseWalletSDK from "@coinbase/wallet-sdk";

const APP_NAME = "My Demo App";
const APP_LOGO_URL = "http://localhost:3000/next.svg";
const INFURA_RPC_URL = `https://mainnet.infura.io/v3/6e1292c7cc0f41ac9dafeb1a9c61fff9`;
const DEFAULT_CHAIN_ID = 84532;
const APP_SUPPORTED_CHAIN_IDS = [1, 8453, 84532]
// Coinbase Wallet Provider
export const getCoinbaseWalletProvider = () => {
  const coinbaseWallet = new CoinbaseWalletSDK({
    appName: APP_NAME,
    appLogoUrl: APP_LOGO_URL,
    chainIds: APP_SUPPORTED_CHAIN_IDS,
    darkMode: false,
    overrideIsMetaMask: false,
    connectionPreference: "embedded",
  });
  return coinbaseWallet.makeWeb3Provider(INFURA_RPC_URL, DEFAULT_CHAIN_ID);
};
