/**
 * A singleton class at which keeps the official Server and World time stamps.
 * Uses a basic implementation of https://www.geeksforgeeks.org/cristians-algorithm/ for synchronization.
 * @see {@link foundry.Game#time}
 */
declare class GameTime {}

declare namespace GameTime {}

export default GameTime;
