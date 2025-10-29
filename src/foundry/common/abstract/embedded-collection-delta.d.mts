import type { Identity, InexactPartial } from "#utils";
import type Document from "./document.d.mts";
import type EmbeddedCollection from "./embedded-collection.d.mts";

/**
 * An embedded collection delta contains delta source objects that can be compared against other objects inside a base
 * embedded collection, and generate new embedded Documents by combining them.
 */
export default class EmbeddedCollectionDelta<
  ContainedDocument extends Document.Any,
  ParentDataModel extends Document.Any,
> extends EmbeddedCollection<ContainedDocument, ParentDataModel> {
  /**
   * A convenience getter to return the corresponding base collection.
   */
  get baseCollection(): EmbeddedCollection<ContainedDocument, ParentDataModel>;

  /**
   * A convenience getter to return the corresponding synthetic collection.
   */
  get syntheticCollection(): EmbeddedCollection<ContainedDocument, ParentDataModel>;

  /**
   * Determine whether a given ID is managed directly by this collection delta or inherited from the base collection.
   * @param key - The Document ID.
   */
  manages(key: string): boolean;

  /**
   * Determine whether a given ID exists as a tombstone Document in the collection delta.
   * @param key - The Document ID.
   */
  isTombstone(key: string): boolean;

  override initialize(options: EmbeddedCollectionDelta.InitializeOptions): void;

  protected override _initializeDocument(
    data: ContainedDocument["_source"][],
    options: Document.ConstructionContext<ParentDataModel["parent"]>,
  ): void;

  override createDocument(
    data: Document.CreateDataForName<ContainedDocument["documentName"]>,
    context: EmbeddedCollection.DocumentConstructionContext,
  ): ContainedDocument;

  /**
   * Restore a Document so that it is no longer managed by the collection delta and instead inherits from the base Document.
   * @param id - The Document ID
   * @returns The restored Document
   *
   * @remarks This is a thin wrapper around {@linkcode EmbeddedCollectionDelta.restoreDocuments | #restoreDocuments}.
   *
   * @privateRemarks Never called by core code, always errors in limited runtime testing, possibly vestigial?
   */
  restoreDocument(id: string): Promise<ContainedDocument>;

  /**
   * Restore the given Documents so that they are no longer managed by the collection delta and instead inherit directly
   * from their counterparts in the base Actor.
   * @param ids - The IDs of the Documents to restore.
   * @returns An array of updated Document instances.
   *
   * @privateRemarks Never called by core code (except {@linkcode restoreDocument}), always errors in limited runtime testing, possibly
   * vestigial?
   */
  restoreDocuments(ids: string[]): Promise<ContainedDocument[]>;

  override set(key: string, value: ContainedDocument, options?: EmbeddedCollectionDelta.SetOptions): this;

  protected override _set(key: string, value: ContainedDocument, options?: EmbeddedCollectionDelta.SetOptions): void;

  delete(key: string, options?: EmbeddedCollectionDelta.DeleteOptions): boolean;

  protected override _delete(key: string, options: EmbeddedCollectionDelta.DeleteOptions): void;

  /** @deprecated Removed without replacement in v13. This method will be removed in v14. */
  protected override _createOrUpdate(...args: never): never;

  #EmbeddedCollectionDelta: true;
}

declare namespace EmbeddedCollectionDelta {
  interface Any extends AnyEmbeddedCollectionDelta {}
  interface AnyConstructor extends Identity<typeof AnyEmbeddedCollectionDelta> {}

  /** @internal */
  type _InitializeOptions = InexactPartial<{
    /**
     * @defaultValue `false`
     * @remarks Passing `true` {@linkcode Map.clear | clear}s the collection prior to initialization.
     */
    full: boolean;
  }>;

  interface InitializeOptions extends EmbeddedCollection.InitializeOptions, _InitializeOptions {}

  /** @internal */
  type _RestoreDelta = InexactPartial<{
    /**
     * An advanced option used specifically and internally by the ActorDelta model
     * @defaultValue `false`
     */
    restoreDelta: boolean;
  }>;

  interface SetOptions extends EmbeddedCollection.SetOptions, _RestoreDelta {}

  interface DeleteOptions extends EmbeddedCollection.DeleteOptions, _RestoreDelta {}
}

declare class AnyEmbeddedCollectionDelta extends EmbeddedCollectionDelta<Document.Any, Document.Any> {
  constructor(...args: never);
}
