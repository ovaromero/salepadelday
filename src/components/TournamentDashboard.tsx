import { useState, type FC } from 'react';
import { Trophy, BarChart3, LogOut, RotateCcw, Shuffle, Zap } from 'lucide-react';
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
    <div className="min-h-screen px-3 py-4 sm:p-6 flex flex-col">
      <div className="max-w-xl mx-auto w-full flex flex-col min-h-screen">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl sport-gradient flex items-center justify-center shadow-lg shadow-sport-500/20">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-display font-black text-court-900 tracking-tight">
                Sale<span className="text-sport-600">Padel</span>Day
              </h1>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse-live" />
                <span className="text-[10px] font-bold text-court-400 uppercase tracking-wider">En vivo</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={onViewStats}
              className="flex items-center gap-1.5 bg-white text-court-700 font-semibold px-3 py-2 rounded-xl text-xs hover:bg-court-50 hover:shadow-md transition-all border border-court-200"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Stats
            </button>
            <button
              onClick={handleCloseJourney}
              className="flex items-center gap-1.5 bg-sport-50 text-sport-700 font-semibold px-3 py-2 rounded-xl text-xs hover:bg-sport-100 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              Cerrar
            </button>
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 bg-red-50 text-red-500 font-semibold px-3 py-2 rounded-xl text-xs hover:bg-red-100 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>
        </div>

        <div className="flex-1 space-y-5">
          {/* CURRENT MATCH */}
          <div className="sport-gradient rounded-3xl p-6 sm:p-8 text-white shadow-2xl shadow-sport-600/30 relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
            </div>
            
            {/* LIVE badge */}
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse-live" />
              <span className="text-[10px] font-black uppercase tracking-widest">LIVE</span>
            </div>
            
            <div className="flex justify-between items-center mb-8 relative z-10">
              <p className="font-bold uppercase tracking-[0.2em] text-sport-100 text-xs">Ahora Jugando</p>
              <button 
                onClick={() => setShowChangeModal(true)}
                className="flex items-center gap-1.5 text-xs font-bold uppercase bg-white/20 hover:bg-white/30 backdrop-blur-sm px-3 py-1.5 rounded-full transition-colors"
              >
                <Shuffle className="w-3 h-3" />
                Cambiar
              </button>
            </div>
            
            <div className="flex items-center justify-between relative z-10">
              <div className="flex-1 text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Trophy className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>
                <h3 className="text-xl sm:text-2xl font-display font-black mb-2 leading-tight uppercase tracking-tight">{currentMatch.team1.name}</h3>
                {currentMatch.team1.players.some(p => p.name) && (
                  <p className="text-xs font-semibold text-sport-100 uppercase tracking-wide">
                    {currentMatch.team1.players[0].name} <br/> {currentMatch.team1.players[1].name}
                  </p>
                )}
              </div>
              
              <div className="px-4 sm:px-6">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl px-3 py-2 font-display font-black text-xl sm:text-2xl italic text-white/80">
                  VS
                </div>
              </div>
              
              <div className="flex-1 text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Trophy className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>
                <h3 className="text-xl sm:text-2xl font-display font-black mb-2 leading-tight uppercase tracking-tight">{currentMatch.team2.name}</h3>
                {currentMatch.team2.players.some(p => p.name) && (
                  <p className="text-xs font-semibold text-sport-100 uppercase tracking-wide">
                    {currentMatch.team2.players[0].name} <br/> {currentMatch.team2.players[1].name}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={() => setShowResultModal(true)}
              className="w-full mt-8 bg-white text-sport-700 py-4 rounded-2xl font-display font-black uppercase text-lg tracking-wide hover:bg-sport-50 active:scale-[0.98] transition-all shadow-xl shadow-sport-900/20 relative z-10 flex items-center justify-center gap-2"
            >
              <Trophy className="w-5 h-5" />
              Finalizar Partido
            </button>
          </div>

          {/* NEXT MATCH */}
          {nextMatch && (
            <div className="bg-white border-2 border-dashed border-court-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-1.5 h-1.5 rounded-full bg-court-300" />
                <p className="text-center font-bold uppercase tracking-widest text-court-400 text-[10px]">Próximo Recomendado</p>
                <div className="w-1.5 h-1.5 rounded-full bg-court-300" />
              </div>
              <div className="flex items-center justify-around">
                <span className="font-display font-black text-court-800 uppercase tracking-tight text-sm">{nextMatch.team1.name}</span>
                <span className="font-bold text-court-300 italic text-xs mx-2">vs</span>
                <span className="font-display font-black text-court-800 uppercase tracking-tight text-sm">{nextMatch.team2.name}</span>
              </div>
            </div>
          )}

          {/* RESTING TEAMS */}
          <div className="bg-white rounded-2xl border border-court-100 p-5 shadow-sm">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-court-300" />
              <p className="font-bold uppercase tracking-widest text-court-400 text-[10px]">En Espera</p>
              <div className="w-1.5 h-1.5 rounded-full bg-court-300" />
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {currentMatch.resting.map(team => (
                <div key={team.id} className="bg-court-50 px-4 py-2.5 rounded-xl border border-court-200 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-court-300" />
                  <span className="font-semibold text-court-600 uppercase text-xs">{team.name}</span>
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
    </div>
  );
};

export default TournamentDashboard;
