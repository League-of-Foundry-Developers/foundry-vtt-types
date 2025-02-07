import type { InexactPartial } from "fvtt-types/utils";
import type { DocumentDatabaseOperations } from "../../../common/abstract/document.d.mts";
import type BaseRegion from "../../../common/documents/region.d.mts";
import type Document from "../../../common/abstract/document.d.mts";

declare global {
  namespace RegionDocument {
    type Metadata = Document.MetadataFor<RegionDocument>;

    type ConfiguredClass = Document.ConfiguredClassForName<"Region">;
    type ConfiguredInstance = Document.ConfiguredInstanceForName<"Region">;

    // eslint-disable-next-line @typescript-eslint/no-deprecated
    interface DatabaseOperations extends DocumentDatabaseOperations<RegionDocument> {}

    // Helpful aliases
    type ConstructorData = BaseRegion.ConstructorData;
    type UpdateData = BaseRegion.UpdateData;
    type Schema = BaseRegion.Schema;
    type Source = BaseRegion.Source;

    interface RegionEvent {
      /** The name of the event */
      name: string;

      /** The data of the event */
      data: object;

      /** The Region the event was triggered on */
      region: RegionDocument;

      /** The User that triggered the event */
      user: User;
    }

    interface SocketRegionEvent {
      /** The UUID of the Region the event was triggered on */
      regionUuid: string;

      /** The ID of the User that triggered the event */
      userId: string;

      /** The name of the event */
      eventName: string;

      /** The data of the event */
      eventData: object;

      /** The keys of the event data that are Documents */
      eventDataUuids: string[];
    }

    interface UpdateTokenOptions {
      /**
       * Are the Region documents deleted?
       * @defaultValue `false`
       */
      deleted: boolean;

      /**
       * Reset the Token document if animated?
       * @defaultValue `true`
       */
      reset: boolean;
    }

    type EventData =
      | {
          token: TokenDocument.ConfiguredInstance;
          origin?: {
            x: number;
            y: number;
            elevation: number;
          };
          destination: {
            x: number;
            y: number;
            elevation: number;
          };
          teleport: boolean;
          forced: boolean;
          segments: Region.RegionMovementSegment[];
        }
      | {
          token: TokenDocument.ConfiguredInstance;
          combatant: Combatant.ConfiguredInstance;
        }
      | _EventData;

    /** @internal */
    interface _EventData {
      readonly [K: string]: Document.Any | _EventData | _EventData[];
    }
  }

  /**
   * The client-side Region document which extends the common BaseRegion model.
   */
  class RegionDocument extends ClientDocumentMixin(foundry.documents.BaseRegion) {
    static override metadata: RegionDocument.Metadata;

    static get implementation(): RegionDocument.ConfiguredClass;

    /**
     * Activate the Socket event listeners.
     * @param socket    - The active game socket
     * @internal
     */
    protected static _activateSocketListeners(socket: WebSocket): void;

    /**
     * Update the tokens of the given regions.
     * @param regions   - The regions to update the tokens for
     * @remarks
     *  If called during Region/Scene create/update/delete workflows, the Token documents are always reset and
     *  so never in an animated state, which means the reset option may be false. It is important that the
     *  containment test is not done in an animated state.
     * @internal
     */
    protected static _updateTokens(
      regions: RegionDocument[],
      options?: InexactPartial<RegionDocument.UpdateTokenOptions>,
    ): Promise<void>;

    // TODO(Eon): Core overrides these three methods, but the override types are very complex so
    // I'm unsure if they are needed here, and if so how to type them.
    // There's also the 'DatabaseOperations' interface which may be for this?
    // So I'm leaving this for Luke/someone else
    // static override _onCreateOperation(documents, operation, user): Promise<void>;
    // static override _onUpdateOperation(documents, operation, user): Promise<void>;
    // static override _onDeleteOperation(documents, operation, user): Promise<void>;

    /** The tokens inside this region. */
    tokens: Set<TokenDocument>;

    /**
     * Trigger the Region event.
     * @param eventName     - The event name
     * @param eventData     - The event data
     * @internal
     */
    protected _triggerEvent(eventName: string, eventData: RegionDocument.EventData): Promise<void>;

    /**
     * Handle the Region event.
     * @param event     - The Region event
     * @internal
     */
    protected _handleEvent(event: RegionDocument.RegionEvent): Promise<void>;

    /**
     * @privateRemarks _onCreate, _preUpdate, _onUpdate, _onDelete, preCreateOperation, _preUpdateOperation, _onCreateOperation,
     * _onUpdateOperation, _onDeleteOperation, _preCreateDescendantDocuments, _preUpdateDescendantDocuments, _preDeleteDescendantDocuments,
     * _onUpdateDescendantDocuments, and _onDeleteDescendantDocuments are all overridden but with no signature changes.
     * For type simplicity they are left off. These methods historically have been the source of a large amount of computation from tsc.
     */

    #regionDocument: true;
  }
}
