import type { Metadata } from "next";
import React from 'react';
import { WalletProvider } from '@/providers/WalletProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { I18nProvider } from '@/providers/I18nProvider'
import Navbar from '@/components/Navbar'
import "./globals.css";
import { ProvidersMiddleware } from '@/providers/providerMiddleware';


export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body>
        <I18nProvider>
            <ThemeProvider>
              <WalletProvider>
                <Navbar />
                <ProvidersMiddleware>
                  {children}
                </ProvidersMiddleware>
              </WalletProvider>
            </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
