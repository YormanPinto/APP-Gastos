import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  ArrowUpRight,
  TrendingUp,
  ShieldCheck,
} from 'lucide-react';
import { TrafficLightResult } from '../types/budget';
import { formatCurrency } from '../utils/formatters';

interface MobileTrafficCardProps {
  result: TrafficLightResult;
  currencySymbol: string;
  currencyCode: string;
  onOpenQuickBudgetEdit?: () => void;
}

export const MobileTrafficCard: React.FC<MobileTrafficCardProps> = ({
  result,
  currencySymbol,
  currencyCode,
  onOpenQuickBudgetEdit,
}) => {
  const {
    status,
    percentage,
    totalSpent,
    monthlyBudget,
    remainingAmount,
    exceededAmount,
    statusTitle,
  } = result;

  const isHealthy = status === 'healthy';
  const isWarning = status === 'warning';
  const isExceeded = status === 'exceeded';

  const clampedWidth = Math.min(100, Math.max(0, percentage));

  return (
    <div className="space-y-4">
      {/* TARJETA PRINCIPAL DEL SEMÁFORO ESTILO APP BANCARIA MÓVIL */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs overflow-hidden relative">
        {/* Top: Cápsula del Semáforo Físico + Badge de Estado */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          {/* El Semáforo Móvil horizontal moderno */}
          <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-full shadow-inner">
            {/* Luz Roja (≥100%) */}
            <div
              className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                isExceeded
                  ? 'bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.9)] ring-2 ring-rose-400/60 scale-110'
                  : 'bg-rose-950/70 opacity-30'
              }`}
              title="Presupuesto Excedido (≥100%)"
            />
            {/* Luz Amarilla (70% - 99%) */}
            <div
              className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                isWarning
                  ? 'bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.9)] ring-2 ring-amber-300/60 scale-110'
                  : 'bg-amber-950/70 opacity-30'
              }`}
              title="Alerta Precaución (70% - 99%)"
            />
            {/* Luz Verde (<70%) */}
            <div
              className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                isHealthy
                  ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.9)] ring-2 ring-emerald-400/60 scale-110'
                  : 'bg-emerald-950/70 opacity-30'
              }`}
              title="Estado Saludable (<70%)"
            />
          </div>

          {/* Badge de Estado con Icono */}
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
              isHealthy
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : isWarning
                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {isHealthy && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
            {isWarning && <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />}
            {isExceeded && <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />}
            <span>{statusTitle}</span>
          </div>
        </div>

        {/* Centro: Métricas principales estilo mobile wallet */}
        <div className="py-4 text-center">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
            {isExceeded ? 'Sobregiro Total' : 'Saldo Disponible'}
          </span>
          <div
            className={`text-3xl sm:text-4xl font-black font-mono tracking-tight mt-0.5 ${
              isExceeded
                ? 'text-rose-600'
                : isWarning
                ? 'text-amber-600'
                : 'text-emerald-600'
            }`}
          >
            {isExceeded
              ? `-${formatCurrency(exceededAmount, currencySymbol, currencyCode)}`
              : formatCurrency(remainingAmount, currencySymbol, currencyCode)}
          </div>

          <div className="flex items-center justify-center gap-2 mt-2">
            <span
              className={`text-sm font-bold font-mono px-2 py-0.5 rounded-md ${
                isHealthy
                  ? 'bg-emerald-50 text-emerald-700'
                  : isWarning
                  ? 'bg-amber-50 text-amber-700'
                  : 'bg-rose-50 text-rose-700'
              }`}
            >
              {percentage.toFixed(1)}% consumido
            </span>
          </div>
        </div>

        {/* Barra de Progreso con Indicadores de 70% y 100% */}
        <div className="pt-1 pb-3 space-y-1.5">
          <div className="relative w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200/80">
            <div
              className={`h-full rounded-full transition-all duration-500 ease-out ${
                isHealthy
                  ? 'bg-emerald-500'
                  : isWarning
                  ? 'bg-amber-500'
                  : 'bg-rose-500'
              }`}
              style={{ width: `${clampedWidth}%` }}
            />
          </div>

          <div className="relative text-[10px] font-mono text-slate-400 flex justify-between px-0.5">
            <span>0%</span>
            <span className="text-amber-600 font-semibold">70% Precaución</span>
            <span className="text-rose-600 font-bold">100% Límite</span>
          </div>
        </div>

        {/* Footer de Tarjeta: Presupuesto fijado vs Total Gastado */}
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">
              Presupuesto Límite
            </span>
            <span className="text-sm font-bold font-mono text-slate-800">
              {formatCurrency(monthlyBudget, currencySymbol, currencyCode)}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-right">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">
              Total Gastado
            </span>
            <span className="text-sm font-bold font-mono text-slate-900">
              {formatCurrency(totalSpent, currencySymbol, currencyCode)}
            </span>
          </div>
        </div>
      </div>

      {/* ALERTA CRÍTICA CUANDO ESTÁ EXCEDIDO (Requerimiento explícito: monto exacto) */}
      {isExceeded && (
        <div
          role="alert"
          className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-900 shadow-xs flex items-start gap-3"
        >
          <AlertOctagon className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-extrabold text-sm text-rose-950">
              ¡Presupuesto Excedido!
            </p>
            <p className="text-rose-800 leading-snug">
              Has sobrepasado el límite por un{' '}
              <strong className="underline decoration-rose-400 font-black">
                monto exacto de {formatCurrency(exceededAmount, currencySymbol, currencyCode)}
              </strong>
              .
            </p>
          </div>
        </div>
      )}

      {/* AVISO DE PRECAUCIÓN */}
      {isWarning && (
        <div
          role="status"
          className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 shadow-xs flex items-center gap-3"
        >
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <p className="text-xs text-amber-800 leading-snug">
            <strong>Zona preventiva:</strong> Te restan solo{' '}
            <strong className="font-mono">
              {formatCurrency(remainingAmount, currencySymbol, currencyCode)}
            </strong>{' '}
            para alcanzar el 100%.
          </p>
        </div>
      )}

      {/* AVISO SALUDABLE */}
      {isHealthy && (
        <div
          role="status"
          className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-emerald-900 shadow-xs flex items-center gap-3"
        >
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <p className="text-xs text-emerald-800 leading-snug">
            <strong>Finanzas saludables:</strong> Tienes{' '}
            <strong className="font-mono">
              {formatCurrency(remainingAmount, currencySymbol, currencyCode)}
            </strong>{' '}
            de margen disponible este mes.
          </p>
        </div>
      )}
    </div>
  );
};
