import React from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

export default function ReloadPrompt() {
  // Плагин автоматически предоставляет состояние: нужно ли обновить приложение
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('Сервис-воркер союза SON ANT успешно зарегистрирован!');
    },
    onRegisterError(error) {
      console.error('Ошибка регистрации сервис-воркера:', error);
    },
  });

  // Если обновлений нет, компонент ничего не отображает
  if (!needRefresh) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 p-4 rounded-2xl bg-slate-900 border border-cyan-500/40 shadow-2xl backdrop-blur-md max-w-sm animate-bounce">
      <div className="text-xs font-sans text-slate-200 mb-3">
        <span className="font-bold text-cyan-400 block text-sm mb-1">⚡ Обновление союза!</span>
        Доступна новая версия интерфейса. Обновить игру прямо сейчас?
      </div>
      <div className="flex gap-2 justify-end">
        <button
          onClick={() => setNeedRefresh(false)}
          className="px-3 py-1.5 rounded-lg text-[10px] uppercase font-bold text-slate-400 hover:text-white transition-colors"
        >
          Позже
        </button>
        <button
          onClick={() => updateServiceWorker(true)}
          className="px-4 py-1.5 rounded-lg text-[10px] uppercase font-black bg-gradient-to-r from-cyan-500 to-indigo-500 text-black shadow-lg hover:scale-105 active:scale-95 transition-all"
        >
          Обновить
        </button>
      </div>
    </div>
  );
}