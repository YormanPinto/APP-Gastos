import React, { useState, useMemo } from 'react';
import { Search, Trash2, Edit2, Plus, Calendar, Tag, AlertCircle } from 'lucide-react';
import { CATEGORIES, CATEGORY_LIST } from '../data/defaultData';
import { CategoryId, CategoryInfo, Expense } from '../types/budget';
import { formatCurrency, formatDateSpanish } from '../utils/formatters';
import { CategoryIcon } from './CategoryIcon';

interface MobileExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
  onEditExpense: (expense: Expense) => void;
  onOpenNewExpense: () => void;
  selectedCategory: CategoryId | 'all';
  onSelectCategory: (cat: CategoryId | 'all') => void;
  currencySymbol: string;
  currencyCode: string;
  categories?: CategoryInfo[];
  categoriesMap?: Record<string, CategoryInfo>;
}

export const MobileExpenseList: React.FC<MobileExpenseListProps> = ({
  expenses,
  onDeleteExpense,
  onEditExpense,
  onOpenNewExpense,
  selectedCategory,
  onSelectCategory,
  currencySymbol,
  currencyCode,
  categories = CATEGORY_LIST,
  categoriesMap = CATEGORIES,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return expenses
      .filter((exp) => {
        if (selectedCategory !== 'all' && exp.category !== selectedCategory) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchDesc = exp.description.toLowerCase().includes(q);
          const matchNotes = exp.notes?.toLowerCase().includes(q);
          const catInfo = categoriesMap[exp.category] || CATEGORIES[exp.category];
          const matchCat = catInfo?.name.toLowerCase().includes(q);
          if (!matchDesc && !matchNotes && !matchCat) return false;
        }
        return true;
      })
      .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt);
  }, [expenses, selectedCategory, searchQuery, categoriesMap]);

  return (
    <div className="space-y-3">
      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          placeholder="Buscar compras o gastos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none shadow-xs"
        />
      </div>

      {/* Horizontal Category Filter Pills (Scrollable) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
        <button
          type="button"
          onClick={() => onSelectCategory('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
            selectedCategory === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          Todos ({expenses.length})
        </button>
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const count = expenses.filter((e) => e.category === cat.id).length;
          if (count === 0 && selectedCategory !== cat.id) return null;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(isSelected ? 'all' : cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 ${
                isSelected
                  ? 'bg-slate-900 text-white font-bold shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: cat.color }}
              />
              <span>{cat.name.split(' ')[0]}</span>
              <span className="opacity-70 font-mono text-[10px]">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Expense List Feed */}
      {filtered.length === 0 ? (
        <div className="py-12 bg-white rounded-3xl border border-slate-200/90 text-center p-6 space-y-3 shadow-xs">
          <AlertCircle className="w-8 h-8 text-slate-300 mx-auto" />
          <div>
            <p className="text-sm font-bold text-slate-800">No hay gastos registrados</p>
            <p className="text-xs text-slate-500 mt-0.5">
              {searchQuery
                ? 'No se encontraron gastos con esa búsqueda'
                : 'Empieza registrando tu primera compra del mes'}
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenNewExpense}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Registrar Gasto</span>
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/90 divide-y divide-slate-100 shadow-xs overflow-hidden">
          {filtered.map((item) => {
            const cat =
              categoriesMap[item.category] ||
              CATEGORIES[item.category] || {
                id: item.category,
                name: item.category,
                color: '#475569',
                bgLight: '#f1f5f9',
                textColor: '#334155',
                iconName: 'Receipt',
              };
            const isDeleting = confirmDeleteId === item.id;

            return (
              <div
                key={item.id}
                className="p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors"
              >
                {/* Left: Category Icon Avatar */}
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-xs"
                  style={{ backgroundColor: cat.color }}
                >
                  <CategoryIcon category={item.category} iconName={cat.iconName} className="w-5 h-5" />
                </div>

                {/* Center: Details */}
                <div className="flex-1 min-w-0 pr-2">
                  <div className="flex items-baseline justify-between gap-2">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                      {item.description}
                    </h4>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                    <span>{formatDateSpanish(item.date)}</span>
                    <span>·</span>
                    <span className="truncate">{cat.name.split(' ')[0]}</span>
                    {item.paymentMethod && (
                      <>
                        <span className="hidden xs:inline">·</span>
                        <span className="hidden xs:inline truncate text-slate-400">
                          {item.paymentMethod}
                        </span>
                      </>
                    )}
                  </div>
                  {item.notes && (
                    <p className="text-[10px] text-slate-400 italic line-clamp-1 mt-0.5">
                      {item.notes}
                    </p>
                  )}
                </div>

                {/* Right: Amount & Actions */}
                <div className="flex flex-col items-end shrink-0">
                  <span className="text-sm sm:text-base font-extrabold font-mono text-slate-900">
                    {formatCurrency(item.amount, currencySymbol, currencyCode)}
                  </span>

                  {/* Actions Bar */}
                  <div className="flex items-center gap-1 mt-1">
                    {isDeleting ? (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            onDeleteExpense(item.id);
                            setConfirmDeleteId(null);
                          }}
                          className="px-2 py-0.5 text-[10px] font-bold text-white bg-rose-600 rounded-md"
                        >
                          Borrar
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(null)}
                          className="px-2 py-0.5 text-[10px] text-slate-600 bg-slate-200 rounded-md"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => onEditExpense(item)}
                          className="p-1 text-slate-400 hover:text-slate-800 transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(item.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
