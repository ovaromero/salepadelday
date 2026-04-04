import { type FC } from 'react';
import { ChevronLeft, Trophy, Award, Calendar, BarChart3 } from 'lucide-react';
import type { Team, Match } from '../types';

interface StatisticsProps {
  teams: Team[];
  completedMatches: Match[];
  onBack: () => void;
}

const Statistics: FC<StatisticsProps> = ({ teams, completedMatches, onBack }) => {
  const stats = teams.map(team => {
    const wins = completedMatches.filter(m => m.result?.winnerTeamId === team.id).length;
    const losses = completedMatches.filter(m => 
      (m.team1.id === team.id || m.team2.id === team.id) && m.result?.winnerTeamId !== team.id
    ).length;
    const played = wins + losses;
    return { ...team, wins, losses, played };
  }).sort((a, b) => b.wins - a.wins || a.losses - b.losses);

  return (
    <div className="min-h-screen px-3 py-4 sm:p-6 flex flex-col">
      <div className="max-w-2xl mx-auto w-full flex flex-col min-h-screen">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={onBack} className="w-10 h-10 rounded-xl bg-white border border-court-200 flex items-center justify-center hover:bg-court-50 hover:shadow-md transition-all">
            <ChevronLeft className="w-5 h-5 text-court-600" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl energy-gradient flex items-center justify-center shadow-lg shadow-energy-500/20">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-display font-black text-court-900 tracking-tight">Estadísticas</h1>
              <p className="text-[10px] font-bold text-court-400 uppercase tracking-wider">Rendimiento del día</p>
            </div>
          </div>
        </div>

        <div className="space-y-5 sm:space-y-6">
          {/* RANKING TABLE */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-4 h-4 text-sport-500" />
              <h2 className="text-xs font-display font-black uppercase tracking-wider text-court-400">Tabla de Posiciones</h2>
            </div>
            <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-court-100">
              <div className="bg-court-50 border-b border-court-100 px-4 py-3 grid grid-cols-12 text-[10px] font-bold text-court-400 uppercase tracking-wider">
                <div className="col-span-5">Equipo</div>
                <div className="col-span-2 text-center">J</div>
                <div className="col-span-2 text-center">G</div>
                <div className="col-span-2 text-center">P</div>
                <div className="col-span-1"></div>
              </div>
              <div className="divide-y divide-court-50">
                {stats.map((team, idx) => {
                  const winRate = team.played > 0 ? (team.wins / team.played) * 100 : 0;
                  return (
                    <div key={team.id} className={`px-4 py-3 grid grid-cols-12 items-center ${
                      idx === 0 ? 'bg-sport-50/50' : ''
                    }`}>
                      <div className="col-span-5 flex items-center gap-2">
                        {idx === 0 && <Trophy className="w-4 h-4 text-energy-500 flex-shrink-0" />}
                        {idx === 1 && <span className="w-4 h-4 flex items-center justify-center text-[10px] font-black text-court-400 flex-shrink-0">2</span>}
                        {idx === 2 && <span className="w-4 h-4 flex items-center justify-center text-[10px] font-black text-court-400 flex-shrink-0">3</span>}
                        {idx > 2 && <span className="w-4 h-4 flex items-center justify-center text-[10px] font-bold text-court-300 flex-shrink-0">{idx + 1}</span>}
                        <div>
                          <p className="font-display font-black text-court-800 uppercase tracking-tight text-xs">{team.name}</p>
                          <p className="text-[10px] text-court-400 font-medium">{team.players[0].name} / {team.players[1].name}</p>
                        </div>
                      </div>
                      <div className="col-span-2 text-center font-bold text-court-600 text-sm">{team.played}</div>
                      <div className="col-span-2 text-center font-display font-black text-sport-600 text-sm">{team.wins}</div>
                      <div className="col-span-2 text-center font-bold text-court-400 text-sm">{team.losses}</div>
                      <div className="col-span-1 flex justify-end">
                        <div className="w-8 h-1.5 bg-court-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-sport-400 to-sport-500 rounded-full transition-all duration-500"
                            style={{ width: `${winRate}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* HISTORY */}
          <section className="flex-1 pb-10">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-court-400" />
              <h2 className="text-xs font-display font-black uppercase tracking-wider text-court-400">Historial de Partidos</h2>
            </div>
            <div className="space-y-2">
              {completedMatches.slice().reverse().map((match, idx) => (
                <div key={idx} className="bg-white p-3 sm:p-4 rounded-xl border border-court-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
                  <div className="flex-1 text-right min-w-0">
                    <span className={`font-display font-bold uppercase tracking-tight text-xs block truncate ${
                      match.result?.winnerTeamId === match.team1.id ? 'text-sport-600' : 'text-court-400'
                    }`}>
                      {match.team1.name}
                    </span>
                  </div>
                  
                  <div className="flex-shrink-0">
                    <div className={`w-12 text-center px-2 py-1 rounded-lg font-display font-black text-xs ${
                      match.result 
                        ? 'sport-gradient text-white shadow-sm' 
                        : 'bg-court-100 text-court-400'
                    }`}>
                      {match.result?.score || 'VS'}
                    </div>
                    <span className="text-[9px] font-bold text-court-300 uppercase mt-0.5 block text-center">Ronda {match.id + 1}</span>
                  </div>

                  <div className="flex-1 text-left min-w-0">
                    <span className={`font-display font-bold uppercase tracking-tight text-xs block truncate ${
                      match.result?.winnerTeamId === match.team2.id ? 'text-sport-600' : 'text-court-400'
                    }`}>
                      {match.team2.name}
                    </span>
                  </div>
                </div>
              ))}
              {completedMatches.length === 0 && (
                <div className="text-center py-12 bg-court-50 rounded-2xl border-2 border-dashed border-court-200">
                  <Trophy className="w-8 h-8 text-court-300 mx-auto mb-2" />
                  <p className="font-semibold text-court-400 uppercase text-xs">No hay partidos jugados todavía</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
