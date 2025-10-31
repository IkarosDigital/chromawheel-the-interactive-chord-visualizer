export interface MidiDevice {
  id: string;
  name: string;
}
type MidiCallback = (command: number, note: number, velocity: number) => void;

const createMidiMessageHandler = (
  callback: MidiCallback,
  getSelectedDeviceId: () => string | null
) => {
  return (event: WebMidi.MIDIMessageEvent) => {
    const inputId = (event.currentTarget as WebMidi.MIDIInput)?.id;
    const selectedDeviceId = getSelectedDeviceId();
    if (!selectedDeviceId || selectedDeviceId === inputId) {
      const [command, note, velocity] = event.data;
      callback(command, note, velocity);
    }
  };
};

export const isMidiSupported = (): boolean => {
  return 'requestMIDIAccess' in navigator;
};
export const initializeMidi = async (
  callback: MidiCallback,
  deviceId: string | null = null
): Promise<{ devices: MidiDevice[]; success: boolean; cleanup: () => void }> => {
  const noOpCleanup = () => {};
  if (!isMidiSupported()) {
    console.warn('Web MIDI API not supported in this browser.');
    return { devices: [], success: false, cleanup: noOpCleanup };
  }

  try {
    const midiAccess = await navigator.requestMIDIAccess();
    let currentDeviceId = deviceId;

    const handleMidiMessage = createMidiMessageHandler(
      callback,
      () => currentDeviceId
    );

    const addListeners = () => {
      midiAccess.inputs.forEach(entry => {
        entry.addEventListener('midimessage', handleMidiMessage);
      });
    };

    const removeListeners = () => {
      midiAccess.inputs.forEach(entry => {
        entry.removeEventListener('midimessage', handleMidiMessage);
      });
    };
    
    addListeners();

    const onStateChange = () => {
      removeListeners();
      addListeners();
    };

    midiAccess.addEventListener('statechange', onStateChange);

    const devices: MidiDevice[] = [];
    midiAccess.inputs.forEach(input => {
      devices.push({ id: input.id, name: input.name || 'Unknown MIDI Device' });
    });

    const cleanup = () => {
      removeListeners();
      midiAccess.removeEventListener('statechange', onStateChange);
    };

    return { devices, success: true, cleanup };
  } catch (error) {
    console.error('Could not access MIDI devices. Please ensure permissions are granted.', error);
    return { devices: [], success: false, cleanup: noOpCleanup };
  }
};