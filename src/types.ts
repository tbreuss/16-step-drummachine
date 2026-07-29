export type DrumSoundId = 
  | 'kick'
  | 'snare'
  | 'hihat_closed'
  | 'hihat_open'
  | 'clap'
  | 'tom_low'
  | 'tom_mid'
  | 'tom_high'
  | 'cowbell'
  | 'rimshot'
  | 'shaker'
  | 'cymbal';

export type DrumKitId = 'classic808' | 'dance909' | 'synthwave' | 'acoustic' | 'analog_warmth';

export interface DrumKitInfo {
  id: DrumKitId;
  name: string;
  description: string;
}

export interface DrumTrack {
  id: DrumSoundId;
  name: string;
  shortName: string;
  category: 'kick' | 'snare' | 'hihat' | 'percussion' | 'cymbals';
  color: string;
  activeColor: string;
  volume: number; // 0 to 1
  pan: number; // -1 to 1
  pitch: number; // -12 to +12 semitones
  muted: boolean;
  soloed: boolean;
  steps: boolean[]; // 16 steps
  velocities: number[]; // 0.2 to 1.0 per step
}

export interface BeatPreset {
  id: string;
  name: string;
  category: 'Hip-Hop' | 'Electronic' | 'Rock & Funk' | 'Pop & Disco' | 'Experimental';
  bpm: number;
  swing: number;
  kit: DrumKitId;
  description: string;
  tracks: Record<DrumSoundId, boolean[]>;
}

export interface ExportSettings {
  bars: number; // 1, 2, or 4 bars
  normalize: boolean;
  format: 'wav' | 'json';
}
