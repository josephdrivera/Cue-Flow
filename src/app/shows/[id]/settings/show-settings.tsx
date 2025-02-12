import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import ShowSettings from './show-settings';

async function getShow(id: string) {
  const supabase = await createClient();
  
  const { data: show, error } = await supabase
    .from('shows')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error || !show) {
    notFound();
  }

  return show;
}

export default async function ShowSettingsPage({
  params,
}: {
  params: { id: string };
}) {
  const show = await getShow(params.id);
  
  return <ShowSettings show={show} />;
}

// Loading state
export function Loading() {
  return (
    <div className="container mx-auto py-6 max-w-4xl space-y-6">
      <div className="h-12 w-48 bg-muted animate-pulse rounded-lg mb-8" />
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    </div>
  );
}

// Error state
export function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container mx-auto py-6 max-w-4xl text-center">
      <h1 className="text-2xl font-bold text-destructive mb-4">
        Error Loading Settings
      </h1>
      <p className="text-muted-foreground mb-6">
        {error.message}
      </p>
      <Button onClick={reset}>Try Again</Button>
    </div>
  );
}