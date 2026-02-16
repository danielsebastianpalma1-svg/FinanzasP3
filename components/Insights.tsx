
import React, { useState, useEffect } from 'react';
import { Transaction } from '../types';
import { getFinancialInsights } from '../services/geminiService';

interface InsightsProps {
  transactions: Transaction[];
  balance: number;
}

const Insights: React.FC<InsightsProps> = ({ transactions, balance }) => {
  const [insight, setInsight] = useState<string>('Analizando tu salud financiera...');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchInsight = async () => {
      setLoading(true);
      const res = await getFinancialInsights(transactions, balance);
      setInsight(res);
      setLoading(false);
    };

    fetchInsight();
  }, [transactions, balance]);

  return (
    <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <i className="fa-solid fa-wand-magic-sparkles text-4xl text-indigo-600"></i>
      </div>
      <div className="relative z-10">
        <h3 className="text-indigo-900 font-bold mb-2 flex items-center gap-2">
          <i className="fa-solid fa-brain"></i> Asesor Financiero IA
        </h3>
        {loading ? (
          <div className="flex gap-2 items-center py-2">
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-.3s]"></div>
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-.5s]"></div>
          </div>
        ) : (
          <p className="text-indigo-800 text-sm leading-relaxed whitespace-pre-wrap">{insight}</p>
        )}
      </div>
    </div>
  );
};

export default Insights;
