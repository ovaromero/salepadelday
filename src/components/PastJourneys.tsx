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
          <button onClick={onBack} className="w-10 h-10 rounded-xl bg-white border border-court-200 flex items-center justify-center hover:bg-court-50 hover:shadow-md transition-all">
            <ChevronLeft className="w-5 h-5 text-court-600" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-display font-black text-court-900 tracking-tight">Historial</h1>
              <p className="text-[10px] font-bold text-court-400 uppercase tracking-wider">Jornadas anteriores</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {journeys.map((journey, jIdx) => (
            <div 
              key={journey.id} 
              className="bg-white rounded-2xl p-4 sm:p-5 shadow-md border border-court-100 group relative animate-slide-up"
              style={{ animationDelay: `${jIdx * 50}ms` }}
            >
              {/* Delete button */}
              <button 
                onClick={() => handleDelete(journey.id)}
                className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-500 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                title="Borrar jornada"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              {/* Journey header */}
              <div className="flex items-start gap-3 mb-4 pr-10">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-violet-500" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-court-400 uppercase tracking-wider mb-0.5">{formatDate(journey.date)}</p>
                  <h2 className="text-sm font-display font-black text-court-800 uppercase tracking-tight">
                    Jornada de {journey.teams.length} Equipos
                  </h2>
                </div>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-court-50 rounded-xl p-3 text-center">
                  <p className="text-[9px] font-bold text-court-400 uppercase tracking-wider mb-1">Partidos</p>
                  <p className="text-lg font-display font-black text-court-800">{journey.history.length}</p>
                </div>
                <div className="bg-sport-50 rounded-xl p-3 text-center">
                  <p className="text-[9px] font-bold text-court-400 uppercase tracking-wider mb-1">Ganador</p>
                  <p className="text-xs font-display font-black text-sport-600 uppercase leading-tight">
                    {(() => {
                      const wins = journey.teams.map(t => ({
                        name: t.name,
                        count: journey.history.filter(m => m.result?.winnerTeamId === t.id).length
                      })).sort((a, b) => b.count - a.count);
                      return wins[0]?.name || '-';
                    })()}
                  </p>
                </div>
                <div className="bg-energy-50 rounded-xl p-3 text-center">
                  <p className="text-[9px] font-bold text-court-400 uppercase tracking-wider mb-1">Gastos</p>
                  <p className="text-xs font-display font-black text-energy-600">
                    {journey.expenses ? '$' + Object.values(journey.expenses).reduce((sum, e) => sum + e.amount, 0).toLocaleString() : 'Sin cargar'}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <button
                onClick={() => onViewExpenses(journey)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold uppercase text-xs transition-all mb-3 bg-sport-50 text-sport-700 hover:bg-sport-100 hover:shadow-md"
              >
                <DollarSign className="w-3.5 h-3.5" />
                {journey.expenses ? 'Ver Gastos' : 'Cargar Gastos'}
              </button>

              {/* Match details */}
              <details className="group/details">
                <summary className="text-[10px] font-bold uppercase tracking-wider text-court-400 cursor-pointer hover:text-sport-600 transition-colors list-none flex items-center justify-center gap-1 py-2">
                  <Eye className="w-3 h-3" />
                  Ver Detalle de Partidos
                  <ChevronDown className="w-3.5 h-3.5 transform group-open/details:rotate-180 transition-transform" />
                </summary>
                <div className="mt-3 space-y-1.5 max-h-60 overflow-y-auto pr-1">
                  {journey.history.map((match, mIdx) => (
                    <div key={mIdx} className="flex items-center justify-between bg-court-50/50 p-2.5 rounded-xl border border-court-100">
                      <span className={`text-[10px] font-bold uppercase ${
                        match.result?.winnerTeamId === match.team1.id ? 'text-sport-600' : 'text-court-400'
                      }`}>{match.team1.name}</span>
                      <span className={`text-[10px] font-display font-black px-2 py-0.5 rounded-md ${
                        match.result 
                          ? 'bg-sport-100 text-sport-700' 
                          : 'bg-court-100 text-court-400'
                      }`}>{match.result?.score || 'VS'}</span>
                      <span className={`text-[10px] font-bold uppercase ${
                        match.result?.winnerTeamId === match.team2.id ? 'text-sport-600' : 'text-court-400'
                      }`}>{match.team2.name}</span>
                    </div>
                  ))}
                </div>
              </details>
            </div>
          ))}

          {journeys.length === 0 && (
            <div className="text-center py-16 bg-court-50 rounded-2xl border-2 border-dashed border-court-200">
              <Calendar className="w-10 h-10 text-court-300 mx-auto mb-3" />
              <p className="font-semibold text-court-400 uppercase text-xs">No tenés jornadas guardadas</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PastJourneys;
