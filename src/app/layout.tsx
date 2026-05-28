import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { QueryProvider } from "@/providers/query-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GEO-SEO - AI 搜索引擎优化平台",
  description: "优化您的网站，让 ChatGPT、DeepSeek、Claude、Perplexity、Gemini 等 AI 搜索引擎更容易发现和引用您的内容",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex bg-[#020617] overflow-x-hidden">
        <QueryProvider>
          <Sidebar />
          <main className="flex-1 transition-all duration-300 relative z-10">
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
              {children}
            </Suspense>
          </main>
        </QueryProvider>
      </body>
    </html>
  );
}
