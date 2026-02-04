
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { RainfallRecord } from '../types';
import RainfallChart, { ChartHandle } from './RainfallChart';
import { getQuickTip } from '../services/geminiService';

interface DashboardProps {
  records: RainfallRecord[];
  userLocation?: { lat: number; lng: number };
}

const Dashboard: React.FC<DashboardProps> = ({ records }) => {
  const [tip, setTip] = useState<string | undefined>();
  const [loadingTip, setLoadingTip] = useState(false);
  const chartRef = useRef<ChartHandle>(null);

  const stats = useMemo(() => {
    if (records.length === 0) return { total: 0, average: 0, max: 0, last: 0 };
    const values = records.map(r => r.amount);
    const total = values.reduce((a, b) => a + b, 0);
    return {
      total: total.toFixed(1),
      average: (total / values.length).toFixed(1),
      max: Math.max(...values).toFixed(1),
      last: records[0].amount.toFixed(1)
    };
  }, [records]);

  useEffect(() => {
    if (records.length > 0) {
      setLoadingTip(true);
      getQuickTip(records[0].amount).then(res => {
        setTip(res);
        setLoadingTip(false);
      });
    }
  }, [records]);

  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-slate-400">
        <i className="fas fa-chart-line text-6xl mb-4 opacity-20"></i>
        <p className="font-medium">No hay datos suficientes para mostrar métricas.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Tip Inteligente */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[2rem] p-6 shadow-xl shadow-blue-200 text-white">
        <div className="relative z-10 flex items-start gap-4">
          <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
            <i className={`fas ${loadingTip ? 'fa-spinner fa-spin' : 'fa-bolt-lightning'} text-xl text-yellow-300`}></i>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">Análisis Rápido IA</h4>
            <p className="text-sm md:text-base font-semibold leading-relaxed">
              {loadingTip ? "Consultando tendencias climáticas..." : tip || "Analizando el último registro..."}
            </p>
          </div>
        </div>
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      {/* Grid de Métricas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Última lluvia', val: stats.last, unit: 'mm', icon: 'fa-droplet', color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Acumulado Total', val: stats.total, unit: 'mm', icon: 'fa-cloud-showers-water', color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Promedio Mensual', val: stats.average, unit: 'mm', icon: 'fa-chart-simple', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Récord Máximo', val: stats.max, unit: 'mm', icon: 'fa-circle-up', color: 'text-orange-600', bg: 'bg-orange-50' },
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 ${item.bg} ${item.color} rounded-xl flex items-center justify-center mb-4`}>
              <i className={`fas ${item.icon}`}></i>
            </div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">{item.label}</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-800">{item.val}</span>
              <span className="text-xs font-bold text-slate-300 uppercase">{item.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Gráfico Principal */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-lg font-black text-slate-800">Tendencia de Precipitaciones</h3>
            <p className="text-xs text-slate-400 font-medium">Últimos 10 registros medidos en mm</p>
          </div>
          <div className="hidden sm:flex gap-2">
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span> Intenso
            </span>
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
              <span className="w-2 h-2 rounded-full bg-blue-300"></span> Normal
            </span>
          </div>
        </div>
        <div className="h-[300px] w-full">
          <RainfallChart ref={chartRef} records={records} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
