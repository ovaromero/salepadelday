import { useState, type FC } from 'react';
import { Check, ChevronLeft, Shuffle } from 'lucide-react';
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
    <div className="fixed inset-0 bg-court-900/60 dark:bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 z-50 animate-bounce-in">
      <div className="bg-white dark:bg-court-800 rounded-3xl shadow-2xl p-5 sm:p-7 max-w-md w-full border border-court-200 dark:border-court-700">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={onCancel}
            className="w-10 h-10 rounded-xl bg-white dark:bg-court-700 shadow-md flex items-center justify-center hover:bg-court-100 dark:hover:bg-court-600 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-court-700 dark:text-court-200" />
          </button>
          <div className="flex items-center gap-2">
            <Shuffle className="w-5 h-5 text-sport-500" />
            <h2 className="text-lg font-display font-black text-court-900 dark:text-white uppercase tracking-tight">Cambiar Rivales</h2>
          </div>
          <div className="w-10 h-10" />
        </div>
        
        <div className="space-y-5 mb-6">
          <div>
            <label htmlFor="team1" className="text-[10px] uppercase text-court-400 dark:text-court-500 font-bold tracking-wider block mb-2 ml-1">Equipo 1</label>
            <select
              id="team1"
              value={team1Id}
              onChange={(e) => setTeam1Id(e.target.value)}
              className="w-full bg-court-50 dark:bg-court-700 border border-court-200 dark:border-court-600 rounded-xl p-3.5 font-semibold outline-none focus:ring-2 focus:ring-sport-400/50 transition-all appearance-none cursor-pointer text-court-800 dark:text-court-100"
            >
              {teams.map(team => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-center gap-3">
            <div className="flex-1 h-px bg-court-200 dark:bg-court-600" />
            <div className="bg-court-100 dark:bg-court-700 rounded-lg px-3 py-1.5 font-display font-black text-court-400 dark:text-court-500 text-xs italic">VS</div>
            <div className="flex-1 h-px bg-court-200 dark:bg-court-600" />
          </div>

          <div>
            <label htmlFor="team2" className="text-[10px] uppercase text-court-400 dark:text-court-500 font-bold tracking-wider block mb-2 ml-1">Equipo 2</label>
            <select
              id="team2"
              value={team2Id}
              onChange={(e) => setTeam2Id(e.target.value)}
              className="w-full bg-court-50 dark:bg-court-700 border border-court-200 dark:border-court-600 rounded-xl p-3.5 font-semibold outline-none focus:ring-2 focus:ring-sport-400/50 transition-all appearance-none cursor-pointer text-court-800 dark:text-court-100"
            >
              {teams.map(team => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-semibold text-center p-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 flex items-center justify-center gap-2 bg-court-100 dark:bg-court-700 text-court-500 dark:text-court-400 py-3.5 rounded-2xl font-semibold uppercase tracking-tight hover:bg-court-200 dark:hover:bg-court-600 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="flex-1 flex items-center justify-center gap-2 sport-gradient text-white py-3.5 rounded-2xl font-display font-black uppercase tracking-tight hover:shadow-xl hover:shadow-sport-500/30 transition-all"
          >
            <Check className="w-4 h-4" />
            Cambiar
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchSelectionModal;