import { useState, type FC } from 'react';
import type { Expenses, Journey, ExpenseCategory } from '../types';

interface ExpensesScreenProps {
  journey: Journey;
  onSave: (expenses: Expenses) => void;
  onBack: () => void;
}

const getDefaultExpenses = (teamsCount: number): Expenses => {
  const defaultPlayers = teamsCount * 2;
  return {
    court: { amount: 0, players: defaultPlayers },
    food: { amount: 0, players: defaultPlayers },
    soda: { amount: 0, players: defaultPlayers },
    beer: { amount: 0, players: defaultPlayers },
    balls: { amount: 0, players: defaultPlayers },
  };
};

const EXPENSE_LABELS: { key: ExpenseCategory; label: string; icon: string }[] = [
  { key: 'court', label: 'Cancha', icon: '🎾' },
  { key: 'food', label: 'Comida', icon: '🍔' },
  { key: 'soda', label: 'Gaseosa', icon: '🥤' },
  { key: 'beer', label: 'Cerveza', icon: '🍺' },
  { key: 'balls', label: 'Pelotitas', icon: '⚫' },
];

const ExpensesScreen: FC<ExpensesScreenProps> = ({ journey, onSave, onBack }) => {
  const [expenses, setExpenses] = useState<Expenses>(() => journey.expenses || getDefaultExpenses(journey.teams.length));
  const [isEditing, setIsEditing] = useState(!journey.expenses);

  const getCategoryTotal = (category: ExpenseCategory) => expenses[category]?.amount || 0;
  const getCategoryPerPlayer = (category: ExpenseCategory) => {
    const item = expenses[category];
    return item?.players > 0 ? Math.round(item.amount / item.players) : 0;
  };

  const total = EXPENSE_LABELS.reduce((sum, { key }) => sum + getCategoryTotal(key), 0);

  const handleAmountChange = (key: ExpenseCategory, value: string) => {
    const num = parseInt(value) || 0;
    setExpenses(prev => ({
      ...prev,
      [key]: { ...prev[key], amount: num }
    }));
  };

  const handlePlayersChange = (key: ExpenseCategory, delta: number) => {
    setExpenses(prev => ({
      ...prev,
      [key]: { ...prev[key], players: Math.max(1, prev[key].players + delta) }
    }));
  };

  const handleSave = () => {
    onSave(expenses);
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="max-w-2xl mx-auto px-2 sm:p-4 flex flex-col min-h-screen">
      <div className="flex items-center mb-6 sm:mb-8">
        <button onClick={onBack} className="mr-2 sm:mr-4 p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-800 tracking-tighter uppercase italic">Gastos</h1>
      </div>

      <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-lg border border-gray-100 mb-6">
        <p className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-1">{formatDate(journey.date)}</p>
        <p className="text-lg sm:text-xl font-black text-gray-800 uppercase">Jornada de {journey.teams.length} Equipos</p>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* EXPENSE TABLE */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-lg border border-gray-100 overflow-x-auto">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-4 ml-2">Cargar Gastos</h2>
          
          <table className="w-full min-w-[400px]">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 text-xs font-bold text-gray-400 uppercase">Categoría</th>
                <th className="text-center py-3 text-xs font-bold text-gray-400 uppercase">Monto</th>
                <th className="text-center py-3 text-xs font-bold text-gray-400 uppercase">Jugadores</th>
                <th className="text-right py-3 text-xs font-bold text-gray-400 uppercase">Por Jugador</th>
              </tr>
            </thead>
            <tbody>
              {EXPENSE_LABELS.map(({ key, label, icon }) => (
                <tr key={key} className="border-b border-gray-50">
                  <td className="py-3">
                    <span className="flex items-center gap-2 text-sm sm:text-base font-bold text-gray-700">
                      <span className="text-lg">{icon}</span> {label}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <div className="relative">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">$</span>
                      <input
                        type="number"
                        value={expenses[key].amount || ''}
                        onChange={(e) => handleAmountChange(key, e.target.value)}
                        disabled={!isEditing}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg py-1.5 pl-6 pr-2 text-right font-black text-gray-800 text-sm focus:ring-2 focus:ring-indigo-300 outline-none disabled:opacity-60"
                        min="0"
                      />
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => handlePlayersChange(key, -1)}
                        disabled={!isEditing || expenses[key].players <= 1}
                        className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 font-bold text-sm hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-black text-indigo-600 text-sm">{expenses[key].players}</span>
                      <button
                        onClick={() => handlePlayersChange(key, 1)}
                        disabled={!isEditing}
                        className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 font-bold text-sm hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <span className="font-black text-gray-600 text-sm">${getCategoryPerPlayer(key).toLocaleString()}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* TOTAL */}
        <div className="bg-indigo-600 rounded-3xl p-4 sm:p-6 shadow-xl">
          <div className="flex justify-between items-center">
            <span className="text-indigo-200 font-bold uppercase text-sm">Total</span>
            <span className="text-white font-black text-2xl sm:text-3xl">${total.toLocaleString()}</span>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-3">
          {isEditing ? (
            <>
              <button
                onClick={onBack}
                className="flex-1 bg-gray-100 text-gray-600 py-3 sm:py-4 rounded-2xl font-bold uppercase tracking-tight hover:bg-gray-200 transition-all"
              >
                Volver
              </button>
              <button
                onClick={handleSave}
                className="flex-1 bg-green-500 text-white py-3 sm:py-4 rounded-2xl font-black uppercase tracking-tight hover:bg-green-600 shadow-lg transition-all"
              >
                Guardar
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onBack}
                className="flex-1 bg-gray-100 text-gray-600 py-3 sm:py-4 rounded-2xl font-bold uppercase tracking-tight hover:bg-gray-200 transition-all"
              >
                Volver
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 bg-indigo-600 text-white py-3 sm:py-4 rounded-2xl font-black uppercase tracking-tight hover:bg-indigo-700 shadow-lg transition-all"
              >
                Modificar
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpensesScreen;