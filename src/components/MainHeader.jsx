import React from 'react';

const MainHeader = ({ activeEventIndex, logoClass }) => {
  
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

  // Динамически меняем тень и рамку всей карточки в зависимости от запущенного протокола админа
  let cardEffectsClass = "border-2 border-soa-gold/5 shadow-[0_0_15px_rgba(212,175,55,0.1)]";
  if (logoClass === 'frozen-text') {
    cardEffectsClass = "border-2 border-[#00f2ff]/40 shadow-[0_0_25px_rgba(0,242,255,0.4)] transition-all duration-1000 animate-[ice-pulse_3s_infinite_alternate]";
  } else if (logoClass === 'hacker-text') {
    cardEffectsClass = "border-2 border-[#ff00ff]/40 shadow-[0_0_25px_rgba(255,0,255,0.4)] transition-all duration-1000 animate-[hack-shake_0.1s_infinite_alternate]";
  }

  return (
    <div className={`static-box w-full max-w-[360px] mx-auto bg-gradient-to-br from-[#14141452] to-[#1a1a1a5c] rounded-3xl p-5 font-mono transition-all duration-500 ${cardEffectsClass}`}>
      
      {/* Оригинальный заголовок списка со сменой цвета под хакерский/зимний стиль */}
      <h2 className={`text-base italic border-b pb-2.5 mb-3 font-serif transition-colors duration-500 ${
        logoClass === 'frozen-text' ? 'text-[#00f2ff] border-[#00f2ff]/30' :
        logoClass === 'hacker-text' ? 'text-[#ff00ff] border-[#ff00ff]/30 font-mono' :
        'text-gold border-[#d45737]'
      }`}>
        Порядок двух дневных ивентов
      </h2>
      
      {/* МЫ УБРАЛИ ОГРАНИЧЕНИЕ ПО ВЫСОТЕ И СКРОЛЛ. Теперь все 15 элементов раскрыты полностью */}
      <div className="space-y-1.5 text-left w-full h-auto">
        {events.map((eventText, idx) => {
          
          // Вычисляем стиль для активного (текущего) ивента в зависимости от протоколов
          let activeItemClass = "";
          let prefixIndicator = null;

          if (activeEventIndex === idx) {
            if (logoClass === 'frozen-text') {
              // Особое ледяное выделение с бирюзовым индикатором
              prefixIndicator = <span className="text-[#00f2ff] animate-pulse mr-1">▶</span>;
              activeItemClass = "bg-black/60 font-bold pl-2 text-[#00f2ff] border border-[#00f2ff]/50 shadow-[0_0_15px_rgba(0,242,255,0.5)] scale-[1.02]";
            } else if (logoClass === 'hacker-text') {
              // Особое неоновое хакерское выделение с глитч-индикатором
              prefixIndicator = <span className="text-[#ff00ff] animate-ping mr-1">▶</span>;
              activeItemClass = "bg-black/60 font-bold pl-2 text-[#ff00ff] border border-[#ff00ff]/50 shadow-[0_0_15px_rgba(255,0,255,0.5)] time-glitch scale-[1.02]";
            } else {
              // Особое золотое кибер-выделение для обычного режима страницы
              prefixIndicator = <span className="text-gold animate-bounce inline-block mr-1">▶</span>;
              activeItemClass = "bg-black/60 font-bold pl-2 text-gold border-2 border-gold shadow-[0_0_20px_rgba(212,175,55,0.4)] scale-[1.02]";
            }
          }

          return (
            <div 
              key={idx} 
              className={`text-[13px] leading-snug p-2 rounded-xl transition-all duration-300 flex items-start ${
                activeEventIndex === idx 
                  ? activeItemClass 
                  : 'text-white/80 hover:bg-white/5 border border-transparent'
              }`}
            >
              {/* Показываем стрелочку-индикатор только перед активным элементом */}
              {prefixIndicator}
              <span className="w-full">{eventText}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MainHeader;