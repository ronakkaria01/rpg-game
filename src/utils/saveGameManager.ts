import { GameState, SaveGame } from '../types/game.types';

const SAVE_KEY_PREFIX = 'rpg_save_';
const AUTO_SAVE_KEY = 'rpg_autosave';

export class SaveGameManager {
  static saveGame(saveId: string, state: GameState, name: string): boolean {
    try {
      const saveGame: SaveGame = {
        id: saveId,
        name,
        timestamp: Date.now(),
        state: { ...state },
      };

      localStorage.setItem(SAVE_KEY_PREFIX + saveId, JSON.stringify(saveGame));
      return true;
    } catch (error) {
      console.error('Failed to save game:', error);
      return false;
    }
  }

  static loadGame(saveId: string): GameState | null {
    try {
      const saveData = localStorage.getItem(SAVE_KEY_PREFIX + saveId);
      if (!saveData) return null;

      const saveGame: SaveGame = JSON.parse(saveData);
      return saveGame.state;
    } catch (error) {
      console.error('Failed to load game:', error);
      return null;
    }
  }

  static autoSave(state: GameState): boolean {
    return this.saveGame(AUTO_SAVE_KEY, state, 'Auto Save');
  }

  static loadAutoSave(): GameState | null {
    return this.loadGame(AUTO_SAVE_KEY);
  }

  static getAllSaves(): SaveGame[] {
    const saves: SaveGame[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(SAVE_KEY_PREFIX)) {
        try {
          const saveData = localStorage.getItem(key);
          if (saveData) {
            const save: SaveGame = JSON.parse(saveData);
            saves.push(save);
          }
        } catch (error) {
          console.error('Failed to parse save:', error);
        }
      }
    }

    return saves.sort((a, b) => b.timestamp - a.timestamp);
  }

  static deleteSave(saveId: string): boolean {
    try {
      localStorage.removeItem(SAVE_KEY_PREFIX + saveId);
      return true;
    } catch (error) {
      console.error('Failed to delete save:', error);
      return false;
    }
  }

  static hasAutoSave(): boolean {
    return localStorage.getItem(SAVE_KEY_PREFIX + AUTO_SAVE_KEY) !== null;
  }
}
