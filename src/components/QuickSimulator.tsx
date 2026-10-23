import React from 'react';
import { Sliders, Sparkles, Check, AlertTriangle, AlertOctagon } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

interface QuickSimulatorProps {
  monthlyBudget: number;
  currencySymbol: string;
  currencyCode: string;
  onSimulateState: (targetPercent: number) => void;
}

export const QuickSimulator: React.FC<QuickSimulatorProps> = ({
  monthlyBudget,
  currencySymbol,
  currencyCode,
  onSimulateState,
}) => {
  return (
    <div className="bg-slate-900 text-slate-100 rounded-xl p-5 shadow-xs border border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-white">Simulador Rápido de Estados del Semáforo</h3>
        </div>
        <span className="text-xs text-slate-400">
          Haz clic para verificar de inmediato la activación de cada regla condicional
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3.5">
        {/* Simular Saludable (< 70%) */}
        <button
          type="button"
          onClick={() => onSimulateState(50)}
          className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/60 transition-all text-left group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Check className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-white block">
              1. Estado Saludable
            </span>
            <span className="text-[11px] text-slate-400">
              Gasto al 50% ({formatCurrency(monthlyBudget * 0.5, currencySymbol, currencyCode)})
            </span>
          </div>
        </button>

        {/* Simular Precaución (70% - 99%) */}
        <button
          type="button"
          onClick={() => onSimulateState(85)}
          className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-400/60 transition-all text-left group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-white block">
              2. Alerta Precaución
            </span>
            <span className="text-[11px] text-slate-400">
              Gasto al 85% ({formatCurrency(monthlyBudget * 0.85, currencySymbol, currencyCode)})
            </span>
          </div>
        </button>

        {/* Simular Excedido (>= 100%) */}
        <button
          type="button"
          onClick={() => onSimulateState(120)}
          className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-rose-500/60 transition-all text-left group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <AlertOctagon className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-white block">
              3. Presupuesto Excedido
            </span>
            <span className="text-[11px] text-slate-400">
              Gasto al 120% (Excedido por {formatCurrency(monthlyBudget * 0.2, currencySymbol, currencyCode)})
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};
