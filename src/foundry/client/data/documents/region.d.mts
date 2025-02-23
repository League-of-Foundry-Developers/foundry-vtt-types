import type { InexactPartial } from "fvtt-types/utils";
import type { BaseShapeData, fields } from "../../../common/data/module.d.mts";
import type Document from "../../../common/abstract/document.d.mts";
import type { DataSchema } from "../../../common/data/fields.d.mts";

declare global {
  namespace RegionDocument {
    /**
     * The implementation of the Region document instance configured through `CONFIG.Region.documentClass` in Foundry and
     * {@link DocumentClassConfig | `DocumentClassConfig`} or {@link ConfiguredRegion | `fvtt-types/configuration/ConfiguredRegion`} in fvtt-types.
     */
    type Implementation = Document.ImplementationInstanceFor<"Region">;

    /**
     * The implementation of the Region document configured through `CONFIG.Region.documentClass` in Foundry and
     * {@link DocumentClassConfig | `DocumentClassConfig`} in fvtt-types.
     */
    type ImplementationClass = Document.ImplementationClassFor<"Region">;

    /**
     * A document's metadata is special information about the document ranging anywhere from its name,
     * whether it's indexed, or to the permissions a user has over it.
     */
    interface Metadata extends Document.MetadataFor<"Region"> {}

    /**
     * A document's parent is something that can contain it.
     * For example an `Item` can be contained by an `Actor` which makes `Actor` one of its possible parents.
     */
    type Parent = Scene.Implementation | null;

    /**
     * An instance of `Region` that comes from the database.
     */
    interface Stored extends Document.Stored<RegionDocument.Implementation> {}

    /**
     * The data put in {@link DataModel._source | `DataModel._source`}. This data is what was
     * persisted to the database and therefore it must be valid JSON.
     *
     * For example a {@link fields.SetField | `SetField`} is persisted to the database as an array
     * but initialized as a {@link Set | `Set`}.
     *
     * Both `Source` and `PersistedData` are equivalent.
     */
    interface Source extends PersistedData {}

    /**
     * The data put in {@link Region._source | `Region._source`}. This data is what was
     * persisted to the database and therefore it must be valid JSON.
     *
     * Both `Source` and `PersistedData` are equivalent.
     */
    interface PersistedData extends fields.SchemaField.PersistedData<Schema> {}

    /**
     * The data necessary to create a document. Used in places like {@link Region.create | `Region.create`}
     * and {@link Region | `new Region(...)`}.
     *
     * For example a {@link fields.SetField | `SetField`} can accept any {@link Iterable | `Iterable`}
     * with the right values. This means you can pass a `Set` instance, an array of values,
     * a generator, or any other iterable.
     */
    interface CreateData extends fields.SchemaField.CreateData<Schema> {}

    /**
     * The data after a {@link Document | `Document`} has been initialized, for example
     * {@link Region.name | `Region#name`}.
     *
     * This is data transformed from {@link Region.Source | `Region.Source`} and turned into more
     * convenient runtime data structures. For example a {@link fields.SetField | `SetField`} is
     * persisted to the database as an array of values but at runtime it is a `Set` instance.
     */
    interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

    /**
     * The data used to update a document, for example {@link Region.update | `Region#update`}.
     * It is a distinct type from {@link Region.CreateData | `DeepPartial<Region.CreateData>`} because
     * it has different rules for `null` and `undefined`.
     */
    interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

    /**
     * The schema for {@link Region | `Region`}. This is the source of truth for how an Region document
     * must be structured.
     *
     * Foundry uses this schema to validate the structure of the {@link Region | `Region`}. For example
     * a {@link fields.StringField | `StringField`} will enforce that the value is a string. More
     * complex fields like {@link fields.SetField | `SetField`} goes through various conversions
     * starting as an array in the database, initialized as a set, and allows updates with any
     * iterable.
     */
    interface Schema extends DataSchema {
      /**
       * The Region _id which uniquely identifies it within its parent Scene
       * @defaultValue `null`
       */
      _id: fields.DocumentIdField;

      // TODO(Eon): Should label here be string or "Name"?
      /**
       * The name used to describe the Region
       */
      name: fields.StringField<{ required: true; blank: false; label: string; textSearch: true }>;

      /**
       * The color used to highlight the Region
       */
      color: fields.ColorField<{ required: true; nullable: false; initial: () => string; label: string; hint: string }>;

      /**
       * The shapes that make up the Region
       */
      shapes: fields.ArrayField<fields.TypedSchemaField<BaseShapeData.Types>>;

      /**
       * A RegionElevation object which defines the elevation levels where the Region takes effect
       * @defaultValue see properties
       */
      elevation: fields.SchemaField<
        {
          /**
           * The bottom elevation level where the Region begins to take effect
           * @remarks if bottom is `null`, it is treated as `-Infinity`
           * @defaultValue `null`
           */
          bottom: fields.NumberField<{ required: true; label: string; hint: string }>;
          /**
           * The top elevation level where the Region's effect ends
           * @remarks if top is `null`, it is treated as `Infinity`
           * @defaultValue `null`
           */
          top: fields.NumberField<{ required: true; label: string; hint: string }>;
        },
        { label: string; hint: string; validate: (d: any) => boolean; validationError: string }
      >;

      /**
       * A collection of embedded RegionBehavior objects
       */
      behaviors: fields.EmbeddedCollectionField<
        typeof foundry.documents.BaseRegionBehavior,
        RegionDocument.Implementation,
        { label: string; hint: string }
      >;

      visibility: fields.NumberField<{
        required: true;
        initial: typeof CONST.REGION_VISIBILITY.LAYER;
        choices: CONST.REGION_VISIBILITY[];
        label: string;
        hint: string;
      }>;

      locked: fields.BooleanField;

      /**
       * An object of optional key/value flags
       */
      flags: fields.ObjectField.FlagsField<"Region">;
    }

    namespace DatabaseOperation {
      /** Options passed along in Get operations for Regions */
      interface Get extends foundry.abstract.types.DatabaseGetOperation<RegionDocument.Parent> {}
      /** Options passed along in Create operations for Regions */
      interface Create<Temporary extends boolean | undefined = boolean | undefined>
        extends foundry.abstract.types.DatabaseCreateOperation<
          RegionDocument.CreateData,
          RegionDocument.Parent,
          Temporary
        > {}
      /** Options passed along in Delete operations for Regions */
      interface Delete extends foundry.abstract.types.DatabaseDeleteOperation<RegionDocument.Parent> {}
      /** Options passed along in Update operations for Regions */
      interface Update
        extends foundry.abstract.types.DatabaseUpdateOperation<RegionDocument.UpdateData, RegionDocument.Parent> {}

      /** Options for {@link Region.createDocuments | `Region.createDocuments`} */
      type CreateOperation<Temporary extends boolean | undefined = boolean | undefined> =
        Document.Database.CreateOperation<Create<Temporary>>;
      /** Options for {@link Region._preCreateOperation | `Region._preCreateOperation`} */
      type PreCreateOperationStatic = Document.Database.PreCreateOperationStatic<Create>;
      /** Options for {@link Region._preCreate | `Region#_preCreate`} */
      type PreCreateOperationInstance = Document.Database.PreCreateOperationInstance<Create>;
      /** Options for {@link Region._onCreate | `Region#_onCreate`} */
      type OnCreateOperation = Document.Database.OnCreateOperation<Create>;

      /** Options for {@link Region.updateDocuments | `Region.updateDocuments`} */
      type UpdateOperation = Document.Database.UpdateOperation<Update>;
      /** Options for {@link Region._preUpdateOperation | `Region._preUpdateOperation`} */
      type PreUpdateOperationStatic = Document.Database.PreUpdateOperationStatic<Update>;
      /** Options for {@link Region._preUpdate | `Region#_preUpdate`} */
      type PreUpdateOperationInstance = Document.Database.PreUpdateOperationInstance<Update>;
      /** Options for {@link Region._onUpdate | `Region#_onUpdate`} */
      type OnUpdateOperation = Document.Database.OnUpdateOperation<Update>;

      /** Options for {@link Region.deleteDocuments | `Region.deleteDocuments`} */
      type DeleteOperation = Document.Database.DeleteOperation<Delete>;
      /** Options for {@link Region._preDeleteOperation | `Region._preDeleteOperation`} */
      type PreDeleteOperationStatic = Document.Database.PreDeleteOperationStatic<Delete>;
      /** Options for {@link Region._preDelete | `Region#_preDelete`} */
      type PreDeleteOperationInstance = Document.Database.PreDeleteOperationInstance<Delete>;
      /** Options for {@link Region._onDelete | `Region#_onDelete`} */
      type OnDeleteOperation = Document.Database.OnDeleteOperation<Delete>;
    }

    interface RegionEvent {
      /** The name of the event */
      name: string;

      /** The data of the event */
      data: object;

      /** The Region the event was triggered on */
      region: RegionDocument;

      /** The User that triggered the event */
      user: User.Implementation;
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
          token: TokenDocument.Implementation;
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
          token: TokenDocument.Implementation;
          combatant: Combatant.Implementation;
        }
      | _EventData;

    /** @internal */
    interface _EventData {
      readonly [K: string]: Document.Any | _EventData | _EventData[];
    }

    /**
     * @deprecated - {@link RegionDocument.DatabaseOperation | `RegionDocument.DatabaseOperation`}
     */
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    interface DatabaseOperations extends Document.Database.Operations<RegionDocument> {}

    /**
     * @deprecated {@link RegionDocument.CreateData | `RegionDocument.CreateData`}
     */
    interface ConstructorData extends RegionDocument.CreateData {}

    /**
     * @deprecated {@link RegionDocument.implementation | `RegionDocument.ImplementationClass`}
     */
    type ConfiguredClass = ImplementationClass;

    /**
     * @deprecated {@link RegionDocument.Implementation | `RegionDocument.Implementation`}
     */
    type ConfiguredInstance = Implementation;
  }

  /**
   * The client-side Region document which extends the common BaseRegion model.
   */
  class RegionDocument extends ClientDocumentMixin(foundry.documents.BaseRegion) {
    /**
     * @param data    - Initial data from which to construct the `RegionDocument`
     * @param context - Construction context options
     *
     * @deprecated Constructing `RegionDocument` directly is not advised. While `new RegionDocument(...)` would create a
     * temporary document it would not respect a system's subclass of `RegionDocument`, if any.
     *
     * You should use {@link RegionDocument.implementation | `new RegionDocument.implementation(...)`} instead which
     * will give you a system specific implementation of `RegionDocument`.
     */
    constructor(...args: Document.ConstructorParameters<RegionDocument.CreateData, RegionDocument.Parent>);

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

    /*
     * After this point these are not really overridden methods.
     * They are here because they're static properties but depend on the instance and so can't be
     * defined DRY-ly while also being easily overridable.
     */

    static override defaultName(
      context: Document.DefaultNameContext<"base", Exclude<RegionDocument.Parent, null>>,
    ): string;

    static override createDialog(
      data: Document.CreateDialogData<RegionDocument.CreateData>,
      context: Document.CreateDialogContext<string, Exclude<RegionDocument.Parent, null>>,
    ): Promise<RegionDocument.Stored | null | undefined>;

    static override fromDropData(
      data: Document.DropData<RegionDocument.Implementation>,
      options?: Document.FromDropDataOptions,
    ): Promise<RegionDocument.Implementation | undefined>;

    static override fromImport(
      source: RegionDocument.Source,
      context?: Document.FromImportContext<RegionDocument.Parent>,
    ): Promise<RegionDocument.Implementation>;
  }
}
