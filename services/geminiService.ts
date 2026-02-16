
import { GoogleGenAI } from "@google/genai";
import { Transaction, CategoryType } from "../types";

export const getFinancialInsights = async (transactions: Transaction[], balance: number) => {
  if (transactions.length === 0) return "¡Hola! Empieza a registrar tus gastos para darte consejos personalizados sobre tu equilibrio financiero.";

  // Fix: Initialize GoogleGenAI according to strict @google/genai guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const summary = transactions.reduce((acc, t) => {
    if (t.type === 'EXPENSE') {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
    }
    return acc;
  }, {} as Record<string, number>);

  const prompt = `
    Analiza la situación financiera de este usuario basada en sus últimas transacciones y las 5 categorías de equilibrio.
    
    Balance Actual: $${balance}
    Resumen de Gastos por Categoría: ${JSON.stringify(summary)}
    
    Reglas de Oro del Usuario:
    1. Esenciales: Garantizar estabilidad básica.
    2. Ahorro: Seguridad y metas.
    3. Inversión: Hacer que el dinero trabaje.
    4. Desarrollo Personal: Aumentar potencial futuro.
    5. Ocio y Gustos: Disfrute y relaciones (incluyendo 'Salidas / Novia').
    
    Por favor, proporciona un consejo corto, motivador e intuitivo en español (máximo 150 palabras). 
    Dile si hay alguna categoría descuidada o sobre-explotada basándote en la lógica de "equilibrio financiero".
    Sé amable y usa un tono profesional pero cercano.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    // Fix: Access response.text as a property, not a method
    return response.text || "No pude generar consejos en este momento.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Ups, hubo un problema conectando con tu asesor financiero. Inténtalo más tarde.";
  }
};
