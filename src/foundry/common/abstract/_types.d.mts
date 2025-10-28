import type { InexactPartial } from "#utils";
import type Document from "./document.d.mts";
import type { DatabaseBackend } from "#common/abstract/_module.d.mts";

/** @privateRemarks `ClientDatabaseBackend` only used for links */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ClientDatabaseBackend } from "#client/data/_module.d.mts";

// A series of types used by the DatabaseBackend.
// The operation object is picked apart and restructured several times within the DatabaseBackend and ClientDatabaseBackend methods
// This means that actual functions must use helper types to properly omit properties or explicit undefined
// Also, the _result property is intentionally left out as it is never present on the client

// @ts-expect-error This pattern is inherently an error.
interface _DynamicBase<T extends object> extends T {}

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

/** @internal */
type _DatabaseCreateOperation<Temporary extends boolean | undefined = boolean | undefined> = InexactPartial<{
  /**
   * Whether the database operation is broadcast to other connected clients
   * @remarks Behaves as if the default is `true`
   * @privateRemarks Despite this being marked required in core's typedef, it is only ever set (to `false`) in the server-side
   * `FogExploration._onXOperation` methods
   */
  broadcast: boolean;

  /**
   * Retain the `_id` values of provided data instead of generating new ids
   */
  keepId: boolean;

  /**
   * Retain the `_id` values of embedded document data instead of generating new ids for each embedded document
   */
  keepEmbeddedIds: boolean;

  /**
   * A parent Document UUID provided when the parent instance is unavailable
   */
  parentUuid: string | null;

  /**
   * Block the dispatch of hooks related to this operation
   */
  noHook: boolean;

  /**
   * A compendium collection ID which contains the Documents
   */
  pack: string | null;

  /**
   * @deprecated "It is no longer supported to create temporary documents using the {@linkcode Document.createDocuments}
   * API. Use the `new Document()` constructor instead." (since v12, until v14)
   */
  temporary: Temporary;
}>;

/**
 * @remarks This interface is typed such that it's accurate for the point where the most properties are guaranteed by core to exist
 * (after `DatabaseBackend##configureCreate` and `##configureOperation`, before {@linkcode ClientDatabaseBackend._createDocuments | ClientDatabaseBackend#_createDocuments})
 */
export interface DatabaseCreateOperation<
  CreateData extends object = object,
  Parent extends Document.Any | null = Document.Any | null,
  Temporary extends boolean | undefined = boolean | undefined,
> extends _DatabaseCreateOperation<Temporary> {
  /**
   * A parent Document within which Documents are embedded
   * @remarks Passing either this property or {@linkcode parentUuid} is required for {@link Document.EmbeddedType | obligately embedded documents}.
   * `parentUuid` takes precedence.
   */
  parent: Parent;

  /**
   * The action of this database operation
   * @remarks Added to the operation object in `DatabaseBackend##configureCreate`
   */
  action: "create";

  /**
   * An array of data objects from which to create Documents
   */
  data: CreateData[];

  /**
   * The timestamp when the operation was performed
   * @remarks Set in `DatabaseBackend##configureOperation`, overwriting anything passed. Omitted from the passable
   * types (see {@linkcode Document.Database2.CreateDocumentsOperation})
   */
  modifiedTime: number;

  /**
   * Re-render Applications whose display depends on the created Documents
   * @defaultValue `true`
   * @remarks This is marked required here as it's guaranteed to be set before the operation hits {@linkcode ClientDatabaseBackend._createDocuments | ClientDatabaseBackend#_createDocuments}.
   * Not omitted from passable types as it's set with `??=`, not `=`.
   */
  render: boolean;

  /**
   * Render the sheet Application for any created Documents
   * @defaultValue `false`
   * @remarks This is marked required here as it's guaranteed to be set before the operation hits {@linkcode ClientDatabaseBackend._createDocuments | ClientDatabaseBackend#_createDocuments}.
   * Not omitted from passable types as it's set with `??=`, not `=`.
   */
  renderSheet: boolean;
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

/** @deprecated Use {@linkcode DatabaseBackend.DatabaseOperationMap} instead. This type will cease being exported in v14. */
export type DatabaseOperationMap = DatabaseBackend.DatabaseOperationMap;

/** @deprecated Use {@linkcode DatabaseBackend.DatabaseAction} instead. This type will cease being exported in v14. */
export type DatabaseAction = DatabaseBackend.DatabaseAction;

/** @deprecated Use {@linkcode DatabaseBackend.DatabaseAction} instead. This type will cease being exported in v14. */
export type DatabaseOperation = DatabaseBackend.DatabaseOperation;

export interface DocumentSocketRequest<Action extends DatabaseBackend.DatabaseAction> {
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
  operation: DatabaseBackend.DatabaseOperationMap[Action];

  /**
   * The id of the requesting User
   */
  userId: string;

  /**
   * Should the response be broadcast to other connected clients?
   */
  broadcast: boolean;
}
