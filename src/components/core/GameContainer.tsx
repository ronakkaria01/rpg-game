import React, { useEffect, useState } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { GameData } from '../../types/scene.types';
import { SceneRenderer } from './SceneRenderer';
import { SaveGameManager } from '../../utils/saveGameManager';

export const GameContainer: React.FC = () => {
  const { initializeGame, gameData, error } = useGameStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGameData = async () => {
      try {
        const response = await fetch('/game-data.json');
        if (!response.ok) {
          throw new Error('Failed to load game data');
        }

        const data: GameData = await response.json();

        // Check for autosave
        const autoSave = SaveGameManager.loadAutoSave();

        // Initialize game with or without save data
        initializeGame(data, autoSave || undefined);
        setLoading(false);
      } catch (err) {
        console.error('Error loading game:', err);
        setLoading(false);
      }
    };

    loadGameData();
  }, [initializeGame]);

  // Auto-save periodically
  useEffect(() => {
    if (!gameData) return;

    const autoSaveInterval = setInterval(() => {
      const state = useGameStore.getState().gameState;
      if (state) {
        SaveGameManager.autoSave(state);
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, [gameData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl text-gray-300">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl text-red-400">Error: {error}</div>
      </div>
    );
  }

  const handleDevReset = () => {
    // Clear all saves
    localStorage.clear();
    // Reload page to start fresh with dev inventory
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-game-bg">
      {/* Dev Mode Reset Button */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={handleDevReset}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-semibold shadow-lg"
          title="Clear save and restart with dev inventory"
        >
          DEV: Reset with Full Inventory
        </button>
      </div>
      <SceneRenderer />
    </div>
  );
};

export default GameContainer;
