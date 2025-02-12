import { createClient } from '@/lib/supabase/server';
import { Cue } from '@/types/cue';
import CueListClient from './cue-list-client';

export default async function CueList({ showId }: { showId: string }) {
  const supabase = await createClient();
  
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

  return <CueListClient initialCues={cues || []} showId={showId} />;
}