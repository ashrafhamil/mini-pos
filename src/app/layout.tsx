import type { Metadata } from "next";
import "./globals.css";
import MainFooter from "../components/MainFooter"
import MainSidenav from "../components/MainSidenav";

export const metadata: Metadata = {
  title: "Mini POS System",
  description: "Digital POS without card terminal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* <body>{children}</body> */}
      <body className="flex flex-col min-h-screen">
        <MainSidenav />
        <main className="flex-grow">{children}</main>
        <MainFooter />
      </body>
    </html>
  );
}
