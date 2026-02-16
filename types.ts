
export enum CategoryType {
  ESENCIALES = 'Esenciales',
  AHORRO = 'Ahorro o Estabilidad',
  INVERSION = 'Inversión',
  DESARROLLO = 'Desarrollo Personal',
  OCIO = 'Ocio y Gustos',
  INGRESO = 'Ingresos'
}

export type TransactionType = 'INCOME' | 'EXPENSE';

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: CategoryType;
  subcategory?: string;
  description: string;
  date: string;
}

export type CategoryPercentages = Record<Exclude<CategoryType, CategoryType.INGRESO>, number>;

export interface CategorySummary {
  category: CategoryType;
  totalSpent: number;
  budgeted: number;
  remaining: number;
  percentageUsed: number;
  color: string;
  icon: string;
}
