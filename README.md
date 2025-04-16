# Advanced Audio Filters Application

A web application for applying real-time audio effects to your music or audio files. Process audio directly in your browser with an equalizer, bass boost, reverb, and more.

## Features

- 9-band equalizer with presets (Bass Boost, Vocal Boost, Treble Boost)
- Bass boost effect with customizable frequency and gain
- Reverb and stereo enhancement effects
- Real-time waveform visualization
- Upload and process your own audio files
- Modern, responsive UI

## Live Demo

[View the live demo](#) (when deployed)

## Getting Started

### Prerequisites

- Node.js 16+ or Bun 1.0+
- Modern web browser that supports Web Audio API

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd FreqZenX

# Install dependencies with Bun
bun install

# Start the development server
bun run dev
```

## Usage

1. Click the "Play" button to start the sample audio
2. Upload your own audio using the file input
3. Switch between tabs to adjust different effects:
   - Equalizer: Adjust specific frequency bands
   - Bass Boost: Enhance low frequency content
   - Effects: Add reverb and adjust stereo width

Tech Involved
- React, Node.js, Next.js, Tailwind CSS
- Uses Web Audio API for audio processing
- WaveSurfer.js for waveform visualization
