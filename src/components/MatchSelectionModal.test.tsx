import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MatchSelectionModal from './MatchSelectionModal';
import type { Team } from '../types';

describe('MatchSelectionModal', () => {
  const teams: Team[] = [
    { id: '1', name: 'Equipo A', players: [{ name: '' }, { name: '' }] },
    { id: '2', name: 'Equipo B', players: [{ name: '' }, { name: '' }] },
    { id: '3', name: 'Equipo C', players: [{ name: '' }, { name: '' }] },
    { id: '4', name: 'Equipo D', players: [{ name: '' }, { name: '' }] },
  ];

  it('should call onSelect with new team IDs', () => {
    const onSelect = vi.fn();
    const onCancel = vi.fn();
    render(<MatchSelectionModal teams={teams} currentTeam1Id="1" currentTeam2Id="2" onSelect={onSelect} onCancel={onCancel} />);

    // Select Team 3 instead of Team 1
    const team1Select = screen.getByLabelText(/Equipo 1/i);
    fireEvent.change(team1Select, { target: { value: '3' } });

    const saveButton = screen.getByRole('button', { name: /Cambiar/i });
    fireEvent.click(saveButton);

    expect(onSelect).toHaveBeenCalledWith('3', '2');
  });
});
