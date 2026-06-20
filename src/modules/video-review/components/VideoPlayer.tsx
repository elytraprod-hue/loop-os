// src/modules/video-review/components/VideoPlayer.tsx
import { useRef, useEffect, useState, useCallback } from 'react';

interface VideoPlayerProps {
  src?: string;
  hlsSrc?: string;
  onTimeUpdate?: (time: number) => void;
  onSeek?: (time: number) => void;
  initialTimestamp?: number;
}

export const VideoPlayer = ({ src, hlsSrc: _hlsSrc, onTimeUpdate, onSeek, initialTimestamp }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (initialTimestamp && videoRef.current) {
      videoRef.current.currentTime = initialTimestamp;
    }
  }, [initialTimestamp]);

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  }, []);

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const time = videoRef.current.currentTime;
    setCurrentTime(time);
    onTimeUpdate?.(time);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
      onSeek?.(time);
    }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative rounded-lg overflow-hidden bg-black">
      <video
        ref={videoRef}
        src={src}
        className="w-full aspect-video"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => {
          if (videoRef.current) setDuration(videoRef.current.duration);
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        controls
      />

      <div className="flex items-center gap-3 px-4 py-2 bg-black/80">
        <button
          onClick={togglePlay}
          className="text-white text-sm hover:text-accent transition-colors"
        >
          {isPlaying ? '⏸' : '▶'}
        </button>

        <span className="text-white text-xs font-mono">{formatTime(currentTime)}</span>

        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={currentTime}
          onChange={handleSeek}
          className="flex-1 h-1 accent-accent cursor-pointer"
        />

        <span className="text-white text-xs font-mono">{formatTime(duration)}</span>
      </div>
    </div>
  );
};
