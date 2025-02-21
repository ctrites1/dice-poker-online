import { create } from "zustand";
import type { GameState, Player, PlayerStats } from "../types/game";

interface GameStore {
	game: GameState | null;
	currentPlayer: Player | null;
	playerStats: PlayerStats | null;
	isRolling: boolean;
	heldDice: Set<number>;
	rollsLeft: number;
	setGame: (game: GameState) => void;
	setCurrentPlayer: (player: Player) => void;
	setIsRolling: (isRolling: boolean) => void;
	toggleHeldDie: (index: number) => void;
	decrementRolls: () => void;
	resetRolls: () => void;
	updatePlayerStats: (stats: PlayerStats) => void;
}

export const useGameStore = create<GameStore>((set) => ({
	game: null,
	currentPlayer: null,
	playerStats: null,
	isRolling: false,
	heldDice: new Set(),
	rollsLeft: 3,
	setGame: (game) => set({ game }),
	setCurrentPlayer: (player) => set({ currentPlayer: player }),
	setIsRolling: (isRolling) => set({ isRolling }),
	toggleHeldDie: (index) =>
		set((state) => {
			const newHeldDice = new Set(state.heldDice);
			if (newHeldDice.has(index)) {
				newHeldDice.delete(index);
			} else {
				newHeldDice.add(index);
			}
			return { heldDice: newHeldDice };
		}),
	decrementRolls: () =>
		set((state) => ({ rollsLeft: Math.max(0, state.rollsLeft - 1) })),
	resetRolls: () => set({ rollsLeft: 3, heldDice: new Set() }),
	updatePlayerStats: (stats) => set({ playerStats: stats }),
}));
