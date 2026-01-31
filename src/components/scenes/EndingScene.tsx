import React from 'react';
import { EndingScene as EndingSceneType } from '../../types/scene.types';
import { useGameStore } from '../../stores/gameStore';
import { TextBlock } from '../blocks/TextBlock';

interface Props {
  scene: EndingSceneType;
}

export const EndingScene: React.FC<Props> = ({ scene }) => {
  const { resetGame } = useGameStore();

  const getEndingColor = () => {
    switch (scene.endingType) {
      case 'victory':
        return 'text-green-400';
      case 'defeat':
        return 'text-red-400';
      case 'escape':
        return 'text-blue-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className={`text-4xl font-bold mb-6 text-center ${getEndingColor()}`}>
        {scene.title || 'The End'}
      </h1>

      <div className="space-y-4 mb-8">
        {scene.content.map((block, index) => {
          if (block.type === 'text') {
            return (
              <TextBlock
                key={index}
                content={block.content}
                className="text-center text-lg"
              />
            );
          }
          return null;
        })}
      </div>

      {scene.canRestart && (
        <div className="flex justify-center mt-8">
          <button
            onClick={resetGame}
            className="px-8 py-4 bg-game-highlight hover:bg-red-600 rounded-lg font-semibold text-lg transition-all"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};
