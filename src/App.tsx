import React, { useState, useEffect, useMemo } from 'react';
import { MobileTopHeader } from './components/MobileTopHeader';
import { MobileBottomNav, MobileTab } from './components/MobileBottomNav';
import { MobileTrafficCard } from './components/MobileTrafficCard';
import { MobileExpenseList } from './components/MobileExpenseList';
import { MobileCategoryTab } from './components/MobileCategoryTab';
import { MobileSettingsTab } from './components/MobileSettingsTab';
import { ExpenseModal } from './components/ExpenseModal';
import { DEFAULT_BUDGET, getInitialExpenses } from './data/defaultData';
import { CategoryId, CategoryInfo, Expense } from './types/budget';
import { calculateCategoryBreakdown, calculateTrafficLight, formatCurrency } from './utils/formatters';
import { Plus, Sliders, Smartphone, LayoutDashboard, ArrowRight } from 'lucide-react';
import { CategoryIcon } from './components/CategoryIcon';
import { CATEGORIES, CATEGORY_LIST, PAYMENT_METHODS } from './data/defaultData';

import { AuthView } from './components/AuthView';
import { UserProfile } from './types/auth';

const STORAGE_KEY_BUDGET = 'gestor_presupuesto_monthly_limit';
const STORAGE_KEY_EXPENSES = 'gestor_presupuesto_expenses_list';
const STORAGE_KEY_CURRENCY = 'gestor_presupuesto_currency';
const STORAGE_KEY_USER = 'gestor_presupuesto_current_user';
const STORAGE_KEY_CATEGORIES = 'gestor_presupuesto_categories';
const STORAGE_KEY_PAYMENTS = 'gestor_presupuesto_payment_methods';

export default function App() {
  const currentMonthKey = useMemo(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  }, []);

  // State: Usuario autenticado (null = mostrar vista de Login/Register)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_USER);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  // State: Tab activo en móvil
  const [activeTab, setActiveTab] = useState<MobileTab>('semaforo');

  // State: Modal para registrar o editar gasto
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  // State: Presupuesto Mensual
  const [monthlyBudget, setMonthlyBudget] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_BUDGET);
    return saved ? Number(saved) : DEFAULT_BUDGET;
  });

  // State: Moneda
  const [currency, setCurrency] = useState<{ symbol: string; code: string }>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CURRENCY);
    return saved ? JSON.parse(saved) : { symbol: '$', code: 'USD' };
  });

  // State: Categorías dinámicas configurables
  const [categories, setCategories] = useState<CategoryInfo[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CATEGORIES);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return CATEGORY_LIST;
      }
    }
    return CATEGORY_LIST;
  });

  // Mapa rápido de categorías
  const categoriesMap = useMemo(() => {
    const map: Record<string, CategoryInfo> = {};
    for (const cat of categories) {
      map[cat.id] = cat;
    }
    return map;
  }, [categories]);

  // State: Métodos de pago dinámicos configurables
  const [paymentMethods, setPaymentMethods] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PAYMENTS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return PAYMENT_METHODS;
      }
    }
    return PAYMENT_METHODS;
  });

  // State: Mes seleccionado para visualización
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonthKey);

  // State: Gastos
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_EXPENSES);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return getInitialExpenses();
      }
    }
    return getInitialExpenses();
  });

  // State: Filtro de Categoría activo
  const [categoryFilter, setCategoryFilter] = useState<CategoryId | 'all'>('all');

  // Guardar usuario en localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEY_USER);
    }
  }, [currentUser]);

  // Guardar en localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_BUDGET, monthlyBudget.toString());
  }, [monthlyBudget]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CURRENCY, JSON.stringify(currency));
  }, [currency]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_EXPENSES, JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PAYMENTS, JSON.stringify(paymentMethods));
  }, [paymentMethods]);

  // Filtrar los gastos pertenecientes al mes seleccionado
  const monthExpenses = useMemo(() => {
    return expenses.filter((e) => e.date.startsWith(selectedMonth));
  }, [expenses, selectedMonth]);

  // Cálculo del Semáforo en Tiempo Real
  const trafficLightResult = useMemo(() => {
    return calculateTrafficLight(monthlyBudget, monthExpenses);
  }, [monthlyBudget, monthExpenses]);

  // Análisis por Categorías (usando el mapa dinámico)
  const { items: categoryItems, topCategory } = useMemo(() => {
    return calculateCategoryBreakdown(monthExpenses, monthlyBudget, categoriesMap);
  }, [monthExpenses, monthlyBudget, categoriesMap]);

  // Handlers para Categorías
  const handleAddCategory = (newCat: CategoryInfo) => {
    setCategories((prev) => [...prev, newCat]);
  };

  const handleDeleteCategory = (catId: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== catId));
    if (categoryFilter === catId) {
      setCategoryFilter('all');
    }
  };

  // Handlers para Métodos de Pago
  const handleAddPaymentMethod = (method: string) => {
    setPaymentMethods((prev) => [...prev, method]);
  };

  const handleDeletePaymentMethod = (method: string) => {
    setPaymentMethods((prev) => prev.filter((m) => m !== method));
  };

  // Handlers
  const handleAddExpense = (newExpenseData: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExpense: Expense = {
      ...newExpenseData,
      id: `exp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: Date.now(),
    };
    setExpenses((prev) => [newExpense, ...prev]);

    const expenseMonth = newExpenseData.date.substring(0, 7);
    if (expenseMonth !== selectedMonth) {
      setSelectedMonth(expenseMonth);
    }
  };

  const handleUpdateExpense = (updated: Expense) => {
    setExpenses((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
    setEditingExpense(null);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    if (editingExpense?.id === id) {
      setEditingExpense(null);
    }
  };

  const handleStartEdit = (exp: Expense) => {
    setEditingExpense(exp);
    setIsModalOpen(true);
  };

  const handleOpenNewExpense = () => {
    setEditingExpense(null);
    setIsModalOpen(true);
  };

  const handleResetData = () => {
    setExpenses(getInitialExpenses());
    setMonthlyBudget(DEFAULT_BUDGET);
    setSelectedMonth(currentMonthKey);
    setCategoryFilter('all');
    setEditingExpense(null);
  };

  const handleClearExpenses = () => {
    setExpenses((prev) => prev.filter((e) => !e.date.startsWith(selectedMonth)));
    setEditingExpense(null);
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Fecha', 'Descripción', 'Categoría', 'Método de Pago', 'Monto', 'Notas'];
    const rows = monthExpenses.map((exp) => [
      exp.id,
      exp.date,
      `"${exp.description.replace(/"/g, '""')}"`,
      exp.category,
      exp.paymentMethod || 'Efectivo',
      exp.amount.toFixed(2),
      `"${(exp.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `gastos_${selectedMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSimulateState = (targetPercent: number) => {
    const targetAmount = (monthlyBudget * targetPercent) / 100;
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');

    let simulated: Expense[] = [];

    if (targetPercent <= 50) {
      // Saludable (<70%)
      simulated = [
        {
          id: `sim-${Date.now()}-1`,
          description: 'Supermercado quincenal',
          amount: Math.round(targetAmount * 0.55 * 100) / 100,
          category: 'comida',
          date: `${year}-${month}-04`,
          paymentMethod: 'Tarjeta de Débito',
          createdAt: Date.now() - 5000,
        },
        {
          id: `sim-${Date.now()}-2`,
          description: 'Transporte y recarga',
          amount: Math.round(targetAmount * 0.25 * 100) / 100,
          category: 'transporte',
          date: `${year}-${month}-08`,
          paymentMethod: 'Efectivo',
          createdAt: Date.now() - 4000,
        },
        {
          id: `sim-${Date.now()}-3`,
          description: 'Internet del hogar',
          amount: Math.round(targetAmount * 0.2 * 100) / 100,
          category: 'servicios',
          date: `${year}-${month}-12`,
          paymentMethod: 'Transferencia Bancaria',
          createdAt: Date.now() - 3000,
        },
      ];
    } else if (targetPercent <= 90) {
      // Precaución (70%-99%)
      simulated = [
        {
          id: `sim-${Date.now()}-1`,
          description: 'Alimentación familiar',
          amount: Math.round(targetAmount * 0.35 * 100) / 100,
          category: 'comida',
          date: `${year}-${month}-02`,
          paymentMethod: 'Tarjeta de Débito',
          createdAt: Date.now() - 6000,
        },
        {
          id: `sim-${Date.now()}-2`,
          description: 'Mantenimiento del auto',
          amount: Math.round(targetAmount * 0.3 * 100) / 100,
          category: 'transporte',
          date: `${year}-${month}-07`,
          paymentMethod: 'Tarjeta de Crédito',
          createdAt: Date.now() - 5000,
        },
        {
          id: `sim-${Date.now()}-3`,
          description: 'Alquiler y servicios',
          amount: Math.round(targetAmount * 0.25 * 100) / 100,
          category: 'vivienda',
          date: `${year}-${month}-11`,
          paymentMethod: 'Transferencia Bancaria',
          createdAt: Date.now() - 4000,
        },
        {
          id: `sim-${Date.now()}-4`,
          description: 'Salida de fin de semana',
          amount: Math.round(targetAmount * 0.1 * 100) / 100,
          category: 'entretenimiento',
          date: `${year}-${month}-15`,
          paymentMethod: 'Efectivo',
          createdAt: Date.now() - 2000,
        },
      ];
    } else {
      // Excedido (>=100%)
      simulated = [
        {
          id: `sim-${Date.now()}-1`,
          description: 'Alquiler del departamento',
          amount: Math.round(targetAmount * 0.3 * 100) / 100,
          category: 'vivienda',
          date: `${year}-${month}-01`,
          paymentMethod: 'Transferencia Bancaria',
          createdAt: Date.now() - 8000,
        },
        {
          id: `sim-${Date.now()}-2`,
          description: 'Reparación de emergencia del vehículo',
          amount: Math.round(targetAmount * 0.35 * 100) / 100,
          category: 'transporte',
          date: `${year}-${month}-06`,
          paymentMethod: 'Tarjeta de Crédito',
          notes: 'Gasto inesperado por avería',
          createdAt: Date.now() - 7000,
        },
        {
          id: `sim-${Date.now()}-3`,
          description: 'Supermercado e insumos',
          amount: Math.round(targetAmount * 0.2 * 100) / 100,
          category: 'comida',
          date: `${year}-${month}-10`,
          paymentMethod: 'Tarjeta de Débito',
          createdAt: Date.now() - 5000,
        },
        {
          id: `sim-${Date.now()}-4`,
          description: 'Tratamiento médico y medicinas',
          amount: Math.round(targetAmount * 0.15 * 100) / 100,
          category: 'salud',
          date: `${year}-${month}-14`,
          paymentMethod: 'Tarjeta de Crédito',
          createdAt: Date.now() - 3000,
        },
      ];
    }

    setExpenses((prev) => [
      ...simulated,
      ...prev.filter((e) => !e.date.startsWith(selectedMonth)),
    ]);
  };

  const handleFilterByCategoryAndOpenHistory = (cat: CategoryId) => {
    setCategoryFilter(cat);
    setActiveTab('historial');
  };

  // Recent 3 expenses for the dashboard preview
  const recentExpenses = useMemo(() => {
    return [...monthExpenses]
      .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt)
      .slice(0, 3);
  }, [monthExpenses]);

  // Si no hay usuario autenticado, mostrar la vista de Login y Register
  if (!currentUser) {
    return <AuthView onSuccessLogin={(user) => setCurrentUser(user)} />;
  }

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 antialiased flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      {/* Centered Mobile App Container */}
      <div className="w-full max-w-md mx-auto min-h-screen bg-slate-50 flex flex-col shadow-xl border-x border-slate-200/80 relative pb-24">
        {/* Header móvil con selector de mes y perfil de usuario */}
        <MobileTopHeader
          selectedMonth={selectedMonth}
          onChangeMonth={setSelectedMonth}
          status={trafficLightResult.status}
          currentUser={currentUser}
          onLogout={() => setCurrentUser(null)}
        />

        {/* Contenido según pestaña activa */}
        <main className="flex-1 px-4 py-4 space-y-4">
          {/* TAB 1: SEMÁFORO / INICIO */}
          {activeTab === 'semaforo' && (
            <div className="space-y-4">
              {/* Semáforo Principal */}
              <MobileTrafficCard
                result={trafficLightResult}
                currencySymbol={currency.symbol}
                currencyCode={currency.code}
              />

              {/* Acceso Rápido: Categoría con Mayor Gasto */}
              {topCategory && (
                <div
                  onClick={() => setActiveTab('categorias')}
                  className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-xs flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shrink-0"
                      style={{ backgroundColor: topCategory.categoryInfo.color }}
                    >
                      <CategoryIcon category={topCategory.category} className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Mayor Gasto
                      </span>
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {topCategory.categoryInfo.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono font-bold text-xs text-slate-900">
                      {topCategory.percentageOfTotalSpend}%
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              )}

              {/* Feed Corto de Últimos Movimientos */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Últimos Movimientos
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab('historial')}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
                  >
                    Ver todos ({monthExpenses.length})
                  </button>
                </div>

                {recentExpenses.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">
                    Sin gastos este mes. Toca el botón <strong>+</strong> para añadir uno.
                  </p>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {recentExpenses.map((item) => {
                      const cat = CATEGORIES[item.category] || CATEGORIES.otros;
                      return (
                        <div
                          key={item.id}
                          className="py-2.5 flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className="w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0"
                              style={{ backgroundColor: cat.color }}
                            >
                              <CategoryIcon category={item.category} className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-900 truncate">
                                {item.description}
                              </p>
                              <p className="text-[10px] text-slate-400">{item.date}</p>
                            </div>
                          </div>
                          <span className="font-mono font-bold text-xs text-slate-900 shrink-0">
                            {formatCurrency(item.amount, currency.symbol, currency.code)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Botones de Prueba Rápida del Semáforo */}
              <div className="p-3 bg-white rounded-2xl border border-slate-200/90 flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold text-slate-600">
                  Probar estados:
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleSimulateState(50)}
                    className="px-2 py-1 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-pointer"
                  >
                    Verde (50%)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSimulateState(85)}
                    className="px-2 py-1 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 cursor-pointer"
                  >
                    Amarillo (85%)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSimulateState(120)}
                    className="px-2 py-1 rounded-md text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 cursor-pointer"
                  >
                    Rojo (120%)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CATEGORÍAS */}
          {activeTab === 'categorias' && (
            <MobileCategoryTab
              items={categoryItems}
              topCategory={topCategory}
              currencySymbol={currency.symbol}
              currencyCode={currency.code}
              totalSpent={trafficLightResult.totalSpent}
              monthlyBudget={monthlyBudget}
              onFilterByCategory={handleFilterByCategoryAndOpenHistory}
            />
          )}

          {/* TAB 3: HISTORIAL */}
          {activeTab === 'historial' && (
            <MobileExpenseList
              expenses={monthExpenses}
              onDeleteExpense={handleDeleteExpense}
              onEditExpense={handleStartEdit}
              onOpenNewExpense={handleOpenNewExpense}
              selectedCategory={categoryFilter}
              onSelectCategory={setCategoryFilter}
              currencySymbol={currency.symbol}
              currencyCode={currency.code}
              categories={categories}
              categoriesMap={categoriesMap}
            />
          )}

          {/* TAB 4: AJUSTES */}
          {activeTab === 'ajustes' && (
            <MobileSettingsTab
              monthlyBudget={monthlyBudget}
              onUpdateBudget={setMonthlyBudget}
              currencySymbol={currency.symbol}
              currencyCode={currency.code}
              onUpdateCurrency={(sym, code) => setCurrency({ symbol: sym, code })}
              onSimulateState={handleSimulateState}
              onExportCSV={handleExportCSV}
              onResetData={handleResetData}
              onClearExpenses={handleClearExpenses}
              currentUser={currentUser}
              onLogout={() => setCurrentUser(null)}
              categories={categories}
              onAddCategory={handleAddCategory}
              onDeleteCategory={handleDeleteCategory}
              paymentMethods={paymentMethods}
              onAddPaymentMethod={handleAddPaymentMethod}
              onDeletePaymentMethod={handleDeletePaymentMethod}
            />
          )}
        </main>

        {/* Barra de navegación inferior móvil */}
        <MobileBottomNav
          currentTab={activeTab}
          onSelectTab={setActiveTab}
          onOpenNewExpense={handleOpenNewExpense}
        />
      </div>

      {/* Modal / Bottom Sheet para Registrar/Editar Gasto */}
      <ExpenseModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingExpense(null);
        }}
        onSaveExpense={handleAddExpense}
        onUpdateExpense={handleUpdateExpense}
        editingExpense={editingExpense}
        currencySymbol={currency.symbol}
        currencyCode={currency.code}
        categories={categories}
        paymentMethods={paymentMethods}
      />
    </div>
  );
}
