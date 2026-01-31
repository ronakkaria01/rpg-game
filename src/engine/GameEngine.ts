import { GameData, Consequence, Choice } from '../types/scene.types';
import { GameState } from '../types/game.types';
import { StateManager } from './StateManager';
import { ConditionEvaluator } from './ConditionEvaluator';
import { SceneNavigator } from './SceneNavigator';

export class GameEngine {
  private stateManager: StateManager;
  private conditionEvaluator: ConditionEvaluator;
  private sceneNavigator: SceneNavigator;
  private gameData: GameData;

  constructor(gameData: GameData, initialState?: GameState) {
    this.gameData = gameData;
    this.stateManager = new StateManager(initialState);
    this.conditionEvaluator = new ConditionEvaluator(this.stateManager);
    this.sceneNavigator = new SceneNavigator(gameData, this.stateManager);

    // Navigate to start scene if no initial state
    if (!initialState) {
      this.sceneNavigator.navigateToScene(gameData.startSceneId);
    }
  }

  getStateManager(): StateManager {
    return this.stateManager;
  }

  getConditionEvaluator(): ConditionEvaluator {
    return this.conditionEvaluator;
  }

  getSceneNavigator(): SceneNavigator {
    return this.sceneNavigator;
  }

  getGameData(): GameData {
    return this.gameData;
  }

  getCurrentState(): GameState {
    return this.stateManager.getState();
  }

  processChoice(choice: Choice): void {
    // New trait check system (additive bonuses)
    if (choice.traitChecks && choice.traitChecks.length > 0) {
      // Always process base consequences first
      this.processConsequences(choice.consequences);

      // Check each trait and apply bonuses if player has the trait
      const bonusConsequences: Consequence[] = [];
      choice.traitChecks.forEach(traitCheck => {
        if (this.stateManager.hasTrait(traitCheck.traitId)) {
          bonusConsequences.push(...traitCheck.bonusConsequences);
        }
      });

      // Process all collected bonus consequences
      if (bonusConsequences.length > 0) {
        this.processConsequences(bonusConsequences);
      }
    }
    // Legacy skill check system (backward compatibility)
    else if (choice.skillCheck) {
      const hasTrait = this.stateManager.hasTrait(choice.skillCheck.traitId);
      const consequences = hasTrait
        ? choice.skillCheck.successConsequences
        : choice.skillCheck.failureConsequences;
      this.processConsequences(consequences);
    }
    // No checks, just process base consequences
    else {
      this.processConsequences(choice.consequences);
    }

    // Track combat action if in combat
    if (this.stateManager.getState().combat.active) {
      this.stateManager.addCombatAction(choice.id);
      this.stateManager.incrementCombatTurn();
    }
  }

  private processConsequences(consequences: Consequence[]): void {
    for (const consequence of consequences) {
      this.processConsequence(consequence);
    }
  }

  private processConsequence(consequence: Consequence): void {
    switch (consequence.type) {
      case 'navigate':
        if (consequence.sceneId) {
          this.sceneNavigator.navigateToScene(consequence.sceneId);
        }
        break;

      case 'addItem':
        if (consequence.itemId && consequence.quantity) {
          this.stateManager.addItem(consequence.itemId, consequence.quantity);
        }
        break;

      case 'removeItem':
        if (consequence.itemId && consequence.quantity) {
          this.stateManager.removeItem(consequence.itemId, consequence.quantity);
        }
        break;

      case 'modifyStat':
        if (consequence.stat && consequence.amount !== undefined) {
          if (consequence.stat === 'hp') {
            this.stateManager.modifyHp(consequence.amount);
          } else if (consequence.stat === 'stamina') {
            this.stateManager.modifyStamina(consequence.amount);
          }
        }
        break;

      case 'setBoatRepaired':
        this.stateManager.setBoatRepaired(true);
        break;

      case 'damageEnemy':
        if (consequence.enemyId && consequence.damage) {
          this.stateManager.damageEnemy(consequence.enemyId, consequence.damage);
        }
        break;

      case 'setEnemyDefeated':
        if (consequence.enemyId) {
          this.stateManager.setEnemyDefeated(consequence.enemyId, true);
        }
        break;

      case 'unlockChoice':
        if (consequence.choiceId) {
          this.stateManager.unlockChoice(consequence.choiceId);
        }
        break;

      default:
        console.warn('Unknown consequence type:', consequence);
    }
  }

  craftItem(recipeId: string): boolean {
    const recipe = this.gameData.recipes[recipeId];
    if (!recipe) {
      return false;
    }

    // Calculate actual resource costs (apply crafting skill modifier)
    const ingredients = recipe.ingredients.map(ingredient => {
      let quantity = ingredient.quantity;

      // Apply crafting skill modifier if present
      if (
        recipe.skillModifier &&
        recipe.skillModifier.skillId === 'crafting' &&
        this.stateManager.hasSkill('crafting')
      ) {
        quantity = Math.ceil(quantity * recipe.skillModifier.costMultiplier);
      }

      return { itemId: ingredient.itemId, quantity };
    });

    // Check if player has required resources
    const hasResources = ingredients.every(ingredient =>
      this.stateManager.hasItem(ingredient.itemId, ingredient.quantity)
    );

    if (!hasResources) {
      return false;
    }

    // Remove ingredients
    ingredients.forEach(ingredient => {
      this.stateManager.removeItem(ingredient.itemId, ingredient.quantity);
    });

    // Add result item
    this.stateManager.addItem(recipe.resultItemId, recipe.resultQuantity);

    return true;
  }

  gatherResource(itemId: string, baseQuantity: number): number {
    let quantity = baseQuantity;

    // Apply foraging skill modifier
    if (this.stateManager.hasSkill('foraging')) {
      quantity = Math.floor(quantity * 1.5);
    }

    this.stateManager.addItem(itemId, quantity);
    return quantity;
  }

  checkCombatEnd(): { ended: boolean; victory: boolean } {
    const combat = this.stateManager.getState().combat;
    if (!combat.active || !combat.enemyId) {
      return { ended: false, victory: false };
    }

    const enemy = this.stateManager.getEnemy(combat.enemyId);
    const character = this.stateManager.getState().character;

    // Check if enemy is defeated
    if (enemy && enemy.defeated) {
      this.stateManager.endCombat();
      return { ended: true, victory: true };
    }

    // Check if player is defeated
    if (character.hp <= 0) {
      this.stateManager.endCombat();
      return { ended: true, victory: false };
    }

    return { ended: false, victory: false };
  }

  setCharacterCreation(skills: string[]): void {
    // Extract traits from selected skills
    const traits: string[] = [];
    skills.forEach(skillId => {
      const skill = this.gameData.skills[skillId];
      if (skill && skill.traits) {
        traits.push(...skill.traits);
      }
    });

    // Remove duplicate traits
    const uniqueTraits = [...new Set(traits)];

    this.stateManager.setCharacterSkills(skills, uniqueTraits);
  }
}
