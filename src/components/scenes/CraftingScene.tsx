import React from 'react';
import { CraftingScene as CraftingSceneType } from '../../types/scene.types';
import { useGameStore } from '../../stores/gameStore';
import { TextBlock } from '../blocks/TextBlock';
import { InventoryBlock } from '../blocks/InventoryBlock';
import { ChoiceBlock } from '../blocks/ChoiceBlock';

interface Props {
  scene: CraftingSceneType;
}

export const CraftingScene: React.FC<Props> = ({ scene }) => {
  const { gameData, gameState, craftItem, processChoice } = useGameStore();

  if (!gameData || !gameState) return null;

  const handleCraft = (recipeId: string) => {
    const success = craftItem(recipeId);
    if (!success) {
      alert('Not enough resources to craft this item!');
    }
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
          Available Recipes
        </h2>
        {scene.availableRecipes.map((recipeId) => {
          const recipe = gameData.recipes[recipeId];
          if (!recipe) return null;

          const resultItem = gameData.items[recipe.resultItemId];
          if (!resultItem) return null;

          // Calculate actual resource costs with skill modifiers
          const hasCraftingSkill = gameState.character.skills.includes('crafting');
          const ingredients = recipe.ingredients.map((ingredient) => {
            let quantity = ingredient.quantity;

            if (
              recipe.skillModifier &&
              recipe.skillModifier.skillId === 'crafting' &&
              hasCraftingSkill
            ) {
              quantity = Math.ceil(quantity * recipe.skillModifier.costMultiplier);
            }

            return {
              itemId: ingredient.itemId,
              quantity,
            };
          });

          // Check if player has required resources
          const canCraft = ingredients.every((ingredient) =>
            (gameState.inventory[ingredient.itemId] || 0) >= ingredient.quantity
          );

          return (
            <div
              key={recipeId}
              className="bg-game-panel p-4 rounded-lg border-2 border-game-accent"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="font-semibold text-lg">{recipe.name}</div>
                  <div className="text-sm text-gray-400 mt-1">
                    {recipe.description}
                  </div>
                  <div className="text-sm text-gray-300 mt-2">
                    Creates: {resultItem.name} x{recipe.resultQuantity}
                  </div>
                </div>
                <button
                  onClick={() => handleCraft(recipeId)}
                  disabled={!canCraft}
                  className={`
                    px-4 py-2 rounded-lg font-semibold transition-all ml-4
                    ${
                      canCraft
                        ? 'bg-game-highlight hover:bg-red-600 cursor-pointer'
                        : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    }
                  `}
                >
                  Craft
                </button>
              </div>

              <div className="border-t border-gray-600 pt-2">
                <div className="text-sm text-gray-400 mb-1">Required:</div>
                <div className="flex flex-wrap gap-2">
                  {ingredients.map((ingredient) => {
                    const item = gameData.items[ingredient.itemId];
                    const hasQuantity = gameState.inventory[ingredient.itemId] || 0;
                    const hasEnough = hasQuantity >= ingredient.quantity;

                    return (
                      <div
                        key={ingredient.itemId}
                        className={`
                          px-2 py-1 rounded text-xs
                          ${
                            hasEnough
                              ? 'bg-green-900 text-green-200'
                              : 'bg-red-900 text-red-200'
                          }
                        `}
                      >
                        {item?.name} x{ingredient.quantity} ({hasQuantity})
                      </div>
                    );
                  })}
                </div>
              </div>
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
