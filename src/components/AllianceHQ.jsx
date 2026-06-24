import React from 'react';

const AllianceHQ = () => {
  return (
    <div className="static-box w-full max-w-[360px] mx-auto font-mono bg-gradient-to-br from-[#14141452] to-[#1a1a1a5c] border-2 border-soa-gold/5 rounded-3xl p-5 text-center shadow-[0_0_15px_rgba(212,175,55,0.1)]">
      <h2 className="text-gold border-b border-soa-gold/10 pb-2 mb-3 text-sm tracking-wider font-bold">
        ШТАБ СОЮЗА
      </h2>
      <div className="sci-fi-container flex gap-2.5 justify-between w-full mt-2">
        <a href="https://t.me" target="_blank" rel="noreferrer" className="sci-fi-button flex-1 text-center py-2.5 text-xs font-bold rounded-xl border border-soa-gold/30 text-gold bg-black/40 hover:bg-soa-gold/20 hover:text-white transition-all duration-300">
          <span>👑SON</span>
        </a>
        <a href="https://t.me" target="_blank" rel="noreferrer" className="sci-fi-button flex-1 text-center py-2.5 text-xs font-bold rounded-xl border border-soa-gold/30 text-gold bg-black/40 hover:bg-soa-gold/20 hover:text-white transition-all duration-300">
          <span>🛡ANT</span>
        </a>
        <a href="https://t.me" target="_blank" rel="noreferrer" className="sci-fi-button flex-1 text-center py-2.5 text-xs font-bold rounded-xl border border-soa-gold/30 text-gold bg-black/40 hover:bg-soa-gold/20 hover:text-white transition-all duration-300">
          <span>📢Bot</span>
        </a>
      </div>
    </div>
  );
};

export default AllianceHQ;