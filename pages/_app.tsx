import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { SignerProvider } from "../src/state/signer";
import Layout from "../src/components/Layout";
const GRAPH_URL =
  "https://api.studio.thegraph.com/query/2224/nftmarketplace/v0.0.1";
const client = new ApolloClient({ cache: new InMemoryCache(), uri: GRAPH_URL });
export default function App({ Component, pageProps }: AppProps) {
  return (
    <SignerProvider>
      <ApolloProvider client={client}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ApolloProvider>
    </SignerProvider>
  );
}
