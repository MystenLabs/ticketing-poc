import "../styles/globals.css";
import type { Metadata } from "next";
import { Navbar } from "./components/navbar/Navbar";
import GlobalContexts from "./contexts/globalContexts";

export const metadata: Metadata = {
  title: "Ticketing Application",
  description: "Decentralized ticketing platform with NFT tickets and loyalty rewards on Sui blockchain",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="">
        <GlobalContexts>{children}</GlobalContexts>
      </body>
    </html>
  );
}
