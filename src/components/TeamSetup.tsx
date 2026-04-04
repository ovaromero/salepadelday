import { useState, type FC, type FormEvent } from 'react';
import { Trophy, Users, ChevronRight } from 'lucide-react';
import type { Team } from '../types';
import { generateId } from '../utils/scheduler';

interface TeamSetupProps {
  onStart: (teams: Team[]) => void;
}

const TeamSetup: FC<TeamSetupProps> = ({ onStart }) => {
  const [teamCount, setTeamCount] = useState<4 | 5>(4);
  const [teams, setTeams] = useState<Team[]>(() => 
    Array.from({ length: 5 }, (_, i) => ({
      id: generateId(),
      name: `Equipo ${i + 1}`,
      players: [{ name: '' }, { name: '' }],
    }))
  );

  const teamColors = [
    'from-sport-500 to-sport-600',
    'from-energy-500 to-energy-600',
    'from-blue-500 to-blue-600',
    'from-purple-500 to-purple-600',
    'from-rose-500 to-rose-600',
  ];

  const handlePlayerChange = (teamIndex: number, playerIndex: number, name: string) => {
    const newTeams = [...teams];
    newTeams[teamIndex].players[playerIndex].name = name;
    setTeams(newTeams);
  };

  const handleTeamNameChange = (teamIndex: number, name: string) => {
    const newTeams = [...teams];
    newTeams[teamIndex].name = name;
    setTeams(newTeams);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onStart(teams.slice(0, teamCount));
  };

  return (
    <div className="min-h-screen px-3 py-6 sm:p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-slide-up">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-3xl sport-gradient shadow-xl shadow-sport-500/30 mb-4">
            <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-black text-court-900 dark:text-white tracking-tight">
            Sale<span className="text-sport-600 dark:text-sport-400">Padel</span>Day
          </h1>
          <p className="text-court-500 dark:text-court-400 font-medium mt-1 text-sm">Armá tu torneo y a jugar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          {/* Team count selector */}
          <div className="glass dark:glass-dark rounded-2xl p-1.5 flex justify-center gap-2 shadow-lg">
            <button
              type="button"
              onClick={() => setTeamCount(4)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                teamCount === 4 
                  ? 'sport-gradient text-white shadow-lg shadow-sport-500/30 scale-105' 
                  : 'text-court-600 dark:text-court-300 hover:bg-court-100/50 dark:hover:bg-court-800'
              }`}
            >
              <Users className="w-4 h-4" />
              4 Equipos
            </button>
            <button
              type="button"
              onClick={() => setTeamCount(5)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                teamCount === 5 
                  ? 'sport-gradient text-white shadow-lg shadow-sport-500/30 scale-105' 
                  : 'text-court-600 dark:text-court-300 hover:bg-court-100/50 dark:hover:bg-court-800'
              }`}
            >
              <Users className="w-4 h-4" />
              5 Equipos
            </button>
          </div>

          {/* Team cards */}
          {teams.slice(0, teamCount).map((team, tIdx) => (
            <div 
              key={team.id} 
              className="bg-white dark:bg-court-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-court-100 dark:border-court-700 animate-slide-up group"
              style={{ animationDelay: `${tIdx * 50}ms` }}
            >
              {/* Team color bar */}
              <div className={`h-1.5 bg-gradient-to-r ${teamColors[tIdx]}`} />
              
              <div className="p-4 sm:p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${teamColors[tIdx]} flex items-center justify-center text-white font-black text-sm shadow-md`}>
                    {tIdx + 1}
                  </div>
                  <input
                    type="text"
                    value={team.name}
                    onChange={(e) => handleTeamNameChange(tIdx, e.target.value)}
                    placeholder="Nombre del Equipo"
                    className="flex-1 text-lg font-bold text-court-800 dark:text-court-100 border-b-2 border-transparent focus:border-sport-400 outline-none px-1 py-0.5 transition-colors placeholder:text-court-300 dark:placeholder:text-court-500"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  {team.players.map((player, pIdx) => (
                    <div key={pIdx}>
                      <label className="text-[10px] uppercase text-court-400 dark:text-court-500 font-bold tracking-wider block mb-1.5 ml-1">
                        Jugador {pIdx + 1}
                      </label>
                      <input
                        type="text"
                        value={player.name}
                        onChange={(e) => handlePlayerChange(tIdx, pIdx, e.target.value)}
                        placeholder="Nombre completo"
                        className="w-full bg-court-50 dark:bg-court-700 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-sport-400/50 transition-all border border-court-200 dark:border-court-600 text-sm font-medium text-court-700 dark:text-court-200 placeholder:text-court-300 dark:placeholder:text-court-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* Submit button */}
          <button
            type="submit"
            className="w-full sport-gradient text-white py-4 rounded-2xl text-lg font-display font-black uppercase tracking-wide hover:shadow-xl hover:shadow-sport-500/30 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-3 group"
          >
            <span>¡Comenzar Torneo!</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default TeamSetup;