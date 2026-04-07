import { useState, useEffect, useCallback } from 'react';
import type { Team, MatchResult, TournamentState, Journey, Expenses } from '../types';
import { getNextMatch, generateId } from '../utils/scheduler';

const STORAGE_KEY = 'sale_padel_day_state_v2';

const safeSave = (state: TournamentState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

const isValidState = (data: any): data is TournamentState => {
  if (!data || typeof data !== 'object') return false;
  if (data.active !== null) {
    if (typeof data.active !== 'object') return false;
    if (!Array.isArray(data.active.teams)) return false;
    if (!Array.isArray(data.active.history)) return false;
    if (typeof data.active.currentRoundIndex !== 'number') return false;
  }
  if (!Array.isArray(data.journeys)) return false;
  return true;
};

export const useTournament = () => {
  const [state, setState] = useState<TournamentState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (isValidState(parsed)) {
          return parsed;
        }
      }
    } catch (error) {
      console.error('Failed to load tournament state from localStorage:', error);
    }
    return {
      active: null,
      journeys: [],
    };
  });

  useEffect(() => {
    safeSave(state);
  }, [state]);

  const startTournament = useCallback((teams: Team[]) => {
    if (teams.length < 2) {
      throw new Error('At least 2 teams are required to start a tournament');
    }

    const match0 = getNextMatch(teams, []);
    const match1 = getNextMatch(teams, [match0]);
    setState(prev => ({
      ...prev,
      active: {
        teams,
        currentRoundIndex: 0,
        history: [match0, match1],
      }
    }));
  }, []);

  const finishMatch = useCallback((result: MatchResult) => {
    setState(prev => {
      if (!prev.active) return prev;
      
      // Prevent double-click/race condition if result already exists
      if (prev.active.history[prev.active.currentRoundIndex].result) {
        return prev;
      }
      
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
    if (team1Id === team2Id) return;

    setState(prev => {
      if (!prev.active) return prev;
      
      const team1 = prev.active.teams.find(t => t.id === team1Id);
      const team2 = prev.active.teams.find(t => t.id === team2Id);
      
      if (!team1 || !team2) return prev;

      const resting = prev.active.teams.filter(t => t.id !== team1Id && t.id !== team2Id);

      const updatedHistory = [...prev.active.history];
      updatedHistory[prev.active.currentRoundIndex] = {
        ...updatedHistory[prev.active.currentRoundIndex],
        team1,
        team2,
        resting
      };

      // Delete the next preemptive match and re-generate it
      const baseHistory = updatedHistory.slice(0, prev.active.currentRoundIndex + 1);
      const nextMatch = getNextMatch(prev.active.teams, baseHistory);

      return {
        ...prev,
        active: {
          ...prev.active,
          history: [...baseHistory, nextMatch]
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
        // ONLY archive matches that have a result
        history: prev.active.history.filter(m => !!m.result),
        expenses: null,
      };

      return {
        ...prev,
        active: null,
        journeys: [newJourney, ...prev.journeys],
      };
    });
  }, []);

  const updateJourneyExpenses = useCallback((journeyId: string, expenses: Expenses) => {
    setState(prev => ({
      ...prev,
      journeys: prev.journeys.map(j => 
        j.id === journeyId 
          ? { ...j, expenses }
          : j
      )
    }));
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

  const renameTeam = useCallback((teamId: string, newName: string) => {
    if (!newName.trim()) return;

    setState(prev => {
      if (!prev.active) return prev;

      const updatedTeams = prev.active.teams.map(t => 
        t.id === teamId ? { ...t, name: newName.trim() } : t
      );

      const updateTeamInMatch = (team: Team) => 
        team.id === teamId ? { ...team, name: newName.trim() } : team;

      const updatedHistory = prev.active.history.map(match => ({
        ...match,
        team1: updateTeamInMatch(match.team1),
        team2: updateTeamInMatch(match.team2),
        resting: match.resting.map(updateTeamInMatch)
      }));

      return {
        ...prev,
        active: {
          ...prev.active,
          teams: updatedTeams,
          history: updatedHistory
        }
      };
    });
  }, []);

  const currentMatch = state.active?.history[state.active.currentRoundIndex];
  const nextMatch = state.active?.history[state.active.currentRoundIndex + 1];
  const completedMatches = state.active?.history.filter(m => m.result) || [];

  return {
    state,
    currentMatch,
    nextMatch,
    completedMatches,
    startTournament,
    finishMatch,
    changeCurrentMatch,
    renameTeam,
    closeJourney,
    updateJourneyExpenses,
    deleteJourney,
    resetTournament,
  };
};
