import { useGameStore } from "../../store/gameStore";
import { Trophy } from "lucide-react";

export function ScoreDisplay() {
	const { currentPlayer, playerStats } = useGameStore();

	return (
		<div className="bg-stone-950 p-6 rounded-lg shadow-lg">
			<h2 className="text-xl font-semibold mb-4">Game Stats</h2>
			<div className="space-y-4">
				<div className="flex justify-between items-center">
					<span>Current Points:</span>
					<span className="font-bold">{currentPlayer?.points || 0}</span>
				</div>

				<div className="flex justify-between items-center">
					<span>Games Played:</span>
					<span>{playerStats?.gamesPlayed || 0}</span>
				</div>

				<div className="flex justify-between items-center">
					<span>Total Wins:</span>
					<span>{playerStats?.wins || 0}</span>
				</div>

				<div className="flex justify-between items-center">
					<span>Best Hand:</span>
					<span>{playerStats?.bestHand || "None"}</span>
				</div>

				<div className="mt-4 pt-4 border-t">
					<div className="flex items-center gap-2">
						<Trophy className="w-5 h-5 text-yellow-500" />
						<span>Achievements: {playerStats?.achievementsUnlocked || 0}</span>
					</div>
				</div>
			</div>
		</div>
	);
}
