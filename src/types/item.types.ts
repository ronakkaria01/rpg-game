// Item and resource types
export interface Item {
  id: string;
  name: string;
  description: string;
  type: 'resource' | 'tool' | 'weapon' | 'upgrade';
  stackable: boolean;
  maxStack?: number;
}

export interface Resource extends Item {
  type: 'resource';
  gatherTime?: number; // time in seconds to gather one unit
  skillModifier?: {
    skillId: string;
    multiplier: number;
  };
}

export interface Tool extends Item {
  type: 'tool';
  durability?: number;
  uses?: number;
}

export interface Weapon extends Item {
  type: 'weapon';
  damage: number;
  damageType: 'piercing' | 'slashing' | 'blunt';
  ammo?: string; // item id of ammo if ranged
}

export interface Upgrade extends Item {
  type: 'upgrade';
  appliesTo: 'boat' | 'player';
  effect: string;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  resultItemId: string;
  resultQuantity: number;
  ingredients: {
    itemId: string;
    quantity: number;
  }[];
  craftTime: number; // in seconds
  requiresSkill?: string;
  skillModifier?: {
    skillId: string;
    costMultiplier: number; // e.g., 0.75 means 25% cost reduction
  };
}

export interface Inventory {
  [itemId: string]: number; // item id to quantity mapping
}
