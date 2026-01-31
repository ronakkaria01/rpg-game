import React from 'react';
import { Scene } from '../../types/scene.types';
import { useGameStore } from '../../stores/gameStore';
import { CharacterCreationScene } from '../scenes/CharacterCreationScene';
import { ChoiceScene } from '../scenes/ChoiceScene';
import { GatheringScene } from '../scenes/GatheringScene';
import { CraftingScene } from '../scenes/CraftingScene';
import { CombatScene } from '../scenes/CombatScene';
import { EndingScene } from '../scenes/EndingScene';

export const SceneRenderer: React.FC = () => {
  const currentScene = useGameStore((state) => state.currentScene);

  if (!currentScene) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-400">Loading...</div>
      </div>
    );
  }

  switch (currentScene.type) {
    case 'characterCreation':
      return <CharacterCreationScene scene={currentScene} />;

    case 'narrative':
    case 'choice':
      return <ChoiceScene scene={currentScene} />;

    case 'gathering':
      return <GatheringScene scene={currentScene} />;

    case 'crafting':
      return <CraftingScene scene={currentScene} />;

    case 'combat':
      return <CombatScene scene={currentScene} />;

    case 'ending':
      return <EndingScene scene={currentScene} />;

    default:
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-xl text-red-400">
            Unknown scene type: {(currentScene as Scene).type}
          </div>
        </div>
      );
  }
};
