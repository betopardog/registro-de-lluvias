
import React, { useState } from 'react';
import { RainfallRecord } from '../types';

interface HistoryTableProps {
  records: RainfallRecord[];
  onDelete: (id: string) => void;
  onEdit: (record: RainfallRecord) => void;
  isAdmin: boolean;
}

const HistoryTable: React.FC<HistoryTableProps> = ({ records, onDelete, onEdit, isAdmin }) => {
  const [viewing, setViewing] = useState<RainfallRecord | null>(null);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-slate-800">Historial de Lluvias</h2>
        <div className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          {records.length} Registros
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        {records.length === 0 ? (
          <div className="p-20 text-center text-slate-300">No hay datos.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Fecha</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Medida</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {records.map((r) => (
                  <tr key={r.id} className="hover:bg-blue-50/50 transition-colors cursor-pointer" onClick={() => setViewing(r)}>
                    <td className="px-6 py-5 text-sm font-bold text-slate-700">{new Date(r.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</td>
                    <td className="px-6 py-5">
                      <span className="text-lg font-black text-blue-600">{r.amount}</span> <span className="text-[10px] font-bold text-slate-300 uppercase">mm</span>
                    </td>
                    <td className="px-6 py-5 text-right flex justify-end gap-2" onClick={e => e.stopPropagation()}>
                      {isAdmin && (
                        <>
                          <button onClick={() => onEdit(r)} className="text-slate-300 hover:text-blue-600"><i className="fas fa-edit"></i></button>
                          <button onClick={() => onDelete(r.id)} className="text-slate-300 hover:text-red-500"><i className="fas fa-trash-alt"></i></button>
                        </>
                      )}
                      <i className="fas fa-chevron-right text-slate-200 ml-2"></i>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {viewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm" onClick={() => setViewing(null)}>
          <div className="bg-white w-full max-w-lg rounded-3xl p-8 overflow-hidden relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setViewing(null)} className="absolute top-6 right-6 text-slate-300 hover:text-slate-600"><i className="fas fa-times text-xl"></i></button>
            <h3 className="text-xl font-black mb-6">Detalle del Registro</h3>
            <div className="space-y-6">
              <div className="bg-blue-600 p-6 rounded-2xl text-white">
                <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest mb-1">Precipitación</p>
                <p className="text-4xl font-black">{viewing.amount} mm</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Notas</p>
                <p className="text-slate-600 italic">{viewing.notes || "Sin notas técnicas."}</p>
              </div>
              {viewing.imageUrl && <img src={viewing.imageUrl} className="w-full rounded-2xl border border-slate-100 shadow-md" />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryTable;
