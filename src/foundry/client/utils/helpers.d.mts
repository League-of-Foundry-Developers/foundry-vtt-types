import type {
  Coalesce,
  GetNameFromUuid,
  InexactPartial,
  MustBeValidUuid,
  ParsedUUID,
  ParseUUID,
  __UnsetDocument,
  ParseUuid2,
} from "#utils";
import type { Document } from "#common/abstract/_module.d.mts";
import type { CompendiumCollection } from "#client/documents/collections/_module.d.mts";

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

/** @internal */
interface _FromUuidOptions<Invalid extends boolean | undefined, Relative extends Document.Any | undefined> {
  /** A Document to resolve relative UUIDs against. */
  relative: Relative;

  /**
   * Allow retrieving an invalid Document.
   * @defaultValue `false`
   */
  invalid: Invalid;
}

export interface FromUuidOptions<
  Relative extends Document.Any | undefined,
  Invalid extends boolean | undefined,
> extends InexactPartial<_FromUuidOptions<Invalid, Relative>> {}

/**
 * Retrieve a Document by its Universally Unique Identifier (uuid).
 * @param uuid    - The uuid of the Entity or Embedded Entity to retrieve
 * @param options - Options to configure how a UUID is resolved.
 */
export function fromUuid<
  ConcreteDocument extends Document.Any = __UnsetDocument,
  Invalid extends boolean | undefined = undefined,
  const Uuid extends string = string,
  Relative extends ValidRelativesOf<Uuid, ConcreteDocument> | undefined =
    | ValidRelativesOf<Uuid, ConcreteDocument>
    | undefined,
>(
  uuid: FromUuidValidate<ConcreteDocument, Uuid>,
  options?: FromUuidOptions<Relative, Invalid>,
): Promise<FromUuidReturn<ConcreteDocument, Invalid, Uuid>>;

type FromUuidReturn<Doc extends Document.Any, Invalid extends boolean | undefined, Uuid extends string> =
  | (__UnsetDocument extends Doc
      ? FromUuid<Uuid, Coalesce<Invalid, false>>
      : _MaybeInvalid<Doc, Coalesce<Invalid, false>>)
  | null;

type _MaybeInvalid<Doc extends Document.Any, Invalid extends boolean> =
  | (Invalid extends true ? Document.InvalidForName<Doc["documentName"]> : never)
  | Doc;

/** @internal */
interface _FromUuidSyncOptions {
  /**
   * Throw an error if the UUID cannot be resolved synchronously.
   * @defaultValue `true`
   * @privateRemarks This doesn't actually affect the return type, even with `strict: true` there are paths
   * that can return `null` before it throws.
   */
  strict: boolean;
}

export interface FromUuidSyncOptions<Relative extends Document.Any | undefined, Invalid extends boolean | undefined>
  extends InexactPartial<FromUuidOptions<Relative, Invalid>>, InexactPartial<_FromUuidSyncOptions> {}

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
  Invalid extends boolean | undefined = undefined,
  const Uuid extends string = string,
  Relative extends ValidRelativesOf<Uuid, ConcreteDocument> | undefined = undefined,
>(
  uuid: FromUuidValidate<ConcreteDocument, Uuid>,
  options?: FromUuidSyncOptions<Relative, Invalid>,
): FromUuidSyncReturn<ConcreteDocument, Invalid, Uuid>;

type FromUuidSyncReturn<Doc extends Document.Any, Invalid extends boolean | undefined, Uuid extends string> =
  | (__UnsetDocument extends Doc
      ? FromUuid<Uuid, Coalesce<Invalid, false>> | _IndexEntryFor<Uuid>
      : _MaybeInvalid<Doc, Coalesce<Invalid, false>> | _IndexEntryFor<string, Doc["documentName"]>)
  | null;

type _IndexEntryFor<Uuid extends string, Name = GetNameFromUuid<Uuid>> = Name extends Document.CompendiumType
  ? CompendiumCollection.IndexEntry<Name>
  : never;

type ValidRelativesOf<
  Uuid extends string,
  Expected extends Document.Any,
  Generation extends number | null = null,
> = Uuid extends unknown ? Document.ImplementationFor<_ValidRelativesOf<Uuid, Expected, Generation>> : never;

type _x = ValidRelativesOf<"ActiveEffect.ARandomIDToTest" | "PlaylistSound.foo", __UnsetDocument, 0>;

type _ValidRelativesOf<
  Uuid extends string,
  ExpectedDoc extends Document.Any,
  Generation extends number | null,
  Parsed extends ParsedUUID = ParseUuid2<Uuid, ExpectedDoc>,
> = Generation extends number
  ? Document.XParentOf<Parsed["type"], Generation>
  : Parsed["type"] | Document.AncestorsOf<Parsed["type"]>;

declare const AnyDocumentClass: Document.AnyConstructor;
declare abstract class InvalidUuid extends AnyDocumentClass {}
declare abstract class RelativeRequired extends AnyDocumentClass {}

type FromUuid<
  Uuid extends string,
  Invalid extends boolean | undefined = undefined,
  Name extends GetNameFromUuid<Uuid> = GetNameFromUuid<Uuid>,
> = [Name] extends [never] ? InvalidUuid : _MaybeInvalid<Document.StoredForName<Name>, Coalesce<Invalid, false>>;

// type _FromUuid<
//   Uuid extends string,
//   Invalid extends boolean | undefined,
//   RelativeDoc extends Document.Any | undefined,
//   Parsed extends ParsedUUID = ParseUUID<Uuid>,
// > = Parsed["relative"]["length"] extends 0
//   ? Document.Type extends Parsed["type"]
//     ?

//     _MaybeInvalid<Document.StoredForName<Parsed["type"]>, Coalesce<Invalid, false>>
//   : RelativeDoc extends undefined
//     ? // No relative was passed for a relative UUID
//       RelativeRequired
//     : _MaybeInvalid<
//         Document.StoredForName<_GetTypeFromRelative<Parsed["relative"], NonNullable<RelativeDoc>>>,
//         Coalesce<Invalid, false>
//       >;

type _GetTypeFromRelative<
  RelativeCount extends unknown[],
  RelativeDoc extends Document.Any,
  Type extends Document.Type = RelativeDoc["documentName"],
> = RelativeCount extends [unknown, ...infer Rest]
  ? _GetTypeFromRelative<Rest, NonNullable<RelativeDoc["parent"]>, NonNullable<RelativeDoc["parent"]>["documentName"]>
  : Type;

type _t = _GetTypeFromRelative<[unknown, unknown, unknown, unknown], ActiveEffect.Stored>;

type FromUuidValidate<ConcreteDocument extends Document.Any, Uuid extends string> = string extends Uuid
  ? string
  : MustBeValidUuid<Uuid, ConcreteDocument["documentName"]>;

/**
 * Return a reference to the Document class implementation which is configured for use.
 * @param documentName - The canonical Document name, for example "Actor"
 * @returns configured Document class implementation
 * @privateRemarks Foundry types this as `| undefined` but they can't enforce passing a valid Document type
 */
export function getDocumentClass<Name extends Document.Type>(documentName: Name): Document.ImplementationClassFor<Name>;

/**
 * Return a reference to the PlaceableObject class implementation which is configured for use.
 * @param documentName - The canonical Document name, for example "Actor"
 * @returns The configured PlaceableObject class implementation
 */
export function getPlaceableObjectClass<Name extends Document.PlaceableType>(
  documentName: Name,
): Document.ObjectClassFor<Name>;

interface _SortOptions<T, SortKey extends string | undefined> {
  /**
   * The target object relative which to sort
   * @defaultValue `null`
   */
  target: T | null;

  /**
   * The sorted Array of siblings which share the same sorted container
   * @defaultValue `[]`
   */
  siblings: T[];

  /**
   * The name of the data property within the source object which defines the sort key
   * @defaultValue `"sort"`
   */
  sortKey: SortKey;

  /**
   * Whether to explicitly sort before (true) or sort after (false). If nothing is passed
   * the sort order will be automatically determined, preferring before.
   *
   * @defaultValue `true`
   */
  sortBefore: boolean;
}

export interface SortOptions<T, SortKey extends string | undefined = undefined> extends InexactPartial<
  _SortOptions<T, SortKey>
> {}

/**
 * Given a source object to sort, a target to sort relative to, and an Array of siblings in the container:
 * Determine the updated sort keys for the source object, or all siblings if a reindex is required.
 * Return an Array of updates to perform, it is up to the caller to dispatch these updates.
 * Each update is structured as:
 * ```ts
 * {
 *   target: object,
 *   update: {[sortKey]: sortValue}
 * }
 * ```
 *
 * @param source  - source object being sorted
 * @param options - Options which modify the sort behavior
 * @template T   - the type of the source and target object
 *
 * @returns An Array of updates for the caller of the helper function to perform
 * @privateRemarks Edited the return example to be clearer.
 */
export function performIntegerSort<T, SortKey extends string | undefined = undefined>(
  source: T,
  options?: SortOptions<T, SortKey>,
): Array<{
  target: T;
  update: {
    [Key in Coalesce<SortKey, "sort">]: number;
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
 * If no element was parsable, the return is `null`.
 */
export function parseHTML(htmlString: string): HTMLCollection | HTMLElement | null;

/**
 * Return a URL with a cache-busting query parameter appended.
 * @param src - The source URL being attempted
 * @returns The new URL, or false on a failure.
 */
export function getCacheBustURL(src: string): string | false;

/** @internal */
interface _FetchResourceOptions {
  /**
   * Append a cache-busting query parameter to the request.
   * @defaultValue `false`
   */
  bustCache: boolean;
}

export interface FetchResourceOptions extends InexactPartial<_FetchResourceOptions> {}

/**
 * Use the Fetch API to retrieve a resource and return a Blob instance for it.
 * @param src     - The resource URL
 * @param options - Options to configure the loading behaviour.
 * @returns A Blob containing the loaded data
 */
export function fetchResource(src: string, options?: FetchResourceOptions): Promise<Blob>;
