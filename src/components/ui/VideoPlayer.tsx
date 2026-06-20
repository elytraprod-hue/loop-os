import { useRef, useEffect } from 'react';
import Hls from 'hls.js';

interface VideoPlayerProps {
  src?: string;
  poster?: string;
  className?: string;
  onTimeUpdate?: (time: number) => void;
}

export function VideoPlayer({ src, poster, className, onTimeUpdate }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    const isHls = src.endsWith('.m3u8') || src.includes('.m3u8');
    let hls: Hls | null = null;

    if (isHls && Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
    } else {
      video.src = src;
    }

    return () => { hls?.destroy(); };
  }, [src]);

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        background: '#000',
        borderRadius: 16,
        overflow: 'hidden',
      }}
    >
      <video
        ref={videoRef}
        controls
        poster={poster}
        onTimeUpdate={() => {
          if (onTimeUpdate && videoRef.current) {
            onTimeUpdate(videoRef.current.currentTime);
          }
        }}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          aspectRatio: '16/9',
        }}
      >
        {src && !src.endsWith('.m3u8') && (
          <source src={src} />
        )}
      </video>
    </div>
  );
}
