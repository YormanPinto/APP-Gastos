import React from 'react';
import { PieChart, TrendingUp, AlertCircle, ArrowRight } from 'lucide-react';
import { CategoryId, CategorySpending } from '../types/budget';
import { formatCurrency } from '../utils/formatters';
import { CategoryIcon } from './CategoryIcon';

interface MobileCategoryTabProps {
  items: CategorySpending[];
  topCategory: CategorySpending | null;
  currencySymbol: string;
  currencyCode: string;
  totalSpent: number;
  monthlyBudget: number;
  onFilterByCategory: (cat: CategoryId) => void;
}

export const MobileCategoryTab: React.FC<MobileCategoryTabProps> = ({
  items,
  topCategory,
  currencySymbol,
  currencyCode,
  totalSpent,
  monthlyBudget,
  onFilterByCategory,
}) => {
  return (
    <div className="space-y-4">
      {/* 1. Categoría Principal Destacada (Mayor Gasto) */}
      {topCategory ? (
        <div className="bg-slate-900 text-white rounded-3xl p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-start gap-3.5">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-sm"
              style={{ backgroundColor: topCategory.categoryInfo.color }}
            >
              <CategoryIcon
                category={topCategory.category}
                iconName={topCategory.categoryInfo.iconName}
                className="w-6 h-6"
              />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                Rubro con Mayor Gasto
              </span>
              <h3 className="text-base font-bold text-white truncate mt-0.5">
                {topCategory.categoryInfo.name}
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Representa el{' '}
                <strong className="text-emerald-300 font-mono font-bold">
                  {topCategory.percentageOfTotalSpend}%
                </strong>{' '}
                del dinero total gastado en el mes.
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-baseline justify-between">
            <span className="text-xs text-slate-400">Total en esta categoría:</span>
            <span className="text-xl font-black font-mono text-emerald-400">
              {formatCurrency(topCategory.amount, currencySymbol, currencyCode)}
            </span>
          </div>

          <button
            type="button"
            onClick={() => onFilterByCategory(topCategory.category)}
            className="w-full mt-3 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Ver gastos de esta categoría</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center">
          <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-800">Sin datos de categorías</p>
          <p className="text-xs text-slate-500 mt-1">
            Registra tus compras para ver qué categoría consume más dinero.
          </p>
        </div>
      )}

      {/* 2. Desglose de Todas las Categorías */}
      {items.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Desglose por Categoría
            </h4>
            <span className="text-xs font-mono text-slate-500">
              {items.length} activas
            </span>
          </div>

          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.category}
                onClick={() => onFilterByCategory(item.category)}
                className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-100 transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between gap-2 text-xs mb-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0"
                      style={{ backgroundColor: item.categoryInfo.color }}
                    >
                      <CategoryIcon
                        category={item.category}
                        iconName={item.categoryInfo.iconName}
                        className="w-3.5 h-3.5"
                      />
                    </div>
                    <span className="font-bold text-slate-900 truncate">
                      {item.categoryInfo.name}
                    </span>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-mono font-bold text-slate-900 block">
                      {formatCurrency(item.amount, currencySymbol, currencyCode)}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {item.percentageOfTotalSpend}%
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(100, item.percentageOfTotalSpend)}%`,
                      backgroundColor: item.categoryInfo.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
