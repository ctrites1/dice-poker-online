export interface Player {
	id: string;
	username: string;
	avatarUrl: string;
	points: number;
	totalGamesPlayed: number;
	achievements: Achievement[];
	isReady: boolean;
	hand?: number[];
}

export interface GameState {
	id: string;
	status: "waiting" | "playing" | "finished";
	players: Player[];
	currentTurn: string;
	roundPoints: number;
	winner?: string;
}

export interface DiceConfig {
	position: [number, number, number];
	rotation: [number, number, number];
	velocity: [number, number, number];
	angularVelocity: [number, number, number];
}

export type PokerHand =
	| "Five of a Kind"
	| "Four of a Kind"
	| "Full House"
	| "High Straight"
	| "Low Straight"
	| "Three of a Kind"
	| "Two Pair"
	| "One Pair"
	| "Nothing";

export interface Achievement {
	id: string;
	name: string;
	description: string;
	unlockedAt?: Date;
}

export interface PlayerStats {
	totalPoints: number;
	gamesPlayed: number;
	wins: number;
	bestHand: PokerHand;
	achievementsUnlocked: number;
}
