
import React, { useState } from 'react';

const LoginModal: React.FC<{ onClose: () => void, onLogin: (p: string) => boolean }> = ({ onClose, onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
      <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-10 text-center shadow-2xl">
        <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl"><i className="fas fa-lock text-2xl"></i></div>
        <h2 className="text-2xl font-black mb-2">Acceso Admin</h2>
        <p className="text-slate-400 text-xs mb-8">Contraseña requerida para modificar datos.</p>
        <form onSubmit={e => { e.preventDefault(); if(!onLogin(password)) { setError(true); setPassword(''); } }}>
          <input type="password" autoFocus placeholder="Contraseña" value={password} onChange={e => { setPassword(e.target.value); setError(false); }} className={`w-full bg-slate-50 border ${error ? 'border-red-500' : 'border-slate-200'} rounded-2xl px-6 py-4 text-center font-bold mb-4 focus:outline-none`} />
          <button type="submit" className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl uppercase text-[10px] tracking-widest shadow-lg shadow-blue-100">Ingresar</button>
          <button type="button" onClick={onClose} className="text-slate-300 text-[10px] font-bold mt-4 hover:text-slate-600">CERRAR</button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
