import type { Team, Match } from '../types';

export const generateId = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Shuffles an array in place.
 */
export const shuffle = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

/**
 * Returns the next recommended match based on match counts and avoiding immediate repeats.
 */
export const getNextMatch = (teams: Team[], history: Match[]): Match => {
  const lastMatch = history.length > 0 ? history[history.length - 1] : null;
  const lastMatchIds = lastMatch ? [lastMatch.team1.id, lastMatch.team2.id] : [];

  const counts = teams.map(team => {
    const matchesPlayed = history.filter(m => (m.team1.id === team.id || m.team2.id === team.id) && m.result).length;
    return { team, matchesPlayed };
  });

  // Sort by matches played
  const sorted = shuffle(counts).sort((a, b) => a.matchesPlayed - b.matchesPlayed);

  // Pick first team: someone who didn't just play (if possible)
  let team1Idx = sorted.findIndex(t => !lastMatchIds.includes(t.team.id));
  if (team1Idx === -1) team1Idx = 0; // Fallback to anyone if everyone just played (only possible with 2 teams)
  const team1 = sorted[team1Idx].team;
  
  // Remove team1 from options
  const remaining = sorted.filter((_, idx) => idx !== team1Idx);
  
  // Pick second team: someone who didn't just play (if possible)
  let team2Idx = remaining.findIndex(t => !lastMatchIds.includes(t.team.id));
  if (team2Idx === -1) team2Idx = 0;
  const team2 = remaining[team2Idx].team;

  const resting = teams.filter(t => t.id !== team1.id && t.id !== team2.id);

  return {
    id: history.length,
    team1,
    team2,
    resting,
  };
};

/**
 * Initial match generation for the very first match.
 */
export const generateMatches = (teams: Team[]): Match[] => {
  return [getNextMatch(teams, [])];
};
