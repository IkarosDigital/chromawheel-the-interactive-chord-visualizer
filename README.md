# ChromaWheel: The Interactive Chord Visualizer

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/IkarosDigital/chromawheel-the-interactive-chord-visualizer)

ChromaWheel is a sophisticated, visually stunning web application for musicians, producers, and students to explore, visualize, and interact with musical chords and scales. Built on a minimalist design philosophy, it presents complex music theory in an intuitive, beautiful interface. The core of the application is an interactive SVG-based wheel, rendered with D3.js, that can be toggled between a Circle of Fifths and a Chromatic layout. Users can select a root note and chord type, and the wheel instantly animates to highlight the constituent notes, showing their relationships and intervals. The application features a built-in polyphonic synthesizer using the Web Audio API, allowing users to hear chords and notes as they interact. It supports real-time input from both computer keyboards and MIDI devices, providing immediate visual and auditory feedback. Finally, users can export their creations as high-resolution PNG images or standard MIDI files for use in other software.

## Key Features

-   **Interactive Chord Wheel**: Visualize chords on a beautiful, animated SVG wheel.
-   **Dual Layouts**: Seamlessly switch between Circle of Fifths and Chromatic layouts.
-   **Real-time Audio Feedback**: Hear notes and chords with a built-in Web Audio synthesizer.
-   **MIDI & Keyboard Input**: Play notes using a connected MIDI device or your computer keyboard.
-   **Smooth Animations**: Enjoy fluid transitions powered by D3.js and Framer Motion.
-   **Customizable Sound**: Adjust synthesizer parameters like waveform and ADSR envelope.
-   **Export Functionality**: Save your creations as high-resolution PNG images or MIDI files.
-   **Responsive Design**: A flawless experience on desktop, tablet, and mobile devices.
-   **Music Theory Engine**: Accurate chord and scale calculations based on established music theory principles.

## Technology Stack

-   **Frontend**: React, Vite
-   **Visualization**: D3.js
-   **Styling**: Tailwind CSS, Shadcn/UI
-   **State Management**: Zustand
-   **Animation**: Framer Motion
-   **Icons**: Lucide React
-   **Deployment**: Cloudflare Pages & Workers

## Getting Started

Follow these instructions to get a local copy of the project up and running for development and testing purposes.

### Prerequisites

You need to have [Bun](https://bun.sh/) installed on your machine.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/chromawheel.git
    cd chromawheel
    ```

2.  **Install dependencies:**
    ```bash
    bun install
    ```

### Running Locally

To start the development server, run the following command:

```bash
bun dev
```

The application will be available at `http://localhost:3000` (or another port if 3000 is in use).

## Usage

Once the application is running, you can:

-   **Select a Root Note**: Click on any of the 12 segments on the outer wheel to set the root note.
-   **Choose a Chord Type**: Use the control panel to select a chord type (e.g., Major, minor, Dominant 7th).
-   **Visualize and Hear**: The wheel will animate to highlight the notes of the selected chord, and the chord will be played through the synthesizer.
-   **Customize**: Open the control panels to change the layout, adjust audio settings, or configure MIDI input.
-   **Export**: Use the export panel to save the current visualization as a PNG or the current chord as a MIDI file.

## Development

The application is structured to separate concerns, making it easier to maintain and extend.

-   `src/pages/HomePage.tsx`: The main application component that orchestrates the UI.
-   `src/components/ChromaWheel.tsx`: The React component containing all D3.js logic for the wheel visualization.
-   `src/components/ControlPanel.tsx`: The UI for all user-configurable settings.
-   `src/hooks/useChromaWheelStore.ts`: The Zustand store for global state management.
-   `src/lib/music.ts`: Contains all core music theory logic, decoupled from the UI.

All UI components are built using Shadcn/UI, and styling is handled with Tailwind CSS utility classes.

## Deployment

This project is configured for seamless deployment to Cloudflare Pages.

1.  **Build the application:**
    ```bash
    bun run build
    ```

2.  **Deploy to Cloudflare:**
    The `deploy` script in `package.json` handles the deployment process using Wrangler.
    ```bash
    bun run deploy
    ```

Alternatively, you can connect your GitHub repository to Cloudflare Pages for automatic deployments on every push.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/IkarosDigital/chromawheel-the-interactive-chord-visualizer)

## Browser Support

ChromaWheel is designed to work on the latest versions of modern web browsers:

-   Google Chrome
-   Mozilla Firefox
-   Microsoft Edge
-   Apple Safari

The Web MIDI API is only supported in Chromium-based browsers. The application will function correctly without MIDI input in other browsers.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.