import type EmbeddedCollection from "./embedded-collection.d.mts";

/**
 * This class provides a {@linkcode Collection} wrapper around a singleton embedded Document so that it can be interacted
 * with via a common interface.
 */
export default class SingletonEmbeddedCollection<
  ContainedDocument extends foundry.abstract.Document.Any,
  ParentDataModel extends foundry.abstract.Document.Any,
> extends EmbeddedCollection<ContainedDocument, ParentDataModel> {
  /**
   * @throws `Cannot create singleton embedded ${embeddedName} [${key}] in parent ${parentName} `  + `[${this.model.id}] as it already has one assigned.`
   */
  override set(key: string, value: ContainedDocument): this;

  protected override _set(key: string, value: ContainedDocument): void;

  protected override _delete(key: string, options: Record<string, unknown>): void;
}
