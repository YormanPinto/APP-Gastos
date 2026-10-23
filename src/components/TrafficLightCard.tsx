import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  TrendingUp,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { TrafficLightResult } from '../types/budget';
import { formatCurrency } from '../utils/formatters';

interface TrafficLightCardProps {
  result: TrafficLightResult;
  currencySymbol: string;
  currencyCode: string;
}

export const TrafficLightCard: React.FC<TrafficLightCardProps> = ({
  result,
  currencySymbol,
  currencyCode,
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

  // Visual state styling
  const isHealthy = status === 'healthy';
  const isWarning = status === 'warning';
  const isExceeded = status === 'exceeded';

  const clampedBarWidth = Math.min(100, Math.max(0, percentage));

  return (
    <section
      id="semaforo"
      aria-label="Panel Semáforo de Presupuesto"
      className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs"
    >
      {/* Header bar */}
      <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Semáforo de Presupuesto en Tiempo Real
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Evaluación continua del porcentaje consumido respecto a tu límite mensual
          </p>
        </div>

        {/* Status text badge with high-contrast accessibility */}
        <div
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider ${
            isHealthy
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : isWarning
              ? 'bg-amber-50 text-amber-800 border border-amber-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {isHealthy && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
          {isWarning && <AlertTriangle className="w-4 h-4 text-amber-600" />}
          {isExceeded && <AlertOctagon className="w-4 h-4 text-rose-600" />}
          <span>{statusTitle}</span>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Columna Izquierda: El Semáforo Físico Visual */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center">
            {/* Chasis del Semáforo */}
            <div className="relative p-3.5 bg-slate-900 rounded-3xl shadow-xl border-2 border-slate-800 flex flex-col items-center gap-3">
              {/* Tornillos/decoración estética sutil */}
              <div className="absolute top-2 left-3 w-1.5 h-1.5 rounded-full bg-slate-700" />
              <div className="absolute top-2 right-3 w-1.5 h-1.5 rounded-full bg-slate-700" />
              <div className="absolute bottom-2 left-3 w-1.5 h-1.5 rounded-full bg-slate-700" />
              <div className="absolute bottom-2 right-3 w-1.5 h-1.5 rounded-full bg-slate-700" />

              {/* LUZ ROJA: Presupuesto Excedido (>= 100%) */}
              <div className="relative flex flex-col items-center group">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isExceeded
                      ? 'bg-rose-500 shadow-[0_0_28px_rgba(244,63,94,0.85)] ring-4 ring-rose-400/50 scale-105'
                      : 'bg-rose-950/70 border border-rose-900/40 opacity-30'
                  }`}
                  role="status"
                  aria-label="Luz roja del semáforo: Presupuesto Excedido"
                >
                  <AlertOctagon
                    className={`w-7 h-7 ${
                      isExceeded ? 'text-white' : 'text-rose-900'
                    }`}
                  />
                </div>
                <span
                  className={`text-[10px] font-mono mt-1 font-semibold ${
                    isExceeded ? 'text-rose-400' : 'text-slate-600'
                  }`}
                >
                  ≥ 100%
                </span>
              </div>

              {/* LUZ AMARILLA: Precaución (70% - 99%) */}
              <div className="relative flex flex-col items-center group">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isWarning
                      ? 'bg-amber-400 shadow-[0_0_28px_rgba(251,191,36,0.85)] ring-4 ring-amber-300/50 scale-105'
                      : 'bg-amber-950/70 border border-amber-900/40 opacity-30'
                  }`}
                  role="status"
                  aria-label="Luz amarilla del semáforo: Precaución"
                >
                  <AlertTriangle
                    className={`w-7 h-7 ${
                      isWarning ? 'text-slate-900' : 'text-amber-900'
                    }`}
                  />
                </div>
                <span
                  className={`text-[10px] font-mono mt-1 font-semibold ${
                    isWarning ? 'text-amber-300' : 'text-slate-600'
                  }`}
                >
                  70% - 99%
                </span>
              </div>

              {/* LUZ VERDE: Saludable (< 70%) */}
              <div className="relative flex flex-col items-center group">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isHealthy
                      ? 'bg-emerald-500 shadow-[0_0_28px_rgba(16,185,129,0.85)] ring-4 ring-emerald-400/50 scale-105'
                      : 'bg-emerald-950/70 border border-emerald-900/40 opacity-30'
                  }`}
                  role="status"
                  aria-label="Luz verde del semáforo: Saludable"
                >
                  <CheckCircle2
                    className={`w-7 h-7 ${
                      isHealthy ? 'text-white' : 'text-emerald-900'
                    }`}
                  />
                </div>
                <span
                  className={`text-[10px] font-mono mt-1 font-semibold ${
                    isHealthy ? 'text-emerald-400' : 'text-slate-600'
                  }`}
                >
                  &lt; 70%
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 mt-2 text-center font-mono">
              Regla de 3 niveles de control
            </p>
          </div>

          {/* Columna Derecha: Métricas y Mensajes de Estado */}
          <div className="lg:col-span-8 flex flex-col justify-center space-y-5">
            {/* Porcentaje y resumen principal */}
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                  Consumo del Presupuesto
                </span>
                <div className="flex items-baseline gap-3 mt-1">
                  <span
                    className={`text-4xl sm:text-5xl font-black font-mono tracking-tight ${
                      isHealthy
                        ? 'text-emerald-600'
                        : isWarning
                        ? 'text-amber-600'
                        : 'text-rose-600'
                    }`}
                  >
                    {percentage.toFixed(1)}%
                  </span>
                  <span className="text-xs font-medium text-slate-500">
                    de {formatCurrency(monthlyBudget, currencySymbol, currencyCode)} asignados
                  </span>
                </div>
              </div>

              <div className="sm:text-right">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                  Total Registrado
                </span>
                <span className="text-xl font-bold font-mono text-slate-900">
                  {formatCurrency(totalSpent, currencySymbol, currencyCode)}
                </span>
              </div>
            </div>

            {/* BARRA DE PROGRESO CON MARCAS DE UMBRAL */}
            <div className="space-y-1.5">
              <div className="relative w-full bg-slate-100 rounded-full h-4 overflow-hidden border border-slate-200">
                {/* Relleno dinámico */}
                <div
                  className={`h-full transition-all duration-500 ease-out rounded-full ${
                    isHealthy
                      ? 'bg-emerald-500'
                      : isWarning
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                  style={{ width: `${clampedBarWidth}%` }}
                />
              </div>

              {/* Indicadores de Umbrales (70% y 100%) */}
              <div className="relative text-[11px] font-mono text-slate-500 pt-1 flex justify-between">
                <span>0%</span>
                <div className="absolute left-[70%] -translate-x-1/2 flex flex-col items-center">
                  <div className="w-0.5 h-2 bg-amber-400 mb-0.5" />
                  <span className="text-amber-700 font-semibold">70% Precaución</span>
                </div>
                <div className="absolute left-[100%] -translate-x-full flex flex-col items-end">
                  <div className="w-0.5 h-2 bg-rose-500 mb-0.5" />
                  <span className="text-rose-700 font-bold">100% Límite</span>
                </div>
              </div>
            </div>

            {/* ALERTA CRÍTICA CUANDO EL PRESUPUESTO ESTÁ EXCEDIDO (Requerimiento explícito: monto exacto) */}
            {isExceeded && (
              <div
                role="alert"
                className="p-4 rounded-xl bg-rose-50 border-2 border-rose-300 flex items-start gap-3.5 shadow-xs"
              >
                <AlertOctagon className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-rose-900">
                    ¡Presupuesto Mensual Excedido!
                  </h3>
                  <p className="text-xs text-rose-800 leading-relaxed">
                    Has superado el límite fijado por un{' '}
                    <strong className="font-extrabold underline decoration-rose-400">
                      monto exacto de{' '}
                      {formatCurrency(exceededAmount, currencySymbol, currencyCode)}
                    </strong>
                    . Se recomienda suspender compras discrecionales para reajustar tus finanzas.
                  </p>
                  <div className="pt-1 text-[11px] font-mono text-rose-700">
                    Total gastado: {formatCurrency(totalSpent, currencySymbol, currencyCode)} / Límite:{' '}
                    {formatCurrency(monthlyBudget, currencySymbol, currencyCode)}
                  </div>
                </div>
              </div>
            )}

            {/* ALERTA DE PRECAUCIÓN (70% - 99%) */}
            {isWarning && (
              <div
                role="status"
                className="p-4 rounded-xl bg-amber-50 border border-amber-300 flex items-start gap-3.5 shadow-xs"
              >
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-amber-900">
                    Alerta de Precaución: Límite cercano
                  </h3>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    Te encuentras en la zona preventiva (entre 70% y 99%). Solo te quedan{' '}
                    <strong className="font-bold">
                      {formatCurrency(remainingAmount, currencySymbol, currencyCode)}
                    </strong>{' '}
                    disponibles para lo que resta del mes.
                  </p>
                </div>
              </div>
            )}

            {/* ESTADO SALUDABLE (< 70%) */}
            {isHealthy && (
              <div
                role="status"
                className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-start gap-3.5 shadow-xs"
              >
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-emerald-900">
                    Estado Saludable: Bajo control
                  </h3>
                  <p className="text-xs text-emerald-800 leading-relaxed">
                    Tus gastos representan menos del 70% de la meta mensual. Cuentas con{' '}
                    <strong className="font-bold">
                      {formatCurrency(remainingAmount, currencySymbol, currencyCode)}
                    </strong>{' '}
                    de saldo favorable disponible.
                  </p>
                </div>
              </div>
            )}

            {/* Criterios normativos visibles del semáforo para total transparencia */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px]">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                <div>
                  <span className="font-semibold text-slate-800 block">&lt; 70%</span>
                  <span className="text-slate-500">Saludable (Verde)</span>
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
                <div>
                  <span className="font-semibold text-slate-800 block">70% - 99%</span>
                  <span className="text-slate-500">Precaución (Amarillo)</span>
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
                <div>
                  <span className="font-semibold text-slate-800 block">≥ 100%</span>
                  <span className="text-slate-500">Excedido (Rojo + Monto)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
