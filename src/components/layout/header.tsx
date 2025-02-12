'use client'

import React from 'react';
import { Sun, Moon, Menu } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from 'next-themes';

export default function Header({ toggleSidebar }: { toggleSidebar: () => void }) {
  const { theme, setTheme } = useTheme();
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <button
          onClick={toggleSidebar}
          className="mr-2 px-2 hover:bg-accent hover:text-accent-foreground rounded-md lg:hidden"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle sidebar</span>
        </button>

        <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link 
              href="/dashboard"
              className="font-bold text-xl hover:text-primary"
            >
              CueFlow
            </Link>
          </div>

          <nav className="flex items-center space-x-4">
            <Link 
              href="/dashboard"
              className="text-sm font-medium hover:text-primary"
            >
              Dashboard
            </Link>
            <Link 
              href="/shows"
              className="text-sm font-medium hover:text-primary"
            >
              Shows
            </Link>
            
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 hover:bg-accent hover:text-accent-foreground rounded-md"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}