import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTournament } from './useTournament';
import { createMockStorageAdapter } from '../adapters/secondary/storage/mock.adapter';
import type { Team } from '../types';

const mockTeams: Team[] = [
  { id: '1', name: 'Team 1', players: [{ name: 'P1' }, { name: 'P2' }] },
  { id: '2', name: 'Team 2', players: [{ name: 'P3' }, { name: 'P4' }] },
  { id: '3', name: 'Team 3', players: [{ name: 'P5' }, { name: 'P6' }] },
];

describe('useTournament robustness', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should throw an error if starting with less than 2 teams', () => {
    const mockStorage = createMockStorageAdapter();
    const { result } = renderHook(() => useTournament({ storage: mockStorage }));
    
    expect(() => {
      act(() => {
        result.current.startTournament([]);
      });
    }).toThrow('At least 2 teams are required to start a tournament');
  });

  it('should re-generate the next match when current match is changed', () => {
    const mockStorage = createMockStorageAdapter();
    const { result } = renderHook(() => useTournament({ storage: mockStorage }));
    
    act(() => {
      result.current.startTournament(mockTeams);
    });

    expect(result.current.state.active?.history.length).toBe(2);
    
    // Force change current match to something else
    act(() => {
      result.current.changeCurrentMatch(mockTeams[1].id, mockTeams[2].id);
    });

    expect(result.current.state.active?.history.length).toBe(2);
  });

  it('should only archive matches with results in closeJourney', () => {
    const mockStorage = createMockStorageAdapter();
    const { result } = renderHook(() => useTournament({ storage: mockStorage }));
    
    act(() => {
      result.current.startTournament(mockTeams);
    });

    // Initial: [m0, m1]. currentRoundIndex = 0.
    
    // Finish match 0
    act(() => {
      result.current.finishMatch({ winnerTeamId: mockTeams[0].id, score: '6-0' });
    });

    // After finish: [m0(result), m1, m2]. currentRoundIndex = 1.
    expect(result.current.state.active?.history.length).toBe(3);
    expect(result.current.state.active?.history[0].result).toBeDefined();
    expect(result.current.state.active?.history[1].result).toBeUndefined();
    expect(result.current.state.active?.history[2].result).toBeUndefined();

    act(() => {
      result.current.closeJourney();
    });

    // Should only contain m0(result)
    expect(result.current.state.journeys.length).toBe(1);
    expect(result.current.state.journeys[0].history.length).toBe(1);
    expect(result.current.state.journeys[0].history[0].result).toBeDefined();
  });

  it('should handle storage quota errors gracefully', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const mockStorage = createMockStorageAdapter({ shouldThrowOnSave: true });

    const { result } = renderHook(() => useTournament({ storage: mockStorage }));
    
    act(() => {
      result.current.startTournament(mockTeams);
    });

    // The save will fail but the error should be caught and logged
    expect(consoleSpy).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith('Failed to save:', expect.any(Error));
  });

  it('should support reset to clear mock storage state', () => {
    const mockStorage = createMockStorageAdapter();
    
    const { result } = renderHook(() => useTournament({ storage: mockStorage }));
    
    act(() => {
      result.current.startTournament(mockTeams);
    });

    expect(result.current.state.active).not.toBeNull();

    // Reset the mock storage and verify clean state
    mockStorage.reset();
    
    // Re-render to get fresh state (simulating app reload)
    const { result: result2 } = renderHook(() => useTournament({ storage: mockStorage }));
    
    expect(result2.current.state.active).toBeNull();
    expect(result2.current.state.journeys).toEqual([]);
  });
});