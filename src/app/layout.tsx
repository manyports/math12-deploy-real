import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/header";
import Footer from "@/components/footer";
import { ChatProvider } from '../context/ChatContext';
import Script from 'next/script';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "math12 - ваш учитель математики НИШ",
  description: "ИИ-стартап, нацеленный на развитие математических знаний у казахстанцев на базе силлабуса НИШ 😎",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script src="https://polyfill.io/v3/polyfill.min.js?features=es6" strategy="beforeInteractive" />
        <Script id="MathJax-script" src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js" strategy="afterInteractive" />
      </head>
      <ChatProvider>
        <body className={inter.className}>
          <Navbar />  
          {children}
          <Footer />
        </body>
      </ChatProvider>
    </html>
  );
}