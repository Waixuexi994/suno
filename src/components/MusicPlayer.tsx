import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Download, SkipBack, SkipForward, AlertCircle } from 'lucide-react';

interface MusicPlayerProps {
  audioUrl: string;
  title: string;
  imageUrl?: string;
  onEnded?: () => void;
  onError?: () => void;
  autoPlay?: boolean;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ 
  audioUrl, 
  title, 
  imageUrl, 
  onEnded,
  onError,
  autoPlay = false 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    console.log('Loading audio from URL:', audioUrl);
    setError(null);
    setIsLoading(true);

    const handleLoadedMetadata = () => {
      console.log('Audio metadata loaded, duration:', audio.duration);
      setDuration(audio.duration);
      setIsLoading(false);
      setError(null);
      if (autoPlay) {
        audio.play().then(() => {
          setIsPlaying(true);
        }).catch((err) => {
          console.error('Auto-play failed:', err);
          setError('自动播放失败，请手动点击播放');
        });
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      if (onEnded) onEnded();
    };

    const handleLoadStart = () => {
      console.log('Audio loading started');
      setIsLoading(true);
    };

    const handleCanPlay = () => {
      console.log('Audio can play');
      setIsLoading(false);
      setError(null);
    };

    const handleError = (e: Event) => {
      console.error('Audio loading error:', e);
      setIsLoading(false);
      setError('音频加载失败，请检查网络连接或音频文件');
      if (onError) onError();
    };

    const handleLoadError = () => {
      console.error('Audio load error');
      setIsLoading(false);
      setError('无法加载音频文件');
      if (onError) onError();
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);
    audio.addEventListener('loadeddata', handleLoadError);

    // 设置CORS处理
    audio.crossOrigin = 'anonymous';

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('loadeddata', handleLoadError);
    };
  }, [audioUrl, autoPlay, onEnded, onError]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        console.log('Attempting to play audio');
        await audio.play();
        setIsPlaying(true);
        setError(null);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      setError('播放失败，请稍后重试');
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newVolume = parseFloat(e.target.value);
    audio.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = volume;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const skipTime = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleDownload = async () => {
    try {
      console.log('Downloading audio from:', audioUrl);
      const response = await fetch(audioUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      // 备用下载方法
      const link = document.createElement('a');
      link.href = audioUrl;
      link.download = `${title}.mp3`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="bg-white dark:bg-dark-800/50 rounded-2xl p-6 backdrop-blur-sm border border-gray-200 dark:border-white/10">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      
      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}
      
      {/* Track Info */}
      <div className="flex items-center space-x-4 mb-6">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-16 h-16 rounded-xl object-cover"
            onError={(e) => {
              console.log('Image failed to load:', imageUrl);
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-16 h-16 rounded-xl bg-gradient-brand flex items-center justify-center">
            <Play className="w-8 h-8 text-white" />
          </div>
        )}
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">{title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">AI生成音乐</p>
          {audioUrl && (
            <p className="text-xs text-gray-400 truncate mt-1" title={audioUrl}>
              {audioUrl}
            </p>
          )}
        </div>
        <button
          onClick={handleDownload}
          className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors duration-200"
          title="下载音频"
        >
          <Download className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-2 bg-gray-200 dark:bg-dark-600 rounded-lg appearance-none cursor-pointer slider"
          disabled={isLoading || error !== null}
        />
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => skipTime(-10)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors duration-200"
            disabled={isLoading || error !== null}
            title="后退10秒"
          >
            <SkipBack className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          
          <button
            onClick={togglePlay}
            disabled={isLoading || error !== null}
            className="w-12 h-12 bg-gradient-brand rounded-full flex items-center justify-center hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-200 disabled:opacity-50"
            title={isPlaying ? "暂停" : "播放"}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : error ? (
              <AlertCircle className="w-6 h-6 text-white" />
            ) : isPlaying ? (
              <Pause className="w-6 h-6 text-white" />
            ) : (
              <Play className="w-6 h-6 text-white ml-0.5" />
            )}
          </button>
          
          <button
            onClick={() => skipTime(10)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors duration-200"
            disabled={isLoading || error !== null}
            title="前进10秒"
          >
            <SkipForward className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleMute}
            className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors duration-200"
            title={isMuted ? "取消静音" : "静音"}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            ) : (
              <Volume2 className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-20 h-1 bg-gray-200 dark:bg-dark-600 rounded-lg appearance-none cursor-pointer slider"
            title="音量控制"
          />
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;