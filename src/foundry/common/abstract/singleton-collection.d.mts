import type { Document } from "#common/abstract/_module.d.mts";
import type EmbeddedCollection from "./embedded-collection.d.mts";
/** @privateRemarks `EmbeddedDocumentField` only used for links */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { EmbeddedDocumentField } from "#common/data/fields.d.mts";
/** @privateRemarks `ActorDeltaField` only used for links */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ActorDeltaField } from "#common/documents/token.mjs";
import type { Identity } from "#utils";

/**
 * This class provides a {@linkcode Collection} wrapper around a singleton embedded Document so that it can be interacted
 * with via a common interface.
 *
 * @remarks Only ever instantiated in {@linkcode EmbeddedDocumentField.getCollection | EmbeddedDocumentField#getCollection},
 * and that field is only ever used as the base for {@linkcode ActorDeltaField}.
 */
declare class SingletonEmbeddedCollection<
  ContainedDocument extends Document.Any,
  ParentDataModel extends Document.Any,
> extends EmbeddedCollection<ContainedDocument, ParentDataModel> {
  /**
   * @remarks
   * @throws `Cannot create singleton embedded ${embeddedName} [${key}] in parent ${parentName} [${this.model.id}] as it already has one assigned.`
   */
  override set: Collection.Method<this, EmbeddedCollection.Methods<ContainedDocument>, "set">;

  protected override _set(key: string, value: ContainedDocument): void;

  protected override _delete(key: string): void;
}

declare namespace SingletonEmbeddedCollection {
  interface Any extends AnySingletonEmbeddedCollection {}
  interface AnyConstructor extends Identity<typeof AnySingletonEmbeddedCollection> {}
}

export default SingletonEmbeddedCollection;

declare abstract class AnySingletonEmbeddedCollection extends SingletonEmbeddedCollection<Document.Any, Document.Any> {
  constructor(...args: never);
}
