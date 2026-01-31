import React from 'react';
import { ChoiceScene as ChoiceSceneType, NarrativeScene } from '../../types/scene.types';
import { useGameStore } from '../../stores/gameStore';
import { TextBlock } from '../blocks/TextBlock';
import { StatsBar } from '../blocks/StatsBar';
import { InventoryBlock } from '../blocks/InventoryBlock';
import { ChoiceBlock } from '../blocks/ChoiceBlock';

interface Props {
  scene: ChoiceSceneType | NarrativeScene;
}

export const ChoiceScene: React.FC<Props> = ({ scene }) => {
  const { gameEngine, processChoice } = useGameStore();

  if (!gameEngine) return null;

  const conditionEvaluator = gameEngine.getConditionEvaluator();

  // Filter choices based on conditions
  const availableChoices = scene.choices.filter((choice) => {
    if (!choice.conditions) return true;
    return conditionEvaluator.evaluateAll(choice.conditions);
  });

  return (
    <div className="max-w-4xl mx-auto p-6">
      {scene.title && (
        <h1 className="text-3xl font-bold mb-6 text-game-highlight">
          {scene.title}
        </h1>
      )}

      <div className="space-y-4 mb-6">
        {scene.content.map((block, index) => {
          switch (block.type) {
            case 'text':
              return <TextBlock key={index} content={block.content} className={block.className} />;

            case 'stats':
              return (
                <StatsBar
                  key={index}
                  showHp={block.showHp}
                  showStamina={block.showStamina}
                />
              );

            case 'inventory':
              return <InventoryBlock key={index} title={block.title} />;

            default:
              return null;
          }
        })}
      </div>

      <div className="space-y-3">
        {availableChoices.map((choice) => (
          <ChoiceBlock
            key={choice.id}
            choice={choice}
            onSelect={processChoice}
          />
        ))}
      </div>

      {availableChoices.length === 0 && (
        <div className="text-center text-gray-400 italic mt-8">
          No available choices. You may need to gather resources or improve your stats.
        </div>
      )}
    </div>
  );
};
