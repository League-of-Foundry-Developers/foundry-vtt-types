import type { InexactPartial } from "../../../types/utils.d.mts";
import type EmbeddedCollection from "./embedded-collection.d.mts";

/**
 * An embedded collection delta contains delta source objects that can be compared against other objects inside a base
 * embedded collection, and generate new embedded Documents by combining them.
 */
export default class EmbeddedCollectionDelta<
  ContainedDocument extends foundry.abstract.Document.Any,
  ParentDataModel extends foundry.abstract.Document.Any,
> extends EmbeddedCollection<ContainedDocument, ParentDataModel> {
  /**
   * A convenience getter to return the corresponding base collection.
   */
  get baseCollection(): EmbeddedCollection<ContainedDocument, ParentDataModel>;

  /**
   * A convenience getter to return the corresponding synthetic collection.
   */
  get syntheticCollection(): EmbeddedCollection<ContainedDocument, ParentDataModel>;

  override createDocument(
    data: ContainedDocument["_source"][],
    context: DocumentConstructionContext,
  ): ContainedDocument;

  protected override initialize(
    options: InexactPartial<
      {
        /**
         * @defaultValue `false`
         */
        full: boolean;
      } & DocumentConstructionContext
    >,
  ): void;

  protected override _initializeDocument(
    data: ContainedDocument["_source"][],
    options: DocumentConstructionContext,
  ): void;

  protected override _createOrUpdate(
    data: ContainedDocument["_source"][][],
    options?: Parameters<ContainedDocument["updateSource"]>[1],
  ): void;

  /**
   * Determine whether a given ID is managed directly by this collection delta or inherited from the base collection.
   * @param key - The Document ID
   */
  manages(key: string): boolean;

  /**
   * Determine whether a given ID exists as a tombstone Document in the collection delta.
   * @param key - The DocumentID
   */
  isTombstone(key: string): boolean;

  /**
   * Restore a Document so that it is no longer managed by the collection delta and instead inherits from the base Document.
   * @param id - The Document ID
   * @returns The restored Document
   */
  restoreDocument(id: string): Promise<ContainedDocument>;

  /**
   * Restore the given Documents so that they are no longer managed by the collection delta and instead inherit directly
   * from their counterparts in the base Actor.
   * @param ids - The IDs of the Documents to restore.
   * @returns An array of updated Document instances.
   */
  restoreDocuments(ids: string[]): Promise<ContainedDocument[]>;

  override set(
    key: string,
    value: ContainedDocument,
    options?: InexactPartial<{ modifySource: boolean; restoreDelta: boolean }>,
  ): this;

  protected override _set(
    key: string,
    value: ContainedDocument,
    options?: InexactPartial<{
      /**
       * @defaultValue `false`
       */
      restoreDelta: boolean;
    }>,
  ): void;

  delete(key: string, options?: { modifySource?: boolean }): boolean;

  protected override _delete(key: string, options: Record<string, unknown>): void;
}
