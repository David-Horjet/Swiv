"use client";

import {
  solanaWeb3JsAdapter,
  projectId,
} from "@/config/walletConnect";
import { createAppKit } from "@reown/appkit/react";

import { solana, solanaTestnet, solanaDevnet } from "@reown/appkit/networks";
import React, { type ReactNode } from "react";

// Set up metadata
const metadata = {
  name: "Swiv",
  description: "AppKit Example",
  url: "https://reown.com/appkit", // origin must match your domain & subdomain
  icons: ["https://assets.reown.com/reown-profile-pic.png"],
};

// Create the modal
export const modal = createAppKit({
  adapters: [solanaWeb3JsAdapter],
  networks: [solana, solanaTestnet, solanaDevnet],
  metadata: metadata,
  projectId,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
  },
});

function AppkitProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export default AppkitProvider;
