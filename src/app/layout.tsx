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
    <html lang="en" className={`${geist.variable} dark`}>
      <body className="min-h-screen bg-gray-950 text-white">
        <ConvexProviderWrapper>
          <div className="flex min-h-screen">
            <MainNav />
            <main className="flex-1 px-4 py-20 md:py-10 md:px-8 max-w-[1600px] mx-auto w-full">
              {children}
            </main>
          </div>
        </ConvexProviderWrapper>
      </body>
    </html>
  );
}
