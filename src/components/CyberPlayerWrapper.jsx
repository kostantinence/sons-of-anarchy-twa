import React, { useState, useEffect, useRef } from 'react';

export default function CyberPlayer({ videoUrl, isPlaying, setIsPlaying, isMuted, onProgressUpdate }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [showControls, setShowControls] = useState(true);
  const [progress, setProgress] = useState(0);
  const controlsTimeoutRef = useRef(null);

  // Следим за состоянием Play/Pause из пульта
  useEffect(() => {
    if (isPlaying) videoRef.current?.play().catch(() => {});
    else videoRef.current?.pause();
  }, [isPlaying, videoUrl]);

  // Следим за звуком
  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = isMuted;
  }, [isMuted]);

  // Функция скрытия панели управления при неактивности
  const resetControlsTimeout = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false); // Скрываем только во время игры
    }, 2500);
  };

  // Движение мыши/тача для линзы преломления
  const handleMouseMove = (e) => {
    resetControlsTimeout();
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Передаем координаты в CSS переменные для эффекта стекла
    containerRef.current.style.setProperty('--mouse-x', `${x}px`);
    containerRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    const currentProgress = (video.currentTime / video.duration) * 100;
    setProgress(currentProgress);
    if (onProgressUpdate) {
      onProgressUpdate(video.currentTime, video.duration);
    }
  };

  // Клик по видео ставит на паузу
  const handleVideoClick = () => {
    setIsPlaying(!isPlaying);
    resetControlsTimeout();
  };

  // Перемотка кликом по шкале прогресса
  const handleProgressBarClick = (e) => {
    e.stopPropagation(); // Чтобы не срабатывал клик паузы по видео
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newTime = (clickX / width) * videoRef.current.duration;
    videoRef.current.currentTime = newTime;
    resetControlsTimeout();
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onTouchMove={handleMouseMove}
      onClick={handleVideoClick}
      className="relative w-full h-full bg-black cursor-pointer group select-none"
    >
      {/* Нативное видео: подогнано под рамку на 100% без черных полей */}
      <video
        ref={videoRef}
        src={videoUrl}
        loop
        playsInline
        crossOrigin="anonymous"
        onTimeUpdate={handleTimeUpdate}
        className="w-full h-full object-cover pointer-events-none"
      />

      {/* Высокопроизводительный CSS-слой стеклянной линзы преломления */}
      <div className="lens-overlay" />

      {/* Шкала времени встроенная в само видео с эффектом исчезновения */}
      <div 
        onClick={handleProgressBarClick}
        className={`absolute bottom-4 left-4 right-4 h-3 flex items-center transition-opacity duration-500 bg-black/20 rounded-full px-1 backdrop-blur-[2px] ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden relative">
          {/* Тот самый переливающийся радужный скроллбэк */}
          <div 
            className="absolute top-0 left-0 h-full animate-rainbow rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}