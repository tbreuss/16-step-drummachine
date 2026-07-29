import React, { useRef } from 'react';
import {
  Download,
  Edit3,
  FolderOpen,
  Globe,
  Music,
  PlusCircle,
  RotateCcw,
  Save,
  Shuffle,
  Sparkles,
  Tag,
  Volume2,
} from 'lucide-react';
import { BEAT_PRESETS, DRUM_KITS } from '../data/presets';
import { BeatPreset, DrumKitId } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface HeaderProps {
  beatName: string;
  onBeatNameChange: (name: string) => void;
  currentKit: DrumKitId;
  onSelectKit: (kit: DrumKitId) => void;
  onLoadPreset: (preset: BeatPreset) => void;
  onClearPattern: () => void;
  onRandomizePattern: () => void;
  onOpenExportModal: () => void;
  onImportJSON: (jsonString: string) => void;
  onSaveJSON: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  beatName,
  onBeatNameChange,
  currentKit,
  onSelectKit,
  onLoadPreset,
  onClearPattern,
  onRandomizePattern,
  onOpenExportModal,
  onImportJSON,
  onSaveJSON,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        onImportJSON(content);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <header className="w-full bg-[#0B0C10] border-b border-[#1F2833] px-4 py-4 shadow-xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Title / Branding */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#1F2833] border border-[#66FCF1]/40 flex items-center justify-center text-[#66FCF1] shadow-[0_0_12px_rgba(102,252,241,0.25)]">
              <Music className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter text-[#66FCF1] flex items-center gap-2 uppercase leading-none">
                {t.appTitle}
                <span className="text-[10px] font-bold tracking-widest uppercase bg-[#66FCF1]/10 text-[#66FCF1] border border-[#66FCF1]/30 px-2 py-0.5 rounded">
                  PRO
                </span>
              </h1>
              <p className="text-[10px] tracking-[0.2em] font-medium text-[#45A29E] uppercase mt-1">
                {t.appSubtitle}
              </p>
            </div>
          </div>

          {/* Language Switcher for mobile/header branding */}
          <div className="flex md:hidden items-center bg-[#1F2833] p-0.5 rounded border border-[#66FCF1]/30">
            <button
              onClick={() => setLanguage('de')}
              className={`px-2 py-1 text-[10px] font-bold rounded transition cursor-pointer ${
                language === 'de'
                  ? 'bg-[#66FCF1] text-[#0B0C10]'
                  : 'text-[#C5C6C7] hover:text-[#66FCF1]'
              }`}
            >
              DE
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 text-[10px] font-bold rounded transition cursor-pointer ${
                language === 'en'
                  ? 'bg-[#66FCF1] text-[#0B0C10]'
                  : 'text-[#C5C6C7] hover:text-[#66FCF1]'
              }`}
            >
              EN
            </button>
          </div>
        </div>

        {/* Controls Bar: Beat Name, Kits, Presets & Actions */}
        <div className="flex flex-wrap items-center justify-center md:justify-end gap-2.5 w-full md:w-auto">
          {/* Beat Name Input */}
          <div className="flex items-center gap-1.5 bg-[#1F2833] p-1 rounded border border-[#66FCF1]/40 shadow-[0_0_8px_rgba(102,252,241,0.15)]">
            <Tag className="w-4 h-4 text-[#66FCF1] ml-1.5 shrink-0" />
            <input
              type="text"
              value={beatName}
              onChange={(e) => onBeatNameChange(e.target.value)}
              placeholder={t.beatNamePlaceholder}
              title={t.beatNameTitle}
              className="bg-[#0B0C10] text-[#66FCF1] font-bold text-xs py-1.5 px-2.5 rounded border border-[#1F2833] focus:outline-none focus:border-[#66FCF1] w-36 sm:w-44 truncate transition-all placeholder:text-[#45A29E]/50"
            />
          </div>

          {/* Kit Selector */}
          <div className="flex items-center gap-1.5 bg-[#1F2833] p-1 rounded border border-[#45A29E]/30">
            <Volume2 className="w-4 h-4 text-[#45A29E] ml-1.5 hidden sm:block" />
            <select
              value={currentKit}
              onChange={(e) => onSelectKit(e.target.value as DrumKitId)}
              className="bg-[#0B0C10] text-[#66FCF1] text-xs font-mono font-semibold py-1.5 px-2.5 rounded border border-[#1F2833] focus:outline-none focus:border-[#66FCF1] cursor-pointer"
            >
              {DRUM_KITS.map((kit) => {
                const kitName = t.kits[kit.id]?.name || kit.name;
                return (
                  <option key={kit.id} value={kit.id}>
                    {kitName}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Beat Preset Selector */}
          <div className="flex items-center gap-1.5 bg-[#1F2833] p-1 rounded border border-[#45A29E]/30">
            <Sparkles className="w-4 h-4 text-[#66FCF1] ml-1.5 hidden sm:block" />
            <select
              defaultValue=""
              onChange={(e) => {
                const preset = BEAT_PRESETS.find((p) => p.id === e.target.value);
                if (preset) {
                  onLoadPreset(preset);
                  e.target.value = '';
                }
              }}
              className="bg-[#0B0C10] text-[#C5C6C7] text-xs font-semibold py-1.5 px-2.5 rounded border border-[#1F2833] focus:outline-none focus:border-[#66FCF1] cursor-pointer"
            >
              <option value="" disabled>
                🎵 {t.selectPreset}
              </option>
              {BEAT_PRESETS.map((preset) => {
                const presetName = (t.presets as Record<string, { name: string }>)[preset.id]?.name || preset.name;
                return (
                  <option key={preset.id} value={preset.id}>
                    {presetName} ({preset.bpm} BPM)
                  </option>
                );
              })}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={onRandomizePattern}
              title={t.randomPattern}
              className="p-2 bg-[#1F2833] hover:bg-[#45A29E]/20 text-[#C5C6C7] hover:text-[#66FCF1] rounded border border-[#45A29E]/20 transition flex items-center gap-1.5 text-xs font-medium cursor-pointer"
            >
              <Shuffle className="w-4 h-4 text-[#66FCF1]" />
              <span className="hidden sm:inline">{t.randomPattern}</span>
            </button>

            <button
              onClick={onClearPattern}
              title={t.clearPattern}
              className="p-2 bg-[#1F2833] hover:bg-rose-950/40 text-[#C5C6C7] hover:text-rose-400 rounded border border-[#45A29E]/20 transition flex items-center gap-1.5 text-xs font-medium cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-[#45A29E]" />
              <span className="hidden sm:inline">{t.clearPattern}</span>
            </button>
          </div>

          <div className="h-5 w-[1px] bg-[#1F2833] hidden lg:block" />

          {/* JSON Save / Load */}
          <div className="flex items-center gap-1">
            <button
              onClick={onSaveJSON}
              title={t.jsonSaveTitle}
              className="p-2 bg-[#1F2833] hover:bg-[#45A29E]/20 text-[#C5C6C7] hover:text-[#66FCF1] rounded border border-[#45A29E]/20 transition flex items-center gap-1.5 text-xs font-medium cursor-pointer"
            >
              <Save className="w-4 h-4 text-[#66FCF1]" />
              <span className="hidden lg:inline">JSON</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              title={t.jsonOpenTitle}
              className="p-2 bg-[#1F2833] hover:bg-[#45A29E]/20 text-[#C5C6C7] hover:text-[#66FCF1] rounded border border-[#45A29E]/20 transition flex items-center gap-1.5 text-xs font-medium cursor-pointer"
            >
              <FolderOpen className="w-4 h-4 text-[#45A29E]" />
              <span className="hidden lg:inline">JSON</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          {/* Language Switcher for desktop */}
          <div className="hidden md:flex items-center bg-[#1F2833] p-0.5 rounded border border-[#66FCF1]/30">
            <Globe className="w-3.5 h-3.5 text-[#66FCF1] ml-1.5 mr-1" />
            <button
              onClick={() => setLanguage('de')}
              className={`px-2 py-1 text-[11px] font-bold rounded transition cursor-pointer ${
                language === 'de'
                  ? 'bg-[#66FCF1] text-[#0B0C10]'
                  : 'text-[#C5C6C7] hover:text-[#66FCF1]'
              }`}
              title="Deutsch"
            >
              DE
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 text-[11px] font-bold rounded transition cursor-pointer ${
                language === 'en'
                  ? 'bg-[#66FCF1] text-[#0B0C10]'
                  : 'text-[#C5C6C7] hover:text-[#66FCF1]'
              }`}
              title="English"
            >
              EN
            </button>
          </div>

          {/* Export Button */}
          <button
            onClick={onOpenExportModal}
            title={t.exportTitle}
            className="px-4 py-2 bg-transparent border-2 border-[#66FCF1] hover:bg-[#66FCF1] hover:text-[#0B0C10] text-[#66FCF1] font-bold rounded uppercase tracking-[0.15em] text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-[0_0_12px_rgba(102,252,241,0.25)] active:scale-95"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>{t.exportButton}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

