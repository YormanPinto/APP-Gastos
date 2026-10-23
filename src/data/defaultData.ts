import { CategoryId, CategoryInfo, Expense } from '../types/budget';

export const CATEGORIES: Record<CategoryId, CategoryInfo> = {
  comida: {
    id: 'comida',
    name: 'Comida y Supermercado',
    color: '#059669', // Emerald 600
    bgLight: '#ecfdf5',
    textColor: '#065f46',
    iconName: 'Utensils',
  },
  transporte: {
    id: 'transporte',
    name: 'Transporte y Movilidad',
    color: '#2563eb', // Blue 600
    bgLight: '#eff6ff',
    textColor: '#1e40af',
    iconName: 'Car',
  },
  servicios: {
    id: 'servicios',
    name: 'Servicios Básicos (Luz/Agua/Net)',
    color: '#d97706', // Amber 600
    bgLight: '#fffbeb',
    textColor: '#92400e',
    iconName: 'Zap',
  },
  vivienda: {
    id: 'vivienda',
    name: 'Vivienda y Alquiler',
    color: '#7c3aed', // Violet 600
    bgLight: '#f5f3ff',
    textColor: '#5b21b6',
    iconName: 'Home',
  },
  salud: {
    id: 'salud',
    name: 'Salud y Farmacia',
    color: '#e11d48', // Rose 600
    bgLight: '#fff1f2',
    textColor: '#9f1239',
    iconName: 'HeartPulse',
  },
  entretenimiento: {
    id: 'entretenimiento',
    name: 'Entretenimiento y Ocio',
    color: '#8b5cf6', // Purple 500
    bgLight: '#fbf7ff',
    textColor: '#6d28d9',
    iconName: 'Film',
  },
  educacion: {
    id: 'educacion',
    name: 'Educación y Cursos',
    color: '#0891b2', // Cyan 600
    bgLight: '#ecfeff',
    textColor: '#155e75',
    iconName: 'GraduationCap',
  },
  ropa: {
    id: 'ropa',
    name: 'Ropa y Calzado',
    color: '#db2777', // Pink 600
    bgLight: '#fdf2f8',
    textColor: '#9d174d',
    iconName: 'ShoppingBag',
  },
  otros: {
    id: 'otros',
    name: 'Otros Gastos Imprevistos',
    color: '#475569', // Slate 600
    bgLight: '#f1f5f9',
    textColor: '#334155',
    iconName: 'Receipt',
  },
};

export const CATEGORY_LIST = Object.values(CATEGORIES);

export const PAYMENT_METHODS = [
  'Efectivo',
  'Tarjeta de Débito',
  'Tarjeta de Crédito',
  'Transferencia Bancaria',
  'Billetera Móvil (Yape/Plin/Bizum)',
];

export const CURRENCIES = [
  { code: 'USD', symbol: '$', label: 'Dólar Estadounidense ($ USD)' },
  { code: 'EUR', symbol: '€', label: 'Euro (€ EUR)' },
  { code: 'MXN', symbol: '$', label: 'Peso Mexicano ($ MXN)' },
  { code: 'COP', symbol: '$', label: 'Peso Colombiano ($ COP)' },
  { code: 'PEN', symbol: 'S/.', label: 'Sol Peruano (S/. PEN)' },
  { code: 'CLP', symbol: '$', label: 'Peso Chileno ($ CLP)' },
  { code: 'ARS', symbol: '$', label: 'Peso Argentino ($ ARS)' },
];

export const DEFAULT_BUDGET = 1200;

export function getInitialExpenses(): Expense[] {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');

  // Provide initial expenses that place the user in a healthy or near-warning realistic state (~$680 of $1200 = ~56%)
  return [
    {
      id: 'exp-1',
      description: 'Compra quincenal en Supermercado',
      amount: 215.5,
      category: 'comida',
      date: `${year}-${month}-03`,
      paymentMethod: 'Tarjeta de Débito',
      notes: 'Víveres para 2 semanas, frutas y verduras',
      createdAt: Date.now() - 86400000 * 14,
    },
    {
      id: 'exp-2',
      description: 'Recibo de Electricidad y Luz',
      amount: 68.0,
      category: 'servicios',
      date: `${year}-${month}-05`,
      paymentMethod: 'Transferencia Bancaria',
      notes: 'Factura mensual de energía',
      createdAt: Date.now() - 86400000 * 12,
    },
    {
      id: 'exp-3',
      description: 'Gasolina para la semana',
      amount: 45.0,
      category: 'transporte',
      date: `${year}-${month}-08`,
      paymentMethod: 'Tarjeta de Débito',
      notes: 'Tanque medio',
      createdAt: Date.now() - 86400000 * 9,
    },
    {
      id: 'exp-4',
      description: 'Medicamentos y vitaminas en farmacia',
      amount: 32.5,
      category: 'salud',
      date: `${year}-${month}-11`,
      paymentMethod: 'Efectivo',
      notes: 'Antialérgicos y complejo B',
      createdAt: Date.now() - 86400000 * 6,
    },
    {
      id: 'exp-5',
      description: 'Suscripción Internet Fibra Óptica',
      amount: 42.0,
      category: 'servicios',
      date: `${year}-${month}-12`,
      paymentMethod: 'Tarjeta de Crédito',
      notes: 'Plan 300 Mbps',
      createdAt: Date.now() - 86400000 * 5,
    },
    {
      id: 'exp-6',
      description: 'Almuerzo con compañeros de trabajo',
      amount: 28.0,
      category: 'comida',
      date: `${year}-${month}-14`,
      paymentMethod: 'Billetera Móvil (Yape/Plin/Bizum)',
      notes: 'Menú ejecutivo',
      createdAt: Date.now() - 86400000 * 3,
    },
    {
      id: 'exp-7',
      description: 'Boletos de cine y combo palomitas',
      amount: 34.0,
      category: 'entretenimiento',
      date: `${year}-${month}-16`,
      paymentMethod: 'Tarjeta de Crédito',
      notes: 'Estreno fin de semana',
      createdAt: Date.now() - 86400000 * 1,
    },
  ];
}
