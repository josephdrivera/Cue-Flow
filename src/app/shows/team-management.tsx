'use client';

import { useState, useEffect } from 'react';
import { Plus, UserX, Shield, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { createClient } from '@/lib/supabase/client';

interface TeamMember {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  invited?: boolean;
}

interface TeamManagementProps {
  showId: string;
  currentUserId: string;
}

export default function TeamManagement({ showId, currentUserId }: TeamManagementProps) {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<TeamMember['role']>('member');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch team members
  useEffect(() => {
    const fetchMembers = async () => {
      const supabase = createClient();
      
      try {
        const { data, error: fetchError } = await supabase
          .from('permissions')
          .select(`
            user_id,
            role,
            users (
              id,
              email,
              name
            )
          `)
          .eq('show_id', showId);

        if (fetchError) throw fetchError;

        if (data) {
          const formattedMembers: TeamMember[] = data.map(item => ({
            id: item.user_id,
            email: item.users.email,
            name: item.users.name,
            role: item.role as TeamMember['role']
          }));
          setMembers(formattedMembers);
        }
      } catch (err) {
        console.error('Error fetching team members:', err);
        setError('Failed to load team members');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, [showId]);

  // Handle role change
  const handleRoleChange = async (userId: string, newRole: TeamMember['role']) => {
    const supabase = createClient();
    
    try {
      const { error: updateError } = await supabase
        .from('permissions')
        .update({ role: newRole })
        .eq('show_id', showId)
        .eq('user_id', userId);

      if (updateError) throw updateError;

      setMembers(prev =>
        prev.map(member =>
          member.id === userId ? { ...member, role: newRole } : member
        )
      );
    } catch (err) {
      console.error('Error updating role:', err);
      setError('Failed to update role');
    }
  };

  // Handle member removal
  const handleRemoveMember = async (userId: string) => {
    const supabase = createClient();
    
    try {
      const { error: deleteError } = await supabase
        .from('permissions')
        .delete()
        .eq('show_id', showId)
        .eq('user_id', userId);

      if (deleteError) throw deleteError;

      setMembers(prev => prev.filter(member => member.id !== userId));
    } catch (err) {
      console.error('Error removing member:', err);
      setError('Failed to remove team member');
    }
  };

  // Handle member invite
  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const supabase = createClient();
    
    try {
      // First check if user exists
      const { data: existingUser, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('email', inviteEmail)
        .single();

      if (userError && userError.code !== 'PGRST116') {
        throw userError;
      }

      if (existingUser) {
        // Add permission for existing user
        const { error: permissionError } = await supabase
          .from('permissions')
          .insert([
            {
              show_id: showId,
              user_id: existingUser.id,
              role: inviteRole
            }
          ]);

        if (permissionError) throw permissionError;

        // Add to local state
        setMembers(prev => [...prev, {
          id: existingUser.id,
          email: inviteEmail,
          name: '',
          role: inviteRole
        }]);
      } else {
        // Create invitation
        const { error: inviteError } = await supabase
          .from('invitations')
          .insert([
            {
              show_id: showId,
              email: inviteEmail,
              role: inviteRole
            }
          ]);

        if (inviteError) throw inviteError;

        // Add to local state with invited flag
        setMembers(prev => [...prev, {
          id: `pending-${Date.now()}`,
          email: inviteEmail,
          name: '',
          role: inviteRole,
          invited: true
        }]);
      }

      setIsInviteDialogOpen(false);
      setInviteEmail('');
      setInviteRole('member');
    } catch (err) {
      console.error('Error inviting member:', err);
      setError('Failed to invite team member');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div>Loading team members...</div>;
  }

  return (
    <div className="space-y-4">
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Member</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id}>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">
                    {member.name || member.email}
                  </span>
                  {member.name && (
                    <span className="text-sm text-muted-foreground">
                      {member.email}
                    </span>
                  )}
                  {member.invited && (
                    <span className="text-sm text-muted-foreground">
                      (Invited)
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Select
                  value={member.role}
                  onValueChange={(value: TeamMember['role']) => 
                    handleRoleChange(member.id, value)
                  }
                  disabled={member.id === currentUserId}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="owner">Owner</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                {member.id !== currentUserId && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveMember(member.id)}
                  >
                    <UserX className="h-4 w-4" />
                    <span className="sr-only">Remove member</span>
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Button
        onClick={() => setIsInviteDialogOpen(true)}
        className="flex items-center gap-2"
      >
        <Plus className="h-4 w-4" />
        Invite Team Member
      </Button>

      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
            <DialogDescription>
              Invite a new member to join your show team.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleInvite} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Email Address
              </label>
              <Input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="colleague@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Role
              </label>
              <Select
                value={inviteRole}
                onValueChange={(value: TeamMember['role']) => 
                  setInviteRole(value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsInviteDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Inviting...' : 'Send Invitation'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}