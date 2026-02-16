
import React, { useState, useEffect } from 'react';
import { CategoryType, CategoryPercentages } from '../types';
import { CATEGORY_DETAILS } from '../constants';

interface SettingsProps {
  percentages: CategoryPercentages;
  onSave: (p: CategoryPercentages) => void;
}

const Settings: React.FC<SettingsProps> = ({ percentages, onSave }) => {
  const [localPercentages, setLocalPercentages] = useState<CategoryPercentages>(percentages);
  
  // Fix: Explicitly cast to number[] to avoid 'unknown' type error in reduce
  const total = (Object.values(localPercentages) as number[]).reduce((a, b) => a + b, 0);

  const handleChange = (cat: string, val: string) => {
    const num = parseInt(val) || 0;
    setLocalPercentages(prev => ({ ...prev, [cat]: num }));
  };

  const handleSave = () => {
    if (total !== 100) {
      alert("La suma de los porcentajes debe ser exactamente 100%");
      return;
    }
    onSave(localPercentages);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Tu Estrategia de Dinero</h2>
        <p className="text-sm text-slate-500">Define cómo quieres dividir cada peso que ingresas.</p>
      </div>

      <div className="space-y-4">
        {Object.entries(localPercentages).map(([cat, val]) => (
          <div key={cat} className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${CATEGORY_DETAILS[cat as CategoryType].color}`}>
              <i className={`fa-solid ${CATEGORY_DETAILS[cat as CategoryType].icon}`}></i>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-400 uppercase">{cat}</label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={val}
                  onChange={(e) => handleChange(cat, e.target.value)}
                  className="flex-1 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-slate-900"
                />
                <div className="flex items-center gap-1 w-16">
                  <input
                    type="number"
                    value={val}
                    onChange={(e) => handleChange(cat, e.target.value)}
                    className="w-full text-right font-bold text-slate-800 focus:outline-none"
                  />
                  <span className="text-slate-400 text-sm">%</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={`p-4 rounded-xl flex justify-between items-center ${total === 100 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
        <span className="font-bold">Total Asignado:</span>
        <span className="text-xl font-black">{total}%</span>
      </div>

      <button
        onClick={handleSave}
        disabled={total !== 100}
        className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg"
      >
        Actualizar Estrategia
      </button>
    </div>
  );
};

export default Settings;
