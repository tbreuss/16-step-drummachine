import React, { useCallback, useEffect, useState } from 'react';
import { drumSynth } from './audio/drumSynth';
import { DrumGrid } from './components/DrumGrid';
import { ExportModal } from './components/ExportModal';
import { Header } from './components/Header';
import { TrackSettingsModal } from './components/TrackSettingsModal';
import { TransportBar } from './components/TransportBar';
import { BEAT_PRESETS, DEFAULT_TRACKS } from './data/presets';
import { BeatPreset, DrumKitId, DrumSoundId, DrumTrack } from './types';
import { Music, Play, HelpCircle, Keyboard } from 'lucide-react';
import { useLanguage } from './i18n/LanguageContext';
import { downloadFile } from './utils/wavEncoder';

export default function App() {
  const { t } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(116);
  const [swing, setSwing] = useState(0.1);
  const [masterVolume, setMasterVolume] = useState(0.85);
  const [currentKit, setCurrentKit] = useState<DrumKitId>('classic808');
  const [tracks, setTracks] = useState<DrumTrack[]>(DEFAULT_TRACKS);
  const [currentStep, setCurrentStep] = useState(0);
  const [beatName, setBeatName] = useState(t.defaultBeatName);

  // Modals
  const [settingsTrack, setSettingsTrack] = useState<DrumTrack | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [showKeymap, setShowKeymap] = useState(false);

  // Synchronize master volume
  useEffect(() => {
    drumSynth.setMasterVolume(masterVolume);
  }, [masterVolume]);

  // Handle step callback from Audio Engine
  const handleStepChange = useCallback((step: number) => {
    setCurrentStep(step);
  }, []);

  // Toggle Play / Pause
  const handleTogglePlay = useCallback(() => {
    if (isPlaying) {
      drumSynth.stopSequencer();
      setIsPlaying(false);
      setCurrentStep(0);
    } else {
      drumSynth.startSequencer(tracks, bpm, swing, currentKit, handleStepChange);
      setIsPlaying(true);
    }
  }, [isPlaying, tracks, bpm, swing, currentKit, handleStepChange]);

  // Synchronize audio synth parameters & tracks in real time
  useEffect(() => {
    drumSynth.setTracks(tracks);
    if (isPlaying) {
      drumSynth.updateParams(bpm, swing, currentKit, tracks);
    }
  }, [tracks, bpm, swing, currentKit, isPlaying]);

  // Step Toggles
  const handleToggleStep = (trackId: string, stepIndex: number) => {
    setTracks((prev) =>
      prev.map((t) => {
        if (t.id === trackId) {
          const newSteps = [...t.steps];
          newSteps[stepIndex] = !newSteps[stepIndex];

          // Trigger sound immediately for feedback when toggled ON
          if (newSteps[stepIndex]) {
            drumSynth.playPreview(t, currentKit);
          }
          return { ...t, steps: newSteps };
        }
        return t;
      })
    );
  };

  const handleToggleAccent = (trackId: string, stepIndex: number) => {
    setTracks((prev) =>
      prev.map((t) => {
        if (t.id === trackId) {
          const newVelocities = [...t.velocities];
          const curr = newVelocities[stepIndex] ?? 1.0;
          newVelocities[stepIndex] = curr > 0.8 ? 0.5 : 1.0;
          return { ...t, velocities: newVelocities };
        }
        return t;
      })
    );
  };

  // Mute & Solo
  const handleToggleMute = (trackId: string) => {
    setTracks((prev) =>
      prev.map((t) => (t.id === trackId ? { ...t, muted: !t.muted } : t))
    );
  };

  const handleToggleSolo = (trackId: string) => {
    setTracks((prev) =>
      prev.map((t) => (t.id === trackId ? { ...t, soloed: !t.soloed } : t))
    );
  };

  // Track settings update
  const handleUpdateTrack = (updatedTrack: DrumTrack) => {
    setTracks((prev) =>
      prev.map((t) => (t.id === updatedTrack.id ? updatedTrack : t))
    );
    setSettingsTrack(updatedTrack);
  };

  // Load Preset
  const handleLoadPreset = (preset: BeatPreset) => {
    setBpm(preset.bpm);
    setSwing(preset.swing);
    setCurrentKit(preset.kit);
    setBeatName(preset.name);

    setTracks((prev) =>
      prev.map((track) => {
        const presetSteps = preset.tracks[track.id as DrumSoundId];
        return {
          ...track,
          steps: presetSteps ? [...presetSteps] : Array(16).fill(false),
          velocities: Array(16).fill(1.0),
        };
      })
    );
  };

  // Clear Pattern
  const handleClearPattern = () => {
    setBeatName(t.newBeatName);
    setTracks((prev) =>
      prev.map((t) => ({
        ...t,
        steps: Array(16).fill(false),
      }))
    );
  };

  // Randomize Pattern
  const handleRandomizePattern = () => {
    setTracks((prev) =>
      prev.map((t) => {
        // Density based on drum sound type
        let prob = 0.25;
        if (t.id === 'kick') prob = 0.35;
        if (t.id === 'hihat_closed') prob = 0.65;
        if (t.id === 'snare' || t.id === 'clap') prob = 0.2;

        const newSteps = Array(16)
          .fill(false)
          .map(() => Math.random() < prob);
        return { ...t, steps: newSteps };
      })
    );
  };

  // Direct 1-click JSON Download
  const handleSaveJSON = () => {
    const tracksData: Record<string, boolean[]> = {};
    const velocitiesData: Record<string, number[]> = {};

    tracks.forEach((track) => {
      tracksData[track.id] = track.steps;
      velocitiesData[track.id] = track.velocities;
    });

    const jsonContent = JSON.stringify(
      {
        version: '1.0',
        name: beatName.trim() || t.defaultBeatName,
        bpm,
        swing,
        kit: currentKit,
        tracks: tracksData,
        velocities: velocitiesData,
      },
      null,
      2
    );

    const cleanName = (beatName.trim() || t.defaultBeatName).replace(/[^a-zA-Z0-9_\-]/g, '_');
    const filename = `${cleanName}_${bpm}BPM.json`;
    const blob = new Blob([jsonContent], { type: 'application/json' });
    downloadFile(blob, filename);
  };

  const handleImportJSON = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.name) setBeatName(parsed.name);
      if (parsed.bpm) setBpm(parsed.bpm);
      if (parsed.swing !== undefined) setSwing(parsed.swing);
      if (parsed.kit) setCurrentKit(parsed.kit);

      if (parsed.tracks) {
        setTracks((prev) =>
          prev.map((t) => {
            const importedSteps = parsed.tracks[t.id];
            const importedVels = parsed.velocities?.[t.id];
            return {
              ...t,
              steps: importedSteps ? [...importedSteps] : t.steps,
              velocities: importedVels ? [...importedVels] : t.velocities,
            };
          })
        );
      }
    } catch (err) {
      alert(t.invalidJson);
    }
  };

  // Keyboard Shortcuts (Space for Play/Stop, Q/W/E/R... for Live Pad Play)
  useEffect(() => {
    const keyMap: Record<string, string> = {
      q: 'kick',
      w: 'snare',
      e: 'clap',
      r: 'hihat_closed',
      t: 'hihat_open',
      y: 'tom_low',
      u: 'tom_high',
      i: 'cowbell',
      o: 'shaker',
      p: 'cymbal',
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user typing in input field
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'SELECT'
      ) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        handleTogglePlay();
        return;
      }

      const soundId = keyMap[e.key.toLowerCase()];
      if (soundId) {
        const targetTrack = tracks.find((t) => t.id === soundId);
        if (targetTrack) {
          drumSynth.playPreview(targetTrack, currentKit);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleTogglePlay, tracks, currentKit]);

  return (
    <div className="min-h-screen bg-[#0B0C10] text-[#C5C6C7] flex flex-col font-sans selection:bg-[#66FCF1] selection:text-[#0B0C10]">
      {/* Header */}
      <Header
        beatName={beatName}
        onBeatNameChange={setBeatName}
        currentKit={currentKit}
        onSelectKit={setCurrentKit}
        onLoadPreset={handleLoadPreset}
        onClearPattern={handleClearPattern}
        onRandomizePattern={handleRandomizePattern}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onImportJSON={handleImportJSON}
        onSaveJSON={handleSaveJSON}
      />

      {/* Transport Controls & Visualizer */}
      <TransportBar
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        bpm={bpm}
        onBpmChange={setBpm}
        swing={swing}
        onSwingChange={setSwing}
        masterVolume={masterVolume}
        onMasterVolumeChange={setMasterVolume}
        currentStep={currentStep}
      />

      {/* Main Drum Sequencer Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col gap-6">
        <DrumGrid
          tracks={tracks}
          onToggleStep={handleToggleStep}
          onToggleAccent={handleToggleAccent}
          onToggleMute={handleToggleMute}
          onToggleSolo={handleToggleSolo}
          onOpenTrackSettings={(t) => setSettingsTrack(t)}
          currentStep={currentStep}
          isPlaying={isPlaying}
          currentKit={currentKit}
        />

        {/* Keyboard Live Play Helper Card */}
        <div className="bg-[#1F2833] border border-[#45A29E]/30 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded bg-[#0B0C10] text-[#66FCF1] border border-[#66FCF1]/30 shadow-[0_0_8px_rgba(102,252,241,0.2)]">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#66FCF1] uppercase tracking-wider">
                {t.keyboardHeader}
              </h4>
              <p className="text-xs text-[#C5C6C7] mt-0.5">
                {t.pressSpace} <kbd className="px-1.5 py-0.5 bg-[#0B0C10] text-[#66FCF1] font-mono text-[11px] rounded border border-[#66FCF1]/30">{t.spacebar}</kbd> {t.forStartStop} <kbd className="px-1.5 py-0.5 bg-[#0B0C10] text-[#66FCF1] font-mono text-[11px] rounded border border-[#66FCF1]/30">Q W E R T Y U I O P</kbd> {t.toTriggerLive}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowKeymap(!showKeymap)}
            className="px-3.5 py-1.5 bg-[#0B0C10] hover:bg-[#45A29E]/20 text-[#C5C6C7] hover:text-[#66FCF1] text-xs font-mono font-bold rounded border border-[#1F2833] transition cursor-pointer"
          >
            {showKeymap ? t.hideKeymap : t.showKeymap}
          </button>
        </div>

        {/* Keymap Grid expansion */}
        {showKeymap && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 bg-[#1F2833] p-4 rounded-xl border border-[#45A29E]/30 animate-in fade-in duration-150">
            {[
              { key: 'Q', sound: 'Kick Drum' },
              { key: 'W', sound: 'Snare Drum' },
              { key: 'E', sound: 'Hand Clap' },
              { key: 'R', sound: 'Closed Hi-Hat' },
              { key: 'T', sound: 'Open Hi-Hat' },
              { key: 'Y', sound: 'Low Tom' },
              { key: 'U', sound: 'High Tom' },
              { key: 'I', sound: 'Cowbell' },
              { key: 'O', sound: 'Shaker' },
              { key: 'P', sound: 'Crash Cymbal' },
            ].map((item) => (
              <div
                key={item.key}
                className="flex items-center gap-2.5 bg-[#0B0C10] p-2.5 rounded border border-[#1F2833]"
              >
                <kbd className="w-7 h-7 bg-[#66FCF1]/10 text-[#66FCF1] font-mono font-black text-xs rounded border border-[#66FCF1]/40 flex items-center justify-center">
                  {item.key}
                </kbd>
                <span className="text-xs font-semibold text-[#C5C6C7]">
                  {item.sound}
                </span>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#0B0C10] border-t border-[#1F2833] py-4 px-6 text-center text-[10px] tracking-[0.2em] uppercase text-[#45A29E] font-medium">
        {t.footerText}
      </footer>

      {/* Track Settings Modal */}
      <TrackSettingsModal
        track={settingsTrack}
        onClose={() => setSettingsTrack(null)}
        onUpdateTrack={handleUpdateTrack}
      />

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        tracks={tracks}
        bpm={bpm}
        swing={swing}
        currentKit={currentKit}
        beatName={beatName}
        onBeatNameChange={setBeatName}
      />
    </div>
  );
}
