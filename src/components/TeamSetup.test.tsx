import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TeamSetup from './TeamSetup';

describe('TeamSetup', () => {
  it('should allow starting with only team names (player names are optional)', () => {
    const onStart = vi.fn();
    render(<TeamSetup onStart={onStart} />);

    // Team names are pre-filled as "Equipo 1", "Equipo 2", etc.
    const startButton = screen.getByRole('button', { name: /¡Comenzar Torneo!/i });
    
    // We don't fill player names, just click start
    fireEvent.click(startButton);

    expect(onStart).toHaveBeenCalled();
    const calledTeams = onStart.mock.calls[0][0];
    expect(calledTeams.length).toBe(4); // default 4 teams
    expect(calledTeams[0].players[0].name).toBe('');
  });
});
