"use client"
import React, { useState, useRef } from 'react';

export default function AudioRecorder({ onRecordingComplete = null }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const timerIntervalRef = useRef(null);

  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      });
      
      streamRef.current = stream;
      chunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        stream.getTracks().forEach(track => track.stop());
        streamRef.current = null;
        
        if (onRecordingComplete) onRecordingComplete(audioBlob);
        
        setRecordingTime(0);
        setIsProcessing(false);
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      timerIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (err) {
      if (err.name === 'NotAllowedError') {
        setError('Microphone access denied. Please allow microphone permissions.');
      } else if (err.name === 'NotFoundError') {
        setError('No microphone found. Please connect a microphone.');
      } else {
        setError(`Error: ${err.message}`);
      }
      console.error('Recording error:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      setIsProcessing(true);
      setIsRecording(false);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      mediaRecorderRef.current.stop();
    }
  };

  const cancelRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      setRecordingTime(0);
      
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      chunksRef.current = [];
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      aria-label="Audio Recorder"
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
      <div
        aria-live="polite"
        aria-atomic="true"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          minHeight: '24px',
        }}
      >
        {isRecording && (
          <>
            <span
              aria-hidden="true"
              style={{
                display: 'inline-block',
                width: '8px',
                height: '8px',
                backgroundColor: '#ef4444',
                borderRadius: '50%',
                animation: 'pulse 1s infinite',
              }}
            />
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
              <span className="sr-only">Currently </span>Recording: {formatTime(recordingTime)}
            </span>
          </>
        )}
        {isProcessing && (
          <span style={{ fontSize: '14px', color: '#6b7280' }}>
            Processing audio...
          </span>
        )}
        {!isRecording && !isProcessing && recordingTime === 0 && (
          <span style={{ fontSize: '14px', color: '#9ca3af' }}>
            Ready to record
          </span>
        )}
      </div>

      {/* Error Message */}
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

      {/* Controls */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          justifyContent: 'center',
        }}
      >
        {!isRecording ? (
          <button
            onClick={startRecording}
            disabled={isProcessing}
            className="a11y-focus-ring"
            aria-label="Start audio recording"
            style={{
              padding: '8px 16px',
              backgroundColor: isProcessing ? '#d1d5db' : '#eff6ff',
              color: isProcessing ? '#6b7280' : '#1e40af',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!isProcessing) e.target.style.backgroundColor = '#dbeafe';
            }}
            onMouseLeave={(e) => {
              if (!isProcessing) e.target.style.backgroundColor = '#eff6ff';
            }}
          >
            Start Recording
          </button>
        ) : (
          <>
            <button
              onClick={stopRecording}
              disabled={isProcessing}
              className="a11y-focus-ring"
              aria-label="Stop and save recording"
              style={{
                padding: '8px 16px',
                backgroundColor: isProcessing ? '#d1d5db' : '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: isProcessing ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => {
                if (!isProcessing) e.target.style.backgroundColor = '#059669';
              }}
              onMouseLeave={(e) => {
                if (!isProcessing) e.target.style.backgroundColor = '#10b981';
              }}
            >
              Save Recording
            </button>
            <button
              onClick={cancelRecording}
              disabled={isProcessing}
              className="a11y-focus-ring"
              aria-label="Cancel recording"
              style={{
                padding: '8px 16px',
                backgroundColor: isProcessing ? '#d1d5db' : '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: isProcessing ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => {
                if (!isProcessing) e.target.style.backgroundColor = '#4b5563';
              }}
              onMouseLeave={(e) => {
                if (!isProcessing) e.target.style.backgroundColor = '#6b7280';
              }}
            >
              Cancel
            </button>
          </>
        )}
      </div>

      <p
        aria-hidden="true"
        style={{
          margin: '0',
          fontSize: '12px',
          color: '#6b7280',
          textAlign: 'center',
        }}
      >
        {isRecording
          ? 'Recording in progress...'
          : 'Click start to begin recording audio'}
      </p>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .a11y-focus-ring:focus-visible {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }
      `}</style>
    </div>
  );
}