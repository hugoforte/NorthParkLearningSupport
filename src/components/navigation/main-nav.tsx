'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Users, Home, GraduationCap, Menu, BookOpen } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Teachers', href: '/teachers', icon: Users },
  { name: 'Classes', href: '/classes', icon: BookOpen },
];

export const MainNav = () => {
  const pathname = usePathname();

  return (
    <div className="flex-none w-0 md:w-64">
      {/* Mobile Top Bar (fixed, no flex space) */}
      <div className="md:hidden fixed top-0 inset-x-0 z-40 bg-gray-950/80 backdrop-blur supports-[backdrop-filter]:bg-gray-950/60 border-b border-gray-800">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center space-x-2">
            <GraduationCap className="h-6 w-6 text-blue-400" />
            <span className="font-semibold text-white">NorthPark</span>
          </Link>
          <Sheet>
            <SheetTrigger className="rounded-md p-2 hover:bg-gray-800 text-gray-300 hover:text-white">
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="left" className="w-72 bg-gray-900 border-gray-800 p-0">
              <div className="p-6">
                <Link href="/" className="flex items-center space-x-3 mb-8">
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
                          'flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200',
                          isActive
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'text-gray-300 hover:text-white hover:bg-gray-800'
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
      <div className="hidden md:block w-full bg-gray-900 min-h-screen border-r border-gray-800">
        <div className="p-6">
          <Link href="/" className="flex items-center space-x-3 mb-8">
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
                    'flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
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
