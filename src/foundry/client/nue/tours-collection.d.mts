import type Tour from "./tour.d.mts";

/**
 * A singleton Tour Collection class responsible for registering and activating Tours, accessible as game.tours.
 */
declare class ToursCollection extends Collection<Tour> {
  constructor();

  /**
   * Register a new Tour.
   * @param namespace - The namespace of the Tour
   * @param id        - The machine-readable id of the Tour
   * @param tour      - The constructed Tour
   */
  register(namespace: string, id: string, tour: Tour): void;

  /**
   * Set a Tour to the collection.
   */
  set(key: string, tour: Tour): this;
}

declare namespace ToursCollection {}

export default ToursCollection;
