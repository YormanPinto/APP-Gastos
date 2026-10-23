import React from 'react';
import { Plus } from 'lucide-react';

interface TopBarProps {
  onOpenNewExpense: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenNewExpense }) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <a
          href="#resumen"
          className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 hover:text-emerald-700 transition-colors"
        >
          SemáforoPresupuesto
        </a>

        {/* Zone 2: 4-5 concise single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <a
            href="#resumen"
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
          >
            Resumen
          </a>
          <a
            href="#semaforo"
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
          >
            Semáforo
          </a>
          <a
            href="#analisis"
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
          >
            Categorías
          </a>
          <a
            href="#historial"
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
          >
            Historial
          </a>
          <a
            href="#presupuesto-config"
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
          >
            Configuración
          </a>
        </nav>

        {/* Zone 3: 1 primary action button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenNewExpense}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 active:bg-emerald-800 transition-colors shadow-xs whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Gasto</span>
          </button>
        </div>
      </div>
    </header>
  );
};
