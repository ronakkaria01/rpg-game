import React from 'react';
import { CombatScene as CombatSceneType } from '../../types/scene.types';
import { useGameStore } from '../../stores/gameStore';
import { TextBlock } from '../blocks/TextBlock';
import { StatsBar } from '../blocks/StatsBar';
import { ChoiceBlock } from '../blocks/ChoiceBlock';

interface Props {
  scene: CombatSceneType;
}

export const CombatScene: React.FC<Props> = ({ scene }) => {
  const { gameEngine, gameData, gameState, processChoice } = useGameStore();

  if (!gameEngine || !gameData || !gameState) return null;

  const conditionEvaluator = gameEngine.getConditionEvaluator();
  const enemy = gameState.enemies[scene.enemyId];
  const enemyDef = gameData.enemies[scene.enemyId];

  if (!enemy || !enemyDef) return null;

  // Filter choices based on conditions
  const availableChoices = scene.choices.filter((choice) => {
    if (!choice.conditions) return true;
    return conditionEvaluator.evaluateAll(choice.conditions);
  });

  const enemyHpPercentage = (enemy.hp / enemy.maxHp) * 100;

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

      <div className="bg-game-panel p-6 rounded-lg mb-6 border-2 border-red-600">
        <h2 className="text-2xl font-bold mb-3 text-red-400">{enemyDef.name}</h2>
        <p className="text-gray-300 mb-4">{enemyDef.description}</p>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-red-400">Enemy HP</span>
            <span className="text-gray-300">
              {enemy.hp} / {enemy.maxHp}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
            <div
              className="bg-red-600 h-full transition-all duration-300"
              style={{ width: `${enemyHpPercentage}%` }}
            />
          </div>
        </div>

        {enemy.weakPoints && enemy.weakPoints.length > 0 && (
          <div className="mt-4">
            <div className="text-sm text-gray-400 mb-2">Weak Points:</div>
            <div className="flex gap-2">
              {enemy.weakPoints.map((wp) => (
                <div
                  key={wp.id}
                  className={`
                    px-3 py-1 rounded text-sm
                    ${
                      wp.destroyed
                        ? 'bg-gray-700 text-gray-500 line-through'
                        : 'bg-red-900 text-red-200'
                    }
                  `}
                >
                  {wp.name}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mb-6">
        <StatsBar showHp={true} showStamina={true} />
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-200 mb-3">
          Choose Your Action
        </h2>
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
          No available actions. You may need to find weapons or improve your stats.
        </div>
      )}
    </div>
  );
};
