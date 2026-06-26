import { useState, useEffect, useRef } from 'react'
import WebApp from '@twa-dev/sdk'
import Swal from 'sweetalert2'
import { io } from 'socket.io-client'
import { Howl } from 'howler'
import './App.css'
import './index.css'
import ReactPlayer from 'react-player'
import CyberVideoArchive from './components/CyberVideoArchive';
import TerminalWidget from './TerminalWidget';
import UnionChat from './components/UnionChat';
import PromoCodes from './components/PromoCodes';
import AllianceHQ from './components/AllianceHQ';
import TempleTabs from './components/TempleTabs';
import MainHeader from './components/MainHeader';

const socket = io("https://soa-backend.onrender.com");

function App() {
  // =========================================================================
  // 1. ВСЕ СОСТОЯНИЯ (STATES) И РЕФЫ — СТРОГО В НАЧАЛЕ КОМПОНЕНТА
  // =========================================================================
  const [bgStyle, setBgStyle] = useState({ backgroundImage: "url('/night-bg.webp')", opacity: "0.4" });
  const [activeEventIndex, setActiveEventIndex] = useState(0);
  const [activeTabId, setActiveTabId] = useState('machine'); 
  const [showPlaylist, setShowPlaylist] = useState(false);

  // Состояния для хакерского чата
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState(''); 
  const [chatInput, setChatInput] = useState(''); 

  // Состояния для секретных протоколов админа
  const [adminClicks, setAdminClicks] = useState(0);
  const [activeEffects, setActiveEffects] = useState({ alarm: false, matrix: false, showAdmin: false });

  // Медиа-архив
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const playerRef = useRef(null);

  const playlist = [
    { title: "1. Антиреспект - Там где мили", url: "music/1.mp3" },
    { title: "2. Дельфин - Весна", url: "music/2.mp3" }
  ];

  const [promoCodes] = useState({
    code1: new URLSearchParams(window.location.search).get('c1'),
    code2: new URLSearchParams(window.location.search).get('c2'),
  });

  // Глобальный фикс: стейты для визуализации падения снега, глитчей и тоста копирования
  const [logoClass, setLogoClass] = useState('rainbow-text');
  const [logoText, setLogoText] = useState("SONS OF ANARCHY");
  const [isGridVisible, setIsGridVisible] = useState(false);
  const [isCrtVisible, setIsCrtVisible] = useState(false);
  const [snowflakes, setSnowflakes] = useState([]);
  const [dataNodes, setDataNodes] = useState([]);
  const [vhsLines, setVhsLines] = useState([]);
  const [showToast, setShowToast] = useState(false); // Тот самый стейт тоста

  // Ссылки и рефы таймеров
  const howlerRef = useRef(null);
  const clickTimerRef = useRef(null);
  const chatEndRef = useRef(null);
  const snowIntervalRef = useRef(null);
  const hackIntervalRef = useRef(null);
  const snowIdRef = useRef(0);
  const nodeIdRef = useRef(0);
  const lineIdRef = useRef(0);

  // Массив всех 15 цикличных событий
  const events = [
    "1. Перековка Талантов",
    "2. Фантомная Богиня (Трата предмета прокачки девушек)",
    "3. Экспедиция Хаоса (опыт хаоса и итемы на прокачку навыков хаоса)",
    "4. ⚠️ Боевой Колосс (итемы развития машин) ждем второй день ✔️ Второй день тоже на (итемы боевых машин)",
    "5. Улучшение Облика (итемы развития скинов замка, похода, области, лорда)",
    "6. Кузница Сокровищ (все для развития сокровищ)",
    "7. Резонанс Рун (любые руны)",
    "8. Святилище Пяти Духов [сила союза](камни развития фракций)",
    "9. Прокачка славы , скин лорда и поля",
    "10. ♻️ Исследования (философские камни и репутация лорда) ♻️ (сброс книги магии)",
    "11. Откровение Элайджи (резонитовые кристалы, камни очистки эллари, священные камни для развития солдат в эллари)",
    "12. Пробуждение героической души (пыль, слитки кристаллов - развитие героев)",
    "13. Экспедиция Союза (получить вклад союза)",
    "14. ⚠️Усиление Зверей (итемы развития зверей) ✔️ Второй день тоже на итемы развития зверей",
    "15. Модификация Снаряжения (трата камней и итемов для прокачки и ковки снаряжения лорда)"
  ];

  // =========================================================================
  // 2. СЕТЕВЫЕ СЛУШАТЕЛИ И ИНИЦИАЛИЗАЦИЯ СИСТЕМЫ
  // =========================================================================
  
  // Эффект А: Инициализация сокетов и Telegram SDK (1 раз при старте)
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      try {
        window.Telegram.WebApp.expand();
        window.Telegram.WebApp.ready();
      } catch (e) {
        console.log("Telegram SDK Error:", e);
      }
    }

    socket.on('chat_msg', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    socket.on('visual_command', (data) => {
      const WebApp = window.Telegram?.WebApp;
      if (data.type === 'alarm') {
        setActiveEffects(prev => ({ ...prev, alarm: true }));
        if (WebApp?.HapticFeedback) WebApp.HapticFeedback.notificationOccurred('warning');
        setTimeout(() => setActiveEffects(prev => ({ ...prev, alarm: false })), 6000);
      }
      if (data.type === 'matrix') {
        setActiveEffects(prev => ({ ...prev, matrix: true }));
        setTimeout(() => setActiveEffects(prev => ({ ...prev, matrix: false })), 10000);
      }
      if (data.type === 'reload') window.location.reload();
    });

    // Логика вычисления времени суток и циклов ивентов
    function updateBackground() {
      const hour = new Date().getHours();
      if (hour >= 8 && hour < 20) {
        setBgStyle({ backgroundImage: "url('/day-bg.webp')", opacity: "0.6" });
      } else {
        setBgStyle({ backgroundImage: "url('/night-bg.webp')", opacity: "0.4" });
      }
    }

    function updateEventHighlight() {
      const startDate = new Date(2026, 5, 15);
      const now = new Date();
      const diffDays = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
      if (diffDays < 0) return;
      setActiveEventIndex(Math.floor(diffDays / 2) % 15);
    }

    updateBackground();
    updateEventHighlight();
    const bgInterval = setInterval(updateBackground, 900000);

    return () => {
      clearInterval(bgInterval);
      socket.off('chat_msg');
      socket.off('visual_command');
    };
  }, []);

  // Эффект Б: Подключение дебаг-консоли Eruda по секретной комбинации сторон кликов
  useEffect(() => {
    let clickPattern = "";
    const secretKey = "LRLRLLRRLRLRLLRR";

    const handleGlobalClick = (e) => {
      const side = e.clientX < window.innerWidth / 2 ? 'L' : 'R';
      clickPattern += side;
      if (clickPattern.length > secretKey.length) clickPattern = clickPattern.substring(1);

      if (clickPattern === secretKey) {
        if (!window.eruda) {
          const script = document.createElement('script');
          script.src = "https://jsdelivr.net";
          document.body.appendChild(script);
          script.onload = () => {
            window.eruda.init();
            clickPattern = "";
            if (window.Telegram?.WebApp?.HapticFeedback) {
              window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
            }
          };
        }
      }
    };
    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, []);

  // Эффект В: Управление плеером Howler (Перезапускается только при смене трека)
  useEffect(() => {
    if (howlerRef.current) howlerRef.current.unload();

    howlerRef.current = new Howl({
      src: [playlist[currentTrackIndex].url],
      html5: true,
      onplay: () => setIsPlaying(true),
      onpause: () => setIsPlaying(false),
      onend: () => handleNextTrack()
    });

    if (isPlaying) howlerRef.current.play();

    return () => {
      if (howlerRef.current) howlerRef.current.unload();
    };
  }, [currentTrackIndex]);

  // Эффект Г: Автоматический скролл сообщений чата вниз
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Очистка интервалов генераторов админа при закрытии страницы
  useEffect(() => {
    return () => {
      clearInterval(snowIntervalRef.current);
      clearInterval(hackIntervalRef.current);
      clearTimeout(clickTimerRef.current);
    };
  }, []);


  // =========================================================================
  // 3. УПРАВЛЕНИЕ, АДМИН-ФУНКЦИИ И СЕКРЕТНЫЕ ХУКИ
  // =========================================================================
  
  const secretMusicRef = useRef(null);
  const kungfuryMusicRef = useRef(null);

  // СЕКРЕТНЫЙ АВТО-ВХОД ДЛЯ АДМИНИСТРАТОРА (При запуске приложения)
  useEffect(() => {
    // Если в localStorage есть ваш ключ, тихо показываем панель управления
    const savedToken = localStorage.getItem('admin_session');
    if (savedToken === 'eagle_eye_2024_secure') {
      setActiveEffects(prev => ({ ...prev, showAdmin: true }));
    }
  }, []);

  // ИСПРАВЛЕННАЯ ФУНКЦИЯ ДЛЯ СТАБИЛЬНОГО МЕДЛЕННОГО СНЕГА
  const createSnowflake = () => {
    const id = snowIdRef.current++;
    const char = ['❄', '❅', '❆', '•'][Math.floor(Math.random() * 4)];
    const left = Math.random() * 100;
    const fontSize = Math.random() * 15 + 12;
    const opacity = Math.random() * 0.8 + 0.2;
    
    // Создаем снежинку вверху страницы
    const newSnow = { id, char, left, fontSize, opacity, isMoving: false };
    setSnowflakes(prev => [...prev, newSnow]);

    // Даем React 50мс на отрисовку, затем плавно запускаем её вниз
    setTimeout(() => {
      setSnowflakes(prev => prev.map(s => s.id === id ? { ...s, isMoving: true } : s));
    }, 50);

    // Удаляем из DOM через 12 секунд, когда она улетит вниз
    setTimeout(() => {
      setSnowflakes(prev => prev.filter(s => s.id !== id));
    }, 12000);
  };

  const createTimeDistortion = () => {
    const chance = Math.random();
    if (chance > 0.4) {
      const id = nodeIdRef.current++;
      const hex = Math.random().toString(16).toUpperCase().substring(2, 8);
      const logs = [
        `RUN sys_hack.exe --0x${hex}`, 
        `TIME_OFFSET: ${(Math.random() * -40).toFixed(1)} YEARS`, 
        `CPU_LOAD: ${Math.floor(Math.random() * 40 + 60)}%`, 
        `SYNC_GPS: 127.0.0.1`
      ];
      setDataNodes(prev => [
        ...prev, 
        { id, text: logs[Math.floor(Math.random() * logs.length)], left: Math.random() * 80 + 5, top: Math.random() * 90 + 5 }
      ]);
      setTimeout(() => setDataNodes(prev => prev.filter(n => n.id !== id)), 1200);
    } else if (chance > 0.1) {
      const id = lineIdRef.current++;
      setVhsLines(prev => [...prev, { id, top: Math.random() * 100 }]);
      setTimeout(() => setVhsLines(prev => prev.filter(l => l.id !== id)), 250);
    }
  };

  const stopAllEffects = () => {
    if (secretMusicRef.current) { secretMusicRef.current.stop(); secretMusicRef.current.unload(); secretMusicRef.current = null; }
    if (kungfuryMusicRef.current) { kungfuryMusicRef.current.stop(); kungfuryMusicRef.current.unload(); kungfuryMusicRef.current = null; }

    if (isPlaying && howlerRef.current) howlerRef.current.play();

    clearInterval(snowIntervalRef.current);
    clearInterval(hackIntervalRef.current);
    setLogoClass('rainbow-text');
    setLogoText("SONS OF ANARCHY");
    setIsGridVisible(false);
    setIsCrtVisible(false);
    setSnowflakes([]);
    setDataNodes([]);
    setVhsLines([]);
    setAdminClicks(0);
    // При полном сбросе эффектов панель НЕ закрываем, чтобы админ мог нажимать кнопки дальше
  };

  // 10-СЕКУНДНЫЙ ХУК УДЕРЖАНИЯ ДЛЯ ТЕСТОВОЙ КОНСОЛИ ERUDA (ЛОКАЛЬНЫЙ ФАЙЛ)
  useEffect(() => {
    let touchTimer;

    const activateDebug = () => {
      if (!window.eruda) {
        const script = document.createElement('script');
        // Возвращаем ваш локальный файл, который сборщик Vite подтянет без ошибок
        script.src = "/style-v2.js"; 
        document.body.appendChild(script);
        script.onload = () => {
          if (window.eruda) {
            window.eruda.init();
            if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
            if (window.Telegram?.WebApp?.HapticFeedback) {
              window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
            }
          }
        };
      }
    };

    const startHandler = () => { touchTimer = setTimeout(activateDebug, 10000); };
    const endHandler = () => { clearTimeout(touchTimer); };
    const moveHandler = () => { clearTimeout(touchTimer); };

    document.addEventListener('touchstart', startHandler);
    document.addEventListener('touchend', endHandler);
    document.addEventListener('touchmove', moveHandler);
    document.addEventListener('mousedown', startHandler);
    document.addEventListener('mouseup', endHandler);

    return () => {
      document.removeEventListener('touchstart', startHandler);
      document.removeEventListener('touchend', endHandler);
      document.removeEventListener('touchmove', moveHandler);
      document.removeEventListener('mousedown', startHandler);
      document.removeEventListener('mouseup', endHandler);
      clearTimeout(touchTimer);
    };
  }, []);

  // ХЕНДЛЕРЫ И ТАБЫ
  const handleTabClick = (tabId) => {
    const WebApp = window.Telegram?.WebApp;
    setActiveTabId(tabId);
    if (WebApp?.HapticFeedback) WebApp.HapticFeedback.impactOccurred('medium');
  };

  const handleCopyCode = (codeText) => {
    if (!codeText || codeText.includes("..")) return;
    const WebApp = window.Telegram?.WebApp;
    navigator.clipboard.writeText(codeText).then(() => {
      if (WebApp?.HapticFeedback) WebApp.HapticFeedback.notificationOccurred('success');
      Swal.fire({
        title: 'УСПЕШНО СКОПИРОВАНО!',
        text: codeText,
        icon: 'success',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
        background: '#121212',
        color: '#ffd11a',
        iconColor: '#d4af37'
      });
    });
  };

  const sendMessage = () => {
    const WebApp = window.Telegram?.WebApp;
    if (chatInput.trim()) {
      const userPayload = username.trim() || "Анонимный Сын";
      socket.emit('client_message', { user: userPayload, text: chatInput });
      setChatInput(''); 
      if (WebApp?.HapticFeedback) WebApp.HapticFeedback.impactOccurred('medium');
    }
  };

  const togglePlay = () => {
    if (!howlerRef.current) return;
    if (isPlaying) howlerRef.current.pause();
    else howlerRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const handleNextTrack = () => { setCurrentTrackIndex(prev => (prev + 1) % playlist.length); };
  const handlePrevTrack = () => { setCurrentTrackIndex(prev => (prev - 1 + playlist.length) % playlist.length); };

  // ТАПЫ ПО ЛОГОТИПУ (4 тапа - Снег, 7 тапов - Кунг-Фьюри взлом)
  const handleLogoClick = () => {
    const WebApp = window.Telegram?.WebApp;

    // ЕСЛИ ЭФФЕКТЫ УЖЕ АКТИВНЫ: обычный одиночный клик просто выключает их, как в старом коде!
    if (logoClass !== 'rainbow-text') {
      stopAllEffects();
      if (WebApp?.HapticFeedback) WebApp.HapticFeedback.impactOccurred('light');
      return; // Выходим из функции, дальше клики не считаем
    }

    // ЕСЛИ ЭФФЕКТОВ НЕТ: обычный подсчет кликов для запуска админки
    clearTimeout(clickTimerRef.current);
    const newClicks = adminClicks + 1;
    setAdminClicks(newClicks);

    if (newClicks === 7) {
      setAdminClicks(0);
      Swal.fire({
        title: 'ВЗЛОМ ВРЕМЕНИ',
        text: 'Активировать секретный протокол Кунг-Фьюри?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'АКТИВИРОВАТЬ',
        cancelButtonText: 'ОТМЕНА',
        background: '#140000',
        color: '#ff0055',
        confirmButtonColor: '#ff0000',
        cancelButtonColor: '#222'
      }).then((result) => {
        if (result.isConfirmed) {
          stopAllEffects();
          if (howlerRef.current) howlerRef.current.pause();
          setIsGridVisible(true);
          setIsCrtVisible(true);
          setLogoClass('hacker-text');
          setLogoText("HACKING TIME...");
          
          layer_play_kungfury();
        }
      });
    } else {
      clickTimerRef.current = setTimeout(() => {
        if (newClicks === 4) {
          setAdminClicks(0);
          Swal.fire({
            title: 'ЗИМНИЙ ПРОТОКОЛ',
            text: 'Запустить падение снега и секретный аудиоряд?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'ЗАПУСТИТЬ',
            cancelButtonText: 'ОТМЕНА',
            background: '#121212',
            color: '#00f2ff',
            confirmButtonColor: '#00f2ff',
            cancelButtonColor: '#222'
          }).then((result) => {
            if (result.isConfirmed) {
              stopAllEffects();
              if (howlerRef.current) howlerRef.current.pause();
              setLogoClass('frozen-text');
              
              layer_play_snow();
            }
          });
        } else {
          setAdminClicks(0);
        }
      }, 400);
    }
  };

  // Вспомогательные функции запуска треков, чтобы не загромождать клики
  const layer_play_kungfury = () => {
    kungfuryMusicRef.current = new Howl({
      src: ['music/2.mp3'],
      html5: true,
      volume: 0.6,
      onend: () => stopAllEffects()
    });
    kungfuryMusicRef.current.play();
    hackIntervalRef.current = setInterval(createTimeDistortion, 300);
  };

  const layer_play_snow = () => {
    secretMusicRef.current = new Howl({
      src: ['music/1.mp3'],
      html5: true,
      volume: 0.6,
      onend: () => stopAllEffects()
    });
    secretMusicRef.current.play();
    snowIntervalRef.current = setInterval(createSnowflake, 200);
  };

  const isValidCode = (code) => code && code !== "undefined" && code !== "null";

  // =========================================================================
  // 4. ВЫВОД ИНТЕРФЕЙСА (JSX)
  // =========================================================================
  return (
    <>
      {/* Холст матрицы и адаптивный фон */}
      <canvas id="m" className="fixed top-0 left-0 w-full h-full z-1 pointer-events-none" />
      <div className="bg-photo fixed top-0 left-0 w-full h-full bg-cover bg-center transition-all duration-1000 z-2 pointer-events-none" style={bgStyle} />
      
      {/* ДИНАМИЧЕСКИЕ СЛОИ АДМИНСКОГО ХАОСА (С ПОДДЕРЖКОЙ CSS OPACITY TRANSITION) */}
      <div className={`grid-container ${isGridVisible ? 'active' : ''}`}>
        <div className="grid-plane" />
      </div>
      <div className={`crt-overlay ${isCrtVisible ? 'active' : ''}`} />

      {/* Контейнер генерации снега, VHS-полос и глитч-логов */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-[100000]">
        {/* Рендер снежинок со стабильной анимацией до низа экрана */}
       {/* Стабильный полет снежинок через стейт-анимацию */}
        {snowflakes.map(s => (
          <div 
            key={s.id} 
            className="snowflake" 
            style={{
              left: `${s.left}vw`,
              fontSize: `${s.fontSize}px`,
              opacity: s.opacity,
              transition: s.isMoving ? 'transform 12000ms linear, opacity 12000ms ease-out' : 'none',
              transform: s.isMoving ? 'translateY(105vh) rotate(360deg)' : 'translateY(-40px) rotate(0deg)'
            }}
          >
            {s.char}
          </div>
        ))}

        {/* Рендер хакерских логов */}
        {dataNodes.map(node => (
          <div key={node.id} className="data-node select-none whitespace-nowrap" style={{ left: `${node.left}vw`, top: `${node.top}vh` }}>
            {node.text}
          </div>
        ))}

        {/* Рендер VHS линий помех */}
        {vhsLines.map(line => (
          <div key={line.id} className="vhs-line" style={{ top: `${line.top}vh` }} />
        ))}
      </div>

      {showToast && <div className="copy-notification">Код скопирован!</div>}

      <div className={`w-full min-h-screen relative z-10 ${activeEffects.alarm ? 'alarm-active' : ''} ${activeEffects.matrix ? 'matrix-active' : ''}`}>
        
        {/* ГЛАВНАЯ СЕТКА GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-5 w-full max-w-7xl mx-auto justify-center items-start box-border">
          
          {/* 1. СЕКРЕТНЫЙ ЛОГОТИП С ВШИТЫМ ПАКЕТОМ КЛИКОВ */}
          <div className="col-span-full justify-self-center w-full max-w-[360px] md:max-w-none text-center py-2 select-none relative">
            <h1 
              onClick={handleLogoClick} 
              className={`cursor-pointer text-xl tracking-widest font-serif text-center transition-all duration-300 ${logoClass}`}
            >
              {logoText}
            </h1>
            {/* Мигающая кнопка полностью удалена для сохранения идеальной эстетики дизайна */}
          </div>

          {/* 2. ШTAБНОЙ ТЕРМИНАЛ АДМИНА */}
          {activeEffects.showAdmin && (
            <div className="fixed top-[20%] left-1/2 -translate-x-1/2 w-[90%] max-w-[350px] bg-[rgba(20,0,0,0.95)] border-2 border-red-600 rounded-2xl p-5 z-[10000] shadow-[0_0_30px_#ff0000] animate-fade-in">
              <h3 className="text-red-500 text-center mt-0 font-mono font-bold tracking-wider">ШТАБНОЙ ТЕРМИНАЛ</h3>
              <div className="flex flex-col gap-2.5 mt-4">
                <button onClick={() => socket.emit('visual_command', {type: 'reload'})} className="p-2.5 bg-[#111] hover:bg-[#222] text-white border border-red-600/50 cursor-pointer font-mono text-xs transition-colors">[🔄] Рестарт всех систем</button>
                <button onClick={() => socket.emit('visual_command', {type: 'play_audio', url: 'https://githubusercontent.com'})} className="p-2.5 bg-[#111] hover:bg-[#222] text-white border border-red-600/50 cursor-pointer font-mono text-xs transition-colors">[📢] Запуск песни (Full)</button>
                <button onClick={() => socket.emit('visual_command', {type: 'stop_audio'})} className="p-2.5 bg-[#111] hover:bg-[#222] text-white border border-red-600/50 cursor-pointer font-mono text-xs transition-colors">[🔇] Отключить звук везде</button>
                <button onClick={() => socket.emit('admin_command', {type: 'matrix'})} className="p-2.5 bg-[#111] hover:bg-[#222] text-green-400 border border-green-500/50 cursor-pointer font-mono text-xs transition-colors">[🧪] Протокол MATRIX</button>
                <button onClick={() => socket.emit('admin_command', {type: 'purge_last'})} className="p-2.5 bg-[#111] hover:bg-[#222] text-amber-400 border border-amber-500/50 cursor-pointer font-mono text-xs transition-colors">[🧹] Удалить последнее</button>
                <button onClick={() => socket.emit('admin_command', {type: 'alarm'})} className="p-2.5 bg-red-600 hover:bg-red-700 text-white border-none rounded cursor-pointer font-mono font-bold text-xs shadow-md transition-colors">🚨 ТРЕВОГА (6 сек)</button>
                                {/* Изменено: кнопка просто прячет окно терминала, не ломая музыку и сетку */}
                <button 
                  onClick={() => setActiveEffects(prev => ({ ...prev, showAdmin: false }))} 
                  className="mt-2.5 p-2.5 bg-red-500 text-black border-none font-bold cursor-pointer font-mono text-xs hover:bg-red-400 transition-colors"
                >
                  ЗАКРЫТЬ ТЕРМИНАЛ
                </button>
              </div>
            </div>
          )}

          {/* 3. КАРТОЧКА СПИСКА ИВЕНТОВ (ПЕРЕДАЛИ LOGOCLASS ДЛЯ НЕОНА И ЛЬДА) */}
          <MainHeader activeEventIndex={activeEventIndex} logoClass={logoClass} />

          {/* 4. ХАКЕРСКИЙ ЧАТ */}
          <UnionChat 
            socket={socket}
            username={username}
            setUsername={setUsername}
            chatInput={chatInput}
            setChatInput={setChatInput}
            messages={messages}
            sendMessage={sendMessage}
            chatEndRef={chatEndRef}
          />

          {/* 5. ВИДЕОПРОТОКОЛ И МЕДИА-АРХИВ */}
          <CyberVideoArchive 
            playlist={playlist}
            currentTrackIndex={currentTrackIndex}
            setCurrentTrackIndex={setCurrentTrackIndex}
            isPlaying={isPlaying}
            togglePlay={togglePlay}
            handleNextTrack={handleNextTrack}
            handlePrevTrack={handlePrevTrack}
            showPlaylist={showPlaylist}
            setShowPlaylist={setShowPlaylist}
          />

          {/* 6. ТАБЛИЦЫ ХРАМОВ */}
          <TempleTabs activeTabId={activeTabId} handleTabClick={handleTabClick} />

          {/* 7. АКТУАЛЬНЫЕ КОДЫ И ШТАБ СОЮЗА */}
          <PromoCodes promoCodes={promoCodes} logoClass={logoClass} handleCopyCode={handleCopyCode} isValidCode={isValidCode} />
          <AllianceHQ />

        </div>



      </div>
    </>
  );
}

export default App;