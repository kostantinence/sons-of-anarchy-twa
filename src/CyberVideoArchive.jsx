import React, { useRef, useState, useEffect } from 'react';

// Глубокая древовидная структура папок и треков
const FILE_TREE = {
  id: "folder-src",
  name: "music",
  type: "folder",
  children: [
    {
      id: "folder-anti",
      name: "Антиреспект",
      type: "folder",
      children: [
        { id: 1, name: "Антиреспект - Там", url: "music/1.mp4" },
        { id: 2, name: "Антиреспект- Осень листьями", url: "music/2.mp4" },
        { id: 3, name: "Антиреспект - Летай (альбом Тишина 2019)", url: "music/3.mp4" },
        { id: 4, name: "Антиреспект - Одинокие берега", url: "music/4.mp4" },
      ]
    },
    {
      id: "folder-delfin",
      name: "Дельфин",
      type: "folder",
      children: [
        { id: 5, name: "Дельфин - Небо", url: "music/5.mp4" },
        { id: 6, name: "Дельфин - Снег", url: "music/6.mp4" },
      ]
    },
    {
      id: "folder-ray",
      name: "Зарубежная",
      type: "folder",
      children: [
        { id: 7, name: "Ray Charles - Hit The Road Jack (Milkdrop Trap Remix)", url: "music/7.mp4" },
        { id: 8, name: "Status Quo - In The Army Now (Video)", url: "music/35.mp4" },
        { id: 9, name: "The Rapsody feat. Warren G & Sissel - Prince Igor", url: "music/36.mp4" },
        { id: 10, name: "Diddy [feat. Christina Aguilera] - Tell Me (Official Music Video)", url: "music/37.mp4" },
        { id: 11, name: "50 Cent - Ayo Technology (Official Music Video) ft. Justin Timberlake", url: "music/38.mp4" },
        { id: 12, name: "Timbaland - Give It To Me (Official Music Video) ft. Nelly Furtado, Justin Timberlake", url: "music/39.mp4" },
      ]
    },
    {
      id: "mary-gu",
      name: "Mary Gu",
      type: "folder",
      children: [
        { id: 13, name: "Mary Gu - Ty moja slabost", url: "music/8.mp4" },
        { id: 14, name: "Mary Gu - Астероид", url: "music/9.mp4" },
        { id: 15, name: "Mary Gu - Магнолия", url: "music/10.mp4" },
        { id: 16, name: "Mary Gu - Нежность", url: "music/11.mp4" },
        { id: 17, name: "Mary Gu - Пьяный романтик", url: "music/12.mp4" },
        { id: 18, name: "Mary Gu - Папа", url: "music/13.mp4" },
      ]
    },
    {
      id: "max-korh",
      name: "Макс Корж",
      type: "folder",
      children: [
        { id: 19, name: "Макс Корж - Где я", url: "music/14.mp4" },
        { id: 20, name: "Макс Корж - Мир моих снов", url: "music/15.mp4" },
        { id: 21, name: "Макс Корж - Оля", url: "music/16.mp4" },
        { id: 22, name: "Макс Корж - Где твоя любовь?", url: "music/17.mp4" },
        { id: 23, name: "Макс Корж - Открой глаза", url: "music/18.mp4" },
        { id: 24, name: "Макс Корж - Супер Агент", url: "music/19.mp4" },
        { id: 25, name: "Макс Корж - Уролог", url: "music/20.mp4" },
        { id: 26, name: "Макс Корж - Чужая женщина", url: "music/21.mp4" },
        { id: 27, name: "Макс Korж - Белый туман (Lyric video)", url: "music/22.mp4" },
        { id: 28, name: "Макс Корж - Мой друг (official video)", url: "music/23.mp4" },
        { id: 29, name: "Макс Корж - Армия", url: "music/24.mp4" },
        { id: 30, name: "Макс Корж - Наташа", url: "music/25.mp4" },
        { id: 31, name: "Макс Корж - Папаша (Lyric video)", url: "music/26.mp4" },
        { id: 32, name: "Макс Корж - Молодым (Lyric video)", url: "music/27.mp4" },
      ]
    },
    {
      id: "kirpichi",
      name: "Кирпичи",
      type: "folder",
      children: [
        { id: 33, name: "Кирпичи - Vasin рэп (Kirpichi - Vasin Rap)", url: "music/28.mp4" },
        { id: 34, name: "Кирпичи - Джедаи", url: "music/29.mp4" },
        { id: 35, name: "Кирпичи - Зацените кайф", url: "music/30.mp4" },
        { id: 36, name: "Корпорация амстердамских стрелков", url: "music/31.mp4" },
      ]
    },
    {
      id: "The-Prodigy",
      name: "The Prodigy",
      type: "folder",
      children: [
        { id: 37, name: "The Prodigy - No Good (Start The Dance) (DJ BP)", url: "music/32.mp4" },
        { id: 38, name: "The Prodigy - No Good (Bad For You Mix Remastered)", url: "music/33.mp4" },
        { id: 39, name: "Flightcrank - Amazing (Controlled Change Mix)", url: "music/34.mp4" },
        { id: 40, name: "The Prodigy - The Heat The Energy", url: "music/40.mp4" },
        { id: 41, name: "The Prodigy - Goa The Heat The Energy Part 2", url: "music/41.mp4" },
        { id: 42, name: "The Prodigy - Full Throttle Remastered", url: "music/42.mp4" },
        { id: 43, name: "The Prodigy - Weather Experience", url: "music/43.mp4" },
        { id: 44, name: "The Prodigy - One Love ('94 Live Edit) restored by All Souvenirs", url: "music/44.mp4" },
        { id: 45, name: "The Prodigy - Skylined Remastered", url: "music/45.mp4" },
        { id: 46, name: "The Prodigy - 2 Claustrophobic Sting Remastered", url: "music/46.mp4" },
      ]
    }
  ]
};

const flattenPlaylist = (node) => {
  let files = [];
  if (node.type === "folder") {
    node.children.forEach(child => {
      files = [...files, ...flattenPlaylist(child)];
    });
  } else {
    files.push(node);
  }
  return files;
};

const FLAT_PLAYLIST = flattenPlaylist(FILE_TREE);

// Вспомогательная функция для красивого форматирования времени (02:15)
const formatTime = (seconds) => {
  if (isNaN(seconds)) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
};
export default function CyberVideoArchive() {
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  // Инициализация состояний из памяти localStorage (сохранение трека и громкости)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(() => {
    const saved = localStorage.getItem('soa_player_track_index');
    return saved !== null ? parseInt(saved, 10) : 0;
  });
  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem('soa_player_volume');
    return saved !== null ? parseFloat(saved) : 1;
  });
  const [isMuted, setIsMuted] = useState(() => {
    const saved = localStorage.getItem('soa_player_muted');
    return saved === 'true';
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const [openFolders, setOpenFolders] = useState({
    "folder-src": true,
    "folder-anti": false,
    "folder-delfin": false,
    "folder-ray": false,
    "mary-gu": false,
    "max-korh": false,
    "kirpichi": false,
    "The-Prodigy": false,
  });

  const currentTrack = FLAT_PLAYLIST[currentTrackIndex];

  // Сохраняем выбранный трек при изменении
  useEffect(() => {
    localStorage.setItem('soa_player_track_index', currentTrackIndex);
    if (videoRef.current) {
      videoRef.current.volume = isMuted ? 0 : volume;
      videoRef.current.muted = isMuted;
    }
    if (isPlaying && videoRef.current) {
      videoRef.current.play().catch(() => setIsPlaying(false));
    }
  }, [currentTrackIndex]);

  // Синхронизация громкости при загрузке
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = isMuted ? 0 : volume;
      videoRef.current.muted = isMuted;
    }
  }, []);

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    localStorage.setItem('soa_player_volume', newVolume);
    localStorage.setItem('soa_player_muted', newVolume === 0);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      videoRef.current.muted = newVolume === 0;
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const nextMute = !isMuted;
      setIsMuted(nextMute);
      videoRef.current.muted = nextMute;
      localStorage.setItem('soa_player_muted', nextMute);
      
      if (nextMute) {
        videoRef.current.volume = 0;
      } else {
        const fallbackVolume = volume > 0 ? volume : 0.5;
        setVolume(fallbackVolume);
        videoRef.current.volume = fallbackVolume;
        localStorage.setItem('soa_player_volume', fallbackVolume);
      }
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.volume = isMuted ? 0 : volume;
      videoRef.current.muted = isMuted;
      videoRef.current.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  const stopVideo = () => {
    if (!videoRef.current) return;
    videoRef.current.pause();
    videoRef.current.currentTime = 0;
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
  };

  const nextTrack = () => setCurrentTrackIndex(p => (p + 1) % FLAT_PLAYLIST.length);
  const prevTrack = () => setCurrentTrackIndex(p => (p - 1 + FLAT_PLAYLIST.length) % FLAT_PLAYLIST.length);

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const dur = videoRef.current.duration;
    setCurrentTime(current);
    if (dur) {
      setDuration(dur);
      setProgress((current / dur) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) setDuration(videoRef.current.duration);
  };

  const handleProgressClick = (e) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const newTime = ((e.clientX - rect.left) / rect.width) * videoRef.current.duration;
    videoRef.current.currentTime = newTime;
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      if (containerRef.current.requestFullscreen) containerRef.current.requestFullscreen().catch(() => {});
      else if (containerRef.current.webkitRequestFullscreen) containerRef.current.webkitRequestFullscreen();
    } else {
      if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    }
  };

  const handleToggleFolder = (folderId, e) => {
    e.stopPropagation();
    setOpenFolders(prev => ({ ...prev, [folderId]: !prev[folderId] }));
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!(document.fullscreenElement || document.webkitFullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  const RenderTree = ({ node }) => {
    if (node.type === "folder") {
      const isOpen = !!openFolders[node.id];
      return (
        <div className="flex flex-col w-full">
          <div 
            onClick={(e) => handleToggleFolder(node.id, e)} 
            className="flex items-center gap-2 px-2 py-1 text-soa-yellow hover:bg-soa-gold/5 rounded text-[13px] cursor-pointer select-none h-7 transition-colors"
          >
            {isOpen ? (
              <svg className="w-4 h-4 text-soa-gold shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                <path d="M3 10h18" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-soa-gold shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            )}
            <span className="font-semibold">{node.name}</span>
          </div>

          {isOpen && node.children && (
            <div className="pl-4 border-l border-soa-gold/10 flex flex-col gap-0.5 mt-0.5">
              {node.children.map((child) => (
                <RenderTree key={child.id} node={child} />
              ))}
            </div>
          )}
        </div>
      );
    }

    const isCurrent = node.id === currentTrack.id;
    const flatIndex = FLAT_PLAYLIST.findIndex(t => t.id === node.id);
    return (
      <div
        onClick={() => setCurrentTrackIndex(flatIndex)} 
        className={`flex items-center gap-2 px-2 py-1 text-[13px] rounded cursor-pointer transition-all h-7 select-none ${
          isCurrent 
            ? 'text-soa-success bg-soa-success/15 font-bold border-l-2 border-soa-success shadow-[0_0_10px_rgba(55,212,57,0.2)]' 
            : 'text-soa-yellow/80 hover:bg-soa-gold/5 hover:text-white'
        }`}
      >
        <span className="truncate">{node.name}</span>
      </div>
    );
  };

  return (
    <div className="static-box w-full !p-2.5 flex flex-col gap-3">
      {/* Стили для бегущей строки */}
      <style>{`
        @keyframes soaMarquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        .soa-marquee-container { overflow: hidden; white-space: nowrap; width: 100%; display: flex; }
        .soa-marquee-inner { display: inline-block; animation: soaMarquee 15s linear infinite; padding-right: 50px; }
        .soa-marquee-inner:hover { animation-play-state: paused; }
      `}</style>

      <h2 className="text-base text-soa-gold border-b border-soa-gold/20 pb-1 font-serif uppercase tracking-wider">
        🎬 ВИДЕОПРОТОКОЛ v3.0
      </h2>

      {/* ЭКРАН ПЛЕЕРА */}
      <div className="relative w-full aspect-video bg-black rounded overflow-hidden group" ref={containerRef}>
        <video
          ref={videoRef}
          src={currentTrack.url}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={nextTrack}
          onClick={togglePlay}
          playsInline
          className="w-full h-full object-contain cursor-pointer"
        />

        {/* ПАНЕЛЬ УПРАВЛЕНИЯ ВНУТРИ ПЛЕЕРА */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/95 via-black/70 to-transparent flex flex-col gap-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          
          {/* Градиентный таймлайн (Плавная смена цвета от золотого к зеленому) */}
          <div onClick={handleProgressClick} className="w-full h-1 bg-white/20 rounded-full cursor-pointer">
            <div 
              className="h-full shadow-[0_0_8px_rgba(55,212,57,0.6)] transition-all duration-100 rounded-full" 
              style={{ 
                width: `${progress}%`,
                background: `linear-gradient(to right, #ffd11a 0%, #37d439 100%)`
              }}
            />
          </div>
                    {/* ЕДИНЫЙ РЯД УПРАВЛЕНИЯ */}
          <div className="flex items-center justify-between w-full text-soa-yellow px-1">
            
            {/* 1. Громкость */}
            <div className="flex items-center gap-2 max-w-[110px] w-full">
              <button onClick={toggleMute} className="hover:text-white transition-colors cursor-pointer opacity-70 hover:opacity-100">
                {isMuted ? (
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.21.05-.42.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>
                ) : volume < 0.5 ? (
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/></svg>
                ) : (
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-soa-yellow [color-scheme:dark]"
                style={{
                  background: `linear-gradient(to right, #ffd11a ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.1) ${(isMuted ? 0 : volume) * 100}%)`
                }}
              />
            </div>

            {/* 2. Кнопки навигации */}
            <div className="flex items-center justify-center gap-4">
              <button onClick={prevTrack} className="hover:text-white transition-colors p-1 cursor-pointer">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
              </button>
              <button onClick={togglePlay} className="hover:text-white transition-colors p-1 cursor-pointer">
                {isPlaying ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                ) : (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                )}
              </button>
              <button onClick={stopVideo} className="hover:text-white transition-colors p-1 cursor-pointer">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h12v12H6z"/></svg>
              </button>
              <button onClick={nextTrack} className="hover:text-white transition-colors p-1 cursor-pointer">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6zm9-12v12h2V6z"/></svg>
              </button>
            </div>

            {/* 3. Фуллскрин */}
            <button onClick={toggleFullscreen} className="hover:text-white transition-colors p-1 opacity-70 hover:opacity-100 cursor-pointer">
              {isFullscreen ? (
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M5 16h3v3h2v-5H5zm3-8H5v2h5V5H8zm6 11h2v-3h3v-2h-5zm2-11V5h-2v5h5V8z"/></svg>
              ) : (
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7zm-2-4h2V7h3V5H5zm12 7h-3v2h5v-5h-2zM14 5v2h3v3h2V5z"/></svg>
              )}
            </button>
          </div>

          {/* РЯД 2: Плавающее название слева и Цифровой таймер справа */}
          <div className="flex items-center justify-between w-full max-w-xl mx-auto px-1 border-t border-white/5 pt-1.5 gap-3">
            {/* Анимированное плавающее название (смещено влево за счет text-left) */}
            <div className="w-[75%] overflow-hidden relative h-4 select-none text-left">
              <div className="animate-[marquee_15s_linear_infinite] whitespace-nowrap absolute will-change-transform inline-block text-[11px] font-mono tracking-wide text-soa-gold drop-shadow-[0_0_4px_rgba(212,175,55,0.4)] left-0">
                {currentTrack.name} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {currentTrack.name}
              </div>
            </div>
            {/* Цифровой таймер (Остается строго справа) */}
            <div className="text-[10px] font-mono text-soa-yellow/80 tracking-wider shrink-0 select-none">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

        </div>
      </div>

      {/* ФАЙЛОВЫЙ МЕНЕДЖЕР */}
      <div className="text-[10px] text-soa-gold/40 uppercase font-mono tracking-wider">
        root@samcro_terminal:~# tree --fs --neon-style
      </div>
      
      <div 
        className="playlist-box flex flex-col w-full overflow-y-auto pr-1 transition-all duration-300 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-white/5 [&::-webkit-scrollbar-thumb]:bg-soa-gold/40 [&::-webkit-scrollbar-thumb]:rounded-full"
        style={{ maxHeight: isExpanded ? '450px' : '150px' }}
      >
        <RenderTree node={FILE_TREE} />
      </div>

      <button 
        onClick={() => setIsExpanded(!isExpanded)} 
        className="w-full text-[11px] font-mono border border-soa-gold/30 py-1.5 rounded-md bg-black/40 text-soa-yellow hover:bg-soa-gold/10 hover:text-white transition-all uppercase tracking-wider cursor-pointer text-center focus:outline-none active:scale-[0.99]"
      >
        {isExpanded ? "⬇️ СВЕРНУТЬ ХРАНИЛИЩЕ" : "🗖 РАЗВЕРНУТЬ ХРАНИЛИЩЕ АРХИВА"}
      </button>
    </div>
  );
}