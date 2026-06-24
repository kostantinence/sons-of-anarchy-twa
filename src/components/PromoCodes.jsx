import React from 'react';
import Swal from 'sweetalert2';

const PromoCodes = ({ promoCodes }) => {
  const handleCopyCode = (codeText) => {
    if (!codeText || codeText === "Истек") return;
    
    navigator.clipboard.writeText(codeText)
      .then(() => {
        Swal.fire({
          title: 'Успешно!',
          text: `Код ${codeText} скопирован в буфер обмена`,
          icon: 'success',
          background: '#1a1a1a',
          color: '#ffd11a',
          confirmButtonColor: '#d4af37',
          timer: 2000,
          timerProgressBar: true
        });
      })
      .catch((err) => console.error('Ошибка копирования:', err));
  };

  return (
    <div className="static-box w-full max-w-[360px] mx-auto font-mono bg-gradient-to-br from-[#14141452] to-[#1a1a1a5c] border-2 border-soa-gold/5 rounded-3xl p-5 text-center shadow-[0_0_15px_rgba(212,175,55,0.1)]">
      <h2 className="text-gold border-b border-soa-gold/10 pb-2 mb-3 text-sm tracking-wider font-bold">
        АКТУАЛЬНЫЕ КОДЫ
      </h2>
      <div className="text-left text-xs space-y-2.5 pl-2 text-white/90">
        {promoCodes.code1 && promoCodes.code1 !== "Истек" && (
          <p className="flex items-center gap-1">
            1. 🎁 <span className="text-matrix/90 font-bold">(New)</span>{' '}
            <span 
              className="copy-target cursor-pointer text-gold underline underline-offset-4 hover:text-white transition-colors" 
              onClick={() => handleCopyCode(promoCodes.code1)}
            >
              {promoCodes.code1}
            </span>
          </p>
        )}
        {promoCodes.code2 && promoCodes.code2 !== "Истек" && (
          <p className="flex items-center gap-1">
            2. 🎁{' '}
            <span 
              className="copy-target cursor-pointer text-gold underline underline-offset-4 hover:text-white transition-colors" 
              onClick={() => handleCopyCode(promoCodes.code2)}
            >
              {promoCodes.code2}
            </span>
          </p>
        )}
        {(!promoCodes.code1 || promoCodes.code1 === "Истек") && (!promoCodes.code2 || promoCodes.code2 === "Истек") && (
          <p className="text-center text-gray-500 italic py-2">Нет активных кодов</p>
        )}
      </div>
    </div>
  );
};

export default PromoCodes;