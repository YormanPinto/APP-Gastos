import React from 'react';
import { ChevronLeft, ChevronRight, LogOut, User } from 'lucide-react';
import { TrafficLightStatus } from '../types/budget';
import { UserProfile } from '../types/auth';

interface MobileTopHeaderProps {
  selectedMonth: string; // YYYY-MM
  onChangeMonth: (month: string) => void;
  status: TrafficLightStatus;
  currentUser?: UserProfile | null;
  onLogout?: () => void;
}

export const MobileTopHeader: React.FC<MobileTopHeaderProps> = ({
  selectedMonth,
  onChangeMonth,
  status,
  currentUser,
  onLogout,
}) => {
  // Format month to Spanish e.g. "Octubre 2026"
  const formatMonthName = (monthStr: string) => {
    try {
      const [year, month] = monthStr.split('-').map(Number);
      const date = new Date(year, month - 1, 1);
      const name = new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' }).format(date);
      return name.charAt(0).toUpperCase() + name.slice(1);
    } catch {
      return monthStr;
    }
  };

  const handlePrevMonth = () => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const date = new Date(year, month - 2, 1);
    const newMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    onChangeMonth(newMonth);
  };

  const handleNextMonth = () => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const date = new Date(year, month, 1);
    const newMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    onChangeMonth(newMonth);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-md sm:max-w-xl mx-auto px-4 h-14 flex items-center justify-between gap-2">
        {/* Logo / Title */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-900 px-2 py-1 rounded-md text-white font-bold text-xs shadow-xs">
            <span
              className={`w-2 h-2 rounded-full ${
                status === 'healthy'
                  ? 'bg-emerald-400'
                  : status === 'warning'
                  ? 'bg-amber-400'
                  : 'bg-rose-500'
              }`}
            />
            <span className="tracking-tight">Semáforo</span>
          </div>
        </div>

        {/* Month Selector Pills */}
        <div className="flex items-center gap-0.5 bg-slate-100/90 rounded-full p-0.5 border border-slate-200/60">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="w-6 h-6 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-white transition-colors cursor-pointer"
            title="Mes anterior"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <span className="text-xs font-semibold text-slate-800 px-2 select-none">
            {formatMonthName(selectedMonth)}
          </span>

          <button
            type="button"
            onClick={handleNextMonth}
            className="w-6 h-6 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-white transition-colors cursor-pointer"
            title="Mes siguiente"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* User profile / Logout Button */}
        {currentUser && (
          <div className="flex items-center gap-1.5">
            <div
              className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center justify-center font-bold text-[11px] shadow-xs"
              title={`${currentUser.name} (${currentUser.email})`}
            >
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                title="Cerrar sesión"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
