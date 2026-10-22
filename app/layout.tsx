import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin", "latin-ext"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin", "latin-ext"] });

export const metadata: Metadata = {
  title: "Digitexa UI",
  description: "An open-source, copy-paste component kit for dense, warm interfaces.",
};

// Apply the saved theme/accent before first paint (no flash).
const themeInit = `try{var t=localStorage.getItem("dx-theme"),a=localStorage.getItem("dx-accent"),d=document.documentElement;if(t==="light"||t==="dark")d.dataset.theme=t;if(a)d.dataset.accent=a}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
