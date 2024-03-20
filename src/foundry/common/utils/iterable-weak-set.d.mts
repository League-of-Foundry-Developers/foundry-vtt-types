export default IterableWeakSet;

/**
 * Stores a set of objects with weak references to them, allowing them to be garbage collected. Can be iterated over,
 * unlike a WeakSet.
 */
declare class IterableWeakSet extends WeakSet {}
