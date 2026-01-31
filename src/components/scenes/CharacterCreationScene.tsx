import React, { useState } from 'react';
import { CharacterCreationScene as CharacterCreationSceneType } from '../../types/scene.types';
import { useGameStore } from '../../stores/gameStore';
import { TextBlock } from '../blocks/TextBlock';

interface Props {
  scene: CharacterCreationSceneType;
}

export const CharacterCreationScene: React.FC<Props> = ({ scene }) => {
  const { gameData, setCharacterCreation, navigateToScene } = useGameStore();
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  if (!gameData) return null;

  const handleSkillToggle = (skillId: string) => {
    if (selectedSkills.includes(skillId)) {
      setSelectedSkills(selectedSkills.filter((id) => id !== skillId));
    } else {
      if (selectedSkills.length < scene.skillSelectionCount) {
        setSelectedSkills([...selectedSkills, skillId]);
      }
    }
  };

  const handleConfirm = () => {
    if (selectedSkills.length === scene.skillSelectionCount) {
      setCharacterCreation(selectedSkills);
      navigateToScene(scene.nextSceneId);
    }
  };

  const canConfirm = selectedSkills.length === scene.skillSelectionCount;

  // Get all traits from selected skills
  const selectedTraits: string[] = [];
  selectedSkills.forEach(skillId => {
    const skill = gameData.skills[skillId];
    if (skill && skill.traits) {
      selectedTraits.push(...skill.traits);
    }
  });
  const uniqueTraits = [...new Set(selectedTraits)];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-game-highlight">
        {scene.title || 'Character Creation'}
      </h1>

      {scene.content.map((block, index) => {
        if (block.type === 'text') {
          return <TextBlock key={index} content={block.content} />;
        }
        return null;
      })}

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-200">
          Select {scene.skillSelectionCount} Skills
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {scene.availableSkills.map((skillId) => {
            const skill = gameData.skills[skillId];
            if (!skill) return null;

            const isSelected = selectedSkills.includes(skillId);
            const isDisabled =
              !isSelected && selectedSkills.length >= scene.skillSelectionCount;

            return (
              <button
                key={skillId}
                onClick={() => handleSkillToggle(skillId)}
                disabled={isDisabled}
                className={`
                  text-left p-4 rounded-lg border-2 transition-all
                  ${
                    isSelected
                      ? 'bg-game-highlight border-game-highlight'
                      : isDisabled
                      ? 'bg-gray-700 border-gray-600 text-gray-500 cursor-not-allowed'
                      : 'bg-game-panel border-game-accent hover:border-game-highlight'
                  }
                `}
              >
                <div className="font-semibold text-lg">{skill.name}</div>
                <div className="text-sm text-gray-300 mt-1">
                  {skill.description}
                </div>
                <div className="text-xs text-gray-400 mt-2">
                  Traits: {skill.traits.join(', ')}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {uniqueTraits.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-200">
            Your Combined Traits
          </h2>
          <div className="bg-game-panel p-4 rounded-lg border-2 border-game-accent">
            <div className="flex flex-wrap gap-2">
              {uniqueTraits.map((trait) => (
                <span
                  key={trait}
                  className="px-3 py-1 bg-game-highlight rounded-full text-sm"
                >
                  {trait}
                </span>
              ))}
            </div>
            <p className="text-sm text-gray-400 mt-3">
              These traits from your skills will affect your gameplay
            </p>
          </div>
        </div>
      )}

      <div className="mt-8">
        <button
          onClick={handleConfirm}
          disabled={!canConfirm}
          className={`
            w-full p-4 rounded-lg font-semibold text-lg transition-all
            ${
              canConfirm
                ? 'bg-game-highlight hover:bg-red-600 cursor-pointer'
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          Confirm Selection
        </button>
      </div>
    </div>
  );
};
