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

  return (
    <div className="w-0 flex-none md:w-64">
      {/* Mobile Top Bar (fixed, no flex space) */}
      <div className="fixed inset-x-0 top-0 z-40 border-b border-gray-800 bg-gray-950/80 backdrop-blur supports-[backdrop-filter]:bg-gray-950/60 md:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center space-x-2">
            <GraduationCap className="h-6 w-6 text-blue-400" />
            <span className="font-semibold text-white">NorthPark</span>
          </Link>
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
