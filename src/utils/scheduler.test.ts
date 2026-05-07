import { describe, it, expect } from 'vitest';
import { getNextMatch } from './scheduler';
import type { Team, Match } from '../types';

describe('getNextMatch', () => {
  const teams: Team[] = [
    { id: '1', name: 'T1', players: [{ name: '' }, { name: '' }] },
    { id: '2', name: 'T2', players: [{ name: '' }, { name: '' }] },
    { id: '3', name: 'T3', players: [{ name: '' }, { name: '' }] },
    { id: '4', name: 'T4', players: [{ name: '' }, { name: '' }] },
    { id: '5', name: 'T5', players: [{ name: '' }, { name: '' }] },
  ];

  it('should prioritize teams with fewer matches played', () => {
    // T1 and T2 have played 1 match, others have played 0.
    const history: Match[] = [
      { id: 0, team1: teams[0], team2: teams[1], resting: [teams[2], teams[3], teams[4]], result: { winnerTeamId: '1' } }
    ];

    const next = getNextMatch(teams, history);
    
    // Should pick from teams[2], teams[3], teams[4] as they have 0 matches.
    expect(next.team1.id).not.toBe('1');
    expect(next.team1.id).not.toBe('2');
    expect(next.team2.id).not.toBe('1');
    expect(next.team2.id).not.toBe('2');
  });

  it('should avoid immediate repeats', () => {
    // T1, T2, T3, T4 have played 1 match. T5 has 0.
    const history: Match[] = [
      { id: 0, team1: teams[0], team2: teams[1], resting: [], result: { winnerTeamId: '1' } },
      { id: 1, team1: teams[2], team2: teams[3], resting: [], result: { winnerTeamId: '3' } }
    ];

    const next = getNextMatch(teams, history);

    // T5 MUST be one of the teams. The other should NOT be T3 or T4 (if possible).
    const nextIds = [next.team1.id, next.team2.id];
    expect(nextIds).toContain('5');
    expect(nextIds).not.toContain('3');
    expect(nextIds).not.toContain('4');
  });

  it('should rotate correctly with only 3 teams', () => {
    const threeTeams = teams.slice(0, 3);
    
    // Match 1: Any 2 teams (1 rests)
    const m1 = getNextMatch(threeTeams, []);
    const m1Ids = [m1.team1.id, m1.team2.id].sort();
    expect(m1Ids.length).toBe(2);
    expect(new Set(m1Ids).size).toBe(2);
    expect(m1.resting.length).toBe(1);

    // Match 2: The team that rested MUST play
    const restingId = m1.resting[0].id;
    const history = [
      { ...m1, result: { winnerTeamId: m1.team1.id } }
    ];
    const m2 = getNextMatch(threeTeams, history);
    const m2Ids = [m2.team1.id, m2.team2.id].sort();
    
    expect(m2Ids).toContain(restingId);
    expect(m2Ids).not.toEqual(m1Ids);
    expect(m2.resting.length).toBe(1);
    expect(m2.resting[0].id).not.toBe(restingId);
  });
});
