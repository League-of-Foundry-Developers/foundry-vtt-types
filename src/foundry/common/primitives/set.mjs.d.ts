interface Set<T> {
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
}
