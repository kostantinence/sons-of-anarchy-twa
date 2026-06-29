import React, { useState } from 'react';
import { factionsData } from '../data/heroesData';

export default function GameGuideDashboard() {
  const [selectedHero, setSelectedHero] = useState(null);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [activeSkillIndex, setActiveSkillIndex] = useState(0);
  const [modalTab, setModalTab] = useState('skills'); // 'skills', 'story', 'properties'

  const elements = factionsData.filter(f => f.type === 'element');
  const specials = factionsData.filter(f => f.type === 'special');

  const openHeroModal = (hero) => {
    setSelectedHero(hero);
    setCurrentImgIndex(0);
    setActiveSkillIndex(0);
    setModalTab('skills');
  };

  return (
    <div className="w-full text-slate-100 p-4 rounded-3xl bg-slate-950/40 border border-slate-800/50 backdrop-blur-sm box-border">
      
      <header className="text-center mb-6">
        <h2 className="text-xl md:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 uppercase tracking-widest">
          Детали Сдерживания Героев
        </h2>
      </header>

      {/* Сетка главного экрана */}
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Левая часть: 4 Стихии */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {elements.map((faction) => (
            <div key={faction.id} className={`p-4 rounded-2xl border ${faction.bgLight}`}>
              <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2 uppercase tracking-wider">
                <span className={`w-2.5 h-2.5 rounded bg-gradient-to-br ${faction.color}`} />
                {faction.name}
              </h3>
              <div className="flex flex-wrap gap-3">
                {faction.heroes.length > 0 ? (
                  faction.heroes.map((hero) => (
                    <button
                      key={hero.id}
                      onClick={() => openHeroModal(hero)}
                      className="group relative w-14 h-14 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400 transition-all overflow-hidden active:scale-95"
                    >
                      <img src={hero.icon} alt={hero.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <span className="absolute bottom-0 right-0 bg-black/80 text-[9px] text-yellow-400 px-1 rounded-tl font-mono border-t border-l border-slate-800">
                        {hero.level}
                      </span>
                    </button>
                  ))
                ) : (
                  <span className="text-xs text-slate-600 italic">Герои не добавлены</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Правая часть: Солнце и Луна */}
        <div className="flex flex-col gap-4">
          {specials.map((faction) => (
            <div key={faction.id} className={`p-4 rounded-2xl border ${faction.bgLight}`}>
              <h3 className="text-sm font-bold text-slate-200 mb-3 uppercase tracking-wider flex items-center gap-2">
                <span className="text-xs">{faction.name === 'Солнце' ? '☀️' : '🌙'}</span>
                {faction.name}
              </h3>
              <div className="flex flex-wrap gap-3">
                {faction.heroes.length > 0 ? (
                  faction.heroes.map((hero) => (
                    <button
                      key={hero.id}
                      onClick={() => openHeroModal(hero)}
                      className="group relative w-14 h-14 rounded-full bg-slate-900 border border-slate-700 hover:border-amber-400 transition-all overflow-hidden active:scale-95"
                    >
                      <img src={hero.icon} alt={hero.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </button>
                  ))
                ) : (
                  <span className="text-xs text-slate-600 italic">Герои не добавлены</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* ЖИВАЯ ИГРОВАЯ МОДАЛКА */}
      {selectedHero && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 md:p-4 z-[99999]">
          <div className="bg-slate-900/95 border border-slate-700 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[95vh] md:max-h-[85vh]">
            
            {/* ГАЛЕРЕЯ (Слева) */}
            <div className="w-full md:w-1/2 h-60 md:h-auto bg-black relative flex items-center justify-center border-b md:border-b-0 md:border-r border-slate-800">
              {selectedHero.images && selectedHero.images.length > 0 ? (
                <>
                  <img src={selectedHero.images[currentImgIndex]} alt="Hero Media" className="w-full h-full object-cover" />
                  <button 
                    onClick={() => setCurrentImgIndex(prev => prev === 0 ? selectedHero.images.length - 1 : prev - 1)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-cyan-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg select-none"
                  >
                    ‹
                  </button>
                  <button 
                    onClick={() => setCurrentImgIndex(prev => prev === selectedHero.images.length - 1 ? 0 : prev + 1)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-cyan-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg select-none"
                  >
                    ›
                  </button>
                  <span className="absolute bottom-3 left-3 bg-slate-900/90 px-2 py-0.5 rounded text-xs font-mono text-cyan-400 border border-slate-700">
                    {currentImgIndex + 1} / {selectedHero.images.length}
                  </span>
                </>
              ) : (
                <div className="text-slate-500 text-xs">Нет медиафайлов</div>
              )}
            </div>

            {/* ИНФО-ПАНЕЛЬ (Справа) */}
            <div className="w-full md:w-1/2 p-4 md:p-6 flex flex-col overflow-y-auto">
              {/* Шапка модалки */}
              <div className="flex justify-between items-start border-b border-slate-800 pb-3 mb-4">
                <div>
                  <h2 className="text-xl font-black text-cyan-400 tracking-wide uppercase">{selectedHero.name}</h2>
                  <div className="flex gap-3 text-[10px] font-mono mt-1 text-slate-400">
                    <span>Стихия: {selectedHero.element}</span>
                    <span>Класс: {selectedHero.classType}</span>
                  </div>
                </div>
                <button onClick={() => setSelectedHero(null)} className="text-slate-400 hover:text-white text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-800 select-none">
                  ✕
                </button>
              </div>

              {/* МЕНЮ ВКЛАДОК (Как в игре) */}
              <div className="flex gap-1.5 mb-4 border-b border-slate-800 pb-2 overflow-x-auto scrollbar-none select-none">
                <button 
                  onClick={() => setModalTab('skills')}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${modalTab === 'skills' ? 'bg-cyan-500 text-black font-extrabold shadow-lg' : 'bg-slate-850 text-slate-400'}`}
                >
                  Способности
                </button>
                <button 
                  onClick={() => setModalTab('story')}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${modalTab === 'story' ? 'bg-cyan-500 text-black font-extrabold shadow-lg' : 'bg-slate-850 text-slate-400'}`}
                >
                  История
                </button>
                <button 
                  onClick={() => setModalTab('properties')}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${modalTab === 'properties' ? 'bg-cyan-500 text-black font-extrabold shadow-lg' : 'bg-slate-850 text-slate-400'}`}
                >
                  Макс. свойства
                </button>
              </div>

{/* КОНТЕНТ ВКЛАДКИ: 1. СПОСОБНОСТИ */}
{modalTab === 'skills' && (
  <div className="flex-1 flex flex-col min-h-0">
    {/* Ряд круглых иконок навыков */}
    <div className="flex gap-2 overflow-x-auto pb-3 mb-4 border-b border-slate-800/60 scrollbar-none select-none">
      {selectedHero.skills?.map((skill, index) => (
        <button
          key={index}
          onClick={() => setActiveSkillIndex(index)}
          className={`flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center border-2 text-md transition-all ${
            activeSkillIndex === index ? 'border-cyan-400 bg-cyan-950/40 shadow-lg scale-105' : 'border-slate-700 bg-slate-950'
          }`}
        >
          {skill.icon}
        </button>
      ))}
    </div>

    {/* Спецификации навыка */}
    {selectedHero.skills && selectedHero.skills[activeSkillIndex] ? (
      <div className="space-y-3 font-sans text-xs flex-1">
        <h4 className="text-sm font-bold text-white border-l-2 border-cyan-500 pl-2">
          {selectedHero.skills[activeSkillIndex].name}
        </h4>
        
        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-slate-300 leading-relaxed max-h-[140px] overflow-y-auto font-normal">
          {selectedHero.skills[activeSkillIndex].desc}
        </div>

        {/* Динамические шкалы параметров — ТЕПЕРЬ АВТОМАТИЧЕСКИЕ ДЛЯ ВСЕХ ГЕРОЕВ */}
        <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800 space-y-2 font-mono text-[11px]">
          {selectedHero.skills[activeSkillIndex].fields?.map((field, i) => {
            // Если это поле перезарядки (cooldown), рендерим его с разделительной линией внизу
            if (field.isCooldown) {
              return (
                <div key={i} className="pt-1.5 border-t border-slate-800/60">
                  <span className="text-purple-400 block mb-0.5 font-bold uppercase">{field.label}</span>
                  <span className="text-slate-300">{field.value}</span>
                </div>
              );
            }

            // Стандартный рендер любого игрового параметра
            return (
              <div key={i}>
                <span className="text-amber-400 block mb-0.5 font-bold uppercase">{field.label}</span>
                <span className={`${field.color} break-words`}>{field.value}</span>
              </div>
            );
          })}
        </div>
      </div>
    ) : (
      <div className="text-slate-500 text-center py-6 text-xs">Навыки не заполнены</div>
    )}
  </div>
)}

              {/* КОНТЕНТ ВКЛАДКИ: 2. ИСТОРИЯ */}
              {modalTab === 'story' && (
                <div className="flex-1 overflow-y-auto bg-slate-950/80 p-4 rounded-xl border border-slate-800 text-xs md:text-sm text-slate-300 leading-relaxed whitespace-pre-line max-h-[320px]">
                  {selectedHero.story || "История персонажа засекречена."}
                </div>
              )}

              {/* КОНТЕНТ ВКЛАДКИ: 3. СВОЙСТВА */}
              {modalTab === 'properties' && (
                <div className="flex-1 overflow-hidden rounded-xl border border-slate-800 bg-slate-950/60 font-mono text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                      <tr>
                        <th className="p-2.5 font-semibold">Свойства</th>
                        <th className="p-2.5 font-semibold text-center">Lv.1</th>
                        <th className="p-2.5 font-semibold text-center text-cyan-400">Lv.40</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50 text-slate-200">
                      {selectedHero.properties?.map((prop, i) => (
                        <tr key={i} className="hover:bg-slate-900/40 transition-colors">
                          <td className="p-2.5 font-medium text-slate-300">{prop.name}</td>
                          <td className="p-2.5 text-center text-slate-500">{prop.lv1}</td>
                          <td className="p-2.5 text-center font-bold text-emerald-400">{prop.lv40}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

                <div className="p-4 bg-slate-900 border-t border-slate-800/80 md:p-6 md:pt-0">
              <button
                onClick={() => setSelectedHero(null)}
                className="w-full py-2.5 bg-slate-850 hover:bg-slate-800 text-xs font-bold uppercase tracking-wider rounded-xl transition-all border border-slate-700 hover:border-slate-600 active:scale-[0.98] select-none text-slate-300"
              >
                Назад к сетке
              </button>
                </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}