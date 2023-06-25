import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { configureChains, createClient } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { WagmiConfig } from "wagmi";
import "tailwindcss/tailwind.css";
const mantletestnet = {
  id: 5001,
  name: "Mantle Testnet",
  network: "mantle-testnet",
  iconUrl: "",
  iconBackground: "",
  nativeCurrency: {
    name: "BIT",
    symbol: "BIT",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.testnet.mantle.xyz"],
    },
  },
  blockExplorers: {
    default: {
      name: "Mantle Testnet Explorer",
      url: "https://explorer.testnet.mantle.xyz",
    },
  },
  testnet: true,
};

const { chains, provider } = configureChains(
  [mantletestnet],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  AppName: "NFTinder",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

function myApp({ Component, pageProps }) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider coolMode chains={chains}>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default myApp;
