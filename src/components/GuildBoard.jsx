import React, { useState, useEffect } from 'react';
import { getLocalPosts, saveLocalPosts } from '../services/db';

export default function GuildBoard() {
  const [posts, setPosts] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Стейты формы
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('message');
  const [imageBase64, setImageBase64] = useState('');

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const loadData = async () => {
      const localData = await getLocalPosts();
      setPosts(localData);
    };
    loadData();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Файл слишком большой! Максимум 2 МБ.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setImageBase64(reader.result);
    reader.readAsDataURL(file);
  };

  const handleAddPost = async (e) => {
    e.preventDefault();
    if (!title || !content) return;

    const newPost = {
      id: `local-${Date.now()}`,
      type,
      title,
      content,
      image: imageBase64 || null,
      author: 'Оперативник',
      createdAt: new Date().toISOString(),
      pinned: false
    };

    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);
    await saveLocalPosts(updatedPosts);

    setTitle('');
    setContent('');
    setImageBase64('');
    e.target.reset();
  };

  return (
    <div className="w-full max-w-[1360px] mx-auto p-4 font-mono">
      {/* Статус подключения в стиле терминала */}
      <div className="flex justify-between items-center border-b border-zinc-800 pb-3 mb-6">
        <span className="text-xs uppercase tracking-widest text-zinc-500">// СИНХРОНИЗАЦИЯ С СЕТЬЮ</span>
        <span className={`text-xs px-2 py-0.5 rounded border ${isOnline ? 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20' : 'text-amber-500 border-amber-500/30 bg-amber-950/20'}`}>
          {isOnline ? 'ONLINE_CLOUD_ACTIVE' : 'OFFLINE_LOCAL_STORAGE'}
        </span>
      </div>

      {/* Форма добавления */}
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
            [ + ПРИКРЕПИТЬ СНИМОК ЭКРАНА ]
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </label>
          <button type="submit" className="w-full sm:w-auto border border-amber-500 text-amber-400 bg-amber-950/20 px-6 py-2 text-xs font-bold uppercase tracking-widest hover:bg-amber-500 hover:text-black transition-all">
            ЗАФИКСИРОВАТЬ НА ДОСКЕ
          </button>
        </div>
      </form>

      {/* Сетка объявлений */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map(post => (
          <div key={post.id} className="border border-zinc-800 bg-zinc-900/20 p-4 rounded-xl relative flex flex-col justify-between">
            <div>
              <div className="text-[10px] text-zinc-500 flex justify-between uppercase">
                <span>{post.type}</span>
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
              <h4 className="text-sm font-bold text-white mt-2 uppercase tracking-wide border-b border-zinc-800 pb-1">{post.title}</h4>
              <p className="text-xs text-zinc-400 mt-2 whitespace-pre-wrap leading-relaxed">{post.content}</p>
              {post.image && (
                <img src={post.image} alt="Вложение" className="mt-3 w-full max-h-40 object-cover rounded border border-zinc-800" />
              )}
            </div>
            <div className="text-[10px] text-zinc-600 mt-4 text-right">// ID: {post.id}</div>
          </div>
        ))}
      </div>
    </div>
  );
}