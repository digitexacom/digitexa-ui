import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { TooltipProvider } from "@/components/ui/tooltip";
import { siteUrl } from "./_docs/site";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin", "latin-ext"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin", "latin-ext"] });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Digitexa UI", template: "%s · Digitexa UI" },
  description: "An open-source, copy-paste component kit for dense, warm interfaces.",
};

// Apply the saved theme/accent before first paint (no flash).
const themeInit = `try{var s=localStorage,d=document.documentElement,t=s.getItem("dx-theme"),a=s.getItem("dx-accent"),n=s.getItem("dx-density");if(t==="light"||t==="dark")d.setAttribute("data-theme",t);if(a&&/^[a-z]+$/.test(a))d.setAttribute("data-accent",a);if(n==="compact")d.setAttribute("data-density",n);if(s.getItem("dx-sidebar")==="collapsed")d.setAttribute("data-sidebar","collapsed")}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <Script id="dx-theme-init" strategy="beforeInteractive">
          {themeInit}
        </Script>
      </head>
      <body className="min-h-dvh">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
