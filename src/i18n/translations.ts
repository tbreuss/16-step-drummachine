export type Language = 'de' | 'en';

export const translations = {
  de: {
    // Header
    appTitle: '16-Step Drum Sequencer',
    appSubtitle: 'Analoger Synthesizer & Web Audio Rhythm Station',
    beatNamePlaceholder: 'Beat Name eingeben...',
    beatNameTitle: 'Beat Name bearbeiten',
    selectKit: 'Drum-Kit wählen...',
    selectPreset: 'Presets / Styles...',
    randomPattern: 'Zufall',
    clearPattern: 'Leeren',
    exportButton: 'EXPORT',
    exportTitle: 'Beat als WAV-Audio oder JSON-Projekt exportieren',
    defaultBeatName: 'Mein Beat 01',
    newBeatName: 'Neuer Beat',

    // Transport Bar
    stopSpace: 'Stoppen (Leertaste)',
    playSpace: 'Abspielen (Leertaste)',
    tempoBpm: 'TEMPO (BPM)',
    tapTempo: 'TAP TEMPO',
    swing: 'SWING',
    master: 'MASTER',
    stepDisplay: 'SCHRITT ANZEIGE',
    step: 'STEP',

    // Drum Grid
    instrument: 'INSTRUMENT',
    previewTitle: 'probehören',
    muteTitle: 'Stummschalten (Mute)',
    soloTitle: 'Solo anhören',
    trackSettingsTitle: 'Spur-Einstellungen (Lautstärke, Pitch, Pan)',
    stepTooltipActiveAccent: 'Aktiv (Akzent/Laut)',
    stepTooltipActiveNormal: 'Aktiv (Normal)',
    stepTooltipInactive: 'Inaktiv',
    stepTooltipRightClick: 'Rechtsklick für Akzent',

    // Track Settings Modal
    trackSettingsHeader: 'Spur-Einstellungen',
    volume: 'Lautstärke',
    pan: 'Panorama (Pan)',
    panCenter: 'Center (C)',
    pitch: 'Tonhöhe (Pitch)',
    semitoneSingular: 'Halbtonschritt',
    semitonePlural: 'Halbtonschritte',
    quickStepPresets: 'Schnellauswahl für Steps',
    fillFourOnFloor: '4-on-the-Floor (1,5,9,13)',
    fillOffbeat: 'Offbeats (3,7,11,15)',
    fillAll: 'Alle 16 füllen',
    clearTrack: 'Spur leeren',
    done: 'Fertig',

    // Export Modal
    exportHeader: 'BEAT EXPORTIEREN',
    exportModalHeader: 'BEAT EXPORTIEREN',
    exportModalSubheader: 'Als WAV-Audiodatei oder JSON-Projekt exportieren',
    wavTab: 'WAV Audio Loop',
    jsonTab: 'JSON Projektdatei',
    beatNameLabel: 'Beat Name:',
    tempoLabel: 'Tempo:',
    kitLabel: 'Drum Kit:',
    drumkitLabel: 'Drum Kit:',
    formatLabel: 'Format:',
    loopLength: 'Loop-Länge:',
    selectLoopLength: 'Loop-Länge für Export wählen:',
    barSingular: 'Takt',
    barPlural: 'Takte',
    stepsCount: 'Steps',
    exportWavAction: 'WAV-Datei Render & Download',
    rendering: 'Render Audio...',
    renderingWav: 'Rendert WAV Audio...',
    downloadWavButton: 'WAV Beat herunterladen',
    jsonDesc: 'Speichere dein Drum-Pattern als JSON-Datei, um es später wieder zu laden oder mit anderen Produzenten zu teilen.',
    jsonDescription: 'Speichere dein erstelltes Pattern als JSON-Datei oder kopiere den Code, um deine Rhythmen jederzeit wieder in der Drummachine zu laden.',
    downloadJson: 'JSON Projekt herunterladen',
    downloadJsonButton: 'JSON Datei laden',
    copyToClipboard: 'In Zwischenablage kopieren',
    copyClipboard: 'In Zwischenablage',
    copied: 'Kopiert!',
    close: 'Schließen',

    // Keyboard Shortcuts section
    keyboardHeader: 'Tastatur-Steuerung & Live Performance Pads',
    pressSpace: 'Drücke',
    spacebar: 'Leertaste',
    forStartStop: 'für Start/Stopp | Tasten',
    toTriggerLive: 'zum Live-Triggern der Samples!',
    hideKeymap: 'Tastenbelegung ausblenden',
    showKeymap: 'Tastenbelegung anzeigen',
    invalidJson: 'Ungültiges JSON-Projektformat!',
    footerText: '16-Step Drummachine Pro • High Precision Web Audio Synthesis • Audio WAV Export',

    // Preset & Kit descriptions
    kits: {
      classic808: {
        name: 'Classic 808',
        desc: 'Legendärer Analogsound mit tiefem Sub-Kick und warmen Snares.',
      },
      dance909: {
        name: 'Dance 909',
        desc: 'Druckvolle Club-Drums für House, Techno & Electro.',
      },
      synthwave: {
        name: 'Retro 80s Synth',
        desc: 'Klassischer Cyberpunk- & Synthwave-Sound der 80er.',
      },
      acoustic: {
        name: 'Studio Punch',
        desc: 'Kompakte, knackige Drums mit natürlichem Transienten-Verhalten.',
      },
    },
    presets: {
      hiphop808: {
        name: 'Classic 808 Hip-Hop',
        desc: 'Grooviger Boom-Bap Beat mit synkopierter Kick und schnellem Offbeat Snare Roll.',
      },
      house909: {
        name: '909 House Drive',
        desc: 'Klassischer Four-on-the-Floor Club Beat mit druckvollem Clap und offener Hi-Hat.',
      },
      synthwave80s: {
        name: 'Synthwave Night Driver',
        desc: 'Neon-getränkter 80er Synth-Pop Beat mit fatter Tom-Fill und energetischem Drive.',
      },
      trap140: {
        name: 'Trap Rolling 140',
        desc: 'Dunkler Trap Beat mit 808 Sub Kick, schnellen Hi-Hat Rolls und Snare auf Beat 3.',
      },
      discofunk: {
        name: 'Disco Funk Groove',
        desc: 'Tanzbarer Funky Beat mit knackigem Swing, Cowbell-Akzenten und Shaker.',
      },
      latinpercussion: {
        name: 'Latin Bossa & Percussion',
        desc: 'Synkopierter lateinamerikanischer Rhythmus mit Rimshot, Shaker und Cowbell.',
      },
    },
  },
  en: {
    // Header
    appTitle: '16-Step Drum Sequencer',
    appSubtitle: 'Analog Synthesizer & Web Audio Rhythm Station',
    beatNamePlaceholder: 'Enter Beat Name...',
    beatNameTitle: 'Edit Beat Name',
    selectKit: 'Select Drum Kit...',
    selectPreset: 'Presets / Styles...',
    randomPattern: 'Random',
    clearPattern: 'Clear',
    exportButton: 'EXPORT',
    exportTitle: 'Export beat as WAV audio or JSON project',
    defaultBeatName: 'My Beat 01',
    newBeatName: 'New Beat',

    // Transport Bar
    stopSpace: 'Stop (Spacebar)',
    playSpace: 'Play (Spacebar)',
    tempoBpm: 'TEMPO (BPM)',
    tapTempo: 'TAP TEMPO',
    swing: 'SWING',
    master: 'MASTER',
    stepDisplay: 'STEP DISPLAY',
    step: 'STEP',

    // Drum Grid
    instrument: 'INSTRUMENT',
    previewTitle: 'preview',
    muteTitle: 'Mute track',
    soloTitle: 'Listen solo',
    trackSettingsTitle: 'Track Settings (Volume, Pitch, Pan)',
    stepTooltipActiveAccent: 'Active (Accent/Loud)',
    stepTooltipActiveNormal: 'Active (Normal)',
    stepTooltipInactive: 'Inactive',
    stepTooltipRightClick: 'Right click for accent',

    // Track Settings Modal
    trackSettingsHeader: 'Track Settings',
    volume: 'Volume',
    pan: 'Pan',
    panCenter: 'Center (C)',
    pitch: 'Pitch',
    semitoneSingular: 'semitone step',
    semitonePlural: 'semitone steps',
    quickStepPresets: 'Quick Step Presets',
    fillFourOnFloor: '4-on-the-Floor (1,5,9,13)',
    fillOffbeat: 'Offbeats (3,7,11,15)',
    fillAll: 'Fill all 16',
    clearTrack: 'Clear track',
    done: 'Done',

    // Export Modal
    exportHeader: 'EXPORT BEAT',
    exportModalHeader: 'EXPORT BEAT',
    exportModalSubheader: 'Export as WAV audio file or JSON project',
    wavTab: 'WAV Audio Loop',
    jsonTab: 'JSON Project File',
    beatNameLabel: 'Beat Name:',
    tempoLabel: 'Tempo:',
    kitLabel: 'Drum Kit:',
    drumkitLabel: 'Drum Kit:',
    formatLabel: 'Format:',
    loopLength: 'Loop Length:',
    selectLoopLength: 'Select loop length for export:',
    barSingular: 'Bar',
    barPlural: 'Bars',
    stepsCount: 'Steps',
    exportWavAction: 'Render & Download WAV File',
    rendering: 'Rendering Audio...',
    renderingWav: 'Rendering WAV Audio...',
    downloadWavButton: 'Download WAV Beat',
    jsonDesc: 'Save your drum pattern as a JSON file to reload it later or share with other producers.',
    jsonDescription: 'Save your pattern as a JSON file or copy the code to reload your rhythms anytime in the drum machine.',
    downloadJson: 'Download JSON Project',
    downloadJsonButton: 'Download JSON File',
    copyToClipboard: 'Copy to Clipboard',
    copyClipboard: 'To Clipboard',
    copied: 'Copied!',
    close: 'Close',

    // Keyboard Shortcuts section
    keyboardHeader: 'Keyboard Controls & Live Performance Pads',
    pressSpace: 'Press',
    spacebar: 'Spacebar',
    forStartStop: 'for Start/Stop | Keys',
    toTriggerLive: 'to trigger samples live!',
    hideKeymap: 'Hide keymap',
    showKeymap: 'Show keymap',
    invalidJson: 'Invalid JSON project format!',
    footerText: '16-Step Drummachine Pro • High Precision Web Audio Synthesis • Audio WAV Export',

    // Preset & Kit descriptions
    kits: {
      classic808: {
        name: 'Classic 808',
        desc: 'Legendary analog sound with deep sub-kick and warm snares.',
      },
      dance909: {
        name: 'Dance 909',
        desc: 'Punchy club drums for House, Techno & Electro.',
      },
      synthwave: {
        name: 'Retro 80s Synth',
        desc: 'Classic 80s Cyberpunk & Synthwave sound.',
      },
      acoustic: {
        name: 'Studio Punch',
        desc: 'Tight, punchy acoustic drums with natural transient response.',
      },
    },
    presets: {
      hiphop808: {
        name: 'Classic 808 Hip-Hop',
        desc: 'Groovy Boom-Bap beat with syncopated kick and fast offbeat snare roll.',
      },
      house909: {
        name: '909 House Drive',
        desc: 'Classic Four-on-the-Floor club beat with punchy clap and open hi-hat.',
      },
      synthwave80s: {
        name: 'Synthwave Night Driver',
        desc: 'Neon-drenched 80s synth-pop beat with fat tom fill and energetic drive.',
      },
      trap140: {
        name: 'Trap Rolling 140',
        desc: 'Dark Trap beat with 808 sub kick, fast hi-hat rolls, and snare on beat 3.',
      },
      discofunk: {
        name: 'Disco Funk Groove',
        desc: 'Danceable funky beat with snappy swing, cowbell accents, and shaker.',
      },
      latinpercussion: {
        name: 'Latin Bossa & Percussion',
        desc: 'Syncopated Latin rhythm with rimshot, shaker, and cowbell.',
      },
    },
  },
} as const;
