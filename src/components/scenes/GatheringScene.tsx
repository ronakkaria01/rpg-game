import React, { useState } from 'react';
import { GatheringScene as GatheringSceneType } from '../../types/scene.types';
import { useGameStore } from '../../stores/gameStore';
import { TextBlock } from '../blocks/TextBlock';
import { InventoryBlock } from '../blocks/InventoryBlock';
import { ChoiceBlock } from '../blocks/ChoiceBlock';

interface Props {
  scene: GatheringSceneType;
}

export const GatheringScene: React.FC<Props> = ({ scene }) => {
  const { gameData, gatherResource, processChoice } = useGameStore();
  const [gathering, setGathering] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  if (!gameData) return null;

  const handleGather = (itemId: string, baseQuantity: number, gatherTime: number) => {
    setGathering(itemId);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          gatherResource(itemId, baseQuantity);
          setGathering(null);
          return 0;
        }
        return prev + (100 / (gatherTime * 10));
      });
    }, 100);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {scene.title && (
        <h1 className="text-3xl font-bold mb-6 text-game-highlight">
          {scene.title}
        </h1>
      )}

      <div className="space-y-4 mb-6">
        {scene.content.map((block, index) => {
          if (block.type === 'text') {
            return <TextBlock key={index} content={block.content} />;
          }
          return null;
        })}
      </div>

      <div className="mb-6">
        <InventoryBlock />
      </div>

      <div className="space-y-3 mb-6">
        <h2 className="text-xl font-semibold text-gray-200">
          Available Resources
        </h2>
        {scene.resources.map((resource) => {
          const item = gameData.items[resource.itemId];
          if (!item) return null;

          const isGathering = gathering === resource.itemId;

          return (
            <div
              key={resource.itemId}
              className="bg-game-panel p-4 rounded-lg border-2 border-game-accent"
            >
              <div className="flex justify-between items-center mb-2">
                <div>
                  <div className="font-semibold text-lg">{item.name}</div>
                  <div className="text-sm text-gray-400">
                    {item.description}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Gather time: {resource.gatherTime}s
                  </div>
                </div>
                <button
                  onClick={() =>
                    handleGather(
                      resource.itemId,
                      resource.baseQuantity,
                      resource.gatherTime
                    )
                  }
                  disabled={gathering !== null}
                  className={`
                    px-4 py-2 rounded-lg font-semibold transition-all
                    ${
                      gathering !== null
                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        : 'bg-game-highlight hover:bg-red-600 cursor-pointer'
                    }
                  `}
                >
                  Gather
                </button>
              </div>

              {isGathering && (
                <div className="mt-2">
                  <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-game-highlight h-full transition-all duration-100"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6">
        <ChoiceBlock choice={scene.exitChoice} onSelect={processChoice} />
      </div>
    </div>
  );
};
