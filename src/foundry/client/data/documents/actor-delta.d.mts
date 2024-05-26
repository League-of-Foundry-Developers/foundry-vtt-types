import type { ConfiguredDocumentClassForName } from "../../../../types/helperTypes.d.mts";
import type { DeepPartial } from "../../../../types/utils.d.mts";
import type { DocumentModificationOptions } from "../../../common/abstract/document.d.mts";
import type { SchemaField } from "../../../common/data/fields.d.mts";
import type { BaseActor } from "../../../common/documents/module.d.mts";

declare global {
  class ActorDelta extends ClientDocumentMixin(foundry.documents.BaseActorDelta) {
    protected override _configure(options?: { pack?: string | null } | undefined): void;

    protected override _initialize(options?: any): void;
    protected override _initialize(): void;

    /**
     * Apply this ActorDelta to the base Actor and return a synthetic Actor.
     * @param context - Context to supply to synthetic Actor instantiation.
     */
    apply(context: unknown): ConfiguredActor;

    /** @remarks `"The synthetic actor prepares its items in the appropriate context of an actor. The actor delta does not need to prepare its items, and would do so in the incorrect context."` */
    override prepareEmbeddedDocuments(): void;

    override updateSource(
      changes?: SchemaField.InnerAssignmentType<BaseActor.Schema> | undefined,
      options?: { dryRun?: boolean; fallback?: boolean; recursive?: boolean } | undefined,
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
    restore(): Promise<ConfiguredActor>;

    /**
     * Ensure that the embedded collection delta is managing any entries that have had their descendants updated.
     * @param doc - The parent whose immediate children have been modified.
     */
    _handleDeltaCollectionUpdates(doc: Document): void;

    protected override _onUpdate(
      changed: BaseActor.ConstructorData,
      options: DocumentModificationOptions,
      userId: string,
    ): void;
    protected override _onUpdate(
      data: DeepPartial<Readonly<SchemaField.InnerPersistedType<any>>>,
      options: DocumentModificationOptions,
      userId: string,
    ): void;

    protected override _onDelete(options: DocumentModificationOptions, userId: string): void;

    protected override _dispatchDescendantDocumentEvents(
      event: ClientDocument.lifeCycleEventName,
      collection: string,
      args: unknown[],
      _parent: ClientDocument,
    ): void;
  }
}

type ConfiguredActor = InstanceType<ConfiguredDocumentClassForName<"Actor">>;

export {};
