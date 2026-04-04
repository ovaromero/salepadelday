import { useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { useTournament } from './hooks/useTournament';
import TeamSetup from './components/TeamSetup';
import TournamentDashboard from './components/TournamentDashboard';
import Statistics from './components/Statistics';
import PastJourneys from './components/PastJourneys';
import ExpensesScreen from './components/ExpensesScreen';
import type { Team, Journey, Expenses } from './types';

type View = 'setup' | 'dashboard' | 'stats' | 'history' | 'expenses';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all border"
      style={{
        backgroundColor: theme === 'dark' ? '#1e293b' : '#f0fdf4',
        borderColor: theme === 'dark' ? '#334155' : '#22c55e',
        color: theme === 'dark' ? '#f1f5f9' : '#16a34a'
      }}
    >
      {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
      {theme === 'dark' ? 'Claro' : 'Oscuro'}
    </button>
  );
}

function AppContent() {
  const { state, currentMatch, nextMatch, completedMatches, startTournament, finishMatch, changeCurrentMatch, closeJourney, deleteJourney, resetTournament, updateJourneyExpenses } = useTournament();
  
  const [view, setView] = useState<View>(() => state.active ? 'dashboard' : 'setup');
  const [selectedJourney, setSelectedJourney] = useState<Journey | null>(null);

  const handleStart = (teams: Team[]) => {
    startTournament(teams);
    setView('dashboard');
  };

  const handleReset = () => {
    if (confirm('¿Estás seguro que querés resetear el tablero actual? Se perderán los resultados de este día si no cerraste la jornada.')) {
      resetTournament();
      setView('setup');
    }
  };

  const handleCloseJourney = () => {
    closeJourney();
    setView('setup');
  };

  const handleSaveExpenses = (expenses: Expenses) => {
    if (selectedJourney) {
      updateJourneyExpenses(selectedJourney.id, expenses);
      setSelectedJourney(prev => prev ? { ...prev, expenses } : null);
    }
  };

  const openExpenses = (journey: Journey) => {
    setSelectedJourney(journey);
    setView('expenses');
  };

  // Expenses view - no toggle needed, ExpensesScreen has its own
  if (view === 'expenses' && selectedJourney) {
    return <ExpensesScreen journey={selectedJourney} onSave={handleSaveExpenses} onBack={() => setView('history')} />;
  }

  // Setup view
  if (view === 'setup') {
    return (
      <div className="min-h-screen">
        <div className="max-w-2xl mx-auto px-4 mb-4 flex justify-end items-center gap-3">
          <ThemeToggle />
          <button onClick={() => setView('history')} className="flex items-center gap-1.5 text-sport-600 font-semibold text-xs hover:bg-sport-50 px-4 py-2 rounded-xl transition-all">
            Ver Historial
          </button>
        </div>
        <TeamSetup onStart={handleStart} />
      </div>
    );
  }

  // History view
  if (view === 'history') {
    return (
      <>
        <div className="flex justify-end px-4 pt-4"><ThemeToggle /></div>
        <PastJourneys journeys={state.journeys} onDelete={deleteJourney} onBack={() => setView(state.active ? 'dashboard' : 'setup')} onViewExpenses={openExpenses} />
      </>
    );
  }

  // Stats view
  if (view === 'stats') {
    return (
      <>
        <div className="flex justify-end px-4 pt-4"><ThemeToggle /></div>
        <Statistics teams={state.active?.teams || []} completedMatches={completedMatches} onBack={() => setView('dashboard')} />
      </>
    );
  }

  // Dashboard - no toggle in dashboard, it has its own controls
  if (!state.active || !currentMatch) {
    setView('setup');
    return null;
  }

  return (
    <>
      <div className="flex justify-end px-4 pt-4"><ThemeToggle /></div>
      <TournamentDashboard
      teams={state.active.teams}
      currentMatch={currentMatch}
      nextMatch={nextMatch}
      onFinishMatch={finishMatch}
      onChangeMatch={changeCurrentMatch}
      onViewStats={() => setView('stats')}
      onCloseJourney={handleCloseJourney}
      onReset={handleReset}
    />
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;