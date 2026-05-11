import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "OZI YIROS | Brisbane's Authentic Greek Street Food",
  description: "Bespoke Greek Yiros, Souvlaki, and more in Warner, Brisbane.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}
