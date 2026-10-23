import React, { useState, useEffect } from 'react';
import { PlusCircle, Save, X, Calendar, DollarSign, Tag, FileText, CreditCard } from 'lucide-react';
import { CATEGORY_LIST, PAYMENT_METHODS } from '../data/defaultData';
import { CategoryId, Expense } from '../types/budget';
import { CategoryIcon } from './CategoryIcon';

interface ExpenseFormProps {
  onAddExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
  onUpdateExpense?: (expense: Expense) => void;
  editingExpense?: Expense | null;
  onCancelEdit?: () => void;
  currencySymbol: string;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({
  onAddExpense,
  onUpdateExpense,
  editingExpense,
  onCancelEdit,
  currencySymbol,
}) => {
  const getTodayString = () => new Date().toISOString().split('T')[0];

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<CategoryId>('comida');
  const [date, setDate] = useState(getTodayString());
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState(false);

  useEffect(() => {
    if (editingExpense) {
      setDescription(editingExpense.description);
      setAmount(editingExpense.amount.toString());
      setCategory(editingExpense.category);
      setDate(editingExpense.date);
      setPaymentMethod(editingExpense.paymentMethod || PAYMENT_METHODS[0]);
      setNotes(editingExpense.notes || '');
    } else {
      resetForm();
    }
  }, [editingExpense]);

  const resetForm = () => {
    setDescription('');
    setAmount('');
    setCategory('comida');
    setDate(getTodayString());
    setPaymentMethod(PAYMENT_METHODS[0]);
    setNotes('');
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedDesc = description.trim();
    if (!trimmedDesc) {
      setError('Por favor ingresa una descripción para el gasto.');
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError('Por favor ingresa un monto numérico válido mayor a 0.');
      return;
    }

    if (!date) {
      setError('Por favor selecciona una fecha válida.');
      return;
    }

    if (editingExpense && onUpdateExpense) {
      onUpdateExpense({
        ...editingExpense,
        description: trimmedDesc,
        amount: Math.round(numericAmount * 100) / 100,
        category,
        date,
        paymentMethod,
        notes: notes.trim(),
      });
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 2000);
      if (onCancelEdit) onCancelEdit();
    } else {
      onAddExpense({
        description: trimmedDesc,
        amount: Math.round(numericAmount * 100) / 100,
        category,
        date,
        paymentMethod,
        notes: notes.trim(),
      });
      resetForm();
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 2000);
    }
  };

  return (
    <section
      id="nuevo-gasto"
      className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs"
    >
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
        <div className="flex items-center gap-2">
          {editingExpense ? (
            <Save className="w-5 h-5 text-indigo-600" />
          ) : (
            <PlusCircle className="w-5 h-5 text-emerald-600" />
          )}
          <h2 className="text-lg font-bold text-slate-900">
            {editingExpense ? 'Modificar Registro de Gasto' : 'Registrar Nuevo Gasto'}
          </h2>
        </div>

        {editingExpense && onCancelEdit && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
          >
            <X className="w-4 h-4" />
            <span>Cancelar edición</span>
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs font-medium text-rose-800">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
          ✓ Gasto guardado exitosamente. El semáforo ha recalculado tu presupuesto.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Fila 1: Descripción y Monto */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-8">
            <label
              htmlFor="expense-description"
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
            >
              Descripción del Gasto <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                id="expense-description"
                type="text"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ej. Compra de supermercado semanal, Combustible, etc."
                className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
              />
            </div>
          </div>

          <div className="md:col-span-4">
            <label
              htmlFor="expense-amount"
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
            >
              Monto ({currencySymbol}) <span className="text-rose-500">*</span>
            </label>
            <div className="relative flex rounded-lg shadow-xs">
              <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-slate-300 bg-slate-50 text-slate-500 font-mono text-sm">
                {currencySymbol}
              </span>
              <input
                id="expense-amount"
                type="number"
                step="0.01"
                min="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="block w-full min-w-0 flex-1 rounded-none rounded-r-lg border border-slate-300 px-3.5 py-2.5 text-sm font-mono font-semibold text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Fila 2: Categoría, Fecha y Método de Pago */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Categoría */}
          <div>
            <label
              htmlFor="expense-category"
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
            >
              Categoría <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select
                id="expense-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryId)}
                className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-xs font-medium text-slate-800 shadow-xs focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
              >
                {CATEGORY_LIST.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Fecha */}
          <div>
            <label
              htmlFor="expense-date"
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
            >
              Fecha <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                id="expense-date"
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-800 shadow-xs focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
              />
            </div>
          </div>

          {/* Método de Pago */}
          <div>
            <label
              htmlFor="expense-payment"
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
            >
              Método de Pago
            </label>
            <select
              id="expense-payment"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-xs font-medium text-slate-800 shadow-xs focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
            >
              {PAYMENT_METHODS.map((pm) => (
                <option key={pm} value={pm}>
                  {pm}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Fila 3: Notas Opcionales */}
        <div>
          <label
            htmlFor="expense-notes"
            className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
          >
            Notas o Comentarios Adicionales (Opcional)
          </label>
          <input
            id="expense-notes"
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Detalles de la compra, comercio, comprobante..."
            className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
          />
        </div>

        {/* Botones de Acción */}
        <div className="pt-2 flex items-center justify-end gap-3">
          {editingExpense && onCancelEdit && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="px-4 py-2.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              Cancelar
            </button>
          )}

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-lg shadow-xs transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
          >
            {editingExpense ? (
              <>
                <Save className="w-4 h-4" />
                <span>Actualizar Gasto</span>
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4" />
                <span>Registrar Gasto</span>
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
};
