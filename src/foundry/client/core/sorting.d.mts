export {};

declare global {
  /**
   * A collection of functions related to sorting objects within a parent container.
   */
  class SortingHelpers {
    /**
     * Given a source object to sort, a target to sort relative to, and an Array of siblings in the container:
     * Determine the updated sort keys for the source object, or all siblings if a reindex is required.
     * Return an Array of updates to perform, it is up to the caller to dispatch these updates.
     * Each update is structured as:
     * ```typescript
     * {
     *   target: object,
     *   update: {sortKey: sortValue}
     * }
     * ```
     *
     * @param source  - source object being sorted
     * @param options - Options which modify the sort behavior
     * @template T   - the type of the source and target object
     *
     * @returns An Array of updates for the caller of the helper function to perform
     */
    static performIntegerSort<T, SortKey extends string = "sort">(
      source: T,
      options?: SortingHelpers.SortOptions<T, SortKey>,
    ): Array<{
      target: T;
      update: {
        [Key in SortKey]: number;
      };
    }>;

    /**
     * Given an ordered Array of siblings and a target position, return the [min,max] indices to sort before the target
     */
    protected static _sortBefore<T>(siblings: T[], idx: number, sortKey: string): [T, T];

    /**
     * Given an ordered Array of siblings and a target position, return the [min,max] indices to sort after the target
     */
    protected static _sortAfter<T>(siblings: T[], idx: number, sortKey: string): [T, T];
  }

  namespace SortingHelpers {
    interface SortOptions<T, SortKey extends string = "sort"> {
      /**
       * The target object relative which to sort
       * @defaultValue `null`
       */
      target?: T | null | undefined;

      /**
       * The sorted Array of siblings which share the same sorted container
       * @defaultValue `[]`
       */
      siblings?: T[] | undefined;

      /**
       * The name of the data property within the source object which defines the sort key
       * @defaultValue `"sort"`
       */
      sortKey?: SortKey | undefined;

      /**
       * Whether to explicitly sort before (true) or sort after (false). If nothing is passed
       * the sort order will be automatically determined, preferring before.
       *
       * @defaultValue `true`
       */
      sortBefore?: boolean | undefined;
    }
  }
}
