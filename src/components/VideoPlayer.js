// src/components/VideoPlayer.js
'use client';

import { useEffect, useRef } from 'react';

export default function VideoPlayer({ sources, initialSource = 0, onEpisodeChange }) {
  const playerRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    const initializePlayer = async () => {
      const Plyr = (await import('plyr')).default;
      await import('plyr/dist/plyr.css');

      if (!videoRef.current || !sources.length) return;

      // Initialize Plyr player
      playerRef.current = new Plyr(videoRef.current, {
        controls: [
          'play-large',
          'play',
          'progress',
          'current-time',
          'mute',
          'volume',
          'captions',
          'settings',
          'pip',
          'airplay',
          'fullscreen'
        ],
        settings: ['quality', 'speed'],
        quality: {
          default: 720,
          options: [4320, 2880, 2160, 1440, 1080, 720, 576, 480, 360, 240]
        },
        speed: {
          selected: 1,
          options: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 4]
        }
      });

      // Set initial source
      if (sources[initialSource]) {
        videoRef.current.src = sources[initialSource].src;
        videoRef.current.load();
      }

      // Handle video end to auto-play next episode
      const handleEnded = () => {
        if (initialSource < sources.length - 1) {
          onEpisodeChange(initialSource + 1);
        }
      };

      videoRef.current.addEventListener('ended', handleEnded);

      // Cleanup
      return () => {
        if (playerRef.current) {
          playerRef.current.destroy();
        }
        videoRef.current?.removeEventListener('ended', handleEnded);
      };
    };

    initializePlayer();
  }, [sources, initialSource, onEpisodeChange]);

  return (
    <video
      ref={videoRef}
      playsInline
      controls
      className="w-full rounded-lg"
    />
  );
}