import { create } from 'zustand';
import { getChordNotes, LayoutMode, AccidentalMode } from '@/lib/music';
import { Waveform } from '@/lib/audio';
import { MidiDevice } from '@/lib/midi';
export interface ChromaWheelState {
  // Visual State
  layoutMode: LayoutMode;
  accidentalMode: AccidentalMode;
  rootNote: number;
  chordType: string;
  selectedNotes: Set<number>;
  showIntervals: boolean;
  isRecommendationMatrixOpen: boolean;
  // Audio State
  volume: number;
  waveform: Waveform;
  attack: number;
  decay: number;
  release: number;
  // Input State
  activeNotes: Set<number>; // Notes played from keyboard/MIDI
  isKeyboardActive: boolean;
  midiSupported: boolean;
  midiDevices: MidiDevice[];
  selectedMidiDevice: string | null;
  // Export State
  exportOctave: number;
  exportTempo: number;
  // Actions
  setLayoutMode: (mode: LayoutMode) => void;
  setAccidentalMode: (mode: AccidentalMode) => void;
  setRootNote: (note: number) => void;
  setChordType: (type: string) => void;
  toggleShowIntervals: () => void;
  toggleRecommendationMatrix: () => void;
  setVolume: (volume: number) => void;
  setWaveform: (waveform: Waveform) => void;
  setAttack: (attack: number) => void;
  setDecay: (decay: number) => void;
  setRelease: (release: number) => void;
  addActiveNote: (note: number) => void;
  removeActiveNote: (note: number) => void;
  toggleKeyboardActive: () => void;
  setMidiSupported: (supported: boolean) => void;
  setMidiDevices: (devices: MidiDevice[]) => void;
  setSelectedMidiDevice: (deviceId: string | null) => void;
  setExportOctave: (octave: number) => void;
  setExportTempo: (tempo: number) => void;
}
const updateSelectedNotes = (rootNote: number, chordType: string): Set<number> => {
  return new Set(getChordNotes(rootNote, chordType));
};
export const useChromaWheelStore = create<ChromaWheelState>((set) => ({
  // Visual State
  layoutMode: 'circleOfFifths',
  accidentalMode: 'sharps',
  rootNote: 0, // C
  chordType: 'major',
  selectedNotes: updateSelectedNotes(0, 'major'),
  showIntervals: false,
  isRecommendationMatrixOpen: false,
  // Audio State
  volume: 0.8,
  waveform: 'triangle',
  attack: 0.02,
  decay: 0.1,
  release: 0.5,
  // Input State
  activeNotes: new Set(),
  isKeyboardActive: true,
  midiSupported: false,
  midiDevices: [],
  selectedMidiDevice: null,
  // Export State
  exportOctave: 4,
  exportTempo: 120,
  // Actions
  setLayoutMode: (mode) => set({ layoutMode: mode }),
  setAccidentalMode: (mode) => set({ accidentalMode: mode }),
  setRootNote: (note) => set((state) => ({
    rootNote: note,
    selectedNotes: updateSelectedNotes(note, state.chordType),
  })),
  setChordType: (type) => set((state) => ({
    chordType: type,
    selectedNotes: updateSelectedNotes(state.rootNote, type),
  })),
  toggleShowIntervals: () => set((state) => ({ showIntervals: !state.showIntervals })),
  toggleRecommendationMatrix: () => set((state) => ({ isRecommendationMatrixOpen: !state.isRecommendationMatrixOpen })),
  setVolume: (volume) => set({ volume }),
  setWaveform: (waveform) => set({ waveform }),
  setAttack: (attack) => set({ attack }),
  setDecay: (decay) => set({ decay }),
  setRelease: (release) => set({ release }),
  addActiveNote: (note) => set((state) => {
    // Avoid creating a new Set if the note is already active to prevent unnecessary re-renders.
    if (state.activeNotes.has(note)) {
      return state;
    }
    const newActiveNotes = new Set(state.activeNotes);
    newActiveNotes.add(note);
    return { activeNotes: newActiveNotes };
  }),
  removeActiveNote: (note) => set((state) => {
    // Avoid creating a new Set if the note is not active to prevent unnecessary re-renders.
    if (!state.activeNotes.has(note)) {
      return state;
    }
    const newActiveNotes = new Set(state.activeNotes);
    newActiveNotes.delete(note);
    return { activeNotes: newActiveNotes };
  }),
  toggleKeyboardActive: () => set(state => ({ isKeyboardActive: !state.isKeyboardActive })),
  setMidiSupported: (supported) => set({ midiSupported: supported }),
  setMidiDevices: (devices) => set({ midiDevices: devices }),
  setSelectedMidiDevice: (deviceId) => set({ selectedMidiDevice: deviceId }),
  setExportOctave: (octave) => set({ exportOctave: octave }),
  setExportTempo: (tempo) => set({ exportTempo: tempo }),
}));