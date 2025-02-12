'use client';

import { useEffect, useState } from 'react';
import { Calendar, Clock, ListMusic } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Show } from '@/types/show';
import { createClient } from '@/lib/supabase/client';

interface ShowStats {
  totalShows: number;
  activeShows: number;
  avgShowDuration: string;
}

export default function ShowStats() {
  const [stats, setStats] = useState<ShowStats>({
    totalShows: 0,
    activeShows: 0,
    avgShowDuration: '0:00:00'
  });

  useEffect(() => {
    const supabase = createClient();

    const fetchStats = async () => {
      // Fetch shows and associated cues
      const { data: shows } = await supabase
        .from('shows')
        .select(`
          *,
          cues (
            start_time,
            run_time
          )
        `);

      if (shows) {
        // Calculate statistics
        const totalShows = shows.length;
        const activeShows = shows.filter(show => 
          show.cues && show.cues.length > 0
        ).length;

        // Calculate average show duration
        let totalMinutes = 0;
        let showsWithDuration = 0;

        shows.forEach(show => {
          if (show.cues && show.cues.length > 0) {
            const showDuration = show.cues.reduce((acc, cue) => {
              if (cue.run_time) {
                const [hours, minutes, seconds] = cue.run_time.split(':').map(Number);
                return acc + (hours * 60) + minutes + (seconds / 60);
              }
              return acc;
            }, 0);
            
            if (showDuration > 0) {
              totalMinutes += showDuration;
              showsWithDuration++;
            }
          }
        });

        const avgMinutes = showsWithDuration > 0 ? totalMinutes / showsWithDuration : 0;
        const hours = Math.floor(avgMinutes / 60);
        const minutes = Math.floor(avgMinutes % 60);
        const seconds = Math.floor((avgMinutes * 60) % 60);

        setStats({
          totalShows,
          activeShows,
          avgShowDuration: `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        });
      }
    };

    fetchStats();

    // Set up subscription for real-time updates
    const channel = supabase
      .channel('stats_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'shows'
        },
        () => fetchStats()
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cues'
        },
        () => fetchStats()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Shows</CardTitle>
          <ListMusic className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalShows}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Shows</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeShows}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Duration</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.avgShowDuration}</div>
        </CardContent>
      </Card>
    </div>
  );
}