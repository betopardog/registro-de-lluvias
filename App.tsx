
import React, { useState, useEffect } from 'react';
import { RainfallRecord, ViewType } from './types';
import Dashboard from './components/Dashboard';
import HistoryTable from './components/HistoryTable';
import AIInsights from './components/AIInsights';
import AddRecordModal from './components/AddRecordModal';
import LoginModal from './components/LoginModal';

const App: React.FC = () => {
  const [records, setRecords] = useState<RainfallRecord[]>([]);
  const [activeView, setActiveView] = useState<ViewType>('history');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingRecord, setEditingRecord] = useState<RainfallRecord | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | undefined>();

  useEffect(() => {
    const savedRecords = localStorage.getItem('pluvio_records');
    if (savedRecords) setRecords(JSON.parse(savedRecords));
    const savedAuth = sessionStorage.getItem('pluvio_admin');
    if (savedAuth === 'true') setIsAdmin(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.warn("Geolocation error", err)
      );
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('pluvio_records', JSON.stringify(records));
  }, [records]);

  const saveRecord = (recordData: Omit<RainfallRecord, 'id'> & { id?: string }) => {
    if (!isAdmin) return;
    if (recordData.id) {
      setRecords(prev => prev.map(r => r.id === recordData.id ? (recordData as RainfallRecord) : r));
    } else {
      const recordWithId: RainfallRecord = {
        ...recordData,
        id: Math.random().toString(36).substr(2, 9),
      } as RainfallRecord;
      setRecords(prev => [recordWithId, ...prev]);
    }
    setIsModalOpen(false);
    setEditingRecord(null);
  };

  const deleteRecord = (id: string) => {
    if (!isAdmin) return;
    if (window.confirm('¿Borrar registro permanentemente?')) {
      setRecords(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleEdit = (record: RainfallRecord) => {
    setEditingRecord(record);
    setIsModalOpen(true);
  };

  const handleLogin = (password: string) => {
    if (password === 'admin123') {
      setIsAdmin(true);
      sessionStorage.setItem('pluvio_admin', 'true');
      setIsLoginModalOpen(false);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem('pluvio_admin');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 pb-24">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2.5 rounded-2xl text-white shadow-lg">
              <i className="fas fa-cloud-showers-heavy text-xl"></i>
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-800 leading-none">Registro de <span className="text-blue-600">Lluvias</span></h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                {isAdmin ? 'Administrador' : 'Consulta Pública'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isAdmin ? (
              <>
                <button onClick={() => { setEditingRecord(null); setIsModalOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2">
                  <i className="fas fa-plus"></i>
                  <span>Nuevo</span>
                </button>
                <button onClick={handleLogout} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-red-500 rounded-xl transition-all">
                  <i className="fas fa-sign-out-alt"></i>
                </button>
              </>
            ) : (
              <button onClick={() => setIsLoginModalOpen(true)} className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2">
                <i className="fas fa-user-shield"></i>
                <span>Acceso</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full p-4 md:p-6">
        {activeView === 'history' && <HistoryTable records={records} onDelete={deleteRecord} onEdit={handleEdit} isAdmin={isAdmin} />}
        {activeView === 'dashboard' && <Dashboard records={records} userLocation={userLocation} />}
        {activeView === 'ai-chat' && <AIInsights records={records} userLocation={userLocation} />}
      </main>

      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-xl px-6 py-4 rounded-[2rem] shadow-2xl flex gap-8 md:gap-12 items-center z-40 border border-white/10">
        {[
          { id: 'history', icon: 'fa-list-ul', label: 'Historial' },
          { id: 'dashboard', icon: 'fa-chart-pie', label: 'Dashboards' },
          { id: 'ai-chat', icon: 'fa-wand-magic-sparkles', label: 'IA Insights' },
        ].map((item) => (
          <button 
            key={item.id} 
            onClick={() => setActiveView(item.id as ViewType)} 
            className={`flex flex-col items-center gap-1.5 transition-all duration-300 min-w-[80px] relative ${activeView === item.id ? 'text-blue-400 scale-110' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <i className={`fas ${item.icon} text-lg`}></i>
            <span className="text-[9px] font-bold uppercase tracking-wider whitespace-nowrap">{item.label}</span>
            {activeView === item.id && <span className="w-1 h-1 rounded-full bg-blue-400 absolute -bottom-1"></span>}
          </button>
        ))}
      </nav>

      {isModalOpen && <AddRecordModal onClose={() => setIsModalOpen(false)} onSubmit={saveRecord} recordToEdit={editingRecord || undefined} initialLocation={userLocation} />}
      {isLoginModalOpen && <LoginModal onClose={() => setIsLoginModalOpen(false)} onLogin={handleLogin} />}
    </div>
  );
};

export default App;
