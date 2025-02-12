import { Suspense } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import ShowHeader from '@/components/shows/show-header';
import CueList from '@/components/shows/cue-list/cue-list';
import { createClient } from '@/lib/supabase/server';
import { Show } from '@/types/show';

// Function to check if user has access to the show
async function checkShowAccess(showId: string, userId: string): Promise<boolean> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('permissions')
    .select('*')
    .eq('show_id', showId)
    .eq('user_id', userId)
    .single();
  
  if (error) {
    console.error('Error checking show access:', error);
    return false;
  }
  
  return !!data;
}

// Function to fetch show data
async function getShow(id: string): Promise<Show> {
  const supabase = await createClient();
  
  // First get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    throw new Error('Not authenticated');
  }
  
  // Check if user has access to the show
  const hasAccess = await checkShowAccess(id, user.id);
  if (!hasAccess) {
    throw new Error('Not authorized to view this show');
  }
  
  // Fetch show data
  const { data: show, error: showError } = await supabase
    .from('shows')
    .select('*')
    .eq('id', id)
    .single();
  
  if (showError || !show) {
    notFound();
  }

  return show;
}

// Function to delete a show
async function deleteShow(id: string): Promise<void> {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('shows')
    .delete()
    .eq('id', id);
  
  if (error) {
    throw error;
  }
}

// Helper component for delete confirmation dialog
function DeleteConfirmationDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  showName 
}: { 
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  showName: string;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Show</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete &quot;{showName}&quot;? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete Show
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default async function ShowPage({
  params,
}: {
  params: { id: string };
}) {
  const show = await getShow(params.id);
  const router = useRouter();
  
  // Show actions
  const handleStart = async () => {
    // TODO: Implement show start logic
    // This might involve:
    // 1. Creating a new show session
    // 2. Setting initial cue states
    // 3. Redirecting to the show runner interface
    router.push(`/shows/${params.id}/run`);
  };
  
  const handleSettings = () => {
    router.push(`/shows/${params.id}/settings`);
  };
  
  const handleDelete = async () => {
    try {
      await deleteShow(params.id);
      router.push('/dashboard');
    } catch (error) {
      console.error('Error deleting show:', error);
      // TODO: Show error notification
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Show Header */}
      <Suspense fallback={
        <div className="h-40 bg-muted animate-pulse rounded-lg" />
      }>
        <ShowHeader 
          show={show}
          onStart={handleStart}
          onSettings={handleSettings}
          onDelete={handleDelete}
        />
      </Suspense>

      {/* Show Content */}
      <div className="grid gap-6">
        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Suspense fallback={
            <div className="h-24 bg-muted animate-pulse rounded-lg" />
          }>
            {/* TODO: Add show statistics components */}
          </Suspense>
        </div>

        {/* Cue List */}
        <Suspense fallback={
          <div className="h-96 bg-muted animate-pulse rounded-lg" />
        }>
          <CueList showId={params.id} />
        </Suspense>
      </div>
    </div>
  );
}

// Loading state component
export function Loading() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="h-40 bg-muted animate-pulse rounded-lg" />
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
      <div className="h-96 bg-muted animate-pulse rounded-lg" />
    </div>
  );
}

// Error state component
export function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container mx-auto py-6">
      <div className="max-w-xl mx-auto text-center">
        <h1 className="text-2xl font-bold text-destructive mb-4">
          Error Loading Show
        </h1>
        <p className="text-muted-foreground mb-6">
          {error.message}
        </p>
        <Button onClick={reset}>Try Again</Button>
      </div>
    </div>
  );
}

// Not found state
export function NotFound() {
  return (
    <div className="container mx-auto py-6">
      <div className="max-w-xl mx-auto text-center">
        <h1 className="text-2xl font-bold mb-4">Show Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The show you're looking for doesn't exist or you don't have access to it.
        </p>
        <Button asChild>
          <Link href="/dashboard">Return to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}