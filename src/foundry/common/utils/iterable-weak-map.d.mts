interface IterableWeakMapHeldValue<K extends WeakKey> {
  /**
   * The set to be cleaned.
   */
  set: Set<WeakRef<K>>;

  /**
   * The ref to remove.
   */
  ref: WeakRef<K>;
}

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
   * Clean up the corresponding ref in the set when its value is garbage collected.
   * @param heldValue - The value held by the finalizer.
   */
  static #cleanup<K extends WeakKey>(heldValue: IterableWeakMapHeldValue<K>): void;

  /**
   * Remove a key from the map.
   * @param key - The key to remove.
   * @returns `true` if a key was removed, `false` otherwise.
   */
  delete(key: K): boolean;

  /**
   * Retrieve a value from the map.
   * @param key - The value's key.
   * @returns
   */
  get(key: K): V | undefined;

  /**
   * Place a value in the map.
   * @param key   - The key.
   * @param value - The value.
   * @returns
   */
  set(key: K, value: V): this;

  /**
   * Enumerate the entries.
   * @returns
   */
  [Symbol.iterator](): Generator<[K, V], void, never>;

  /**
   * Enumerate the entries.
   */
  entries(): Generator<[K, V], void, never>;

  /**
   * Enumerate the keys.
   */
  keys(): Generator<K, void, never>;

  /**
   * Enumerate the values.
   */
  values(): Generator<V, void, never>;

  /**
   * Clear all values from the map.
   */
  clear(): void;
}

export default IterableWeakMap;
