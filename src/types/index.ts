export interface Player {
  name: string;
}

export interface Team {
  id: string;
  name: string;
  players: [Player, Player];
}

export interface MatchResult {
  winnerTeamId: string;
  score?: string; // e.g., "4-2"
}

export interface Match {
  id: number;
  team1: Team;
  team2: Team;
  resting: Team[];
  result?: MatchResult;
}

export interface Journey {
  id: string;
  date: string; // ISO string
  teams: Team[];
  history: Match[];
}

export interface ActiveTournament {
  teams: Team[];
  currentRoundIndex: number;
  history: Match[];
}

export interface TournamentState {
  active: ActiveTournament | null;
  journeys: Journey[];
}
