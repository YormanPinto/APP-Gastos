import React from 'react';
import { Wallet, CreditCard, PiggyBank, AlertTriangle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { TrafficLightResult } from '../types/budget';
import { formatCurrency } from '../utils/formatters';

interface BudgetSummaryCardsProps {
  result: TrafficLightResult;
  currencySymbol: string;
  currencyCode: string;
}

export const BudgetSummaryCards: React.FC<BudgetSummaryCardsProps> = ({
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
  } = result;

  const isExceeded = status === 'exceeded';
  const isWarning = status === 'warning';
  const isHealthy = status === 'healthy';

  return (
    <section id="resumen" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Presupuesto Mensual */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-500">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
            Presupuesto Asignado
          </span>
          <Wallet className="w-4 h-4 text-slate-400" />
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold font-mono text-slate-900 tracking-tight">
            {formatCurrency(monthlyBudget, currencySymbol, currencyCode)}
          </div>
          <p className="text-xs text-slate-500 mt-1">Límite mensual fijado</p>
        </div>
      </div>

      {/* 2. Total Gastado */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-500">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
            Total Gastado
          </span>
          <CreditCard className="w-4 h-4 text-slate-400" />
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold font-mono text-slate-900 tracking-tight">
            {formatCurrency(totalSpent, currencySymbol, currencyCode)}
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
            <span>En compras y pagos</span>
          </div>
        </div>
      </div>

      {/* 3. Dinero Disponible o Monto Excedido */}
      <div
        className={`rounded-xl border p-5 shadow-xs flex flex-col justify-between transition-colors ${
          isExceeded
            ? 'bg-rose-50/70 border-rose-200'
            : isWarning
            ? 'bg-amber-50/50 border-amber-200'
            : 'bg-white border-slate-200'
        }`}
      >
        <div className="flex items-center justify-between">
          <span
            className={`text-xs font-semibold uppercase tracking-wider ${
              isExceeded ? 'text-rose-800' : 'text-slate-600'
            }`}
          >
            {isExceeded ? 'Monto Excedido' : 'Saldo Disponible'}
          </span>
          {isExceeded ? (
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          ) : (
            <PiggyBank className="w-4 h-4 text-emerald-600" />
          )}
        </div>
        <div className="mt-3">
          <div
            className={`text-2xl font-bold font-mono tracking-tight ${
              isExceeded
                ? 'text-rose-700'
                : isWarning
                ? 'text-amber-700'
                : 'text-emerald-700'
            }`}
          >
            {isExceeded
              ? `-${formatCurrency(exceededAmount, currencySymbol, currencyCode)}`
              : formatCurrency(remainingAmount, currencySymbol, currencyCode)}
          </div>
          <p
            className={`text-xs mt-1 ${
              isExceeded ? 'text-rose-700 font-medium' : 'text-slate-500'
            }`}
          >
            {isExceeded
              ? 'Has sobrepasado el presupuesto'
              : 'Remanente para gastar'}
          </p>
        </div>
      </div>

      {/* 4. Porcentaje Consumido */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-500">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
            Nivel de Consumo
          </span>
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              isHealthy
                ? 'bg-emerald-500 ring-2 ring-emerald-200'
                : isWarning
                ? 'bg-amber-400 ring-2 ring-amber-200'
                : 'bg-rose-500 ring-2 ring-rose-200'
            }`}
          />
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <span
              className={`text-2xl font-bold font-mono tracking-tight ${
                isHealthy
                  ? 'text-emerald-600'
                  : isWarning
                  ? 'text-amber-600'
                  : 'text-rose-600'
              }`}
            >
              {percentage.toFixed(1)}%
            </span>
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
            <span>Estado:</span>
            <span
              className={`font-semibold ${
                isHealthy
                  ? 'text-emerald-700'
                  : isWarning
                  ? 'text-amber-700'
                  : 'text-rose-700'
              }`}
            >
              {isHealthy ? 'Saludable' : isWarning ? 'Precaución' : 'Excedido'}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
