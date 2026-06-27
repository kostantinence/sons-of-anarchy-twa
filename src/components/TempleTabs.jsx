import React, { useState, useEffect } from 'react';
import styled from 'styled-components'; // 1. Импорт должен быть сверху

  // 1. Состояние активной вкладки
   // По умолчанию поставил Огонь, как на фото
const TempleTabs = () => {
  const [activeTab, setActiveTab] = useState('fire');
  const [isDay, setIsDay] = useState(false);

  // 2. База данных храмов
  const allTemplesData = {
    machine: [
      { name: "ХП", v20: "3,5%", v40: "7,50%", v60: "15%", v80: "28,50%", v100: "--" },
      { name: "Доп. Физ. Защ.", v20: "12", v40: "25,5", v60: "42", v80: "63", v100: "--" },
      { name: "Доп. Маг. Защ.", v20: "12", v40: "25,5", v60: "42", v80: "59", v100: "--" },
      { name: "УРН навыка", v20: "1%", v40: "2,50%", v60: "5%", v80: "7%", v100: "--" },
      { name: "Эффект лечения", v20: "1%", v40: "2,50%", v60: "5%", v80: "7%", v100: "--" },
      { name: "Снижение УРН", v20: "0%", v40: "3%", v60: "5%", v80: "7.5%", v100: "--" },
    ],
    fire: [
      { name: "Физ. Атака", v20: "--", v40: "6,5%", v60: "14", v80: "25", v100: "40" },
      { name: "Физ. Защита", v20: "--", v40: "6,5", v60: "14", v80: "25", v100: "40" },
      { name: "Маг. Атака", v20: "--", v40: "6,5", v60: "14", v80: "25", v100: "40" },
      { name: "Маг. Защита", v20: "--", v40: "6,5", v60: "14", v80: "25", v100: "40" },
      { name: "УРН навыка", v20: "--", v40: "11%", v60: "18%", v80: "28%", v100: "40%" },
      { name: "Эффект лечения", v20: "0", v40: "11%", v60: "18%", v80: "28%", v100: "40%" },
      { name: "Уклон солдата", v20: "0", v40: "0", v60: "1%", v80: "3%", v100: "5%" },
    ],
    units: [
      { name: "Физ. Атака", v20: "5%", v40: "14%", v60: "25,5%", v80: "--", v100: "--" },
      { name: "Физ. Защита", v20: "5%", v40: "14%", v60: "25,5%", v80: "--", v100: "--" },
      { name: "Маг. Атака", v20: "5%", v40: "14%", v60: "25,5%", v80: "--", v100: "--" },
      { name: "Маг. Защита", v20: "5%", v40: "14%", v60: "25,5%", v80: "--", v100: "--" },
      { name: "Сила воинов", v20: "7%", v40: "19%%", v60: "34%", v80: "--", v100: "--" },
      { name: "ЖЗН воинов", v20: "7%", v40: "19%", v60: "26%", v80: "--", v100: "--" },
      { name: "УРН солдатами", v20: "0%", v40: "--", v60: "--", v80: "--", v100: "--" },
    ]
  };

  return (
    <div className="w-full max-w-[450px] mx-auto font-mono flex flex-col gap-5">
      
      {/* Сюда вставляем Шаг 1 */}
      <StyledWrapper $isDay={isDay}>
        <div className="flex gap-2 justify-between w-full px-1">
          {[
            { id: 'machine', label: 'ХРАМ МАШИН' },
            { id: 'fire', label: 'ХРАМ ОГНЯ' },
            { id: 'units', label: 'ХРАМ ЮНИТОВ' }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`btn-capsule ${isActive ? 'active' : ''}`}
              >
                <div className="effect-wrapper">
                  <p className="btn-text">{tab.label}</p>
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <div key={num} className={`magic-particle particle${num}`}>
                      <div className="sparkle one" />
                      <div className="sparkle two" />
                      <div className="sparkle three" />
                      <div className="sparkle four" />
                    </div>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </StyledWrapper>


      {/* 4. МОНОЛИТНАЯ ТАБЛИЦА С ЗАКРУГЛЕННЫМИ УГЛАМИ */}
      <div className="table-wrapper overflow-hidden w-full bg-gradient-to-br from-[#14141452] to-[#1a1a1a5c] border-2 border-soa-gold/5 rounded-3xl shadow-[0_0_20px_rgba(212,175,55,0.08)]">
        <table className="w-full text-[11px] text-white border-collapse table-fixed">
          <thead>
            <tr className="bg-soa-gold/10 text-gold border-b border-soa-gold/30">
              <th className="py-3 px-1 border-r border-soa-gold/30 text-left pl-3 w-[26%]">Бонусы:</th>
              <th className="py-3 px-1 border-r border-soa-gold/30 text-center w-[14.8%]">20 лвл</th>
              <th className="py-3 px-1 border-r border-soa-gold/30 text-center w-[14.8%]">40 лвл</th>
              <th className="py-3 px-1 border-r border-soa-gold/30 text-center w-[14.8%]">60 лвл</th>
              <th className="py-3 px-1 border-r border-soa-gold/30 text-center w-[14.8%]">80 лвл</th>
              <th className="py-3 px-1 text-center w-[14.8%]">100 лвл</th>
            </tr>
          </thead>
          <tbody>
            {allTemplesData[activeTab].map((row, idx) => (
              <tr 
                key={idx} 
                className={`h-12 text-center border-b border-soa-gold/20 last:border-none hover:bg-soa-gold/5 transition-colors`}
              >
                <td className="py-2.5 px-1 border-r border-soa-gold/20 font-bold text-left pl-3 text-white/90 whitespace-normal leading-tight">
                  {row.name}
                </td>
                <td className="py-2.5 px-1 border-r border-soa-gold/20 font-bold">{row.v20}</td>
                <td className="py-2.5 px-1 border-r border-soa-gold/20 font-bold">{row.v40}</td>
                <td className="py-2.5 px-1 border-r border-soa-gold/20 font-bold">{row.v60}</td>
                <td className="py-2.5 px-1 border-r border-soa-gold/20 font-bold">{row.v80}</td>
                <td className="py-2.5 px-1 font-bold text-white/40">{row.v100}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

const StyledWrapper = styled.div`
  width: 100%;

  .flex {
    display: flex;
  }

  /* Базовая кнопка-капсула */
  .btn-capsule {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    position: relative;
  }

  .effect-wrapper {
    width: 100%;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 12px 0;
  }

  /* Стилизация текста кнопки под общий интерфейс страницы */
  .btn-text {
    font-size: 10px;
    font-weight: bold;
    z-index: 2;
    padding: 8px 6px;
    border-radius: 8px;
    width: 95%;
    text-align: center;
    border: 1px solid;
    transition: all 0.3s ease;
    
    /* Стили по умолчанию (Неактивные кнопки) */
    background: ${props => props.$isDay ? 'rgba(20, 30, 40, 0.6)' : 'rgba(20, 20, 20, 0.6)'};
    border-color: ${props => props.$isDay ? 'rgba(7, 166, 215, 0.2)' : 'rgba(168, 85, 247, 0.2)'};
    color: ${props => props.$isDay ? 'rgba(7, 166, 215, 0.6)' : 'rgba(212, 175, 55, 0.5)'};
  }

  /* ХОВЕР НА НЕАКТИВНУЮ КНОПКУ */
  .btn-capsule:hover .btn-text {
    color: ${props => props.$isDay ? '#07a6d7' : '#ffd11a'};
    background: ${props => props.$isDay ? 'rgba(20, 40, 60, 0.8)' : 'rgba(30, 20, 35, 0.8)'};
    border-color: ${props => props.$isDay ? 'rgba(7, 166, 215, 0.6)' : 'rgba(168, 85, 247, 0.6)'};
  }

  /* АКТИВНАЯ КНОПКА (Выбранный Храм) */
  .btn-capsule.active .btn-text {
    transform: scale(1.02);
    border-color: ${props => props.$isDay ? '#07a6d7' : '#d4af37'};
    background: ${props => props.$isDay ? 'rgba(10, 25, 40, 0.9)' : 'rgba(25, 15, 35, 0.9)'};
    color: ${props => props.$isDay ? '#07a6d7' : '#ffd11a'};
    box-shadow: ${props => props.$isDay ? '0 0 15px rgba(7, 166, 215, 0.6)' : '0 0 15px rgba(168, 85, 247, 0.5)'};
  }

  /* ЦВЕТОЧНЫЙ КОНТЕЙНЕР (Оригинальная сетка из вашего кода) */
  .magic-particle {
    display: grid;
    grid-template-columns: 1em 1em;
    position: absolute;
    transition: grid-template-columns 0.5s ease, opacity 0.4s ease;
    opacity: 0;
    z-index: 1;
    pointer-events: none;
  }

  /* Проявление при наведении и активности */
  .btn-capsule:hover .magic-particle,
  .btn-capsule.active .magic-particle {
    opacity: 1;
  }

  /* Точные координаты позиционирования цветов из вашего кода */
  .particle1 { top: -12px; left: -13px; transform: rotate(5deg); }
  .particle2 { bottom: -5px; left: 8px; transform: rotate(35deg); }
  .particle3 { bottom: -15px; transform: rotate(0deg); }
  .particle4 { top: -14px; transform: rotate(15deg); }
  .particle5 { right: 11px; top: -3px; transform: rotate(25deg); }
  .particle6 { right: -15px; bottom: -15px; transform: rotate(30deg); }

  /* ЛЕПЕСТКИ ЦВЕТОВ (Полное слияние дневных морозных и ночных фиолетовых) */
  .sparkle {
    height: 1em;
    width: 1em;
    border-radius: 40% 70% / 7% 90%;
    z-index: 0;
    transition: width 0.5s ease, height 0.5s ease, background 0.5s ease;

    /* ДНЕМ: Морозно-голубые. НОЧЬЮ: Ваши новые фиолетово-пурпурные */
    background: ${props => props.$isDay ? 'linear-gradient(#07a6d7, #93e0ee)' : 'linear-gradient(#da70d6, violet)'};
    border: 0.5px solid ${props => props.$isDay ? '#96d1ec' : 'purple'};
    box-shadow: ${props => props.$isDay ? '0 0 8px rgba(7, 166, 215, 0.4)' : '0 0 8px rgba(238, 130, 238, 0.4)'};
  }

  /* Повороты лепестков для создания формы цветка */
  .two { transform: rotate(90deg); }
  .three { transform: rotate(270deg); }
  .four { transform: rotate(180deg); }

  /* ИЗМЕНЕНИЯ ПРИ ХОВЕРЕ (Плавное распускание до 1.5em) */
  /* Проявление цветов при наведении и активности (ТОЛЬКО ДНЕМ) */
   /* Проявление цветов при наведении и активности (ТОЛЬКО ДНЕМ) */
  .btn-capsule:hover .magic-particle {
    opacity: ${props => props.$isDay ? '1' : '0'};
    /* Расширяем сетку лепестков только днем */
    grid-template-columns: ${props => props.$isDay ? '1.5em 1.5em' : '1em 1em'};
  }
  
  .btn-capsule.active .magic-particle {
    opacity: ${props => props.$isDay ? '1' : '0'};
  }

  .btn-capsule:hover .magic-particle .sparkle {
    /* Увеличиваем лепестки только днем */
    width: ${props => props.$isDay ? '1.5em' : '1em'};
    height: ${props => props.$isDay ? '1.5em' : '1em'};
    
    /* Усиление цвета при раскрытии */
    background: ${props => props.$isDay ? 'linear-gradient(#0761d7, #93bdee)' : 'linear-gradient(#ba55d3, #ee82ee)'};
    border-color: ${props => props.$isDay ? '#96b4ec' : '#da70d6'};
    box-shadow: ${props => props.$isDay ? '0 0 12px rgba(7, 97, 215, 0.6)' : '0 0 12px rgba(218, 112, 214, 0.7)'};
  }

  /* Бесконечное вращение цветков при наведении (Запускаем ТОЛЬКО ДНЕМ) */
  .btn-capsule:hover div.particle1 { animation: ${props => props.$isDay ? '15s linear infinite running flower1' : 'none'}; }
  .btn-capsule:hover div.particle2 { animation: ${props => props.$isDay ? '13s linear infinite running flower2' : 'none'}; }
  .btn-capsule:hover div.particle3 { animation: ${props => props.$isDay ? '16s linear infinite running flower3' : 'none'}; }
  .btn-capsule:hover div.particle4 { animation: ${props => props.$isDay ? '17s linear infinite running flower4' : 'none'}; }
  .btn-capsule:hover div.particle5 { animation: ${props => props.$isDay ? '20s linear infinite running flower5' : 'none'}; }
  .btn-capsule:hover div.particle6 { animation: ${props => props.$isDay ? '15s linear infinite running flower6' : 'none'}; }

  @keyframes flower1 { 0% { transform: rotate(5deg); } 100% { transform: rotate(365deg); } }
  @keyframes flower2 { 0% { transform: rotate(35deg); } 100% { transform: rotate(-325deg); } }
  @keyframes flower3 { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  @keyframes flower4 { 0% { transform: rotate(15deg); } 100% { transform: rotate(375deg); } }
  @keyframes flower5 { 0% { transform: rotate(25deg); } 100% { transform: rotate(-335deg); } }
  @keyframes flower6 { 0% { transform: rotate(30deg); } 100% { transform: rotate(390deg); } }
`;

export default TempleTabs;