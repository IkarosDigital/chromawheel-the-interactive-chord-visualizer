import React, { useEffect, useCallback, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import ChromaWheel from '@/components/ChromaWheel';
import ControlPanel from '@/components/ControlPanel';
import HelpModal from '@/components/HelpModal';
import RecommendationMatrix from '@/components/RecommendationMatrix';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { PanelRightOpen, HelpCircle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useChromaWheelStore } from '@/hooks/useChromaWheelStore';
import { audioEngine } from '@/lib/audio';
import { initializeMidi, isMidiSupported } from '@/lib/midi';
import { useKeyboardInput } from '@/hooks/useKeyboardInput';
export function HomePage() {
  const isMobile = useIsMobile();
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const volume = useChromaWheelStore(state => state.volume);
  const waveform = useChromaWheelStore(state => state.waveform);
  const attack = useChromaWheelStore(state => state.attack);
  const decay = useChromaWheelStore(state => state.decay);
  const release = useChromaWheelStore(state => state.release);
  const setMidiSupported = useChromaWheelStore(state => state.setMidiSupported);
  const setMidiDevices = useChromaWheelStore(state => state.setMidiDevices);
  const addActiveNote = useChromaWheelStore(state => state.addActiveNote);
  const removeActiveNote = useChromaWheelStore(state => state.removeActiveNote);
  const selectedMidiDevice = useChromaWheelStore(state => state.selectedMidiDevice);
  // Initialize audio engine and listeners
  useEffect(() => {
    const initAudio = async () => {
      await audioEngine.resume();
    };
    // Resume audio context on user interaction
    document.addEventListener('click', initAudio, { once: true });
    document.addEventListener('keydown', initAudio, { once: true });
    return () => {
      document.removeEventListener('click', initAudio);
      document.removeEventListener('keydown', initAudio);
    };
  }, []);
  // Update audio engine settings from store
  useEffect(() => {
    audioEngine.setVolume(volume);
    audioEngine.setWaveform(waveform);
    audioEngine.setADSR({ attack, decay, release });
  }, [volume, waveform, attack, decay, release]);
  // MIDI Initialization
  const onMidiMessage = useCallback((command: number, note: number, velocity: number) => {
    const noteOnCommand = 144;
    const noteOffCommand = 128;
    if (command === noteOnCommand && velocity > 0) {
      audioEngine.noteOn(note, velocity);
      addActiveNote(note);
    } else if (command === noteOffCommand || (command === noteOnCommand && velocity === 0)) {
      audioEngine.noteOff(note);
      removeActiveNote(note);
    }
  }, [addActiveNote, removeActiveNote]);
  useEffect(() => {
    if (isMidiSupported()) {
      setMidiSupported(true);
      const cleanupPromise = initializeMidi(onMidiMessage, selectedMidiDevice).then(({ devices, cleanup }) => {
        setMidiDevices(devices);
        return cleanup;
      });
      return () => {
        cleanupPromise.then(cleanupFunc => cleanupFunc && cleanupFunc());
      };
    } else {
      setMidiSupported(false);
    }
  }, [setMidiSupported, setMidiDevices, selectedMidiDevice, onMidiMessage]);
  // Keyboard Input Hook
  const noteOn = useCallback((note: number) => {
    audioEngine.noteOn(note);
    addActiveNote(note);
  }, [addActiveNote]);
  const noteOff = useCallback((note: number) => {
    audioEngine.noteOff(note);
    removeActiveNote(note);
  }, [removeActiveNote]);
  useKeyboardInput(noteOn, noteOff);
  // Set dark theme on mount
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);
  const controlPanel = <ControlPanel />;
  return (
    <>
      <main className="min-h-screen w-full bg-background text-foreground flex flex-col md:flex-row items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
        <div className="absolute inset-0 w-full h-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.15),rgba(255,255,255,0))] -z-10" />
        <div className="absolute top-4 left-4 z-50">
          <Button variant="ghost" size="icon" onClick={() => setIsHelpOpen(true)}>
            <HelpCircle className="h-6 w-6" />
          </Button>
        </div>
        <div className="flex-grow flex items-center justify-center w-full h-full md:w-2/3">
          <ChromaWheel />
        </div>
        {isMobile ? (
          <div className="fixed top-4 right-4 z-50">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="shadow-lg bg-card/50 backdrop-blur-sm">
                  <PanelRightOpen className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[320px] sm:w-[400px] p-0 border-l">
                <div className="h-full overflow-y-auto">
                  {controlPanel}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        ) : (
          <div className="w-full md:w-1/3 max-w-sm flex-shrink-0 p-4">
            {controlPanel}
          </div>
        )}
        <footer className="absolute bottom-4 text-center text-muted-foreground/50 text-sm">
          Built with ❤️ at Cloudflare
        </footer>
      </main>
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      <RecommendationMatrix />
    </>
  );
}