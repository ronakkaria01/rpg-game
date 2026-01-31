import { GameState, Enemy } from '../types/game.types';

// DEV MODE: Set to true to start with 999 of every item
const DEV_MODE = true;

export class StateManager {
  private state: GameState;

  constructor(initialState?: GameState) {
    this.state = initialState || this.createInitialState();
  }

  private createInitialState(): GameState {
    // Dev mode inventory with all items
    const devInventory: { [key: string]: number } = DEV_MODE ? {
      sturdyBranch: 999,
      smallBranch: 999,
      sap: 999,
      toughBark: 999,
      sharpenedStone: 999,
      plantFiber: 999,
      boatPatchKit: 999,
      harpoon: 999,
      bow: 999,
      arrows: 999,
      boatReinforcement: 999,
      sail: 999,
    } : {};

    return {
      character: {
        name: 'Castaway',
        hp: 100,
        maxHp: 100,
        stamina: 100,
        maxStamina: 100,
        skills: [],
        traits: [],
      },
      inventory: devInventory,
      boat: {
        repaired: false,
        hp: 0,
        maxHp: 100,
        upgrades: [],
      },
      enemies: {},
      combat: {
        active: false,
        enemyId: null,
        turnCount: 0,
        playerActions: [],
      },
      progression: {
        currentSceneId: '',
        sceneHistory: [],
        completedObjectives: [],
        unlockedChoices: [],
      },
      metadata: {
        playTime: 0,
        lastSaved: Date.now(),
        version: '1.0.0',
      },
    };
  }

  getState(): GameState {
    return { ...this.state };
  }

  setState(state: GameState): void {
    this.state = state;
  }

  // Character methods
  setCharacterSkills(skills: string[], traits: string[]): void {
    this.state.character.skills = [...skills];
    this.state.character.traits = [...traits];
  }

  modifyHp(amount: number): void {
    this.state.character.hp = Math.max(0, Math.min(this.state.character.maxHp, this.state.character.hp + amount));
  }

  modifyStamina(amount: number): void {
    this.state.character.stamina = Math.max(0, Math.min(this.state.character.maxStamina, this.state.character.stamina + amount));
  }

  hasSkill(skillId: string): boolean {
    return this.state.character.skills.includes(skillId);
  }

  hasTrait(traitId: string): boolean {
    return this.state.character.traits.includes(traitId);
  }

  // Inventory methods
  addItem(itemId: string, quantity: number): void {
    const currentQuantity = this.state.inventory[itemId] || 0;
    this.state.inventory[itemId] = currentQuantity + quantity;
  }

  removeItem(itemId: string, quantity: number): boolean {
    const currentQuantity = this.state.inventory[itemId] || 0;
    if (currentQuantity < quantity) {
      return false;
    }
    this.state.inventory[itemId] = currentQuantity - quantity;
    if (this.state.inventory[itemId] === 0) {
      delete this.state.inventory[itemId];
    }
    return true;
  }

  hasItem(itemId: string, quantity: number): boolean {
    const currentQuantity = this.state.inventory[itemId] || 0;
    return currentQuantity >= quantity;
  }

  getItemQuantity(itemId: string): number {
    return this.state.inventory[itemId] || 0;
  }

  // Boat methods
  setBoatRepaired(repaired: boolean): void {
    this.state.boat.repaired = repaired;
    if (repaired && this.state.boat.hp === 0) {
      this.state.boat.hp = this.state.boat.maxHp;
    }
  }

  addBoatUpgrade(upgradeId: string): void {
    if (!this.state.boat.upgrades.includes(upgradeId)) {
      this.state.boat.upgrades.push(upgradeId);
    }
  }

  // Enemy methods
  initializeEnemy(enemyId: string, enemyData: { maxHp: number; weakPoints?: { id: string; name: string; hp: number }[] }): void {
    this.state.enemies[enemyId] = {
      id: enemyId,
      name: enemyId,
      hp: enemyData.maxHp,
      maxHp: enemyData.maxHp,
      defeated: false,
      weakPoints: enemyData.weakPoints?.map(wp => ({
        id: wp.id,
        name: wp.name,
        destroyed: false,
      })),
    };
  }

  damageEnemy(enemyId: string, damage: number): void {
    const enemy = this.state.enemies[enemyId];
    if (enemy) {
      enemy.hp = Math.max(0, enemy.hp - damage);
      if (enemy.hp === 0) {
        enemy.defeated = true;
      }
    }
  }

  setEnemyDefeated(enemyId: string, defeated: boolean): void {
    const enemy = this.state.enemies[enemyId];
    if (enemy) {
      enemy.defeated = defeated;
      if (defeated) {
        enemy.hp = 0;
      }
    }
  }

  isEnemyDefeated(enemyId: string): boolean {
    return this.state.enemies[enemyId]?.defeated || false;
  }

  getEnemy(enemyId: string): Enemy | undefined {
    return this.state.enemies[enemyId];
  }

  // Combat methods
  startCombat(enemyId: string): void {
    this.state.combat = {
      active: true,
      enemyId,
      turnCount: 0,
      playerActions: [],
    };
  }

  endCombat(): void {
    this.state.combat = {
      active: false,
      enemyId: null,
      turnCount: 0,
      playerActions: [],
    };
  }

  incrementCombatTurn(): void {
    this.state.combat.turnCount++;
  }

  addCombatAction(actionId: string): void {
    this.state.combat.playerActions.push(actionId);
  }

  // Progression methods
  setCurrentScene(sceneId: string): void {
    if (this.state.progression.currentSceneId !== sceneId) {
      this.state.progression.sceneHistory.push(sceneId);
    }
    this.state.progression.currentSceneId = sceneId;
  }

  hasVisitedScene(sceneId: string): boolean {
    return this.state.progression.sceneHistory.includes(sceneId);
  }

  unlockChoice(choiceId: string): void {
    if (!this.state.progression.unlockedChoices.includes(choiceId)) {
      this.state.progression.unlockedChoices.push(choiceId);
    }
  }

  isChoiceUnlocked(choiceId: string): boolean {
    return this.state.progression.unlockedChoices.includes(choiceId);
  }

  // Metadata methods
  updatePlayTime(seconds: number): void {
    this.state.metadata.playTime += seconds;
  }

  updateLastSaved(): void {
    this.state.metadata.lastSaved = Date.now();
  }
}
