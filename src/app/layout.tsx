import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { MainNav } from "@/components/navigation/main-nav";
import { ConvexProviderWrapper } from "@/components/providers/convex-provider";

export const metadata: Metadata = {
  title: "NorthPark Learning Support",
  description: "Learning support management system",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body className="min-h-screen bg-gray-50">
        <ConvexProviderWrapper>
          <MainNav />
          <main>{children}</main>
        </ConvexProviderWrapper>
      </body>
    </html>
  );
}
