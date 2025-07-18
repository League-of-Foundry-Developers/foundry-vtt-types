// This class exists make it as sound as possible to override these parts of the class and make them

import type { AnyArray, GetKey, Identity } from "#utils";

// completely unrelated. It's done this way specifically to avoid situations with broken inheritance.
declare class Map<K, V> extends globalThis.Map<K, V> {
  [Symbol.iterator](): any;
  forEach(...args: AnyArray): any;
  get(...args: AnyArray): any;
}

/**
 * A reusable storage concept which blends the functionality of an Array with the efficient key-based lookup of a Map.
 * This concept is reused throughout Foundry VTT where a collection of uniquely identified elements is required.
 * @template T - The type of the objects contained in the Collection
 */
declare class Collection<V, Methods extends Collection.Methods.Any = Collection.Methods<V>> extends Map<string, V> {
  constructor(entries?: Iterable<readonly [string, V]> | null);

  /**
   * When iterating over a Collection, we should iterate over its values instead of over its entries
   */
  [Symbol.iterator](): MapIterator<V>;

  /**
   * Return an Array of all the entry values in the Collection
   */
  get contents(): V[];

  /**
   * Find an entry in the Map using an functional condition.
   * @see {@link Array.find | `Array#find`}
   *
   * @param condition - The functional condition to test. Positional arguments are the value, the index of
   *                    iteration, and the collection being searched.
   * @returns The value, if found, otherwise undefined
   *
   * @example Create a new Collection and reference its contents
   * ```typescript
   * let c = new Collection([["a", "A"], ["b", "B"], ["c", "C"]]);
   * c.get("a") === c.find(entry => entry === "A"); // true
   * ```
   */
  find<S extends V>(
    /** @immediate */ condition: (e: V, index: number, collection: Collection<V>) => e is S,
  ): S | undefined;
  find(/** @immediate */ condition: (e: V, index: number, collection: Collection<V>) => boolean): V | undefined;

  /**
   * Filter the Collection, returning an Array of entries which match a functional condition.
   * @see {@link Array.filter | `Array#filter`}
   *
   * @param condition - The functional condition to test. Positional arguments are the value, the
   *                    index of iteration, and the collection being filtered.
   * @returns An Array of matched values
   *
   * @example Filter the Collection for specific entries
   * ```typescript
   * let c = new Collection([["a", "AA"], ["b", "AB"], ["c", "CC"]]);
   * let hasA = c.filters(entry => entry.slice(0) === "A");
   * ```
   */
  filter<S extends V>(/** @immediate */ condition: (e: V, index: number, collection: Collection<V>) => e is S): S[];
  filter(/** @immediate */ condition: (e: V, index: number, collection: Collection<V>) => boolean): V[];

  /**
   * Apply a function to each element of the collection
   * @see {@link Array.forEach | `Array#forEach`}
   * @param fn - The function to apply to each element
   *
   * @example Apply a function to each value in the collection
   * ```typescript
   * let c = new Collection([["a", {active: false}], ["b", {active: false}], ["c", {active: false}]]);
   * c.forEach(e => e.active = true);
   * ```
   */
  forEach(/** @immediate */ fn: (e: V) => void): void;

  /**
   * Get an element from the Collection by its key.
   * @param key     - The key of the entry to retrieve
   * @param strict  - Throw an Error if the requested key does not exist,
   *                  otherwise return undefined. (default: `false`)
   * @returns The retrieved entry value, if the key exists, otherwise undefined
   *
   * @example Get an element from the Collection by key
   * ```typescript
   * let c = new Collection([["a", "A"], ["b", "B"], ["c", "C"]]);
   * c.get("a"); // "A"
   * c.get("d"); // null
   * c.get("d", {strict: true}); // throws Error
   * ```
   */
  get: Methods["get"];

  /**
   * Get an entry from the Collection by name.
   * Use of this method assumes that the objects stored in the collection have a "name" attribute.
   * @param name    - The name of the entry to retrieve
   * @param strict  - Throw an Error if the requested name does not exist,
   *                  otherwise return undefined. (default: `false`)
   * @returns The retrieved Entity, if one was found, otherwise undefined
   *
   * @example Get an element from the Collection by name (if applicable)
   * ```typescript
   * let c = new Collection([["a", "Alfred"], ["b", "Bob"], ["c", "Cynthia"]]);
   * c.getName("Alfred"); // "Alfred"
   * c.getName("D"); // undefined
   * c.getName("D", {strict: true}); // throws Error
   * ```
   */
  getName(name: string, { strict }: { strict: true }): V;
  getName(name: string, { strict }?: { strict?: false }): V | undefined;

  /**
   * Transform each element of the Collection into a new form, returning an Array of transformed values
   * @param transformer - A transformation function applied to each entry value. Positional arguments are the value, the
   *                      index of iteration, and the collection being mapped.
   * @template M       - The type of the mapped values
   * @returns An Array of transformed values
   */
  map<M>(/** @immediate */ transformer: (entity: V, index: number, collection: Collection<V>) => M): M[];

  /**
   * Reduce the Collection by applying an evaluator function and accumulating entries
   * @see {@link Array.reduce | `Array#reduce`}
   * @param reducer   - A reducer function applied to each entry value. Positional arguments are the accumulator, the
   *                    value, the index of iteration, and the collection being reduced.
   * @param initial   - An initial value which accumulates with each iteration
   * @template A     - The type of the accumulator and the return value
   * @returns The accumulated result
   *
   * @example Reduce a collection to an array of transformed values
   * ```typescript
   * let c = new Collection([["a", "A"], ["b", "B"], ["c", "C"]]);
   * let letters = c.reduce((s, l) => {
   *   return s + l;
   * }, ""); // "ABC"
   * ```
   */
  reduce<A>(
    /** @immediate */ evaluator: (accumulator: A, entity: V, index: number, collection: Collection<V>) => A,
    initial: A,
  ): A;

  /**
   * Test whether a condition is met by some entry in the Collection.
   * @see {@link Array.some | `Array#some`}
   * @param condition - The functional condition to test. Positional arguments are the value, the index of iteration,
   *                    and the collection being tested.
   * @returns Was the test condition passed by at least one entry?
   */
  some(/** @immediate */ condition: (e: V, index: number, collection: Collection<V>) => boolean): boolean;

  /**
   * Convert the Collection to a primitive array of its contents.
   * @returns An array of contained values
   */
  toJSON(): Array<V extends { toJSON: (...args: infer _1) => infer U } ? U : V>;
}

declare namespace Collection {
  interface Any extends AnyCollection {}
  interface AnyConstructor extends Identity<typeof AnyCollection> {}

  interface GetOptions {
    /**
     * Throw an Error if the requested Embedded Document does not exist.
     * @defaultValue `false`
     */
    strict?: boolean | undefined;
  }

  interface Methods<V> {
    get<Options extends foundry.documents.abstract.DocumentCollection.GetOptions | undefined = undefined>(
      key: string,
      { strict }?: Options,
    ): Collection.GetReturnType<V, Options>;
  }

  namespace Methods {
    interface Any {
      get(key: string, options?: never): unknown;
    }
  }

  type GetReturnType<T, Options extends GetOptions | undefined> = _ApplyStrict<T, GetKey<Options, "strict", undefined>>;

  /** @internal */
  type _ApplyStrict<ConcreteDocument, Strict extends boolean | undefined> =
    | (Strict extends false | undefined ? undefined : never)
    | ConcreteDocument;
}

declare abstract class AnyCollection extends Collection<unknown, Collection.Methods.Any> {
  constructor(...args: never);
}

export default Collection;
