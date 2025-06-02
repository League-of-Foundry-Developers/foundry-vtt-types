import type { AnyObject, MustBeValidUuid, NullishProps } from "#utils";
import type Document from "#common/abstract/document.d.mts";

/**
 * Clean a provided HTML fragment, closing unbalanced tags and stripping some undesirable properties
 * @param raw - A raw HTML string
 * @returns The cleaned HTML content
 */
export function cleanHTML(raw: string): string;

/**
 * Export data content to be saved to a local file
 * @param data     - Data content converted to a string
 * @param type     - The type of
 * @param filename - The filename of the resulting download
 */
export function saveDataToFile(data: string, type: string, filename: string): void;

/**
 * Read text data from a user provided File object
 * @param file - A File object
 * @returns A Promise which resolves to the loaded text data
 */
export function readTextFromFile(file: File): Promise<string>;

export interface FromUuidOptions {
  /** A Document to resolve relative UUIDs against. */
  relative?: ClientDocument;

  /** Allow retrieving an invalid Document. (default: `false`) */
  invalid?: boolean;
}

/**
 * Retrieve an Entity or Embedded Entity by its Universally Unique Identifier (uuid).
 * @param uuid    - The uuid of the Entity or Embedded Entity to retrieve
 * @param options - Options to configure how a UUID is resolved.
 */
export function fromUuid<ConcreteDocument extends Document.Any = __UnsetDocument, const Uuid extends string = string>(
  uuid: FromUuidValidate<ConcreteDocument, Uuid> | null | undefined,
  options?: FromUuidOptions,
): Promise<(__UnsetDocument extends ConcreteDocument ? FromUuid<Uuid> : ConcreteDocument) | null>;

export interface FromUuidSyncOptions {
  /** A Document to resolve relative UUIDs against. */
  relative?: ClientDocument;

  /** Allow retrieving an invalid Document. (default: `false`) */
  invalid?: boolean;

  /** Throw an error if the UUID cannot be resolved synchronously. (default: `true`) */
  strict?: boolean;
}

/**
 * Retrieve a Document by its Universally Unique Identifier (uuid) synchronously. If the uuid resolves to a compendium
 * document, that document's index entry will be returned instead.
 * @param uuid    - The uuid of the Document to retrieve.
 * @param options - Options to configure how a UUID is resolved.
 * @returns The Document or its index entry if it resides in a Compendium, otherwise null.
 * @throws If the uuid resolves to a Document that cannot be retrieved synchronously.
 */
export function fromUuidSync<
  ConcreteDocument extends Document.Any = __UnsetDocument,
  const Uuid extends string = string,
>(
  uuid: FromUuidValidate<ConcreteDocument, Uuid> | null | undefined,
  options?: FromUuidSyncOptions,
): (__UnsetDocument extends ConcreteDocument ? FromUuid<Uuid> : ConcreteDocument) | AnyObject | null;

declare const __Unset: unique symbol;

type __UnsetDocument = Document.Any & {
  [__Unset]: true;
};

declare class InvalidUuid extends foundry.abstract.Document<any, any, any> {}

type FromUuid<Uuid extends string> = Uuid extends `${string}.${string}.${infer Rest}`
  ? FromUuid<Rest>
  : Uuid extends `${infer DocumentType extends Document.Type}.${string}`
    ? Document.ImplementationFor<DocumentType>
    : InvalidUuid;

// TODO(LukeAbby): The usage of `Document.Type` when it's unset will not be necessary once `Document.Any` is more type safe.
type FromUuidValidate<
  ConcreteDocument extends Document.Any,
  Uuid extends string,
> = __UnsetDocument extends ConcreteDocument
  ? MustBeValidUuid<Uuid, Document.Type>
  : string extends Uuid
    ? string
    : MustBeValidUuid<Uuid, ConcreteDocument["documentName"]>;

/**
 * Return a reference to the Document class implementation which is configured for use.
 * @param documentName - The canonical Document name, for example "Actor"
 * @returns configured Document class implementation
 */
export function getDocumentClass<Name extends Document.Type>(documentName: Name): Document.ImplementationClassFor<Name>;

/**
 * Return a reference to the PlaceableObject class implementation which is configured for use.
 * @param documentName - The canonical Document name, for example "Actor"
 * @returns The configured PlaceableObject class implementation
 * @privateRemarks Consider if the generic should be broader; this returns undefined, rather than errors, if the Name isn't a placeable type
 */
export function getPlaceableObjectClass<Name extends Document.PlaceableType>(
  documentName: Name,
): Document.ObjectClassFor<Name>;

export interface SortOptions<T, SortKey extends string = "sort"> {
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
export function performIntegerSort<T, SortKey extends string = "sort">(
  source: T,
  options?: SortOptions<T, SortKey>,
): Array<{
  target: T;
  update: {
    [Key in SortKey]: number;
  };
}>;

/**
 * Express a timestamp as a relative string
 * @param timeStamp - A timestamp string or Date object to be formatted as a relative time
 * @returns A string expression for the relative time
 */
export function timeSince(timeStamp: Date | string): string;

/**
 * Parse an HTML string, returning a processed HTMLElement or HTMLCollection.
 * A single HTMLElement is returned if the provided string contains only a single top-level element.
 * An HTMLCollection is returned if the provided string contains multiple top-level elements.
 */
export function parseHTML(htmlString: string): HTMLCollection | HTMLElement;

/**
 * Return a URL with a cache-busting query parameter appended.
 * @param src - The source URL being attempted
 * @returns The new URL, or false on a failure.
 */
export function getCacheBustURL(src: string): string | false;

/** @internal */
type _FetchResourceOptions = NullishProps<{
  /**
   * Append a cache-busting query parameter to the request.
   * @defaultValue `false`
   */
  bustCache: boolean;
}>;

interface FetchResourceOptions extends _FetchResourceOptions {}

/**
 * Use the Fetch API to retrieve a resource and return a Blob instance for it.
 * @param src     - The resource URL
 * @param options - Options to configure the loading behaviour.
 * @returns A Blob containing the loaded data
 */
export function fetchResource(src: string, options?: FetchResourceOptions): Promise<Blob>;
