import { useEffect, useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

interface EqualizerProps {
  equalizerNodes: BiquadFilterNode[];
}

const Equalizer = ({ equalizerNodes }: EqualizerProps) => {
  const frequencies = [60, 170, 310, 600, 1000, 3000, 6000, 12000, 16000];
  const frequencyLabels = ['60Hz', '170Hz', '310Hz', '600Hz', '1kHz', '3kHz', '6kHz', '12kHz', '16kHz'];

  // Initialize gains array with a default value for each band
  const initialGains = Array(frequencies.length).fill(0);
  const [gains, setGains] = useState<number[]>(initialGains);

  // Apply gain values to equalizer nodes
  useEffect(() => {
    // Use for...of instead of forEach
    for (let i = 0; i < equalizerNodes.length && i < gains.length; i++) {
      const node = equalizerNodes[i];
      const gainValue = gains[i];

      // Validate that the value is a finite number before setting
      if (node?.gain && typeof gainValue === 'number' && Number.isFinite(gainValue)) {
        node.gain.value = gainValue;
      }
    }
  }, [gains, equalizerNodes]);

  // Handle slider change for a specific frequency band
  const handleGainChange = (index: number, value: number[]) => {
    if (index >= 0 && index < gains.length && value.length > 0 && Number.isFinite(value[0])) {
      const newGains = [...gains];
      newGains[index] = value[0];
      setGains(newGains);
    }
  };

  // Reset all equalizer bands to 0
  const resetEqualizer = () => {
    setGains(Array(frequencies.length).fill(0));
  };

  // Presets
  const applyPreset = (preset: number[]) => {
    // Ensure we have valid values and the right number of bands
    if (preset.length === frequencies.length && preset.every(Number.isFinite)) {
      setGains([...preset]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between mb-4">
        <Button variant="outline" onClick={resetEqualizer}>Reset</Button>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => applyPreset([4, 3, 2, 0, -1, 0, 1, 3, 4])}
          >
            Bass Boost
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => applyPreset([-2, -1, 0, 1, 2, 3, 2, 1, 0])}
          >
            Vocal Boost
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => applyPreset([2, 1, 0, -1, -2, 0, 1, 2, 3])}
          >
            Treble Boost
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {frequencyLabels.map((label, index) => (
          <div key={`eq-band-${frequencies[index]}`} className="flex flex-col items-center">
            <div className="text-center mb-2">{label}</div>
            <Slider
              orientation="vertical"
              value={[gains[index] || 0]} // Ensure we always have a valid value
              min={-12}
              max={12}
              step={1}
              onValueChange={(value) => handleGainChange(index, value)}
              className="h-40"
            />
            <div className="text-center mt-2">
              {(gains[index] > 0 ? `+${gains[index]}` : gains[index]) || "0"} dB
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Equalizer;
