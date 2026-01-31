# The Castaway's Gambit

A web-based, choice-driven RPG game where you survive on a deserted island, craft weapons, and face the mighty Kraken to escape to safety.

## Features

- **Trait-Based Character System**: Choose 3 skills, each providing unique traits
- **Additive Trait Bonuses**: Multiple traits combine for stronger effects
- **Resource Gathering**: Collect materials from the forest with skill-based modifiers
- **Crafting System**: Create weapons and tools with resource costs affected by your skills
- **Strategic Combat**: Trait combinations determine combat effectiveness
- **Multiple Paths**: Different strategies based on your skill/trait selection
- **Auto-Save**: Game automatically saves your progress every 30 seconds

## Skills & Traits System

Each skill provides 2 traits. Choose 3 skills to get up to 6 traits (with possible duplicates removed).

### Available Skills:

- **Foraging** → Traits: `perception`, `resourcefulness`
  - +50% resource gathering yield
- **Crafting** → Traits: `dexterity`, `ingenuity`
  - -25% crafting resource costs
- **Marksmanship** → Traits: `aim`, `strength`
  - Unlocks boat upgrades, improves ranged combat
- **Sailing** → Traits: `navigation`, `balance`
  - Enables evasion and escape strategies
- **Swimming** → Traits: `endurance`, `strength`
  - Improves stamina management in water

### How Traits Work:

Traits provide **additive bonuses** during choices:
- **No matching traits**: Base effect only
- **1 matching trait**: Base + bonus from that trait
- **2+ matching traits**: Base + all applicable bonuses stacked

**Example (Harpoon throw):**
- Base: 40 damage to Kraken, take 15 HP damage
- +`aim`: +20 damage, take 5 less HP damage
- +`strength`: +10 damage, take 3 less HP damage
- **Both traits**: 70 total damage (40+20+10), take only 7 HP damage (15-5-3)

## Tech Stack

- **React + TypeScript**: Component-based UI with type safety
- **Vite**: Fast build tool and dev server
- **Zustand**: Lightweight state management
- **Tailwind CSS**: Utility-first styling
- **JSON-Driven**: Entire game defined in a single JSON file

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development Server

The game will be available at `http://localhost:5173/`

## Game Architecture

### Core Engine (`src/engine/`)

- **GameEngine.ts**: Main orchestrator that processes choices and consequences
- **StateManager.ts**: Manages game state (HP, inventory, progression)
- **ConditionEvaluator.ts**: Evaluates conditions for choice visibility
- **SceneNavigator.ts**: Handles scene transitions

### State Management (`src/stores/`)

- **gameStore.ts**: Zustand store connecting React components to the game engine

### Components (`src/components/`)

- **core/**: SceneRenderer and GameContainer
- **scenes/**: Scene-specific components (CharacterCreation, Combat, Gathering, etc.)
- **blocks/**: Reusable UI components (TextBlock, ChoiceBlock, StatsBar, etc.)

### Game Data

- **public/game-data.json**: Complete game content including:
  - Skills and traits
  - Items and recipes
  - Enemy definitions
  - Scene definitions and story flow

## Gameplay Flow

1. **Character Creation**: Select 2 skills and 1 trait
2. **Island Exploration**: Gather resources from the beach and forest
3. **Crafting**: Create tools, weapons, and boat repairs
4. **Preparation**: Repair your boat and craft weapons for the journey
5. **The Kraken**: Face the sea beast using your crafted weapons and skills
6. **Victory or Defeat**: Multiple endings based on your choices

## Modding

The game is fully data-driven through `public/game-data.json`. You can:

- Add new skills, traits, and items
- Create new scenes and story branches
- Modify crafting recipes and resource costs
- Add new enemies and combat encounters
- Change the entire story without touching code

Just edit the JSON file and reload the game!

## Save System

- Auto-saves every 30 seconds
- Saves stored in browser's LocalStorage
- Reload the page to continue from your last save

## Project Structure

```
/rpg
├── public/
│   └── game-data.json          # All game content
├── src/
│   ├── types/                  # TypeScript type definitions
│   ├── engine/                 # Core game logic
│   ├── stores/                 # State management
│   ├── components/             # React components
│   │   ├── core/              # Core app components
│   │   ├── scenes/            # Scene-specific components
│   │   ├── blocks/            # Reusable UI blocks
│   │   └── ui/                # UI utilities
│   ├── utils/                 # Utility functions
│   ├── App.tsx                # Main app component
│   └── main.tsx               # Entry point
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## License

MIT

## Credits

Game design and implementation based on "The Castaway's Gambit" story concept.
