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
cd audio-filters-app

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

## Handling API Keys and Tokens

If you need to extend this application with features that require API keys (such as streaming services, cloud storage, speech-to-text, etc.), follow these security best practices:

### Option 1: Environment Variables (Development Only)

1. Create a `.env` file in the project root (add it to `.gitignore`):

```
VITE_API_KEY=your_api_key_here
VITE_API_SECRET=your_secret_here
```

2. Access these values in your code:

```typescript
// Access environment variables
const apiKey = import.meta.env.VITE_API_KEY;
const apiSecret = import.meta.env.VITE_API_SECRET;
```

**IMPORTANT:** Never commit API keys or tokens to your repository.

### Option 2: Backend Proxy (Recommended for Production)

For production use, create a backend service that acts as a proxy:

1. Create a server endpoint that makes authenticated API calls
2. Store your API keys securely on the server (environment variables, secrets manager)
3. Make requests from your frontend to your backend proxy instead of directly to third-party APIs

Example backend endpoint:

```typescript
// Server-side code
app.get('/api/audio-service', async (req, res) => {
  // API key is stored securely on the server
  const response = await fetch('https://api.example.com/data', {
    headers: {
      'Authorization': `Bearer ${process.env.API_KEY}`
    }
  });

  const data = await response.json();
  res.json(data);
});
```

Frontend code:

```typescript
// Client-side code
const fetchData = async () => {
  // No API keys exposed in frontend code
  const response = await fetch('/api/audio-service');
  const data = await response.json();
  // Process data
};
```

### Option 3: Auth Token Exchange

For services requiring user authentication:

1. Implement a secure authentication flow
2. Exchange user credentials for tokens through your backend
3. Store tokens securely (HTTP-only cookies or securely managed localStorage)
4. Implement token refresh mechanisms

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with React, Vite, and shadcn/ui
- Uses Web Audio API for audio processing
- WaveSurfer.js for waveform visualization
