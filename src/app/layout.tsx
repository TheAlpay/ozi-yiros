import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OZI YIROS | Brisbane's Authentic Greek Street Food",
  description: "Bespoke Greek Yiros, Souvlaki, and more in Brisbane.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
