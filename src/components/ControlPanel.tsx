import React from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useChromaWheelStore } from '@/hooks/useChromaWheelStore';
import { NOTE_NAMES_SHARP, NOTE_NAMES_FLAT, CHORD_FORMULAS, LayoutMode, getNoteName } from '@/lib/music';
import { exportToPng, exportToMidi } from '@/lib/export';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Music, Settings, Download, Volume2, Piano, Lightbulb } from 'lucide-react';
import { Waveform } from '@/lib/audio';
const ControlPanel: React.FC = () => {
  const {
    layoutMode, accidentalMode, rootNote, chordType, showIntervals, selectedNotes,
    volume, waveform, attack, decay, release, isKeyboardActive, midiSupported,
    midiDevices, selectedMidiDevice, exportOctave, exportTempo,
    setLayoutMode, setAccidentalMode, setRootNote, setChordType, toggleShowIntervals,
    setVolume, setWaveform, setAttack, setDecay, setRelease, setSelectedMidiDevice,
    toggleKeyboardActive, setExportOctave, setExportTempo, toggleRecommendationMatrix,
  } = useChromaWheelStore(
    useShallow((s) => ({
      layoutMode: s.layoutMode,
      accidentalMode: s.accidentalMode,
      rootNote: s.rootNote,
      chordType: s.chordType,
      showIntervals: s.showIntervals,
      selectedNotes: s.selectedNotes,
      volume: s.volume,
      waveform: s.waveform,
      attack: s.attack,
      decay: s.decay,
      release: s.release,
      isKeyboardActive: s.isKeyboardActive,
      midiSupported: s.midiSupported,
      midiDevices: s.midiDevices,
      selectedMidiDevice: s.selectedMidiDevice,
      exportOctave: s.exportOctave,
      exportTempo: s.exportTempo,
      setLayoutMode: s.setLayoutMode,
      setAccidentalMode: s.setAccidentalMode,
      setRootNote: s.setRootNote,
      setChordType: s.setChordType,
      toggleShowIntervals: s.toggleShowIntervals,
      setVolume: s.setVolume,
      setWaveform: s.setWaveform,
      setAttack: s.setAttack,
      setDecay: s.setDecay,
      setRelease: s.setRelease,
      setSelectedMidiDevice: s.setSelectedMidiDevice,
      toggleKeyboardActive: s.toggleKeyboardActive,
      setExportOctave: s.setExportOctave,
      setExportTempo: s.setExportTempo,
      toggleRecommendationMatrix: s.toggleRecommendationMatrix,
    }))
  );
  const useSharps = accidentalMode === 'sharps';
  const noteNames = useSharps ? NOTE_NAMES_SHARP : NOTE_NAMES_FLAT;
  const handleExportPng = () => {
    const svgElement = document.querySelector<SVGSVGElement>('svg');
    if (svgElement) {
      const rootNoteName = getNoteName(rootNote, useSharps).replace('♯', 's');
      const fileName = `ChromaWheel_${rootNoteName}_${chordType}`;
      exportToPng(svgElement, fileName);
    }
  };
  const handleExportMidi = () => {
    const rootNoteName = getNoteName(rootNote, useSharps).replace('♯', 's');
    const fileName = `ChromaWheel_${rootNoteName}_${chordType}`;
    exportToMidi(rootNote, Array.from(selectedNotes), exportOctave, exportTempo, fileName);
  };
  return (
    <Card className="w-full max-w-sm border-0 md:border md:bg-card/50 md:backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="font-display text-3xl text-center">ChromaWheel</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" defaultValue={['item-1', 'item-2']} className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger><Settings className="w-4 h-4 mr-2" />Layout</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>Mode</Label>
                <ToggleGroup type="single" value={layoutMode} onValueChange={(value: LayoutMode) => value && setLayoutMode(value)} className="w-full grid grid-cols-2">
                  <ToggleGroupItem value="circleOfFifths">Fifths</ToggleGroupItem>
                  <ToggleGroupItem value="chromatic">Chromatic</ToggleGroupItem>
                </ToggleGroup>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="accidental-switch">Use Sharps (♯)</Label>
                <Switch id="accidental-switch" checked={useSharps} onCheckedChange={(checked) => setAccidentalMode(checked ? 'sharps' : 'flats')} />
              </div>
               <div className="flex items-center justify-between">
                <Label htmlFor="interval-switch">Show Intervals</Label>
                <Switch id="interval-switch" checked={showIntervals} onCheckedChange={toggleShowIntervals} />
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger><Music className="w-4 h-4 mr-2" />Key & Chord</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>Root Note</Label>
                <Select value={String(rootNote)} onValueChange={(val) => setRootNote(Number(val))}>
                  <SelectTrigger key={`trigger-${accidentalMode}`}><SelectValue placeholder="Select root note..." /></SelectTrigger>
                  <SelectContent key={accidentalMode}>
                    {noteNames.map((name, i) => <SelectItem key={i} value={String(i)}>{name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Chord Type</Label>
                <Select value={chordType} onValueChange={setChordType}>
                  <SelectTrigger><SelectValue placeholder="Select chord type..." /></SelectTrigger>
                  <SelectContent>
                    {Object.keys(CHORD_FORMULAS).map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="pt-2">
                <Button variant="outline" className="w-full" onClick={toggleRecommendationMatrix}>
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Show Recommendations
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger><Volume2 className="w-4 h-4 mr-2" />Audio</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>Waveform</Label>
                <Select value={waveform} onValueChange={(v: Waveform) => setWaveform(v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sine">Sine</SelectItem>
                    <SelectItem value="triangle">Triangle</SelectItem>
                    <SelectItem value="sawtooth">Sawtooth</SelectItem>
                    <SelectItem value="square">Square</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Volume</Label><Slider value={[volume * 100]} onValueChange={([v]) => setVolume(v / 100)} /></div>
              <div className="space-y-2"><Label>Attack</Label><Slider value={[attack * 1000]} max={1000} onValueChange={([v]) => setAttack(v / 1000)} /></div>
              <div className="space-y-2"><Label>Decay</Label><Slider value={[decay * 1000]} max={1000} onValueChange={([v]) => setDecay(v / 1000)} /></div>
              <div className="space-y-2"><Label>Release</Label><Slider value={[release * 1000]} max={2000} onValueChange={([v]) => setRelease(v / 1000)} /></div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger><Piano className="w-4 h-4 mr-2" />Input</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <Label htmlFor='keyboard-input-switch'>Keyboard Input</Label>
                <Switch id='keyboard-input-switch' checked={isKeyboardActive} onCheckedChange={toggleKeyboardActive} />
              </div>
              {midiSupported ? (
                <div className="space-y-2">
                  <Label>MIDI Device</Label>
                  <Select
                    value={selectedMidiDevice || ""}
                    onValueChange={(deviceId) => setSelectedMidiDevice(deviceId)}
                    disabled={midiDevices.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={midiDevices.length > 0 ? "Select MIDI device..." : "No MIDI devices found"} />
                    </SelectTrigger>
                    <SelectContent>
                      {midiDevices.map(device => (
                        <SelectItem key={device.id} value={device.id}>{device.name || 'Unnamed Device'}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">MIDI not supported in this browser.</p>
              )}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5">
            <AccordionTrigger><Download className="w-4 h-4 mr-2" />Export</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={handleExportPng}>Export PNG</Button>
                <Button variant="outline" onClick={handleExportMidi}>Export MIDI</Button>
              </div>
              <div className="space-y-2">
                <Label>MIDI Root Octave</Label>
                <Select value={String(exportOctave)} onValueChange={(v) => setExportOctave(Number(v))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6].map(o => <SelectItem key={o} value={String(o)}>{o}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>MIDI Tempo (BPM)</Label>
                <Input type="number" value={exportTempo} onChange={(e) => setExportTempo(Number(e.target.value))} min="40" max="240" />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};
export default ControlPanel;