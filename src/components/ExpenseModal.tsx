import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { CATEGORY_LIST, PAYMENT_METHODS } from '../data/defaultData';
import { CategoryId, CategoryInfo, Expense } from '../types/budget';
import { CategoryIcon } from './CategoryIcon';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
  onUpdateExpense?: (expense: Expense) => void;
  editingExpense?: Expense | null;
  currencySymbol: string;
  currencyCode: string;
  categories?: CategoryInfo[];
  paymentMethods?: string[];
}

export const ExpenseModal: React.FC<ExpenseModalProps> = ({
  isOpen,
  onClose,
  onSaveExpense,
  onUpdateExpense,
  editingExpense,
  currencySymbol,
  currencyCode,
  categories = CATEGORY_LIST,
  paymentMethods = PAYMENT_METHODS,
}) => {
  const getTodayString = () => new Date().toISOString().split('T')[0];

  const defaultCat = categories[0]?.id || 'comida';
  const defaultPay = paymentMethods[0] || 'Efectivo';

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<CategoryId>(defaultCat);
  const [date, setDate] = useState(getTodayString());
  const [paymentMethod, setPaymentMethod] = useState(defaultPay);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingExpense) {
      setDescription(editingExpense.description);
      setAmount(editingExpense.amount.toString());
      setCategory(editingExpense.category);
      setDate(editingExpense.date);
      setPaymentMethod(editingExpense.paymentMethod || defaultPay);
      setNotes(editingExpense.notes || '');
    } else {
      setDescription('');
      setAmount('');
      setCategory(defaultCat);
      setDate(getTodayString());
      setPaymentMethod(defaultPay);
      setNotes('');
    }
    setError(null);
  }, [editingExpense, isOpen, defaultCat, defaultPay]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedDesc = description.trim();
    if (!trimmedDesc) {
      setError('Escribe una descripción del gasto');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Ingresa un monto válido mayor a 0');
      return;
    }

    if (!date) {
      setError('Selecciona una fecha');
      return;
    }

    if (editingExpense && onUpdateExpense) {
      onUpdateExpense({
        ...editingExpense,
        description: trimmedDesc,
        amount: Math.round(numAmount * 100) / 100,
        category,
        date,
        paymentMethod,
        notes: notes.trim(),
      });
    } else {
      onSaveExpense({
        description: trimmedDesc,
        amount: Math.round(numAmount * 100) / 100,
        category,
        date,
        paymentMethod,
        notes: notes.trim(),
      });
    }

    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs transition-opacity p-0 sm:p-4"
    >
      {/* Backdrop tap to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Sheet / Modal Container */}
      <div className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden z-10 animate-in slide-in-from-bottom duration-200">
        {/* Handle bar on mobile */}
        <div className="sm:hidden pt-3 pb-1 flex justify-center">
          <div className="w-10 h-1 bg-slate-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {editingExpense ? 'Editar Gasto' : 'Nuevo Gasto'}
            </h3>
            <p className="text-xs text-slate-500">
              Registra el movimiento para actualizar el semáforo
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4">
          {error && (
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 font-medium">
              {error}
            </div>
          )}

          {/* Monto Prominente estilo App Móvil */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-1">
              Monto ({currencyCode})
            </span>
            <div className="flex items-center justify-center">
              <span className="text-2xl font-bold font-mono text-slate-400 mr-1.5">
                {currencySymbol}
              </span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                autoFocus
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-48 text-center text-3xl sm:text-4xl font-extrabold font-mono text-slate-900 bg-transparent outline-none placeholder:text-slate-300"
              />
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              ¿En qué lo gastaste?
            </label>
            <input
              type="text"
              required
              placeholder="Ej. Almuerzo, Uber, Recibo de luz..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
            />
          </div>

          {/* Categoría - Selector con cuadrícula táctil */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Categoría
            </label>
            <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
              {categories.map((cat) => {
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 text-center transition-all cursor-pointer min-h-[58px] ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div
                      className="w-6 h-6 rounded-lg flex items-center justify-center text-white shrink-0"
                      style={{ backgroundColor: cat.color }}
                    >
                      <CategoryIcon category={cat.id} iconName={cat.iconName} className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[11px] leading-tight line-clamp-1">
                      {cat.name.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Fecha y Método de Pago */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Fecha
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Pago con
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 bg-white"
              >
                {paymentMethods.map((pm) => (
                  <option key={pm} value={pm}>
                    {pm}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Notas opcionales */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Notas adicionales (opcional)
            </label>
            <input
              type="text"
              placeholder="Comentarios, comprobante o detalle"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          {/* Botón Guardar */}
          <div className="pt-3 pb-2">
            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-slate-900 hover:bg-slate-800 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{editingExpense ? 'Actualizar Gasto' : 'Guardar Gasto'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
