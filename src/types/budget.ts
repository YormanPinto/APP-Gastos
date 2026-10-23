export type CategoryId = string;

export interface CategoryInfo {
  id: CategoryId;
  name: string;
  color: string; // Tailwind color class or hex
  bgLight: string;
  textColor: string;
  iconName: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: CategoryId;
  date: string; // YYYY-MM-DD
  notes?: string;
  paymentMethod?: string;
  createdAt: number;
}

export type TrafficLightStatus = 'healthy' | 'warning' | 'exceeded';

export interface TrafficLightResult {
  status: TrafficLightStatus;
  percentage: number; // e.g. 68.5
  totalSpent: number;
  monthlyBudget: number;
  remainingAmount: number; // >= 0
  exceededAmount: number; // > 0 if exceeded, else 0
  statusTitle: string;
  statusDescription: string;
}

export interface CategorySpending {
  category: CategoryId;
  categoryInfo: CategoryInfo;
  amount: number;
  percentageOfBudget: number;
  percentageOfTotalSpend: number;
  count: number;
}
