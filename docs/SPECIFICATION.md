# Black-Box Functional Specification: 16-Step Drum Sequencer & Web Audio Synthesizer

## 1. System Overview & Scope

The **16-Step Drum Sequencer & Web Audio Synthesizer** is a high-precision, client-side browser web application for music production, beat making, and live audio performance. It requires zero external audio assets or backend servers, generating all sounds dynamically via the browser's native **Web Audio API** and rendering multi-bar audio loops directly to 16-bit 44.1kHz WAV files via `OfflineAudioContext`.

The application is structured into a single-screen studio layout containing a top header bar, transport control panel, track control & step sequencer grid, live keyboard triggering system, audio visualizer, modal dialogs for track settings and WAV/JSON export, and an internationalization (i18n) engine.

---

## 2. Technical Stack & Architecture Standards

- **Framework**: React 18+ (TypeScript, Functional Components, Custom Hooks)
- **Styling**: Tailwind CSS (Dark futuristic neon/studio visual identity with responsive grid & flexbox layouts)
- **Audio Synthesis**: Native Browser Web Audio API (`AudioContext`, `GainNode`, `OscillatorNode`, `BufferSourceNode`, `BiquadFilterNode`, `DynamicsCompressorNode`, `StereoPannerNode`, `AnalyserNode`, `OfflineAudioContext`)
- **Icons**: `lucide-react`
- **i18n**: Context-based language switching (English & German support)
- **Port & Ingress**: Port 3000 (standard single-page SPA runtime)

---

## 3. Core Functional Requirements & Features

### 3.1 Audio Engine & Synthesis Specifications
All drum instruments are synthesized programmatically without relying on external `.wav` or `.mp3` sample files:
1. **Kick**: Sine wave oscillator with exponentially decaying frequency sweep (e.g., 120Hz → 30Hz) paired with a rapid gain envelope.
2. **Snare**: Combination of a body sine oscillator (e.g., 180Hz → 80Hz) and filtered white noise burst passed through a high-pass Biquad filter.
3. **Clap**: Repeated burst envelope of high-pass filtered white noise creating the characteristic reverberated hand-clap transient.
4. **Closed Hi-Hat**: High-pass filtered noise generator with a short decay envelope (< 100ms).
5. **Open Hi-Hat**: High-pass filtered noise generator with a longer decay envelope (300ms–500ms).
6. **Toms (Low, Mid, High)**: Pitch-shifted sine wave sweep oscillators with subtle noise transients.
7. **Crash / Cymbal**: Dual metallic oscillator network or complex band-pass white noise with long exponential decay.
8. **Percussion / Rimshot**: Short impulse oscillator with high-pass resonance filter.

Every sound synthesis routine must respect:
- **Track Volume** (0.0 to 1.0)
- **Track Pitch** (-12 to +12 semitones)
- **Track Pan** (-1.0 Left to +1.0 Right)
- **Step Velocity Accent** (Standard: ~0.7 gain multiplier; Accent: 1.0 full gain)
- **Mute & Solo Logic** (If any track is soloed, non-soloed tracks are muted; muted tracks yield zero gain).

### 3.2 Transport Bar & Clock Engine
- **Play / Pause**: Global toggle controlled via UI button or `Spacebar` key.
- **BPM Control**: Range 40 to 240 BPM (default: 116 BPM).
- **Tap Tempo**: Calculates BPM based on interval timing between consecutive clicks/taps.
- **Swing Engine**: Range 0% to 75%. Delays even-numbered 16th steps (2, 4, 6, 8, etc.) proportionally relative to the 16th-note interval time.
- **Master Volume & Mute**: Slider (0% to 100%) with a fast toggle mute button remembering pre-mute level.
- **Visualizer & Step Display**: Real-time canvas showing dynamic waveform/FFT output connected to the master `AnalyserNode`, along with current active step position (Step 1 to 16).

### 3.3 16-Step Sequencer Grid & Track Controls
- **Track Header**:
  - Track color indicator & name label.
  - **Live Preview Button**: Triggers instant audio playback of the instrument.
  - **Mute (`M`) Button**: Toggles track mute state (Red highlight when muted).
  - **Solo (`S`) Button**: Toggles track solo state (Cyan highlight when soloed).
  - **Settings (`⚙`) Button**: Opens the Track Settings Modal.
- **Step Matrix (16 Steps per Track)**:
  - Left-click toggles step state (`Off` → `Active Normal` → `Off`).
  - Right-click toggles step accent state (`Off` → `Active Accent` → `Off` or `Active Normal` → `Active Accent`).
  - Active steps display vivid visual state with inner accent indicators.
  - Highlighting column of the currently playing step synchronized with the transport clock.

### 3.4 Track Settings Modal
- **Volume Slider**: 0% to 100%.
- **Pan Slider**: -100% (Left) to +100% (Right), Center (0%).
- **Pitch Slider**: -12 to +12 Semitones.
- **Quick Pattern Generators**:
  - `4-on-the-Floor`: Sets steps 1, 5, 9, 13 active.
  - `Offbeats`: Sets steps 3, 7, 11, 15 active.
  - `Fill All`: Sets all 16 steps active.
  - `Clear Track`: Resets all 16 steps to inactive.

### 3.5 Presets & Drum Kit Engine
- **Drum Kits**:
  - Classic 808, Vintage 909, Synthwave, Studio Punch, CR-78 Analog Warmth.
  - Selecting a kit dynamically changes the sound synthesis parameters (pitch, decay, filter cutoffs, noise color, oscillator types, and resonance curves).
- **Beat Presets**:
  - Pre-programmed patterns (House, Boom Bap, Trap, Techno, Funk, Rock, Reggaeton, Synthwave, Lo-Fi, Drum & Bass).
  - Loading a preset sets the BPM, kit selection, and populates all track steps and velocities.

### 3.6 Data Import & Export System
1. **1-Click Quick JSON Save**: Top header button (`JSON Speichern`) immediately triggers a browser download of the current beat pattern configuration as a `.json` file (`<Name>_<BPM>BPM.json`).
2. **JSON Import**: Top header button (`JSON Öffnen`) opens file picker to load project `.json` files and restore project state.
3. **Studio Export Modal (`EXPORT` Button)**:
   - **WAV Tab**: Offline rendering of 1, 2, or 4 bars into 16-bit 44.1kHz stereo audio file using `OfflineAudioContext`. Includes progress spinner and direct `.wav` download.
   - **JSON Tab**: Displays raw formatted JSON project structure with direct "Copy to Clipboard" and "Download JSON" buttons.

### 3.7 Keyboard Controls & Live Performance
- `Spacebar`: Global Play/Pause toggle.
- `Q, W, E, R, T, Y, U, I, O, P`: Triggers live audio playback for drum tracks 1 through 10 in real-time.

### 3.8 Internationalization (i18n)
- Language Context supporting **German (DE)** and **English (EN)**.
- Language switcher in the header toggling all interface labels, tooltips, modal headers, preset names, and keyboard instructions seamlessly.

---

## 4. Inputs, Outputs & Data Structures

### 4.1 Project Data Schema (JSON Output / Input)
```json
{
  "version": "1.0",
  "name": "My Beat 01",
  "bpm": 116,
  "swing": 0.1,
  "kit": "classic808",
  "tracks": {
    "kick": [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false],
    "snare": [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false]
  },
  "velocities": {
    "kick": [1.0, 0.7, 0.7, 0.7, 1.0, 0.7, 0.7, 0.7, 1.0, 0.7, 0.7, 0.7, 1.0, 0.7, 0.7, 0.7]
  }
}
```

### 4.2 Audio Output Specification
- **Format**: WAV (Uncompressed PCM)
- **Sample Rate**: 44,100 Hz
- **Bit Depth**: 16-Bit Stereo
- **Channels**: 2 (Left & Right with track stereo panning applied)

---

## 5. User Interface Layout & Aesthetic Guidelines

- **Theme**: Dark futuristic studio canvas (`#0B0C10` background, `#1F2833` borders/cards, `#66FCF1` bright cyan accents, `#45A29E` teal labels, `#C5C6C7` secondary text).
- **Header**: Logo icon, Title, Language selector, Beat Name edit field, Preset dropdown, Randomize button, Clear button, Quick Save button, Import button, Export button.
- **Transport Bar**: Play/Pause button, BPM numerical display with Tap Tempo button and slider, Swing percentage slider, Master volume & mute, Real-time step counter & visualizer canvas.
- **Sequencer Panel**: Track list with playback buttons, Mute/Solo controls, settings triggers, and 16-step grid buttons styled in 4-step measure groups (steps 1–4, 5–8, 9–12, 13–16).
- **Keyboard Shortcut Overlay**: Quick reference card displaying spacebar and key mappings with expand/collapse toggle.
- **Footer**: Technical status bar detailing audio resolution and Web Audio API capabilities.

---

## 6. Verification Checklist for Clean Re-Implementation

To rebuild this application from scratch and achieve 100% feature parity:
- [ ] Initialize React 18 SPA with Tailwind CSS.
- [ ] Build Web Audio sound synthesizer producing 10 distinct drum sounds using standard audio nodes.
- [ ] Implement precise 16-step timing loop with Web Audio API clocking or `setInterval` step schedule with swing compensation.
- [ ] Construct Track state array holding steps (boolean[16]), velocities (number[16]), volume, pan, pitch, mute, solo.
- [ ] Create header controls with kit switcher, beat preset loader, random beat generator, and clear pattern action.
- [ ] Build `TrackSettingsModal` for per-track tweaking and quick pattern filling.
- [ ] Build `ExportModal` supporting `OfflineAudioContext` WAV rendering (1, 2, 4 bars) and JSON export.
- [ ] Add direct 1-click JSON quick-save to header and JSON file reader for pattern loading.
- [ ] Integrate i18n context with German and English dictionary sets.
- [ ] Add canvas audio visualizer attached to master `AnalyserNode`.
- [ ] Add keyboard event listeners for `Spacebar` and live sample triggering (`Q-P`).
