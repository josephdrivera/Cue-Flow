import { Suspense } from 'react';
import CueList from '@/components/shows/cue-list/cue-list';

export default async function ShowPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div>
      <Suspense fallback={<div>Loading show...</div>}>
        <CueList showId={params.id} />
      </Suspense>
    </div>
  );
}