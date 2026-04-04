import { useState, type FC } from 'react';
import { Trophy, Check, ChevronLeft } from 'lucide-react';
import type { Team, MatchResult } from '../types';

interface ResultModalProps {
  team1: Team;
  team2: Team;
  onSave: (result: MatchResult) => void;
  onCancel: () => void;
}

const ResultModal: FC<ResultModalProps> = ({ team1, team2, onSave, onCancel }) => {
  const [winnerId, setWinnerId] = useState<string>(team1.id);
  const [score, setScore] = useState('');

  const scoreOptions = ['4-0', '4-1', '4-2', '4-3', '5-0', '5-1', '5-2', '5-3', '5-4', '6-0', '6-1', '6-2', '6-3', '6-4', '7-5', '7-6'];

  return (
    <div className="fixed inset-0 bg-court-900/60 dark:bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 z-50 animate-bounce-in">
      <div className="bg-white dark:bg-court-800 rounded-3xl shadow-2xl p-5 sm:p-7 max-w-md w-full max-h-[90vh] overflow-y-auto border border-court-200 dark:border-court-700">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={onCancel}
            className="w-9 h-9 rounded-xl bg-court-100 dark:bg-court-700 flex items-center justify-center hover:bg-court-200 dark:hover:bg-court-600 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-court-600 dark:text-court-300" />
          </button>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-sport-500" />
            <h2 className="text-lg sm:text-xl font-display font-black text-court-900 dark:text-white uppercase tracking-tight">Resultado</h2>
          </div>
          <div className="w-9 h-9" />
        </div>
        
        {/* Winner selection */}
        <div className="space-y-3 mb-6">
          <p className="text-center text-court-400 dark:text-court-500 font-bold uppercase text-[10px] tracking-widest">¿Quién ganó?</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setWinnerId(team1.id)}
              className={`p-4 rounded-2xl border-2 transition-all duration-200 text-center ${
                winnerId === team1.id 
                  ? 'border-sport-500 bg-sport-50 dark:bg-sport-900/30 shadow-lg shadow-sport-500/20 scale-[1.02]' 
                  : 'border-court-100 dark:border-court-700 hover:border-court-200 dark:hover:border-court-600 hover:shadow-md'
              }`}
            >
              <div className={`w-10 h-10 mx-auto mb-2 rounded-xl flex items-center justify-center ${
                winnerId === team1.id ? 'bg-sport-500 text-white' : 'bg-court-100 dark:bg-court-700 text-court-400 dark:text-court-500'
              } transition-colors`}>
                <Trophy className="w-5 h-5" />
              </div>
              <span className="block font-display font-black text-sm text-court-800 dark:text-court-100">{team1.name}</span>
              <span className="text-[10px] text-court-400 dark:text-court-500 font-medium">{team1.players[0].name} / {team1.players[1].name}</span>
            </button>
            <button
              onClick={() => setWinnerId(team2.id)}
              className={`p-4 rounded-2xl border-2 transition-all duration-200 text-center ${
                winnerId === team2.id 
                  ? 'border-sport-500 bg-sport-50 dark:bg-sport-900/30 shadow-lg shadow-sport-500/20 scale-[1.02]' 
                  : 'border-court-100 dark:border-court-700 hover:border-court-200 dark:hover:border-court-600 hover:shadow-md'
              }`}
            >
              <div className={`w-10 h-10 mx-auto mb-2 rounded-xl flex items-center justify-center ${
                winnerId === team2.id ? 'bg-sport-500 text-white' : 'bg-court-100 dark:bg-court-700 text-court-400 dark:text-court-500'
              } transition-colors`}>
                <Trophy className="w-5 h-5" />
              </div>
              <span className="block font-display font-black text-sm text-court-800 dark:text-court-100">{team2.name}</span>
              <span className="text-[10px] text-court-400 dark:text-court-500 font-medium">{team2.players[0].name} / {team2.players[1].name}</span>
            </button>
          </div>
        </div>

        {/* Score selection */}
        <div className="mb-6">
          <label className="text-center text-court-400 dark:text-court-500 font-bold uppercase text-[10px] tracking-widest block mb-3">Resultado</label>
          <div className="flex flex-wrap justify-center gap-2">
            {scoreOptions.map(opt => (
              <button
                key={opt}
                onClick={() => setScore(score === opt ? '' : opt)}
                className={`px-3 py-2 rounded-xl font-display font-black text-sm transition-all duration-200 ${
                  score === opt 
                    ? 'sport-gradient text-white shadow-lg shadow-sport-500/30 scale-105' 
                    : 'bg-court-100 dark:bg-court-700 text-court-600 dark:text-court-300 hover:bg-court-200 dark:hover:bg-court-600'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 flex items-center justify-center gap-2 bg-court-100 dark:bg-court-700 text-court-500 dark:text-court-400 py-3.5 rounded-2xl font-semibold uppercase tracking-tight hover:bg-court-200 dark:hover:bg-court-600 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            Cancelar
          </button>
          <button
            onClick={() => onSave({ winnerTeamId: winnerId, score: score || undefined })}
            className="flex-1 flex items-center justify-center gap-2 sport-gradient text-white py-3.5 rounded-2xl font-display font-black uppercase tracking-tight hover:shadow-xl hover:shadow-sport-500/30 transition-all"
          >
            <Check className="w-4 h-4" />
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultModal;