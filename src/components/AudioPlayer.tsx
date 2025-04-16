import { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { Slider } from '@/components/ui/slider';
import { Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AudioPlayerProps {
  audioRef: React.RefObject<HTMLAudioElement>;
  analyserRef: React.RefObject<AnalyserNode>;
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
}

const AudioPlayer = ({
  audioRef,
  analyserRef,
  isPlaying,
  setIsPlaying,
}: AudioPlayerProps) => {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [volume, setVolume] = useState(100);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');

  useEffect(() => {
    if (!waveformRef.current || !audioRef.current) return;

    if (wavesurferRef.current) {
      wavesurferRef.current.destroy();
    }

    const wavesurfer = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: '#8b5cf6',
      progressColor: '#6d28d9',
      cursorColor: '#a855f7',
      barWidth: 2,
      barGap: 2,
      barRadius: 3,
      cursorWidth: 1,
      height: 80,
      normalize: true,
      fillParent: true,
      media: audioRef.current,
    });

    wavesurferRef.current = wavesurfer;

    wavesurfer.on('ready', () => {
      setDuration(formatTime(wavesurfer.getDuration()));
    });

    wavesurfer.on('timeupdate', (currentTime: number) => {
      setCurrentTime(formatTime(currentTime));
    });

    wavesurfer.on('finish', () => {
      setIsPlaying(false);
    });

    wavesurfer.on('play', () => {
      setIsPlaying(true);
    });

    wavesurfer.on('pause', () => {
      setIsPlaying(false);
    });

    return () => {
      wavesurfer.destroy();
    };
  }, [audioRef, setIsPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume, audioRef]);

  const formatTime = (time: number): string => {
    if (!time) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const togglePlayPause = () => {
    if (wavesurferRef.current) {
      if (wavesurferRef.current.isPlaying()) {
        wavesurferRef.current.pause();
      } else {
        wavesurferRef.current.play();
      }
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <div ref={waveformRef} className="w-full rounded-md overflow-hidden" />

      <div className="flex justify-between text-sm">
        <div>{currentTime}</div>
        <div>{duration}</div>
      </div>

      <div className="flex items-center space-x-4">
        <Button onClick={togglePlayPause} variant="outline">
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </Button>

        <div className="flex items-center space-x-2 w-full">
          <span className="text-sm">Volume:</span>
          <Slider
            value={[volume]}
            min={0}
            max={100}
            step={1}
            onValueChange={(value) => setVolume(value[0])}
            className="w-full max-w-xs"
          />
          <span className="text-sm w-8">{volume}%</span>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
