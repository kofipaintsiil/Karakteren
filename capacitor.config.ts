import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "no.karakteren.app",
  appName: "Karakteren",
  webDir: "out",
  server: {
    url: "https://karakteren.vercel.app",
    cleartext: false,
  },
  ios: {
    contentInset: "automatic",
  },
};

export default config;
