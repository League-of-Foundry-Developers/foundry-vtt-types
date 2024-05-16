import type { DocumentConstructor } from "../../../types/helperTypes.d.mts";
import EmbeddedCollection from "./embedded-collection.mjs";

/**
 * This class provides a {@link Collection} wrapper around a singleton embedded Document so that it can be interacted
 * with via a common interface.
 */
export default class SingletonEmbeddedCollection<
  ContainedDocumentConstructor extends DocumentConstructor,
  ParentDataModel extends foundry.abstract.Document<any, any, any>,
> extends EmbeddedCollection<ContainedDocumentConstructor, ParentDataModel> {
  /**
   * @throws `Cannot create singleton embedded ${embeddedName} [${key}] in parent ${parentName} `  + `[${this.model.id}] as it already has one assigned.`
   */
  override set(key: string, value: InstanceType<ContainedDocumentConstructor>): this;

  protected override _set(key: string, value: InstanceType<ContainedDocumentConstructor>): void;

  protected override _delete(key: string, options: Record<string, unknown>): void;
}
