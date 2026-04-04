import { type FC } from 'react';
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
    <div className="max-w-2xl mx-auto px-2 sm:p-4 flex flex-col min-h-screen">
      <div className="flex items-center mb-6 sm:mb-8">
        <button onClick={onBack} className="mr-2 sm:mr-4 p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-800 tracking-tighter uppercase italic">Estadísticas</h1>
      </div>

      <div className="space-y-6 sm:space-y-8">
        {/* RANKING TABLE */}
        <section>
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-4 ml-2">Tabla de Posiciones</h2>
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-xs font-bold text-gray-400 uppercase">Equipo</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-xs font-bold text-gray-400 uppercase text-center">J</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-xs font-bold text-gray-400 uppercase text-center">G</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-xs font-bold text-gray-400 uppercase text-center">P</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stats.map((team, idx) => (
                  <tr key={team.id} className={idx === 0 ? 'bg-indigo-50/30' : ''}>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <div className="flex items-center">
                        {idx === 0 && <span className="mr-2 text-xl">🏆</span>}
                        <div>
                          <p className="font-black text-gray-800 uppercase tracking-tight text-sm sm:text-base">{team.name}</p>
                          <p className="text-xs text-gray-500 font-bold uppercase">{team.players[0].name} / {team.players[1].name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-center font-bold text-gray-600 text-lg sm:text-xl">{team.played}</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-center font-black text-indigo-600 text-lg sm:text-xl">{team.wins}</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-center font-bold text-gray-400 text-base sm:text-lg">{team.losses}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* HISTORY */}
        <section className="flex-1 pb-10">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-4 ml-2">Historial de Partidos</h2>
          <div className="space-y-3">
            {completedMatches.slice().reverse().map((match, idx) => (
              <div key={idx} className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div className="flex-1 flex flex-col items-center">
                   <span className={`font-black uppercase tracking-tighter text-xs sm:text-sm ${match.result?.winnerTeamId === match.team1.id ? 'text-indigo-600' : 'text-gray-400'}`}>
                     {match.team1.name}
                   </span>
                </div>
                
                <div className="px-2 sm:px-4 text-center">
                   <div className="bg-indigo-600 text-white px-2 sm:px-3 py-1 rounded-lg font-black text-xs sm:text-sm mb-1 italic">
                     {match.result?.score || 'VS'}
                   </div>
                   <span className="text-[10px] font-bold text-gray-300 uppercase italic">Ronda {match.id + 1}</span>
                </div>

                <div className="flex-1 flex flex-col items-center">
                   <span className={`font-black uppercase tracking-tighter text-xs sm:text-sm ${match.result?.winnerTeamId === match.team2.id ? 'text-indigo-600' : 'text-gray-400'}`}>
                     {match.team2.name}
                   </span>
                </div>
              </div>
            ))}
            {completedMatches.length === 0 && (
              <div className="text-center py-10 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                <p className="font-bold text-gray-400 uppercase text-sm">No hay partidos jugados todavía</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Statistics;
