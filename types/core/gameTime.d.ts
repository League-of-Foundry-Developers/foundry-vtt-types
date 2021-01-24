/**
 * A singleton class {@link game#time} which keeps the official Server and World time stamps.
 * Uses a basic implementation of https://www.geeksforgeeks.org/cristians-algorithm/ for synchronization.
 */
declare class GameTime {
  constructor (socket: SocketIOClient.Socket)

  /**
   * The most recently synchronized timestamps retrieved from the server.
   * @defaultValue `{}`
   */
  _time: GameTime.Timestamps

  /**
   * The average one-way latency across the most recent 5 trips
   * @defaultValue `0`
   */
  _dt: number

  /**
   * The most recent five synchronization durations
   * @defaultValue `[]`
   */
  _dts: number[]

  /* -------------------------------------------- */
  /*  Properties                                  */
  /* -------------------------------------------- */

  /**
   * The current server time based on the last synchronization point and the approximated one-way latency.
   */
  get serverTime (): number

  /* -------------------------------------------- */

  /**
   * The current World time based on the last recorded value of the core.time setting
   */
  get worldTime (): number

  /* -------------------------------------------- */
  /*  Methods                                     */
  /* -------------------------------------------- */

  /**
   * Advance the game time by a certain number of seconds
   * @param seconds - The number of seconds to advance (or rewind if negative) by
   * @returns The new game time
   */
  advance (seconds: number): Promise<number>

  /* -------------------------------------------- */

  /**
   * Synchronize the local client game time with the official time kept by the server
   */
  sync (socket: SocketIOClient.Socket): Promise<GameTime>

  /* -------------------------------------------- */
  /*  Event Handlers and Callbacks                */
  /* -------------------------------------------- */

  /**
   * Handle follow-up actions when the official World time is changed
   * @param worldTime - The new canonical World time.
   */
  onUpdateWorldTime (worldTime: number): void

  /**
   * The amount of time to delay before re-syncing the official server time.
   * @defaultValue `1000 * 60 * 5`
   */
  static SYNC_INTERVAL_MS: number
}

declare namespace GameTime {
  interface Timestamps {
    clientTime: number
    serverTime: number
    worldTime: number
  }
}
