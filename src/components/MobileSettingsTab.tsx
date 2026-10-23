import React, { useState } from 'react';
import {
  Wallet,
  Settings,
  RotateCcw,
  Download,
  Trash2,
  Check,
  Sliders,
  DollarSign,
  AlertTriangle,
  AlertOctagon,
  User,
  LogOut,
  CreditCard,
  Tag,
  Plus,
  X,
  Palette,
  Sparkles,
} from 'lucide-react';
import { CURRENCIES } from '../data/defaultData';
import { formatCurrency } from '../utils/formatters';
import { UserProfile } from '../types/auth';
import { CategoryInfo } from '../types/budget';
import {
  CategoryIcon,
  AVAILABLE_CATEGORY_COLORS,
  AVAILABLE_CATEGORY_ICONS,
} from './CategoryIcon';

interface MobileSettingsTabProps {
  monthlyBudget: number;
  onUpdateBudget: (budget: number) => void;
  currencySymbol: string;
  currencyCode: string;
  onUpdateCurrency: (symbol: string, code: string) => void;
  onSimulateState: (targetPercent: number) => void;
  onExportCSV: () => void;
  onResetData: () => void;
  onClearExpenses: () => void;
  currentUser?: UserProfile | null;
  onLogout?: () => void;

  // Gestión de Categorías
  categories: CategoryInfo[];
  onAddCategory: (category: CategoryInfo) => void;
  onDeleteCategory: (categoryId: string) => void;

  // Gestión de Métodos de Pago
  paymentMethods: string[];
  onAddPaymentMethod: (method: string) => void;
  onDeletePaymentMethod: (method: string) => void;
}

export const MobileSettingsTab: React.FC<MobileSettingsTabProps> = ({
  monthlyBudget,
  onUpdateBudget,
  currencySymbol,
  currencyCode,
  onUpdateCurrency,
  onSimulateState,
  onExportCSV,
  onResetData,
  onClearExpenses,
  currentUser,
  onLogout,
  categories,
  onAddCategory,
  onDeleteCategory,
  paymentMethods,
  onAddPaymentMethod,
  onDeletePaymentMethod,
}) => {
  const [budgetValue, setBudgetValue] = useState(monthlyBudget.toString());
  const [savedFeedback, setSavedFeedback] = useState(false);

  // Estados para nuevo método de pago
  const [newPaymentMethod, setNewPaymentMethod] = useState('');
  const [paymentFeedback, setPaymentFeedback] = useState<string | null>(null);

  // Estados para nueva categoría
  const [showAddCategoryForm, setShowAddCategoryForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState(AVAILABLE_CATEGORY_COLORS[0].hex);
  const [newCategoryIcon, setNewCategoryIcon] = useState(AVAILABLE_CATEGORY_ICONS[9].id); // PawPrint por defecto
  const [categoryFeedback, setCategoryFeedback] = useState<string | null>(null);

  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(budgetValue);
    if (!isNaN(parsed) && parsed > 0) {
      onUpdateBudget(parsed);
      setSavedFeedback(true);
      setTimeout(() => setSavedFeedback(false), 2000);
    }
  };

  const handleQuickPreset = (val: number) => {
    setBudgetValue(val.toString());
    onUpdateBudget(val);
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2000);
  };

  const handleCreatePaymentMethod = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newPaymentMethod.trim();
    if (!trimmed) return;

    if (paymentMethods.some((pm) => pm.toLowerCase() === trimmed.toLowerCase())) {
      setPaymentFeedback('Ese método de pago ya existe.');
      setTimeout(() => setPaymentFeedback(null), 2500);
      return;
    }

    onAddPaymentMethod(trimmed);
    setNewPaymentMethod('');
    setPaymentFeedback('✓ Método de pago agregado con éxito');
    setTimeout(() => setPaymentFeedback(null), 2000);
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCategoryName.trim();
    if (!trimmed) {
      setCategoryFeedback('Ingresa un nombre para la categoría.');
      return;
    }

    const generatedId = trimmed
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '_');

    if (categories.some((c) => c.id === generatedId || c.name.toLowerCase() === trimmed.toLowerCase())) {
      setCategoryFeedback('Ya existe una categoría con ese nombre.');
      setTimeout(() => setCategoryFeedback(null), 2500);
      return;
    }

    const newCat: CategoryInfo = {
      id: generatedId,
      name: trimmed,
      color: newCategoryColor,
      bgLight: `${newCategoryColor}15`,
      textColor: newCategoryColor,
      iconName: newCategoryIcon,
    };

    onAddCategory(newCat);
    setNewCategoryName('');
    setShowAddCategoryForm(false);
    setCategoryFeedback('✓ Categoría creada exitosamente');
    setTimeout(() => setCategoryFeedback(null), 2500);
  };

  return (
    <div className="space-y-4">
      {/* 0. Tarjeta de Perfil de Usuario Autenticado */}
      {currentUser && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-base shadow-xs shrink-0">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                {currentUser.name}
              </h3>
              <p className="text-[11px] text-slate-500 truncate">
                {currentUser.email}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-emerald-700 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Sesión activa ({currentUser.provider === 'google' ? 'Google' : 'Email'})</span>
              </div>
            </div>
          </div>

          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer shrink-0"
              title="Cerrar sesión"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* 1. Ajuste del Presupuesto Mensual */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Wallet className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Presupuesto Mensual</h3>
            <p className="text-xs text-slate-500">Límite para la regla del semáforo</p>
          </div>
        </div>

        <form onSubmit={handleSaveBudget} className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono font-bold text-slate-400 text-sm">
                {currencySymbol}
              </span>
              <input
                type="number"
                step="0.01"
                min="1"
                value={budgetValue}
                onChange={(e) => setBudgetValue(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 font-mono font-bold text-slate-900 text-base focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
            >
              {savedFeedback ? '¡Listo!' : 'Guardar'}
            </button>
          </div>

          {/* Quick presets */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
            {[600, 1000, 1500, 2500].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handleQuickPreset(preset)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-xs whitespace-nowrap cursor-pointer transition-colors"
              >
                {formatCurrency(preset, currencySymbol, currencyCode)}
              </button>
            ))}
          </div>
        </form>

        {/* Moneda */}
        <div className="pt-2 border-t border-slate-100">
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Moneda del Sistema
          </label>
          <select
            value={currencyCode}
            onChange={(e) => {
              const found = CURRENCIES.find((c) => c.code === e.target.value);
              if (found) onUpdateCurrency(found.symbol, found.code);
            }}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 bg-white outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. GESTOR DE MÉTODOS DE PAGO (Nuevo requerimiento) */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Métodos de Pago</h3>
              <p className="text-xs text-slate-500">Registra y personaliza formas de pago</p>
            </div>
          </div>
          <span className="text-xs font-mono font-semibold text-slate-400">
            {paymentMethods.length} activos
          </span>
        </div>

        {paymentFeedback && (
          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
            {paymentFeedback}
          </div>
        )}

        {/* Formulario para añadir método de pago */}
        <form onSubmit={handleCreatePaymentMethod} className="flex items-center gap-2">
          <input
            type="text"
            required
            placeholder="Ej. PayPal, Apple Pay, Vale..."
            value={newPaymentMethod}
            onChange={(e) => setNewPaymentMethod(e.target.value)}
            className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
          />
          <button
            type="submit"
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Agregar</span>
          </button>
        </form>

        {/* Lista de Métodos de Pago Activos */}
        <div className="space-y-2 pt-1">
          {paymentMethods.map((pm) => (
            <div
              key={pm}
              className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between text-xs group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <CreditCard className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="font-semibold text-slate-800 truncate">{pm}</span>
              </div>
              {paymentMethods.length > 1 && (
                <button
                  type="button"
                  onClick={() => onDeletePaymentMethod(pm)}
                  className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title={`Eliminar ${pm}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 3. GESTOR DE CATEGORÍAS (Nuevo requerimiento) */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Categorías de Gasto</h3>
              <p className="text-xs text-slate-500">Administra tus rubros presupuestarios</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowAddCategoryForm(!showAddCategoryForm)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors cursor-pointer shadow-xs"
          >
            {showAddCategoryForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            <span>{showAddCategoryForm ? 'Cerrar' : 'Nueva'}</span>
          </button>
        </div>

        {categoryFeedback && (
          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
            {categoryFeedback}
          </div>
        )}

        {/* Formulario Desplegable para Crear Nueva Categoría */}
        {showAddCategoryForm && (
          <form
            onSubmit={handleCreateCategory}
            className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3.5 animate-in fade-in duration-150"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">
                Registrar Nueva Categoría
              </span>
              {/* Preview */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-slate-400">Vista previa:</span>
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white shadow-xs"
                  style={{ backgroundColor: newCategoryColor }}
                >
                  <CategoryIcon iconName={newCategoryIcon} className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Nombre */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Nombre de la Categoría
              </label>
              <input
                type="text"
                required
                placeholder="Ej. Mascotas, Gimnasio, Viajes..."
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
              />
            </div>

            {/* Selector de Color */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
                Color Representativo
              </label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_CATEGORY_COLORS.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => setNewCategoryColor(c.hex)}
                    style={{ backgroundColor: c.hex }}
                    className={`w-6 h-6 rounded-full transition-all cursor-pointer ${
                      newCategoryColor === c.hex
                        ? 'ring-2 ring-offset-2 ring-slate-900 scale-110'
                        : 'opacity-80 hover:opacity-100'
                    }`}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Selector de Icono */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
                Selecciona un Icono
              </label>
              <div className="grid grid-cols-7 gap-1.5 max-h-32 overflow-y-auto p-1 bg-white rounded-xl border border-slate-200">
                {AVAILABLE_CATEGORY_ICONS.map((item) => {
                  const Icon = item.Icon;
                  const isSelected = newCategoryIcon === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setNewCategoryIcon(item.id)}
                      className={`p-2 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-slate-900 text-white'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                      title={item.label}
                    >
                      <Icon className="w-4 h-4" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Botón Guardar Categoría */}
            <div className="pt-1 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddCategoryForm(false)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Guardar Categoría
              </button>
            </div>
          </form>
        )}

        {/* Lista de Categorías Existentes */}
        <div className="grid grid-cols-1 gap-2 pt-1">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0 shadow-xs"
                  style={{ backgroundColor: cat.color }}
                >
                  <CategoryIcon category={cat.id} iconName={cat.iconName} className="w-3.5 h-3.5" />
                </div>
                <span className="font-bold text-slate-800 truncate">{cat.name}</span>
              </div>

              {categories.length > 2 && (
                <button
                  type="button"
                  onClick={() => onDeleteCategory(cat.id)}
                  className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title={`Eliminar categoría ${cat.name}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 4. Simulador Rápido de Estados del Semáforo */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold">Simulador del Semáforo</h3>
        </div>
        <p className="text-xs text-slate-400 leading-snug">
          Verifica con un toque cómo reacciona la interfaz a cada nivel de gasto:
        </p>

        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={() => onSimulateState(50)}
            className="w-full p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 flex items-center gap-3 text-left transition-colors cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Check className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">1. Saludable (&lt; 70%)</span>
              <span className="text-[10px] text-slate-400">Simula gasto al 50%</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onSimulateState(85)}
            className="w-full p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 flex items-center gap-3 text-left transition-colors cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">2. Precaución (70% - 99%)</span>
              <span className="text-[10px] text-slate-400">Simula gasto al 85%</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onSimulateState(120)}
            className="w-full p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 flex items-center gap-3 text-left transition-colors cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
              <AlertOctagon className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">3. Presupuesto Excedido (≥ 100%)</span>
              <span className="text-[10px] text-slate-400">Simula sobregiro al 120% con monto exacto</span>
            </div>
          </button>
        </div>
      </div>

      {/* 5. Acciones de Datos */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-2.5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Gestión de Datos
        </h4>

        <button
          type="button"
          onClick={onExportCSV}
          className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Exportar a CSV (Excel)</span>
        </button>

        <button
          type="button"
          onClick={onResetData}
          className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restaurar datos de prueba</span>
        </button>

        <button
          type="button"
          onClick={onClearExpenses}
          className="w-full py-2.5 px-3 rounded-xl text-rose-700 hover:bg-rose-50 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Vaciar gastos de este mes</span>
        </button>
      </div>
    </div>
  );
};
