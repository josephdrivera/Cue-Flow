'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import CueRow from './cue-row';
import CueForm from '../cue-form';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Cue } from '@/types/cue';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useCues } from '@/lib/hooks/use-cues';

interface CueListClientProps {
  initialCues: Cue[];
  showId: string;
}

export default function CueListClient({ initialCues, showId }: CueListClientProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCue, setSelectedCue] = useState<Cue | null>(null);
  
  const {
    cues,
    createCue,
    updateCue,
    deleteCue,
  } = useCues({ showId, initialCues });

  const handleCreateCue = async (data: Partial<Cue>) => {
    try {
      await createCue(data);
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error creating cue:', error);
    }
  };

  const handleUpdateCue = async (data: Partial<Cue>) => {
    if (!selectedCue?.id) return;
    
    try {
      await updateCue(selectedCue.id, data);
      setIsFormOpen(false);
      setSelectedCue(null);
    } catch (error) {
      console.error('Error updating cue:', error);
    }
  };

  const handleEditClick = (cue: Cue) => {
    setSelectedCue(cue);
    setIsFormOpen(true);
  };

  const handleDeleteCue = async (id: string) => {
    try {
      await deleteCue(id);
    } catch (error) {
      console.error('Error deleting cue:', error);
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Cues</CardTitle>
          <Button 
            size="sm" 
            className="flex items-center gap-2"
            onClick={() => {
              setSelectedCue(null);
              setIsFormOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Add Cue
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Cue #</TableHead>
                <TableHead className="w-[100px]">Start</TableHead>
                <TableHead className="w-[100px]">Duration</TableHead>
                <TableHead className="w-[100px]">End</TableHead>
                <TableHead>Activity</TableHead>
                <TableHead>Graphics</TableHead>
                <TableHead>Video</TableHead>
                <TableHead>Audio</TableHead>
                <TableHead>Lighting</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cues.map((cue: Cue) => (
                <CueRow 
                  key={cue.id} 
                  cue={cue} 
                  onEdit={() => handleEditClick(cue)}
                  onDelete={() => handleDeleteCue(cue.id)}
                />
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-2xl">
          <CueForm
            initialData={selectedCue || undefined}
            onSubmit={selectedCue ? handleUpdateCue : handleCreateCue}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}