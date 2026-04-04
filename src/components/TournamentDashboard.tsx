import { useState, type FC } from 'react';
import type { Match, MatchResult, Team } from '../types';
import ResultModal from './ResultModal';
import MatchSelectionModal from './MatchSelectionModal';

interface TournamentDashboardProps {
  teams: Team[];
  currentMatch: Match;
  nextMatch?: Match;
  onFinishMatch: (result: MatchResult) => void;
  onChangeMatch: (team1Id: string, team2Id: string) => void;
  onViewStats: () => void;
  onCloseJourney: () => void;
  onReset: () => void;
}

const TournamentDashboard: FC<TournamentDashboardProps> = ({
  teams,
  currentMatch,
  nextMatch,
  onFinishMatch,
  onChangeMatch,
  onViewStats,
  onCloseJourney,
  onReset,
}) => {
  const [showResultModal, setShowResultModal] = useState(false);
  const [showChangeModal, setShowChangeModal] = useState(false);

  const handleSaveResult = (result: MatchResult) => {
    onFinishMatch(result);
    setShowResultModal(false);
  };

  const handleChangeMatch = (t1: string, t2: string) => {
    onChangeMatch(t1, t2);
    setShowChangeModal(false);
  };

  const handleCloseJourney = () => {
    if (confirm('¿Cerrar jornada? Se guardarán las estadísticas y se reseteará el tablero para un nuevo día.')) {
      onCloseJourney();
    }
  };

  return (
    <div className="max-w-xl mx-auto p-2 sm:p-4 flex flex-col min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 sm:mb-8">
        <h1 className="text-2xl font-black text-indigo-600 tracking-tighter uppercase italic">SalePadelDay</h1>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={onViewStats}
            className="bg-gray-100 text-gray-700 font-bold px-2 sm:px-3 py-2 rounded-xl text-xs hover:bg-gray-200 uppercase"
          >
            Estadísticas
          </button>
          <button
            onClick={handleCloseJourney}
            className="bg-indigo-50 text-indigo-600 font-bold px-2 sm:px-3 py-2 rounded-xl text-xs hover:bg-indigo-100 uppercase"
          >
            Cerrar
          </button>
          <button
            onClick={onReset}
            className="bg-red-50 text-red-500 font-bold px-2 sm:px-3 py-2 rounded-xl text-xs hover:bg-red-100 uppercase"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="flex-1 space-y-8">
        {/* CURRENT MATCH */}
        <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-8xl -mr-4 -mt-4 uppercase italic leading-none">LIVE</div>
          <div className="flex justify-between items-center mb-6 relative z-10">
            <p className="font-bold uppercase tracking-[0.3em] text-indigo-200 text-sm">Ahora Jugando</p>
            <button 
              onClick={() => setShowChangeModal(true)}
              className="text-xs font-bold uppercase bg-indigo-500/50 hover:bg-indigo-500 px-3 py-1 rounded-full transition-colors"
            >
              Cambiar Rivales
            </button>
          </div>
          
          <div className="flex items-center justify-between relative z-10">
            <div className="flex-1 text-center">
              <h3 className="text-3xl font-black mb-2 leading-tight uppercase tracking-tighter">{currentMatch.team1.name}</h3>
              {currentMatch.team1.players.some(p => p.name) && (
                <p className="text-sm font-bold text-indigo-100 uppercase tracking-wide">
                  {currentMatch.team1.players[0].name} <br/> {currentMatch.team1.players[1].name}
                </p>
              )}
            </div>
            
            <div className="px-4 font-black text-4xl italic text-indigo-300 transform -skew-x-12 mx-2">VS</div>
            
            <div className="flex-1 text-center">
              <h3 className="text-3xl font-black mb-2 leading-tight uppercase tracking-tighter">{currentMatch.team2.name}</h3>
              {currentMatch.team2.players.some(p => p.name) && (
                <p className="text-sm font-bold text-indigo-100 uppercase tracking-wide">
                  {currentMatch.team2.players[0].name} <br/> {currentMatch.team2.players[1].name}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={() => setShowResultModal(true)}
            className="w-full mt-10 bg-white text-indigo-600 py-5 rounded-2xl font-black uppercase text-xl tracking-tighter hover:bg-indigo-50 active:scale-95 transition-all shadow-xl shadow-indigo-900/40 relative z-10"
          >
            Finalizar Partido
          </button>
        </div>

        {/* NEXT MATCH */}
        {nextMatch && (
          <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2rem] p-6">
            <p className="text-center font-bold uppercase tracking-widest text-gray-400 mb-4 text-xs">Próximo Recomendado</p>
            <div className="flex items-center justify-around">
              <span className="font-black text-gray-700 uppercase tracking-tighter text-lg">{nextMatch.team1.name}</span>
              <span className="font-bold text-gray-300 italic">vs</span>
              <span className="font-black text-gray-700 uppercase tracking-tighter text-lg">{nextMatch.team2.name}</span>
            </div>
          </div>
        )}

        {/* RESTING TEAMS */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6">
          <p className="font-bold uppercase tracking-widest text-gray-400 mb-4 text-xs text-center">En Espera</p>
          <div className="flex flex-wrap justify-center gap-3">
            {currentMatch.resting.map(team => (
              <div key={team.id} className="bg-gray-100 px-4 py-2 rounded-xl border border-gray-200">
                <span className="font-bold text-gray-600 uppercase text-sm">{team.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showResultModal && (
        <ResultModal
          team1={currentMatch.team1}
          team2={currentMatch.team2}
          onSave={handleSaveResult}
          onCancel={() => setShowResultModal(false)}
        />
      )}

      {showChangeModal && (
        <MatchSelectionModal
          teams={teams}
          currentTeam1Id={currentMatch.team1.id}
          currentTeam2Id={currentMatch.team2.id}
          onSelect={handleChangeMatch}
          onCancel={() => setShowChangeModal(false)}
        />
      )}
    </div>
  );
};

export default TournamentDashboard;
