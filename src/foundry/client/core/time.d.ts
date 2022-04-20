/**
 * A singleton class {@link game#time} which keeps the official Server and World time stamps.
 * Uses a basic implementation of https://www.geeksforgeeks.org/cristians-algorithm/ for synchronization.
 */
declare class GameTime {
  constructor(socket?: io.Socket | null);

  /**
   * The most recently synchronized timestamps retrieved from the server.
   * @defaultValue `{}`
   */
  protected _time: GameTime.Timestamps;

  /**
   * The average one-way latency across the most recent 5 trips
   * @defaultValue `0`
   */
  protected _dt: number;

  /**
   * The most recent five synchronization durations
   * @defaultValue `[]`
   */
  protected _dts: number[];

  /**
   * The amount of time to delay before re-syncing the official server time.
   * @defaultValue `1000 * 60 * 5`
   */
  static SYNC_INTERVAL_MS: number;

  /**
   * The current server time based on the last synchronization point and the approximated one-way latency.
   */
  get serverTime(): number;

  /**
   * The current World time based on the last recorded value of the core.time setting
   */
  get worldTime(): number;

  /**
   * Advance the game time by a certain number of seconds
   * @param seconds - The number of seconds to advance (or rewind if negative) by
   * @returns The new game time
   */
  advance(seconds: number): Promise<number>;

  /**
   * Synchronize the local client game time with the official time kept by the server
   */
  sync(socket?: io.Socket | null): Promise<this>;

  /**
   * Handle follow-up actions when the official World time is changed
   * @param worldTime - The new canonical World time.
   */
  onUpdateWorldTime(worldTime: number): void;
}

declare namespace GameTime {
  interface Timestamps {
    clientTime: number;
    serverTime: number;
    worldTime: number;
  }
}
