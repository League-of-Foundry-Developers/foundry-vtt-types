import type Tour from "./tour.d.mts";

/**
 * A singleton Tour Collection class responsible for registering and activating Tours, accessible as game.tours.
 * @remarks
 * @throws If {@linkcode game.tours} is already constructed
 */
declare class ToursCollection extends Collection<Tour.Any> {
  constructor();

  /**
   * Register a new Tour.
   * @param namespace - The namespace of the Tour
   * @param id        - The machine-readable id of the Tour
   * @param tour      - The constructed Tour
   * @remarks
   * @throws If a Tour with this `namespace`/`id` combination has already been registered
   */
  register(namespace: string, id: string, tour: Tour.Any): void;

  /**
   * Set a Tour to the collection.
   * @remarks Only checks to throw or not, then calls {@link Collection.set | super}.
   *
   * Go to definition breaks here, see {@linkcode Collection.Methods.set} and {@linkcode Collection.SetMethod}
   * @throws If `key` doesn't match the passed Tour's `namespace` and `id`
   */
  override set: Collection.SetMethod<this, Collection.Methods<Tour.Any>>;
}

declare namespace ToursCollection {}

export default ToursCollection;
