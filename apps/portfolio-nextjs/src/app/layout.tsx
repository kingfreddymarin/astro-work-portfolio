import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FJML Studio — Web, AI & Embedded Systems, Shipped Fast",
  description: "Independent engineering studio building web apps, AI automation, and embedded systems — production-ready and shipped in days, not months.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#0E0F11" />
        <meta name="color-scheme" content="dark" />
      </head>
      <body style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {children}
      </body>
    </html>
  );
}
