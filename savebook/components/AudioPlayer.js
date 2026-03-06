"use client"
import React, { useState, useRef, useEffect } from 'react';

export default function AudioPlayer({ audioUrl = null, title = "Audio" }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const audioRef = useRef(null);
  const progressBarRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    const handleError = () => {
      setError('Failed to load audio');
      setIsLoading(false);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, []);

  useEffect(() => {
    if (audioUrl && audioRef.current) {
      setIsLoading(true);
      setError(null);
      setCurrentTime(0);
      setDuration(0);
      setIsPlaying(false);
      audioRef.current.src = audioUrl;
    }
  }, [audioUrl]);

  const togglePlayPause = () => {
    if (!audioUrl || !audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(err => {
        setError('Failed to play audio');
        console.error('Play error:', err);
      });
      setIsPlaying(true);
    }
  };

  const handleProgressChange = (e) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (seconds) => {
    if (!isFinite(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!audioUrl) {
    return (
      <div
        style={{
          padding: '16px',
          backgroundColor: '#f3f4f6',
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
          textAlign: 'center',
        }}
      >
        <p style={{ margin: '0', fontSize: '14px', color: '#6b7280' }}>
          No audio URL provided
        </p>
      </div>
    );
  }

  return (
    <div
      role="region"
      aria-label={`Audio Player: ${title}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        padding: '16px',
        backgroundColor: '#f9fafb',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
      }}
    >
      <audio ref={audioRef} crossOrigin="anonymous" />

      <h3
        style={{
          margin: '0',
          fontSize: '14px',
          fontWeight: '600',
          color: '#1f2937',
          wordBreak: 'break-word',
        }}
      >
        {title}
      </h3>

      {error && (
        <div
          role="alert"
          style={{
            padding: '8px 12px',
            backgroundColor: '#fee2e2',
            color: '#991b1b',
            borderRadius: '6px',
            fontSize: '14px',
            border: '1px solid #fecaca',
          }}
        >
          {error}
        </div>
      )}

      {isLoading && (
        <div
          aria-live="polite"
          style={{
            padding: '8px 12px',
            backgroundColor: '#dbeafe',
            color: '#1e40af',
            borderRadius: '6px',
            fontSize: '14px',
            border: '1px solid #93c5fd',
          }}
        >
          Loading audio...
        </div>
      )}

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <button
          onClick={togglePlayPause}
          disabled={!audioUrl || isLoading || error}
          className="a11y-focus-ring"
          aria-label={isPlaying ? `Pause ${title}` : `Play ${title}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            padding: '0',
            backgroundColor: !audioUrl || isLoading || error ? '#d1d5db' : '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: !audioUrl || isLoading || error ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s',
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            if (!(!audioUrl || isLoading || error)) {
              e.target.style.backgroundColor = '#2563eb';
            }
          }}
          onMouseLeave={(e) => {
            if (!(!audioUrl || isLoading || error)) {
              e.target.style.backgroundColor = '#3b82f6';
            }
          }}
        >
          <span aria-hidden="true">{isPlaying ? '⏸' : '▶'}</span>
        </button>

        {/* Time Display */}
        <div
          aria-live="off"
          style={{
            display: 'flex',
            gap: '8px',
            fontSize: '13px',
            color: '#4b5563',
            fontWeight: '500',
            minWidth: '80px',
          }}
        >
          <span aria-label={`Current time: ${formatTime(currentTime)}`}>{formatTime(currentTime)}</span>
          <span aria-hidden="true">/</span>
          <span aria-label={`Total duration: ${formatTime(duration)}`}>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <input
          ref={progressBarRef}
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleProgressChange}
          className="a11y-focus-ring"
          aria-label="Seek audio position"
          aria-valuemin="0"
          aria-valuemax={Math.round(duration || 0)}
          aria-valuenow={Math.round(currentTime)}
          aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
          style={{
            flex: 1,
            height: '6px',
            borderRadius: '3px',
            border: 'none',
            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${progressPercent}%, #e5e7eb ${progressPercent}%, #e5e7eb 100%)`,
            cursor: duration > 0 ? 'pointer' : 'not-allowed',
            WebkitAppearance: 'none',
            appearance: 'none',
            outline: 'none',
          }}
        />
      </div>

      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          -webkit-appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 0 4px rgba(59, 130, 246, 0.5);
          transition: all 0.2s;
        }

        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 0 8px rgba(59, 130, 246, 0.8);
        }

        input[type="range"]::-moz-range-thumb {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 0 4px rgba(59, 130, 246, 0.5);
          transition: all 0.2s;
        }

        input[type="range"]::-moz-range-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 0 8px rgba(59, 130, 246, 0.8);
        }

        input[type="range"]::-moz-range-track {
          background: transparent;
          border: none;
        }

        input[type="range"]::-moz-range-progress {
          background: #3b82f6;
          border-radius: 3px;
        }
        
        .a11y-focus-ring:focus-visible {
          outline: 2px solid #2563eb;
          outline-offset: 3px;
        }
      `}</style>
    </div>
  );
}