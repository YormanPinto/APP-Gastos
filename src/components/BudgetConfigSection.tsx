import React, { useState } from 'react';
import { Settings2, RotateCcw, Download, Trash2, Check, ArrowRight } from 'lucide-react';
import { CURRENCIES } from '../data/defaultData';
import { formatCurrency } from '../utils/formatters';

interface BudgetConfigSectionProps {
  monthlyBudget: number;
  onUpdateBudget: (newBudget: number) => void;
  currencySymbol: string;
  currencyCode: string;
  onUpdateCurrency: (symbol: string, code: string) => void;
  selectedMonth: string; // YYYY-MM
  onChangeMonth: (month: string) => void;
  onResetData: () => void;
  onExportCSV: () => void;
  onClearExpenses: () => void;
}

export const BudgetConfigSection: React.FC<BudgetConfigSectionProps> = ({
  monthlyBudget,
  onUpdateBudget,
  currencySymbol,
  currencyCode,
  onUpdateCurrency,
  selectedMonth,
  onChangeMonth,
  onResetData,
  onExportCSV,
  onClearExpenses,
}) => {
  const [inputValue, setInputValue] = useState(monthlyBudget.toString());
  const [savedFeedback, setSavedFeedback] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(inputValue);
    if (!isNaN(parsed) && parsed > 0) {
      onUpdateBudget(parsed);
      setSavedFeedback(true);
      setTimeout(() => setSavedFeedback(false), 2000);
    }
  };

  const handleQuickBudget = (val: number) => {
    setInputValue(val.toString());
    onUpdateBudget(val);
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2000);
  };

  return (
    <section id="presupuesto-config" className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-slate-700" />
            <h2 className="text-lg font-bold text-slate-900">Configuración de Presupuesto Mensual</h2>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Define el límite máximo de gasto que la regla del semáforo evaluará en tiempo real.
          </p>
        </div>

        {/* Action utility toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            title="Descargar registro de gastos en formato CSV para Excel"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar CSV</span>
          </button>

          <button
            type="button"
            onClick={onResetData}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            title="Restaurar gastos y presupuesto de muestra"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar demo</span>
          </button>

          <button
            type="button"
            onClick={onClearExpenses}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-50 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            title="Borrar todos los gastos registrados"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Limpiar registros</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-5">
        {/* Formulario de Presupuesto */}
        <div className="md:col-span-7">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="budget-amount" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Monto del Presupuesto Mensual ({currencyCode})
              </label>
              <div className="relative flex rounded-lg shadow-xs">
                <span className="inline-flex items-center px-4 rounded-l-lg border border-r-0 border-slate-300 bg-slate-50 text-slate-600 font-mono text-sm">
                  {currencySymbol}
                </span>
                <input
                  id="budget-amount"
                  type="number"
                  step="0.01"
                  min="1"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="block w-full min-w-0 flex-1 rounded-none rounded-r-lg border border-slate-300 px-3.5 py-2.5 text-slate-900 font-mono text-base font-semibold focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
                  placeholder="1200.00"
                  required
                />
                <button
                  type="submit"
                  className="ml-3 inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap cursor-pointer shrink-0"
                >
                  {savedFeedback ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>¡Actualizado!</span>
                    </>
                  ) : (
                    <>
                      <span>Actualizar Límite</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Presets rápidos */}
            <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
              <span className="shrink-0 font-medium">Límites rápidos:</span>
              <div className="flex flex-wrap gap-1.5">
                {[600, 1000, 1500, 2500].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleQuickBudget(preset)}
                    className="px-2.5 py-1 text-xs font-mono bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors cursor-pointer"
                  >
                    {formatCurrency(preset, currencySymbol, currencyCode)}
                  </button>
                ))}
              </div>
            </div>
          </form>
        </div>

        {/* Configuración de Moneda y Mes */}
        <div className="md:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t md:border-t-0 md:border-l border-slate-100 md:pl-6 pt-4 md:pt-0">
          <div>
            <label htmlFor="currency-select" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Moneda
            </label>
            <select
              id="currency-select"
              value={currencyCode}
              onChange={(e) => {
                const found = CURRENCIES.find((c) => c.code === e.target.value);
                if (found) {
                  onUpdateCurrency(found.symbol, found.code);
                }
              }}
              className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-800 shadow-xs focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
            >
              {CURRENCIES.map((curr) => (
                <option key={curr.code} value={curr.code}>
                  {curr.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="month-select" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Periodo Mensual
            </label>
            <input
              id="month-select"
              type="month"
              value={selectedMonth}
              onChange={(e) => onChangeMonth(e.target.value)}
              className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-800 shadow-xs focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
