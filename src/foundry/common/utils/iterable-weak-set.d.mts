import type { Identity } from "#utils";

/**
 * Stores a set of objects with weak references to them, allowing them to be garbage collected. Can be iterated over,
 * unlike a WeakSet.
 * @template K - The type of the objects contained in the WeakSet
 */
declare class IterableWeakSet<K extends WeakKey> extends WeakSet<K> {
  /**
   * @param entries - The initial entries.
   */
  constructor(entries?: Iterable<K>);

  /**
   * Enumerate the values.
   */
  [Symbol.iterator](): Generator<K, void, never>;

  /**
   * Add a value to the set.
   * @param value - The value to add.
   */
  add(value: K): this;

  /**
   * Delete a value from the set.
   * @param value - The value to delete.
   */
  delete(value: K): boolean;

  /**
   * Whether this set contains the given value.
   * @param value - The value to test.
   * @returns
   */
  has(value: K): boolean;

  /**
   * Enumerate the collection.
   */
  values(): Generator<K, void, never>;

  /**
   * Clear all values from the set.
   */
  clear(): void;

  #IterableWeakSet: true;
}

declare namespace IterableWeakSet {
  interface Any extends AnyIterableWeakSet {}
  interface AnyConstructor extends Identity<typeof AnyIterableWeakSet> {}
}

export default IterableWeakSet;

declare abstract class AnyIterableWeakSet extends IterableWeakSet<WeakKey> {
  constructor(...args: never);
}
