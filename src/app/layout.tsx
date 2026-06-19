import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "平行人生模拟器",
  description:
    "如果当初做出不同的选择，现在的你会在哪里？输入一个「如果当初...」，探索三条平行人生故事线。",
  openGraph: {
    title: "平行人生模拟器",
    description:
      "如果当初做出不同的选择，现在的你会在哪里？探索你的平行人生。",
    type: "website",
    locale: "zh_CN",
  },
  twitter: {
    card: "summary_large_image",
    title: "平行人生模拟器",
    description:
      "如果当初做出不同的选择，现在的你会在哪里？探索你的平行人生。",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;500;600;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
