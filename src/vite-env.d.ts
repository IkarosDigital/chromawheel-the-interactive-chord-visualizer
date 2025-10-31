/// <reference types="vite/client" />
// Add types for Web MIDI API to avoid TypeScript errors
declare namespace WebMidi {
  interface MIDIAccess extends EventTarget {
    inputs: MIDIInputMap;
    outputs: MIDIOutputMap;
    sysexEnabled: boolean;
    onstatechange: ((event: MIDIConnectionEvent) => void) | null;
  }
  interface MIDIPort extends EventTarget {
    id: string;
    manufacturer?: string;
    name?: string;
    type: "input" | "output";
    version?: string;
    state: "disconnected" | "connected";
    connection: "open" | "closed" | "pending";
    onstatechange: ((event: MIDIConnectionEvent) => void) | null;
    open(): Promise<MIDIPort>;
    close(): Promise<MIDIPort>;
  }
  interface MIDIInput extends MIDIPort {
    type: "input";
    onmidimessage: ((event: MIDIMessageEvent) => void) | null;
  }
  interface MIDIOutput extends MIDIPort {
    type: "output";
    send(data: number[] | Uint8Array, timestamp?: number): void;
    clear(): void;
  }
  type MIDIInputMap = ReadonlyMap<string, MIDIInput>;
  type MIDIOutputMap = ReadonlyMap<string, MIDIOutput>;
  interface MIDIMessageEvent extends Event {
    data: Uint8Array;
  }
  interface MIDIConnectionEvent extends Event {
    port: MIDIPort;
  }
}
interface Navigator {
  requestMIDIAccess(options?: WebMidi.MIDIOptions): Promise<WebMidi.MIDIAccess>;
}