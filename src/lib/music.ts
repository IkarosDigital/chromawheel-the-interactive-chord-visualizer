export type LayoutMode = 'circleOfFifths' | 'chromatic';
export type AccidentalMode = 'sharps' | 'flats';
export const NOTE_NAMES_SHARP = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
export const NOTE_NAMES_FLAT = ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'G♭', 'G', 'A♭', 'A', 'B♭', 'B'];
export const LAYOUTS = {
  chromatic: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  circleOfFifths: [0, 7, 2, 9, 4, 11, 6, 1, 8, 3, 10, 5],
};
export const CHORD_FORMULAS: Record<string, number[]> = {
  major: [0, 4, 7],
  minor: [0, 3, 7],
  diminished: [0, 3, 6],
  augmented: [0, 4, 8],
  sus2: [0, 2, 7],
  sus4: [0, 5, 7],
  major6: [0, 4, 7, 9],
  minor6: [0, 3, 7, 9],
  dom7: [0, 4, 7, 10],
  maj7: [0, 4, 7, 11],
  min7: [0, 3, 7, 10],
  minMaj7: [0, 3, 7, 11],
  dim7: [0, 3, 6, 9],
  halfDim7: [0, 3, 6, 10], // m7b5
  aug7: [0, 4, 8, 10],
  augMaj7: [0, 4, 8, 11],
  add9: [0, 4, 7, 14],
  '6/9': [0, 4, 7, 9, 14],
};
export const SCALE_FORMULAS = {
  major: [0, 2, 4, 5, 7, 9, 11],
  naturalMinor: [0, 2, 3, 5, 7, 8, 10],
};
export const DIATONIC_CHORD_QUALITIES = {
  major: [
    { degree: 'I', quality: 'major' },
    { degree: 'ii', quality: 'minor' },
    { degree: 'iii', quality: 'minor' },
    { degree: 'IV', quality: 'major' },
    { degree: 'V', quality: 'major' },
    { degree: 'vi', quality: 'minor' },
    { degree: 'vii°', quality: 'diminished' },
  ],
  minor: [
    { degree: 'i', quality: 'minor' },
    { degree: 'ii°', quality: 'diminished' },
    { degree: 'III', quality: 'major' },
    { degree: 'iv', quality: 'minor' },
    { degree: 'v', quality: 'minor' },
    { degree: 'VI', quality: 'major' },
    { degree: 'VII', quality: 'major' },
  ],
};
export const getNoteName = (note: number, useSharps: boolean): string => {
  const noteIndex = note % 12;
  return useSharps ? NOTE_NAMES_SHARP[noteIndex] : NOTE_NAMES_FLAT[noteIndex];
};
export const getChordNotes = (rootNote: number, chordType: string): number[] => {
  const formula = CHORD_FORMULAS[chordType];
  if (!formula) return [];
  return formula.map(interval => (rootNote + interval) % 12);
};
export const getIntervalName = (interval: number): string => {
  const modInterval = interval % 12;
  switch (modInterval) {
    case 0: return 'R';
    case 1: return '♭2';
    case 2: return '2';
    case 3: return '♭3';
    case 4: return '3';
    case 5: return '4';
    case 6: return '♭5';
    case 7: return '5';
    case 8: return '♯5';
    case 9: return '6';
    case 10: return '♭7';
    case 11: return '7';
    default: return '';
  }
};
export const getRecommendedChords = (
  keyRootNote: number,
  scaleType: 'major' | 'minor' = 'major',
  useSharps: boolean
) => {
  const scaleIntervals = SCALE_FORMULAS[scaleType === 'major' ? 'major' : 'naturalMinor'];
  const qualities = DIATONIC_CHORD_QUALITIES[scaleType];
  return scaleIntervals.map((interval, index) => {
    const chordRoot = (keyRootNote + interval) % 12;
    const { degree, quality } = qualities[index];
    const rootName = getNoteName(chordRoot, useSharps);
    let chordName = rootName;
    if (quality === 'minor') chordName += 'm';
    else if (quality === 'diminished') chordName += '°';
    return {
      degree,
      root: chordRoot,
      quality,
      name: chordName,
    };
  });
};