import type Document from "./document.d.mts";

// A series of types used by the DatabaseBackend.
// The operation object is picked apart and restructured several times within the DatabaseBackend and ClientDatabaseBackend methods
// This means that actual functions must use helper types to properly omit properties or explicit undefined
// Also, the _result property is intentionally left out as it is never present on the client

// Note(LukeAbby): Patterns of the form `interface Example<T> extends T {}` don't count as using `T`.
// From tsc's point of view when calculating variance it may as well look like `interface Example<T> {}`.
// Fundamentally this ordinarily means `Example<T>` will always be assignable to `Example<U>` and
// vice versa.
//
// Obviously this is a problem, so `Uses` exists to add an unobtrusive covariant usage of the type
// parameter, making `Example<T>` assignable to `Example<U>` only if `T` is a subtype of `U`.
declare class Uses<T> {
  #t?: T;
}

// @ts-expect-error This pattern is inherently an error.
interface _DynamicBase<T extends object> extends T, Uses<T> {}

interface _Parent<Parent extends Document.Any | null>
  extends _DynamicBase<
    Parent extends null
      ? {
          /**
           * A parent Document within which Documents are embedded
           * @defaultValue `null`
           */
          parent?: Parent | null | undefined;
        }
      : {
          /**
           * A parent Document within which Documents are embedded
           */
          parent: Parent;
        }
  > {}

export interface DatabaseGetOperation<Parent extends Document.Any | null = Document.Any | null>
  extends _Parent<Parent> {
  /**
   * A query object which identifies the set of Documents retrieved
   */
  query: Record<string, unknown>;

  /**
   * Get requests are never broadcast
   */
  broadcast?: false | undefined;

  /**
   * Return indices only instead of full Document records
   */
  index?: boolean | undefined;

  /**
   * An array of field identifiers which should be indexed
   */
  indexFields?: string[] | undefined;

  /**
   * A compendium collection ID which contains the Documents
   */
  pack?: string | null | undefined;

  /**
   * A parent Document UUID provided when the parent instance is unavailable
   */
  parentUuid?: string | undefined;
}

export interface DatabaseCreateOperation<
  CreateData extends object | null | undefined = object | null | undefined,
  Parent extends Document.Any | null = Document.Any | null,
  Temporary extends boolean | undefined = boolean | undefined,
> extends _Parent<Parent> {
  /**
   * Whether the database operation is broadcast to other connected clients
   */
  broadcast?: boolean | undefined;

  /**
   * An array of data objects from which to create Documents
   */
  data: CreateData[];

  /**
   * Retain the _id values of provided data instead of generating new ids
   */
  keepId?: boolean | undefined;

  /**
   * Retain the _id values of embedded document data instead of generating
   *    new ids for each embedded document
   */
  keepEmbeddedIds?: boolean | undefined;

  /**
   * The timestamp when the operation was performed
   * @remarks Set in DatabaseBackend##configureOperation
   */
  modifiedTime: number;

  /**
   * Block the dispatch of hooks related to this operation
   */
  noHook?: boolean | undefined;

  /**
   * Re-render Applications whose display depends on the created Documents
   * @defaultValue `true`
   */
  render: boolean;

  /**
   * Render the sheet Application for any created Documents
   * @defaultValue `false`
   */
  renderSheet: boolean;

  /**
   * A compendium collection ID which contains the Documents
   */
  pack?: string | null | undefined;

  /**
   * A parent Document UUID provided when the parent instance is unavailable
   */
  parentUuid?: string | undefined;

  /** @privateRemarks these are added from WorldCollection.importFromCompendium() */
  fromCompendium?: boolean | undefined;

  /**
   * Clear the currently assigned folder
   */
  clearFolder?: boolean | null | undefined;

  /**
   * Clear the current sort order
   */
  clearSort?: boolean | null | undefined;

  /**
   * Clear Document ownership
   */
  clearOwnership?: boolean | null | undefined;

  /**
   * @deprecated `"It is no longer supported to create temporary documents using the Document.createDocuments API. Use the new Document() constructor instead."`
   */
  temporary?: Temporary | undefined;
}

export interface DatabaseUpdateOperation<
  UpdateData extends object | null | undefined = object | null | undefined,
  Parent extends Document.Any | null = Document.Any | null,
> extends _Parent<Parent> {
  /**
   * Whether the database operation is broadcast to other connected clients
   */
  broadcast?: boolean | null;

  /**
   * An array of data objects used to update existing Documents.
   * Each update object must contain the _id of the target Document
   */
  updates: UpdateData[];

  /**
   * Difference each update object against current Document data and only use
   * differential data for the update operation
   * @defaultValue `true`
   */
  diff: boolean;

  /**
   * The timestamp when the operation was performed
   * @remarks Set in DatabaseBackend##configureOperation
   */
  modifiedTime: number;

  /**
   * Merge objects recursively. If false, inner objects will be replaced
   * explicitly. Use with caution!
   * @defaultValue `true`
   */
  recursive: boolean;

  /**
   * Re-render Applications whose display depends on the created Documents
   * @defaultValue `true`
   */
  render: boolean;

  /**
   * Block the dispatch of hooks related to this operation
   */
  noHook?: boolean | null;

  /**
   * A compendium collection ID which contains the Documents
   */
  pack?: string | null;

  /**
   * A parent Document UUID provided when the parent instance is unavailable
   */
  parentUuid?: string | null;
}

export interface DatabaseDeleteOperation<Parent extends Document.Any | null = Document.Any | null>
  extends _Parent<Parent> {
  /**
   * Whether the database operation is broadcast to other connected clients
   */
  broadcast?: boolean;

  /**
   * An array of Document ids which should be deleted
   */
  ids: string[];

  /**
   * Delete all documents in the Collection, regardless of _id
   * @defaultValue `false`
   */
  deleteAll: boolean;

  /**
   * The timestamp when the operation was performed
   * @remarks Set in DatabaseBackend##configureOperation
   */
  modifiedTime: number;

  /**
   * Block the dispatch of hooks related to this operation
   */
  noHook?: boolean | null;

  /**
   * Re-render Applications whose display depends on the deleted Documents
   * @defaultValue `true`
   */
  render: boolean;

  /**
   * A compendium collection ID which contains the Documents
   */
  pack?: string | null;

  /**
   * A parent Document UUID provided when the parent instance is unavailable
   */
  parentUuid?: string | null;
}

export interface DatabaseOperationMap {
  get: DatabaseGetOperation;
  create: DatabaseCreateOperation;
  update: DatabaseUpdateOperation;
  delete: DatabaseDeleteOperation;
}

export type DatabaseAction = keyof DatabaseOperationMap;
export type DatabaseOperation = DatabaseOperationMap[keyof DatabaseOperationMap];

export interface DocumentSocketRequest<Action extends DatabaseAction> {
  /**
   * The type of Document being transacted
   */
  type: string;

  /**
   * The action of the request
   */
  action: Action;

  /**
   * Operation parameters for the request
   */
  operation: DatabaseOperationMap[Action];

  /**
   * The id of the requesting User
   */
  userId: string;

  /**
   * Should the response be broadcast to other connected clients?
   */
  broadcast: boolean;
}
