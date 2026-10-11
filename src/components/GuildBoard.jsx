import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { getLocalPosts, saveLocalPosts } from '../services/db';

export default function GuildBoard() {
  const [posts, setPosts] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [loading, setLoading] = useState(true);

  // Стейты формы
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('message');
  const [imageBase64, setImageBase64] = useState('');

  // 1. Мониторинг сети, первичная загрузка и REAL-TIME подписка
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Вызываем первичную загрузку постов из базы
    fetchPosts();

    // МАГИЯ REAL-TIME: Подписываемся на любые изменения в таблице 'posts'
    const postsChannel = supabase
      .channel('custom-all-channel') // Имя канала может быть любым
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'posts' }, // Слушаем всё: INSERT, UPDATE, DELETE
        (payload) => {
            // 1. КТО-ТО ДОБАВИЛ ПОСТ (INSERT)
            if (payload.eventType === 'INSERT') {
                setPosts((prevPosts) => {
                    if (prevPosts.some(p => p.id === payload.new.id)) return prevPosts;
                    const updated = [payload.new, ...prevPosts];
                    saveLocalPosts(updated);
                    return updated;
                });
            }
            
            // 2. КТО-ТО УДАЛИЛ ПОСТ (DELETE)
            if (payload.eventType === 'DELETE') {
                setPosts((prevPosts) => {
                    const updated = prevPosts.filter(p => p.id !== payload.old.id);
                    saveLocalPosts(updated);
                    return updated;
                });
            }
            
            // 3. КТО-ТО ПОСТАВИЛ ЛАЙК (UPDATE) — НОВАЯ ЛОГИКА ДЛЯ REAL-TIME ЛАЙКОВ!
            if (payload.eventType === 'UPDATE') {
                setPosts((prevPosts) => {
                    const updated = prevPosts.map(p => p.id === payload.new.id ? payload.new : p);
                    saveLocalPosts(updated);
                    return updated;
                });
            }
        }
      )
      .subscribe();

    // При размонтировании компонента отписываемся от WebSocket-канала
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      supabase.removeChannel(postsChannel);
    };
  }, []);

  // 2. Функция получения данных (Сначала облако, если нет сети — локалка)
  const fetchPosts = async () => {
    setLoading(true);
    if (navigator.onLine) {
      try {
        // GET запрос к Supabase: берем посты, сортируем по id (новые сверху)
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .order('id', { ascending: false });

        if (error) throw error;

        if (data) {
          setPosts(data);
          await saveLocalPosts(data); // Обновляем локальный кэш устройства
        }
      } catch (err) {
        console.error("Ошибка загрузки из Supabase, берем локальные:", err);
        loadBackupData();
      }
    } else {
      loadBackupData();
    }
    setLoading(false);
  };

  const loadBackupData = async () => {
    const localData = await getLocalPosts();
    setPosts(localData);
  };

  // 3. Обработка картинок
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 1.5 * 1024 * 1024) {
      alert("Снимок слишком тяжелый! Пожалуйста, сожмите его до 1.5 МБ.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setImageBase64(reader.result);
    reader.readAsDataURL(file);
  };

  // 4. Публикация записи
  const handleAddPost = async (e) => {
    e.preventDefault();
    if (!title || !content) return;

    const newPostData = {
      type,
      title,
      content,
      image: imageBase64 || null,
      author: 'Оперативник',
      pinned: false
    };

    if (navigator.onLine) {
      try {
        // POST запрос к Supabase: создаем строку в таблице posts
        const { data, error } = await supabase
          .from('posts')
          .insert([newPostData])
          .select();

        if (error) throw error;

        if (data) {
          const updated = [data[0], ...posts];
          setPosts(updated);
          await saveLocalPosts(updated);
        }
      } catch (err) {
        alert("Ошибка отправки в облако. Сохранено локально.");
        saveFallback(newPostData);
      }
    } else {
      saveFallback(newPostData);
    }

    // Сброс формы
    setTitle('');
    setContent('');
    setImageBase64('');
    e.target.reset();
  };

  const saveFallback = async (fallbackData) => {
    const localPost = { ...fallbackData, id: `local-${Date.now()}`, created_at: new Date().toISOString() };
    const updated = [localPost, ...posts];
    setPosts(updated);
    await saveLocalPosts(updated);
  };

  // Функция удаления поста из облака Supabase
const handleDeletePost = async (id) => {
  // На всякий случай спросим подтверждение оперативника
  if (!confirm("УДАЛИТЬ ДАННУЮ ЗАПИСЬ С БОРТОВОЙ ДОСКИ?")) return;

  if (navigator.onLine) {
    try {
      // DELETE запрос к Supabase: удаляем строку по ID
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Локально стейт обновится сам через Real-time WebSocket!
    } catch (err) {
      console.error("Ошибка удаления из облака:", err);
      alert("Не удалось удалить пост из облака.");
    }
  } else {
    // Офлайн режим: удаляем хотя бы локально из памяти устройства
    const updated = posts.filter(post => post.id !== id);
    setPosts(updated);
    await saveLocalPosts(updated);
  }
};

// Функция добавления лайка (PATCH/UPDATE запрос)
const handleLikePost = async (id, currentLikes) => {
  if (!navigator.onLine) {
    alert("ОБНОВЛЕНИЕ РЕАКЦИЙ СБОИТ: ТЕРМИНАЛ ОФЛАЙН");
    return;
  }

  try {
    // UPDATE запрос к Supabase: увеличиваем текущие лайки на 1
    const { error } = await supabase
      .from('posts')
      .update({ likes: (currentLikes || 0) + 1 })
      .eq('id', id);

    if (error) throw error;
    
    // Стейт обновится автоматически у всех через WebSocket (событие UPDATE)!
  } catch (err) {
    console.error("Ошибка при установке лайка:", err);
  }
};

  return (
    <div className="w-full max-w-[1360px] mx-auto p-4 font-mono text-zinc-100">
      {/* Шапка статуса */}
      <div className="flex justify-between items-center border-b border-zinc-800 pb-3 mb-6">
        <span className="text-xs uppercase tracking-widest text-zinc-500">Доска новостей ивентов</span>
        <span className={`text-xs px-2 py-0.5 rounded border ${isOnline ? 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20' : 'text-amber-500 border-amber-500/30 bg-amber-950/20'}`}>
          {isOnline ? 'CLOUD_CONNECTED' : 'OFFLINE_LOCAL_MODE'}
        </span>
      </div>

      {/* Форма */}
      <form onSubmit={handleAddPost} className="mb-8 border border-zinc-800 bg-black/40 p-5 rounded-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input 
            type="text" placeholder="НАЗВАНИЕ МИССИИ / ТЕМА..." value={title} onChange={e => setTitle(e.target.value)} required
            className="border border-zinc-800 bg-zinc-950 p-2.5 text-xs text-white focus:border-amber-500 focus:outline-none uppercase tracking-wider"
          />
          <select 
            value={type} onChange={e => setType(e.target.value)}
            className="border border-zinc-800 bg-zinc-950 p-2.5 text-xs text-zinc-400 focus:border-amber-500 focus:outline-none uppercase"
          >
            <option value="message">💬 СООБЩЕНИЕ СОЮЗА</option>
            <option value="daily">⚔️ ЕЖЕДНЕВНАЯ МИССИЯ</option>
            <option value="event">📅 ГЛОБАЛЬНЫЙ ИВЕНТ</option>
            <option value="reminder">🔔 ВАЖНОЕ НАПОМИНАНИЕ</option>
          </select>
        </div>
        <textarea 
          placeholder="ОПИСАНИЕ ЗАДАЧИ, ЦЕЛИ И НАГРАДЫ..." rows="3" value={content} onChange={e => setContent(e.target.value)} required
          className="w-full border border-zinc-800 bg-zinc-950 p-2.5 text-xs text-white focus:border-amber-500 focus:outline-none mb-4"
        />
        
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          <label className="cursor-pointer text-[11px] text-cyan-400 hover:underline">
            {imageBase64 ? '[ ✓ СНИМОК ПРИКРЕПЛЕН ]' : '[ + ПРИКРЕПЛЕН СНИМОК С УСТРОЙСТВА ]'}
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </label>
          <button type="submit" className="w-full sm:w-auto border border-amber-500 text-amber-400 bg-amber-950/20 px-6 py-2 text-xs font-bold uppercase tracking-widest hover:bg-amber-500 hover:text-black transition-all">
            ЗАФИКСИРОВАТЬ НА ДОСКЕ
          </button>
        </div>
      </form>

      {/* Вывод постов */}
      {loading ? (
        <div className="text-center text-xs text-zinc-500 animate-pulse uppercase tracking-widest">// Считывание протоколов доски...</div>
      ) : (
<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
  {posts.map(post => (
    <div key={post.id} className="border border-zinc-800 bg-zinc-900/10 p-4 rounded-xl flex flex-col justify-between hover:border-zinc-700 transition-all duration-300 relative group shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]">
      
      {/* КНОПКА УДАЛЕНИЯ ПОСТА [ X ] */}
      <button 
        onClick={() => handleDeletePost(post.id)}
        className="absolute top-3 right-3 text-zinc-600 hover:text-red-400 font-bold transition-colors text-xs px-1.5 py-0.5 border border-transparent hover:border-red-500/30 hover:bg-red-950/20 rounded uppercase tracking-tighter"
        title="Удалить запись"
      >
        [ x ]
      </button>

      <div>
        {/* Шапка карточки */}
        <div className="text-[10px] text-zinc-500 flex gap-2 uppercase tracking-wider">
          <span className="text-amber-500/80">{post.type}</span>
          <span>•</span>
          <span>{new Date(post.created_at).toLocaleDateString()}</span>
        </div>

        {/* Заголовок */}
        <h4 className="text-sm font-bold text-white mt-2 uppercase tracking-wide border-b border-zinc-800/60 pb-1 pr-6">
          {post.title}
        </h4>

        {/* Содержимое */}
        <p className="text-xs text-zinc-400 mt-2 whitespace-pre-wrap leading-relaxed">
          {post.content}
        </p>

        {/* Изображение Base64 */}
        {post.image && (
          <div className="mt-3 overflow-hidden rounded border border-zinc-800/80 bg-black/40">
            <img src={post.image} alt="Вложение" className="w-full max-h-44 object-cover hover:scale-105 transition-transform duration-500" />
          </div>
        )}
      </div>

      {/* ПОДВАЛ КАРТОЧКИ: АВТОР И РЕАКЦИИ */}
      <div className="mt-4 pt-2.5 border-t border-zinc-800/40 flex items-center justify-between">
        <span className="text-[9px] text-zinc-500 uppercase tracking-widest">// ОПЕРАТОР: <strong className="text-zinc-400 font-normal">{post.author}</strong></span>
        
        {/* НЕОНОВАЯ КНОПКА КИБЕР-ЛАЙКА */}
        <button 
          onClick={() => handleLikePost(post.id, post.likes)}
          className="flex items-center gap-1.5 text-[10px] text-cyan-400 border border-cyan-500/30 bg-cyan-950/10 hover:bg-cyan-500 hover:text-black px-2.5 py-1 rounded transition-all active:scale-95 tracking-widest font-bold"
        >
          <span>🔥</span>
          <span>{(post.likes || 0)}</span>
        </button>
      </div>

    </div>
  ))}
</div>
      )}
    </div>
  );
}