import { gameState } from "./gameState";

export function addXP(amount) {
  gameState.xp += amount;

  if (gameState.xp >= 100) {
    gameState.level += 1;
    gameState.xp = 0;
  }

  console.log("Current State:", gameState);

  return gameState;
}