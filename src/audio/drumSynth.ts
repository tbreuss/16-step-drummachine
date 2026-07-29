import { DrumKitId, DrumSoundId, DrumTrack } from '../types';

class DrumSynthEngine {
  private audioCtx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  
  private isPlaying = false;
  private currentStep = 0;
  private nextNoteTime = 0;
  private timerId: number | null = null;

  // Parameters
  private bpm = 120;
  private swing = 0; // 0 to 0.5
  private kitId: DrumKitId = 'classic808';
  private tracks: DrumTrack[] = [];

  // Callbacks
  private onStepCallback: ((step: number) => void) | null = null;

  // Initialize or resume AudioContext
  public initAudioContext(): AudioContext {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioCtxClass();
      
      this.masterGain = this.audioCtx.createGain();
      this.masterGain.gain.value = 0.8;

      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 64;

      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.audioCtx.destination);
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  public setMasterVolume(vol: number) {
    if (this.masterGain && this.audioCtx) {
      this.masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, vol)), this.audioCtx.currentTime);
    }
  }

  public getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  // --- SOUND SYNTHESIZERS ---

  /**
   * Synthesizes drum sounds given an AudioContext, target destination, and sound settings.
   */
  public triggerSound(
    soundId: DrumSoundId,
    ctx: BaseAudioContext,
    destination: AudioNode,
    time: number = 0,
    velocity: number = 1.0,
    pitchShiftSemitones: number = 0,
    kit: DrumKitId = this.kitId
  ) {
    const soundTime = time || ctx.currentTime;
    const pitchRatio = Math.pow(2, pitchShiftSemitones / 12);

    // Track volume & panning nodes
    const panNode = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    const soundGain = ctx.createGain();
    soundGain.gain.setValueAtTime(Math.max(0, velocity), soundTime);

    if (panNode) {
      soundGain.connect(panNode);
      panNode.connect(destination);
    } else {
      soundGain.connect(destination);
    }

    // Kit pitch variations
    const kitPitchFactor = kit === 'synthwave' ? 1.2 : kit === 'dance909' ? 1.05 : kit === 'acoustic' ? 0.95 : 1.0;

    switch (soundId) {
      case 'kick': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        let startFreq = 160 * pitchRatio * kitPitchFactor;
        let endFreq = 32 * pitchRatio * kitPitchFactor;
        let decay = 0.35;

        if (kit === 'dance909') {
          startFreq = 180 * pitchRatio;
          endFreq = 45 * pitchRatio;
          decay = 0.28;
        } else if (kit === 'synthwave') {
          startFreq = 220 * pitchRatio;
          endFreq = 38 * pitchRatio;
          decay = 0.45;
        } else if (kit === 'acoustic') {
          startFreq = 130 * pitchRatio;
          endFreq = 40 * pitchRatio;
          decay = 0.22;
        }

        osc.type = 'sine';
        osc.frequency.setValueAtTime(startFreq, soundTime);
        osc.frequency.exponentialRampToValueAtTime(endFreq, soundTime + decay);

        gain.gain.setValueAtTime(1.0, soundTime);
        gain.gain.exponentialRampToValueAtTime(0.001, soundTime + decay);

        // Click / Transient
        const clickOsc = ctx.createOscillator();
        const clickGain = ctx.createGain();
        clickOsc.type = 'triangle';
        clickOsc.frequency.setValueAtTime(800 * pitchRatio, soundTime);
        clickOsc.frequency.exponentialRampToValueAtTime(80, soundTime + 0.02);
        clickGain.gain.setValueAtTime(0.5, soundTime);
        clickGain.gain.exponentialRampToValueAtTime(0.001, soundTime + 0.02);
        clickOsc.connect(clickGain);
        clickGain.connect(soundGain);
        clickOsc.start(soundTime);
        clickOsc.stop(soundTime + 0.02);

        osc.connect(gain);
        gain.connect(soundGain);

        osc.start(soundTime);
        osc.stop(soundTime + decay);
        break;
      }

      case 'snare': {
        // Body (Oscillator)
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();

        const baseFreq = (kit === 'dance909' ? 200 : kit === 'synthwave' ? 240 : 180) * pitchRatio;
        osc.type = kit === 'synthwave' ? 'sawtooth' : 'triangle';
        osc.frequency.setValueAtTime(baseFreq, soundTime);
        osc.frequency.exponentialRampToValueAtTime(80 * pitchRatio, soundTime + 0.12);

        oscGain.gain.setValueAtTime(0.7, soundTime);
        oscGain.gain.exponentialRampToValueAtTime(0.001, soundTime + 0.15);

        osc.connect(oscGain);
        oscGain.connect(soundGain);
        osc.start(soundTime);
        osc.stop(soundTime + 0.15);

        // Snap Noise
        const noiseBuffer = this.createWhiteNoiseBuffer(ctx, 0.25);
        const noise = ctx.createBufferSource();
        noise.buffer = noiseBuffer;

        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = 'highpass';
        noiseFilter.frequency.setValueAtTime((kit === 'dance909' ? 1800 : 1200) * pitchRatio, soundTime);

        const noiseGain = ctx.createGain();
        const noiseDecay = kit === 'acoustic' ? 0.14 : 0.22;
        noiseGain.gain.setValueAtTime(0.9, soundTime);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, soundTime + noiseDecay);

        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(soundGain);

        noise.start(soundTime);
        noise.stop(soundTime + noiseDecay);
        break;
      }

      case 'hihat_closed': {
        const noiseBuffer = this.createWhiteNoiseBuffer(ctx, 0.1);
        const noise = ctx.createBufferSource();
        noise.buffer = noiseBuffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime((kit === 'dance909' ? 8500 : 7000) * pitchRatio, soundTime);

        const gain = ctx.createGain();
        const decay = kit === 'synthwave' ? 0.08 : 0.05;
        gain.gain.setValueAtTime(0.6, soundTime);
        gain.gain.exponentialRampToValueAtTime(0.001, soundTime + decay);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(soundGain);

        noise.start(soundTime);
        noise.stop(soundTime + decay);
        break;
      }

      case 'hihat_open': {
        const noiseBuffer = this.createWhiteNoiseBuffer(ctx, 0.5);
        const noise = ctx.createBufferSource();
        noise.buffer = noiseBuffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime((kit === 'dance909' ? 8000 : 6500) * pitchRatio, soundTime);

        const gain = ctx.createGain();
        const decay = kit === 'acoustic' ? 0.28 : 0.4;
        gain.gain.setValueAtTime(0.7, soundTime);
        gain.gain.exponentialRampToValueAtTime(0.001, soundTime + decay);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(soundGain);

        noise.start(soundTime);
        noise.stop(soundTime + decay);
        break;
      }

      case 'clap': {
        const noiseBuffer = this.createWhiteNoiseBuffer(ctx, 0.3);
        const noise = ctx.createBufferSource();
        noise.buffer = noiseBuffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1100 * pitchRatio, soundTime);
        filter.Q.value = 1.2;

        const gain = ctx.createGain();
        // 3 mini bursts for handclap rattle
        const burstTimes = [0, 0.011, 0.024];
        burstTimes.forEach((t) => {
          gain.gain.setValueAtTime(0.8, soundTime + t);
          gain.gain.exponentialRampToValueAtTime(0.1, soundTime + t + 0.01);
        });
        gain.gain.setValueAtTime(0.9, soundTime + 0.035);
        gain.gain.exponentialRampToValueAtTime(0.001, soundTime + 0.25);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(soundGain);

        noise.start(soundTime);
        noise.stop(soundTime + 0.26);
        break;
      }

      case 'tom_low':
      case 'tom_mid':
      case 'tom_high': {
        const freqMap = {
          tom_low: 90,
          tom_mid: 135,
          tom_high: 180,
        };
        const baseF = freqMap[soundId] * pitchRatio * kitPitchFactor;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(baseF, soundTime);
        osc.frequency.exponentialRampToValueAtTime(baseF * 0.45, soundTime + 0.25);

        gain.gain.setValueAtTime(0.8, soundTime);
        gain.gain.exponentialRampToValueAtTime(0.001, soundTime + 0.28);

        osc.connect(gain);
        gain.connect(soundGain);

        osc.start(soundTime);
        osc.stop(soundTime + 0.28);
        break;
      }

      case 'cowbell': {
        // Dual square wave oscillators
        const f1 = 800 * pitchRatio;
        const f2 = 540 * pitchRatio;

        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        osc1.type = 'square';
        osc2.type = 'square';
        osc1.frequency.setValueAtTime(f1, soundTime);
        osc2.frequency.setValueAtTime(f2, soundTime);

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(800 * pitchRatio, soundTime);
        filter.Q.value = 2.5;

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.6, soundTime);
        gain.gain.exponentialRampToValueAtTime(0.001, soundTime + 0.22);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(soundGain);

        osc1.start(soundTime);
        osc2.start(soundTime);
        osc1.stop(soundTime + 0.22);
        osc2.stop(soundTime + 0.22);
        break;
      }

      case 'rimshot': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(900 * pitchRatio, soundTime);
        osc.frequency.exponentialRampToValueAtTime(300, soundTime + 0.03);

        gain.gain.setValueAtTime(0.7, soundTime);
        gain.gain.exponentialRampToValueAtTime(0.001, soundTime + 0.04);

        osc.connect(gain);
        gain.connect(soundGain);

        osc.start(soundTime);
        osc.stop(soundTime + 0.04);
        break;
      }

      case 'shaker': {
        const noiseBuffer = this.createWhiteNoiseBuffer(ctx, 0.08);
        const noise = ctx.createBufferSource();
        noise.buffer = noiseBuffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(5500 * pitchRatio, soundTime);

        const gain = ctx.createGain();
        // Attack envelope
        gain.gain.setValueAtTime(0.01, soundTime);
        gain.gain.linearRampToValueAtTime(0.5, soundTime + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, soundTime + 0.07);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(soundGain);

        noise.start(soundTime);
        noise.stop(soundTime + 0.07);
        break;
      }

      case 'cymbal': {
        const noiseBuffer = this.createWhiteNoiseBuffer(ctx, 1.0);
        const noise = ctx.createBufferSource();
        noise.buffer = noiseBuffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(5000 * pitchRatio, soundTime);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.7, soundTime);
        gain.gain.exponentialRampToValueAtTime(0.001, soundTime + 0.75);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(soundGain);

        noise.start(soundTime);
        noise.stop(soundTime + 0.75);
        break;
      }
    }
  }

  private createWhiteNoiseBuffer(ctx: BaseAudioContext, duration: number): AudioBuffer {
    const bufferSize = Math.max(1, Math.floor(ctx.sampleRate * duration));
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  // --- PREVIEW SOUND ---
  public playPreview(track: DrumTrack, kit: DrumKitId = this.kitId) {
    const ctx = this.initAudioContext();
    if (!this.masterGain) return;

    this.triggerSound(
      track.id,
      ctx,
      this.masterGain,
      ctx.currentTime,
      track.volume,
      track.pitch,
      kit
    );
  }

  // --- SCHEDULER & SEQUENCER ---
  public setTracks(tracks: DrumTrack[]) {
    this.tracks = tracks;
  }

  public startSequencer(
    tracks: DrumTrack[],
    bpm: number,
    swing: number,
    kitId: DrumKitId,
    onStep: (step: number) => void
  ) {
    this.initAudioContext();
    this.tracks = tracks;
    this.bpm = bpm;
    this.swing = swing;
    this.kitId = kitId;
    this.onStepCallback = onStep;

    if (this.isPlaying) return;

    this.isPlaying = true;
    this.currentStep = 0;
    if (this.audioCtx) {
      this.nextNoteTime = this.audioCtx.currentTime + 0.05;
    }

    this.scheduler();
  }

  public updateParams(bpm: number, swing: number, kitId: DrumKitId, tracks?: DrumTrack[]) {
    this.bpm = bpm;
    this.swing = swing;
    this.kitId = kitId;
    if (tracks) {
      this.tracks = tracks;
    }
  }

  public stopSequencer() {
    this.isPlaying = false;
    if (this.timerId !== null) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
    }
    this.currentStep = 0;
  }

  private scheduler() {
    if (!this.isPlaying || !this.audioCtx) return;

    // Schedule 100ms lookahead
    while (this.nextNoteTime < this.audioCtx.currentTime + 0.1) {
      this.scheduleStep(this.currentStep, this.nextNoteTime, this.tracks);
      this.advanceStep();
    }

    this.timerId = window.setTimeout(() => this.scheduler(), 25);
  }

  private scheduleStep(step: number, time: number, tracks: DrumTrack[]) {
    // Notify UI step synchronized with actual audio output (accounting for AudioContext hardware output latency)
    if (this.audioCtx) {
      const outputLatency =
        (this.audioCtx.outputLatency || 0) + (this.audioCtx.baseLatency || 0.035);
      const delay = Math.max(0, (time - this.audioCtx.currentTime + outputLatency) * 1000);
      setTimeout(() => {
        if (this.isPlaying && this.onStepCallback) {
          this.onStepCallback(step);
        }
      }, delay);
    }

    // Check solo state
    const isAnySoloed = tracks.some((t) => t.soloed);

    // Play sounds for this step
    tracks.forEach((track) => {
      if (track.steps[step]) {
        // Mute/Solo logic
        if (track.muted) return;
        if (isAnySoloed && !track.soloed) return;

        const velocity = track.velocities[step] ?? 1.0;
        const totalVol = track.volume * velocity;

        if (this.masterGain && this.audioCtx) {
          this.triggerSound(
            track.id,
            this.audioCtx,
            this.masterGain,
            time,
            totalVol,
            track.pitch,
            this.kitId
          );
        }
      }
    });
  }

  private advanceStep() {
    const secondsPer16th = 60 / (this.bpm * 4);
    
    // Swing math: offset even steps (0-indexed steps 1, 3, 5...)
    let stepDuration = secondsPer16th;
    if (this.currentStep % 2 === 0) {
      stepDuration += secondsPer16th * (this.swing * 0.6);
    } else {
      stepDuration -= secondsPer16th * (this.swing * 0.6);
    }

    this.nextNoteTime += stepDuration;
    this.currentStep = (this.currentStep + 1) % 16;
  }

  // --- OFFLINE AUDIO RENDERER (WAV EXPORT) ---
  public async renderWavExport(
    tracks: DrumTrack[],
    bpm: number,
    swing: number,
    kitId: DrumKitId,
    bars: number = 1
  ): Promise<AudioBuffer> {
    const totalSteps = 16 * bars;
    const secondsPer16th = 60 / (bpm * 4);
    
    // Estimate total time
    let totalTime = 0;
    for (let s = 0; s < totalSteps; s++) {
      let dur = secondsPer16th;
      if (s % 2 === 0) {
        dur += secondsPer16th * (swing * 0.6);
      } else {
        dur -= secondsPer16th * (swing * 0.6);
      }
      totalTime += dur;
    }
    // Add extra decay tail for cymbals/reverb
    totalTime += 1.0;

    const sampleRate = 44100;
    const offlineCtx = new OfflineAudioContext(2, Math.ceil(sampleRate * totalTime), sampleRate);
    const masterGain = offlineCtx.createGain();
    masterGain.gain.value = 0.9;
    masterGain.connect(offlineCtx.destination);

    const isAnySoloed = tracks.some((t) => t.soloed);

    let stepTime = 0.05; // tiny lead-in
    for (let s = 0; s < totalSteps; s++) {
      const stepIndex = s % 16;
      
      tracks.forEach((track) => {
        if (track.steps[stepIndex]) {
          if (track.muted) return;
          if (isAnySoloed && !track.soloed) return;

          const vel = track.velocities[stepIndex] ?? 1.0;
          this.triggerSound(
            track.id,
            offlineCtx,
            masterGain,
            stepTime,
            track.volume * vel,
            track.pitch,
            kitId
          );
        }
      });

      let dur = secondsPer16th;
      if (stepIndex % 2 === 0) {
        dur += secondsPer16th * (swing * 0.6);
      } else {
        dur -= secondsPer16th * (swing * 0.6);
      }
      stepTime += dur;
    }

    return await offlineCtx.startRendering();
  }
}

export const drumSynth = new DrumSynthEngine();
