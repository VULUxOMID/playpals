import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Playpals - Listen Together, Discover Together",
  description: "A real-time social music platform that connects friends through shared Spotify listening experiences. Create collaborative playlists, discover music together, and build your musical community.",
  keywords: ["music", "spotify", "social", "playlists", "collaborative", "real-time"],
  authors: [{ name: "Playpals Team" }],
  openGraph: {
    title: "Playpals - Listen Together, Discover Together",
    description: "Create collaborative playlists, see what your friends are listening to in real-time, and discover new music through your social network.",
    type: "website",
    url: "https://playpals.cloud",
    siteName: "Playpals",
  },
  twitter: {
    card: "summary_large_image",
    title: "Playpals - Listen Together, Discover Together",
    description: "Create collaborative playlists, see what your friends are listening to in real-time, and discover new music through your social network.",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
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
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
