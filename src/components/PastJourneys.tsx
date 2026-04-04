import type { FC } from 'react';
import { ChevronLeft, Trash2, Calendar, DollarSign, ChevronDown, Eye } from 'lucide-react';
import type { Journey } from '../types';

interface PastJourneysProps {
  journeys: Journey[];
  onDelete: (id: string) => void;
  onBack: () => void;
  onViewExpenses: (journey: Journey) => void;
}

const PastJourneys: FC<PastJourneysProps> = ({ journeys, onDelete, onBack, onViewExpenses }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro que querés borrar esta jornada? Esta acción no se puede deshacer.')) {
      onDelete(id);
    }
  };

  return (
    <div className="min-h-screen px-3 py-4 sm:p-6 flex flex-col">
      <div className="max-w-2xl mx-auto w-full flex flex-col min-h-screen">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={onBack} className="w-10 h-10 rounded-xl bg-white dark:bg-court-800 border border-court-200 dark:border-court-700 flex items-center justify-center hover:bg-court-50 dark:hover:bg-court-700 hover:shadow-md transition-all">
            <ChevronLeft className="w-5 h-5 text-court-600 dark:text-court-400" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-display font-black text-court-900 dark:text-white tracking-tight">Historial</h1>
              <p className="text-[10px] font-bold text-court-400 dark:text-court-500 uppercase tracking-wider">Jornadas anteriores</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {journeys.map((journey, jIdx) => (
            <div 
              key={journey.id} 
              className="bg-white dark:bg-court-800 rounded-2xl p-4 sm:p-5 shadow-md border border-court-100 dark:border-court-700 group relative animate-slide-up"
              style={{ animationDelay: `${jIdx * 50}ms` }}
            >
              {/* Delete button */}
              <button 
                onClick={() => handleDelete(journey.id)}
                className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-400 dark:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                title="Borrar jornada"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              {/* Journey header */}
              <div className="flex items-start gap-3 mb-4 pr-10">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-100 dark:from-violet-900/30 to-purple-100 dark:to-purple-900/30 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-violet-500 dark:text-violet-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-court-400 dark:text-court-500 uppercase tracking-wider mb-0.5">{formatDate(journey.date)}</p>
                  <h2 className="text-sm font-display font-black text-court-800 dark:text-court-100 uppercase tracking-tight">
                    Jornada de {journey.teams.length} Equipos
                  </h2>
                </div>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-court-50 dark:bg-court-700 rounded-xl p-3 text-center">
                  <p className="text-[9px] font-bold text-court-400 dark:text-court-500 uppercase tracking-wider mb-1">Partidos</p>
                  <p className="text-lg font-display font-black text-court-800 dark:text-court-100">{journey.history.length}</p>
                </div>
                <div className="bg-sport-50 dark:bg-sport-900/30 rounded-xl p-3 text-center">
                  <p className="text-[9px] font-bold text-court-400 dark:text-court-500 uppercase tracking-wider mb-1">Ganador</p>
                  <p className="text-xs font-display font-black text-sport-600 dark:text-sport-400 uppercase leading-tight">
                    {(() => {
                      const wins = journey.teams.map(t => ({
                        name: t.name,
                        count: journey.history.filter(m => m.result?.winnerTeamId === t.id).length
                      })).sort((a, b) => b.count - a.count);
                      return wins[0]?.name || '-';
                    })()}
                  </p>
                </div>
                <div className="bg-energy-50 dark:bg-energy-900/30 rounded-xl p-3 text-center">
                  <p className="text-[9px] font-bold text-court-400 dark:text-court-500 uppercase tracking-wider mb-1">Gastos</p>
                  <p className="text-xs font-display font-black text-energy-600 dark:text-energy-400">
                    {journey.expenses ? '$' + Object.values(journey.expenses).reduce((sum, e) => sum + e.amount, 0).toLocaleString() : 'Sin cargar'}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <button
                onClick={() => onViewExpenses(journey)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold uppercase text-xs transition-all mb-3 bg-sport-50 dark:bg-sport-900/30 text-sport-700 dark:text-sport-400 hover:bg-sport-100 dark:hover:bg-sport-900/50 hover:shadow-md"
              >
                <DollarSign className="w-3.5 h-3.5" />
                {journey.expenses ? 'Ver Gastos' : 'Cargar Gastos'}
              </button>

              {/* Match details */}
              <details className="group/details">
                <summary className="text-xs font-bold uppercase tracking-wider text-court-400 dark:text-court-500 cursor-pointer hover:text-sport-600 dark:hover:text-sport-400 transition-colors list-none flex items-center justify-center gap-2 py-3">
                  <Eye className="w-4 h-4" />
                  Ver Detalle de Partidos
                  <ChevronDown className="w-4 h-4 transform group-open/details:rotate-180 transition-transform" />
                </summary>
                <div className="mt-3 space-y-2 max-h-48 overflow-y-auto pr-2">
                  {journey.history.map((match, mIdx) => (
                    <div key={mIdx} className="bg-court-50 dark:bg-court-700/50 p-3 rounded-xl border border-court-100 dark:border-court-600">
                      <div className="flex items-center justify-between gap-3">
                        <span className={`flex-1 text-right text-xs font-bold uppercase truncate ${
                          match.result?.winnerTeamId === match.team1.id ? 'text-sport-600 dark:text-sport-400' : 'text-court-400 dark:text-court-500'
                        }`}>{match.team1.name}</span>
                        <span className={`flex-shrink-0 text-xs font-display font-black px-3 py-1 rounded-lg ${
                          match.result 
                            ? 'bg-sport-100 dark:bg-sport-900/50 text-sport-700 dark:text-sport-300' 
                            : 'bg-court-100 dark:bg-court-600 text-court-400 dark:text-court-500'
                        }`}>{match.result?.score || 'VS'}</span>
                        <span className={`flex-1 text-left text-xs font-bold uppercase truncate ${
                          match.result?.winnerTeamId === match.team2.id ? 'text-sport-600 dark:text-sport-400' : 'text-court-400 dark:text-court-500'
                        }`}>{match.team2.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </details>
            </div>
          ))}

          {journeys.length === 0 && (
            <div className="text-center py-16 bg-court-50 dark:bg-court-800 rounded-2xl border-2 border-dashed border-court-200 dark:border-court-700">
              <Calendar className="w-10 h-10 text-court-300 dark:text-court-600 mx-auto mb-3" />
              <p className="font-semibold text-court-400 dark:text-court-500 uppercase text-xs">No tenés jornadas guardadas</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PastJourneys;