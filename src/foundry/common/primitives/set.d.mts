export {};

declare global {
  interface Set<T> {
    /**
     * Return the difference of two sets.
     * @param other - Some other set to compare against
     * @returns The difference defined as objects in this which are not present in other
     */
    difference(other: Set<T>): Set<T>;

    /**
     * Test whether this set is equal to some other set.
     * Sets are equal if they share the same members, independent of order
     * @param other - Some other set to compare against
     * @returns Are the sets equal?
     */
    equals(other: Set<T>): boolean;

    /**
     * Return the first value from the set.
     * @returns The first element in the set, or undefined
     */
    first(): T | undefined;

    /**
     * Return the intersection of two sets.
     * @param other - Some other set to compare against
     * @returns The intersection of both sets
     */
    intersection(other: Set<T>): Set<T>;

    /**
     * Test whether this set has an intersection with another set.
     * @param other - Another set to compare against
     * @returns Do the sets intersect?
     */
    intersects(other: Set<T>): boolean;

    /**
     * Test whether this set is a subset of some other set.
     * A set is a subset if all its members are also present in the other set.
     * @param other - Some other set that may be a subset of this one
     * @returns Is the other set a subset of this one?
     */
    isSubset(other: Set<T>): boolean;

    /**
     * Convert a set to a JSON object by mapping its contents to an array
     * @returns The set elements as an array.
     */
    toObject(): T[];

    /**
     * Test whether every element in this Set satisfies a certain test criterion.
     * @see {@link Array.every | `Array#every`}
     * @param test - The test criterion to apply. Positional arguments are the value, the index of iteration, and the set being tested.
     * @returns Does every element in the set satisfy the test criterion?
     */
    every(/** @immediate */ test: (value: T, index: number, set: Set<T>) => boolean): boolean;

    /**
     * Filter this set to create a subset of elements which satisfy a certain test criterion.
     * @see {@link Array.filter | `Array#filter`}
     * @param test - The test criterion to apply. Positional arguments are the value, the index of iteration, and the set being filtered.
     * @returns A new Set containing only elements which satisfy the test criterion.
     */
    filter<F extends T>(/** @immediate */ test: (value: T, index: number, set: Set<T>) => value is F): Set<F>;
    filter(/** @immediate */ test: (value: T, index: number, set: Set<T>) => boolean): Set<T>;

    /**
     * Find the first element in this set which satisfies a certain test criterion.
     * @see {@link Array.find | `Array#find`}
     * @param test - The test criterion to apply. Positional arguments are the value, the index of iteration, and the set being searched.
     * @returns The first element in the set which satisfies the test criterion, or undefined.
     */
    find<F extends T>(/** @immediate */ test: (value: T, index: number, set: Set<T>) => value is F): F | undefined;
    find(/** @immediate */ test: (value: T, index: number, set: Set<T>) => boolean): T | undefined;

    /**
     * Create a new Set where every element is modified by a provided transformation function.
     * @see {@link Array.map | `Array#map`}
     * @param transform - The transformation function to apply.Positional arguments are the value, the index of iteration, and the set being transformed.
     * @returns A new Set of equal size containing transformed elements.
     */
    map<V>(/** @immediate */ transform: (value: T, index: number, set: Set<T>) => V): Set<V>;

    /**
     * Create a new Set with elements that are filtered and transformed by a provided reducer function.
     * @see {@link Array.reduce | `Array#reduce`}
     * @param reducer - A reducer function applied to each value. Positional arguments are the accumulator, the value, the index of iteration, and the set being reduced.
     * @param accumulator - The initial value of the returned accumulator.
     * @returns The final value of the accumulator.
     */
    reduce<V>(
      /** @immediate */ reducer: (accumulator: V, value: T, index: number, set: Set<T>) => V,
      accumulator: V,
    ): V;

    /**
     * Test whether any element in this Set satisfies a certain test criterion.
     * @see {@link Array.some | `Array#some`}
     * @param test - The test criterion to apply. Positional arguments are the value, the index of iteration, and the set being tested.
     * @returns Does any element in the set satisfy the test criterion?
     */
    some(/** @immediate */ test: (value: T, index: number, set: Set<T>) => boolean): boolean;
  }
}
