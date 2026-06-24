import React, { useState } from 'react';

const TempleTabs = () => {
  // 1. Состояние активной вкладки
  const [activeTab, setActiveTab] = useState('fire'); // По умолчанию поставил Огонь, как на фото

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
      { name: "ХП", v20: "3,5%", v40: "7,50%", v60: "15%", v80: "28,50%", v100: "--" },
      { name: "Доп. Физ. Защ.", v20: "12", v40: "25,5", v60: "42", v80: "63", v100: "--" },
      { name: "Доп. Маг. Защ.", v20: "12", v40: "25,5", v60: "42", v80: "59", v100: "--" },
      { name: "УРН навыка", v20: "1%", v40: "2,50%", v60: "5%", v80: "7%", v100: "--" },
      { name: "Эффект лечения", v20: "1%", v40: "2,50%", v60: "5%", v80: "7%", v100: "--" },
      { name: "Снижение УРН", v20: "0%", v40: "3%", v60: "5%", v80: "7.5%", v100: "--" },
    ],
    units: [
      { name: "ХП Юнитов", v20: "3,0%", v40: "6,50%", v60: "12%", v80: "24,00%", v100: "--" },
      { name: "Доп. Физ. Защ.", v20: "8", v40: "20,0", v60: "35", v80: "50", v100: "--" },
      { name: "Доп. Маг. Защ.", v20: "8", v40: "20,0", v60: "35", v80: "50", v100: "--" },
      { name: "УРН навыка", v20: "1%", v40: "2,00%", v60: "4%", v80: "6%", v100: "--" },
      { name: "Опыт войск", v20: "5%", v40: "12,00%", v60: "25%", v80: "40%", v100: "--" },
      { name: "Снижение УРН", v20: "0%", v40: "2%", v60: "4%", v80: "6.0%", v100: "--" },
    ]
  };

  return (
    <div className="w-full max-w-[450px] mx-auto font-mono flex flex-col gap-5">
      
      {/* 3.ОТДЕЛЬНЫЕ КНОПКИ-КАПСУЛЫ ВЫШЕ ТАБЛИЦЫ */}
      <div className="flex gap-2 justify-between w-full px-1">
        <button 
          className={`flex-1 text-center py-3 text-[10px] font-bold rounded-xl border transition-all duration-300 cursor-pointer ${
            activeTab === 'machine' 
              ? 'border-[#d4af37c9] bg-[#141414e6] text-[#ffd11a] shadow-[0_0_15px_rgba(212,175,55,0.4)] scale-[1.02]' 
              : 'border-transparent bg-[#14141499] text-gold/50 hover:text-gold hover:bg-[#141414df]'
          }`} 
          onClick={() => setActiveTab('machine')}
        >
          ХРАМ МАШИН
        </button>
        <button 
          className={`flex-1 text-center py-3 text-[10px] font-bold rounded-xl border transition-all duration-300 cursor-pointer ${
            activeTab === 'fire' 
              ? 'border-[#d4af37c9] bg-[#141414e6] text-[#ffd11a] shadow-[0_0_15px_rgba(212,175,55,0.4)] scale-[1.02]' 
              : 'border-transparent bg-[#14141499] text-gold/50 hover:text-gold hover:bg-[#141414df]'
          }`} 
          onClick={() => setActiveTab('fire')}
        >
          ХРАМ ОГНЯ
        </button>
        <button 
          className={`flex-1 text-center py-3 text-[10px] font-bold rounded-xl border transition-all duration-300 cursor-pointer ${
            activeTab === 'units' 
              ? 'border-[#d4af37c9] bg-[#141414e6] text-[#ffd11a] shadow-[0_0_15px_rgba(212,175,55,0.4)] scale-[1.02]' 
              : 'border-transparent bg-[#14141499] text-gold/50 hover:text-gold hover:bg-[#141414df]'
          }`} 
          onClick={() => setActiveTab('units')}
        >
          ХРАМ ЮНИТОВ
        </button>
      </div>

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

export default TempleTabs;