import type { Metadata } from "next";
import "./globals.css";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Domass Cookies",
  description: "Biscoitos artesanais personalizados feitos à mão.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={montserrat.variable}>
      <body className="min-h-screen bg-domass-bg text-domass-cocoa">
        {children}
      </body>
    </html>
  );
}
