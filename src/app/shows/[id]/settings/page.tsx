'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, Users, Archive, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { createClient } from '@/lib/supabase/client';
import { Show } from '@/types/show';

interface ShowSettingsProps {
  show: Show;
}

export default function ShowSettings({ show }: ShowSettingsProps) {
  const router = useRouter();
  const [showName, setShowName] = useState(show.name);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const supabase = createClient();
      const { error: updateError } = await supabase
        .from('shows')
        .update({ 
          name: showName,
          updated_at: new Date().toISOString()
        })
        .eq('id', show.id);

      if (updateError) throw updateError;
      router.refresh();
    } catch (err) {
      console.error('Error updating show:', err);
      setError(err instanceof Error ? err.message : 'Failed to update show');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-6 max-w-4xl space-y-6">
      <h1 className="text-3xl font-bold mb-8">Show Settings</h1>

      {/* Basic Settings */}
      <Card>
        <form onSubmit={handleUpdate}>
          <CardHeader>
            <CardTitle>Basic Settings</CardTitle>
            <CardDescription>
              Update your show's basic information
            </CardDescription>
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
                onChange={(e) => setShowName(e.target.value)}
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
          <CardFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Team Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Management
          </CardTitle>
          <CardDescription>
            Manage who has access to this show
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* TODO: Implement team management component */}
          <p className="text-sm text-muted-foreground">
            Team management features coming soon...
          </p>
        </CardContent>
        <CardFooter>
          <Button variant="outline" disabled>
            Invite Team Member
          </Button>
        </CardFooter>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>
            Irreversible and destructive actions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <h4 className="font-medium">Archive Show</h4>
              <p className="text-sm text-muted-foreground">
                Archive this show and hide it from the dashboard
              </p>
            </div>
            <Button variant="outline" className="gap-2" disabled>
              <Archive className="h-4 w-4" />
              Archive
            </Button>
          </div>
          <div className="flex items-center justify-between py-2 border-t">
            <div>
              <h4 className="font-medium text-destructive">Delete Show</h4>
              <p className="text-sm text-muted-foreground">
                Permanently delete this show and all its data
              </p>
            </div>
            <Button variant="destructive" className="gap-2">
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}