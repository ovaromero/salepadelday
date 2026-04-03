import { useState, type FC, type FormEvent } from 'react';
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
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8 text-indigo-600 uppercase tracking-widest">SalePadelDay</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-center space-x-4 mb-6">
          <button
            type="button"
            onClick={() => setTeamCount(4)}
            className={`px-6 py-2 rounded-full font-semibold transition-all ${
              teamCount === 4 ? 'bg-indigo-600 text-white shadow-lg scale-105' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            4 Equipos
          </button>
          <button
            type="button"
            onClick={() => setTeamCount(5)}
            className={`px-6 py-2 rounded-full font-semibold transition-all ${
              teamCount === 5 ? 'bg-indigo-600 text-white shadow-lg scale-105' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            5 Equipos
          </button>
        </div>

        {teams.slice(0, teamCount).map((team, tIdx) => (
          <div key={team.id} className="bg-white p-6 rounded-2xl shadow-md border-l-8 border-indigo-500 hover:shadow-lg transition-shadow">
            <input
              type="text"
              value={team.name}
              onChange={(e) => handleTeamNameChange(tIdx, e.target.value)}
              placeholder="Nombre del Equipo"
              className="w-full text-xl font-bold mb-4 border-b-2 border-transparent focus:border-indigo-300 outline-none p-1 transition-colors"
              required
            />
            <div className="grid grid-cols-2 gap-4">
              {team.players.map((player, pIdx) => (
                <div key={pIdx}>
                  <label className="text-xs uppercase text-gray-500 font-bold block mb-1">Jugador {pIdx + 1}</label>
                  <input
                    type="text"
                    value={player.name}
                    onChange={(e) => handlePlayerChange(tIdx, pIdx, e.target.value)}
                    placeholder="Nombre"
                    className="w-full bg-gray-50 rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-300 transition-all border border-gray-200"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-green-500 text-white py-4 rounded-2xl text-xl font-black uppercase tracking-tighter hover:bg-green-600 active:scale-95 transition-all shadow-xl"
        >
          ¡Comenzar Torneo!
        </button>
      </form>
    </div>
  );
};

export default TeamSetup;
