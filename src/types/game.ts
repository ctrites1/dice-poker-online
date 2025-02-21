export interface Player {
  id: string;
  username: string;
  avatarUrl: string;
  currency: number;
  isReady: boolean;
  hand?: number[];
}

export interface GameState {
  id: string;
  status: 'waiting' | 'playing' | 'finished';
  players: Player[];
  currentTurn: string;
  betAmount: number;
  pot: number;
  winner?: string;
}

export interface DiceConfig {
  position: [number, number, number];
  rotation: [number, number, number];
  velocity: [number, number, number];
  angularVelocity: [number, number, number];
}

export type PokerHand = 
  | 'Five of a Kind'
  | 'Four of a Kind'
  | 'Full House'
  | 'High Straight'
  | 'Low Straight'
  | 'Three of a Kind'
  | 'Two Pair'
  | 'One Pair'
  | 'Nothing';