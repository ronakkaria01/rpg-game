import { Scene, GameData } from '../types/scene.types';
import { StateManager } from './StateManager';

export class SceneNavigator {
  private scenes: { [id: string]: Scene };

  constructor(
    private gameData: GameData,
    private stateManager: StateManager
  ) {
    this.scenes = gameData.scenes;
  }

  navigateToScene(sceneId: string): Scene | null {
    const scene = this.scenes[sceneId];
    if (!scene) {
      console.error(`Scene with id "${sceneId}" not found`);
      return null;
    }

    this.stateManager.setCurrentScene(sceneId);

    // Handle combat scene initialization
    if (scene.type === 'combat') {
      const enemyData = this.gameData.enemies[scene.enemyId];
      if (enemyData && !this.stateManager.getEnemy(scene.enemyId)) {
        this.stateManager.initializeEnemy(scene.enemyId, {
          maxHp: enemyData.maxHp,
          weakPoints: enemyData.weakPoints,
        });
      }
      this.stateManager.startCombat(scene.enemyId);
    }

    return scene;
  }

  getCurrentScene(): Scene | null {
    const currentSceneId = this.stateManager.getState().progression.currentSceneId;
    return this.scenes[currentSceneId] || null;
  }

  getScene(sceneId: string): Scene | null {
    return this.scenes[sceneId] || null;
  }

  getStartScene(): Scene {
    return this.scenes[this.gameData.startSceneId];
  }
}
