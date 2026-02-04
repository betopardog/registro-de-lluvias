
import React, { useState, useRef, useEffect } from 'react';
import { RainfallRecord } from '../types';

interface AddRecordModalProps {
  onClose: () => void;
  onSubmit: (record: Omit<RainfallRecord, 'id'> & { id?: string }) => void;
  recordToEdit?: RainfallRecord;
  initialLocation?: { lat: number; lng: number };
}

const AddRecordModal: React.FC<AddRecordModalProps> = ({ onClose, onSubmit, recordToEdit, initialLocation }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [amount, setAmount] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (recordToEdit) {
      setDate(recordToEdit.date);
      setAmount(recordToEdit.amount.toString());
      setNotes(recordToEdit.notes || '');
      setImageUrl(recordToEdit.imageUrl);
    }
  }, [recordToEdit]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImageUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bg-blue-600 p-6 text-white"><h2 className="text-xl font-black">Nuevo Registro</h2></div>
        <form className="p-6 space-y-4 overflow-y-auto" onSubmit={e => {
          e.preventDefault();
          onSubmit({ date, amount: parseFloat(amount), notes, imageUrl, location: initialLocation || { lat: 0, lng: 0 } });
        }}>
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block">Fecha</label>
            <input type="date" required value={date} onChange={e => setDate(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3" />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block">Precipitación (mm)</label>
            <input type="number" step="0.1" required value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3" />
          </div>
          <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center cursor-pointer hover:bg-slate-50">
            <input type="file" ref={fileInputRef} hidden onChange={handleFileChange} />
            {imageUrl ? <img src={imageUrl} className="h-20 mx-auto rounded-lg" /> : <p className="text-xs text-slate-400">Clic para subir imagen oficial</p>}
          </div>
          <textarea placeholder="Notas técnicas..." value={notes} onChange={e => setNotes(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 h-24 resize-none"></textarea>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 bg-slate-100 py-3 rounded-xl font-bold text-slate-600">Cancelar</button>
            <button type="submit" className="flex-1 bg-blue-600 py-3 rounded-xl font-bold text-white shadow-lg">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRecordModal;
