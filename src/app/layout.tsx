import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/header";
import Footer from "@/components/footer";
import { ChatProvider } from '../context/ChatContext';
import Script from 'next/script';
import { Analytics } from "@vercel/analytics/react"

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
      <Script async src="https://www.googletagmanager.com/gtag/js?id=G-HQVTHW994V"></Script>
      <Script id="google-analytics">
        {`window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'G-HQVTHW994V');`}
      </Script>
      <Script defer src="https://api.pirsch.io/pa.js"
      id="pianjs"
      data-code="bG2VUg6L0jd4o31kxeBltdQCrY5hBqPh">
      </Script>
        <Script id="MathJax-script" src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js" strategy="afterInteractive" />
        <meta property="og:title" content="math12.studio - ваш ИИ репетитор математики НИШ" />
        <meta property="og:description" content="ИИ-стартап, нацеленный на развитие математических знаний у казахстанцев на базе силлабуса НИШ 😎" />
        <meta property="og:image" content="https://utfs.io/f/55096462-99f2-42fa-8ba0-79e1ed992be3-934hm2.png" />
        <meta property="og:type" content="website" />
        <meta name="description" content="ИИ-стартап, нацеленный на развитие математических знаний у казахстанцев на базе силлабуса НИШ 😎"></meta>
        <link rel="canonical" href="https://math12.studio/" />
      </head>
      <body className={inter.className}>
        <ChatProvider>
          <Analytics />
          <Navbar />  
          {children}
          <Footer />
        </ChatProvider>
      </body>
    </html>
  );
}
