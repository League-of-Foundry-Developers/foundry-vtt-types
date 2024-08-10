import type { ConfiguredDocumentClassForName } from "../../../../types/helperTypes.d.mts";
import type { SchemaField } from "../../../common/data/fields.d.mts";
import type { BaseActor } from "../../../common/documents/_module.d.mts";
import type {
  DatabaseCreateOperation,
  DatabaseUpdateOperation,
  DatabaseDeleteOperation,
} from "../../../common/abstract/_types.d.mts";

declare global {
  namespace ActorDelta {
    type ConfiguredClass = ConfiguredDocumentClassForName<"ActorDelta">;
    type ConfiguredInstance = InstanceType<ConfiguredClass>;

    export interface DatabaseOperations {
      create: DatabaseCreateOperation;
      update: DatabaseUpdateOperation;
      delete: DatabaseDeleteOperation;
    }
  }

  /**
   * The client-side ActorDelta embedded document which extends the common BaseActorDelta document model.
   * @see {@link TokenDocument}  The TokenDocument document type which contains ActorDelta embedded documents.
   */
  class ActorDelta extends ClientDocumentMixin(foundry.documents.BaseActorDelta) {
    protected override _configure(options?: { pack?: string | null }): void;

    protected override _initialize(options?: any): void;
    protected override _initialize(): void;

    /**
     * Apply this ActorDelta to the base Actor and return a synthetic Actor.
     * @param context - Context to supply to synthetic Actor instantiation.
     */
    apply(context: unknown): Actor.ConfiguredInstance;

    /** @remarks `"The synthetic actor prepares its items in the appropriate context of an actor. The actor delta does not need to prepare its items, and would do so in the incorrect context."` */
    override prepareEmbeddedDocuments(): void;

    override updateSource(
      changes?: SchemaField.InnerAssignmentType<BaseActor.Schema>,
      options?: { dryRun?: boolean; fallback?: boolean; recursive?: boolean },
    ): object;

    override reset(): void;

    /**
     * Generate a synthetic Actor instance when constructed, or when the represented Actor, or actorLink status changes.
     */
    protected _createSyntheticActor(options?: {
      /**
       * Whether to fully re-initialize this ActorDelta's collections in
       * order to re-retrieve embedded Documents from the synthetic
       * Actor.
       */
      reinitializeCollections: boolean;
    }): void;

    /**
     * Update the synthetic Actor instance with changes from the delta or the base Actor.
     */
    updateSyntheticActor(): void;

    /**
     * Restore this delta to empty, inheriting all its properties from the base actor.
     * @returns The restored synthetic Actor.
     */
    restore(): Promise<Actor.ConfiguredInstance>;

    /**
     * Ensure that the embedded collection delta is managing any entries that have had their descendants updated.
     * @param doc - The parent whose immediate children have been modified.
     */
    _handleDeltaCollectionUpdates(doc: Document): void;

    /**
     * @privateRemarks _onUpdate and _onDelete are all overridden but with no signature changes.
     * For type simplicity they are left off. These methods historically have been the source of a large amount of computation from tsc.
     */

    protected override _dispatchDescendantDocumentEvents(
      event: ClientDocument.lifeCycleEventName,
      collection: string,
      args: unknown[],
      _parent: ClientDocument,
    ): void;
  }
}

export {};
