import { Inventory } from './item.types';

// Skill definitions
export interface Skill {
  id: string;
  name: string;
  description: string;
  category: 'survival' | 'combat' | 'crafting';
}

// Trait definitions
export interface Trait {
  id: string;
  name: string;
  description: string;
  effects: string[];
}

// Character state
export interface Character {
  name: string;
  hp: number;
  maxHp: number;
  stamina: number;
  maxStamina: number;
  skills: string[]; // skill ids
  traits: string[]; // trait ids from skills
}

// Boat state
export interface Boat {
  repaired: boolean;
  hp: number;
  maxHp: number;
  upgrades: string[]; // upgrade item ids
}

// Enemy state
export interface Enemy {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  defeated: boolean;
  weakPoints?: {
    id: string;
    name: string;
    destroyed: boolean;
  }[];
}

// Combat state
export interface CombatState {
  active: boolean;
  enemyId: string | null;
  turnCount: number;
  playerActions: string[]; // history of player action ids
}

// Game progression
export interface GameProgression {
  currentSceneId: string;
  sceneHistory: string[]; // list of visited scene ids
  completedObjectives: string[];
  unlockedChoices: string[];
}

// Complete game state
export interface GameState {
  character: Character;
  inventory: Inventory;
  boat: Boat;
  enemies: { [enemyId: string]: Enemy };
  combat: CombatState;
  progression: GameProgression;
  metadata: {
    playTime: number; // in seconds
    lastSaved: number; // timestamp
    version: string;
  };
}

// Save game format
export interface SaveGame {
  id: string;
  name: string;
  timestamp: number;
  state: GameState;
}
