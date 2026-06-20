import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import Hls from 'hls.js';

interface VideoPlayerProps {
  src?: string;
  poster?: string;
  className?: string;
  onTimeUpdate?: (time: number) => void;
}

export interface VideoPlayerRef {
  seekTo: (time: number) => void;
  play: () => void;
  pause: () => void;
  getCurrentTime: () => number;
}

export const VideoPlayer = forwardRef<VideoPlayerRef, VideoPlayerProps>(
  ({ src, poster, className, onTimeUpdate }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useImperativeHandle(ref, () => ({
      seekTo: (time: number) => {
        if (videoRef.current) {
          videoRef.current.currentTime = time;
        }
      },
      play: () => {
        videoRef.current?.play();
      },
      pause: () => {
        videoRef.current?.pause();
      },
      getCurrentTime: () => {
        return videoRef.current?.currentTime ?? 0;
      },
    }));

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

      return () => {
        hls?.destroy();
      };
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
          {src && !src.endsWith('.m3u8') && <source src={src} />}
        </video>
      </div>
    );
  }
);
