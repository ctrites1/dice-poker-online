import React from "react";
import { DiceScene } from "./components/game/DiceScene";
import { GameControls } from "./components/ui/GameControls";
import { ScoreDisplay } from "./components/ui/ScoreDisplay";
import { useGameStore } from "./store/gameStore";

// Temporary mock data
const mockPlayer = {
	id: "1",
	username: "Player 1",
	avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
	points: 0,
	totalGamesPlayed: 5,
	achievements: [],
	isReady: true,
	hand: [1, 2, 3, 4, 5],
};

const mockGame = {
	id: "1",
	status: "playing" as const,
	players: [mockPlayer],
	currentTurn: "1",
	roundPoints: 0,
};

function App() {
	const { setGame, setCurrentPlayer } = useGameStore();

	React.useEffect(() => {
		setGame(mockGame);
		setCurrentPlayer(mockPlayer);
	}, [setGame, setCurrentPlayer]);

	return (
		<div className="min-h-screen bg-gray-100 p-8">
			<div className="max-w-6xl mx-auto space-y-8">
				<h1 className="text-4xl font-bold text-center text-gray-800">
					Dice Poker
				</h1>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					<div className="lg:col-span-2">
						<DiceScene />
					</div>

					<div className="space-y-6">
						<GameControls />
						<ScoreDisplay />
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;
