import { Suspense } from 'react';
import CueRow from './cue-row';

export default async function CueList({ showId }: { showId: string }) {
  // TODO: Implement server-side cue fetching
  return (
    <div>
      <Suspense fallback={<div>Loading cues...</div>}>
        {/* TODO: Implement cue list rendering */}
      </Suspense>
    </div>
  );
}
