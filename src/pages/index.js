import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "components/styles/Home.module.css";
import { getCoinbaseWalletProvider } from "../../components/web3";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });
export default function Home() {
  const [provider, setProvider] = useState();
  const [account, setAccount] = useState();
  const [signature, setSignature] = useState("");
  const [error, setError] = useState("");
  const [chainId, setChainId] = useState();
  const [network, setNetwork] = useState(undefined);
  const [message, setMessage] = useState("");
  const [signedMessage, setSignedMessage] = useState("");
  const [verified, setVerified] = useState();

  const toHex = (num) => {
    const val = Number(num);
    return "0x" + val.toString(16);
  };

  const switchNetwork = async () => {
    try {
      console.log("herro");
      const hero = await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: toHex(84532) }],
      });
      console.log(hero);
      setChainId(Number(84532));
    } catch (error) {
      console.log(error);
      setError(error);
    }
  };

  const connectWithProvider = async (provider) => {
    try {
      setProvider(provider);
      // Get accounts for connected wallet
      const accounts = await provider.request({
        method: "eth_requestAccounts",
      });
      if (accounts) {
        setAccount(accounts[0]);
        console.log(accounts[0]);
      }
      // Get current chain ID for connected wallet
      const chainId = await provider.request({
        method: "eth_chainId",
      });
      if (Number(chainId) !== 84532) {
        await switchNetwork();
      } else {
        setChainId(Number(chainId));
      }
    } catch (error) {
      setError(error);
    }
  };

  const connect = async () => {
    connectWithProvider(getCoinbaseWalletProvider());
  };

  useEffect(() => {
    if (provider?.on) {
      const handleAccountsChanged = (accounts) => {
        console.log("accountsChanged", accounts);
        if (accounts) setAccount(accounts[0]);
      };

      const handleChainChanged = (_hexChainId) => {
        console.log("chain changed", _hexChainId);
        setError(`Chain changed: ${_hexChainId}`);
        setChainId(_hexChainId);
      };

      const handleDisconnect = () => {
        console.log("disconnect", error);
        disconnect();
      };

      provider.on("accountsChanged", handleAccountsChanged);
      provider.on("chainChanged", handleChainChanged);
      provider.on("disconnect", handleDisconnect);

      return () => {
        if (provider.removeListener) {
          provider.removeListener("accountsChanged", handleAccountsChanged);
          provider.removeListener("chainChanged", handleChainChanged);
          provider.removeListener("disconnect", handleDisconnect);
        }
      };
    }
  }, [provider]);

  // useEffect(() => {
  //   const onApproveWatchAsset = (result) => {
  //     // your approval callback implementation
  //     console.log(result);
  //   };

  //   const onDenyWatchAsset = () => {
  //     // your denying callback implementation
  //   };

  //   const onError = (message) => {
  //     // your error callback implementation
  //     console.error(message);
  //   };

  //   if (provider) {
  //     // Use wallet_watchAsset
  //     provider
  //       .request({
  //         method: "wallet_watchAsset",
  //         params: {
  //           type: "ERC20",
  //           options: {
  //             address: "0xcf664087a5bb0237a0bad6742852ec6c8d69a27a",
  //             symbol: "WONE",
  //             decimals: 18,
  //             image:
  //               "https://s2.coinmarketcap.com/static/img/coins/64x64/11696.png",
  //           },
  //         },
  //       })
  //       .then((response) => {
  //         const result = response;
  //         result ? onApproveWatchAsset(result) : onDenyWatchAsset();
  //       })
  //       .catch((err) => onError(err.message));
  //   }
  // }, [provider]); // Empty dependency array means this effect runs once on mount
  return (
    <>
      <div>
        {account && <div>{account}</div>}
        {`Network ID: ${chainId ? chainId : "No Network"}`}
        {chainId ? (
          <button onClick={switchNetwork} isDisabled={!network}>
            Switch Network
          </button>
        ) : (
          <button onClick={connect}>Connect Network</button>
        )}
      </div>
    </>
  );
}
