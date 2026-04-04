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
  score?: string;
}

export interface Match {
  id: number;
  team1: Team;
  team2: Team;
  resting: Team[];
  result?: MatchResult;
}

export interface ExpenseItem {
  amount: number;
  players: number;
}

export type ExpenseCategory = 'court' | 'food' | 'soda' | 'beer' | 'balls';

export interface Expenses {
  court: ExpenseItem;
  food: ExpenseItem;
  soda: ExpenseItem;
  beer: ExpenseItem;
  balls: ExpenseItem;
}

export interface Journey {
  id: string;
  date: string;
  teams: Team[];
  history: Match[];
  expenses: Expenses | null;
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
