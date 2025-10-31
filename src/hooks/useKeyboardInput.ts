import { useEffect, useCallback } from 'react';
import { useChromaWheelStore } from './useChromaWheelStore';
const KEY_TO_NOTE_MAP: Record<string, number> = {
  // Bottom row (white keys C3-B3)
  'z': 48, 'x': 50, 'c': 52, 'v': 53, 'b': 55, 'n': 57, 'm': 59,
  // Bottom row (black keys C#3-A#3)
  's': 49, 'd': 51, 'g': 54, 'h': 56, 'j': 58,
  // Top row (white keys C4-B4)
  'q': 60, 'w': 62, 'e': 64, 'r': 65, 't': 67, 'y': 69, 'u': 71,
  // Top row (black keys C#4-A#4)
  '2': 61, '3': 63, '5': 66, '6': 68, '7': 70,
};
export const useKeyboardInput = (noteOn: (note: number) => void, noteOff: (note: number) => void) => {
  const isKeyboardActive = useChromaWheelStore(state => state.isKeyboardActive);
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.repeat || !isKeyboardActive) return;
    const note = KEY_TO_NOTE_MAP[event.key.toLowerCase()];
    if (note) {
      noteOn(note);
    }
  }, [noteOn, isKeyboardActive]);
  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    if (!isKeyboardActive) return;
    const note = KEY_TO_NOTE_MAP[event.key.toLowerCase()];
    if (note) {
      noteOff(note);
    }
  }, [noteOff, isKeyboardActive]);
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);
};