import { useState, type FC } from 'react';
import type { Team } from '../types';

interface MatchSelectionModalProps {
  teams: Team[];
  currentTeam1Id: string;
  currentTeam2Id: string;
  onSelect: (team1Id: string, team2Id: string) => void;
  onCancel: () => void;
}

const MatchSelectionModal: FC<MatchSelectionModalProps> = ({
  teams,
  currentTeam1Id,
  currentTeam2Id,
  onSelect,
  onCancel,
}) => {
  const [team1Id, setTeam1Id] = useState(currentTeam1Id);
  const [team2Id, setTeam2Id] = useState(currentTeam2Id);
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    if (team1Id === team2Id) {
      setError('Un equipo no puede jugar contra sí mismo.');
      return;
    }
    onSelect(team1Id, team2Id);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl p-4 sm:p-8 max-w-md w-full animate-in fade-in zoom-in duration-200">
        <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-gray-800 mb-4 sm:mb-6 text-center">Cambiar Rivales</h2>
        
        <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
          <div>
            <label htmlFor="team1" className="text-xs uppercase text-gray-500 font-bold block mb-2">Equipo 1</label>
            <select
              id="team1"
              value={team1Id}
              onChange={(e) => setTeam1Id(e.target.value)}
              className="w-full bg-gray-100 rounded-xl p-3 sm:p-4 font-bold outline-none focus:ring-4 focus:ring-indigo-200 transition-all appearance-none"
            >
              {teams.map(team => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
          </div>

          <div className="text-center font-black text-gray-300 italic">VS</div>

          <div>
            <label htmlFor="team2" className="text-xs uppercase text-gray-500 font-bold block mb-2">Equipo 2</label>
            <select
              id="team2"
              value={team2Id}
              onChange={(e) => setTeam2Id(e.target.value)}
              className="w-full bg-gray-100 rounded-xl p-3 sm:p-4 font-bold outline-none focus:ring-4 focus:ring-indigo-200 transition-all appearance-none"
            >
              {teams.map(team => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm font-bold text-center mb-4">{error}</p>}

        <div className="flex flex-col sm:flex-row gap-2 sm:space-x-4">
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-100 text-gray-500 py-3 sm:py-4 rounded-2xl font-bold uppercase tracking-tight hover:bg-gray-200 transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-indigo-600 text-white py-3 sm:py-4 rounded-2xl font-black uppercase tracking-tight hover:bg-indigo-700 shadow-xl transition-all"
          >
            Cambiar
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchSelectionModal;
