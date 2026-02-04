
import React, { forwardRef, useImperativeHandle } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts';
import { RainfallRecord } from '../types';

export interface ChartHandle {
  getChartImage: () => Promise<string | null>;
}

const RainfallChart = forwardRef<ChartHandle, { records: RainfallRecord[] }>(({ records }, ref) => {
  // Procesamos los datos para mostrar los últimos 10 registros en orden cronológico
  const data = [...records]
    .slice(0, 10)
    .reverse()
    .map(r => ({
      date: new Date(r.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
      amount: r.amount,
      fullDate: new Date(r.date).toLocaleDateString('es-ES', { dateStyle: 'long' })
    }));

  useImperativeHandle(ref, () => ({
    getChartImage: async () => null // Placeholder para exportación futura
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-white/10 text-xs">
          <p className="font-bold opacity-60 mb-1">{payload[0].payload.fullDate}</p>
          <p className="text-lg font-black text-blue-400">{payload[0].value} mm</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
              <stop offset="100%" stopColor="#2563eb" stopOpacity={0.8} />
            </linearGradient>
            <linearGradient id="barGradientLight" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#93c5fd" stopOpacity={1} />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.8} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} 
          />
          <Tooltip cursor={{ fill: '#f8fafc' }} content={<CustomTooltip />} />
          <Bar 
            dataKey="amount" 
            radius={[6, 6, 0, 0]} 
            barSize={32}
            animationDuration={1500}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.amount > 20 ? 'url(#barGradient)' : 'url(#barGradientLight)'} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
});

export default RainfallChart;
