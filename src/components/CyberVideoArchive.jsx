import React, { useRef, useState, useEffect } from 'react';
import Hls from 'hls.js';

// Глубокая древовидная структура папок и треков
const FILE_TREE = {
  id: "folder-src",
  name: "Файлы",
  type: "folder",
  children: [
        {
      id: "folder-musik",
      name: "Музыка",
      type: "folder",
      children: [
    {
      id: "folder-anti",
      name: "Антиреспект",
      type: "folder",
      children: [
        { id: 1, name: "Антиреспект - Там", type: "file", url: "music/1.mp4" },
        { id: 2, name: "Антиреспект- Осень листьями", type: "file", url: "music/2.mp4" },
        { id: 3, name: "Антиреспект - Летай (альбом Тишина 2019)", type: "file", url: "music/3.mp4" },
        { id: 4, name: "Антиреспект - Одинокие берега", type: "file", url: "music/4.mp4" },
      ]
    },
    {
      id: "folder-delfin",
      name: "Дельфин",
      type: "folder",
      children: [
        { id: 5, name: "Дельфин - Небо", type: "file", url: "music/5.mp4" },
        { id: 6, name: "Дельфин - Снег", type: "file", url: "music/6.mp4" },
      ]
    },
    {
      id: "folder-ray",
      name: "Зарубежная",
      type: "folder",
      children: [
        { id: 7, name: "Ray Charles - Hit The Road Jack (Milkdrop Trap Remix)", type: "file", url: "music/7.mp4" },
        { id: 8, name: "Status Quo - In The Army Now (Video)", type: "file", url: "music/35.mp4" },
        { id: 9, name: "The Rapsody feat. Warren G & Sissel - Prince Igor", type: "file", url: "music/36.mp4" },
        { id: 10, name: "Diddy [feat. Christina Aguilera] - Tell Me (Official Music Video)", type: "file", url: "music/37.mp4" },
        { id: 11, name: "50 Cent - Ayo Technology (Official Music Video) ft. Justin Timberlake", type: "file", url: "music/38.mp4" },
        { id: 12, name: "Timbaland - Give It To Me (Official Music Video) ft. Nelly Furtado, Justin Timberlake", type: "file", url: "music/39.mp4" },
      ]
    },
    {
      id: "mary-gu",
      name: "Mary Gu",
      type: "folder",
      children: [
        { id: 13, name: "Mary Gu - Ty moja slabost", type: "file", url: "music/8.mp4" },
        { id: 14, name: "Mary Gu - Астероид", type: "file", url: "music/9.mp4" },
        { id: 15, name: "Mary Gu - Магнолия", type: "file", url: "music/10.mp4" },
        { id: 16, name: "Mary Gu - Нежность", type: "file", url: "music/11.mp4" },
        { id: 17, name: "Mary Gu - Пьяный романтик", type: "file", url: "music/12.mp4" },
        { id: 18, name: "Mary Gu - Папа", type: "file", url: "music/13.mp4" },
      ]
    },
    {
      id: "max-korh",
      name: "Макс Корж",
      type: "folder",
      children: [
        { id: 19, name: "Макс Корж - Где я", type: "file", url: "music/14.mp4" },
        { id: 20, name: "Макс Корж - Мир моих снов", type: "file", url: "music/15.mp4" },
        { id: 21, name: "Макс Корж - Оля", type: "file", url: "music/16.mp4" },
        { id: 22, name: "Макс Корж - Где твоя любовь?", type: "file", url: "music/17.mp4" },
        { id: 23, name: "Макс Корж - Открой глаза", type: "file", url: "music/18.mp4" },
        { id: 24, name: "Макс Корж - Супер Агент", type: "file", url: "music/19.mp4" },
        { id: 25, name: "Макс Корж - Уролог", type: "file", url: "music/20.mp4" },
        { id: 26, name: "Макс Корж - Чужая женщина", type: "file", url: "music/21.mp4" },
        { id: 27, name: "Макс Korж - Белый туман (Lyric video)", type: "file", url: "music/22.mp4" },
        { id: 28, name: "Макс Корж - Мой друг (official video)", type: "file", url: "music/23.mp4" },
        { id: 29, name: "Макс Корж - Армия", type: "file", url: "music/24.mp4" },
        { id: 30, name: "Макс Корж - Наташа", type: "file", url: "music/25.mp4" },
        { id: 31, name: "Макс Корж - Папаша (Lyric video)", type: "file", url: "music/26.mp4" },
        { id: 32, name: "Макс Корж - Молодым (Lyric video)", type: "file", url: "music/27.mp4" },
      ]
    },
    {
      id: "kirpichi",
      name: "Кирпичи",
      type: "folder",
      children: [
        { id: 33, name: "Кирпичи - Vasin рэп (Kirpichi - Vasin Rap)", type: "file", url: "music/28.mp4" },
        { id: 34, name: "Кирпичи - Джедаи", type: "file", url: "music/29.mp4" },
        { id: 35, name: "Кирпичи - Зацените кайф", type: "file", url: "music/30.mp4" },
        { id: 36, name: "Корпорация амстердамских стрелков", type: "file", url: "music/31.mp4" },
      ]
    },
    {
      id: "The-Prodigy",
      name: "The Prodigy",
      type: "folder",
      children: [
        { id: 37, name: "The Prodigy - No Good (Start The Dance) (DJ BP)", type: "file", url: "music/32.mp4" },
        { id: 38, name: "The Prodigy - No Good (Bad For You Mix Remastered)", type: "file", url: "music/33.mp4" },
        { id: 39, name: "Flightcrank - Amazing (Controlled Change Mix)", type: "file", url: "music/34.mp4" },
        { id: 40, name: "The Prodigy - The Heat The Energy", type: "file", url: "music/40.mp4" },
        { id: 41, name: "The Prodigy - Goa The Heat The Energy Part 2", type: "file", url: "music/41.mp4" },
        { id: 42, name: "The Prodigy - Full Throttle Remastered", type: "file", url: "music/42.mp4" },
        { id: 43, name: "The Prodigy - Weather Experience", type: "file", url: "music/43.mp4" },
        { id: 44, name: "The Prodigy - One Love ('94 Live Edit) restored by All Souvenirs", type: "file", url: "music/44.mp4" },
        { id: 45, name: "The Prodigy - Skylined Remastered", type: "file", url: "music/45.mp4" },
        { id: 46, name: "The Prodigy - 2 Claustrophobic Sting Remastered", type: "file", url: "music/46.mp4" },
        { id: 47, name: "🎬 Bluefire - The Prodigy Master Mix (2005)", type: "file", url: "https://www.youtube.com/embed/cLc5ZvQflXI?si=Au_iL4p-7Vx0WTu0" },
        { id: 48, name: "Bluefire - The Prodigy Mastermix (Narayan/Climbatize)", type: "file", url: "https://www.youtube.com/embed/Q5lM_6YYEaA?si=CslvfLJ500712ofn" },
      ]
    },
      ]
    },
    {
      id: "folder-movies",
      name: "🎬 КИНОТЕАТР АВРОРЫ",
      type: "folder",
      children: [
        {
          id: "cyber-blockbusters",
          name: "🤖 Фильмы, ИИ, Сериалы",
          type: "folder",
          children: [
            { id: 951, name: "🦾 Терминатор(1984)", type: "file", url: "https://www.youtube.com/embed/kz3U8g8vWiE?si=uNoRPQ6HaMDXvK7b" },
            { id: 952, name: "🤖 Терминатор 2: Судный день", type: "file", url: "https://www.youtube.com/embed/YUdMLmUzWT4?si=hCJATaxWWnMWqEBA" },
          ]
        },
        {
          id: "matrix-and-jaegers",
          name: "🕶️ Виртуальность и Егери",
          type: "folder",
          children: [
            { id: 953, name: "🕶️ Охотники На ведьм (2012)", type: "file", url: "https://www.youtube.com/embed/oRnbihRpxcs?si=Njhj5M9D_t79QKEj" },
            { id: 954, name: "⚔️ Последний охотник на ведьм", type: "file", url: "https://www.youtube.com/embed/laazIDvtTVc?si=pYhwdm0krKrdjzBa" },
            { id: 955, name: "⚔️ Время Ведьм 4К 2023", type: "file", url: "https://www.youtube.com/embed/EtlGSLWZi7E?si=CfnIA2UMNWuMK4F9" },
            { id: 956, name: "⚔️ ДРУГОЙ МИР: Начало киносаги", type: "file", url: "https://www.youtube.com/embed/7swJHvaFL5Y?si=F-e5li9IPtK9l4fs" },
            { id: 957, name: "⚔️ ДРУГОЙ МИР 2: ЭВОЛЮЦИЯ", type: "file", url: "https://www.youtube.com/embed/S0-pH3hFuk4?si=zlrYSQBEV0Pzoi8y" }
          ]
        }
      ]
    },
    {
      id: "folder-movies-test",
      name: "Кинотеатр Тест",
      type: "folder",
      children: [
        { id: 901, name: "🍿 Стрим-канал 24/7 (Тест)", type: "file", url: "https://ireplay.tv" },
        { id: 902, name: "🎬 Фильм: Слезы Стали (HLS)", type: "file", url: "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8" }
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
  const hlsRef = useRef(null);
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

  // Автоматический детектор: проверяет, является ли ссылка внешним плеером-виджетом
  const isEmbed = currentTrack?.url && (
    currentTrack.url.includes('embed') || 
    currentTrack.url.includes('iframe') || 
    currentTrack.url.includes('youtube.com') || 
    currentTrack.url.includes('youtu.be') || 
    currentTrack.url.includes('://vk.com')
  );

  // Сохраняем выбранный трек при изменении
  // Синхронизация и принудительное включение звука при смене трека
  useEffect(() => {
    localStorage.setItem('soa_player_track_index', currentTrackIndex);
    
    const video = videoRef.current;
    if (!video) return;

    // 1. Очищаем прошлый стрим перед запуском нового, чтобы не забивать память телефона
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    const applyAudioSettings = () => {
      video.muted = isMuted;
      video.volume = isMuted ? 0 : volume;
    };

    // 2. Проверяем формат ссылки текущего трека
    if (currentTrack.url && currentTrack.url.includes('.m3u8')) {
      if (Hls.isSupported()) {
        // Вариант для Android, Google Chrome и встроенного браузера Telegram
        const hls = new Hls({
          maxMaxBufferLength: 30, // Netflix-стайл: буферизируем только 30 секунд вперед
          enableWorker: true     // Запуск в отдельном потоке процессора для плавной работы PWA
        });
        hlsRef.current = hls;
        hls.loadSource(currentTrack.url);
        hls.attachMedia(video);
        
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          applyAudioSettings();
          if (isPlaying) video.play().catch(() => setIsPlaying(false));
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Вариант для iOS (Нативная поддержка Safari на iPhone)
        video.src = currentTrack.url;
        video.addEventListener('loadedmetadata', () => {
          applyAudioSettings();
          if (isPlaying) video.play().catch(() => setIsPlaying(false));
        });
      }
    } else {
      // 3. СТАРЫЙ КОД: Обычная обработка ваших музыкальных MP4 файлов с GitHub
      video.src = currentTrack.url;
      applyAudioSettings();
      
      video.addEventListener('loadeddata', applyAudioSettings);
      
      if (isPlaying) {
        video.play().catch(() => setIsPlaying(false));
      }
    }

    // Чистим за собой слушатели при смене трека
    return () => {
      if (video) {
        video.removeEventListener('loadeddata', applyAudioSettings);
      }
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [currentTrackIndex, volume, isMuted, isPlaying]);

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
    
    // Если ползунок в нуле, включаем mute, иначе выключаем
    const nextMute = newVolume === 0;
    setIsMuted(nextMute);
    
    localStorage.setItem('soa_player_volume', newVolume);
    localStorage.setItem('soa_player_muted', nextMute);
    
    // 🟢 Жестко и мгновенно передаем громкость в сам тег видео
    if (videoRef.current) {
      videoRef.current.muted = nextMute;
      videoRef.current.volume = newVolume;
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
      // 🟢 Принудительная разблокировка звукового движка браузера перед стартом
      videoRef.current.muted = isMuted;
      videoRef.current.volume = isMuted ? 0 : volume;
      
      videoRef.current.play().catch((err) => {
        console.log("Браузер всё еще блокирует автоплей:", err);
      });
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
            className="flex items-center gap-2 px-2 py-1 text-energy-700 hover:bg-soa-gold/5 rounded text-[13px] cursor-pointer select-none h-7 transition-colors"
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
            : 'text-cyber-blue/80 hover:bg-soa-gold/5 hover:text-white'
        }`}
      >
        <span className="truncate">{node.name}</span>
      </div>
    );
  };

  return (
    <div className="static-box w-full !p-2.5 flex flex-col gap-3">
      {/* Стили для бегущей строки и анимаций */}
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
        🎬 Видео-Плеер v4.0
      </h2>

      {/* ЭКРАН ПЛЕЕРА (ТЕПЕРЬ ПОЛНОСТЬЮ СВОБОДЕН ОТ КНОПОК) */}
      {/* ЭКРАН ПЛЕЕРА: Автоматически переключается между музыкой и кино-виджетом */}
      <div className="relative w-full aspect-video bg-black rounded overflow-hidden group" ref={containerRef}>
       
       {isEmbed ? (
         /* РЕЖИМ КИНОТЕАТРА: Загружаем вечный плеер-виджет без CORS и блокировок */
         <iframe
           src={currentTrack.url}
           className="w-full h-full border-0 z-10"
           allowFullScreen
           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
         />
       ) : (
         /* РЕЖИМ МУЗЫКИ И СТРИМОВ: Ваш старый проверенный тег видео для .mp4 и .m3u8 */
         <video
           ref={videoRef}
           onTimeUpdate={handleTimeUpdate}
           onLoadedMetadata={handleLoadedMetadata}
           onEnded={nextTrack}
           onClick={togglePlay}
           playsInline
           onCanPlay={(e) => {
             e.currentTarget.muted = isMuted;
             e.currentTarget.volume = isMuted ? 0 : volume;
           }}
           className="w-full h-full object-contain cursor-pointer"
         />
       )}
      
       {/* Индикатор паузы по центру экрана: показываем ТОЛЬКО для обычных файлов, 
           так как в iframe есть свои встроенные кнопки управления */}
       {!isEmbed && (
         <div 
           onClick={togglePlay}
           className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
         >
           <div className="p-4 rounded-xl bg-black/70 text-soa-gold border border-soa-gold/30 backdrop-blur-sm shadow-[0_0_15px_rgba(212,175,55,0.2)] flex items-center justify-center relative w-14 h-14">
             <span className="absolute top-1 left-1 w-2 h-2 border-t border-l border-soa-gold/60"></span>
             <span className="absolute top-1 right-1 w-2 h-2 border-t border-r border-soa-gold/60"></span>
             <span className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-soa-gold/60"></span>
             <span className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-soa-gold/60"></span>
             
             {isPlaying ? (
               <svg className="w-5 h-5 fill-soa-gold" viewBox="0 0 24 24"><rect x="4" y="4" width="4" height="16" rx="0.5"/><rect x="16" y="4" width="4" height="16" rx="0.5"/></svg>
             ) : (
               <svg className="w-5 h-5 fill-soa-gold" viewBox="0 0 24 24"><path d="M7 4v16l13-8z"/></svg>
             )}
           </div>
         </div>
       )}
      </div>

      {/* ИНФОРМАЦИОННЫЙ РЯД СРАЗУ ПОД ЭКРАНОМ ВИДЕО */}
      <div className="flex flex-col gap-1.5 px-0.5">
        <div className="flex items-center justify-between w-full gap-3">
          {/* Ваша анимированная бегущая строка названия трека */}
          <div className="w-[70%] overflow-hidden relative h-4 select-none text-left">
            <div className="animate-[soaMarquee_15s_linear_infinite] whitespace-nowrap absolute will-change-transform inline-block text-[11px] font-mono tracking-wide text-soa-gold drop-shadow-[0_0_4px_rgba(212,175,55,0.4)] left-0">
              {currentTrack.name} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {currentTrack.name}
            </div>
          </div>
          {/* Цифровой таймер хронометража */}
          <div className="text-[10px] font-mono text-cyber-blue/80 tracking-wider shrink-0 select-none tabular-nums">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>

        {/* Ваш фирменный градиентный таймлайн (Перенесен под видео) */}
        <div onClick={handleProgressClick} className="w-full h-1 bg-white/10 rounded-full cursor-pointer mt-0.5">
          <div 
            className="h-full shadow-[0_0_8px_rgba(55,212,57,0.6)] transition-all duration-100 rounded-full" 
            style={{ 
              width: `${progress}%`,
              background: `linear-gradient(to right, #ffd11a 0%, #37d439 50%, #00ffff 100%)`
            }}
          />
        </div>
      </div>

      {/* ХАКЕРСКИЙ ФАЙЛОВЫЙ МЕНЕДЖЕР (КОНСОЛЬ) */}
      <div className="mt-2 bg-black/20 border border-white/5 rounded-xl p-2.5 flex flex-col gap-3">
        
        {/* Строка терминала */}
        <div className="text-[10px] text-soa-gold/40 uppercase font-mono tracking-wider">
          root@samcro_terminal:~# tree --fs --neon-style
        </div>

        {/* НОВАЯ ФУТУРИСТИЧНАЯ ПАНЕЛЬ С РЕДКИМИ КНОПКАМИ */}
        <div className="flex items-center justify-between w-full text-cyber-blue bg-black/80 border border-soa-gold/20 rounded-xl p-2.5 px-4 shadow-[inset_0_0_15px_rgba(212,175,55,0.05)] backdrop-blur-md">
          
          {/* 1. Громкость: Иконка в стиле «Динамический Радар» */}
          <div className="flex items-center gap-2 max-w-[105px] w-full group/vol">
            <button onClick={toggleMute} className="hover:text-white transition-colors cursor-pointer opacity-80 hover:opacity-100 shrink-0">
              {isMuted ? (
                /* Перечеркнутый звуковой интерфейс */
                <svg className="w-4 h-4 text-red-500 drop-shadow-[0_0_3px_rgba(239,68,68,0.4)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M5.5 15H3a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h2.5l5.2-4.4a.5.5 0 0 1 .8.4v16a.5.5 0 0 1-.8.4L5.5 15zM23 9l-6 6m0-6l6 6" strokeLinecap="round"/>
                </svg>
              ) : volume < 0.5 ? (
                /* Одноделение уровня сигнала */
                <svg className="w-4 h-4 text-cyber-blue" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M5.5 15H3a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h2.5l5.2-4.4a.5.5 0 0 1 .8.4v16a.5.5 0 0 1-.8.4L5.5 15zM15 15a3 3 0 0 0 0-6" strokeLinecap="round"/>
                </svg>
              ) : (
                /* Полная звуковая волна Sci-Fi */
                <svg className="w-4 h-4 text-cyber-blue drop-shadow-[0_0_4px_rgba(212,175,55,0.3)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M5.5 15H3a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h2.5l5.2-4.4a.5.5 0 0 1 .8.4v16a.5.5 0 0 1-.8.4L5.5 15zM15 16a4 4 0 0 0 0-8m4 10a8 8 0 0 0 0-12" strokeLinecap="round"/>
                </svg>
              )}
            </button>
            <input
  type="range"
  id="player-volume-slider"
  min="0"
  max="1"
  step="0.05"
  value={isMuted ? 0 : volume}
  onChange={handleVolumeChange}
  className="w-full h-1 bg-white/5 rounded-none appearance-none cursor-pointer accent-cyber-blue [color-scheme:dark] group-hover/vol:bg-white/10 transition-colors
    [&::-webkit-slider-thumb]:appearance-none 
    [&::-webkit-slider-thumb]:w-2.5 
    [&::-webkit-slider-thumb]:h-2.5 
    [&::-webkit-slider-thumb]:rotate-45 
    [&::-webkit-slider-thumb]:bg-soa-gold 
    [&::-webkit-slider-thumb]:shadow-[0_0_10px_#ffd11a]
    [&::-webkit-slider-thumb]:active:scale-110"
  style={{
    background: `linear-gradient(to right, #baff1a ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.05) ${(isMuted ? 0 : volume) * 100}%)`
  }}
/>
          </div>

          {/* 2. Основные навигационные кнопки пульта управления */}
          <div className="flex items-center justify-center gap-5">
            {/* Кнопка НАЗАД: Киберпанк двойная стрелка-шеврон */}
            <button onClick={prevTrack} className="text-cyber-blue/60 hover:text-white transition-all p-1 cursor-pointer active:scale-75 hover:drop-shadow-[0_0_6px_#ffd11a]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 19l-7-7 7-7M19 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Главная кнопка ТРИГГЕР (PLAY/PAUSE) с неоновым свечением */}
            <button onClick={togglePlay} className="p-2 bg-soa-gold/10 text-soa-gold hover:bg-soa-gold hover:text-black border border-soa-gold/40 rounded-xl transition-all duration-200 cursor-pointer active:scale-90 shadow-[0_0_15px_rgba(212,175,55,0.15)] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]">
              {isPlaying ? (
                /* Кастомные брутальные параллельные линии паузы */
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="5" y="4" width="4" height="16" rx="1" />
                  <rect x="15" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                /* Полый контурный треугольник запуска */
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 4v16l13-8z" />
                </svg>
              )}
            </button>

            {/* Кнопка СТОП: Квадрат со срезанными кибер-углами */}
            <button onClick={stopVideo} className="text-zinc-600 hover:text-red-500 transition-all p-1 cursor-pointer active:scale-75 hover:drop-shadow-[0_0_6px_rgba(239,68,68,0.5)]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <rect x="5" y="5" width="14" height="14" rx="1" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* Кнопка ВПЕРЕД: Киберпанк двойная стрелка-шеврон */}
            <button onClick={nextTrack} className="text-cyber-blue/60 hover:text-white transition-all p-1 cursor-pointer active:scale-75 hover:drop-shadow-[0_0_6px_#ffd11a]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* 3. Кнопка ФУЛЛСКРИН: Рамка захвата цели (Target Lock) */}
          <button onClick={toggleFullscreen} className="text-cyber-blue/50 hover:text-white transition-all p-1 cursor-pointer active:scale-75 hover:drop-shadow-[0_0_6px_#ffd11a]">
            {isFullscreen ? (
              /* Иконка сворачивания прицела */
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round">
                <path d="M4 10h6V4M20 10h-6V4M4 14h6v6M20 14h-6v6" />
              </svg>
            ) : (
              /* Иконка футуристичного захвата углов экрана */
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round">
                <path d="M5 9V5h4M15 5h4v4M5 15v4h4M15 19h4v-4M12 8v8M8 12h8" />
              </svg>
            )}
          </button>
        </div>

        {/* Список папок (Дерево) */}
        <div 
          className="playlist-box flex flex-col w-full overflow-y-auto pr-1 transition-all duration-300 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-white/5 [&::-webkit-scrollbar-thumb]:bg-soa-gold/40 [&::-webkit-scrollbar-thumb]:rounded-full"
          style={{ maxHeight: isExpanded ? '430px' : '130px' }}
        >
          <RenderTree node={FILE_TREE} />
        </div>

        {/* Кнопка сворачивания архива */}
        <button 
          onClick={() => setIsExpanded(!isExpanded)} 
          className="w-full text-[11px] font-mono border border-soa-gold/30 py-1.5 rounded-md bg-black/40 text-energy-700 hover:bg-soa-gold/10 hover:text-white transition-all uppercase tracking-wider cursor-pointer text-center focus:outline-none active:scale-[0.99]"
        >
          {isExpanded ? "⬇️ СВЕРНУТЬ ХРАНИЛИЩЕ" : "🗖 РАЗВЕРНУТЬ ХРАНИЛИЩЕ АРХИВА"}
        </button>
      </div>

    </div>
  );
}