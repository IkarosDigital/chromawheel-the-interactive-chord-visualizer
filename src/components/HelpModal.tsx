import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}
const keyboardLayout = [
  { key: 'Q', note: 'C4', type: 'white' }, { key: '2', note: 'C#4', type: 'black' },
  { key: 'W', note: 'D4', type: 'white' }, { key: '3', note: 'D#4', type: 'black' },
  { key: 'E', note: 'E4', type: 'white' }, { key: 'R', note: 'F4', type: 'white' },
  { key: '5', note: 'F#4', type: 'black' }, { key: 'T', note: 'G4', type: 'white' },
  { key: '6', note: 'G#4', type: 'black' }, { key: 'Y', note: 'A4', type: 'white' },
  { key: '7', note: 'A#4', type: 'black' }, { key: 'U', note: 'B4', type: 'white' },
];
const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Welcome to ChromaWheel!</DialogTitle>
          <DialogDescription>
            A quick guide to exploring musical harmony.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-4">
          <div className="space-y-2">
            <h3 className="font-semibold">Quick Start</h3>
            <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
              <li>Click a segment on the outer wheel to select a <span className="text-primary font-semibold">root note</span>.</li>
              <li>Use the <span className="font-semibold">Key & Chord</span> panel to choose a chord type.</li>
              <li>The wheel will animate, highlighting the chord's notes.</li>
              <li>Use your computer keyboard or a MIDI device to play notes.</li>
            </ol>
          </div>
          <Separator />
          <div className="space-y-2">
            <h3 className="font-semibold">Computer Keyboard Piano</h3>
            <p className="text-sm text-muted-foreground">
              Use the top two rows of your keyboard to play notes. The layout mimics a piano.
            </p>
            <div className="flex flex-wrap gap-1 mt-2">
              {keyboardLayout.map(({ key, note, type }) => (
                <Badge key={key} variant={type === 'white' ? 'secondary' : 'default'}>
                  <span className="font-bold mr-1">{key}</span> = {note}
                </Badge>
              ))}
            </div>
             <p className="text-xs text-muted-foreground/80 pt-2">
              The bottom row (Z, S, X, D, C...) is mapped to the octave below (C3-B3).
            </p>
          </div>
          <Separator />
          <div className="space-y-2">
            <h3 className="font-semibold">Control Panel Guide</h3>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li><span className="font-semibold">Layout:</span> Switch between Circle of Fifths and Chromatic views. Toggle between Sharps (♯) and Flats (♭).</li>
              <li><span className="font-semibold">Audio:</span> Customize the synthesizer's sound, including waveform, volume, and ADSR envelope.</li>
              <li><span className="font-semibold">Input:</span> Enable/disable keyboard input and select a connected MIDI device.</li>
              <li><span className="font-semibold">Export:</span> Save the current wheel as a PNG image or the selected chord as a MIDI file.</li>
            </ul>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Got it!</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default HelpModal;