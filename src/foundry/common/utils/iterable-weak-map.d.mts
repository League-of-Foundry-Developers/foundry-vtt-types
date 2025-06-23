import type { Identity } from "#utils";

/**
 * Stores a map of objects with weak references to the keys, allowing them to be garbage collected. Both keys and values
 * can be iterated over, unlike a WeakMap.
 * @template K - the type of the keys contained in the IterableWeakMap
 * @template V - The type of the values contained in the IterableWeakMap
 */
declare class IterableWeakMap<K extends WeakKey, V> extends WeakMap<K, V> {
  /**
   * @param entries - The initial entries.
   */
  constructor(entries?: Iterable<[K, V]>);

  /**
   * Remove a key from the map.
   * @param key - The key to remove.
   * @remarks Returns `true` if a key was removed, `false` otherwise.
   */
  delete(key: K): boolean;

  /**
   * Retrieve a value from the map.
   * @param key - The value's key.
   */
  get(key: K): V | undefined;

  /**
   * Place a value in the map.
   * @param key   - The key.
   * @param value - The value.
   */
  set(key: K, value: V): this;

  /**
   * Clear all values from the map.
   */
  clear(): void;

  /**
   * Enumerate the entries.
   * @returns
   */
  [Symbol.iterator](): Generator<[K, V], void, undefined>;

  /**
   * Enumerate the entries.
   */
  entries(): Generator<[K, V], void, undefined>;

  /**
   * Enumerate the keys.
   */
  keys(): Generator<K, void, undefined>;

  /**
   * Enumerate the values.
   */
  values(): Generator<V, void, undefined>;

  #IterableWeakMap: true;
}

declare namespace IterableWeakMap {
  interface Any extends AnyIterableWeakMap {}
  interface AnyConstructor extends Identity<typeof AnyIterableWeakMap> {}

  interface HeldValue<K extends WeakKey> {
    /**
     * The set to be cleaned.
     */
    set: Set<WeakRef<K>>;

    /**
     * The ref to remove.
     */
    ref: WeakRef<K>;
  }

  interface Value<K extends WeakKey, V> {
    /** The value */
    value: V;

    /** The weak ref of the key. */
    ref: WeakRef<K>;
  }
}

export default IterableWeakMap;

declare abstract class AnyIterableWeakMap extends IterableWeakMap<WeakKey, unknown> {
  constructor(...args: never);
}
