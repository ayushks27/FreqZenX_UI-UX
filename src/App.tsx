import { useState, useRef, useEffect, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Toaster, toast } from "sonner";
import AudioPlayer from './components/AudioPlayer';
import Equalizer from './components/Equalizer';
import BassBoost from './components/BassBoost';
import AudioEffects from './components/AudioEffects';

// Define WebkitAudioContext type to avoid using 'any'
interface AudioContextWithWebkit extends Window {
  webkitAudioContext: typeof AudioContext;
}

export default function App() {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [audioSource, setAudioSource] = useState<MediaElementAudioSourceNode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioSetup, setIsAudioSetup] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const equalizerNodesRef = useRef<BiquadFilterNode[]>([]);
  const bassBoostRef = useRef<BiquadFilterNode | null>(null);

  // Initialize audio context only once
  useEffect(() => {
    // Create AudioContext when component mounts
    const context = new (window.AudioContext ||
      (window as unknown as AudioContextWithWebkit).webkitAudioContext)();

    setAudioContext(context);

    // Cleanup when component unmounts
    return () => {
      if (context) {
        context.close();
      }
    };
  }, []);

  // Set up audio nodes and connections once the context is ready
  useEffect(() => {
    if (!audioContext || !audioRef.current || isAudioSetup) return;

    try {
      // Create analyzer node
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      analyserRef.current = analyser;

      // Create gain node
      const gainNode = audioContext.createGain();
      gainNodeRef.current = gainNode;

      // Create bass boost node
      const bassBoost = audioContext.createBiquadFilter();
      bassBoost.type = 'lowshelf';
      bassBoost.frequency.value = 100;
      bassBoost.gain.value = 0;
      bassBoostRef.current = bassBoost;

      // Create equalizer bands
      const frequencies = [60, 170, 310, 600, 1000, 3000, 6000, 12000, 16000];
      const equalizerNodes = frequencies.map(freq => {
        const filter = audioContext.createBiquadFilter();
        filter.type = 'peaking';
        filter.frequency.value = freq;
        filter.Q.value = 1;
        filter.gain.value = 0;
        return filter;
      });
      equalizerNodesRef.current = equalizerNodes;

      // Create and connect the audio source
      const source = audioContext.createMediaElementSource(audioRef.current);
      setAudioSource(source);

      // Connect nodes:
      // source -> bass boost -> equalizer nodes -> gain node -> analyser -> destination
      source.connect(bassBoost);

      let currentNode = bassBoost;
      for (const node of equalizerNodes) {
        currentNode.connect(node);
        currentNode = node;
      }

      currentNode.connect(gainNode);
      gainNode.connect(analyser);
      analyser.connect(audioContext.destination);

      // Load sample audio file
      audioRef.current.src = '/sample.mp3';
      audioRef.current.load();
      toast.success('Sample audio loaded');

      // Mark setup as complete
      setIsAudioSetup(true);
    } catch (error) {
      console.error('Error setting up audio nodes:', error);
      toast.error('Failed to initialize audio processor');
    }
  }, [audioContext, isAudioSetup]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (audioRef.current) {
      const url = URL.createObjectURL(file);
      audioRef.current.src = url;
      audioRef.current.load();
      toast.success(`Loaded: ${file.name}`);
    }
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (audioContext?.state === 'suspended') {
      audioContext.resume();
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="container mx-auto p-4 min-h-screen bg-zinc-950 text-zinc-50">
      <header className="py-6">
        <h1 className="text-3xl font-bold text-center">Advanced Audio Filters</h1>
        <p className="text-center text-zinc-400 mt-2">Customize your audio with equalizer, bass boost, and more</p>
      </header>

      <Card className="my-6">
        <CardHeader>
          <CardTitle>Audio Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-center">
              <Button onClick={togglePlayPause} className="w-32">
                {isPlaying ? "Pause" : "Play"}
              </Button>
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                className="bg-zinc-800 rounded p-2"
              />
            </div>

            <AudioPlayer
              audioRef={audioRef}
              analyserRef={analyserRef}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
            />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="equalizer" className="my-6">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="equalizer">Equalizer</TabsTrigger>
          <TabsTrigger value="bass">Bass Boost</TabsTrigger>
          <TabsTrigger value="effects">Effects</TabsTrigger>
        </TabsList>

        <TabsContent value="equalizer">
          <Card>
            <CardHeader>
              <CardTitle>Equalizer</CardTitle>
            </CardHeader>
            <CardContent>
              <Equalizer equalizerNodes={equalizerNodesRef.current} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bass">
          <Card>
            <CardHeader>
              <CardTitle>Bass Boost</CardTitle>
            </CardHeader>
            <CardContent>
              <BassBoost bassNode={bassBoostRef.current} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="effects">
          <Card>
            <CardHeader>
              <CardTitle>Audio Effects</CardTitle>
            </CardHeader>
            <CardContent>
              <AudioEffects
                audioContext={audioContext}
                gainNode={gainNodeRef.current}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Adding a track element for accessibility, even though it's not used for audio processing */}
      <audio ref={audioRef} className="hidden" controls>
        <track kind="captions" src="" label="English" />
      </audio>
      <Toaster position="top-center" />
    </div>
  );
}
