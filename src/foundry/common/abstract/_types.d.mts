export interface DatabaseGetOperation {
  /**
   * A query object which identifies the set of Documents retrieved
   */
  query: Record<string, any>;

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
   * A parent Document within which Documents are embedded
   */
  parent?: foundry.abstract.Document.Any | undefined;

  /**
   * A parent Document UUID provided when the parent instance is unavailable
   */
  parentUuid?: string | undefined;
}

export interface DatabaseCreateOperation<T extends foundry.abstract.Document.Any = foundry.abstract.Document.Any> {
  /**
   * Whether the database operation is broadcast to other connected clients
   */
  broadcast: boolean;

  /**
   * An array of data objects from which to create Documents
   */
  data: foundry.data.fields.SchemaField.InnerAssignmentType<T["schema"]["fields"]>[];

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
   */
  modifiedTime?: number | undefined;

  /**
   * Block the dispatch of hooks related to this operation
   */
  noHook?: boolean | undefined;

  /**
   * Re-render Applications whose display depends on the created Documents
   */
  render?: boolean | undefined;

  /**
   * Render the sheet Application for any created Documents
   */
  renderSheet?: boolean | undefined;

  /**
   * A parent Document within which Documents are embedded
   */
  parent?: foundry.abstract.Document.Any | undefined;

  /**
   * A compendium collection ID which contains the Documents
   */
  pack: string | null;

  /**
   * A parent Document UUID provided when the parent instance is unavailable
   */
  parentUuid?: string | null | undefined;

  /**
   * An alias for 'data' used internally by the server-side backend
   */
  _result?: (string | Record<string, unknown>)[] | undefined;

  /** @privateRemarks these are added from WorldCollection.importFromCompendium() **/
  fromCompendium?: boolean | undefined;

  /**
   * Clear the currently assigned folder
   */
  clearFolder?: boolean | undefined;

  /**
   * Clear the current sort order
   */
  clearSort?: boolean | undefined;

  /**
   * Clear Document ownership
   */
  clearOwnership?: boolean | undefined;

  /**
   * @deprecated `"It is no longer supported to create temporary documents using the Document.createDocuments API. Use the new Document() constructor instead."`
   * @remarks No explicit undefined because deprecation message checks `"temporary" in operation`
   */
  temporary?: boolean | undefined;
}

export interface DatabaseUpdateOperation<T extends foundry.abstract.Document.Any = foundry.abstract.Document.Any> {
  /**
   * Whether the database operation is broadcast to other connected clients
   */
  broadcast: boolean;

  /**
   * An array of data objects used to update existing Documents.
   * Each update object must contain the _id of the target Document
   */
  updates: foundry.data.fields.SchemaField.InnerAssignmentType<T["schema"]["fields"]>[];

  /**
   * Difference each update object against current Document data and only use
   * differential data for the update operation
   */
  diff?: boolean | undefined;

  /**
   * The timestamp when the operation was performed
   */
  modifiedTime?: number | undefined;

  /**
   * Merge objects recursively. If false, inner objects will be replaced
   * explicitly. Use with caution!
   */
  recursive?: boolean | undefined;

  /**
   * Re-render Applications whose display depends on the created Documents
   */
  render?: boolean | undefined;

  /**
   * Block the dispatch of hooks related to this operation
   */
  noHook?: boolean | undefined;

  /**
   * A parent Document within which Documents are embedded
   */
  parent?: foundry.abstract.Document.Any | undefined;

  /**
   * A compendium collection ID which contains the Documents
   */
  pack: string | null;

  /**
   * A parent Document UUID provided when the parent instance is unavailable
   */
  parentUuid?: string | null | undefined;

  /**
   * An alias for 'updates' used internally by the server-side backend
   */
  _result?: (string | Record<string, unknown>)[] | undefined;
}

export interface DatabaseDeleteOperation {
  /**
   * Whether the database operation is broadcast to other connected clients
   */
  broadcast: boolean;

  /**
   * An array of Document ids which should be deleted
   */
  ids: string[];

  /**
   * Delete all documents in the Collection, regardless of _id
   */
  deleteAll?: boolean | undefined;

  /**
   * The timestamp when the operation was performed
   */
  modifiedTime?: number | undefined;

  /**
   * Block the dispatch of hooks related to this operation
   */
  noHook?: boolean | undefined;

  /**
   * Re-render Applications whose display depends on the deleted Documents
   */
  render?: boolean | undefined;

  /**
   * A parent Document within which Documents are embedded
   */
  parent?: foundry.abstract.Document.Any | undefined;

  /**
   * A compendium collection ID which contains the Documents
   */
  pack: string | null;

  /**
   * A parent Document UUID provided when the parent instance is unavailable
   */
  parentUuid?: string | null | undefined;

  /**
   * An alias for 'ids' used internally by the server-side backend
   */
  _result?: (string | Record<string, unknown>)[] | undefined;
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
