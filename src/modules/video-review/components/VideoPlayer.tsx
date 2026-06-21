import { useRef, useEffect, useState, useCallback } from 'react';
import Hls from 'hls.js';

interface VideoPlayerProps {
  src?: string;
  hlsSrc?: string;
  onTimeUpdate?: (time: number) => void;
  onSeek?: (time: number) => void;
  initialTimestamp?: number;
}

export const VideoPlayer = ({ src, hlsSrc, onTimeUpdate, onSeek, initialTimestamp }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Use HLS source if provided, otherwise use direct src
    const videoSrc = hlsSrc || src;
    if (!videoSrc) return;

    if (Hls.isSupported() && hlsSrc) {
      // Initialize HLS.js for HLS streams
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }

      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });
      hlsRef.current = hls;

      hls.loadSource(hlsSrc);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (initialTimestamp) {
          video.currentTime = initialTimestamp;
        }
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              hls.destroy();
              break;
          }
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl') && hlsSrc) {
      // Native HLS support (Safari)
      video.src = hlsSrc;
      if (initialTimestamp) {
        video.currentTime = initialTimestamp;
      }
    } else {
      // Direct video file
      video.src = videoSrc;
      if (initialTimestamp) {
        video.currentTime = initialTimestamp;
      }
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [hlsSrc, src, initialTimestamp]);

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
