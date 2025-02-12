'use client';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Show } from '@/types/show';
import { createClient } from '@/lib/supabase/client';

interface SearchShowsProps {
  onSearch: (filteredShows: Show[]) => void;
}

export default function SearchShows({ onSearch }: SearchShowsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [shows, setShows] = useState<Show[]>([]);

  useEffect(() => {
    const supabase = createClient();

    const fetchShows = async () => {
      const { data } = await supabase
        .from('shows')
        .select('*')
        .order('updated_at', { ascending: false });
      
      if (data) {
        setShows(data);
        onSearch(data);
      }
    };

    // Set up real-time subscription
    const channel = supabase
      .channel('shows_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'shows'
        },
        () => {
          fetchShows();
        }
      )
      .subscribe();

    fetchShows();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [onSearch]);

  useEffect(() => {
    const filteredShows = shows.filter(show =>
      show.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    onSearch(filteredShows);
  }, [searchTerm, shows, onSearch]);

  return (
    <div className="relative flex-1 max-w-sm">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search shows..."
        className="pl-8"
      />
    </div>
  );
}