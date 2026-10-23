import React from 'react';
import { PieChart, TrendingUp, AlertCircle, ArrowRight } from 'lucide-react';
import { CategoryId, CategorySpending } from '../types/budget';
import { formatCurrency } from '../utils/formatters';
import { CategoryIcon } from './CategoryIcon';

interface CategoryAnalysisProps {
  items: CategorySpending[];
  topCategory: CategorySpending | null;
  currencySymbol: string;
  currencyCode: string;
  monthlyBudget: number;
  totalSpent: number;
  selectedCategoryFilter: CategoryId | 'all';
  onSelectCategoryFilter: (category: CategoryId | 'all') => void;
}

export const CategoryAnalysis: React.FC<CategoryAnalysisProps> = ({
  items,
  topCategory,
  currencySymbol,
  currencyCode,
  monthlyBudget,
  totalSpent,
  selectedCategoryFilter,
  onSelectCategoryFilter,
}) => {
  return (
    <section id="analisis" className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <PieChart className="w-5 h-5 text-slate-700" />
            <h2 className="text-lg font-bold text-slate-900">Análisis y Distribución por Categoría</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Identifica con precisión qué rubros absorben la mayor proporción de tu presupuesto
          </p>
        </div>

        {selectedCategoryFilter !== 'all' && (
          <button
            type="button"
            onClick={() => onSelectCategoryFilter('all')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 underline cursor-pointer"
          >
            Quitar filtro de categoría (Ver todas)
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="py-12 text-center">
          <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">Sin datos registrados aún</p>
          <p className="text-xs text-slate-500 mt-1">
            Comienza a registrar compras para ver el desglose gráfico y la categoría líder.
          </p>
        </div>
      ) : (
        <div className="space-y-6 pt-5">
          {/* TARJETA DESTACADA: Categoría con Mayor Gasto (Requerimiento explícito) */}
          {topCategory && (
            <div className="p-4 sm:p-5 rounded-xl bg-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-sm">
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs"
                  style={{ backgroundColor: topCategory.categoryInfo.color }}
                >
                  <CategoryIcon category={topCategory.category} className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] uppercase tracking-wider font-bold text-emerald-400">
                      Mayor Impacto Financiero
                    </span>
                    <span className="text-slate-400 text-xs">·</span>
                    <span className="text-xs text-slate-300">
                      {topCategory.count} {topCategory.count === 1 ? 'registro' : 'registros'}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white mt-0.5">
                    {topCategory.categoryInfo.name}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 max-w-xl">
                    Esta categoría concentra el{' '}
                    <strong className="text-emerald-300 font-bold font-mono">
                      {topCategory.percentageOfTotalSpend}%
                    </strong>{' '}
                    de todo el dinero gastado en el mes (
                    <span className="font-mono">
                      {topCategory.percentageOfBudget}% del presupuesto total
                    </span>
                    ).
                  </p>
                </div>
              </div>

              <div className="flex md:flex-col items-baseline md:items-end justify-between border-t md:border-t-0 border-slate-800 pt-3 md:pt-0">
                <span className="text-xs text-slate-400 font-medium">Gasto acumulado:</span>
                <span className="text-2xl font-black font-mono text-emerald-400">
                  {formatCurrency(topCategory.amount, currencySymbol, currencyCode)}
                </span>
                <button
                  type="button"
                  onClick={() => onSelectCategoryFilter(topCategory.category)}
                  className="mt-2 text-xs font-semibold text-white/90 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <span>Filtrar historial</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {/* DESGLOSE Y BARRAS PROPORCIONALES DE TODAS LAS CATEGORÍAS */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Desglose Comparativo de Categorías Activas
            </h4>

            <div className="grid grid-cols-1 gap-3">
              {items.map((item) => {
                const isSelected = selectedCategoryFilter === item.category;

                return (
                  <div
                    key={item.category}
                    onClick={() =>
                      onSelectCategoryFilter(isSelected ? 'all' : item.category)
                    }
                    className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/40 shadow-xs'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/70 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 text-xs mb-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0"
                          style={{ backgroundColor: item.categoryInfo.color }}
                        >
                          <CategoryIcon category={item.category} className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-bold text-slate-900 truncate">
                          {item.categoryInfo.name}
                        </span>
                        <span className="text-slate-400 hidden sm:inline">·</span>
                        <span className="text-slate-500 hidden sm:inline">
                          {item.count} {item.count === 1 ? 'gasto' : 'gastos'}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 shrink-0 text-right">
                        <div className="flex flex-col items-end">
                          <span className="font-mono font-bold text-slate-900 text-sm">
                            {formatCurrency(item.amount, currencySymbol, currencyCode)}
                          </span>
                          <span className="text-[11px] text-slate-500 font-mono">
                            {item.percentageOfTotalSpend}% del total
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Barra de Progreso de la Categoría */}
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(100, item.percentageOfTotalSpend)}%`,
                          backgroundColor: item.categoryInfo.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
