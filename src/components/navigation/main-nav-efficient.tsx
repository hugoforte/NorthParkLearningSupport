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
import { useAuth } from "@/components/auth/auth-context";

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Teachers", href: "/teachers", icon: Users },
  { name: "Classes", href: "/classes", icon: BookOpen },
  { name: "Students", href: "/students", icon: UserCheck },
  { name: "Notes", href: "/notes", icon: FileText },
  { name: "Goals", href: "/goals", icon: Target },
];

export const MainNav = () => {
  const pathname = usePathname();
  const { user, signIn, signOut } = useAuth();

  return (
    <div className="w-0 flex-none md:w-64">
      {/* Mobile Menu */}
      <div className="flex items-center justify-between border-b border-gray-800 bg-gray-900 p-4 md:hidden">
        <Link href="/" className="flex items-center space-x-3">
          <GraduationCap className="h-6 w-6 text-blue-400" />
          <div>
            <h1 className="text-lg font-bold text-white">NorthPark</h1>
            <p className="text-xs text-gray-400">Learning Support</p>
          </div>
        </Link>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 border-gray-800 bg-gray-900 p-0">
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
                    onClick={signOut}
                    variant="ghost"
                    size="sm"
                    className="text-xs text-gray-400 hover:text-white"
                  >
                    Sign out
                  </Button>
                ) : (
                  <Button
                    onClick={signIn}
                    variant="ghost"
                    size="sm"
                    className="text-xs text-blue-400 hover:text-blue-300"
                  >
                    Sign in
                  </Button>
                )}
              </div>

              <nav className="space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        pathname === item.href
                          ? "bg-blue-600 text-white"
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
                onClick={signOut}
                variant="ghost"
                size="sm"
                className="text-xs text-gray-400 hover:text-white"
              >
                Sign out
              </Button>
            ) : (
              <Button
                onClick={signIn}
                variant="ghost"
                size="sm"
                className="text-xs text-blue-400 hover:text-blue-300"
              >
                Sign in
              </Button>
            )}
          </div>

          <nav className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "bg-blue-600 text-white"
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
