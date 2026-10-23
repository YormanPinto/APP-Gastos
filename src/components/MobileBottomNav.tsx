import React from 'react';
import { Home, PieChart, Plus, ListOrdered, Settings } from 'lucide-react';

export type MobileTab = 'semaforo' | 'categorias' | 'historial' | 'ajustes';

interface MobileBottomNavProps {
  currentTab: MobileTab;
  onSelectTab: (tab: MobileTab) => void;
  onOpenNewExpense: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onSelectTab,
  onOpenNewExpense,
}) => {
  return (
    <nav
      aria-label="Navegación principal móvil"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.04)]"
    >
      <div className="max-w-md sm:max-w-xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Tab 1: Semáforo / Resumen */}
        <button
          type="button"
          onClick={() => onSelectTab('semaforo')}
          className={`flex-1 flex flex-col items-center justify-center py-1 min-h-[48px] transition-colors cursor-pointer ${
            currentTab === 'semaforo'
              ? 'text-emerald-700 font-bold'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1">Semáforo</span>
        </button>

        {/* Tab 2: Categorías */}
        <button
          type="button"
          onClick={() => onSelectTab('categorias')}
          className={`flex-1 flex flex-col items-center justify-center py-1 min-h-[48px] transition-colors cursor-pointer ${
            currentTab === 'categorias'
              ? 'text-emerald-700 font-bold'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <PieChart className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1">Categorías</span>
        </button>

        {/* Botón Central Flotante "+ Gasto" */}
        <div className="flex-1 flex items-center justify-center -mt-5">
          <button
            type="button"
            onClick={onOpenNewExpense}
            className="w-13 h-13 rounded-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 ring-4 ring-white transition-all cursor-pointer"
            title="Registrar nuevo gasto"
            aria-label="Registrar nuevo gasto"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Tab 3: Historial / Movimientos */}
        <button
          type="button"
          onClick={() => onSelectTab('historial')}
          className={`flex-1 flex flex-col items-center justify-center py-1 min-h-[48px] transition-colors cursor-pointer ${
            currentTab === 'historial'
              ? 'text-emerald-700 font-bold'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <ListOrdered className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1">Historial</span>
        </button>

        {/* Tab 4: Ajustes / Presupuesto */}
        <button
          type="button"
          onClick={() => onSelectTab('ajustes')}
          className={`flex-1 flex flex-col items-center justify-center py-1 min-h-[48px] transition-colors cursor-pointer ${
            currentTab === 'ajustes'
              ? 'text-emerald-700 font-bold'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <Settings className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1">Ajustes</span>
        </button>
      </div>
    </nav>
  );
};
