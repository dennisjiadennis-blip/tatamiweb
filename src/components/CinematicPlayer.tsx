'use client'

import React, { useState, useRef, useEffect } from 'react';
import { Icons } from '@/components/ui/icons';
import { Loader2 } from 'lucide-react';

interface Subtitle {
  start: number;
  end: number;
  text: string;
}

interface CinematicPlayerProps {
  src: string;
  subtitles?: Subtitle[];
  className?: string;
  [key: string]: any;
}

const CinematicPlayer: React.FC<CinematicPlayerProps> = ({ src, subtitles = [], className, ...props }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeSubtitle, setActiveSubtitle] = useState('');
  const [showControls, setShowControls] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // 播放/暂停逻辑
  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  // 时间更新处理
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;
      const progressPercentage = (current / total) * 100;
      
      setProgress(progressPercentage);
      setCurrentTime(current);
      
      // 更新字幕
      const currentSubtitle = subtitles.find(sub => 
        current >= sub.start && current < sub.end
      );
      setActiveSubtitle(currentSubtitle ? currentSubtitle.text : '');
    }
  };

  // 时间轴拖动
  const handleProgressChange = (e) => {
    if (videoRef.current) {
      const newTime = (e.target.value / 100) * duration;
      videoRef.current.currentTime = newTime;
      setProgress(e.target.value);
    }
  };

  // 音量控制
  const handleVolumeChange = (e) => {
    const newVolume = e.target.value / 100;
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  // 静音切换
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // 全屏切换
  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await videoRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error('Fullscreen failed:', error);
    }
  };

  // 时间格式化
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // 键盘快捷键支持
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName !== 'INPUT') {
        switch (e.code) {
          case 'Space':
            e.preventDefault();
            togglePlay();
            break;
          case 'KeyM':
            e.preventDefault();
            toggleMute();
            break;
          case 'KeyF':
            e.preventDefault();
            toggleFullscreen();
            break;
          case 'ArrowLeft':
            e.preventDefault();
            if (videoRef.current) {
              videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
            }
            break;
          case 'ArrowRight':
            e.preventDefault();
            if (videoRef.current) {
              videoRef.current.currentTime = Math.min(duration, videoRef.current.currentTime + 10);
            }
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [duration]);

  // 全屏状态监听
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // 视频元数据加载
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  return (
    <div 
      className={`cinematic-player ${className || ''}`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      {...props}
    >
      <video
        ref={videoRef}
        className="player-video"
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onClick={togglePlay}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      
      {/* 字幕动画系统 */}
      <div className="subtitle-container">
        {activeSubtitle && (
          <div className="subtitle-text" key={activeSubtitle}>
            {activeSubtitle}
          </div>
        )}
      </div>

      {/* 完整的交互控制面板 */}
      <div className={`controls-panel ${showControls ? 'visible' : ''}`}>
        <div className="controls-top">
          <div className="timeline-container">
            <input 
              type="range" 
              className="timeline" 
              min="0"
              max="100"
              value={progress} 
              onChange={handleProgressChange}
            />
            <div className="time-display">
              <span>{formatTime(currentTime)}</span>
              <span>/</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>

        <div className="controls-bottom">
          <div className="controls-left">
            <button className="control-btn play-btn" onClick={togglePlay}>
              {isPlaying ? <Icons.pause /> : <Icons.play />}
            </button>
            
            <div className="volume-control">
              <button className="control-btn volume-btn" onClick={toggleMute}>
                {isMuted ? <Icons.volumeX /> : <Icons.volume2 />}
              </button>
              <input 
                type="range" 
                className="volume-slider" 
                min="0"
                max="100"
                value={isMuted ? 0 : volume * 100}
                onChange={handleVolumeChange}
              />
            </div>
          </div>

          <div className="controls-right">
            <button className="control-btn fullscreen-btn" onClick={toggleFullscreen}>
              {isFullscreen ? <Icons.minimize /> : <Icons.maximize />}
            </button>
          </div>
        </div>
      </div>

      {/* 加载指示器 */}
      {!duration && (
        <div className="loading-indicator">
          <Loader2 className="animate-spin w-8 h-8" />
        </div>
      )}
    </div>
  );
};

export default CinematicPlayer;