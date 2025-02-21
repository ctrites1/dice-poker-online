import { useGameStore } from '../../store/gameStore';
import { Dice6, Lock, Unlock } from 'lucide-react';

export function GameControls() {
  const { 
    rollsLeft, 
    isRolling, 
    heldDice,
    currentPlayer,
    toggleHeldDie,
    setIsRolling,
    decrementRolls
  } = useGameStore();

  const handleRoll = () => {
    if (rollsLeft > 0 && !isRolling) {
      setIsRolling(true);
      decrementRolls();
      // Simulate roll animation time
      setTimeout(() => setIsRolling(false), 2000);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="text-lg font-semibold">
          Rolls Left: {rollsLeft}
        </div>
        <button
          onClick={handleRoll}
          disabled={rollsLeft === 0 || isRolling}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
        >
          <Dice6 className="w-5 h-5" />
          Roll Dice
        </button>
      </div>
      
      <div className="grid grid-cols-5 gap-4">
        {currentPlayer?.hand?.map((value, index) => (
          <button
            key={index}
            onClick={() => toggleHeldDie(index)}
            disabled={isRolling}
            className={`relative aspect-square rounded-lg border-2 flex items-center justify-center text-2xl font-bold
              ${heldDice.has(index) ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-white'}`}
          >
            {value}
            {heldDice.has(index) ? (
              <Lock className="absolute top-1 right-1 w-4 h-4 text-red-500" />
            ) : (
              <Unlock className="absolute top-1 right-1 w-4 h-4 text-gray-400" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}