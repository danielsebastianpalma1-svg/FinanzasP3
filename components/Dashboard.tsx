
import React from 'react';
import { Transaction, CategoryType, CategorySummary, CategoryPercentages } from '../types';
import { CATEGORY_DETAILS } from '../constants';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface DashboardProps {
  transactions: Transaction[];
  percentages: CategoryPercentages;
}

const Dashboard: React.FC<DashboardProps> = ({ transactions, percentages }) => {
  const totalIncome = transactions
    .filter(t => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  const categoryData: CategorySummary[] = (Object.keys(percentages) as (keyof CategoryPercentages)[])
    .map(cat => {
      const spent = transactions
        .filter(t => t.category === cat && t.type === 'EXPENSE')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const budgeted = (totalIncome * percentages[cat]) / 100;
      const remaining = budgeted - spent;
      const percentageUsed = budgeted > 0 ? Math.min((spent / budgeted) * 100, 100) : 0;

      return {
        category: cat,
        totalSpent: spent,
        budgeted,
        remaining,
        percentageUsed,
        color: CATEGORY_DETAILS[cat].color,
        icon: CATEGORY_DETAILS[cat].icon
      };
    });

  const chartData = categoryData
    .filter(c => c.totalSpent > 0)
    .map(c => ({
      name: c.category,
      value: c.totalSpent,
      color: c.color.replace('bg-', '')
    }));

  const colorMap: Record<string, string> = {
    'slate-400': '#94a3b8',
    'emerald-500': '#10b981',
    'indigo-500': '#6366f1',
    'amber-500': '#f59e0b',
    'rose-400': '#fb7185'
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl overflow-hidden relative group">
          <div className="relative z-10">
            <p className="text-slate-400 text-xs font-bold mb-1 uppercase tracking-widest">Balance Total</p>
            <h2 className="text-4xl font-black">${balance.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</h2>
          </div>
          <i className="fa-solid fa-vault absolute -right-6 -bottom-6 text-9xl opacity-10 group-hover:scale-110 transition-transform"></i>
        </div>
        
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-1">
            <i className="fa-solid fa-circle-arrow-up text-emerald-500"></i>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Ingresos</p>
          </div>
          <h2 className="text-2xl font-black text-slate-800">${totalIncome.toLocaleString()}</h2>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-1">
            <i className="fa-solid fa-circle-arrow-down text-rose-500"></i>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Gastos</p>
          </div>
          <h2 className="text-2xl font-black text-slate-800">${totalExpenses.toLocaleString()}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Distribución de Sobres */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categoryData.map((cat) => (
            <div key={cat.category} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${cat.color} shadow-sm`}>
                  <i className={`fa-solid ${cat.icon}`}></i>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{cat.category}</p>
                  <p className={`text-sm font-black ${cat.remaining < 0 ? 'text-rose-500' : 'text-slate-800'}`}>
                    ${cat.remaining.toLocaleString()} <span className="text-[10px] text-slate-400">libres</span>
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                  <span>Gastado: ${cat.totalSpent.toLocaleString()}</span>
                  <span>Meta: ${cat.budgeted.toLocaleString()}</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`${cat.color} h-full transition-all duration-1000 ease-out rounded-full`}
                    style={{ width: `${cat.percentageUsed}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Gráfico circular pequeño */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Uso del Dinero</h3>
          {totalExpenses > 0 ? (
            <div className="w-full h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colorMap[entry.color] || '#cbd5e1'} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => `$${value.toLocaleString()}`}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="text-center mt-2">
                <p className="text-2xl font-black text-slate-800">{Math.round((totalExpenses/totalIncome)*100 || 0)}%</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Gasto total vs Ingreso</p>
              </div>
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-slate-300 italic text-sm">
              Esperando gastos...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
