import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Trash2,
  Edit2,
  Calendar,
  CreditCard,
  ArrowUpDown,
  FileQuestion,
  CheckCircle,
} from 'lucide-react';
import { CATEGORIES, CATEGORY_LIST } from '../data/defaultData';
import { CategoryId, Expense } from '../types/budget';
import { formatCurrency, formatDateSpanish } from '../utils/formatters';
import { CategoryIcon } from './CategoryIcon';

interface ExpenseHistoryProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
  onEditExpense: (expense: Expense) => void;
  selectedCategoryFilter: CategoryId | 'all';
  onSelectCategoryFilter: (category: CategoryId | 'all') => void;
  currencySymbol: string;
  currencyCode: string;
}

export const ExpenseHistory: React.FC<ExpenseHistoryProps> = ({
  expenses,
  onDeleteExpense,
  onEditExpense,
  selectedCategoryFilter,
  onSelectCategoryFilter,
  currencySymbol,
  currencyCode,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'>('date-desc');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Filtered and sorted expenses
  const filteredExpenses = useMemo(() => {
    return expenses
      .filter((exp) => {
        // Category filter
        if (selectedCategoryFilter !== 'all' && exp.category !== selectedCategoryFilter) {
          return false;
        }

        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchDesc = exp.description.toLowerCase().includes(q);
          const matchNotes = exp.notes ? exp.notes.toLowerCase().includes(q) : false;
          const matchCat = CATEGORIES[exp.category]?.name.toLowerCase().includes(q);
          const matchPayment = exp.paymentMethod?.toLowerCase().includes(q);
          if (!matchDesc && !matchNotes && !matchCat && !matchPayment) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'date-desc') {
          return b.date.localeCompare(a.date) || b.createdAt - a.createdAt;
        }
        if (sortBy === 'date-asc') {
          return a.date.localeCompare(b.date) || a.createdAt - b.createdAt;
        }
        if (sortBy === 'amount-desc') {
          return b.amount - a.amount;
        }
        if (sortBy === 'amount-asc') {
          return a.amount - b.amount;
        }
        return 0;
      });
  }, [expenses, selectedCategoryFilter, searchQuery, sortBy]);

  const totalFilteredSum = useMemo(() => {
    return filteredExpenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  }, [filteredExpenses]);

  return (
    <section id="historial" className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900">Historial de Gastos Registrados</h2>
            <span className="text-xs font-mono font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
              {filteredExpenses.length} {filteredExpenses.length === 1 ? 'registro' : 'registros'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Registro cronológico y detallado de compras con acciones de gestión
          </p>
        </div>

        {/* Total filtrado */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Subtotal vista:</span>
          <span className="text-base font-bold font-mono text-slate-900">
            {formatCurrency(totalFilteredSum, currencySymbol, currencyCode)}
          </span>
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="pt-5 pb-4 grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* Input de Búsqueda */}
        <div className="md:col-span-5 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por descripción, notas o pago..."
            className="block w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
          />
        </div>

        {/* Filtro por Categoría */}
        <div className="md:col-span-4">
          <select
            value={selectedCategoryFilter}
            onChange={(e) => onSelectCategoryFilter(e.target.value as CategoryId | 'all')}
            className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-800 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
          >
            <option value="all">Todas las categorías</option>
            {CATEGORY_LIST.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Selector de Orden */}
        <div className="md:col-span-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-800 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
          >
            <option value="date-desc">Fecha: Más recientes primero</option>
            <option value="date-asc">Fecha: Más antiguos primero</option>
            <option value="amount-desc">Monto: Mayor a menor</option>
            <option value="amount-asc">Monto: Menor a mayor</option>
          </select>
        </div>
      </div>

      {/* Lista de Registros / Tabla */}
      {filteredExpenses.length === 0 ? (
        <div className="py-14 text-center border border-dashed border-slate-200 rounded-lg my-2">
          <FileQuestion className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">No se encontraron gastos</p>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {expenses.length === 0
              ? 'Aún no has registrado ningún gasto en este periodo. Utiliza el formulario superior para añadir el primero.'
              : 'Ningún gasto coincide con los criterios de búsqueda o filtro aplicados.'}
          </p>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="mt-3 text-xs font-semibold text-emerald-700 hover:text-emerald-800 underline cursor-pointer"
            >
              Borrar búsqueda
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto -mx-6 sm:mx-0">
          <table className="w-full text-left text-xs text-slate-600 border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-700 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Fecha</th>
                <th className="py-3 px-4">Descripción y Detalles</th>
                <th className="py-3 px-4">Categoría</th>
                <th className="py-3 px-4 hidden sm:table-cell">Método de Pago</th>
                <th className="py-3 px-4 text-right">Monto</th>
                <th className="py-3 px-4 text-center w-24">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredExpenses.map((expense) => {
                const cat = CATEGORIES[expense.category] || CATEGORIES.otros;
                const isConfirmingDelete = deleteConfirmId === expense.id;

                return (
                  <tr
                    key={expense.id}
                    className="hover:bg-slate-50/70 transition-colors group"
                  >
                    {/* Fecha */}
                    <td className="py-3 px-4 whitespace-nowrap text-slate-700 font-mono text-xs">
                      {formatDateSpanish(expense.date)}
                    </td>

                    {/* Descripción y notas */}
                    <td className="py-3 px-4 max-w-xs sm:max-w-md">
                      <div className="font-semibold text-slate-900 text-xs">
                        {expense.description}
                      </div>
                      {expense.notes && (
                        <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1 italic">
                          {expense.notes}
                        </div>
                      )}
                    </td>

                    {/* Categoría (Zero-pill clean typography rule) */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: cat.color }}
                        />
                        <span className="font-medium text-slate-800 text-xs">
                          {cat.name}
                        </span>
                      </div>
                    </td>

                    {/* Método de pago */}
                    <td className="py-3 px-4 whitespace-nowrap hidden sm:table-cell text-slate-500 text-xs">
                      {expense.paymentMethod || 'Efectivo'}
                    </td>

                    {/* Monto (Tabular numerals font-mono) */}
                    <td className="py-3 px-4 text-right whitespace-nowrap font-mono font-bold text-slate-900 text-sm">
                      {formatCurrency(expense.amount, currencySymbol, currencyCode)}
                    </td>

                    {/* Acciones */}
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      {isConfirmingDelete ? (
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              onDeleteExpense(expense.id);
                              setDeleteConfirmId(null);
                            }}
                            className="px-2 py-1 text-[11px] font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-md transition-colors cursor-pointer"
                            title="Confirmar eliminación"
                          >
                            Eliminar
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(null)}
                            className="px-2 py-1 text-[11px] font-medium text-slate-600 bg-slate-200 hover:bg-slate-300 rounded-md transition-colors cursor-pointer"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => onEditExpense(expense)}
                            className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                            title="Editar gasto"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(expense.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                            title="Eliminar gasto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};
