export default IterableWeakMap;

/**
 * Stores a map of objects with weak references to the keys, allowing them to be garbage collected. Both keys and values
 * can be iterated over, unlike a WeakMap.
 */
declare class IterableWeakMap extends WeakMap {}
