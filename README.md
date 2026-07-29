# 🎵 16-Step Drummachine Pro

Eine professionelle, browserbasierte 16-Step Drummachine mit integriertem Web Audio Synthesizer, Echtzeit-Sound-Engine, Live-Performance-Pads und Studio-WAV-Export.

![Drummachine Pro Banner](https://img.shields.io/badge/Web_Audio_API-Synthesizer-66FCF1?style=for-the-badge) ![React](https://img.shields.io/badge/React_19-TypeScript-1F2833?style=for-the-badge) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-Styling-45A29E?style=for-the-badge)

---

## ✨ Features

- **🎛️ 16-Step Sequencer-Grid**:
  - Interaktives 16-Schritt-Grid für 10 Drum-Spuren.
  - Akzent-Funktion (Velocity-Steuerung) pro Step.
  - Latenzkompensierte, visuelle Playhead-Markierung in Echtzeit.

- **🔊 Synthetische Web Audio Sound-Engine**:
  - Generiert alle Drum-Sounds komplett synthetisch (ohne externe MP3/WAV-Samples):
    - **Kick Drum** (Sub-Bass Sweep)
    - **Snare Drum** (Noise + Pitch Envelope)
    - **Hand Clap** (Multi-Impuls Noise & Bandpass Filter)
    - **Closed & Open Hi-Hat** (Highpass Filter Noise)
    - **Low & High Toms** (Pitch Envelope Sine Wave)
    - **Cowbell** (Dual Square Wave Metallic Oscillators)
    - **Shaker** (Highpass Filter Noise Grain)
    - **Crash Cymbal** (Metallic Frequency Cluster & Ring Modulator)

- **🎧 Live Track & Sound Controls**:
  - **Sofortige Echtzeit-Reaktion**: Mute (Stummschalten) und Solo-Schaltungen wirken direkt ohne Loop-Neustart.
  - **Spur-Einstellungen**: Lautstärke (Volume), Stereo-Pan und Tonhöhe (Pitch Transpose in Halbtonschritten).
  - **Master Controls**: Tempo (40–240 BPM, Tap Tempo), Swing (0–50%), Master-Lautstärke.

- **🥁 Drum Kits & Beat-Presets**:
  - **Drum Kits**: Classic 808, Modern Trap, Retro Synthwave, Organic Acoustic.
  - **Beat Presets**: Fertige Rhythmen (Four on the floor, Classic Boom Bap, Trap Bounce, Synthwave Drive, Funk Groove, Latin Shake u.v.m.).

- **🎹 Live Performance Keyboard Pads**:
  - Triggering der Sounds in Echtzeit über die Tastatur: `Q`, `W`, `E`, `R`, `T`, `Y`, `U`, `I`, `O`, `P`.
  - Tastaturkürzel: `Leertaste` zum Starten/Stoppen der Wiedergabe.

- **💾 Export & Speicherfunktionen**:
  - **Studio WAV Export**: Direct Offline Audio Rendering des Beats als 16-Bit / 44.1 kHz WAV-Datei (1, 2 oder 4 Takte Loop-Länge).
  - **JSON-Projekt-Speicher**: Muster als JSON-Datei speichern, importieren oder direkt in die Zwischenablage kopieren.

---

## 🛠️ Tech Stack

- **Frontend**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Build-Tool**: [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Audio Core**: Native Browser [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) (Oscillators, BiquadFilterNodes, GainNodes, AudioBufferSourceNodes, OfflineAudioContext)

---

## 🚀 Installation & Lokaler Start

### Voraussetzungen
- Node.js (v18.0.0 oder neuer)
- npm oder yarn

### Schritte

1. **Repository klonen**:
   ```bash
   git clone https://github.com/dein-user/16-step-drummachine.git
   cd 16-step-drummachine
   ```

2. **Abhängigkeiten installieren**:
   ```bash
   npm install
   ```

3. **Entwicklungsserver starten**:
   ```bash
   npm run dev
   ```

4. **App öffnen**:
   Öffne [http://localhost:3000](http://localhost:3000) im Browser.

---

## 📜 Verfügbare Scripts

- `npm run dev`: Startet den Vite-Entwicklungsserver auf Port 3000.
- `npm run build`: Erstellt den optimierten Production-Build im `dist/` Ordner.
- `npm run preview`: Vorschau des Production-Builds.
- `npm run lint`: Führt die TypeScript-Typenprüfung aus (`tsc --noEmit`).

---

## 📁 Projektstruktur

```
├── public/                # Statische Assets
├── src/
│   ├── audio/             # Web Audio API Synthesizer & WAV Recorder Engine
│   │   ├── drumSynth.ts   # Haupt-Sound-Engine (Synthese & Offlineredering)
│   ├── components/        # React UI Komponenten
│   │   ├── DrumGrid.tsx   # 16-Step Sequencer Grid
│   │   ├── Header.tsx     # Branding & Kit/Preset Auswahl
│   │   ├── TransportBar.tsx # Play/Pause, Tempo, Swing & Master Volume
│   │   ├── Visualizer.tsx # Echtzeit Audio Spectrum Visualizer (Canvas)
│   │   ├── TrackSettingsModal.tsx # Volume, Pitch & Pan Einstellungen
│   │   └── ExportModal.tsx # WAV & JSON Export Dialog
│   ├── data/              # Preset-Muster & Kit Konfigurationen
│   │   └── presets.ts
│   ├── types/             # TypeScript Typdefinitionen
│   │   └── index.ts
│   ├── App.tsx            # Hauptkomponente
│   ├── index.css          # Tailwind CSS Integration
│   └── main.tsx           # React Einstiegspunkt
├── package.json
├── tsconfig.json
└── README.md
```

---

## 📄 Lizenz

Dieses Projekt steht unter der [MIT Lizenz](LICENSE).
