/**
 * A singleton Tour Collection class responsible for registering and activating Tours, accessible as game.tours
 * @see {@link Game.tours}
 */
declare class Tours extends foundry.utils.Collection<Tour> {
  constructor();

  /**
   * Register a new Tour
   * @param namespace - The namespace of the Tour
   * @param id        - The machine-readable id of the Tour
   * @param tour      - The constructed Tour
   */
  register(namespace: string, id: string, tour: Tour): void;

  override set(key: string, tour: Tour): this;
}
