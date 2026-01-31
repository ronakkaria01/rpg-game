import React from 'react';
import { useGameStore } from '../../stores/gameStore';

interface StatsBarProps {
  showHp?: boolean;
  showStamina?: boolean;
}

export const StatsBar: React.FC<StatsBarProps> = ({
  showHp = true,
  showStamina = true,
}) => {
  const gameState = useGameStore((state) => state.gameState);

  if (!gameState) return null;

  const { character } = gameState;
  const hpPercentage = (character.hp / character.maxHp) * 100;
  const staminaPercentage = (character.stamina / character.maxStamina) * 100;

  return (
    <div className="bg-game-panel p-4 rounded-lg space-y-3">
      {showHp && (
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-red-400">HP</span>
            <span className="text-gray-300">
              {character.hp} / {character.maxHp}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              className="bg-red-500 h-full transition-all duration-300"
              style={{ width: `${hpPercentage}%` }}
            />
          </div>
        </div>
      )}

      {showStamina && (
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-green-400">Stamina</span>
            <span className="text-gray-300">
              {character.stamina} / {character.maxStamina}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              className="bg-green-500 h-full transition-all duration-300"
              style={{ width: `${staminaPercentage}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
