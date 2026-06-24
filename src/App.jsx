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
  // 1. СОСТОЯНИЯ (STATE)
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

  const howlerRef = useRef(null);
  const clickTimerRef = useRef(null);
  const chatEndRef = useRef(null);

  // =========================================================================
  // 2. ЭФФЕКТЫ И ПОДКЛЮЧЕНИЕ СЕТЕВЫХ СЛУШАТЕЛЕЙ
  // =========================================================================
  useEffect(() => {
    if (window.Telegram?.WebApp) {
  try {
    window.Telegram.WebApp.expand();
    window.Telegram.WebApp.ready();
  } catch (e) {
    console.log("Telegram SDK Error:", e);
  }
}

    if (howlerRef.current) {
      howlerRef.current.unload();
    }

    howlerRef.current = new Howl({
      src: [playlist[currentTrackIndex].url],
      html5: true,
      onplay: () => setIsPlaying(true),
      onpause: () => setIsPlaying(false),
      onend: () => handleNextTrack()
    });

    if (isPlaying) {
      howlerRef.current.play();
    }

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

    socket.on('chat_msg', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    socket.on('visual_command', (data) => {
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

    return () => {
      clearInterval(bgInterval);
      socket.off('chat_msg');
      socket.off('visual_command');
      if (howlerRef.current) howlerRef.current.unload();
    };
  }, [currentTrackIndex]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // =========================================================================
  // 3. УПРАВЛЕНИЕ И ЛОГИКА
  // =========================================================================
  const handleTabClick = (tabId) => {
    setActiveTabId(tabId);
    if (WebApp?.HapticFeedback) WebApp.HapticFeedback.impactOccurred('medium');
  };

  const handleCopyCode = (codeText) => {
    if (!codeText || codeText.includes("..")) return;
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
        color: '#ff0000',
        iconColor: '#d4af37'
      });
    });
  };

  const sendMessage = () => {
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

  const handleNextTrack = () => {
    setCurrentTrackIndex(prev => (prev + 1) % playlist.length);
  };

  const handlePrevTrack = () => {
    setCurrentTrackIndex(prev => (prev - 1 + playlist.length) % playlist.length);
  };

  const handleLogoClick = () => {
    clearTimeout(clickTimerRef.current);
    const newClicks = adminClicks + 1;
    setAdminClicks(newClicks);

    if (newClicks === 7) {
      setActiveEffects(prev => ({ ...prev, showAdmin: true }));
      setAdminClicks(0);
      if (WebApp?.HapticFeedback) WebApp.HapticFeedback.notificationOccurred('success');
    } else {
      clickTimerRef.current = setTimeout(() => setAdminClicks(0), 400);
    }
  };

  const isValidCode = (code) => code && code !== "undefined" && code !== "null";

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

return (
    <>
      {/* Холст матрицы и адаптивный фон */}
      <canvas id="m" className="fixed top-0 left-0 w-full h-full z-1 pointer-events-none" />
      <div className="bg-photo fixed top-0 left-0 w-full h-full bg-cover bg-center transition-all duration-1000 z-2 pointer-events-none" style={bgStyle} />
      
      <div className={`w-full min-h-screen relative z-10 ${activeEffects.alarm ? 'alarm-active' : ''} ${activeEffects.matrix ? 'matrix-active' : ''}`}>
        
        {/* ГЛАВНАЯ СЕТКА GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-5 w-full max-w-7xl mx-auto justify-center items-start box-border">
          
          {/* 1. СЕКРЕТНЫЙ ЛОГОТИП */}
          <div className="col-span-full justify-self-center w-full max-w-[360px] md:max-w-none text-center py-2 select-none">
            <h1 
              onClick={handleLogoClick} 
              className={`cursor-pointer text-xl tracking-widest font-serif text-center transition-all duration-300 ${
                activeEffects?.matrix ? 'hacker-text text-[#ff00ff]' : 'text-soa-yellow'
              }`}
            >
              {activeEffects?.matrix ? "⚡ HACKING TIME... ⚡" : "SONS OF ANARCHY"}
            </h1>
          </div>

          {/* 2. ШTAБНОЙ ТЕРМИНАЛ АДМИНА */}
          {activeEffects.showAdmin && (
            <div className="fixed top-[20%] left-1/2 -translate-x-1/2 w-[90%] max-w-[350px] bg-[rgba(20,0,0,0.95)] border-2 border-predator rounded-2xl p-5 z-[10000] shadow-[0_0_30px_#ff0000] animate-fade-in">
              <h3 className="text-predator text-center mt-0 font-mono font-bold">ШТАБНОЙ ТЕРМИНАЛ</h3>
              <div className="flex flex-col gap-2.5">
                <button onClick={() => socket.emit('visual_command', {type: 'reload'})} className="p-2.5 bg-[#222] text-white border border-predator cursor-pointer font-mono text-xs">🔄 Рестарт всех систем</button>
                <button onClick={() => socket.emit('visual_command', {type: 'play_audio', url: 'https://githubusercontent.com'})} className="p-2.5 bg-[#222] text-white border border-predator cursor-pointer font-mono text-xs">📢 Запуск песни (Full)</button>
                <button onClick={() => socket.emit('visual_command', {type: 'stop_audio'})} className="p-2.5 bg-[#222] text-white border border-predator cursor-pointer font-mono text-xs">🔇 Отключить звук везде</button>
                <button onClick={() => socket.emit('admin_command', {type: 'matrix'})} className="p-2.5 bg-[#222] text-white border border-matrix cursor-pointer font-mono text-xs">🧪 Протокол MATRIX</button>
                <button onClick={() => socket.emit('admin_command', {type: 'purge_last'})} className="p-2.5 bg-[#222] text-soa-gold border border-soa-gold cursor-pointer font-mono text-xs">🧹 Удалить последнее</button>
                <button onClick={() => socket.emit('admin_command', {type: 'alarm'})} className="p-2.5 bg-predator text-white border-none rounded cursor-pointer font-mono font-bold text-xs shadow-md">🚨 ТРЕВОГА (6 сек)</button>
                <button onClick={() => setActiveEffects(prev => ({ ...prev, showAdmin: false }))} className="mt-2.5 p-2.5 bg-predator text-black border-none font-bold cursor-pointer font-mono text-xs">ЗАКРЫТЬ ТЕРМИНАЛ</button>
              </div>
            </div>
          )}

          {/* 3. КАРТОЧКА СПИСКА ИВЕНТОВ */}
          <MainHeader activeEventIndex={activeEventIndex} />

          {/* 4. ХАКЕРСКИЙ ЧАТ (Подставили все реальные переменные) */}
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

          {/* 5. ВИДЕОПРОТОКОЛ */}
          <CyberVideoArchive />

          {/* 6. ТАБЛИЦЫ ХРАМОВ */}
          <TempleTabs />

          {/* 7. АКТУАЛЬНЫЕ КОДЫ И ШТАБ СОЮЗА */}
          <PromoCodes promoCodes={promoCodes} />
          <AllianceHQ />

        </div>
      </div>
    </>
  );
}

export default App;