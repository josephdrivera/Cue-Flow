export interface Cue {
    id: string;
    cue_list_id: string;
    cue_number: string;
    start_time?: string;
    run_time?: string;
    end_time?: string;
    activity?: string;
    graphics?: string;
    video?: string;
    audio?: string;
    lighting?: string;
    notes?: string;
    status: 'completed' | 'active' | 'standby' | 'upcoming';
  }
  