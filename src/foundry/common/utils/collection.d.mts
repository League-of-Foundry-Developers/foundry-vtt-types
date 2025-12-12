import type { AnyArray, Coalesce, GetKey, Identity, InexactPartial } from "#utils";
import type { Document } from "#common/abstract/_module.d.mts";

/** @privateRemarks `EmbeddedCollection` used only for links */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type EmbeddedCollection from "#common/abstract/embedded-collection.d.mts";

/** @privateRemarks `DocumentCollection` used only for links */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { DocumentCollection } from "#client/documents/abstract/_module.d.mts";

// This class exists make it as sound as possible to override these parts of the class and make them
// completely unrelated. It's done this way specifically to avoid situations with broken inheritance.
declare class Map<K, V> extends globalThis.Map<K, V> {
  [Symbol.iterator](): any;
  forEach(...args: AnyArray): any;
  get(...args: AnyArray): any;
  set(...args: AnyArray): any;
  delete(...args: AnyArray): any;
}

/**
 * A reusable storage concept which blends the functionality of an Array with the efficient key-based lookup of a Map.
 * This concept is reused throughout Foundry VTT where a collection of uniquely identified elements is required.
 * @template T - The type of the objects contained in the Collection
 */
declare class Collection<V, Methods extends Collection.Methods.Any = Collection.Methods<V>> extends Map<string, V> {
  /**
   * This is to allow {@linkcode foundry.documents.abstract.DirectoryCollectionMixin | DirectoryCollectionMixin} (or any
   * theoretical future/user mixins) clean access to the value type for this Collection.
   * @internal
   */
  " __fvtt_types_internal_value": V;

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
   * @see {@linkcode Array.find | Array#find}
   *
   * @param condition - The functional condition to test. Positional arguments are the value, the index of
   * iteration, and the collection being searched.
   * @returns The value, if found, otherwise undefined
   *
   * @example
   * Create a new Collection and reference its contents
   * ```ts
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
   * @see {@linkcode Array.filter | Array#filter}
   *
   * @param condition - The functional condition to test. Positional arguments are the value, the
   * index of iteration, and the collection being filtered.
   * @returns An Array of matched values
   *
   * @example
   * Filter the Collection for specific entries
   * ```ts
   * let c = new Collection([["a", "AA"], ["b", "AB"], ["c", "CC"]]);
   * let hasA = c.filters(entry => entry.slice(0) === "A");
   * ```
   */
  filter<S extends V>(/** @immediate */ condition: (e: V, index: number, collection: Collection<V>) => e is S): S[];
  filter(/** @immediate */ condition: (e: V, index: number, collection: Collection<V>) => boolean): V[];

  /**
   * Apply a function to each element of the collection
   * @see {@linkcode Array.forEach | Array#forEach}
   * @param fn - The function to apply to each element
   *
   * @example
   * Apply a function to each value in the collection
   * ```ts
   * let c = new Collection([["a", {active: false}], ["b", {active: false}], ["c", {active: false}]]);
   * c.forEach(e => e.active = true);
   * ```
   */
  forEach(/** @immediate */ fn: (e: V) => void): void;

  /**
   * Get an element from the Collection by its key.
   * @param key     - The key of the entry to retrieve
   * @param strict  - Throw an Error if the requested key does not exist, otherwise return undefined. (default: `false`)
   * @returns The retrieved entry value, if the key exists, otherwise undefined
   *
   * @example
   * Get an element from the Collection by key
   * ```ts
   * let c = new Collection([["a", "A"], ["b", "B"], ["c", "C"]]);
   * c.get("a"); // "A"
   * c.get("d"); // null
   * c.get("d", {strict: true}); // throws Error
   * ```
   *
   * @remarks Go to definition breaks here, see {@linkcode Collection.Methods.get}
   */
  override get: Methods["get"];

  /**
   * @remarks Fake type override to handle foundry incorrectly subclassing {@linkcode Collection}.
   *
   * Go to definition breaks here, see {@linkcode Collection.Methods.set}
   * @see {@linkcode globalThis.Map.set | Map#set}
   * @see {@linkcode Collection.SetMethod}
   */
  override set: Collection.SetMethod<this, Methods>;

  /**
   * @remarks Fake type override to handle foundry incorrectly subclassing {@linkcode Collection}.
   *
   * Go to definition breaks here, see {@linkcode Collection.Methods.delete}
   * @see {@linkcode globalThis.Map.delete | Map#delete}
   */
  override delete: Methods["delete"];

  /**
   * Get an entry from the Collection by name.
   * Use of this method assumes that the objects stored in the collection have a "name" attribute.
   * @param name    - The name of the entry to retrieve
   * @param strict  - Throw an Error if the requested name does not exist, otherwise return undefined. (default: `false`)
   * @returns The retrieved Entity, if one was found, otherwise undefined
   *
   * @example
   * Get an element from the Collection by name (if applicable)
   * ```ts
   * let c = new Collection([["a", "Alfred"], ["b", "Bob"], ["c", "Cynthia"]]);
   * c.getName("Alfred"); // "Alfred"
   * c.getName("D"); // undefined
   * c.getName("D", {strict: true}); // throws Error
   * ```
   *
   * @remarks Will always return `undefined` if the `Collection`'s value isn't an object with a `name` property.
   */
  getName<Options extends Collection.GetOptions | undefined = undefined>(
    name: string,
    options?: Options,
  ): Collection.GetReturn<V, Options>;

  /**
   * Transform each element of the Collection into a new form, returning an Array of transformed values
   * @see {@linkcode Array.map | Array#map}
   * @param transformer - A transformation function applied to each entry value. Positional arguments are the value,
   * the index of iteration, and the collection being mapped.
   * @template M        - The type of the mapped values
   * @returns An Array of transformed values
   */
  map<M>(/** @immediate */ transformer: (entity: V, index: number, collection: Collection<V>) => M): M[];

  /**
   * Reduce the Collection by applying an evaluator function and accumulating entries
   * @see {@linkcode Array.reduce | Array#reduce}
   * @param reducer - A reducer function applied to each entry value. Positional arguments are the accumulator,
   * the value, the index of iteration, and the collection being reduced.
   * @param initial - An initial value which accumulates with each iteration
   * @template A    - The type of the accumulator and the return value
   * @returns The accumulated result
   *
   * @example
   * Reduce a collection to an array of transformed values
   * ```ts
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
   * @see {@linkcode Array.some | Array#some}
   * @param condition - The functional condition to test. Positional arguments are the value, the index of iteration,
   * and the collection being tested.
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

  /**
   * This type exists to allow the `set` method provided by a given Collection subclass to accurately provide a `this` return,
   * if it does return `this` and isn't broken like all {@linkcode DocumentCollection} subclasses in 13.350
   * ({@link https://github.com/foundryvtt/foundryvtt/issues/13565})
   */
  type SetMethod<This, Methods extends Collection.Methods.Any> = ({ self: This } & Methods)["set"];

  /** Method signatures for {@linkcode Collection} */
  interface Methods<V> {
    self: unknown;

    get<Options extends Collection.GetOptions | undefined = undefined>(
      key: string,
      options?: Options,
    ): Collection.GetReturn<V, Options>;

    set(key: string, value: V): this["self"];

    delete(key: string): boolean;
  }

  namespace Methods {
    /**
     * The base requirements for a `Collection` subclass. `self` is a hack to allow a valid `this` return for `set`,
     * where it isn't broken, see {@linkcode Collection.SetMethod}
     */
    interface Any {
      self: unknown;

      get(key: string, options?: never): unknown;

      set(key: string, value: unknown, options?: never): unknown;

      delete(key: string, options?: never): unknown;
    }
  }

  /** @internal */
  type _GetOptions = InexactPartial<{
    /**
     * Throw an Error if the requested key does not exist.
     * @defaultValue `false`
     */
    strict: boolean;
  }>;

  interface GetOptions extends _GetOptions {}

  /**
   * Options for {@linkcode EmbeddedCollection.getInvalid | EmbeddedCollection#getInvalid} and
   * {@linkcode DocumentCollection.getInvalid | DocumentCollection#getInvalid}.
   *
   * Only differs from {@linkcode _GetOptions} in property description. Wording and default are shared between subclasses,
   * so put here for re-use.
   * @internal
   */
  type _GetInvalidOptions = InexactPartial<{
    /**
     * Throw an Error if the requested ID is not in the set of invalid IDs for this collection.
     * @defaultValue `true`
     */
    strict: boolean;
  }>;

  /**
   * Used for {@linkcode EmbeddedCollection.GetOptions} and {@linkcode DocumentCollection.GetOptions}.
   * @internal
   */
  type _InvalidOption = InexactPartial<{
    /**
     * Allow retrieving an invalid Document.
     * @defaultValue `false`
     */
    invalid: boolean;
  }>;

  /**
   * The `#get` and `#getInvalid` methods of `Collection` and its various subclasses all take a `strict` boolean in their options, changing
   * the behaviour of passing a key that the collection doesn't contain:
   * - `true`: throw an error
   * - `false`: return `undefined`
   * @internal
   */
  type _ApplyStrict<Options extends Readonly<_GetOptions> | undefined, StrictDefault extends boolean = false> =
    false extends Coalesce<GetKey<Options, "strict", undefined>, StrictDefault> ? undefined : never;

  /**
   * See {@linkcode _ApplyStrict}.
   *
   * `StrictDefault` is a param because {@linkcode DocumentCollection.getInvalid | DocumentCollection#getInvalid} and
   * {@linkcode EmbeddedCollection.getInvalid | EmbeddedCollection#getInvalid} default `strict` to `true`
   *
   * The `Coalesce` is required to handle passing explicit `undefined`, either on its own or in a union.
   * @internal
   */
  type _GetReturn<V, Options extends Readonly<_GetOptions> | undefined, StrictDefault extends boolean = false> =
    | V
    | _ApplyStrict<Options, StrictDefault>;

  /** The return type for {@linkcode Collection.get | Collection#get}. */
  type GetReturn<V, Options extends GetOptions | undefined> = _GetReturn<V, Options>;

  /**
   * Helper type for allowing invalid documents or not in {@linkcode DocumentCollection.get | DocumentCollection#get} and
   * {@linkcode EmbeddedCollection.get | EmbeddedCollection#get}.
   *
   * This type assumes that all elements of the relevant collection are Stored documents; this is enforced at runtime in
   * `DocumentCollection`s by its `#set` override, but not in {@linkcode EmbeddedCollection}.
   *
   * The `Coalesce` is required to handle passing explicit `undefined`, either on its own or in a union.
   * @internal
   */
  type _ApplyInvalid<
    DocumentName extends Document.Type,
    Options extends Readonly<_InvalidOption> | undefined,
    InvalidDefault extends boolean = false,
  > =
    | Document.StoredForName<DocumentName>
    | (true extends Coalesce<GetKey<Options, "invalid", undefined>, InvalidDefault>
        ? Document.InvalidForName<DocumentName>
        : never);

  /** @deprecated Use {@linkcode GetReturn} instead. This type will be removed in v14. */
  type GetReturnType<V, Options extends GetOptions | undefined> = GetReturn<V, Options>;
}

export default Collection;

declare abstract class AnyCollection extends Collection<unknown, Collection.Methods.Any> {
  constructor(...args: never);
}
