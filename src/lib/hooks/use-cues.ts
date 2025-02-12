import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Cue } from '@/types/cue';
import { sortCues, parseCueNumber, getNextCueNumberForPrefix } from '@/lib/utils/cues';
import { calculateEndTime } from '@/lib/utils/time';

interface UseCuesOptions {
  showId: string;
  initialCues?: Cue[];
}

interface UseCuesReturn {
  cues: Cue[];
  isLoading: boolean;
  error: Error | null;
  createCue: (cue: Partial<Cue>) => Promise<void>;
  updateCue: (id: string, updates: Partial<Cue>) => Promise<void>;
  deleteCue: (id: string) => Promise<void>;
  reorderCue: (id: string, newPosition: number) => Promise<void>;
}

export function useCues({ showId, initialCues = [] }: UseCuesOptions): UseCuesReturn {
  const [cues, setCues] = useState<Cue[]>(initialCues);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const supabase = createClient();

    // Initial fetch
    const fetchCues = async () => {
      try {
        setIsLoading(true);
        const { data, error: fetchError } = await supabase
          .from('cues')
          .select('*')
          .eq('show_id', showId)
          .order('cue_number');

        if (fetchError) throw fetchError;
        
        if (data) {
          // Process and sort cues
          const processedCues = data.map(cue => ({
            ...cue,
            end_time: cue.start_time && cue.run_time 
              ? calculateEndTime(cue.start_time, cue.run_time)
              : undefined
          }));
          setCues(sortCues(processedCues));
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch cues'));
      } finally {
        setIsLoading(false);
      }
    };

    // Set up real-time subscription
    const channel = supabase
      .channel(`cues:${showId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cues',
          filter: `show_id=eq.${showId}`
        },
        async (payload) => {
          // Handle different types of changes
          switch (payload.eventType) {
            case 'INSERT':
              setCues(prev => sortCues([...prev, payload.new as Cue]));
              break;
            case 'UPDATE':
              setCues(prev => 
                sortCues(prev.map(cue => 
                  cue.id === payload.new.id ? payload.new as Cue : cue
                ))
              );
              break;
            case 'DELETE':
              setCues(prev => 
                prev.filter(cue => cue.id !== payload.old.id)
              );
              break;
          }
        }
      )
      .subscribe();

    // Initial fetch
    fetchCues();

    // Cleanup subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, [showId]);

  const createCue = async (cue: Partial<Cue>) => {
    const supabase = createClient();
    
    try {
      const { error: createError } = await supabase
        .from('cues')
        .insert([{ ...cue, show_id: showId }]);

      if (createError) throw createError;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create cue'));
      throw err;
    }
  };

  const updateCue = async (id: string, updates: Partial<Cue>) => {
    const supabase = createClient();
    
    try {
      const { error: updateError } = await supabase
        .from('cues')
        .update(updates)
        .eq('id', id);

      if (updateError) throw updateError;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update cue'));
      throw err;
    }
  };

  const deleteCue = async (id: string) => {
    const supabase = createClient();
    
    try {
      const { error: deleteError } = await supabase
        .from('cues')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete cue'));
      throw err;
    }
  };

  const reorderCue = async (id: string, newPosition: number) => {
    const supabase = createClient();
    
    try {
      // Get the cue being moved
      const currentCue = cues.find(cue => cue.id === id);
      if (!currentCue) {
        throw new Error('Cue not found');
      }

      // Get sorted cues for the relevant section
      const sortedCues = sortCues(cues);
      const targetIndex = Math.min(Math.max(0, newPosition), sortedCues.length - 1);
      const targetCue = sortedCues[targetIndex];

      // Determine new cue number based on position
      let newCueNumber: string;

      if (targetIndex === 0) {
        // Moving to start - use number before first cue
        const firstCue = sortedCues[0];
        const { prefix } = parseCueNumber(firstCue.cue_number);
        newCueNumber = `${prefix}100`;
      } else if (targetIndex === sortedCues.length - 1) {
        // Moving to end - use next available number
        const lastCue = sortedCues[sortedCues.length - 1];
        const { prefix } = parseCueNumber(lastCue.cue_number);
        newCueNumber = getNextCueNumberForPrefix(cues, prefix);
      } else {
        // Moving between two cues
        const prevCue = sortedCues[targetIndex - 1];
        const nextCue = sortedCues[targetIndex];
        const { prefix: prevPrefix, number: prevNum } = parseCueNumber(prevCue.cue_number);
        const { number: nextNum } = parseCueNumber(nextCue.cue_number);
        
        // Calculate a number between the two positions
        const newNum = Math.floor((prevNum + nextNum) / 2);
        newCueNumber = `${prevPrefix}${newNum}`;
      }

      // Update the cue with new number
      const { error: updateError } = await supabase
        .from('cues')
        .update({ cue_number: newCueNumber })
        .eq('id', id);

      if (updateError) throw updateError;

    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to reorder cue'));
      throw err;
    }
  };

  return {
    cues,
    isLoading,
    error,
    createCue,
    updateCue,
    deleteCue,
    reorderCue
  };
}