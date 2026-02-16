
import { CategoryType, CategoryPercentages } from './types';

export const DEFAULT_PERCENTAGES: CategoryPercentages = {
  [CategoryType.ESENCIALES]: 50,
  [CategoryType.AHORRO]: 20,
  [CategoryType.INVERSION]: 10,
  [CategoryType.DESARROLLO]: 10,
  [CategoryType.OCIO]: 10,
};

export const CATEGORY_DETAILS: Record<CategoryType, { color: string; icon: string; description: string; subcategories?: string[] }> = {
  [CategoryType.ESENCIALES]: {
    color: 'bg-slate-400',
    icon: 'fa-house',
    description: 'Obligaciones y necesidades básicas.',
    subcategories: ['Comida', 'Transporte', 'Educación', 'Servicios', 'Medicinas']
  },
  [CategoryType.AHORRO]: {
    color: 'bg-emerald-500',
    icon: 'fa-piggy-bank',
    description: 'Seguridad financiera y fondo de emergencia.',
    subcategories: ['Fondo Emergencia', 'Meta Corto Plazo', 'Respaldo']
  },
  [CategoryType.INVERSION]: {
    color: 'bg-indigo-500',
    icon: 'fa-chart-line',
    description: 'Dinero que genera más dinero.',
    subcategories: ['CETES', 'Acciones/ETFs', 'Cripto', 'Negocios']
  },
  [CategoryType.DESARROLLO]: {
    color: 'bg-amber-500',
    icon: 'fa-book-open',
    description: 'Cursos, libros, salud y herramientas.',
    subcategories: ['Cursos', 'Libros', 'Gimnasio', 'Software']
  },
  [CategoryType.OCIO]: {
    color: 'bg-rose-400',
    icon: 'fa-glass-cheers',
    description: 'Disfrute, salidas y vida social.',
    subcategories: ['Salidas', 'Entretenimiento', 'Ropa', 'Streaming']
  },
  [CategoryType.INGRESO]: {
    color: 'bg-emerald-600',
    icon: 'fa-money-bill-trend-up',
    description: 'Entradas de dinero.',
    subcategories: ['Sueldo', 'Ventas', 'Freelance', 'Regalo']
  }
};
