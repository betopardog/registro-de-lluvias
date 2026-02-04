
import React, { useState, useEffect } from 'react';
import { RainfallRecord, WeatherInsight } from '../types';
import { analyzeRainfallData } from '../services/geminiService';

const AIInsights: React.FC<{ records: RainfallRecord[], userLocation?: { lat: number, lng: number } }> = ({ records, userLocation }) => {
  const [insight, setInsight] = useState<WeatherInsight | null>(null);
  const [loading, setLoading] = useState(false);

  const getInsights = async () => {
    if (records.length === 0) return;
    setLoading(true);
    const result = await analyzeRainfallData(records, userLocation);
    setInsight({ 
      analysis: result.analysis, 
      recommendation: "", 
      sources: result.sources 
    });
    setLoading(false);
  };

  useEffect(() => { 
    if (!insight && records.length > 0) getInsights(); 
  }, [records]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-800">IA Insights</h2>
          <p className="text-xs text-slate-400 font-medium">Análisis climático basado en datos reales</p>
        </div>
        <button 
          onClick={getInsights} 
          disabled={loading} 
          className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-blue-600 text-xs font-bold uppercase tracking-widest hover:bg-slate-50 disabled:opacity-50 transition-all"
        >
          <i className={`fas fa-arrows-rotate mr-2 ${loading ? 'fa-spin' : ''}`}></i>
          {loading ? "Analizando..." : "Refrescar"}
        </button>
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm min-h-[400px] flex flex-col">
        {loading ? (
          <div className="space-y-6 animate-pulse">
            <div className="h-4 bg-slate-100 rounded w-3/4"></div>
            <div className="h-4 bg-slate-100 rounded w-full"></div>
            <div className="h-4 bg-slate-100 rounded w-full"></div>
            <div className="h-4 bg-slate-100 rounded w-5/6"></div>
            <div className="h-4 bg-slate-100 rounded w-1/2"></div>
            <div className="mt-12 h-20 bg-slate-50 rounded-2xl"></div>
          </div>
        ) : (
          <>
            <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-line flex-1">
              {insight?.analysis || (
                <div className="flex flex-col items-center justify-center h-full text-slate-300 py-20">
                  <i className="fas fa-brain text-4xl mb-4"></i>
                  <p>No hay datos suficientes para generar un análisis detallado.</p>
                </div>
              )}
            </div>

            {insight?.sources && insight.sources.length > 0 && (
              <div className="mt-12 pt-8 border-t border-slate-100">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                  <i className="fas fa-earth-americas"></i> Fuentes consultadas vía Google Search
                </p>
                <div className="flex flex-wrap gap-2">
                  {insight.sources.map((source, idx) => (
                    <a 
                      key={idx}
                      href={source.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-200 px-3 py-2 rounded-lg text-[11px] font-medium text-slate-600 hover:text-blue-600 transition-all flex items-center gap-2"
                    >
                      <i className="fas fa-link text-[9px] opacity-40"></i>
                      {source.title}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 flex items-start gap-4">
        <div className="bg-blue-600 text-white p-3 rounded-2xl shadow-lg shadow-blue-100">
          <i className="fas fa-circle-info"></i>
        </div>
        <div>
          <p className="text-xs font-bold text-blue-900 mb-1">Nota sobre IA</p>
          <p className="text-[11px] text-blue-700/80 leading-relaxed">
            Este análisis se genera combinando tus datos locales con información climática global en tiempo real. Siempre verifica las condiciones locales con fuentes oficiales de protección civil.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIInsights;
