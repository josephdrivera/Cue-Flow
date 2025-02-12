import { Suspense } from 'react';
import Link from 'next/link';
import { Plus, Search } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { Show } from '@/types/show';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { formatDistanceToNow } from 'date-fns';

async function ShowGrid() {
  const supabase = await createClient();
  
  const { data: shows } = await supabase
    .from('shows')
    .select('*')
    .order('updated_at', { ascending: false });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {shows?.map((show: Show) => (
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

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search shows..."
            className="pl-8"
          />
        </div>
      </div>

      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
            <p className="text-sm text-muted-foreground">Loading shows...</p>
          </div>
        </div>
      }>
        <ShowGrid />
      </Suspense>
    </div>
  );
}