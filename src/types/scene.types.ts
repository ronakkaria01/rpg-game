// Condition types for choice visibility and validation
export type ConditionType =
  | 'hasSkill'
  | 'hasTrait'
  | 'hasItem'
  | 'hasResources'
  | 'statGreaterThan'
  | 'statLessThan'
  | 'boatRepaired'
  | 'enemyDefeated'
  | 'sceneVisited'
  | 'and'
  | 'or'
  | 'not';

export interface BaseCondition {
  type: ConditionType;
}

export interface HasSkillCondition extends BaseCondition {
  type: 'hasSkill';
  skillId: string;
}

export interface HasTraitCondition extends BaseCondition {
  type: 'hasTrait';
  traitId: string;
}

export interface HasItemCondition extends BaseCondition {
  type: 'hasItem';
  itemId: string;
  quantity: number;
}

export interface HasResourcesCondition extends BaseCondition {
  type: 'hasResources';
  resources: { itemId: string; quantity: number }[];
}

export interface StatCondition extends BaseCondition {
  type: 'statGreaterThan' | 'statLessThan';
  stat: 'hp' | 'stamina' | 'maxHp' | 'maxStamina';
  value: number;
}

export interface BoatRepairedCondition extends BaseCondition {
  type: 'boatRepaired';
}

export interface EnemyDefeatedCondition extends BaseCondition {
  type: 'enemyDefeated';
  enemyId: string;
}

export interface SceneVisitedCondition extends BaseCondition {
  type: 'sceneVisited';
  sceneId: string;
}

export interface LogicalCondition extends BaseCondition {
  type: 'and' | 'or' | 'not';
  conditions: Condition[];
}

export type Condition =
  | HasSkillCondition
  | HasTraitCondition
  | HasItemCondition
  | HasResourcesCondition
  | StatCondition
  | BoatRepairedCondition
  | EnemyDefeatedCondition
  | SceneVisitedCondition
  | LogicalCondition;

// Choice and consequence types
export interface Consequence {
  type: 'navigate' | 'addItem' | 'removeItem' | 'modifyStat' | 'setBoatRepaired' | 'damageEnemy' | 'setEnemyDefeated' | 'unlockChoice';
  sceneId?: string;
  itemId?: string;
  quantity?: number;
  stat?: 'hp' | 'stamina';
  amount?: number;
  enemyId?: string;
  damage?: number;
  choiceId?: string;
}

export interface TraitCheck {
  traitId: string;
  bonusConsequences: Consequence[];
}

export interface Choice {
  id: string;
  text: string;
  description?: string;
  conditions?: Condition[];
  consequences: Consequence[];
  traitChecks?: TraitCheck[];
  // Legacy support
  skillCheck?: {
    traitId: string;
    successConsequences: Consequence[];
    failureConsequences: Consequence[];
  };
}

// Block types for content
export interface TextBlock {
  type: 'text';
  content: string;
  className?: string;
}

export interface ImageBlock {
  type: 'image';
  src: string;
  alt: string;
  className?: string;
}

export interface StatsBlock {
  type: 'stats';
  showHp: boolean;
  showStamina: boolean;
  showInventory: boolean;
}

export interface InventoryBlock {
  type: 'inventory';
  title?: string;
}

export interface TimerBlock {
  type: 'timer';
  duration: number;
  onComplete: Consequence[];
}

export type ContentBlock = TextBlock | ImageBlock | StatsBlock | InventoryBlock | TimerBlock;

// Scene types
export type SceneType =
  | 'characterCreation'
  | 'narrative'
  | 'choice'
  | 'gathering'
  | 'crafting'
  | 'combat'
  | 'ending';

export interface BaseScene {
  id: string;
  type: SceneType;
  title?: string;
  content: ContentBlock[];
}

export interface CharacterCreationScene extends BaseScene {
  type: 'characterCreation';
  skillSelectionCount: number;
  availableSkills: string[]; // skill ids
  traitSelectionCount: number;
  availableTraits: string[]; // trait ids
  nextSceneId: string;
}

export interface NarrativeScene extends BaseScene {
  type: 'narrative';
  choices: Choice[];
}

export interface ChoiceScene extends BaseScene {
  type: 'choice';
  choices: Choice[];
}

export interface GatheringScene extends BaseScene {
  type: 'gathering';
  resources: {
    itemId: string;
    baseQuantity: number;
    gatherTime: number; // seconds
  }[];
  exitChoice: Choice;
}

export interface CraftingScene extends BaseScene {
  type: 'crafting';
  availableRecipes: string[]; // recipe ids
  exitChoice: Choice;
}

export interface CombatScene extends BaseScene {
  type: 'combat';
  enemyId: string;
  choices: Choice[]; // combat actions
  victorySceneId: string;
  defeatSceneId: string;
}

export interface EndingScene extends BaseScene {
  type: 'ending';
  endingType: 'victory' | 'defeat' | 'escape';
  canRestart: boolean;
}

export type Scene =
  | CharacterCreationScene
  | NarrativeScene
  | ChoiceScene
  | GatheringScene
  | CraftingScene
  | CombatScene
  | EndingScene;

// Game data structure
export interface GameData {
  version: string;
  title: string;
  description: string;
  skills: { [id: string]: Skill };
  traits: { [id: string]: Trait };
  items: { [id: string]: Item };
  recipes: { [id: string]: Recipe };
  enemies: { [id: string]: EnemyDefinition };
  scenes: { [id: string]: Scene };
  startSceneId: string;
}

// Additional types needed
export interface Skill {
  id: string;
  name: string;
  description: string;
  category: 'survival' | 'combat' | 'crafting';
  traits: string[];
}

export interface Trait {
  id: string;
  name: string;
  description: string;
  effects: string[];
}

export interface Item {
  id: string;
  name: string;
  description: string;
  type: 'resource' | 'tool' | 'weapon' | 'upgrade';
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  resultItemId: string;
  resultQuantity: number;
  ingredients: { itemId: string; quantity: number }[];
  craftTime: number;
  skillModifier?: {
    skillId: string;
    costMultiplier: number;
  };
}

export interface EnemyDefinition {
  id: string;
  name: string;
  description: string;
  maxHp: number;
  weakPoints?: {
    id: string;
    name: string;
    hp: number;
  }[];
  attacks: {
    id: string;
    name: string;
    damage: number;
    description: string;
  }[];
}
