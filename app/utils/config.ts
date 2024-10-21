import { createConfig } from "@privy-io/wagmi";

import { base } from "viem/chains";
import { http } from "viem";

export const config = createConfig({
  chains: [base],
  transports: {
    // [mainnet.id]: http(),
    [base.id]: http(),
  },
});
