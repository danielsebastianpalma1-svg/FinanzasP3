
import React, { useState } from 'react';
import { Transaction, TransactionType, CategoryType } from '../types';
import { CATEGORY_DETAILS } from '../constants';

interface TransactionFormProps {
  onAdd: (transaction: Transaction) => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onAdd }) => {
  const [type, setType] = useState<TransactionType>('EXPENSE');
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<CategoryType>(CategoryType.ESENCIALES);
  const [subcategory, setSubcategory] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) return;

    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      amount: Number(amount),
      type,
      category: type === 'INCOME' ? CategoryType.INGRESO : category,
      subcategory: type === 'INCOME' ? 'General' : subcategory,
      description: description || (type === 'INCOME' ? 'Ingreso' : 'Gasto'),
      date: new Date().toISOString(),
    };

    onAdd(newTransaction);
    // No reseteamos el estado aquí porque el modal se cierra y el componente se desmonta
  };

  const categories = Object.keys(CATEGORY_DETAILS).filter(c => c !== CategoryType.INGRESO) as CategoryType[];

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex bg-slate-100 p-1 rounded-2xl">
        <button
          type="button"
          onClick={() => setType('EXPENSE')}
          className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
            type === 'EXPENSE' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <i className="fa-solid fa-minus-circle mr-2 opacity-50"></i> Gasto
        </button>
        <button
          type="button"
          onClick={() => {
            setType('INCOME');
            setCategory(CategoryType.INGRESO);
          }}
          className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
            type === 'INCOME' ? 'bg-emerald-500 shadow-sm text-white' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <i className="fa-solid fa-plus-circle mr-2 opacity-50"></i> Ingreso
        </button>
      </div>

      <div>
        <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Monto del Movimiento</label>
        <div className="relative">
          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 font-black text-2xl">$</span>
          <input
            type="number"
            inputMode="decimal"
            step="0.01"
            autoFocus
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full pl-12 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-slate-900 transition-all text-3xl font-black text-slate-800"
            required
          />
        </div>
      </div>

      {type === 'EXPENSE' && (
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-1">
            <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Categoría</label>
            <select
              value={category}
              onChange={(e) => {
                const newCat = e.target.value as CategoryType;
                setCategory(newCat);
                setSubcategory(CATEGORY_DETAILS[newCat].subcategories?.[0] || '');
              }}
              className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-slate-900 transition-all font-bold text-slate-700 text-sm appearance-none"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="col-span-1">
            <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Etiqueta</label>
            <select
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
              className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-slate-900 transition-all font-bold text-slate-700 text-sm appearance-none"
            >
              <option value="">Ninguna</option>
              {CATEGORY_DETAILS[category].subcategories?.map((sub) => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div>
        <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">¿En qué fue? (Opcional)</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ej: Cena con la novia, Gasolina, etc."
          className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-slate-900 transition-all font-bold text-slate-700"
        />
      </div>

      <button
        type="submit"
        className="w-full py-5 bg-slate-900 text-white font-black text-lg rounded-2xl hover:bg-slate-800 active:scale-95 transition-all shadow-[0_10px_20px_rgba(0,0,0,0.15)] flex items-center justify-center gap-3"
      >
        <i className="fa-solid fa-check-circle"></i> Confirmar Movimiento
      </button>
    </form>
  );
};

export default TransactionForm;
