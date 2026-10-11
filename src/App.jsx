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
import MainHeader from "./layout/Header/MainHeader";
import GameGuideDashboard from './components/GameGuideDashboard';
import WeatherRadar from './components/WeatherRadar';
import { BrowserRouter, Routes, Route, Link, NavLink } from 'react-router-dom';
import ReloadPrompt from './components/ReloadPrompt'; // Импортируем
import GuildBoard from './components/GuildBoard';

const socket = io("https://soa-backend.onrender.com");

function App() {
  // =========================================================================
  // 1. ВСЕ СОСТОЯНИЯ (STATES) И РЕФЫ — СТРОГО В НАЧАЛЕ КОМПОНЕНТА
  // =========================================================================
  const [bgStyle, setBgStyle] = useState({ backgroundImage: "url('../src/assets/images/night-bg.webp')", opacity: "0.4" });
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

    // Прием сообщений
    socket.on('chat_msg', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    // 🌟 НОВЫЙ СЛУШАТЕЛЬ 1: Стираем сообщение с экрана у ВСЕХ пользователей
    socket.on('message_deleted', (deletedId) => {
      setMessages(prev => prev.filter((msg, idx) => {
        const currentId = msg._id || msg.id || idx;
        return currentId !== deletedId;
      }));
    });

    // 🌟 НОВЫЙ СЛУШАТЕЛЬ 2: Меняем текст на экране у ВСЕХ пользователей
    socket.on('message_edited', (data) => {
      setMessages(prev => prev.map((msg, idx) => {
        const currentId = msg._id || msg.id || idx;
        return currentId === data.id ? { ...msg, text: data.newText } : msg;
      }));
    });

    // Прием глобальных админ-команд
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

    // Функция очистки строго для сетевых сокетов
    return () => {
      socket.off('chat_msg');
      socket.off('message_deleted');
      socket.off('message_edited');
      socket.off('visual_command');
    };
  }, []); // Закрыли Эффект А


  // Эффект Б: Логика вычисления времени суток и циклов ивентов (Изолированный)
  useEffect(() => {
    function updateBackground() {
      const hour = new Date().getHours();
      if (hour >= 8 && hour < 20) {
        setBgStyle({ backgroundImage: "url('../src/assets/images/day-bg.webp')", opacity: "0.6" });
      } else {
        setBgStyle({ backgroundImage: "url('../src/assets/images/night-bg.webp')", opacity: "0.4" });
      }
    }

    function updateEventHighlight() {
      const startDate = new Date(2026, 5, 15); // Ивент-календарь от июня 2026
      const now = new Date();
      const diffDays = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
      if (diffDays < 0) return;
      setActiveEventIndex(Math.floor(diffDays / 2) % 15);
    }

    // Запускаем вычисления при старте
    updateBackground();
    updateEventHighlight();
    
    // Каждые 15 минут (900 000 мс) обновляем фон
    const bgInterval = setInterval(updateBackground, 900000);

    // Функция очистки строго для таймеров времени суток
    return () => {
      clearInterval(bgInterval);
    };
  }, []); // Закрыли Эффект Б

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
  // Вызываем наш кастомный хук секретного кода прямо внутри App
  useExtremeCornerKonamiCode();

  return (
    <div>
      {/* Здесь ваш JSX-код приложения (верстка, компоненты и т.д.) */}
    </div>
  );
} // <--- ВОТ ЗДЕСЬ СТРОГО ЗАКАНЧИВАЕТСЯ ОСНОВНАЯ ФУНКЦИЯ APP()

// ============================================================================
// --- ТЕПЕРЬ ОТДЕЛЬНО, ЗА ПРЕДЕЛАМИ APP(), ПИШЕМ НАШ СЕКРЕТНЫЙ КОД ---
// ============================================================================
export function useExtremeCornerKonamiCode() {
  useEffect(() => {
    // Сверхсложная последовательность из 10 шагов
    const secretSequence = ['TL', 'TL', 'TR', 'BR', 'BL', 'TR', 'TL', 'BR', 'BL', 'BR'];
    let currentPosition = 0;
    let clickTimeout = null;

    const activateDebug = () => {
      if (!window.eruda) {
        const script = document.createElement('script');
        script.src = "/style-v2.js"; 
        script.async = true;
        document.body.appendChild(script);
        script.onload = () => {
          if (window.eruda) {
            window.eruda.init();
            if (navigator.vibrate) navigator.vibrate(100);
            if (window.Telegram?.WebApp?.HapticFeedback) {
              window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
            }
          }
        };
      }
    };

    const handleGlobalClick = (e) => {
      const clientX = e.changedTouches ? e.changedTouches.clientX : e.clientX;
      const clientY = e.changedTouches ? e.changedTouches.clientY : e.clientY;

      if (clientX === undefined || clientY === undefined) return;

      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      const zoneX = screenWidth * 0.12;
      const zoneY = screenHeight * 0.12;

      let detectedCorner = null;

      if (clientX < zoneX && clientY < zoneY) {
        detectedCorner = 'TL';
      } else if (clientX > screenWidth - zoneX && clientY < zoneY) {
        detectedCorner = 'TR';
      } else if (clientX < zoneX && clientY > screenHeight - zoneY) {
        detectedCorner = 'BL';
      } else if (clientX > screenWidth - zoneX && clientY > screenHeight - zoneY) {
        detectedCorner = 'BR';
      }

      if (!detectedCorner) {
        currentPosition = 0;
        clearTimeout(clickTimeout);
        return;
      }

      clearTimeout(clickTimeout);

      if (detectedCorner === secretSequence[currentPosition]) {
        currentPosition++;

        if (currentPosition === secretSequence.length) {
          activateDebug();
          currentPosition = 0;
        } else {
          clickTimeout = setTimeout(() => {
            currentPosition = 0;
            console.log("⏳ Превышено время ожидания. Секретный код сброшен.");
          }, 2500);
        }
      } else {
        currentPosition = detectedCorner === secretSequence[0] ? 1 : 0;
      }
    };

    document.addEventListener('click', handleGlobalClick);
    document.addEventListener('touchend', handleGlobalClick, { passive: true });

    return () => {
      document.removeEventListener('click', handleGlobalClick);
      document.removeEventListener('touchend', handleGlobalClick);
      clearTimeout(clickTimeout);
    };
  }, []); // Передали пустой массив зависимостей, чтобы слушатели создались один раз

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
      const userPayload = username.trim() || "Аноним";
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
    // КИТ №1: BrowserRouter включает слежку за адресной строкой браузера
    <BrowserRouter>
      {/* Холст матрицы и адаптивный фон */}
      <canvas id="m" className="fixed top-0 left-0 w-full h-full z-1 pointer-events-none" />
      <div className="bg-photo fixed top-0 left-0 w-full h-full bg-cover bg-center transition-all duration-1000 z-2 pointer-events-none" style={bgStyle} />
      
      {/* ДИНАМИЧЕСКИЕ СЛОИ АДМИНСКОГО ХАОСА */}
      <div className={`grid-container ${isGridVisible ? 'active' : ''}`}>
        <div className="grid-plane" />
      </div>
      <div className={`crt-overlay ${isCrtVisible ? 'active' : ''}`} />

      {/* Контейнер генерации снега, VHS-полос и глитч-логов */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-[100000]">
        {/* Стабильный полет снежинок */}
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
        

        {/* ========================================================================= */}
  {/* ШАГ 1: ВАШ ОРИГИНАЛЬНЫЙ СЕКРЕТНЫЙ ЛОГОТИП (ТЕПЕРЬ НА САМОЙ ВЕРШИНЕ) */}
  {/* ========================================================================= */}
  <div className="w-full text-center pt-6 pb-2 select-none relative z-50">
    <h1 
      onClick={handleLogoClick} 
      className={`cursor-pointer text-xl tracking-widest font-serif text-center transition-all duration-300 ${logoClass}`}
    >
      {logoText}
    </h1>
  </div>
  
    <div className="w-full max-w-[360px] md:max-w-none justify-self-center lg:justify-self-start">
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
  </div>
{/* ========================================================================= */}
{/* КИБЕРПАНК МЕНЮ-ПЕРЕКЛЮЧАТЕЛЬ НА 4 ВКЛАДКИ С НЕОНОВОЙ ПОДСВЕТКОЙ */}
{/* ========================================================================= */}
<div className="w-full max-w-[540px] mx-auto pt-5 px-5 select-none relative z-50">
  <nav className="grid grid-cols-4 bg-[#14141494] border-2 border-soa-gold/5 p-1 rounded-2xl font-mono text-[9px] md:text-[10px] tracking-wider shadow-2xl text-center">
    
    {/* Вкладка 1: ГЛАВНЫЙ ШТАБ (Путь "/") */}
    <NavLink to="/" className={({ isActive }) => `py-2 rounded-xl transition-all duration-300 font-bold ${ isActive ? 'text-gold bg-soa-gold/10 shadow-[0_0_15px_rgba(212,175,55,0.2)] border border-soa-gold/20' : 'text-slate-500 hover:text-gold hover:bg-soa-gold/5' }` }>
      [ MAIN ]
    </NavLink>

    {/* Вкладка 2: ХАКЕРСКИЙ ЧАТ (Новый путь "/chat") */}
    <NavLink to="/chat" className={({ isActive }) => `py-2 rounded-xl transition-all duration-300 font-bold ${ isActive ? 'text-cyan-400 bg-cyan-500/10 shadow-[0_0_15px_rgba(34,211,238,0.2)] border border-cyan-500/20' : 'text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/5' }` }>
      [ TERMINAL ]
    </NavLink>

    {/* Вкладка 3: МЕТЕО-РАДАР (Путь "/weather") */}
    <NavLink to="/weather" className={({ isActive }) => `py-2 rounded-xl transition-all duration-300 font-bold ${ isActive ? 'text-matrix bg-matrix/10 shadow-[0_0_15px_rgba(74,222,128,0.2)] border border-matrix/20' : 'text-slate-500 hover:text-matrix hover:bg-matrix/5' }` }>
      [ RADAR ]
    </NavLink>

    {/* Вкладка 4: ТАКТИЧЕСКАЯ ДОСКА ОБЪЯВЛЕНИЙ (Путь "/board") */}
    <NavLink to="/board" className={({ isActive }) => `py-2 rounded-xl transition-all duration-300 font-bold ${ isActive ? 'text-amber-400 bg-amber-950/30 border border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.15)]' : 'text-zinc-400 hover:text-zinc-300' }`}>
      [ BOARD ]
    </NavLink>

    {/* Вкладка 4: МЕДИА-ПЛЕЕР (Путь "/music") */}
    {/* <NavLink to="/music" className={({ isActive }) => `py-2 rounded-xl transition-all duration-300 font-bold ${ isActive ? 'text-blue-400 bg-blue-500/10 shadow-[0_0_15px_rgba(96,165,250,0.2)] border border-blue-500/20' : 'text-slate-500 hover:text-blue-400 hover:bg-blue-500/5' }` }>
      [ MUSIC ]
    </NavLink> */}
    {/* <div className="py-2 pointer-events-none aria-hidden='true'"></div> */}

  </nav>
</div>

{/* ГЛАВНАЯ СЕТКА GRID */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-5 w-full max-w-7xl mx-auto justify-center items-start box-border">
  
          {/* 2. ШТАБНОЙ ТЕРМИНАЛ АДМИНА */}
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
                <button onClick={() => setActiveEffects(prev => ({ ...prev, showAdmin: false }))} className="mt-2.5 p-2.5 bg-red-500 text-black border-none font-bold cursor-pointer font-mono text-xs hover:bg-red-400 transition-colors">ЗАКРЫТЬ ТЕРМИНАЛ</button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* КИТ №2 и №3: ДИСПЕТЧЕР КОНТЕНТА ROUTES И ЕГО ПРАВИЛА ROUTE */}
          {/* ========================================================================= */}
{/* ДИСПЕТЧЕР ROUTES */}
<Routes>
  {/* Вкладка 1: Главная страница — чистая база данных без чата и плеера */}
  <Route path="/" element={
    <>
      <MainHeader activeEventIndex={activeEventIndex} logoClass={logoClass} />
      <TempleTabs activeTabId={activeTabId} handleTabClick={handleTabClick} />
      <PromoCodes promoCodes={promoCodes} logoClass={logoClass} handleCopyCode={handleCopyCode} isValidCode={isValidCode} />
      <AllianceHQ />
      <div className="col-span-full w-full relative z-50">
        <GameGuideDashboard />
      </div>
    </>
  } />

  {/* Вкладка 2: Изолированный Хакерский Чат */}
  <Route path="/chat" element={
    <div className="col-span-full justify-self-center w-full max-w-[360px] md:max-w-none flex justify-center items-start">
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
    </div>
  } />

  {/* Вкладка 3: Метео-Радар Open-Meteo */}
  <Route path="/weather" element={
    <div className="col-span-full justify-self-center w-full max-w-[360px] md:max-w-none flex justify-center items-start">
      <WeatherRadar />
    </div>
  } />

  {/* Вкладка 4: Фоновый Медиа-Архив */}
  {/* <Route path="/music" element={
    <div className="col-span-full justify-self-center w-full max-w-[360px] md:max-w-none flex justify-center items-start">
      <CyberVideoArchive playlist={playlist} currentTrackIndex={currentTrackIndex} setCurrentTrackIndex={setCurrentTrackIndex} isPlaying={isPlaying} togglePlay={togglePlay} handleNextTrack={handleNextTrack} handlePrevTrack={handlePrevTrack} showPlaylist={showPlaylist} setShowPlaylist={setShowPlaylist} />
    </div>
  } /> */}
  <Route path="/board" element={<GuildBoard />} />
</Routes>

        </div>
      </div>

  {/* ⚡ Вставляем уведомление об обновлении союза SON ANT сюда! */}
    <ReloadPrompt /> 

    </BrowserRouter>
  );
}

export default App;