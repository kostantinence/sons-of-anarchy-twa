import { useState, useEffect, useRef } from 'react'
import WebApp from '@twa-dev/sdk'
import Swal from 'sweetalert2'
import { io } from 'socket.io-client'
import { Howl } from 'howler'
import './App.css'
import './index.css'
import ReactPlayer from 'react-player'
import CyberVideoArchive from './CyberVideoArchive';

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
      <canvas id="m" className="fixed top-0 left-0 w-full h-full z-1 pointer-events-none" />
      <div className="bg-photo fixed top-0 left-0 w-full h-full bg-cover bg-center transition-all duration-1000 z-2 pointer-events-none" style={bgStyle} />
      
      <div className={`w-full min-h-screen relative z-10 ${activeEffects.alarm ? 'alarm-active' : ''} ${activeEffects.matrix ? 'matrix-active' : ''}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-5 w-full max-w-7xl mx-auto justify-center items-start box-border">
          
          {/* ШАПКА ПРОЕКТА */}
          <div className="card-header col-span-full justify-self-center w-full max-w-[360px] md:max-w-none">
            <h1 onClick={handleLogoClick} className="cursor-pointer text-xl tracking-widest font-serif text-center text-soa-yellow select-none">
              SONS OF ANARCHY
            </h1>
          </div>

          {/* ШTAБНОЙ ТЕРМИНАЛ АДМИНА */}
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

          {/* КОЛОННА 1: СПИСОК ИВЕНТОВ */}
          <div className="static-box w-full">
            <h2 className="text-base italic border-b border-[#d45737] pb-2.5 mb-3 font-serif">Порядок двух дневных ивентов</h2>
            <div className="space-y-1 text-left max-h-[400px] overflow-y-auto pr-1">
              {events.map((eventText, idx) => (
                <p key={idx} className={`text-[13px] leading-snug p-1 rounded transition-all duration-300 ${activeEventIndex === idx ? 'active-event font-bold pl-2' : 'text-white/80'}`}>
                  {eventText}
                </p>
              ))}
            </div>
          </div>

          {/* КОЛОННА 2: ХРАМЫ И ТАБЛИЦЫ */}
          <div className="flex flex-col gap-[18px] w-full">
            <div className="temple-tabs-nav flex gap-2 w-full justify-center">
              {['machine', 'fire', 'units'].map((tabId) => (
                <button key={tabId} className={`tab-btn flex-1 p-2 text-[10px] sm:text-xs font-mono rounded-lg transition-all ${activeTabId === tabId ? 'active' : ''}`} onClick={() => handleTabClick(tabId)}>
                  {tabId === 'machine' && 'ХРАМ МАШИН'}
                  {tabId === 'fire' && 'ХРАМ ОГНЯ'}
                  {tabId === 'units' && 'ХРАМ ЮНИТОВ'}
                </button>
              ))}
            </div>

            <div className="w-full bg-black/60 border-1.8 border-soa-gold/80 p-3.5 rounded-xl shadow-lg">
              {activeTabId === 'machine' && (
                <div className="overflow-x-auto">
                  <table className="temple-table w-full text-[11px] text-white border-collapse">
                    <thead>
                      <tr className="bg-soa-gold/20 text-soa-gold">
                        <th className="p-1 border border-soa-gold/50">Бонусы:</th>
                        <th className="p-1 border border-soa-gold/50">20 лвл</th>
                        <th className="p-1 border border-soa-gold/50">40 лвл</th>
                        <th className="p-1 border border-soa-gold/50">60 лвл</th>
                        <th className="p-1 border border-soa-gold/50">80 лвл</th>
                        <th className="p-1 border border-soa-gold/50">100 лвл</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="text-center">
                        <td className="p-1 border border-soa-gold/25 font-bold">ХП</td>
                        <td className="p-1 border border-soa-gold/25">3,5%</td>
                        <td className="p-1 border border-soa-gold/25">7,50%</td>
                        <td className="p-1 border border-soa-gold/25">15%</td>
                        <td className="p-1 border border-soa-gold/25">28,50%</td>
                        <td className="p-1 border border-soa-gold/25">--</td>
                      </tr>
                      <tr className="text-center bg-white/5">
                        <td className="p-1 border border-soa-gold/25 font-bold">Доп. Физ. Защ.</td>
                        <td className="p-1 border border-soa-gold/25">12</td>
                        <td className="p-1 border border-soa-gold/25">25,5</td>
                        <td className="p-1 border border-soa-gold/25">42</td>
                        <td className="p-1 border border-soa-gold/25">63</td>
                        <td className="p-1 border border-soa-gold/25">--</td>
                      </tr>
                      <tr className="text-center bg-white/5">
                        <td className="p-1 border border-soa-gold/25 font-bold">Доп. Маг. Защ.</td>
                        <td className="p-1 border border-soa-gold/25">12</td>
                        <td className="p-1 border border-soa-gold/25">25,5</td>
                        <td className="p-1 border border-soa-gold/25">42</td>
                        <td className="p-1 border border-soa-gold/25">59</td>
                        <td className="p-1 border border-soa-gold/25">--</td>
                      </tr>
                      <tr className="text-center bg-white/5">
                        <td className="p-1 border border-soa-gold/25 font-bold">УРН навыка</td>
                        <td className="p-1 border border-soa-gold/25">1%</td>
                        <td className="p-1 border border-soa-gold/25">2,50%</td>
                        <td className="p-1 border border-soa-gold/25">5%</td>
                        <td className="p-1 border border-soa-gold/25">7%</td>
                        <td className="p-1 border border-soa-gold/25">--</td>
                      </tr>
                      <tr className="text-center bg-white/5">
                        <td className="p-1 border border-soa-gold/25 font-bold">Эффект лечения</td>
                        <td className="p-1 border border-soa-gold/25">1%</td>
                        <td className="p-1 border border-soa-gold/25">2,50%</td>
                        <td className="p-1 border border-soa-gold/25">5%</td>
                        <td className="p-1 border border-soa-gold/25">7%</td>
                        <td className="p-1 border border-soa-gold/25">--</td>
                      </tr>
                      <tr className="text-center bg-white/5">
                        <td className="p-1 border border-soa-gold/25 font-bold">Снижение УРН</td>
                        <td className="p-1 border border-soa-gold/25">0%</td>
                        <td className="p-1 border border-soa-gold/25">3%</td>
                        <td className="p-1 border border-soa-gold/25">5%</td>
                        <td className="p-1 border border-soa-gold/25">7.5%</td>
                        <td className="p-1 border border-soa-gold/25">--</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
              {activeTabId === 'fire' && 
              (
                <div className="overflow-x-auto">
                  <table className="temple-table w-full text-[11px] text-white border-collapse">
                    <thead>
                      <tr className="bg-soa-gold/20 text-soa-gold">
                        <th className="p-1 border border-soa-gold/50">Бонусы:</th>
                        <th className="p-1 border border-soa-gold/50">20 лвл</th>
                        <th className="p-1 border border-soa-gold/50">40 лвл</th>
                        <th className="p-1 border border-soa-gold/50">60 лвл</th>
                        <th className="p-1 border border-soa-gold/50">80 лвл</th>
                        <th className="p-1 border border-soa-gold/50">100 лвл</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="text-center">
                        <td className="p-1 border border-soa-gold/25 font-bold">Физ. Атака</td>
                        <td className="p-1 border border-soa-gold/25">--</td>
                        <td className="p-1 border border-soa-gold/25">6,5</td>
                        <td className="p-1 border border-soa-gold/25">14</td>
                        <td className="p-1 border border-soa-gold/25">25</td>
                        <td className="p-1 border border-soa-gold/25">40</td>
                      </tr>
                      <tr className="text-center bg-white/5">
                        <td className="p-1 border border-soa-gold/25 font-bold">Физ. Защита</td>
                        <td className="p-1 border border-soa-gold/25">--</td>
                        <td className="p-1 border border-soa-gold/25">6,5</td>
                        <td className="p-1 border border-soa-gold/25">14</td>
                        <td className="p-1 border border-soa-gold/25">25</td>
                        <td className="p-1 border border-soa-gold/25">40</td>
                      </tr>
                      <tr className="text-center bg-white/5">
                        <td className="p-1 border border-soa-gold/25 font-bold">Маг. Атака</td>
                        <td className="p-1 border border-soa-gold/25">--</td>
                        <td className="p-1 border border-soa-gold/25">6,5</td>
                        <td className="p-1 border border-soa-gold/25">14</td>
                        <td className="p-1 border border-soa-gold/25">25</td>
                        <td className="p-1 border border-soa-gold/25">40</td>
                      </tr>
                      <tr className="text-center bg-white/5">
                        <td className="p-1 border border-soa-gold/25 font-bold">Маг. Защита</td>
                        <td className="p-1 border border-soa-gold/25">--</td>
                        <td className="p-1 border border-soa-gold/25">6,5</td>
                        <td className="p-1 border border-soa-gold/25">14</td>
                        <td className="p-1 border border-soa-gold/25">25</td>
                        <td className="p-1 border border-soa-gold/25">40</td>
                      </tr>
                      <tr className="text-center bg-white/5">
                        <td className="p-1 border border-soa-gold/25 font-bold">УРН навыка</td>
                        <td className="p-1 border border-soa-gold/25">--</td>
                        <td className="p-1 border border-soa-gold/25">11%</td>
                        <td className="p-1 border border-soa-gold/25">18%</td>
                        <td className="p-1 border border-soa-gold/25">28%</td>
                        <td className="p-1 border border-soa-gold/25">40%</td>
                      </tr>
                      <tr className="text-center bg-white/5">
                        <td className="p-1 border border-soa-gold/25 font-bold">Эффект лечения</td>
                        <td className="p-1 border border-soa-gold/25">0</td>
                        <td className="p-1 border border-soa-gold/25">11%</td>
                        <td className="p-1 border border-soa-gold/25">18%</td>
                        <td className="p-1 border border-soa-gold/25">28%</td>
                        <td className="p-1 border border-soa-gold/25">40%</td>
                      </tr>
                      <tr className="text-center bg-white/5">
                        <td className="p-1 border border-soa-gold/25 font-bold">Уклон солдата</td>
                        <td className="p-1 border border-soa-gold/25">0</td>
                        <td className="p-1 border border-soa-gold/25">0</td>
                        <td className="p-1 border border-soa-gold/25">1%</td>
                        <td className="p-1 border border-soa-gold/25">3%</td>
                        <td className="p-1 border border-soa-gold/25">5%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
              {activeTabId === 'units' && 
              (
                <div className="overflow-x-auto">
                  <table className="temple-table w-full text-[11px] text-white border-collapse">
                    <thead>
                      <tr className="bg-soa-gold/20 text-soa-gold">
                        <th className="p-1 border border-soa-gold/50">Бонусы:</th>
                        <th className="p-1 border border-soa-gold/50">20 лвл</th>
                        <th className="p-1 border border-soa-gold/50">40 лвл</th>
                        <th className="p-1 border border-soa-gold/50">60 лвл</th>
                        <th className="p-1 border border-soa-gold/50">80 лвл</th>
                        <th className="p-1 border border-soa-gold/50">100 лвл</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="text-center">
                        <td className="p-1 border border-soa-gold/25 font-bold">Физ. Атака</td>
                        <td className="p-1 border border-soa-gold/25">5</td>
                        <td className="p-1 border border-soa-gold/25">14%</td>
                        <td className="p-1 border border-soa-gold/25">25,5%</td>
                        <td className="p-1 border border-soa-gold/25">--</td>
                        <td className="p-1 border border-soa-gold/25">--</td>
                      </tr>
                      <tr className="text-center bg-white/5">
                        <td className="p-1 border border-soa-gold/25 font-bold">Физ. Защита</td>
                        <td className="p-1 border border-soa-gold/25">5</td>
                        <td className="p-1 border border-soa-gold/25">14%</td>
                        <td className="p-1 border border-soa-gold/25">25,5%</td>
                        <td className="p-1 border border-soa-gold/25">--</td>
                        <td className="p-1 border border-soa-gold/25">--</td>
                      </tr>
                      <tr className="text-center bg-white/5">
                        <td className="p-1 border border-soa-gold/25 font-bold">Маг. Атака</td>
                        <td className="p-1 border border-soa-gold/25">5</td>
                        <td className="p-1 border border-soa-gold/25">14%</td>
                        <td className="p-1 border border-soa-gold/25">25,5%</td>
                        <td className="p-1 border border-soa-gold/25">--</td>
                        <td className="p-1 border border-soa-gold/25">--</td>
                      </tr>
                      <tr className="text-center bg-white/5">
                        <td className="p-1 border border-soa-gold/25 font-bold">Маг. Защита</td>
                        <td className="p-1 border border-soa-gold/25">5</td>
                        <td className="p-1 border border-soa-gold/25">14%</td>
                        <td className="p-1 border border-soa-gold/25">25,5%</td>
                        <td className="p-1 border border-soa-gold/25">--</td>
                        <td className="p-1 border border-soa-gold/25">--</td>
                      </tr>
                      <tr className="text-center bg-white/5">
                        <td className="p-1 border border-soa-gold/25 font-bold">Сила воинов</td>
                        <td className="p-1 border border-soa-gold/25">7</td>
                        <td className="p-1 border border-soa-gold/25">19%</td>
                        <td className="p-1 border border-soa-gold/25">34%</td>
                        <td className="p-1 border border-soa-gold/25">--</td>
                        <td className="p-1 border border-soa-gold/25">--</td>
                      </tr>
                      <tr className="text-center bg-white/5">
                        <td className="p-1 border border-soa-gold/25 font-bold">ЖЗН воинов</td>
                        <td className="p-1 border border-soa-gold/25">7</td>
                        <td className="p-1 border border-soa-gold/25">19%</td>
                        <td className="p-1 border border-soa-gold/25">26%</td>
                        <td className="p-1 border border-soa-gold/25">--</td>
                        <td className="p-1 border border-soa-gold/25">--</td>
                      </tr>
                      <tr className="text-center bg-white/5">
                        <td className="p-1 border border-soa-gold/25 font-bold">Урн. солдата</td>
                        <td className="p-1 border border-soa-gold/25">0%</td>
                        <td className="p-1 border border-soa-gold/25">--</td>
                        <td className="p-1 border border-soa-gold/25">--</td>
                        <td className="p-1 border border-soa-gold/25">--</td>
                        <td className="p-1 border border-soa-gold/25">--</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* БЛОК АКТУАЛЬНЫХ КОДОВ */}
            <div className="static-box w-full">
              <h2 className="text-base italic border-b border-[#d45737] pb-2.5 mb-2 font-serif">АКТУАЛЬНЫЕ КОДЫ</h2>
              <div className="text-sm space-y-2 py-1">
                {isValidCode(promoCodes.code1) && (
                  <p className="text-white">
                    1. 🎁 (New) <span className="copy-target text-matrix font-bold cursor-pointer underline decoration-dotted ml-1" onClick={() => handleCopyCode(promoCodes.code1)}>{promoCodes.code1}</span>
                  </p>
                )}
                {isValidCode(promoCodes.code2) && (
                  <p className="text-white">
                    2. 🎁 <span className="copy-target text-matrix font-bold cursor-pointer underline decoration-dotted ml-1" onClick={() => handleCopyCode(promoCodes.code2)}>{promoCodes.code2}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* КОЛОННА: КИБЕР-ВИДЕОАРХИВ */}
           <CyberVideoArchive />



          {/* КОЛОННА 4: ХАКЕРСКИЙ ЧАТ */}
          <div className="battery-widget-container w-full">
            <div className="widget-container w-full max-w-[360px] mx-auto">
              <div className="battery-widget bg-gradient-to-br from-[#14141452] to-[#1a1a1a5c] border-2 border-soa-gold/5 rounded-3xl p-6 overflow-hidden relative min-h-[550px]">
                <div className="text-[10px] text-gold mb-3 flex items-center gap-2 font-mono tracking-wider">
                  <span className="animate-pulse text-matrix">⚡</span> CHATING UNION TERMINAL v2.0
                </div>
                
                <div className="ai-input-container relative w-full bg-[#0505052b] border border-gold rounded p-1 mb-3 shadow-[0_0_10px_rgba(212,175,55,0.2)]">
                  <label className="ai-label absolute -top-2 left-2.5 bg-[#1a1a1a] text-gold text-[9px] px-1.5 z-10">USER_ID</label>
                  <div className="ai-input-inner w-full">
                    <input type="text" className="ai-input w-full bg-transparent border-none text-gold p-2 font-mono text-xs outline-none" placeholder="Identification..." maxLength={15} value={username} onChange={(e) => setUsername(e.target.value)} />
                  </div>
                </div>

                <div id="chat-messages" className="h-[280px] bg-black/20 border border-soa-gold/15 p-3 overflow-y-auto flex flex-col gap-2 rounded-xl text-xs font-mono text-white scroll-smooth">
                  <div className="message-entry p-1"><span className="text-red-500 mr-1">[SYSTEM]</span><b className="text-charging">Terminal:</b> Установка соединения...</div>
                  {messages.map((msg, idx) => (
                    <div key={idx} className="message-entry p-1 rounded hover:bg-soa-gold/10 transition-colors">
                      <b className="text-soa-yellow">{msg.user}:</b> <span className="text-white/90">{msg.text}</span>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>

                <div className="ai-input-container relative w-full bg-[#0505052b] border border-gold rounded p-1 mt-3 shadow-[0_0_10px_rgba(212,175,55,0.2)]">
                  <label className="ai-label absolute -top-2 left-2.5 bg-[#1a1a1a] text-gold text-[9px] px-1.5 z-10">MESSAGE_DATA</label>
                  <div className="ai-input-inner flex items-center w-full">
                    <input type="text" className="ai-input w-full bg-transparent border-none text-gold p-2 font-mono text-xs outline-none" placeholder="Execute command..." autoComplete="off" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} />
                    <button className="ai-button w-10 h-8 bg-matrix/70 border-none rounded-lg text-black font-bold flex items-center justify-center cursor-pointer text-sm hover:bg-matrix transition-all" onClick={sendMessage}>↳</button>
                  </div>
                </div>

                <div className="progress-bar flex gap-1 h-1.5 mt-4 bg-white/5 rounded-full overflow-hidden p-0.5">
                  <div className="segment active flex-1 h-full bg-charging shadow-[0_0_10px_#4ade80] rounded-sm" />
                  <div className="segment active flex-1 h-full bg-charging shadow-[0_0_10px_#4ade80] rounded-sm" />
                  <div className="segment active flex-1 h-full bg-charging shadow-[0_0_10px_#4ade80] rounded-sm" />
                  <div className="segment flex-1 h-full bg-white/10 rounded-sm" />
                  <div className="segment flex-1 h-full bg-white/10 rounded-sm" />
                </div>
              </div>
            </div>
          </div>

          {/* КОЛОННА 5: КОНТАКТЫ ШТАБА */}
          <div className="static-box w-full col-span-1 md:col-span-2 lg:col-span-1 md:mx-auto lg:mx-0">
            <h2 className="text-base italic border-b border-soa-gold pb-2.5 mb-4 font-serif uppercase tracking-widest text-soa-yellow">ШТАБ СОЮЗА</h2>
            <div className="sci-fi-container flex flex-row justify-between gap-2 w-full">
              <a href="https://t.me" target="_blank" rel="noreferrer" className="sci-fi-button flex-1 text-center font-mono py-2 rounded-lg text-[10px] uppercase border border-soa-gold/50 text-soa-yellow bg-black/60 relative overflow-hidden transition-all"><span>👑SON</span></a>
              <a href="https://t.me" target="_blank" rel="noreferrer" className="sci-fi-button flex-1 text-center font-mono py-2 rounded-lg text-[10px] uppercase border border-soa-gold/50 text-soa-yellow bg-black/60 relative overflow-hidden transition-all"><span>🛡ANT</span></a>
              <a href="https://t.me" target="_blank" rel="noreferrer" className="sci-fi-button flex-1 text-center font-mono py-2 rounded-lg text-[10px] uppercase border border-soa-gold/50 text-soa-yellow bg-black/60 relative overflow-hidden transition-all"><span>📢Bot</span></a>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

export default App;