
import React, { useState, useEffect } from 'react';
import { Transaction, CategoryType, CategoryPercentages } from './types';
import { CATEGORY_DETAILS, DEFAULT_PERCENTAGES } from './constants';
import TransactionForm from './components/TransactionForm';
import Dashboard from './components/Dashboard';
import Insights from './components/Insights';
import Settings from './components/Settings';

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('equilibrio_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.transactions || [];
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [percentages, setPercentages] = useState<CategoryPercentages>(() => {
    const saved = localStorage.getItem('equilibrio_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.percentages || DEFAULT_PERCENTAGES;
      } catch (e) {
        return DEFAULT_PERCENTAGES;
      }
    }
    return DEFAULT_PERCENTAGES;
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'history' | 'settings'>('dashboard');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('equilibrio_data', JSON.stringify({ transactions, percentages }));
  }, [transactions, percentages]);

  const addTransaction = (t: Transaction) => {
    setTransactions(prev => [t, ...prev]);
    setIsAddModalOpen(false); // Cerrar modal tras añadir
  };

  const deleteTransaction = (id: string) => {
    if (confirm('¿Eliminar este movimiento?')) {
      setTransactions(prev => prev.filter(t => t.id !== id));
    }
  };

  const totalIncome = transactions
    .filter(t => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col max-w-5xl mx-auto md:pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg">
            <i className="fa-solid fa-coins"></i>
          </div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight">Equilibrio</h1>
        </div>
        <div className="hidden md:flex gap-1 bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${activeTab === 'dashboard' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Tablero
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${activeTab === 'history' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Historial
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${activeTab === 'settings' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Ajustes
          </button>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="hidden md:flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase hover:bg-slate-800 transition-all shadow-md active:scale-95"
        >
          <i className="fa-solid fa-plus"></i>
          Nuevo
        </button>
      </header>

      {/* Modal de Transacción Global */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsAddModalOpen(false)}
          ></div>
          <div className="relative w-full max-w-lg bg-white rounded-t-[32px] md:rounded-[32px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
            <div className="h-1.5 w-12 bg-slate-200 rounded-full mx-auto mt-3 md:hidden"></div>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Nuevo Movimiento</h2>
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
              <TransactionForm onAdd={addTransaction} />
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 space-y-8 pb-24 md:pb-0">
        {activeTab === 'dashboard' && (
          <>
            <Insights transactions={transactions} balance={balance} />
            <Dashboard transactions={transactions} percentages={percentages} />
            
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Últimos Movimientos</h3>
                <button onClick={() => setActiveTab('history')} className="text-[10px] font-black text-slate-400 hover:text-slate-900 uppercase">Ver Todo</button>
              </div>
              <div className="space-y-3">
                {transactions.slice(0, 8).map((t) => (
                  <div key={t.id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${CATEGORY_DETAILS[t.category].color} shadow-sm`}>
                        <i className={`fa-solid ${CATEGORY_DETAILS[t.category].icon}`}></i>
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm leading-none mb-1">{t.description}</p>
                        <p className="text-[10px] text-slate-400 uppercase font-bold">{t.category}{t.subcategory ? ` • ${t.subcategory}` : ''}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-black ${t.type === 'INCOME' ? 'text-emerald-500' : 'text-slate-900'}`}>
                        {t.type === 'INCOME' ? '+' : '-'}${t.amount.toLocaleString()}
                      </p>
                      <p className="text-[9px] text-slate-300 uppercase font-black">{new Date(t.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
                {transactions.length === 0 && (
                  <div className="text-center py-12 text-slate-300">
                    <i className="fa-solid fa-ghost text-4xl mb-4 opacity-20"></i>
                    <p className="text-xs font-bold uppercase tracking-widest">Aún no hay nada aquí</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {activeTab === 'history' && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 overflow-hidden">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Historial</h2>
              <button 
                onClick={() => {
                  if(confirm('¿Seguro que quieres borrar todos los datos definitivamente?')) {
                    setTransactions([]);
                    localStorage.removeItem('equilibrio_data');
                  }
                }}
                className="bg-rose-50 text-rose-500 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-rose-100 transition-colors"
              >
                Limpiar datos
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-50">
                    <th className="pb-4 font-black text-[10px] text-slate-400 uppercase tracking-widest px-4">Fecha</th>
                    <th className="pb-4 font-black text-[10px] text-slate-400 uppercase tracking-widest px-4">Concepto</th>
                    <th className="pb-4 font-black text-[10px] text-slate-400 uppercase tracking-widest px-4">Categoría</th>
                    <th className="pb-4 font-black text-[10px] text-slate-400 uppercase tracking-widest px-4 text-right">Monto</th>
                    <th className="pb-4 px-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {transactions.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-4 text-xs font-bold text-slate-500">{new Date(t.date).toLocaleDateString()}</td>
                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-800 text-sm">{t.description}</div>
                        <div className="text-[10px] text-slate-400 font-medium">{t.subcategory}</div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase text-white shadow-sm ${CATEGORY_DETAILS[t.category].color}`}>
                          {t.category}
                        </span>
                      </td>
                      <td className={`py-4 px-4 text-right font-black ${t.type === 'INCOME' ? 'text-emerald-500' : 'text-slate-900'}`}>
                        {t.type === 'INCOME' ? '+' : '-'}${t.amount.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button 
                          onClick={() => deleteTransaction(t.id)}
                          className="text-slate-300 hover:text-rose-500 transition-colors p-2"
                        >
                          <i className="fa-solid fa-trash-can"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-2xl mx-auto">
            <Settings 
              percentages={percentages} 
              onSave={(p) => {
                setPercentages(p);
                setActiveTab('dashboard');
              }} 
            />
          </div>
        )}
      </main>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-slate-100 px-6 py-3 flex justify-between items-center z-50 rounded-t-[40px] shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-1 w-12 transition-all ${activeTab === 'dashboard' ? 'text-slate-900 scale-110' : 'text-slate-300'}`}
        >
          <i className="fa-solid fa-house-chimney text-lg"></i>
          <span className="text-[9px] font-black uppercase tracking-tighter">Inicio</span>
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`flex flex-col items-center gap-1 w-12 transition-all ${activeTab === 'history' ? 'text-slate-900 scale-110' : 'text-slate-300'}`}
        >
          <i className="fa-solid fa-receipt text-lg"></i>
          <span className="text-[9px] font-black uppercase tracking-tighter">Lista</span>
        </button>
        
        {/* BOTÓN CENTRAL: AHORA ACTIVA EL MODAL */}
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="w-16 h-16 bg-slate-900 rounded-3xl flex items-center justify-center text-white -mt-14 shadow-[0_8px_25px_rgba(0,0,0,0.2)] active:scale-90 transition-all border-[6px] border-slate-50 ring-4 ring-slate-900/5"
        >
          <i className="fa-solid fa-plus text-2xl"></i>
        </button>

        <button 
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center gap-1 w-12 transition-all ${activeTab === 'settings' ? 'text-slate-900 scale-110' : 'text-slate-300'}`}
        >
          <i className="fa-solid fa-sliders text-lg"></i>
          <span className="text-[9px] font-black uppercase tracking-tighter">Plan</span>
        </button>
        <div className="w-12 h-1 flex flex-col items-center justify-center">
            {/* Espaciado para simular 5 botones o mantener simetría */}
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-200">
                <i className="fa-solid fa-user text-sm"></i>
            </div>
        </div>
      </nav>
    </div>
  );
};

export default App;
