import { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';

interface BassBoostProps {
  bassNode: BiquadFilterNode | null;
}

const BassBoost = ({ bassNode }: BassBoostProps) => {
  const [bassBoostGain, setBassBoostGain] = useState(0);
  const [bassBoostFreq, setBassBoostFreq] = useState(100);

  // Apply bass boost settings
  useEffect(() => {
    if (!bassNode) return;

    bassNode.gain.value = bassBoostGain;
    bassNode.frequency.value = bassBoostFreq;
  }, [bassNode, bassBoostGain, bassBoostFreq]);

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Bass Boost Level</h3>
          <span>{bassBoostGain > 0 ? `+${bassBoostGain}` : bassBoostGain} dB</span>
        </div>
        <Slider
          value={[bassBoostGain]}
          min={0}
          max={24}
          step={1}
          onValueChange={(value) => setBassBoostGain(value[0])}
        />
        <p className="text-xs text-zinc-400">Adjust the amount of bass enhancement</p>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Bass Frequency</h3>
          <span>{bassBoostFreq} Hz</span>
        </div>
        <Slider
          value={[bassBoostFreq]}
          min={20}
          max={300}
          step={5}
          onValueChange={(value) => setBassBoostFreq(value[0])}
        />
        <p className="text-xs text-zinc-400">Set the center frequency for bass enhancement</p>
      </div>

      <div className="rounded-lg bg-zinc-800 p-4 mt-6">
        <h3 className="font-medium mb-2">How it works</h3>
        <p className="text-sm text-zinc-400">
          Bass boost uses a low-shelf filter that amplifies frequencies below the cutoff point.
          Higher boost values will result in stronger bass enhancement, while the frequency control
          lets you target specific low-end frequencies.
        </p>
      </div>
    </div>
  );
};

export default BassBoost;
