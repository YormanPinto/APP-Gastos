import { CATEGORIES } from '../data/defaultData';
import { CategoryId, CategoryInfo, CategorySpending, Expense, TrafficLightResult } from '../types/budget';

export function formatCurrency(amount: number, symbol: string = '$', code: string = 'USD'): string {
  const formatted = new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount));

  return `${symbol} ${formatted}`;
}

export function formatDateSpanish(dateString: string): string {
  if (!dateString) return '';
  try {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function calculateTrafficLight(
  monthlyBudget: number,
  expenses: Expense[]
): TrafficLightResult {
  const safeBudget = monthlyBudget > 0 ? monthlyBudget : 1;
  const totalSpent = expenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const percentage = (totalSpent / safeBudget) * 100;

  if (percentage < 70) {
    const remaining = Math.max(0, safeBudget - totalSpent);
    return {
      status: 'healthy',
      percentage: Number(percentage.toFixed(1)),
      totalSpent,
      monthlyBudget: safeBudget,
      remainingAmount: remaining,
      exceededAmount: 0,
      statusTitle: 'Estado Saludable',
      statusDescription: `Has consumido el ${percentage.toFixed(1)}% de tu presupuesto. Mantienes un excelente control financiero y tienes margen disponible.`,
    };
  }

  if (percentage >= 70 && percentage < 100) {
    const remaining = Math.max(0, safeBudget - totalSpent);
    return {
      status: 'warning',
      percentage: Number(percentage.toFixed(1)),
      totalSpent,
      monthlyBudget: safeBudget,
      remainingAmount: remaining,
      exceededAmount: 0,
      statusTitle: 'Alerta de Precaución',
      statusDescription: `Has consumido el ${percentage.toFixed(1)}% de tu presupuesto mensual. Estás cerca del límite fijado; modera gastos no esenciales.`,
    };
  }

  // 100% or more: Presupuesto Excedido
  const exceeded = totalSpent - safeBudget;
  return {
    status: 'exceeded',
    percentage: Number(percentage.toFixed(1)),
    totalSpent,
    monthlyBudget: safeBudget,
    remainingAmount: 0,
    exceededAmount: exceeded,
    statusTitle: 'Presupuesto Excedido',
    statusDescription: `¡Alerta crítica! Has sobrepasado el 100% de tu presupuesto mensual. Detén gastos no indispensables de inmediato.`,
  };
}

export function calculateCategoryBreakdown(
  expenses: Expense[],
  monthlyBudget: number,
  categoriesMap: Record<string, CategoryInfo> = CATEGORIES
): {
  items: CategorySpending[];
  topCategory: CategorySpending | null;
} {
  const safeBudget = monthlyBudget > 0 ? monthlyBudget : 1;
  const totalSpent = expenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  const map = new Map<CategoryId, { amount: number; count: number }>();

  for (const exp of expenses) {
    const current = map.get(exp.category) || { amount: 0, count: 0 };
    map.set(exp.category, {
      amount: current.amount + (Number(exp.amount) || 0),
      count: current.count + 1,
    });
  }

  const items: CategorySpending[] = [];

  for (const [catId, val] of map.entries()) {
    const categoryInfo =
      categoriesMap[catId] ||
      CATEGORIES[catId] || {
        id: catId,
        name: catId.charAt(0).toUpperCase() + catId.slice(1),
        color: '#475569',
        bgLight: '#f1f5f9',
        textColor: '#334155',
        iconName: 'Receipt',
      };

    items.push({
      category: catId,
      categoryInfo,
      amount: val.amount,
      percentageOfBudget: Number(((val.amount / safeBudget) * 100).toFixed(1)),
      percentageOfTotalSpend: totalSpent > 0 ? Number(((val.amount / totalSpent) * 100).toFixed(1)) : 0,
      count: val.count,
    });
  }

  // Sort descending by amount
  items.sort((a, b) => b.amount - a.amount);

  return {
    items,
    topCategory: items.length > 0 ? items[0] : null,
  };
}
