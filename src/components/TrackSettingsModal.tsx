import React from 'react';
import { Sliders, Volume2, X } from 'lucide-react';
import { DrumTrack } from '../types';

interface TrackSettingsModalProps {
  track: DrumTrack | null;
  onClose: () => void;
  onUpdateTrack: (updated: DrumTrack) => void;
}

export const TrackSettingsModal: React.FC<TrackSettingsModalProps> = ({
  track,
  onClose,
  onUpdateTrack,
}) => {
  if (!track) return null;

  const handleFillFour = () => {
    const newSteps = Array(16).fill(false);
    [0, 4, 8, 12].forEach((i) => (newSteps[i] = true));
    onUpdateTrack({ ...track, steps: newSteps });
  };

  const handleFillAll = () => {
    onUpdateTrack({ ...track, steps: Array(16).fill(true) });
  };

  const handleClearTrack = () => {
    onUpdateTrack({ ...track, steps: Array(16).fill(false) });
  };

  const handleFillOffbeat = () => {
    const newSteps = Array(16).fill(false);
    [2, 6, 10, 14].forEach((i) => (newSteps[i] = true));
    onUpdateTrack({ ...track, steps: newSteps });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0B0C10] border border-[#66FCF1]/30 rounded-xl w-full max-w-md p-6 shadow-2xl text-[#C5C6C7] relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1F2833] mb-6">
          <div className="flex items-center gap-3">
            <div
              className={`w-4 h-4 rounded-full ${track.color} shadow-md`}
            />
            <h3 className="text-lg font-black tracking-tight text-[#66FCF1] flex items-center gap-2 uppercase">
              Spur-Einstellungen: {track.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#45A29E] hover:text-[#66FCF1] hover:bg-[#1F2833] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-6">
          {/* Volume */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[#45A29E] uppercase tracking-wider">Lautstärke</span>
              <span className="font-mono text-[#66FCF1] font-bold">
                {Math.round(track.volume * 100)}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={track.volume}
              onChange={(e) =>
                onUpdateTrack({
                  ...track,
                  volume: parseFloat(e.target.value),
                })
              }
              className="w-full accent-[#66FCF1] cursor-pointer h-2 bg-[#1F2833] rounded-lg appearance-none"
            />
          </div>

          {/* Pan */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[#45A29E] uppercase tracking-wider">Panorama (Pan)</span>
              <span className="font-mono text-[#66FCF1] font-bold">
                {track.pan === 0
                  ? 'Center (C)'
                  : track.pan < 0
                  ? `L ${Math.abs(Math.round(track.pan * 100))}%`
                  : `R ${Math.round(track.pan * 100)}%`}
              </span>
            </div>
            <input
              type="range"
              min={-1}
              max={1}
              step={0.05}
              value={track.pan}
              onChange={(e) =>
                onUpdateTrack({
                  ...track,
                  pan: parseFloat(e.target.value),
                })
              }
              className="w-full accent-[#66FCF1] cursor-pointer h-2 bg-[#1F2833] rounded-lg appearance-none"
            />
          </div>

          {/* Pitch */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[#45A29E] uppercase tracking-wider">Tonhöhe (Pitch)</span>
              <span className="font-mono text-[#66FCF1] font-bold">
                {track.pitch > 0 ? `+${track.pitch}` : track.pitch} Halbton
                {Math.abs(track.pitch) !== 1 ? 'schritte' : ''}
              </span>
            </div>
            <input
              type="range"
              min={-12}
              max={12}
              step={1}
              value={track.pitch}
              onChange={(e) =>
                onUpdateTrack({
                  ...track,
                  pitch: parseInt(e.target.value, 10),
                })
              }
              className="w-full accent-[#66FCF1] cursor-pointer h-2 bg-[#1F2833] rounded-lg appearance-none"
            />
          </div>

          {/* Quick Step Filling Actions */}
          <div className="pt-4 border-t border-[#1F2833]">
            <span className="block text-[10px] font-bold text-[#45A29E] uppercase tracking-[0.2em] mb-3">
              Schnellauswahl für Steps
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleFillFour}
                className="px-3 py-2 bg-[#1F2833] hover:bg-[#45A29E]/20 text-[#C5C6C7] hover:text-[#66FCF1] text-xs font-medium rounded border border-[#45A29E]/20 transition cursor-pointer"
              >
                4-on-the-Floor (1,5,9,13)
              </button>
              <button
                onClick={handleFillOffbeat}
                className="px-3 py-2 bg-[#1F2833] hover:bg-[#45A29E]/20 text-[#C5C6C7] hover:text-[#66FCF1] text-xs font-medium rounded border border-[#45A29E]/20 transition cursor-pointer"
              >
                Offbeats (3,7,11,15)
              </button>
              <button
                onClick={handleFillAll}
                className="px-3 py-2 bg-[#1F2833] hover:bg-[#45A29E]/20 text-[#C5C6C7] hover:text-[#66FCF1] text-xs font-medium rounded border border-[#45A29E]/20 transition cursor-pointer"
              >
                Alle 16 füllen
              </button>
              <button
                onClick={handleClearTrack}
                className="px-3 py-2 bg-[#1F2833] hover:bg-rose-950/40 text-rose-400 text-xs font-medium rounded border border-[#45A29E]/20 hover:border-rose-800 transition cursor-pointer"
              >
                Spur leeren
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-[#1F2833] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-transparent border-2 border-[#66FCF1] hover:bg-[#66FCF1] hover:text-[#0B0C10] text-[#66FCF1] font-bold text-xs uppercase tracking-wider rounded transition cursor-pointer"
          >
            Fertig
          </button>
        </div>
      </div>
    </div>
  );
};
