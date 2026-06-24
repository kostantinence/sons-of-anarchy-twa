import React from 'react';

const TerminalWidget = () => {
  return (
    <div className="w-full max-w-[360px] mx-auto p-4 overflow-hidden border border-[#d4af37c9] rounded-xl bg-black/30 backdrop-blur-md relative z-10 my-4 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
      <div className="flex flex-col gap-4 relative z-10 border border-[#525252]/50 rounded-lg overflow-hidden">
        
        {/* Шапка терминала */}
        <div className="flex items-center justify-between min-h-[40px] px-3 bg-[#202425]">
          <p className="flex items-center gap-2 h-10 select-none font-semibold text-[11px] text-[#8e8e8e] font-mono tracking-wider">
            <svg width="16px" height="16px" className="text-[#d4af37]" aria-hidden="true" xmlns="http://w3.org" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth={2} stroke="currentColor" fill="none">
              <path d="M7 15L10 12L7 9M13 15H17M7.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21Z" />
            </svg>
            SOA_ROOT_GATEWAY
          </p>
          <div className="flex items-center justify-center p-1 border border-[#c1c2c5]/20 ml-auto rounded-md bg-[#202425] text-[#8e8e8e] cursor-pointer hover:text-white">
            <svg width="14px" height="14px" aria-hidden="true" xmlns="http://w3.org" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth={2} stroke="currentColor" fill="none">
              <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" />
              <path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" />
            </svg>
          </div>
        </div>

        {/* Тело консоли */}
        <div className="flex flex-col relative rounded-b-lg overflow-x-auto p-4 leading-[19px] text-white bg-black/80 font-mono text-xs whitespace-nowrap">
          <div className="flex flex-row items-center bg-transparent overflow-hidden">
            <span className="text-[#575757] select-none">-&nbsp;</span>
            <span className="text-[#4ade80] font-bold">npx&nbsp;</span>
            <span className="cmd-text" data-cmd="connect-soa-network@latest" />
          </div>
        </div>

      </div>
    </div>
  );
};

export default TerminalWidget;