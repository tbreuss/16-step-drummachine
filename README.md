# 🎵 16-Step Drummachine Pro

A professional, browser-based 16-step drum machine with an integrated Web Audio synthesizer, real-time audio engine, live performance pads, and studio-grade WAV export.

![Web Audio API](https://img.shields.io/badge/Web_Audio_API-Synthesizer-66FCF1?style=for-the-badge) ![React](https://img.shields.io/badge/React_19-TypeScript-1F2833?style=for-the-badge) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-Styling-45A29E?style=for-the-badge)

---

## ✨ Features

- **🎛️ 16-Step Sequencer Grid**:
  - Interactive 16-step grid supporting 10 distinct drum tracks.
  - Step accenting capability (velocity control) per step.
  - Latency-compensated, real-time visual playhead tracking.

- **🔊 Pure Web Audio Synthesizer**:
  - Purely synthetic sound generation without relying on external MP3/WAV samples:
    - **Kick Drum** (Sub-bass pitch sweep)
    - **Snare Drum** (Noise burst + pitch envelope)
    - **Hand Clap** (Multi-impulse noise with bandpass filtering)
    - **Closed & Open Hi-Hat** (Highpass filtered noise)
    - **Low & High Toms** (Pitch enveloped sine waves)
    - **Cowbell** (Dual square wave metallic oscillators)
    - **Shaker** (Highpass filtered noise grain)
    - **Crash Cymbal** (Metallic frequency cluster & ring modulation)

- **🎧 Live Track & Sound Controls**:
  - **Custom Beat Naming**: Give your custom beats unique titles directly in the header or export dialog.
  - **Instant Real-Time Mute & Solo**: Track mute and solo toggles apply immediately during live playback without restarting loops.
  - **Per-Track Adjustments**: Volume, stereo panning, and pitch transposing (in semitones).
  - **Master Controls**: Tempo (40–240 BPM, Tap Tempo), Swing timing adjustment (0–50%), and Master volume output.

- **🥁 Drum Kits & Beat Presets**:
  - **Drum Kits**: Classic 808, Modern Trap, Retro Synthwave, Organic Acoustic.
  - **Beat Presets**: Pre-built rhythms (Four on the floor, Classic Boom Bap, Trap Bounce, Synthwave Drive, Funk Groove, Latin Shake, and more).

- **🎹 Live Performance Keyboard Pads**:
  - Real-time sample triggering using keyboard hotkeys: `Q`, `W`, `E`, `R`, `T`, `Y`, `U`, `I`, `O`, `P`.
  - Global transport shortcut: `Spacebar` for Play / Pause.

- **💾 Export & Project Storage**:
  - **Studio WAV Export**: Direct Offline Audio Context rendering into 16-Bit / 44.1 kHz WAV audio files (1, 2, or 4 bar loop options).
  - **JSON Project Management**: Save, open, or copy drum patterns directly via JSON format.

---

## 🛠️ Tech Stack

- **Frontend**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Audio Core**: Native Browser [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) (Oscillators, BiquadFilterNodes, GainNodes, AudioBufferSourceNodes, OfflineAudioContext)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm or yarn

### Installation Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/16-step-drummachine.git
   cd 16-step-drummachine
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Launch the application**:
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 GitHub Pages Deployment

This repository includes a pre-configured GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically builds and deploys the application to **GitHub Pages** whenever you push to the `main` branch.

### Enabling GitHub Pages on GitHub:

1. Push your code to your GitHub repository on the `main` branch.
2. Open your repository on **GitHub.com** and go to **Settings** > **Pages**.
3. Under **Build and deployment** > **Source**, select **GitHub Actions**.
4. Push a commit or trigger the **Deploy to GitHub Pages** workflow manually under the **Actions** tab.
5. Your app will be live at `https://<your-username>.github.io/<your-repository-name>/`.

> **Note**: `vite.config.ts` is configured with `base: './'` to ensure all relative asset paths load correctly on GitHub Pages subpaths.

---

## 📜 Available Scripts

- `npm run dev`: Starts the Vite development server on port 3000.
- `npm run build`: Compiles the production build into the `dist/` directory.
- `npm run preview`: Previews the production build locally.
- `npm run lint`: Performs TypeScript type checking (`tsc --noEmit`).

---

## 📁 Directory Structure

```
├── public/                # Static assets
├── src/
│   ├── audio/             # Web Audio API Synthesizer & WAV Recorder Engine
│   │   ├── drumSynth.ts   # Core sound engine (synthesis & offline rendering)
│   ├── components/        # React UI Components
│   │   ├── DrumGrid.tsx   # 16-Step Sequencer Grid
│   │   ├── Header.tsx     # Branding & Kit/Preset selection
│   │   ├── TransportBar.tsx # Play/Pause, Tempo, Swing & Master Volume
│   │   ├── Visualizer.tsx # Real-time Audio Spectrum Visualizer (Canvas)
│   │   ├── TrackSettingsModal.tsx # Track Volume, Pitch & Pan controls
│   │   └── ExportModal.tsx # WAV & JSON Export dialog
│   ├── data/              # Preset patterns & kit configurations
│   │   └── presets.ts
│   ├── types/             # TypeScript interfaces & types
│   │   └── index.ts
│   ├── App.tsx            # Main application component
│   ├── index.css          # Tailwind CSS styles
│   └── main.tsx           # React entry point
├── package.json
├── tsconfig.json
└── README.md
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
