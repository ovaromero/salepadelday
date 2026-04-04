import { useState } from 'react';
import { useTournament } from './hooks/useTournament';
import TeamSetup from './components/TeamSetup';
import TournamentDashboard from './components/TournamentDashboard';
import Statistics from './components/Statistics';
import PastJourneys from './components/PastJourneys';
import ExpensesScreen from './components/ExpensesScreen';
import type { Team, Journey, Expenses } from './types';

type View = 'setup' | 'dashboard' | 'stats' | 'history' | 'expenses';

function App() {
  const { 
    state, 
    currentMatch, 
    nextMatch, 
    completedMatches, 
    startTournament, 
    finishMatch, 
    changeCurrentMatch,
    closeJourney,
    deleteJourney,
    resetTournament,
    updateJourneyExpenses,
  } = useTournament();
  
  const [view, setView] = useState<View>(() => {
    return state.active ? 'dashboard' : 'setup';
  });
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

  if (view === 'expenses' && selectedJourney) {
    return (
      <div className="min-h-screen bg-gray-50 py-6">
        <ExpensesScreen
          journey={selectedJourney}
          onSave={handleSaveExpenses}
          onBack={() => setView('history')}
        />
      </div>
    );
  }

  if (view === 'setup') {
    return (
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-2xl mx-auto px-4 mb-6 flex justify-end">
           <button 
             onClick={() => setView('history')}
             className="text-indigo-600 font-bold uppercase text-xs hover:bg-indigo-50 px-4 py-2 rounded-xl transition-all"
           >
             Ver Historial de Jornadas
           </button>
        </div>
        <TeamSetup onStart={handleStart} />
      </div>
    );
  }

  if (view === 'history') {
    return (
      <div className="min-h-screen bg-gray-50 py-6">
        <PastJourneys 
          journeys={state.journeys} 
          onDelete={deleteJourney} 
          onBack={() => setView(state.active ? 'dashboard' : 'setup')}
          onViewExpenses={openExpenses}
        />
      </div>
    );
  }

  if (view === 'stats') {
    return (
      <div className="min-h-screen bg-gray-50 py-6">
        <Statistics 
          teams={state.active?.teams || []} 
          completedMatches={completedMatches} 
          onBack={() => setView('dashboard')} 
        />
      </div>
    );
  }

  if (!state.active || !currentMatch) {
    setView('setup');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
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
    </div>
  );
}

export default App;
