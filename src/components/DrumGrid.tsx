import React from 'react';
import { Play, Settings2, VolumeX, Zap } from 'lucide-react';
import { drumSynth } from '../audio/drumSynth';
import { DrumKitId, DrumTrack } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface DrumGridProps {
  tracks: DrumTrack[];
  onToggleStep: (trackId: string, stepIndex: number) => void;
  onToggleAccent: (trackId: string, stepIndex: number) => void;
  onToggleMute: (trackId: string) => void;
  onToggleSolo: (trackId: string) => void;
  onOpenTrackSettings: (track: DrumTrack) => void;
  currentStep: number;
  isPlaying: boolean;
  currentKit: DrumKitId;
}

export const DrumGrid: React.FC<DrumGridProps> = ({
  tracks,
  onToggleStep,
  onToggleAccent,
  onToggleMute,
  onToggleSolo,
  onOpenTrackSettings,
  currentStep,
  isPlaying,
  currentKit,
}) => {
  const { t } = useLanguage();
  const isAnySoloed = tracks.some((t) => t.soloed);

  return (
    <div className="w-full bg-[#0B0C10] border border-[#1F2833] rounded-xl p-4 shadow-2xl overflow-x-auto">
      <div className="min-w-[760px] flex flex-col gap-2">
        {/* Step Numbers Header */}
        <div className="flex items-center gap-2 pb-2 border-b border-[#1F2833]">
          {/* Track Controls Info Spacer */}
          <div className="w-56 shrink-0 flex items-center justify-between px-2 text-[10px] font-bold text-[#45A29E] uppercase tracking-[0.2em]">
            <span>{t.instrument}</span>
            <div className="flex gap-4">
              <span>M</span>
              <span>S</span>
              <span className="w-4"></span>
            </div>
          </div>

          {/* 16 Step Header Items */}
          <div className="flex-1 grid grid-cols-16 gap-1.5">
            {Array.from({ length: 16 }).map((_, i) => {
              const isCurrent = isPlaying && currentStep === i;
              const isBeatStart = i % 4 === 0;

              return (
                <div
                  key={i}
                  className={`py-1.5 rounded text-center text-[10px] font-mono font-bold transition-all ${
                    isCurrent
                      ? 'bg-[#66FCF1] text-[#0B0C10] shadow-[0_0_12px_rgba(102,252,241,0.5)] scale-105'
                      : isBeatStart
                      ? 'bg-[#1F2833] text-[#66FCF1] border border-[#45A29E]/30'
                      : 'bg-[#0B0C10] text-[#C5C6C7] border border-[#1F2833]'
                  }`}
                >
                  {i + 1}
                </div>
              );
            })}
          </div>
        </div>

        {/* Track Rows */}
        {tracks.map((track) => {
          const isTrackMuted = track.muted || (isAnySoloed && !track.soloed);

          return (
            <div
              key={track.id}
              className={`flex items-center gap-2 py-1 px-1 rounded-lg transition-colors ${
                isTrackMuted ? 'opacity-40' : 'hover:bg-[#1F2833]/30'
              }`}
            >
              {/* Track Info & Controls Header */}
              <div className="w-56 shrink-0 flex items-center justify-between gap-1 bg-[#1F2833] p-2 rounded border border-[#45A29E]/30 shadow-md">
                {/* Preview Trigger & Name */}
                <div className="flex items-center gap-2 min-w-0">
                  <button
                    onClick={() => drumSynth.playPreview(track, currentKit)}
                    className={`w-7 h-7 rounded ${track.color} hover:brightness-125 flex items-center justify-center shrink-0 shadow-sm transition active:scale-90 cursor-pointer`}
                    title={`${track.name} ${t.previewTitle}`}
                  >
                    <Play className="w-3.5 h-3.5 fill-current stroke-none ml-0.5" />
                  </button>
                  <span
                    className="text-xs font-bold text-[#66FCF1] truncate cursor-pointer hover:text-white uppercase tracking-wider"
                    onClick={() => onOpenTrackSettings(track)}
                    title={track.name}
                  >
                    {track.shortName}
                  </span>
                </div>

                {/* Mute, Solo, Settings Buttons */}
                <div className="flex items-center gap-1 shrink-0">
                  {/* Mute Button */}
                  <button
                    onClick={() => onToggleMute(track.id)}
                    className={`w-6 h-6 rounded text-[10px] font-mono font-extrabold transition cursor-pointer flex items-center justify-center ${
                      track.muted
                        ? 'bg-rose-500 text-white shadow-[0_0_8px_rgba(244,63,94,0.6)]'
                        : 'bg-[#0B0C10] text-[#C5C6C7] hover:text-[#66FCF1] border border-[#1F2833]'
                    }`}
                    title={t.muteTitle}
                  >
                    M
                  </button>

                  {/* Solo Button */}
                  <button
                    onClick={() => onToggleSolo(track.id)}
                    className={`w-6 h-6 rounded text-[10px] font-mono font-extrabold transition cursor-pointer flex items-center justify-center ${
                      track.soloed
                        ? 'bg-[#66FCF1] text-[#0B0C10] shadow-[0_0_8px_rgba(102,252,241,0.6)]'
                        : 'bg-[#0B0C10] text-[#C5C6C7] hover:text-[#66FCF1] border border-[#1F2833]'
                    }`}
                    title={t.soloTitle}
                  >
                    S
                  </button>

                  {/* Settings Button */}
                  <button
                    onClick={() => onOpenTrackSettings(track)}
                    className="w-6 h-6 rounded bg-[#0B0C10] text-[#C5C6C7] hover:text-[#66FCF1] border border-[#1F2833] transition cursor-pointer flex items-center justify-center"
                    title={t.trackSettingsTitle}
                  >
                    <Settings2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* 16 Step Buttons Grid */}
              <div className="flex-1 grid grid-cols-16 gap-1.5">
                {track.steps.map((active, stepIdx) => {
                  const isPlayhead = isPlaying && currentStep === stepIdx;
                  const velocity = track.velocities[stepIdx] ?? 1.0;
                  const isAccent = active && velocity > 0.8;
                  const isBeatQuarter = stepIdx % 4 === 0;

                  return (
                    <button
                      key={stepIdx}
                      onClick={() => onToggleStep(track.id, stepIdx)}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        onToggleAccent(track.id, stepIdx);
                      }}
                      className={`h-10 rounded border transition-all relative flex items-center justify-center cursor-pointer active:scale-90 ${
                        active
                          ? `${track.activeColor || track.color} border-[#66FCF1]/60 shadow-md ${
                              isAccent ? 'ring-2 ring-white' : ''
                            }`
                          : isBeatQuarter
                          ? 'bg-[#1F2833] border-[#45A29E]/20 hover:bg-[#1F2833]/80'
                          : 'bg-[#0B0C10] border-[#1F2833] hover:bg-[#1F2833]/60'
                      } ${
                        isPlayhead
                          ? 'ring-2 ring-[#66FCF1] ring-offset-2 ring-offset-[#0B0C10] z-10 scale-[1.04]'
                          : ''
                      }`}
                      title={`Step ${stepIdx + 1}: ${
                        active
                          ? isAccent
                            ? t.stepTooltipActiveAccent
                            : t.stepTooltipActiveNormal
                          : t.stepTooltipInactive
                      } - ${t.stepTooltipRightClick}`}
                    >
                      {active && isAccent && (
                        <div className="w-2 h-2 rounded-full bg-white shadow-sm shadow-white" />
                      )}
                      {!active && isPlayhead && (
                        <div className="w-1.5 h-1.5 rounded-full bg-[#66FCF1] animate-ping" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

