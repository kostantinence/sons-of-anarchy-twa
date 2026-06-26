import React, { useState } from 'react';
import Swal from 'sweetalert2';

// Добавляем в пропсы logoClass из App.jsx для интеграции пасхалок
const PromoCodes = ({ promoCodes, logoClass }) => {
  // Локальные состояния, чтобы анимировать только ту ячейку, по которой кликнули
  const [copied1, setCopied1] = useState(false);
  const [copied2, setCopied2] = useState(false);

  const handleCopyCode = (codeText, codeNumber) => {
    if (!codeText || codeText === "Истек" || codeText.includes("..")) return;
    
    const WebApp = window.Telegram?.WebApp;

    navigator.clipboard.writeText(codeText)
      .then(() => {
        // Тактильная вибрация Telegram (Успех)
        if (WebApp?.HapticFeedback) {
          WebApp.HapticFeedback.notificationOccurred('success');
        }

        // Включаем старый CSS-эффект зеленой вспышки для конкретной строки
        if (codeNumber === 1) {
          setCopied1(true);
          setTimeout(() => setCopied1(false), 600);
        } else if (codeNumber === 2) {
          setCopied2(true);
          setTimeout(() => setCopied2(false), 600);
        }

        // Вызываем ваш ретро SweetAlert тост
        Swal.fire({
          title: 'УСПЕШНО СКОПИРОВАНО!',
          text: `Код: ${codeText}`,
          icon: 'success',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 1500,
          background: '#121212',
          color: '#ffd11a',
          iconColor: '#d4af37'
        });
      })
      .catch((err) => console.error('Ошибка копирования:', err));
  };

  // Вычисляем визуальные рамки и неоновые тени в зависимости от секретного протокола
  let cardEffectsClass = "border-2 border-soa-gold/5 shadow-[0_0_15px_rgba(212,175,55,0.1)]";
  if (logoClass === 'frozen-text') {
    cardEffectsClass = "border-2 border-[#00f2ff]/40 shadow-[0_0_25px_rgba(0,242,255,0.4)] transition-all duration-1000 animate-[ice-pulse_3s_infinite_alternate]";
  } else if (logoClass === 'hacker-text') {
    cardEffectsClass = "border-2 border-[#ff00ff]/40 shadow-[0_0_25px_rgba(255,0,255,0.4)] transition-all duration-1000 animate-[hack-shake_0.1s_infinite_alternate]";
  }

  return (
    <div className={`static-box w-full max-w-[360px] mx-auto font-mono bg-gradient-to-br from-[#14141452] to-[#1a1a1a5c] rounded-3xl p-5 text-center transition-all duration-500 ${cardEffectsClass}`}>
      
      {/* Заголовок со сменой цвета под Кунг-Фьюри взлом или Зиму */}
      <h2 className={`border-b pb-2 mb-3 text-sm tracking-wider font-bold transition-colors duration-500 ${
        logoClass === 'frozen-text' ? 'text-[#00f2ff] border-[#00f2ff]/20' :
        logoClass === 'hacker-text' ? 'text-[#ff00ff] border-[#ff00ff]/20' :
        'text-gold border-soa-gold/10'
      }`}>
        АКТУАЛЬНЫЕ КОДЫ
      </h2>

      <div className="text-left text-xs space-y-2.5 pl-2 text-white/90">
        
        {/* СТРОКА ПРОМОКОДА 1 */}
        {promoCodes?.code1 && promoCodes.code1 !== "Истек" && promoCodes.code1 !== "null" && promoCodes.code1 !== "undefined" && (
          <p className="flex items-center gap-1">
            1. 🎁 <span className={logoClass === 'hacker-text' ? 'text-[#ff00ff] font-bold' : 'text-green-400 font-bold'}>(New)</span>{' '}
            <span 
              className={`copy-target cursor-pointer font-bold underline underline-offset-4 rounded px-1 transition-all duration-300 ${
                logoClass === 'frozen-text' ? 'text-[#00f2ff] hover:text-white' :
                logoClass === 'hacker-text' ? 'text-[#ff00ff] hover:text-white time-glitch' :
                'text-gold hover:text-white'
              } ${copied1 ? 'is-copied' : ''}`} 
              onClick={() => handleCopyCode(promoCodes.code1, 1)}
            >
              {promoCodes.code1}
            </span>
          </p>
        )}

        {/* СТРОКА ПРОМОКОДА 2 */}
        {promoCodes?.code2 && promoCodes.code2 !== "Истек" && promoCodes.code2 !== "null" && promoCodes.code2 !== "undefined" && (
          <p className="flex items-center gap-1">
            2. 🎁{' '}
            <span 
              className={`copy-target cursor-pointer font-bold underline underline-offset-4 rounded px-1 transition-all duration-300 ${
                logoClass === 'frozen-text' ? 'text-[#00f2ff] hover:text-white' :
                logoClass === 'hacker-text' ? 'text-[#ff00ff] hover:text-white time-glitch' :
                'text-gold hover:text-white'
              } ${copied2 ? 'is-copied' : ''}`} 
              onClick={() => handleCopyCode(promoCodes.code2, 2)}
            >
              {promoCodes.code2}
            </span>
          </p>
        )}

        {/* Заглушка, если промокоды отсутствуют в URL или просрочены */}
        {((!promoCodes?.code1 || promoCodes.code1 === "Истек" || promoCodes.code1 === "null") && 
          (!promoCodes?.code2 || promoCodes.code2 === "Истек" || promoCodes.code2 === "null")) && (
          <p className="text-center text-gray-500 italic py-2 select-none">Нет активных кодов</p>
        )}
      </div>
    </div>
  );
};

export default PromoCodes;