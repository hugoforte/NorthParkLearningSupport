import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { MainNav } from "@/components/navigation/main-nav";
import { ConvexProviderWrapper } from "@/components/providers/convex-provider";
import { AuthProvider } from "@/components/auth/auth-context";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";

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
        <ConvexAuthNextjsServerProvider apiRoute="/api/auth">
          <ConvexProviderWrapper>
            <AuthProvider>
              <div className="flex min-h-screen">
                <MainNav />
                <main className="mx-auto w-full max-w-[1600px] flex-1 px-4 py-20 md:px-8 md:py-10">
                  {children}
                </main>
              </div>
            </AuthProvider>
          </ConvexProviderWrapper>
        </ConvexAuthNextjsServerProvider>
      </body>
    </html>
  );
}
