import type IterableWeakMap from "./iterable-weak-map.d.mts";

/**
 * Stores a set of objects with weak references to them, allowing them to be garbage collected. Can be iterated over,
 * unlike a WeakSet.
 * @typeParam T - The type of the objects contained in the WeakSet
 */
declare class IterableWeakSet<T extends WeakKey> extends WeakSet<T> {
  /**
   * The backing iterable weak map.
   */
  #map: IterableWeakMap<T, T>;

  /**
   * @param entries - The initial entries.
   */
  constructor(entries?: Iterable<T>);

  /**
   * Enumerate the values.
   */
  [Symbol.iterator](): Generator<T, void, any>;

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
  values(): Generator<T, void, any>;
}

export default IterableWeakSet;
