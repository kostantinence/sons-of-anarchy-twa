import React, { useState } from 'react'; // 1. Добавили useState для управления редактированием

const UnionChat = ({ 
  socket,
  username, 
  setUsername, 
  chatInput, 
  setChatInput, 
  messages, 
  sendMessage, 
  chatEndRef 
}) => {

  // 2. НОВЫЕ СТЕНДБАЙ-СТЕЙТЫ ДЛЯ РЕДАКТИРОВАНИЯ
  const [editingId, setEditingId] = useState(null); // Хранит id или idx редактируемого сообщения
  const [editText, setEditText] = useState("");     // Хранит изменяемый текст

   React.useEffect(() => {
   if (chatEndRef && chatEndRef.current) {
     chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
   }
 }, [messages]); // Скроллит автоматически, когда массив сообщений меняется

  // ОРИГИНАЛЬНАЯ ЛОГИКА РАСКРАСКИ НИКНЕЙМОВ
  const getNicknameColor = (user, fromTg) => {
    if (user === "Уточка") return "#00ff00"; 
    if (user === "Kerber") return "#85ff00"; 
    if (fromTg) return "#0088cc";            
    return "#d4af37";                        
  };

  // 3. ФУНКЦИЯ-ОБРАБОТЧИК УДАЛЕНИЯ [X]
  const handleDeleteClick = (msg, idx) => {
    // ВАЖНО: сначала ищем _id (с нижним подчеркиванием) из MongoDB!
    const targetId = msg._id || msg.id || idx; 
    
    if (socket) {
      socket.emit('delete_message', targetId);
    }
    console.log(`📡 Сокет-сигнал удаления отправлен для ID: ${targetId}`);
  };

  // 4. ФУНКЦИЯ СОХРАНЕНИЯ ОТРЕДАКТИРОВАННОГО ТЕКСТА
  const handleSaveEdit = (msg, idx) => {
    // ВАЖНО: здесь тоже сначала вытаскиваем _id из MongoDB
    const targetId = msg._id || msg.id || idx;

    if (!editText.trim()) return;

    if (socket) {
      socket.emit('edit_message', { id: targetId, newText: editText });
    }
    console.log(`📡 Сокет-сигнал редактирования отправлен для ID: ${targetId}`);
    
    setEditingId(null);
    setEditText("");
  };

  return (
  <div className="battery-widget-container w-full animate-[fadeIn_0.4s_ease-out]">
      <div className="widget-container w-full max-w-[360px] mx-auto">
        <div className="battery-widget bg-gradient-to-br from-[#14141452] to-[#1a1a1a5c] border-2 border-soa-gold/5 rounded-3xl p-6 overflow-hidden relative min-h-[550px]">
          
          {/* Заголовок терминала */}
          <div className="text-[10px] text-gold mb-3 flex items-center gap-2 font-mono tracking-wider">
            <span className="animate-pulse text-matrix">⚡</span> CHATING UNION TERMINAL v2.0
          </div>
          
          {/* Поле USER_ID */}
          <div className="ai-input-container relative w-full bg-[#0505052b] border border-gold rounded p-1 mb-3 shadow-[0_0_10px_rgba(212,175,55,0.2)]">
           <label className="ai-label absolute -top-2 left-2.5 bg-[#1a1a1a] text-gold text-[9px] px-1.5 z-10">USER_ID</label>
            <div className="ai-input-inner w-full">
              <input 
               type="text" 
               className="ai-input w-full bg-transparent border-none text-gold p-2 font-mono text-xs outline-none" 
               id="chat-input" 
               placeholder="Identification..." 
               maxLength={15} 
               autoComplete="off" // <--- ДОБАВЬТЕ ЭТУ СТРОКУ
               value={username} 
               onChange={(e) => setUsername(e.target.value)} 
             />
           </div>
          </div>

          {/* Окно вывода сообщений */}
          <div id="chat-messages" className="h-[280px] bg-black/20 border border-soa-gold/15 p-3 overflow-y-auto flex flex-col gap-2 rounded-xl text-xs font-mono text-white scroll-smooth">
            <div className="message-entry p-1">
              <span className="text-red-500 mr-1">[SYSTEM]</span>
              <b className="text-charging">Terminal:</b> Connection established.
            </div>
            
            {messages.map((msg, idx) => {
              const rawDate = msg.date || msg.timestamp || new Date();
              const time = new Date(rawDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              
              // Проверяем: редактируется ли ИМЕННО ЭТО сообщение прямо сейчас?
              const currentId = msg.id || idx;
              const isThisMessageEditing = editingId === currentId;

              // Проверка прав: редактировать/удалять сообщения может только автор (например, "Уточка" может править только свои)
              const isMyMessage = msg.user === username;

              return (
                <div key={idx} className="message-entry p-1 rounded hover:bg-soa-gold/10 transition-colors flex justify-between items-start group">
                  
                  <div className="w-full pr-1">
                    {/* Вывод системного времени */}
                    <span className="text-gray-900 mr-1.5">[{time}]</span> 
                    
                    {/* Покраска имени */}
                    <b style={{ color: getNicknameColor(msg.user, msg.from_tg) }}>
                      {msg.user}:
                    </b>{' '}
                    
                    {/* 5. УСЛОВНЫЙ РЕНДЕРИНГ: ИНПУТ РЕДАКТИРОВАНИЯ ИЛИ ОБЫЧНЫЙ ТЕКСТ */}
                    {isThisMessageEditing ? (
                      <div className="inline-flex gap-1.5 items-center ml-1 w-[70%]">
                        <input 
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(msg, idx)}
                          className="bg-black/80 border border-soa-gold/30 rounded text-gold px-1.5 py-0.5 text-xs outline-none font-mono w-full"
                          autoFocus
                        />
                        <button 
                          onClick={() => handleSaveEdit(msg, idx)}
                          className="text-[10px] text-matrix bg-matrix/10 border border-matrix/30 px-1 rounded hover:bg-matrix hover:text-black font-bold"
                        >
                          ОК
                        </button>
                      </div>
                    ) : (
                      <span className="text-white/95 break-all">{msg.text}</span>
                    )}
                  </div>

                  {/* 6. КНОПКИ УПРАВЛЕНИЯ ПОВЕРХ СТРОКИ (появляются при наведении мыши `group-hover`) */}
                  {isMyMessage && !isThisMessageEditing && (
                    <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-[#141414] px-1 rounded border border-soa-gold/5 shrink-0 ml-1">
                      {/* Кнопка карандаша */}
                      <button 
                        onClick={() => { setEditingId(currentId); setEditText(msg.text); }}
                        className="text-gray-500 hover:text-amber-400 font-mono text-[10px] cursor-pointer"
                        title="Редактировать сообщение"
                      >
                        ✏
                      </button>
                      {/* Кнопка удаления */}
                      <button 
                        onClick={() => handleDeleteClick(msg, idx)}
                        className="text-gray-500 hover:text-red-500 font-mono text-[10px] font-bold cursor-pointer"
                        title="Удалить сообщение"
                      >
                        ✕
                      </button>
                    </div>
                  )}

                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>

          {/* Поле MESSAGE_DATA */}
          <div className="ai-input-container relative w-full bg-[#0505052b] border border-gold rounded p-1 mt-3 shadow-[0_0_10px_rgba(212,175,55,0.2)]">
            <label className="ai-label absolute -top-2 left-2.5 bg-[#1a1a1a] text-gold text-[9px] px-1.5 z-10">MESSAGE_DATA</label>
            <div className="ai-input-inner flex items-center w-full">
              <input 
                type="text" 
                className="ai-input w-full bg-transparent border-none text-gold p-2 font-mono text-xs outline-none" 
                id="chat-input"
                placeholder="Execute command..." 
                autoComplete="off" 
                value={chatInput} 
                onChange={(e) => setChatInput(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()} 
              />
              <button 
                className="ai-button w-10 h-8 bg-matrix/70 border-none rounded-lg text-black font-bold flex items-center justify-center cursor-pointer text-sm hover:bg-matrix transition-all" 
                onClick={sendMessage}
              >
                ↳
              </button>
            </div>
          </div>

          {/* Самопечатающаяся строка npx */}
          <div className="mt-4 pt-2 border-t border-[#d4af37]/10 flex items-center bg-black/40 px-3 py-1.5 rounded font-mono text-[11px] whitespace-nowrap overflow-hidden">
            <span className="text-[#575757] select-none mr-1.5">-</span>
            <span className="text-[#4ade80] font-bold mr-1.5">npx</span>
            <span className="cmd-text text-white" data-cmd="connect-son-ant-network@latest" />
          </div>

        </div>
      </div>
    </div>
  );
};

export default UnionChat;