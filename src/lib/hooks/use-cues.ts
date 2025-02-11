import { useState, useEffect } from 'react';
import { Cue } from '@/types/cue';
import { createClient } from '@/lib/supabase/client';

export function useCues(showId: string) {
  const [cues, setCues] = useState<Cue[]>([]);
  // TODO: Implement real-time subscription to cues
  return { cues };
}
