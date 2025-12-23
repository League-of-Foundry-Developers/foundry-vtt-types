import type { Identity, InexactPartial } from "#utils";
import type DataModel from "./data.d.mts";
import type Document from "./document.d.mts";
import type EmbeddedCollection from "./embedded-collection.d.mts";

/**
 * An embedded collection delta contains delta source objects that can be compared against other objects inside a base
 * embedded collection, and generate new embedded Documents by combining them.
 *
 * @privateRemarks `ParentDataModel` should be constrained to `extends ActorDelta.Implementation` as that's the only valid parent, but this
 * breaks fields because it makes `EmbeddedCollectionDelta` types not assignable to `EmbeddedCollection` types
 */
declare class EmbeddedCollectionDelta<
  ContainedDocument extends Document.Any,
  ParentDataModel extends Document.Any,
  Methods extends Collection.Methods.Any = EmbeddedCollectionDelta.Methods<ContainedDocument>,
> extends EmbeddedCollection<ContainedDocument, ParentDataModel, Methods> {
  /**
   * A convenience getter to return the corresponding base collection.
   * @remarks This returns the version of this collection on the {@linkcode TokenDocument.Implementation.baseActor | baseActor}
   */
  get baseCollection(): EmbeddedCollection<ContainedDocument, Actor.Stored>;

  /**
   * A convenience getter to return the corresponding synthetic collection.
   * @remarks This returns the version of this collection on the constructed, synthetic
   * {@linkcode TokenDocument.Implementation.actor | actor}
   */
  get syntheticCollection(): EmbeddedCollection<ContainedDocument, Actor.Implementation>;

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

  override initialize(options?: EmbeddedCollectionDelta.InitializeOptions): void;

  /**
   * @remarks This override only exists to allow the parent to be set preferentially to the synthetic actor, there are no type changes from
   * {@linkcode EmbeddedCollection.createDocument | super}.
   */
  override createDocument(
    data: Document.CreateDataForName<ContainedDocument["documentName"]>,
    context: EmbeddedCollection.DocumentConstructionContext,
  ): Document.ImplementationFor<ContainedDocument["documentName"]>;

  /**
   * Restore a Document so that it is no longer managed by the collection delta and instead inherits from the base Document.
   * @param id - The Document ID
   * @returns The restored Document
   *
   * @remarks This is a thin wrapper around {@linkcode EmbeddedCollectionDelta.restoreDocuments | #restoreDocuments}.
   *
   * @privateRemarks This method is never called by core code, including the server, and always errors in limited runtime testing, but we
   * have a positive claim from Foundry staff that it's "not vestigial":
   * {@link https://discord.com/channels/170995199584108546/811676497965613117/1437588519177551892}
   */
  restoreDocument(id: string): Promise<ContainedDocument>;

  /**
   * Restore the given Documents so that they are no longer managed by the collection delta and instead inherit directly
   * from their counterparts in the base Actor.
   * @param ids - The IDs of the Documents to restore.
   * @returns An array of updated Document instances.
   *
   * @privateRemarks This method is never called by core code (except {@linkcode restoreDocument}), including the server, and always errors
   * in limited runtime testing, but we have a positive claim from Foundry staff that it's "not vestigial":
   * {@link https://discord.com/channels/170995199584108546/811676497965613117/1437588519177551892}
   */
  restoreDocuments(ids: string[]): Promise<ContainedDocument[]>;

  /**
   * Prepare changes to this delta collection.
   * @param changes - Candidate source changes.
   * @param options - Options which determine how the new data is merged.
   * @internal
   *
   * @remarks Mutates `changes`.
   *
   * This method does nothing with `options`, but foundry types it as {@linkcode DataModel.UpdateOptions}, and it will get passed
   * those via the chain starting at {@linkcode ActorDelta.updateSource | ActorDelta#updateSource}
   */
  _prepareDeltaUpdate(
    changes: Document.UpdateDataForName<ContainedDocument["documentName"]>,
    options?: DataModel.UpdateOptions,
  ): void;

  protected override _set(key: string, value: ContainedDocument, options?: EmbeddedCollectionDelta.SetOptions): void;

  protected override _delete(key: string, options?: EmbeddedCollectionDelta.DeleteOptions): void;

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
     *
     * @remarks Passing `true` {@linkcode Map.clear | clear}s the collection prior to initialization.
     *
     * @privateRemarks This property is pulled out of `options` before forwarding to
     * {@linkcode EmbeddedCollectionDelta._initializeDocument | #_initializeDocument}, so the interface there doesn't need to change.
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

  /**
   * Options for {@linkcode EmbeddedCollectionDelta.set | EmbeddedCollectionDelta#set} and
   * {@linkcode EmbeddedCollectionDelta._set | #_set}
   */
  interface SetOptions extends EmbeddedCollection.SetOptions, _RestoreDelta {}

  /**
   * Options for {@linkcode EmbeddedCollectionDelta.delete | EmbeddedCollectionDelta#delete} and
   * {@linkcode EmbeddedCollectionDelta._delete | #_delete}
   */
  interface DeleteOptions extends EmbeddedCollection.DeleteOptions, _RestoreDelta {}

  /**
   * The method signatures for {@linkcode EmbeddedCollectionDelta}.
   * @see {@linkcode Collection.Methods}
   * @see {@linkcode Collection.SetMethod}
   *
   * @remarks `#get` is not overridden in `EmbeddedCollectionDelta`
   */
  interface Methods<ContainedDocument extends Document.Any> extends Pick<
    EmbeddedCollection.Methods<ContainedDocument>,
    "get"
  > {
    /**
     * Add a document to the collection
     * @param key     - The embedded Document ID
     * @param value   - The embedded Document instance
     * @param options - Additional options to the set operation
     */
    set(key: string, value: ContainedDocument, options?: EmbeddedCollectionDelta.SetOptions): void;

    /**
     * Remove a document from the collection.
     * @param key     - The embedded Document ID.
     * @param options - Additional options to the delete operation.
     */
    delete(key: string, options?: EmbeddedCollectionDelta.DeleteOptions): void;
  }
}

export default EmbeddedCollectionDelta;

declare class AnyEmbeddedCollectionDelta extends EmbeddedCollectionDelta<Document.Any, Document.Any> {
  constructor(...args: never);
}
