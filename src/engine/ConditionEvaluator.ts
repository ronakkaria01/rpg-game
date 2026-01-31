import { Condition } from '../types/scene.types';
import { StateManager } from './StateManager';

export class ConditionEvaluator {
  constructor(private stateManager: StateManager) {}

  evaluate(condition: Condition): boolean {
    switch (condition.type) {
      case 'hasSkill':
        return this.stateManager.hasSkill(condition.skillId);

      case 'hasTrait':
        return this.stateManager.hasTrait(condition.traitId);

      case 'hasItem':
        return this.stateManager.hasItem(condition.itemId, condition.quantity);

      case 'hasResources':
        return condition.resources.every(resource =>
          this.stateManager.hasItem(resource.itemId, resource.quantity)
        );

      case 'statGreaterThan':
        return this.getStatValue(condition.stat) > condition.value;

      case 'statLessThan':
        return this.getStatValue(condition.stat) < condition.value;

      case 'boatRepaired':
        return this.stateManager.getState().boat.repaired;

      case 'enemyDefeated':
        return this.stateManager.isEnemyDefeated(condition.enemyId);

      case 'sceneVisited':
        return this.stateManager.hasVisitedScene(condition.sceneId);

      case 'and':
        return condition.conditions.every(c => this.evaluate(c));

      case 'or':
        return condition.conditions.some(c => this.evaluate(c));

      case 'not':
        return !this.evaluate(condition.conditions[0]);

      default:
        return false;
    }
  }

  private getStatValue(stat: 'hp' | 'stamina' | 'maxHp' | 'maxStamina'): number {
    const character = this.stateManager.getState().character;
    switch (stat) {
      case 'hp':
        return character.hp;
      case 'stamina':
        return character.stamina;
      case 'maxHp':
        return character.maxHp;
      case 'maxStamina':
        return character.maxStamina;
      default:
        return 0;
    }
  }

  evaluateAll(conditions?: Condition[]): boolean {
    if (!conditions || conditions.length === 0) {
      return true;
    }
    return conditions.every(condition => this.evaluate(condition));
  }
}
