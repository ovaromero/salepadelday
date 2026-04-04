import { useState, type FC } from 'react';
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl p-4 sm:p-8 max-w-md w-full animate-in fade-in zoom-in duration-200">
        <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-gray-800 mb-4 sm:mb-6 text-center">Finalizar Partido</h2>
        
        <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
          <p className="text-center text-gray-500 font-bold uppercase text-xs tracking-widest">¿Quién ganó?</p>
          <div className="grid grid-cols-2 gap-2 sm:gap-4">
            <button
              onClick={() => setWinnerId(team1.id)}
              className={`p-3 sm:p-4 rounded-2xl border-4 transition-all text-center ${
                winnerId === team1.id 
                  ? 'border-indigo-500 bg-indigo-50 shadow-lg scale-105' 
                  : 'border-gray-100 hover:border-gray-200'
              }`}
            >
              <span className="block font-black text-base sm:text-lg">{team1.name}</span>
              <span className="text-xs text-gray-500">{team1.players[0].name} / {team1.players[1].name}</span>
            </button>
            <button
              onClick={() => setWinnerId(team2.id)}
              className={`p-3 sm:p-4 rounded-2xl border-4 transition-all text-center ${
                winnerId === team2.id 
                  ? 'border-indigo-500 bg-indigo-50 shadow-lg scale-105' 
                  : 'border-gray-100 hover:border-gray-200'
              }`}
            >
              <span className="block font-black text-base sm:text-lg">{team2.name}</span>
              <span className="text-xs text-gray-500">{team2.players[0].name} / {team2.players[1].name}</span>
            </button>
          </div>
        </div>

        <div className="mb-6 sm:mb-8">
          <label className="text-center text-gray-500 font-bold uppercase text-xs tracking-widest block mb-2">Resultado</label>
          <div className="flex flex-wrap justify-center gap-2">
            {scoreOptions.map(opt => (
              <button
                key={opt}
                onClick={() => setScore(score === opt ? '' : opt)}
                className={`px-3 py-2 rounded-xl font-black text-sm transition-all ${
                  score === opt 
                    ? 'bg-indigo-600 text-white shadow-lg' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:space-x-4">
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-100 text-gray-500 py-3 sm:py-4 rounded-2xl font-bold uppercase tracking-tight hover:bg-gray-200 transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={() => onSave({ winnerTeamId: winnerId, score: score || undefined })}
            className="flex-1 bg-indigo-600 text-white py-3 sm:py-4 rounded-2xl font-black uppercase tracking-tight hover:bg-indigo-700 shadow-xl transition-all"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultModal;
