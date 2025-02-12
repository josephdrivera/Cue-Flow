'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Play, 
  ListMusic, 
  Settings, 
  Plus, 
  ChevronDown, 
  Users,
  LogOut
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Show } from '@/types/show';

export default function LayoutWrapper({ 
  className = "",
  isOpen = true
}: { 
  className?: string;
  isOpen?: boolean;
}) {
  const pathname = usePathname();
  const [shows, setShows] = useState<Show[]>([]);
  const [showsExpanded, setShowsExpanded] = useState(true);
  
  useEffect(() => {
    const supabase = createClient();

    // Initial fetch
    const fetchShows = async () => {
      const { data, error } = await supabase
        .from('shows')
        .select('*')
        .order('name');
      
      if (!error && data) {
        setShows(data);
      }
    };

    fetchShows();

    // Set up real-time subscription
    const channel = supabase
      .channel('shows_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'shows'
        },
        async () => {
          // Refetch shows when any change occurs
          await fetchShows();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Sign out handler
  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    // Redirect will be handled by middleware
  };

  const isActiveLink = (path: string) => {
    return pathname === path;
  };

  const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Link
      href={href}
      className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors
        ${isActiveLink(href) 
          ? 'bg-primary text-primary-foreground' 
          : 'hover:bg-accent hover:text-accent-foreground'
        }`}
    >
      {children}
    </Link>
  );

  if (!isOpen) return null;

  return (
    <aside className={`pb-12 w-64 ${className}`}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            <NavLink href="/dashboard">
              <Play className="h-4 w-4" />
              Dashboard
            </NavLink>
            
            <button
              onClick={() => setShowsExpanded(!showsExpanded)}
              className="flex w-full items-center justify-between px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-md"
            >
              <div className="flex items-center gap-2">
                <ListMusic className="h-4 w-4" />
                Shows
              </div>
              <ChevronDown 
                className={`h-4 w-4 transition-transform ${showsExpanded ? 'rotate-180' : ''}`}
              />
            </button>
            
            {showsExpanded && (
              <div className="ml-4 space-y-1">
                {shows.map((show) => (
                  <NavLink key={show.id} href={`/shows/${show.id}`}>
                    {show.name}
                  </NavLink>
                ))}
                <Link
                  href="/shows/new"
                  className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-md"
                >
                  <Plus className="h-4 w-4" />
                  New Show
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight">
            Settings
          </h2>
          <div className="space-y-1">
            <NavLink href="/settings/profile">
              <Users className="h-4 w-4" />
              Team
            </NavLink>
            <NavLink href="/settings">
              <Settings className="h-4 w-4" />
              Settings
            </NavLink>
          </div>
        </div>

        <div className="px-3 py-2">
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive hover:text-destructive-foreground rounded-md"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}