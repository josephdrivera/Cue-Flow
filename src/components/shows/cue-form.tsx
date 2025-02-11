'use client';

import { useState } from 'react';
import { Cue } from '@/types/cue';

export default function CueForm({
  initialData,
  onSubmit,
}: {
  initialData?: Partial<Cue>;
  onSubmit: (data: Partial<Cue>) => Promise<void>;
}) {
  // TODO: Implement cue form
  return <form>{/* Form fields */}</form>;
}
