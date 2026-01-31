import React from 'react';
import { useGameStore } from '../../stores/gameStore';

interface InventoryBlockProps {
  title?: string;
}

export const InventoryBlock: React.FC<InventoryBlockProps> = ({
  title = 'Inventory',
}) => {
  const gameState = useGameStore((state) => state.gameState);
  const gameData = useGameStore((state) => state.gameData);

  if (!gameState || !gameData) return null;

  const inventoryEntries = Object.entries(gameState.inventory);

  if (inventoryEntries.length === 0) {
    return (
      <div className="bg-game-panel p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2 text-game-highlight">{title}</h3>
        <p className="text-gray-400 italic">Empty</p>
      </div>
    );
  }

  return (
    <div className="bg-game-panel p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-3 text-game-highlight">{title}</h3>
      <div className="grid grid-cols-2 gap-2">
        {inventoryEntries.map(([itemId, quantity]) => {
          const item = gameData.items[itemId];
          if (!item) return null;

          return (
            <div
              key={itemId}
              className="bg-game-accent p-2 rounded border border-gray-600"
            >
              <div className="font-medium text-sm">{item.name}</div>
              <div className="text-xs text-gray-400">x{quantity}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
