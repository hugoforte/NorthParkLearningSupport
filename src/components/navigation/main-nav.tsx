"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Users,
  Home,
  GraduationCap,
  Menu,
  BookOpen,
  UserCheck,
  FileText,
  Target,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { createAuthClient } from "better-auth/client";
import { useEffect, useState } from "react";

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Teachers", href: "/teachers", icon: Users },
  { name: "Classes", href: "/classes", icon: BookOpen },
  { name: "Students", href: "/students", icon: UserCheck },
  { name: "Notes", href: "/notes", icon: FileText },
  { name: "Goals", href: "/goals", icon: Target },
];

const auth = createAuthClient();

export const MainNav = () => {
  const pathname = usePathname();
  const [user, setUser] = useState<{ name?: string | null; email?: string | null; image?: string | null } | null>(null);
  const post = (action: string, fields: Record<string, string>) => {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = action;
    Object.entries(fields).forEach(([key, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });
    document.body.appendChild(form);
    form.submit();
  };
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await (auth as any).getSession();
        if (!cancelled) setUser(res?.data?.user ?? null);
      } catch {
        if (!cancelled) setUser(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="w-0 flex-none md:w-64">
      {/* Mobile Top Bar (fixed, no flex space) */}
      <div className="fixed inset-x-0 top-0 z-40 border-b border-gray-800 bg-gray-950/80 backdrop-blur supports-[backdrop-filter]:bg-gray-950/60 md:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center space-x-2">
            <GraduationCap className="h-6 w-6 text-blue-400" />
            <span className="font-semibold text-white">NorthPark</span>
          </Link>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.image}
                    alt={user.name ?? user.email ?? "User"}
                    className="h-7 w-7 rounded-full border border-gray-700"
                  />
                ) : (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-700 bg-gray-800 text-xs text-gray-300">
                    {(user.name ?? user.email ?? "U").slice(0, 1)}
                  </div>
                )}
                <span className="hidden text-sm text-gray-300 sm:inline">
                  {user.name ?? user.email ?? "Signed in"}
                </span>
                <Button
                  variant="outline"
                  className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                  onClick={async () => {
                    try {
                      await fetch("/api/auth/sign-out", { method: "POST" });
                    } finally {
                      window.location.reload();
                    }
                  }}
                >
                  Sign out
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                onClick={() => void (auth as any).signIn?.social?.({ provider: "google" })}
              >
                Sign in
              </Button>
            )}
          </div>
          <Sheet>
            <SheetTrigger className="rounded-md p-2 text-gray-300 hover:bg-gray-800 hover:text-white">
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-72 border-gray-800 bg-gray-900 p-0"
            >
              <div className="p-6">
                <Link href="/" className="mb-8 flex items-center space-x-3">
                  <GraduationCap className="h-8 w-8 text-blue-400" />
                  <div>
                    <h1 className="text-xl font-bold text-white">NorthPark</h1>
                    <p className="text-sm text-gray-400">Learning Support</p>
                  </div>
                </Link>
                <nav className="space-y-2">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                          "flex items-center space-x-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200",
                          isActive
                            ? "bg-blue-600 text-white shadow-lg"
                            : "text-gray-300 hover:bg-gray-800 hover:text-white",
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden min-h-screen w-full border-r border-gray-800 bg-gray-900 md:block">
        <div className="p-6">
          <Link href="/" className="mb-8 flex items-center space-x-3">
            <GraduationCap className="h-8 w-8 text-blue-400" />
            <div>
              <h1 className="text-xl font-bold text-white">NorthPark</h1>
              <p className="text-sm text-gray-400">Learning Support</p>
            </div>
          </Link>
          <div className="mb-6 flex items-center justify-between">
            {user ? (
              <div className="flex items-center gap-3">
                {user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.image}
                    alt={user.name ?? user.email ?? "User"}
                    className="h-8 w-8 rounded-full border border-gray-700"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-700 bg-gray-800 text-sm text-gray-300">
                    {(user.name ?? user.email ?? "U").slice(0, 1)}
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-white">
                    {user.name ?? user.email ?? "Signed in"}
                  </span>
                  {user.email ? (
                    <span className="text-xs text-gray-400">{user.email}</span>
                  ) : null}
                </div>
              </div>
            ) : (
              <span className="text-sm text-gray-400">Not signed in</span>
            )}
            {user ? (
              <Button
                variant="outline"
                size="sm"
                className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                onClick={async () => {
                  try {
                    await fetch("/api/auth/sign-out", { method: "POST" });
                  } finally {
                    window.location.reload();
                  }
                }}
              >
                Sign out
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                onClick={() => void (auth as any).signIn?.social?.({ provider: "google" })}
              >
                Sign in
              </Button>
            )}
          </div>
          <nav className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white",
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
};
