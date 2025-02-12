import { createClient } from '@/lib/supabase/server';
import CueRow from './cue-row';
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

export default async function CueList({ showId }: { showId: string }) {
  const supabase = await createClient();
  
  // Fetch cues for the show
  const { data: cues, error } = await supabase
    .from('cues')
    .select(`
      id,
      cue_number,
      start_time,
      run_time,
      end_time,
      activity,
      graphics,
      video,
      audio,
      lighting,
      notes,
      status
    `)
    .eq('show_id', showId)
    .order('cue_number');

  if (error) {
    throw new Error(`Error fetching cues: ${error.message}`);
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Cues</CardTitle>
        <Button size="sm" className="flex items-center gap-2">
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
            {cues?.map((cue: Cue) => (
              <CueRow key={cue.id} cue={cue} />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}