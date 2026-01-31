import React from 'react';
import { Choice } from '../../types/scene.types';
import { useGameStore } from '../../stores/gameStore';

interface ChoiceBlockProps {
  choice: Choice;
  onSelect: (choice: Choice) => void;
  disabled?: boolean;
}

export const ChoiceBlock: React.FC<ChoiceBlockProps> = ({
  choice,
  onSelect,
  disabled = false,
}) => {
  const gameState = useGameStore((state) => state.gameState);
  const playerTraits = gameState?.character.traits || [];

  return (
    <button
      onClick={() => onSelect(choice)}
      disabled={disabled}
      className={`
        w-full text-left p-4 rounded-lg border-2 transition-all
        ${
          disabled
            ? 'bg-gray-700 border-gray-600 text-gray-500 cursor-not-allowed'
            : 'bg-game-panel border-game-accent hover:border-game-highlight hover:bg-game-accent cursor-pointer'
        }
      `}
    >
      <div className="font-semibold text-lg mb-1">{choice.text}</div>
      {choice.description && (
        <div className="text-sm text-gray-400 mb-2">{choice.description}</div>
      )}

      {/* Show trait bonuses if available */}
      {choice.traitChecks && choice.traitChecks.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {choice.traitChecks.map((traitCheck) => {
            const hasTrait = playerTraits.includes(traitCheck.traitId);
            return (
              <span
                key={traitCheck.traitId}
                className={`
                  px-2 py-1 rounded text-xs font-medium
                  ${
                    hasTrait
                      ? 'bg-green-900 text-green-200 border border-green-600'
                      : 'bg-gray-700 text-gray-400 border border-gray-600'
                  }
                `}
              >
                {hasTrait ? '✓ ' : '○ '}{traitCheck.traitId}
              </span>
            );
          })}
        </div>
      )}
    </button>
  );
};
