'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function NewShowPage() {
  const router = useRouter();
  const [showName, setShowName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!showName.trim()) {
      setError('Show name is required');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const supabase = createClient();

      // First get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Not authenticated');
      }

      // Create the show
      const { data: show, error: createError } = await supabase
        .from('shows')
        .insert([
          {
            name: showName.trim(),
            owner_id: user.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (createError) throw createError;
      if (!show) throw new Error('Failed to create show');

      // Redirect to the new show's page
      router.push(`/shows/${show.id}`);
    } catch (err) {
      console.error('Error creating show:', err);
      setError(err instanceof Error ? err.message : 'Failed to create show');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-2xl mx-auto py-6">
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Create New Show</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="showName" className="text-sm font-medium">
                Show Name
                <span className="text-destructive">*</span>
              </label>
              <Input
                id="showName"
                value={showName}
                onChange={(e) => {
                  setShowName(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Enter show name"
                className={error ? 'border-destructive' : ''}
              />
              {error && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Show'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}