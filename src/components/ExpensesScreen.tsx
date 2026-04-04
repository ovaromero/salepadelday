import { useState, type FC } from 'react';
import { ChevronLeft, DollarSign, Save, Edit3, Minus, Plus, TrendingUp, Calendar } from 'lucide-react';
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

const EXPENSE_CONFIG: { key: ExpenseCategory; label: string; icon: string; color: string }[] = [
  { key: 'court', label: 'Cancha', icon: '🎾', color: 'text-sport-600 dark:text-sport-400' },
  { key: 'food', label: 'Comida', icon: '🍔', color: 'text-energy-600 dark:text-energy-400' },
  { key: 'soda', label: 'Gaseosa', icon: '🥤', color: 'text-blue-600 dark:text-blue-400' },
  { key: 'beer', label: 'Cerveza', icon: '🍺', color: 'text-amber-600 dark:text-amber-400' },
  { key: 'balls', label: 'Pelotitas', icon: '🟢', color: 'text-court-600 dark:text-court-400' },
];

const ExpensesScreen: FC<ExpensesScreenProps> = ({ journey, onSave, onBack }) => {
  const [expenses, setExpenses] = useState<Expenses>(() => journey.expenses || getDefaultExpenses(journey.teams.length));
  const [isEditing, setIsEditing] = useState(!journey.expenses);

  const getCategoryTotal = (category: ExpenseCategory) => expenses[category]?.amount || 0;
  const getCategoryPerPlayer = (category: ExpenseCategory) => {
    const item = expenses[category];
    return item?.players > 0 ? Math.round(item.amount / item.players) : 0;
  };

  const total = EXPENSE_CONFIG.reduce((sum, { key }) => sum + getCategoryTotal(key), 0);

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
    <div className="min-h-screen px-3 py-4 sm:p-6 flex flex-col">
      <div className="max-w-2xl mx-auto w-full flex flex-col min-h-screen">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={onBack} className="w-10 h-10 rounded-xl bg-white dark:bg-court-800 border border-court-200 dark:border-court-700 flex items-center justify-center hover:bg-court-50 dark:hover:bg-court-700 hover:shadow-md transition-all">
            <ChevronLeft className="w-5 h-5 text-court-600 dark:text-court-400" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-display font-black text-court-900 dark:text-white tracking-tight">Gastos</h1>
              <p className="text-[10px] font-bold text-court-400 dark:text-court-500 uppercase tracking-wider">Control de gastos</p>
            </div>
          </div>
        </div>

        {/* Journey info card */}
        <div className="bg-white dark:bg-court-800 rounded-2xl p-4 shadow-md border border-court-100 dark:border-court-700 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-900/30 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-violet-500 dark:text-violet-400" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-court-400 dark:text-court-500 uppercase tracking-wider">{formatDate(journey.date)}</p>
              <p className="text-sm font-display font-black text-court-800 dark:text-court-100 uppercase">Jornada de {journey.teams.length} Equipos</p>
            </div>
          </div>
        </div>

        {/* Expense cards */}
        <div className="space-y-3 mb-5">
          <h2 className="text-xs font-display font-black uppercase tracking-wider text-court-400 dark:text-court-500 ml-1">Categorías</h2>
          
          {EXPENSE_CONFIG.map(({ key, label, icon, color }) => (
            <div key={key} className="bg-white dark:bg-court-800 rounded-2xl p-4 shadow-sm border border-court-100 dark:border-court-700">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{icon}</span>
                  <span className={`font-display font-bold text-court-800 dark:text-court-100 text-sm`}>{label}</span>
                </div>
                <span className={`font-display font-black text-lg ${color}`}>
                  ${getCategoryTotal(key).toLocaleString()}
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-court-300 dark:text-court-500 font-bold text-sm">$</span>
                  <input
                    type="number"
                    value={expenses[key].amount || ''}
                    onChange={(e) => handleAmountChange(key, e.target.value)}
                    disabled={!isEditing}
                    className="w-full bg-court-50 dark:bg-court-700 border border-court-200 dark:border-court-600 rounded-xl py-2.5 pl-7 pr-3 text-right font-display font-bold text-court-800 dark:text-court-100 text-sm focus:ring-2 focus:ring-sport-400/50 outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    min="0"
                    placeholder="0"
                  />
                </div>
                
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handlePlayersChange(key, -1)}
                    disabled={!isEditing || expenses[key].players <= 1}
                    className="w-8 h-8 rounded-lg bg-court-100 dark:bg-court-700 text-court-500 dark:text-court-400 font-bold text-sm hover:bg-court-200 dark:hover:bg-court-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center font-display font-black text-sport-600 dark:text-sport-400 text-sm">{expenses[key].players}</span>
                  <button
                    onClick={() => handlePlayersChange(key, 1)}
                    disabled={!isEditing}
                    className="w-8 h-8 rounded-lg bg-court-100 dark:bg-court-700 text-court-500 dark:text-court-400 font-bold text-sm hover:bg-court-200 dark:hover:bg-court-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                
                <div className="text-right min-w-[60px]">
                  <p className="text-[9px] text-court-400 dark:text-court-500 uppercase font-bold">Por jugador</p>
                  <p className="font-display font-bold text-court-600 dark:text-court-400 text-sm">${getCategoryPerPlayer(key).toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Total card */}
        <div className="sport-gradient rounded-2xl p-5 shadow-xl shadow-sport-500/20 mb-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-sport-100" />
              <span className="text-sport-100 font-bold uppercase text-sm">Total</span>
            </div>
            <span className="text-white font-display font-black text-2xl sm:text-3xl">${total.toLocaleString()}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pb-6">
          <button
            onClick={onBack}
            className="flex-1 flex items-center justify-center gap-2 bg-court-100 dark:bg-court-700 text-court-600 dark:text-court-300 py-3.5 rounded-2xl font-semibold uppercase tracking-tight hover:bg-court-200 dark:hover:bg-court-600 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            Volver
          </button>
          {isEditing ? (
            <button
              onClick={handleSave}
              className="flex-1 flex items-center justify-center gap-2 sport-gradient text-white py-3.5 rounded-2xl font-display font-black uppercase tracking-tight hover:shadow-xl hover:shadow-sport-500/30 transition-all"
            >
              <Save className="w-4 h-4" />
              Guardar
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex-1 flex items-center justify-center gap-2 sport-gradient text-white py-3.5 rounded-2xl font-display font-black uppercase tracking-tight hover:shadow-xl hover:shadow-sport-500/30 transition-all"
            >
              <Edit3 className="w-4 h-4" />
              Modificar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpensesScreen;