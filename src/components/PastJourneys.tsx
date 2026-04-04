import type { FC } from 'react';
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
    <div className="max-w-2xl mx-auto px-2 sm:p-4 flex flex-col min-h-screen">
      <div className="flex items-center mb-6 sm:mb-8">
        <button onClick={onBack} className="mr-2 sm:mr-4 p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-800 tracking-tighter uppercase italic">Historial</h1>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {journeys.map(journey => (
          <div key={journey.id} className="bg-white rounded-3xl p-4 sm:p-6 shadow-md border border-gray-100 group relative">
            <button 
              onClick={() => handleDelete(journey.id)}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 text-red-300 hover:text-red-500 transition-colors p-2"
              title="Borrar jornada"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>

            <div className="mb-3 sm:mb-4">
              <p className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-1">{formatDate(journey.date)}</p>
              <h2 className="text-lg sm:text-xl font-black text-gray-800 uppercase tracking-tighter">Jornada de {journey.teams.length} Equipos</h2>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-6">
              <div className="bg-gray-50 rounded-2xl p-3 sm:p-4 text-center">
                <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Partidos</p>
                <p className="text-xl sm:text-2xl font-black text-gray-800">{journey.history.length}</p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-3 sm:p-4 text-center">
                <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Ganador</p>
                <p className="text-xs sm:text-sm font-black text-indigo-600 uppercase">
                  {(() => {
                    const wins = journey.teams.map(t => ({
                      name: t.name,
                      count: journey.history.filter(m => m.result?.winnerTeamId === t.id).length
                    })).sort((a, b) => b.count - a.count);
                    return wins[0]?.name || '-';
                  })()}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onViewExpenses(journey)}
                className={`flex-1 py-2 px-3 rounded-xl font-bold uppercase text-xs transition-all ${
                  journey.expenses 
                    ? 'bg-green-50 text-green-600 hover:bg-green-100' 
                    : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                }`}
              >
                {journey.expenses ? 'Ver Gastos' : 'Cargar Gastos'}
              </button>
            </div>

            <details className="group/details">
              <summary className="text-xs font-black uppercase tracking-widest text-gray-400 cursor-pointer hover:text-indigo-500 transition-colors list-none flex items-center justify-center">
                Ver Detalle de Partidos
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transform group-open/details:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="mt-4 space-y-2 max-h-60 overflow-y-auto pr-2">
                {journey.history.map((match, mIdx) => (
                  <div key={mIdx} className="flex items-center justify-between bg-gray-50/50 p-2 sm:p-3 rounded-xl border border-gray-100">
                    <span className={`text-[10px] font-black uppercase ${match.result?.winnerTeamId === match.team1.id ? 'text-indigo-600' : 'text-gray-400'}`}>{match.team1.name}</span>
                    <span className="text-[10px] font-black bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded italic">{match.result?.score || 'VS'}</span>
                    <span className={`text-[10px] font-black uppercase ${match.result?.winnerTeamId === match.team2.id ? 'text-indigo-600' : 'text-gray-400'}`}>{match.team2.name}</span>
                  </div>
                ))}
              </div>
            </details>
          </div>
        ))}

        {journeys.length === 0 && (
          <div className="text-center py-16 sm:py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
            <p className="font-bold text-gray-400 uppercase text-sm">No tenés jornadas guardadas</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PastJourneys;
