import { useState, useEffect, useCallback } from 'react';
import type { Team, MatchResult, TournamentState, Journey } from '../types';
import { generateMatches, getNextMatch, generateId } from '../utils/scheduler';

const STORAGE_KEY = 'sale_padel_day_state_v2';

export const useTournament = () => {
  const [state, setState] = useState<TournamentState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      active: null,
      journeys: [],
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const startTournament = useCallback((teams: Team[]) => {
    const initialMatches = generateMatches(teams);
    setState(prev => ({
      ...prev,
      active: {
        teams,
        currentRoundIndex: 0,
        history: initialMatches,
      }
    }));
  }, []);

  const finishMatch = useCallback((result: MatchResult) => {
    setState(prev => {
      if (!prev.active) return prev;
      
      const newHistory = [...prev.active.history];
      newHistory[prev.active.currentRoundIndex].result = result;

      const nextMatch = getNextMatch(prev.active.teams, newHistory);
      
      return {
        ...prev,
        active: {
          ...prev.active,
          history: [...newHistory, nextMatch],
          currentRoundIndex: prev.active.currentRoundIndex + 1,
        }
      };
    });
  }, []);

  const changeCurrentMatch = useCallback((team1Id: string, team2Id: string) => {
    setState(prev => {
      if (!prev.active) return prev;
      
      const team1 = prev.active.teams.find(t => t.id === team1Id)!;
      const team2 = prev.active.teams.find(t => t.id === team2Id)!;
      const resting = prev.active.teams.filter(t => t.id !== team1Id && t.id !== team2Id);

      const newHistory = [...prev.active.history];
      newHistory[prev.active.currentRoundIndex] = {
        ...newHistory[prev.active.currentRoundIndex],
        team1,
        team2,
        resting
      };

      return {
        ...prev,
        active: {
          ...prev.active,
          history: newHistory
        }
      };
    });
  }, []);

  const closeJourney = useCallback(() => {
    setState(prev => {
      if (!prev.active) return prev;
      
      const newJourney: Journey = {
        id: generateId(),
        date: new Date().toISOString(),
        teams: prev.active.teams,
        history: prev.active.history.filter(m => m.result), // Only save completed matches
      };

      return {
        ...prev,
        active: null,
        journeys: [newJourney, ...prev.journeys],
      };
    });
  }, []);

  const deleteJourney = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      journeys: prev.journeys.filter(j => j.id !== id),
    }));
  }, []);

  const resetTournament = useCallback(() => {
    setState(prev => ({
      ...prev,
      active: null
    }));
  }, []);

  const currentMatch = state.active?.history[state.active.currentRoundIndex];
  const nextMatch = state.active?.history[state.active.currentRoundIndex + 1]; // In dynamic mode, next is pre-calculated but can be overridden
  const completedMatches = state.active?.history.filter(m => m.result) || [];

  return {
    state,
    currentMatch,
    nextMatch,
    completedMatches,
    startTournament,
    finishMatch,
    changeCurrentMatch,
    closeJourney,
    deleteJourney,
    resetTournament,
  };
};
