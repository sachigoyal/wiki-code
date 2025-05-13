import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider"
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "highlight.js/styles/github-dark.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WikiCode",
  description: "A simple wiki for all your code explanations",
  openGraph: {
    images: [
      {
        url: "https://wikicode.sachii.dev/og.png",
        width: 800,
        height: 600,
        alt: "WikiCode",
      },
    ],
    locale: "en_US",
    type: "website",
    siteName: "WikiCode",
    title: "WikiCode",
    description: "A simple wiki for all your code explanations",
  },
  twitter: {
    card: "summary_large_image",
    title: "WikiCode",
    description: "A simple wiki for all your code explanations",
    images: ["https://wikicode.sachii.dev/og.png"],
  },
  creator: "@sachiigoyal27",
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
      </body>
    </html>
  );
}
