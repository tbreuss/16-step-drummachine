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

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  tracks: DrumTrack[];
  bpm: number;
  swing: number;
  currentKit: DrumKitId;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  tracks,
  bpm,
  swing,
  currentKit,
}) => {
  const [activeTab, setActiveTab] = useState<'wav' | 'json'>('wav');
  const [bars, setBars] = useState<number>(2); // Default 2 bars
  const [isRendering, setIsRendering] = useState<boolean>(false);
  const [copiedJson, setCopiedJson] = useState<boolean>(false);

  if (!isOpen) return null;

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
      const filename = `Beat_${currentKit}_${bpm}BPM_${bars}Bars.wav`;
      downloadFile(wavBlob, filename);
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
        name: `Mein Beat (${bpm} BPM)`,
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
    downloadFile(blob, `Beat_Pattern_${bpm}BPM.json`);
  };

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
              <h3 className="text-lg font-black tracking-tighter text-[#66FCF1] uppercase">BEAT EXPORTIEREN</h3>
              <p className="text-[10px] tracking-wider text-[#45A29E] uppercase">
                Als WAV-Audiodatei oder JSON-Projekt exportieren
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
            WAV Audio-Export
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
            JSON Projekt
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'wav' ? (
            <div className="flex flex-col gap-6">
              <div className="bg-[#1F2833] rounded p-4 border border-[#45A29E]/30 flex flex-col gap-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#45A29E] font-medium">Tempo:</span>
                  <span className="font-mono text-[#66FCF1] font-bold">{bpm} BPM</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#45A29E] font-medium">Drumkit:</span>
                  <span className="font-semibold text-[#66FCF1] capitalize">{currentKit}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#45A29E] font-medium">Format:</span>
                  <span className="font-mono text-[#66FCF1] font-bold">16-Bit / 44.1 kHz Studio WAV</span>
                </div>
              </div>

              {/* Loop Count Selection */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-[#45A29E] uppercase tracking-[0.2em]">
                  Loop-Länge für Export wählen:
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
                      <span className="text-base font-black font-mono">{b} Takte</span>
                      <span className="text-[10px] opacity-75 font-mono">
                        ({b * 16} Steps)
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
                    Rendert WAV Audio...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5 stroke-[2.5]" />
                    WAV Beat herunterladen ({bars} Takte)
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              <p className="text-xs text-[#C5C6C7] leading-relaxed">
                Speichere dein erstelltes Pattern als JSON-Datei oder kopiere den Code,
                um deine Rhythmen jederzeit wieder in der Drummachine zu laden.
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
                      Kopiert!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-[#45A29E]" />
                      In Zwischenablage
                    </>
                  )}
                </button>

                <button
                  onClick={handleDownloadJSON}
                  className="py-3 px-4 bg-[#66FCF1] hover:bg-[#66FCF1]/90 text-[#0B0C10] font-bold text-xs uppercase tracking-wider rounded border border-[#66FCF1] shadow-[0_0_12px_rgba(102,252,241,0.3)] transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  JSON Datei laden
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
