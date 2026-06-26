import React from 'react';

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
  return (
    <div className="battery-widget-container w-full">
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
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
              />
            </div>
          </div>

          {/* Окно вывода сообщений */}
          <div id="chat-messages" className="h-[280px] bg-black/20 border border-soa-gold/15 p-3 overflow-y-auto flex flex-col gap-2 rounded-xl text-xs font-mono text-white scroll-smooth">
            <div className="message-entry p-1">
              <span className="text-red-500 mr-1">[SYSTEM]</span>
              <b className="text-charging">Terminal:</b> Установка соединения...
            </div>
            {messages.map((msg, idx) => (
              <div key={idx} className="message-entry p-1 rounded hover:bg-soa-gold/10 transition-colors">
                <b className="text-soa-yellow">{msg.user}:</b> <span className="text-white/90">{msg.text}</span>
              </div>
            ))}
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
            <span className="cmd-text text-white" data-cmd="connect-soa-network@latest" />
          </div>

        </div>
      </div>
    </div>
  );
};

export default UnionChat;