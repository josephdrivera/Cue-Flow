'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Show } from '@/types/show';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import SearchShows from './search-shows';
import ShowStats from './show-stats';
import { formatDistanceToNow } from 'date-fns';

function ShowGrid({ shows }: { shows: Show[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {shows.map((show) => (
        <Card key={show.id} className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <Link 
                href={`/shows/${show.id}`}
                className="text-lg font-semibold hover:text-primary"
              >
                {show.name}
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="text-sm text-muted-foreground">
              Last updated {formatDistanceToNow(new Date(show.updated_at), { addSuffix: true })}
            </p>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              size="sm"
              asChild
            >
              <Link href={`/shows/${show.id}/settings`}>Settings</Link>
            </Button>
            <Button 
              size="sm"
              asChild
            >
              <Link href={`/shows/${show.id}`}>Open</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const [filteredShows, setFilteredShows] = useState<Show[]>([]);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button asChild>
          <Link href="/shows/new" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Show
          </Link>
        </Button>
      </div>

      <ShowStats />

      <div className="flex items-center space-x-2">
        <SearchShows onSearch={setFilteredShows} />
      </div>

      <ShowGrid shows={filteredShows} />
    </div>
  );
}