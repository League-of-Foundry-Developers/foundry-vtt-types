/**
 * Stores a set of objects with weak references to them, allowing them to be garbage collected. Can be iterated over,
 * unlike a WeakSet.
 * @template T - The type of the objects contained in the WeakSet
 */
declare class IterableWeakSet<T extends WeakKey> extends WeakSet<T> {
  /**
   * @param entries - The initial entries.
   */
  constructor(entries?: Iterable<T>);

  /**
   * Enumerate the values.
   */
  [Symbol.iterator](): Generator<T, void, undefined>;

  /**
   * Add a value to the set.
   * @param value - The value to add.
   */
  add(value: T): this;

  /**
   * Delete a value from the set.
   * @param value - The value to delete.
   */
  delete(value: T): boolean;

  /**
   * Whether this set contains the given value.
   * @param value - The value to test.
   * @returns
   */
  has(value: T): boolean;

  /**
   * Enumerate the collection.
   */
  values(): Generator<T, void, undefined>;

  /**
   * Clear all values from the set.
   */
  clear(): void;
}

export default IterableWeakSet;
