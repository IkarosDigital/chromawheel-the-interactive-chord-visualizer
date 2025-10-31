/**
 * Converts an SVG element to a downloadable PNG file.
 * @param svgElement The SVG element to export.
 * @param fileName The desired name of the output PNG file.
 */
export const exportToPng = (svgElement: SVGSVGElement, fileName: string): void => {
  if (!svgElement) {
    console.error("SVG element not found for export.");
    return;
  }
  const serializer = new XMLSerializer();
  let source = serializer.serializeToString(svgElement);
  // Add XML namespace if missing
  if (!source.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
    source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
  }
  const svgBlob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement("canvas");
    const scale = 2; // For higher resolution
    canvas.width = svgElement.clientWidth * scale;
    canvas.height = svgElement.clientHeight * scale;
    const context = canvas.getContext("2d");
    if (context) {
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
      const pngUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = pngUrl;
      link.download = `${fileName}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    URL.revokeObjectURL(url);
  };
  img.onerror = (e) => {
    console.error("Failed to load SVG image for PNG conversion.", e);
    URL.revokeObjectURL(url);
  };
  img.src = url;
};
/**
 * Generates and downloads a Standard MIDI File (SMF) for a given chord.
 * @param rootNote The root note (0-11) of the chord.
 * @param chordNotes The pitch classes (0-11) of the notes in the chord.
 * @param octave The root octave for the MIDI notes.
 * @param tempo The tempo in BPM.
 * @param fileName The desired name of the output MIDI file.
 */
export const exportToMidi = (
  rootNote: number,
  chordNotes: number[],
  octave: number,
  tempo: number,
  fileName: string
): void => {
  const midiNotes = chordNotes.map(note => {
    const pitch = note + octave * 12;
    // Ensure notes flow upwards from the root
    return pitch < (rootNote + octave * 12) ? pitch + 12 : pitch;
  });
  const ticksPerQuarter = 480;
  const durationTicks = ticksPerQuarter * 4; // One bar (4 beats)
  // Helper to write variable-length quantity
  const writeVarLen = (value: number): number[] => {
    let buffer = value & 0x7F;
    const bytes = [];
    while ((value >>= 7) > 0) {
      buffer <<= 8;
      buffer |= ((value & 0x7F) | 0x80);
    }
    while (true) {
      bytes.push(buffer & 0xFF);
      if (buffer & 0x80) buffer >>= 8;
      else break;
    }
    return bytes.reverse();
  };
  // MThd chunk
  const header = [
    0x4D, 0x54, 0x68, 0x64, // "MThd"
    0x00, 0x00, 0x00, 0x06, // Chunk length
    0x00, 0x00,             // Format 0
    0x00, 0x01,             // Number of tracks
    (ticksPerQuarter >> 8) & 0xFF, ticksPerQuarter & 0xFF,
  ];
  // MTrk chunk
  let trackData: number[] = [];
  // Tempo meta-event
  const microSecondsPerQuarter = Math.round(60000000 / tempo);
  trackData.push(
    0x00, 0xFF, 0x51, 0x03, // Delta-time 0, meta-event, set tempo, length 3
    (microSecondsPerQuarter >> 16) & 0xFF,
    (microSecondsPerQuarter >> 8) & 0xFF,
    microSecondsPerQuarter & 0xFF
  );
  // Note On events
  midiNotes.forEach((note, index) => {
    const deltaTime = index === 0 ? 0 : 0; // All notes start at the same time
    trackData.push(...writeVarLen(deltaTime), 0x90, note, 100); // Channel 1, Note On, velocity 100
  });
  // Note Off events
  // The first note off event has a delta time of the full chord duration.
  // All subsequent note off events should have a delta time of 0, as they happen at the same instant.
  trackData.push(...writeVarLen(durationTicks), 0x80, midiNotes[0], 0); // Channel 1, Note Off, velocity 0
  for (let i = 1; i < midiNotes.length; i++) {
    trackData.push(...writeVarLen(0), 0x80, midiNotes[i], 0); // Delta time 0
  }
  // End of Track meta-event
  trackData.push(0x00, 0xFF, 0x2F, 0x00); // Delta-time 0, meta-event, end of track
  const trackLength = trackData.length;
  const trackHeader = [
    0x4D, 0x54, 0x72, 0x6B, // "MTrk"
    (trackLength >> 24) & 0xFF,
    (trackLength >> 16) & 0xFF,
    (trackLength >> 8) & 0xFF,
    trackLength & 0xFF,
  ];
  const midiFile = new Uint8Array([...header, ...trackHeader, ...trackData]);
  const blob = new Blob([midiFile], { type: "audio/midi" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${fileName}.mid`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};