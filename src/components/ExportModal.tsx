import React, { useState } from 'react';
import {
  Check,
  Copy,
  Download,
  FileAudio,
  FileCode,
  Loader2,
  Music2,
  Sparkles,
  X,
} from 'lucide-react';
import { drumSynth } from '../audio/drumSynth';
import { DrumKitId, DrumTrack } from '../types';
import { audioBufferToWav, downloadFile } from '../utils/wavEncoder';
import { useLanguage } from '../i18n/LanguageContext';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  tracks: DrumTrack[];
  bpm: number;
  swing: number;
  currentKit: DrumKitId;
  beatName: string;
  onBeatNameChange: (name: string) => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  tracks,
  bpm,
  swing,
  currentKit,
  beatName,
  onBeatNameChange,
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'wav' | 'json'>('wav');
  const [bars, setBars] = useState<number>(2); // Default 2 bars
  const [isRendering, setIsRendering] = useState<boolean>(false);
  const [copiedJson, setCopiedJson] = useState<boolean>(false);

  if (!isOpen) return null;

  const getSanitizedFileName = (ext: string) => {
    const cleanName = (beatName.trim() || 'Mein_Beat').replace(/[^a-zA-Z0-9_\-]/g, '_');
    return `${cleanName}_${bpm}BPM.${ext}`;
  };

  const handleExportWav = async () => {
    try {
      setIsRendering(true);
      const audioBuffer = await drumSynth.renderWavExport(
        tracks,
        bpm,
        swing,
        currentKit,
        bars
      );
      const wavBlob = audioBufferToWav(audioBuffer);
      downloadFile(wavBlob, getSanitizedFileName(`${bars}Bars.wav`));
    } catch (err) {
      console.error('Failed to render WAV beat:', err);
    } finally {
      setIsRendering(false);
    }
  };

  const getExportDataJSON = () => {
    const trackSteps: Record<string, boolean[]> = {};
    const trackVelocities: Record<string, number[]> = {};

    tracks.forEach((t) => {
      trackSteps[t.id] = t.steps;
      trackVelocities[t.id] = t.velocities;
    });

    return JSON.stringify(
      {
        version: '1.0',
        name: beatName.trim() || 'Mein Beat',
        bpm,
        swing,
        kit: currentKit,
        tracks: trackSteps,
        velocities: trackVelocities,
      },
      null,
      2
    );
  };

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(getExportDataJSON());
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleDownloadJSON = () => {
    const jsonStr = getExportDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    downloadFile(blob, getSanitizedFileName('json'));
  };

  const kitName = t.kits[currentKit]?.name || currentKit;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0B0C10] border border-[#66FCF1]/30 rounded-xl w-full max-w-lg shadow-2xl overflow-hidden text-[#C5C6C7] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-[#0B0C10] px-6 py-5 border-b border-[#1F2833] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#1F2833] border border-[#66FCF1]/40 flex items-center justify-center text-[#66FCF1] shadow-[0_0_10px_rgba(102,252,241,0.3)]">
              <Download className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tighter text-[#66FCF1] uppercase">{t.exportModalHeader}</h3>
              <p className="text-[10px] tracking-wider text-[#45A29E] uppercase">
                {t.exportModalSubheader}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded text-[#45A29E] hover:text-[#66FCF1] hover:bg-[#1F2833] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="flex border-b border-[#1F2833] bg-[#0B0C10] p-2 gap-2">
          <button
            onClick={() => setActiveTab('wav')}
            className={`flex-1 py-2.5 px-4 rounded font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer ${
              activeTab === 'wav'
                ? 'bg-[#66FCF1] text-[#0B0C10] shadow-[0_0_12px_rgba(102,252,241,0.4)]'
                : 'text-[#C5C6C7] hover:text-[#66FCF1] hover:bg-[#1F2833]'
            }`}
          >
            <FileAudio className="w-4 h-4" />
            {t.wavTab}
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`flex-1 py-2.5 px-4 rounded font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer ${
              activeTab === 'json'
                ? 'bg-[#66FCF1] text-[#0B0C10] shadow-[0_0_12px_rgba(102,252,241,0.4)]'
                : 'text-[#C5C6C7] hover:text-[#66FCF1] hover:bg-[#1F2833]'
            }`}
          >
            <FileCode className="w-4 h-4" />
            {t.jsonTab}
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'wav' ? (
            <div className="flex flex-col gap-6">
              <div className="bg-[#1F2833] rounded p-4 border border-[#45A29E]/30 flex flex-col gap-3">
                <div className="flex flex-col gap-1 text-xs">
                  <label className="text-[#45A29E] font-medium text-[10px] uppercase tracking-wider">{t.beatNameLabel}:</label>
                  <input
                    type="text"
                    value={beatName}
                    onChange={(e) => onBeatNameChange(e.target.value)}
                    placeholder={t.beatNamePlaceholder}
                    className="bg-[#0B0C10] text-[#66FCF1] font-bold text-xs py-1.5 px-2.5 rounded border border-[#1F2833] focus:outline-none focus:border-[#66FCF1] w-full"
                  />
                </div>
                <div className="flex justify-between items-center text-xs pt-1 border-t border-[#0B0C10]">
                  <span className="text-[#45A29E] font-medium">{t.tempoLabel}:</span>
                  <span className="font-mono text-[#66FCF1] font-bold">{bpm} BPM</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#45A29E] font-medium">{t.drumkitLabel}:</span>
                  <span className="font-semibold text-[#66FCF1] capitalize">{kitName}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#45A29E] font-medium">{t.formatLabel}:</span>
                  <span className="font-mono text-[#66FCF1] font-bold">16-Bit / 44.1 kHz Studio WAV</span>
                </div>
              </div>

              {/* Loop Count Selection */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-[#45A29E] uppercase tracking-[0.2em]">
                  {t.selectLoopLength}
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[1, 2, 4].map((b) => (
                    <button
                      key={b}
                      onClick={() => setBars(b)}
                      className={`py-3 px-3 rounded border text-xs font-bold transition flex flex-col items-center gap-1 cursor-pointer ${
                        bars === b
                          ? 'bg-[#1F2833] border-[#66FCF1] text-[#66FCF1] shadow-[0_0_10px_rgba(102,252,241,0.3)]'
                          : 'bg-[#0B0C10] border-[#1F2833] text-[#C5C6C7] hover:bg-[#1F2833] hover:text-[#66FCF1]'
                      }`}
                    >
                      <span className="text-base font-black font-mono">{b} {b === 1 ? t.barSingular : t.barPlural}</span>
                      <span className="text-[10px] opacity-75 font-mono">
                        ({b * 16} {t.stepsCount})
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Export Trigger */}
              <button
                disabled={isRendering}
                onClick={handleExportWav}
                className="w-full py-3.5 bg-transparent border-2 border-[#66FCF1] hover:bg-[#66FCF1] hover:text-[#0B0C10] text-[#66FCF1] font-bold uppercase tracking-[0.15em] text-xs rounded transition-colors flex items-center justify-center gap-3 cursor-pointer shadow-[0_0_15px_rgba(102,252,241,0.25)] disabled:opacity-50 active:scale-[0.98]"
              >
                {isRendering ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {t.renderingWav}
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5 stroke-[2.5]" />
                    {t.downloadWavButton} ({bars} {bars === 1 ? t.barSingular : t.barPlural})
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              <p className="text-xs text-[#C5C6C7] leading-relaxed">
                {t.jsonDescription}
              </p>

              <div className="relative bg-[#0B0C10] p-4 rounded border border-[#1F2833] font-mono text-xs text-[#66FCF1] max-h-48 overflow-y-auto">
                <pre>{getExportDataJSON()}</pre>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleCopyJSON}
                  className="py-3 px-4 bg-[#1F2833] hover:bg-[#45A29E]/20 text-[#C5C6C7] hover:text-[#66FCF1] font-bold text-xs uppercase tracking-wider rounded border border-[#45A29E]/30 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  {copiedJson ? (
                    <>
                      <Check className="w-4 h-4 text-[#66FCF1]" />
                      {t.copied}
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-[#45A29E]" />
                      {t.copyClipboard}
                    </>
                  )}
                </button>

                <button
                  onClick={handleDownloadJSON}
                  className="py-3 px-4 bg-[#66FCF1] hover:bg-[#66FCF1]/90 text-[#0B0C10] font-bold text-xs uppercase tracking-wider rounded border border-[#66FCF1] shadow-[0_0_12px_rgba(102,252,241,0.3)] transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  {t.downloadJsonButton}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

