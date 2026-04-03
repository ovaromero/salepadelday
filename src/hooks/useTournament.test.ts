import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTournament } from './useTournament';
import type { Team } from '../types';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value.toString(); },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('useTournament', () => {
  const teams: Team[] = [
    { id: '1', name: 'T1', players: [{ name: 'P1' }, { name: 'P2' }] },
    { id: '2', name: 'T2', players: [{ name: 'P3' }, { name: 'P4' }] },
    { id: '3', name: 'T3', players: [{ name: 'P5' }, { name: 'P6' }] },
    { id: '4', name: 'T4', players: [{ name: 'P7' }, { name: 'P8' }] },
  ];

  beforeEach(() => {
    localStorage.clear();
  });

  it('should start a tournament and then close it into journeys', () => {
    const { result } = renderHook(() => useTournament());

    act(() => {
      result.current.startTournament(teams);
    });

    expect(result.current.state.active).not.toBeNull();
    expect(result.current.state.journeys.length).toBe(0);

    act(() => {
      result.current.closeJourney();
    });

    expect(result.current.state.active).toBeNull();
    expect(result.current.state.journeys.length).toBe(1);
    expect(result.current.state.journeys[0].teams.length).toBe(4);
  });

  it('should delete a journey', () => {
    const { result } = renderHook(() => useTournament());

    act(() => {
      result.current.startTournament(teams);
      result.current.closeJourney();
    });

    const journeyId = result.current.state.journeys[0].id;
    expect(result.current.state.journeys.length).toBe(1);

    act(() => {
      result.current.deleteJourney(journeyId);
    });

    expect(result.current.state.journeys.length).toBe(0);
  });
});
