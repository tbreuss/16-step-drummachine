import React, { useEffect, useRef, useState } from 'react';
import { Pause, Play, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { Visualizer } from './Visualizer';
import { useLanguage } from '../i18n/LanguageContext';

interface TransportBarProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  bpm: number;
  onBpmChange: (bpm: number) => void;
  swing: number;
  onSwingChange: (swing: number) => void;
  masterVolume: number;
  onMasterVolumeChange: (vol: number) => void;
  currentStep: number;
}

export const TransportBar: React.FC<TransportBarProps> = ({
  isPlaying,
  onTogglePlay,
  bpm,
  onBpmChange,
  swing,
  onSwingChange,
  masterVolume,
  onMasterVolumeChange,
  currentStep,
}) => {
  const { t } = useLanguage();
  const [isMuted, setIsMuted] = useState(false);
  const previousVolRef = useRef(masterVolume);

  // Tap Tempo state
  const tapTimesRef = useRef<number[]>([]);

  const handleTapTempo = () => {
    const now = performance.now();
    const tapTimes = tapTimesRef.current;

    // Reset if taps are older than 2 seconds
    if (tapTimes.length > 0 && now - tapTimes[tapTimes.length - 1] > 2000) {
      tapTimesRef.current = [];
    }

    tapTimesRef.current.push(now);
    if (tapTimesRef.current.length > 4) {
      tapTimesRef.current.shift();
    }

    if (tapTimesRef.current.length >= 2) {
      const intervals = [];
      for (let i = 1; i < tapTimesRef.current.length; i++) {
        intervals.push(tapTimesRef.current[i] - tapTimesRef.current[i - 1]);
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const calculatedBpm = Math.round(60000 / avgInterval);
      const clampedBpm = Math.max(40, Math.min(240, calculatedBpm));
      onBpmChange(clampedBpm);
    }
  };

  const handleToggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      onMasterVolumeChange(previousVolRef.current || 0.8);
    } else {
      previousVolRef.current = masterVolume;
      setIsMuted(true);
      onMasterVolumeChange(0);
    }
  };

  return (
    <div className="w-full bg-[#0B0C10] border-b border-[#1F2833] p-4 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">
        
        {/* Play Button & Master Controls */}
        <div className="flex items-center gap-5 w-full lg:w-auto justify-between lg:justify-start">
          <button
            onClick={onTogglePlay}
            className={`w-14 h-14 rounded-lg flex items-center justify-center font-bold transition-all cursor-pointer transform active:scale-95 ${
              isPlaying
                ? 'bg-[#66FCF1] text-[#0B0C10] shadow-[0_0_20px_rgba(102,252,241,0.6)] animate-pulse'
                : 'bg-[#1F2833] text-[#66FCF1] border border-[#66FCF1]/40 hover:bg-[#45A29E]/20 shadow-[0_0_12px_rgba(102,252,241,0.2)]'
            }`}
            title={isPlaying ? t.stopSpace : t.playSpace}
          >
            {isPlaying ? (
              <Pause className="w-7 h-7 fill-[#0B0C10] stroke-none" />
            ) : (
              <Play className="w-7 h-7 fill-[#66FCF1] stroke-none ml-1" />
            )}
          </button>

          {/* BPM Section */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-bold text-[#45A29E] uppercase tracking-[0.2em]">
                {t.tempoBpm}
              </span>
              <button
                onClick={handleTapTempo}
                className="text-[10px] font-mono font-bold bg-[#1F2833] hover:bg-[#66FCF1] text-[#66FCF1] hover:text-[#0B0C10] border border-[#66FCF1]/30 px-2 py-0.5 rounded cursor-pointer transition active:scale-95"
              >
                {t.tapTempo}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onBpmChange(Math.max(40, bpm - 5))}
                className="w-7 h-7 bg-[#1F2833] hover:bg-[#45A29E]/20 text-[#C5C6C7] hover:text-[#66FCF1] font-mono font-bold text-xs rounded border border-[#45A29E]/20 flex items-center justify-center cursor-pointer"
              >
                -5
              </button>
              <button
                onClick={() => onBpmChange(Math.max(40, bpm - 1))}
                className="w-7 h-7 bg-[#1F2833] hover:bg-[#45A29E]/20 text-[#C5C6C7] hover:text-[#66FCF1] font-mono font-bold text-xs rounded border border-[#45A29E]/20 flex items-center justify-center cursor-pointer"
              >
                -1
              </button>

              <input
                type="number"
                min={40}
                max={240}
                value={bpm}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  if (!isNaN(val)) {
                    onBpmChange(Math.max(40, Math.min(240, val)));
                  }
                }}
                className="w-16 bg-[#1F2833] text-[#66FCF1] font-mono font-black text-center text-lg rounded border border-[#45A29E]/40 py-0.5 focus:outline-none focus:border-[#66FCF1]"
              />

              <button
                onClick={() => onBpmChange(Math.min(240, bpm + 1))}
                className="w-7 h-7 bg-[#1F2833] hover:bg-[#45A29E]/20 text-[#C5C6C7] hover:text-[#66FCF1] font-mono font-bold text-xs rounded border border-[#45A29E]/20 flex items-center justify-center cursor-pointer"
              >
                +1
              </button>
              <button
                onClick={() => onBpmChange(Math.min(240, bpm + 5))}
                className="w-7 h-7 bg-[#1F2833] hover:bg-[#45A29E]/20 text-[#C5C6C7] hover:text-[#66FCF1] font-mono font-bold text-xs rounded border border-[#45A29E]/20 flex items-center justify-center cursor-pointer"
              >
                +5
              </button>
            </div>
          </div>
        </div>

        {/* Middle Sliders: Swing & Master Vol */}
        <div className="flex flex-wrap items-center gap-6 w-full lg:w-auto justify-around lg:justify-start">
          {/* Swing Slider */}
          <div className="flex flex-col gap-1.5 w-36">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[#45A29E] text-[10px] uppercase tracking-[0.2em]">
                {t.swing}
              </span>
              <span className="font-mono text-[#66FCF1] font-bold">
                {Math.round(swing * 100)}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={0.5}
              step={0.05}
              value={swing}
              onChange={(e) => onSwingChange(parseFloat(e.target.value))}
              className="w-full accent-[#66FCF1] cursor-pointer h-2 bg-[#1F2833] rounded-lg appearance-none"
            />
          </div>

          {/* Master Volume */}
          <div className="flex flex-col gap-1.5 w-40">
            <div className="flex justify-between items-center text-xs">
              <button
                onClick={handleToggleMute}
                className="flex items-center gap-1 font-bold text-[#45A29E] hover:text-[#66FCF1] text-[10px] uppercase tracking-[0.2em] cursor-pointer"
              >
                {isMuted || masterVolume === 0 ? (
                  <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5 text-[#66FCF1]" />
                )}
                {t.master}
              </button>
              <span className="font-mono text-[#66FCF1] font-bold">
                {Math.round(masterVolume * 100)}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={masterVolume}
              onChange={(e) => {
                setIsMuted(false);
                onMasterVolumeChange(parseFloat(e.target.value));
              }}
              className="w-full accent-[#66FCF1] cursor-pointer h-2 bg-[#1F2833] rounded-lg appearance-none"
            />
          </div>
        </div>

        {/* Step Indicator & Audio Visualizer */}
        <div className="flex flex-col gap-2 w-full lg:w-64">
          <div className="flex justify-between items-center text-[10px] text-[#45A29E] font-bold uppercase tracking-[0.2em]">
            <span>{t.stepDisplay}</span>
            <span className="font-mono text-[#66FCF1] font-bold">
              {t.step} {currentStep + 1} / 16
            </span>
          </div>

          <Visualizer isPlaying={isPlaying} />
        </div>

      </div>
    </div>
  );
};

