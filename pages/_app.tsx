import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SignerProvider } from "../src/state/signer";
import Layout from "../src/components/Layout";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SignerProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SignerProvider>
  );
}
