"use client";

import { useState } from "react";
import { PrivyProvider } from "@privy-io/react-auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "@privy-io/wagmi";
import { config } from "./utils/config";
import { HomePage } from "./components/Homepage";

export default function Home() {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <PrivyProvider
      appId="cm0xy6r4e08evv5gtf18bfcr2"
      config={{
        loginMethods: ["farcaster"],
        appearance: {
          theme: "dark",
          accentColor: "#676FFF",
          logo: "/app-logo.svg",
        },
        embeddedWallets: {
          noPromptOnSignature: false,
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={config}>
          <HomePage />
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}
