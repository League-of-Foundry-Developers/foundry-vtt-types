import type { InexactPartial } from "../../../../utils/index.d.mts";
import type Document from "../../../common/abstract/document.d.mts";
import type { DocumentDatabaseOperations } from "../../../common/abstract/document.d.mts";
import type BaseRegionBehavior from "../../../common/documents/region-behavior.d.mts";

declare global {
  namespace RegionBehavior {
    type Metadata = Document.MetadataFor<RegionBehavior>;

    type ConfiguredClass = Document.ConfiguredClassForName<"RegionBehavior">;
    type ConfiguredInstance = Document.ConfiguredInstanceForName<"RegionBehavior">;

    interface DatabaseOperations extends DocumentDatabaseOperations<RegionBehavior> { }

    // Helpful aliases
    type ConstructorData = BaseRegionBehavior.ConstructorData;
    type UpdateData = BaseRegionBehavior.UpdateData;
    type Schema = BaseRegionBehavior.Schema;
    type Source = BaseRegionBehavior.Source;
  }

  /**
   * The client-side RegionBehavior document which extends the common BaseRegionBehavior model.
   */
  class RegionBehavior extends ClientDocumentMixin(foundry.documents.BaseRegionBehavior) {
    static override metadata: RegionBehavior.Metadata;

    static get implementation(): RegionBehavior.ConfiguredClass;

    /** A convenience reference to the RegionDocument which contains this RegionBehavior. */
    get region(): RegionDocument.ConfiguredInstance | null;

    /** A convenience reference to the Scene which contains this RegionBehavior. */
    get scene(): Scene.ConfiguredInstance | null;

    /** A RegionBehavior is active if and only if it was created, hasn't been deleted yet, and isn't disabled. */
    get active(): boolean;

    /** A RegionBehavior is viewed if and only if it is active and the Scene of its Region is viewed. */
    get viewed(): boolean;

    override prepareBaseData(): void;

    /**
     * Does this RegionBehavior handle the Region events with the given name?
     * @param eventName     - The Region event name
     */
    hasEvent(eventName: string): boolean;

    /**
     * Handle the Region Event.
     * @param event     - The Region event
     * @internal
     */
    protected _handleRegionEvent(event: RegionDocument.RegionEvent): void;    

    /**
     * @privateRemarks _onCreate, _preUpdate, _onUpdate, _onDelete, preCreateOperation, _preUpdateOperation, _onCreateOperation,
     * _onUpdateOperation, _onDeleteOperation, _preCreateDescendantDocuments, _preUpdateDescendantDocuments, _preDeleteDescendantDocuments,
     * _onUpdateDescendantDocuments, and _onDeleteDescendantDocuments are all overridden but with no signature changes.
     * For type simplicity they are left off. These methods historically have been the source of a large amount of computation from tsc.
     */

    // TODO(Eon): The above remark was copied from other Document implementations; one not listed here is `createDialog`.
    // Unsure if that is intentional or not, so I've included the 'JS' version commented out for now:
    // static override createDialog(data, options): Promise<any>;
  }
}