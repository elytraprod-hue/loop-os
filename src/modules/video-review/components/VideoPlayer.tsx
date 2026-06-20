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
    <div style={{ position: 'relative', borderRadius: 8, overflow: 'hidden', background: '#000' }}>
      <video
        ref={videoRef}
        src={src}
        style={{ width: '100%', aspectRatio: '16/9' }}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => {
          if (videoRef.current) setDuration(videoRef.current.duration);
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        controls
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 16px', background: 'rgba(0,0,0,0.8)' }}>
        <button
          onClick={togglePlay}
          style={{ color: '#fff', fontSize: 14, border: 'none', background: 'none', cursor: 'pointer' }}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>

        <span style={{ color: '#fff', fontSize: 12, fontFamily: 'monospace' }}>{formatTime(currentTime)}</span>

        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={currentTime}
          onChange={handleSeek}
          style={{ flex: 1, height: 4, accentColor: 'var(--accent)', cursor: 'pointer' }}
        />

        <span style={{ color: '#fff', fontSize: 12, fontFamily: 'monospace' }}>{formatTime(duration)}</span>
      </div>
    </div>
  );
};
