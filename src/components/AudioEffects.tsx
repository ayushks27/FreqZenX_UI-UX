import { useState, useEffect, useRef } from 'react';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface AudioEffectsProps {
  audioContext: AudioContext | null;
  gainNode: GainNode | null;
}

const AudioEffects = ({ audioContext, gainNode }: AudioEffectsProps) => {
  const [volume, setVolume] = useState(1);
  const [reverbEnabled, setReverbEnabled] = useState(false);
  const [reverbLevel, setReverbLevel] = useState(0.3);
  const [stereoWidthEnabled, setStereoWidthEnabled] = useState(false);
  const [stereoWidth, setStereoWidth] = useState(0.5);

  const reverbNodeRef = useRef<ConvolverNode | null>(null);
  const stereoNodeRef = useRef<StereoPannerNode | null>(null);

  // Set up reverb effect
  useEffect(() => {
    if (!audioContext || !gainNode) return;

    const setupReverb = async () => {
      // Create convolver node for reverb if it doesn't exist
      if (!reverbNodeRef.current) {
        const convolver = audioContext.createConvolver();

        // Generate impulse response for reverb
        const impulseLength = Math.floor(audioContext.sampleRate * 2); // 2 second reverb
        const impulse = audioContext.createBuffer(
          2, // stereo
          impulseLength,
          audioContext.sampleRate
        );

        // Fill buffer with decaying noise to simulate reverb
        for (let channel = 0; channel < 2; channel++) {
          const channelData = impulse.getChannelData(channel);
          for (let i = 0; i < impulseLength; i++) {
            // Decay curve for the reverb
            const decay = Math.exp(-i / (audioContext.sampleRate * 0.5));
            channelData[i] = (Math.random() * 2 - 1) * decay;
          }
        }

        convolver.buffer = impulse;
        reverbNodeRef.current = convolver;
      }

      // Create stereo panner if it doesn't exist
      if (!stereoNodeRef.current) {
        const stereoPanner = audioContext.createStereoPanner();
        stereoNodeRef.current = stereoPanner;
      }
    };

    setupReverb();

    return () => {
      // Cleanup
      if (reverbNodeRef.current) {
        reverbNodeRef.current.disconnect();
      }
      if (stereoNodeRef.current) {
        stereoNodeRef.current.disconnect();
      }
    };
  }, [audioContext, gainNode]);

  // Handle volume change
  useEffect(() => {
    if (gainNode) {
      gainNode.gain.value = volume;
    }
  }, [volume, gainNode]);

  // Handle reverb toggle
  useEffect(() => {
    if (!gainNode || !reverbNodeRef.current || !audioContext) return;

    if (reverbEnabled) {
      // Insert reverb into the chain
      gainNode.disconnect();
      gainNode.connect(reverbNodeRef.current);
      reverbNodeRef.current.connect(audioContext.destination);
    } else {
      // Bypass reverb
      gainNode.disconnect();
      gainNode.connect(audioContext.destination);
      reverbNodeRef.current.disconnect();
    }
  }, [reverbEnabled, audioContext, gainNode]);

  // Handle stereo width effects
  useEffect(() => {
    if (!stereoNodeRef.current || !stereoWidthEnabled) return;

    // Apply stereo width effect
    stereoNodeRef.current.pan.value = stereoWidth * 2 - 1;
  }, [stereoWidth, stereoWidthEnabled]);

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Master Volume</h3>
          <span>{Math.round(volume * 100)}%</span>
        </div>
        <Slider
          value={[volume * 100]}
          min={0}
          max={100}
          step={1}
          onValueChange={(value) => setVolume(value[0] / 100)}
        />
      </div>

      <div className="space-y-6 pt-4 border-t border-zinc-800">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-lg font-medium">Reverb Effect</h3>
            <p className="text-sm text-zinc-400">Add depth and space to your audio</p>
          </div>
          <Switch
            checked={reverbEnabled}
            onCheckedChange={setReverbEnabled}
          />
        </div>

        {reverbEnabled && (
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Reverb Amount</Label>
              <span className="text-sm">{Math.round(reverbLevel * 100)}%</span>
            </div>
            <Slider
              value={[reverbLevel * 100]}
              min={0}
              max={100}
              step={1}
              disabled={!reverbEnabled}
              onValueChange={(value) => setReverbLevel(value[0] / 100)}
            />
          </div>
        )}
      </div>

      <div className="space-y-6 pt-4 border-t border-zinc-800">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-lg font-medium">Stereo Width</h3>
            <p className="text-sm text-zinc-400">Enhance the stereo image of your audio</p>
          </div>
          <Switch
            checked={stereoWidthEnabled}
            onCheckedChange={setStereoWidthEnabled}
          />
        </div>

        {stereoWidthEnabled && (
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Width</Label>
              <span className="text-sm">{Math.round(stereoWidth * 100)}%</span>
            </div>
            <Slider
              value={[stereoWidth * 100]}
              min={0}
              max={100}
              step={1}
              disabled={!stereoWidthEnabled}
              onValueChange={(value) => setStereoWidth(value[0] / 100)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioEffects;
