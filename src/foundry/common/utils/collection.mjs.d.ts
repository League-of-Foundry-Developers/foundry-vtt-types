interface MapReplacementMembers<K, V> {
  set(key: K, value: V): this;
}

type PatchedMap<K, V> = Omit<Map<K, V>, 'forEach' | typeof Symbol.iterator | 'get' | 'set'> &
  MapReplacementMembers<K, V>;

interface PatchedMapConstructor {
  new (): PatchedMap<any, any>;
  new <K, V>(entries?: readonly (readonly [K, V])[] | null): PatchedMap<K, V>;
  new <K, V>(iterable: Iterable<readonly [K, V]>): PatchedMap<K, V>;
  readonly [Symbol.species]: PatchedMapConstructor;
  readonly prototype: PatchedMap<any, any>;
}

declare const Map: PatchedMapConstructor;

/**
 * A reusable storage concept which blends the functionality of an Array with the efficient key-based lookup of a Map.
 * This concept is reused throughout Foundry VTT where a collection of uniquely identified elements is required.
 * @typeParam T - The type of the objects contained in the Collection
 */
declare class Collection<T> extends Map<string, T> {
  constructor(entries?: readonly (readonly [string, T])[] | null);

  /**
   * When iterating over a Collection, we should iterate over its values instead of over its entries
   */
  [Symbol.iterator](): IterableIterator<T>;

  /**
   * Return an Array of all the entry values in the Collection
   */
  get contents(): T[];

  /**
   * Find an entry in the Map using an functional condition.
   * @see {@link Array#find}
   *
   * @param condition - The functional condition to test
   * @returns The value, if found, otherwise undefined
   *
   * @example
   * ```typescript
   * let c = new Collection([["a", "A"], ["b", "B"], ["c", "C"]]);
   * let a = c.find(entry => entry === "A");
   * ```
   */
  find<S extends T>(condition: (e: T) => e is S): S | undefined;
  find(condition: (e: T) => boolean): T | undefined;

  /**
   * Filter the Collection, returning an Array of entries which match a functional condition.
   * @see {@link Array#filter}
   *
   * @param condition - The functional condition to test
   * @returns An Array of matched values
   *
   * @example
   * ```typescript
   * let c = new Collection([["a", "AA"], ["b", "AB"], ["c", "CC"]]);
   * let hasA = c.filters(entry => entry.slice(0) === "A");
   * ```
   */
  filter<S extends T>(condition: (e: T) => e is S): S[];
  filter(condition: (e: T) => boolean): T[];

  /**
   * Apply a function to each element of the collection
   * @see Array#forEach
   * @param fn - The function to apply
   *
   * @example
   * ```typescript
   * let c = new Collection([["a", {active: false}], ["b", {active: false}], ["c", {active: false}]]);
   * c.forEach(e => e.active = true);
   * ```
   */
  forEach(fn: (e: T) => void): void;

  /**
   * Get an element from the Collection by its key.
   * @param key     - The key of the entry to retrieve
   * @param strict  - Throw an Error if the requested id does not exist, otherwise
   *                  (default: `false`)
   * @returns The retrieved entry value, if the key exists, otherwise undefined
   * @example
   * ```typescript
   * let c = new Collection([["a", "A"], ["b", "B"], ["c", "C"]]);
   * c.get("a"); // "A"
   * c.get("d"); // null
   * c.get("d", {strict: true}); // throws Error
   * ```
   */
  get(key: string, { strict }: { strict: true }): T;
  get(key: string, { strict }?: { strict?: false }): T | undefined;

  /**
   * Get an entry from the Collection by name.
   * Use of this method assumes that the objects stored in the collection have a "name" attribute.
   * @param name    - The name of the entry to retrieve
   * @param strict  - Throw an Error if the requested id does not exist,
   *                  otherwise return null.
   *                  (default: `false`)
   * @returns The retrieved Entity, if one was found, otherwise undefined
   */
  getName(name: string, { strict }: { strict: true }): T;
  getName(name: string, { strict }?: { strict?: false }): T | undefined;

  /**
   * Transform each element of the Collection into a new form, returning an Array of transformed values
   * @param transformer - The transformation function to apply to each entry value
   * @typeParam M       - The type of the mapped values
   * @returns An Array of transformed values
   */
  map<M>(transformer: (entity: T) => M): M[];

  /**
   * Reduce the Collection by applying an evaluator function and accumulating entries
   * @see {@link Array#reduce}
   * @param evaluator - A function which mutates the accumulator each iteration
   * @param initial   - An initial value which accumulates with each iteration
   * @typeParam A     - The type of the accumulator and the return value
   * @returns The accumulated result
   *
   * @example
   * ```typescript
   * let c = new Collection([["a", "A"], ["b", "B"], ["c", "C"]]);
   * let letters = c.reduce((s, l) => {
   *   return s + l;
   * }, ""); // "ABC"
   * ```
   */
  reduce<A>(evaluator: (accumulator: A, entity: T) => A, initial: A): A;

  /**
   * Test whether a condition is met by some entry in the Collection
   * @see Array#some
   * @param condition - A test condition to apply to each entry
   * @returns Was the test condition passed by at least one entry?
   */
  some(condition: (e: T) => boolean): boolean;

  /**
   * Convert the Collection to a primitive array of its contents.
   * @returns An array of contained values
   */
  toJSON(): Array<T extends { toJSON: (...args: any[]) => infer U } ? U : T>;
}

export default Collection;
