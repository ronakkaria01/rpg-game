import { create } from 'zustand';
import { GameEngine } from '../engine/GameEngine';
import { GameData, Scene, Choice } from '../types/scene.types';
import { GameState } from '../types/game.types';

interface GameStore {
  gameEngine: GameEngine | null;
  gameData: GameData | null;
  currentScene: Scene | null;
  gameState: GameState | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  initializeGame: (gameData: GameData, savedState?: GameState) => void;
  processChoice: (choice: Choice) => void;
  craftItem: (recipeId: string) => boolean;
  gatherResource: (itemId: string, baseQuantity: number) => void;
  setCharacterCreation: (skills: string[]) => void;
  navigateToScene: (sceneId: string) => void;
  refreshGameState: () => void;
  resetGame: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  gameEngine: null,
  gameData: null,
  currentScene: null,
  gameState: null,
  isLoading: false,
  error: null,

  initializeGame: (gameData: GameData, savedState?: GameState) => {
    try {
      const engine = new GameEngine(gameData, savedState);
      const currentScene = engine.getSceneNavigator().getCurrentScene();
      const gameState = engine.getCurrentState();

      set({
        gameEngine: engine,
        gameData,
        currentScene,
        gameState,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to initialize game',
        isLoading: false,
      });
    }
  },

  processChoice: (choice: Choice) => {
    const { gameEngine } = get();
    if (!gameEngine) return;

    gameEngine.processChoice(choice);

    // Check if combat ended
    const combatResult = gameEngine.checkCombatEnd();
    if (combatResult.ended) {
      const currentScene = gameEngine.getSceneNavigator().getCurrentScene();
      if (currentScene?.type === 'combat') {
        const sceneId = combatResult.victory
          ? currentScene.victorySceneId
          : currentScene.defeatSceneId;
        gameEngine.getSceneNavigator().navigateToScene(sceneId);
      }
    }

    get().refreshGameState();
  },

  craftItem: (recipeId: string) => {
    const { gameEngine } = get();
    if (!gameEngine) return false;

    const success = gameEngine.craftItem(recipeId);
    if (success) {
      get().refreshGameState();
    }
    return success;
  },

  gatherResource: (itemId: string, baseQuantity: number) => {
    const { gameEngine } = get();
    if (!gameEngine) return;

    gameEngine.gatherResource(itemId, baseQuantity);
    get().refreshGameState();
  },

  setCharacterCreation: (skills: string[]) => {
    const { gameEngine } = get();
    if (!gameEngine) return;

    gameEngine.setCharacterCreation(skills);
    get().refreshGameState();
  },

  navigateToScene: (sceneId: string) => {
    const { gameEngine } = get();
    if (!gameEngine) return;

    gameEngine.getSceneNavigator().navigateToScene(sceneId);
    get().refreshGameState();
  },

  refreshGameState: () => {
    const { gameEngine } = get();
    if (!gameEngine) return;

    const currentScene = gameEngine.getSceneNavigator().getCurrentScene();
    const gameState = gameEngine.getCurrentState();

    set({
      currentScene,
      gameState,
    });
  },

  resetGame: () => {
    const { gameData } = get();
    if (!gameData) return;

    get().initializeGame(gameData);
  },
}));
