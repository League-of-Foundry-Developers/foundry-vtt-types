import type { DocumentConstructor } from "../../../types/helperTypes.d.mts";
import type { InexactPartial } from "../../../types/utils.d.mts";
import EmbeddedCollection from "./embedded-collection.mjs";

/**
 * An embedded collection delta contains delta source objects that can be compared against other objects inside a base
 * embedded collection, and generate new embedded Documents by combining them.
 */
export default class EmbeddedCollectionDelta<
  ContainedDocumentConstructor extends DocumentConstructor,
  ParentDataModel extends foundry.abstract.Document<any, any, any>,
> extends EmbeddedCollection<ContainedDocumentConstructor, ParentDataModel> {
  /**
   * A convenience getter to return the corresponding base collection.
   */
  get baseCollection(): EmbeddedCollection<ContainedDocumentConstructor, ParentDataModel>;

  /**
   * A convenience getter to return the corresponding synthetic collection.
   */
  get syntheticCollection(): EmbeddedCollection<ContainedDocumentConstructor, ParentDataModel>;

  override createDocument(
    data: ConstructorParameters<ContainedDocumentConstructor>[0],
    context: DocumentConstructionContext,
  ): InstanceType<ContainedDocumentConstructor>;

  protected override initialize(
    options: InexactPartial<{
      /**
       * @defaultValue `true`
       */
      strict: boolean;
      /**
       * @defaultValue `false`
       */
      full: boolean;
    }>,
  ): void;

  protected override _initializeDocument(
    data: ConstructorParameters<ContainedDocumentConstructor>[0],
    options: InexactPartial<{ strict: boolean }>,
  ): void;

  protected override _createOrUpdate(
    data: ConstructorParameters<ContainedDocumentConstructor>[0][],
    options?: Parameters<InstanceType<ContainedDocumentConstructor>["updateSource"]>[1],
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
  restoreDocument(id: string): Promise<InstanceType<ContainedDocumentConstructor>>;

  /**
   * Restore the given Documents so that they are no longer managed by the collection delta and instead inherit directly
   * from their counterparts in the base Actor.
   * @param ids - The IDs of the Documents to restore.
   * @returns An array of updated Document instances.
   */
  restoreDocuments(ids: string[]): Promise<InstanceType<ContainedDocumentConstructor>[]>;

  override set(
    key: string,
    value: InstanceType<ContainedDocumentConstructor>,
    options?: InexactPartial<{ modifySource: boolean; restoreDelta: boolean }>,
  ): this;

  protected override _set(
    key: string,
    value: InstanceType<ContainedDocumentConstructor>,
    options?: InexactPartial<{
      /**
       * @defaultValue `false`
       */
      restoreDelta: boolean;
    }>,
  ): void;

  delete(key: string, options?: { modifySource?: boolean } | undefined): boolean;

  protected override _delete(key: string, options: Record<string, unknown>): void;
}
