# Game Design Document: The Castaway's Gambit

## 1. Game Overview

* **Working Title:** The Castaway's Gambit
* **Genre:** First-Person RPG, Survival, Adventure
* **Target Audience:** Players who enjoy crafting, exploration, and short, narrative-driven experiences.
* **Game Goal:** As a castaway, you must survive the wilderness of a remote island, repair a damaged boat, and navigate a treacherous sea to reach the safety of a distant village.
*   **Core Gameplay Loop:**
    1.  **Explore & Scavenge:** Search the island for resources.
    2.  **Craft & Prepare:** Craft weapons and repair materials for the journey.
    3.  **Navigate & Survive:** Sail the boat, facing environmental and creature-based challenges.
    4.  **Confront or Evade:** Make a critical choice when facing the sea's guardian.
    5.  **Reach Safety:** Arrive at the village to win.

---

## 2. The Player Character

### Backstory

The player awakens on a sandy shore with a throbbing headache and fragmented memories of a storm. They were a merchant, a sailor, or perhaps an explorer, but their past is as hazy as the morning fog. All they know is the urgent, primal need to survive and find civilization.

### Starting Equipment

The player finds a few useful items in the washed-up, broken boat:

* **Worn Axe:** A durable tool for chopping wood.
* **Paddle:** For maneuvering the boat in the water.

### Core Stats

* **Health (HP):** 100/100. Represents the player's physical well-being. Reaches 0 results in death (respawn at last checkpoint). Does not regenerate automatically; requires rest or crafted items (not included in this version).
* **Stamina (SP):** 100/100. Used for sprinting, swimming, and drawing a bow. Regenerates slowly over time or faster when resting.

### Skills

At the start of the game, the player chooses **two** skills to specialize in. This choice will significantly impact their gameplay strategy.

*   **Foraging:** You have a keen eye for resources. It is much easier to find the materials you need, and you gather them in greater quantities.

*   **Crafting:** You are a natural builder. You can repair the boat and craft items using fewer resources.

*   **Marksmanship:** You are a proficient marksman. Your aim with the bow and harpoon is steady, causing more damage and having a higher chance of hitting critical weak points. Your precision with ranged weapons also translates to crafting more complex structures, unlocking special boat upgrades.

*   **Sailing:** You have a feel for the water. You can sail the boat faster and with greater maneuverability, making it easier to evade danger.

*   **Swimming:** You are a strong swimmer. Stamina drains much slower while swimming, giving you a fighting chance if the boat is destroyed.

**Skill Synergy Note:** If the player chooses both **Foraging** and **Crafting**, they become a master of preparation. To maintain game balance, this choice makes the journey itself harder: the sea's current is stronger, and the Kraken is more aggressive.

### Inventory

For simplicity, there is no player-based inventory limit. All gathered resources are stored in the boat, which can hold an unlimited amount of items for the scope of this game.

---

## 3. The World

### The Island

A lush, temperate island with two main biomes. The island is peaceful, with no hostile creatures or large animals.

* **The Beach:** Where the player spawns. Contains driftwood, **Sharpened Stones**, and the broken boat.
* **The Forest:** A dense woodland. The primary source of **Sturdy Branches** (from chopping trees), **Small Branches** (from bushes), **Sap** (from large, distinctive trees), **Tough Bark**, and **Plant Fibers**.

### The Sea

A vast, open sea separating the island from the mainland. The current is moderately strong. The central, deepest part of the sea is the territory of the Kraken.

### The Village

A small, peaceful-looking village on the mainland. Wooden houses with smoking chimneys are visible from the island's highest point. The game is won once the player character sets foot on the village's pier.

---

## 4. Gameplay Mechanics

### Gathering

Interact with resource nodes to gather materials. The starting Axe is the primary tool for this.

* **Axe:** Used on trees to gather **Sturdy Branches** and **Tough Bark**.
* **Hands:** Can gather **Small Branches**, **Plant Fibers**, **Sap**, and **Sharpened Stones**.

### Crafting & Repair

A menu-based crafting system accessed when near the boat. The number of resources required depends on the player's chosen skills.

* **Boat Repair:** Requires the **Boat Patch Kit**.
* **Weapon Crafting:** Can be done anywhere, provided the materials are in the boat's inventory.

### Sailing

Once the boat is repaired, the player can push it into the water. The paddle is used for basic steering. If a Sail is crafted, it can be used for increased speed.

### Winning & Losing

* **Win Condition:** Reach the village pier.
* **Lose Conditions:**
  * Health reaches 0.
  * Drowning (Stamina reaches 0 while swimming).

---

## 5. Game Assets & Entities

### Items

#### Resources

* **Sturdy Branch:** From chopping down trees. Used for crafting and boat reinforcement.
* **Small Branch:** From bushes. Used for making arrows.
* **Sap:** Harvested from large trees. A key binding agent.
* **Tough Bark:** Harvested from trees. A durable, leather-like material.
* **Sharpened Stone:** Found on the beach. Used for arrowheads and harpoon tips.
* **Plant Fibers:** Gathered from leafy plants. Can be woven into strong cordage.

#### Craftable Items

*(Base material costs are shown; the 'Crafting' skill reduces these.)*

*   **Boat Patch Kit:** (3x Sap + 2x Tough Bark) - Repairs the hole in the boat.
*   **Harpoon:** (1x Sturdy Branch + 1x Sharpened Stone + 3x Plant Fibers) - A heavy throwable weapon. Can be retrieved.
*   **Bow:** (1x Sturdy Branch + 3x Plant Fibers) - A ranged weapon.
*   **Arrows (x5):** (5x Small Branch + 5x Sharpened Stone) - Ammunition for the Bow.
*   **Boat Reinforcement:** (3x Sturdy Branch + 2x Plant Fibers) - Increases the boat's max HP by 50. *(Requires Marksmanship skill to craft.)*
*   **Sail:** (2x Tough Bark + 4x Plant Fibers) - A makeshift sail that increases boat speed. *(Requires Marksmanship skill to craft and Sailing skill to use effectively.)*

### The Boat

* **State:** Starts as a broken hull on the beach containing an Axe and a Paddle.
* **Size:** A small, single-person skiff.
* **Health:** 100 HP when repaired (150 HP if reinforced).
* **Destruction:** If the boat's HP reaches 0 from Kraken attacks, it shatters. The player is thrown into the water.

### The Kraken (Enemy)

A massive, territorial cephalopod.

* **Health:** 400 HP
* **Stats:**

  * **Armor:** High. Most attacks do little damage.
  * **Weak Points:** The Kraken has two large **Eyes**. These are its only true vulnerabilities.
* **Attacks:**

  1. **Tentacle Slap:** A sweeping attack that targets the boat. **Damage:** 40 HP to the boat.
  2. **Tentacle Grab:** The Kraken attempts to grab the player off the boat. Requires a rapid skill check (mashing a button) to break free.
  3. **Whirlpool:** Creates a vortex that pulls the boat closer, preventing escape. The player must fight the current (Sailing skill check).

---

## 6. Story Plot & Progression

### Act 1: The Awakening (The Island)

The player awakens and finds the boat and its starting tools. A faded note in a bottle nearby warns of a "great beast in the deep" and the need for a "sharp point and a steady hand." The player must explore the island forest, gather materials based on their chosen skills, and decide on their level of preparation.

* **Minimalist Path:** Gather only what's needed for the **Boat Patch Kit**.
* **Pragmatic Path:** Craft a **Bow and Arrow** or a **Harpoon** and reinforce the boat.
* **Over-Prepared Path:** Craft all weapons and fully reinforce the boat.

### Act 2: The Crossing (The Sea)

The player launches the boat. As they reach the open sea, the water begins to churn. The Kraken emerges.

### Potential Player Paths & Choices:

**1. Head-on Confrontation (Fight):**

* **Action:** The player uses the **Harpoon** or **Bow and Arrows** to fight the Kraken.
* **Mechanic:** They must aim for the **Eyes**.
  * Hitting an **Eye** (requires good aim, improved by **Marksmanship**) stuns the Kraken for a moment, allowing the player to sail further or get a free hit. Blinding both eyes causes it to retreat into the depths.
* **Outcome:** If successful, the Kraken retreats. If the boat is destroyed, the player must escape a wounded, enraged foe.

**2. Strategic Evasion (Flee):**

* **Action:** The player focuses on pure speed and maneuverability.
* **Mechanic:** This path relies heavily on the **Sailing** skill. The player must navigate intelligently, using the paddle to dodge attacks and escape the Kraken's territory.
* **Creative Option:** A well-aimed, non-critical harpoon shot can embed in a tentacle, momentarily distracting the beast and allowing the player to pull away.

**3. Plan B: The Log or The Swim**

* **Trigger:** The boat is destroyed.
* **Mechanic:** The player is in the water. Their chosen **Swimming** skill is critical. The Kraken, having destroyed the main threat, is less aggressive but will still attack if the player gets too close.
* **Player Choice:**
  * **Swim for it:** A desperate, high-risk dash for the shore. Only viable with the Swimming skill.
  * **Find a Log:** Floating logs are nearby. The player can climb on one. This stops stamina drain, but movement is very slow.

### Act 3: The Arrival (The Village)

If the player survives the sea, they will eventually reach the far shore. Exhausted, they stumble towards the warm lights of the village. As they cross the threshold of the pier, the screen fades to black.

**[WIN]**

**Text on screen:** "You survived the island. You bested the sea. A new life awaits."
