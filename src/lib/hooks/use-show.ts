import { useState, useEffect } from 'react';
import { Show } from '@/types/show';
import { createClient } from '@/lib/supabase/client';

export function useShow(showId: string) {
  const [show, setShow] = useState<Show | null>(null);
  // TODO: Implement show data fetching and real-time updates
  return { show };
}