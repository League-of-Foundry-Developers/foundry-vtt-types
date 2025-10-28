import type { InexactPartial, MaybeArray, Merge, NullishProps } from "#utils";
import type { Document, DatabaseBackend } from "#common/abstract/_module.d.mts";
import type { DataSchema } from "#common/data/fields.d.mts";
import type { BaseShapeData } from "#common/data/data.mjs";
import type BaseRegion from "#common/documents/region.mjs";
import type { Region } from "#client/canvas/placeables/_module.d.mts";
import type { DialogV2 } from "#client/applications/api/_module.d.mts";

/** @privateRemarks `ClientDatabaseBackend` only used for links */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ClientDatabaseBackend } from "#client/data/_module.d.mts";

/** @privateRemarks `ClientDocumentMixin` and `DocumentCollection` only used for links */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ClientDocumentMixin } from "#client/documents/abstract/_module.d.mts";

import fields = foundry.data.fields;

/**
 * The client-side Region document which extends the common BaseRegion model.
 */
declare class RegionDocument extends BaseRegion.Internal.CanvasDocument {
  /**
   * @param data    - Initial data from which to construct the `RegionDocument`
   * @param context - Construction context options
   */
  constructor(data: RegionDocument.CreateData, context?: RegionDocument.ConstructionContext);

  /**
   * The shapes of this Region.
   *
   * The value of this property must not be mutated.
   *
   * This property is updated only by a document update.
   * @remarks marked by foundry as readonly
   */
  get regionShapes(): foundry.data.regionShapes.RegionShape.Any[];

  /**
   * The polygons of this Region.
   *
   * The value of this property must not be mutated.
   *
   * This property is updated only by a document update.
   */
  get polygons(): ReadonlyArray<PIXI.Polygon>;

  /**
   * The polygon tree of this Region.
   *
   * The value of this property must not be mutated.
   *
   * This property is updated only by a document update.
   */
  get polygonTree(): foundry.data.regionShapes.RegionPolygonTree;

  /**
   * The Clipper paths of this Region.
   *
   * The value of this property must not be mutated.
   *
   * This property is updated only by a document update.
   */
  get clipperPaths(): ReadonlyArray<ReadonlyArray<ClipperLib.IntPoint>>;

  /**
   * The triangulation of this Region.
   *
   * The value of this property must not be mutated.
   *
   * This property is updated only by a document update.
   */
  get triangulation(): Readonly<{ vertices: Float32Array; indices: Uint16Array | Uint32Array }>;

  /**
   * The bounds of this Region.
   *
   * The value of this property must not be mutated.
   *
   * This property is updated only by a document update.
   */
  get bounds(): PIXI.Rectangle;

  /**
   * The tokens inside this region.
   * @remarks marked by foundry as `@readonly`
   */
  tokens: ReadonlySet<TokenDocument.Implementation>;

  prepareBaseData(): void;

  /**
   * Test whether the given point (at the given elevation) is inside this Region.
   * @param point - The point.
   * @returns Is this point inside this Region?
   */
  testPoint(point: foundry.canvas.Canvas.ElevatedPoint): boolean;

  /**
   * Split the movement path into its segments.
   * @param waypoints - The waypoints of movement.
   * @param samples   - The points relative to the waypoints that are tested.
   *                    Whenever one of them is inside the region, the moved object
   *                    is considered to be inside the region.
   * @returns The movement split into its segments.
   */
  segmentizeMovementPath(
    waypoints: RegionDocument.SegmentizeMovementPathWaypoint[],
    samples: foundry.canvas.Canvas.Point[],
  ): RegionDocument.MovementSegment[];

  /**
   * Teleport a Token into this Region.
   * The Token may be in the same Scene as this Region, or in a different Scene.
   * The current User must be an owner of the Token Document in order to teleport it
   * For teleportation to a different Scene the current User requires `TOKEN_CREATE` and
   * `TOKEN_DELETE` permissions. If the Token is teleported to different Scene, it is deleted
   * and a new Token Document in the other Scene is created.
   * @param token - An existing Token Document to teleport
   * @returns The same Token Document if teleported within the same Scene, or a new Token Document if teleported to a different Scene
   */
  teleportToken(token: TokenDocument.Implementation): Promise<TokenDocument.Implementation>;

  /**
   * Activate the Socket event listeners.
   * @param socket - The active game socket
   * @internal
   */
  protected static _activateSocketListeners(socket: WebSocket): void;

  /** @deprecated Foundry made this method truly private in v13 (this warning will be removed in v14) */
  protected static _updateTokens(regions: never, options?: never): never;

  // _onUpdate, _onCreateOperation, _onUpdateOperation, and _onDeleteOperation are overridden from BaseRegion without signature changes.

  /**
   * Trigger the Region event.
   * @param eventName - The event name
   * @param eventData - The event data
   * @internal
   */
  protected _triggerEvent(eventName: string, eventData: RegionDocument.EventData): Promise<void>;

  /**
   * Handle the Region event.
   * @param event - The Region event
   * @internal
   */
  protected _handleEvent(event: RegionDocument.RegionEvent): Promise<void>;

  protected override _onCreateDescendantDocuments(...args: RegionDocument.OnCreateDescendantDocumentsArgs): void;

  protected override _onUpdateDescendantDocuments(...args: RegionDocument.OnUpdateDescendantDocumentsArgs): void;

  protected override _onDeleteDescendantDocuments(...args: RegionDocument.OnDeleteDescendantDocumentsArgs): void;

  /*
   * After this point these are not really overridden methods.
   * They are here because Foundry's documents are complex and have lots of edge cases.
   * There are DRY ways of representing this but this ends up being harder to understand
   * for end users extending these functions, especially for static methods. There are also a
   * number of methods that don't make sense to call directly on `Document` like `createDocuments`,
   * as there is no data that can safely construct every possible document. Finally keeping definitions
   * separate like this helps against circularities.
   */

  // ClientDocument overrides

  protected override _preCreateDescendantDocuments(...args: RegionDocument.PreCreateDescendantDocumentsArgs): void;

  protected override _preUpdateDescendantDocuments(...args: RegionDocument.PreUpdateDescendantDocumentsArgs): void;

  protected override _preDeleteDescendantDocuments(...args: RegionDocument.PreDeleteDescendantDocumentsArgs): void;

  static override defaultName(context?: RegionDocument.DefaultNameContext): string;

  static override createDialog<
    Temporary extends boolean | undefined = boolean | undefined,
    Options extends RegionDocument.CreateDialogOptions | undefined = undefined,
  >(
    data?: RegionDocument.CreateDialogData,
    createOptions?: RegionDocument.Database2.CreateDocumentsOperation<Temporary>,
    options?: Options,
  ): Promise<RegionDocument.CreateDialogReturn<Temporary, Options>>;

  /**
   * @deprecated "The `ClientDocument.createDialog` signature has changed. It now accepts database operation options in its second
   * parameter, and options for {@linkcode DialogV2.prompt} in its third parameter." (since v13, until v15)
   *
   * @see {@linkcode RegionDocument.CreateDialogDeprecatedOptions}
   */
  static override createDialog<
    Temporary extends boolean | undefined = boolean | undefined,
    Options extends RegionDocument.CreateDialogOptions | undefined = undefined,
  >(
    data: RegionDocument.CreateDialogData,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    createOptions: RegionDocument.CreateDialogDeprecatedOptions<Temporary>,
    options?: Options,
  ): Promise<RegionDocument.CreateDialogReturn<Temporary, Options>>;

  override deleteDialog<Options extends DialogV2.ConfirmConfig | undefined = undefined>(
    options?: Options,
    operation?: RegionDocument.Database2.DeleteOneDocumentOperation,
  ): Promise<RegionDocument.DeleteDialogReturn<Options>>;

  /**
   * @deprecated "`options` is now an object containing entries supported by {@linkcode DialogV2.confirm | DialogV2.confirm}."
   * (since v13, until v15)
   *
   * @see {@linkcode Document.DeleteDialogDeprecatedConfig}
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  override deleteDialog<Options extends Document.DeleteDialogDeprecatedConfig | undefined = undefined>(
    options?: Options,
    operation?: RegionDocument.Database2.DeleteOneDocumentOperation,
  ): Promise<RegionDocument.DeleteDialogReturn<Options>>;

  static override fromDropData(data: RegionDocument.DropData): Promise<RegionDocument.Implementation | undefined>;

  static override fromImport(
    source: RegionDocument.Source,
    context?: Document.FromImportContext<RegionDocument.Parent> | null,
  ): Promise<RegionDocument.Implementation>;
  override _onClickDocumentLink(event: MouseEvent): ClientDocument.OnClickDocumentLinkReturn;

  static #RegionDocument: true;
}

declare namespace RegionDocument {
  /**
   * The document's name.
   */
  type Name = "Region";

  /**
   * The context used to create a `RegionDocument`.
   */
  interface ConstructionContext extends Document.ConstructionContext<Parent> {}

  /**
   * The documents embedded within `RegionDocument`.
   */
  type Hierarchy = Readonly<Document.HierarchyOf<Schema>>;

  /**
   * The implementation of the `RegionDocument` document instance configured through
   * {@linkcode CONFIG.Region.documentClass} in Foundry and {@linkcode DocumentClassConfig}  in fvtt-types.
   */
  type Implementation = Document.ImplementationFor<Name>;

  /**
   * The implementation of the `RegionDocument` document configured through
   * {@linkcode CONFIG.Region.documentClass} in Foundry and {@linkcode DocumentClassConfig} in fvtt-types.
   */
  type ImplementationClass = Document.ImplementationClassFor<Name>;

  /**
   * A document's metadata is special information about the document ranging anywhere from its name,
   * whether it's indexed, or to the permissions a user has over it.
   */
  interface Metadata
    extends Merge<
      Document.Metadata.Default,
      Readonly<{
        name: "Region";
        collection: "regions";
        label: string;
        labelPlural: string;
        isEmbedded: true;
        embedded: Metadata.Embedded;
        schemaVersion: string;
      }>
    > {}

  namespace Metadata {
    /**
     * The embedded metadata
     */
    interface Embedded {
      RegionBehavior: "behaviors";
    }
  }

  /**
   * A document's parent is something that can contain it.
   * For example an `Item` can be contained by an `Actor` which makes `Actor` one of its possible parents.
   */
  type Parent = Scene.Implementation | null;

  /**
   * A document's direct descendants are documents that are contained directly within its schema.
   * This is a union of all such instances, or never if the document doesn't have any descendants.
   */
  type DirectDescendant = RegionBehavior.Stored;

  /**
   * A document's direct descendants are documents that are contained directly within its schema.
   * This is a union of all such classes, or never if the document doesn't have any descendants.
   */
  type DirectDescendantClass = RegionBehavior.ImplementationClass;

  /**
   * A document's descendants are any documents that are contained within, either within its schema
   * or its descendant's schemas.
   * This is a union of all such instances, or never if the document doesn't have any descendants.
   */
  type Descendant = DirectDescendant;

  /**
   * A document's descendants are any child documents, grandchild documents, etc.
   * This is a union of all classes, or never if the document doesn't have any descendants.
   */
  type DescendantClass = DirectDescendantClass;

  /**
   * Types of `CompendiumCollection` this document might be contained in.
   * Note that `this.pack` will always return a string; this is the type for `game.packs.get(this.pack)`
   *
   * Will be `never` if cannot be contained in a `CompendiumCollection`.
   */
  type Pack = never;

  /**
   * An embedded document is a document contained in another.
   * For example an `Item` can be contained by an `Actor` which means `Item` can be embedded in `Actor`.
   *
   * If this is `never` it is because there are no embeddable documents (or there's a bug!).
   */
  type Embedded = Document.ImplementationFor<Embedded.Name>;

  namespace Embedded {
    /**
     * An embedded document is a document contained in another.
     * For example an `Item` can be contained by an `Actor` which means `Item` can be embedded in `Actor`.
     *
     * If this is `never` it is because there are no embeddable documents (or there's a bug!).
     */
    type Name = keyof Metadata.Embedded;

    /**
     * Gets the collection name for an embedded document.
     */
    type CollectionNameOf<CollectionName extends Embedded.CollectionName> = Document.Embedded.CollectionNameFor<
      Metadata.Embedded,
      CollectionName
    >;

    /**
     * Gets the collection document for an embedded document.
     */
    type DocumentFor<CollectionName extends Embedded.CollectionName> = Document.Embedded.DocumentFor<
      Metadata.Embedded,
      CollectionName
    >;

    /**
     * Gets the collection for an embedded document.
     */
    type CollectionFor<CollectionName extends Embedded.CollectionName> = Document.Embedded.CollectionFor<
      RegionDocument.Implementation,
      Metadata.Embedded,
      CollectionName
    >;

    /**
     * A valid name to refer to a collection embedded in this document. For example an `Actor`
     * has the key `"items"` which contains `Item` instance which would make both `"Item" | "Items"`
     * valid keys (amongst others).
     */
    type CollectionName = Document.Embedded.CollectionName<Metadata.Embedded>;
  }

  /**
   * The name of the world or embedded collection this document can find itself in.
   * For example an `Item` is always going to be inside a collection with a key of `items`.
   * This is a fixed string per document type and is primarily useful for the descendant Document operation methods, e.g
   * {@linkcode ClientDocumentMixin.AnyMixed._preCreateDescendantDocuments | ClientDocument._preCreateDescendantDocuments}.
   */
  type ParentCollectionName = Metadata["collection"];

  /**
   * The world collection that contains this document type. Will be `never` if none exists.
   */
  type CollectionClass = never;

  /**
   * The world collection that contains this document type. Will be `never` if none exists.
   */
  type Collection = never;

  /**
   * An instance of `Region` that comes from the database but failed validation meaning that
   * its `system` and `_source` could theoretically be anything.
   */
  type Invalid = Document.Internal.Invalid<Implementation>;

  /**
   * An instance of `Region` that comes from the database.
   */
  type Stored = Document.Internal.Stored<RegionDocument.Implementation>;

  /**
   * The data put in {@linkcode RegionDocument._source | RegionDocument#_source}. This data is what was
   * persisted to the database and therefore it must be valid JSON.
   *
   * For example a {@linkcode fields.SetField | SetField} is persisted to the database as an array
   * but initialized as a {@linkcode Set}.
   */
  interface Source extends fields.SchemaField.SourceData<Schema> {}

  /**
   * The data necessary to create a document. Used in places like {@linkcode RegionDocument.create}
   * and {@linkcode RegionDocument | new RegionDocument(...)}.
   *
   * For example a {@linkcode fields.SetField | SetField} can accept any {@linkcode Iterable}
   * with the right values. This means you can pass a `Set` instance, an array of values,
   * a generator, or any other iterable.
   */
  interface CreateData extends fields.SchemaField.CreateData<Schema> {}

  /**
   * Used in the {@linkcode RegionDocument.create} and {@linkcode RegionDocument.createDocuments} signatures, and
   * {@linkcode RegionDocument.Database2.CreateOperation} and its derivative interfaces.
   */
  type CreateInput = CreateData | Implementation;

  /**
   * The helper type for the return of {@linkcode RegionDocument.create}, returning (a single | an array of) (temporary | stored)
   * `RegionDocument`s.
   *
   * `| undefined` is included in the non-array branch because if a `.create` call with non-array data is cancelled by the `preCreate`
   * method or hook, `shift`ing the return of `.createDocuments` produces `undefined`
   */
  type CreateReturn<Data extends MaybeArray<CreateInput>, Temporary extends boolean | undefined> =
    Data extends Array<CreateInput>
      ? Array<RegionDocument.TemporaryIf<Temporary>>
      : RegionDocument.TemporaryIf<Temporary> | undefined;

  /**
   * The data after a {@linkcode Document} has been initialized, for example
   * {@linkcode RegionDocument.name | RegionDocument#name}.
   *
   * This is data transformed from {@linkcode RegionDocument.Source} and turned into more
   * convenient runtime data structures. For example a {@linkcode fields.SetField | SetField} is
   * persisted to the database as an array of values but at runtime it is a `Set` instance.
   */
  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

  /**
   * The data used to update a document, for example {@linkcode RegionDocument.update | RegionDocument#update}.
   * It is a distinct type from {@linkcode RegionDocument.CreateData | DeepPartial<RegionDocument.CreateData>} because
   * it has different rules for `null` and `undefined`.
   */
  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  /**
   * Used in the {@linkcode RegionDocument.update | RegionDocument#update} and
   * {@linkcode RegionDocument.updateDocuments} signatures, and {@linkcode RegionDocument.Database2.UpdateOperation}
   * and its derivative interfaces.
   */
  type UpdateInput = UpdateData | Implementation;

  /**
   * The schema for {@linkcode RegionDocument}. This is the source of truth for how an RegionDocument document
   * must be structured.
   *
   * Foundry uses this schema to validate the structure of the {@linkcode RegionDocument}. For example
   * a {@linkcode fields.StringField | StringField} will enforce that the value is a string. More
   * complex fields like {@linkcode fields.SetField | SetField} goes through various conversions
   * starting as an array in the database, initialized as a set, and allows updates with any
   * iterable.
   */
  interface Schema extends DataSchema {
    /**
     * The Region _id which uniquely identifies it within its parent Scene
     * @defaultValue `null`
     */
    _id: fields.DocumentIdField;

    /**
     * The name used to describe the Region
     */
    name: fields.StringField<{ required: true; blank: false; textSearch: true }>;

    /**
     * The color used to highlight the Region
     * @defaultValue `Color.fromHSV([Math.random(), 0.8, 0.8]).css`
     */
    color: fields.ColorField<{
      required: true;
      nullable: false;
      initial: () => string;
    }>;

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
        bottom: fields.NumberField<{
          required: true;
        }>;

        /**
         * The top elevation level where the Region's effect ends
         * @remarks if top is `null`, it is treated as `Infinity`
         * @defaultValue `null`
         */
        top: fields.NumberField<{
          required: true;
        }>;
      },
      {
        validate: (d: unknown) => boolean;
        validationError: "elevation.top may not be less than elevation.bottom";
      }
    >;

    /**
     * A collection of embedded RegionBehavior objects
     */
    behaviors: fields.EmbeddedCollectionField<
      typeof foundry.documents.BaseRegionBehavior,
      RegionDocument.Implementation
    >;

    /** @defaultValue `CONST.REGION_VISIBILITY.LAYER` */
    visibility: fields.NumberField<
      {
        required: true;
        initial: typeof CONST.REGION_VISIBILITY.LAYER;
        choices: CONST.REGION_VISIBILITY[];
      },
      CONST.REGION_VISIBILITY | null | undefined,
      CONST.REGION_VISIBILITY | null,
      CONST.REGION_VISIBILITY | null
    >;

    /** @defaultValue `false` */
    locked: fields.BooleanField;

    /**
     * An object of optional key/value flags
     */
    flags: fields.DocumentFlagsField<Name>;
  }

  namespace Database2 {
    /* ***********************************************
     *                GET OPERATIONS                 *
     *************************************************/

    /**
     * A base (no property omission or optionality changes) {@linkcode DatabaseBackend.GetOperation | GetOperation} interface for
     * `RegionDocument` documents. Valid for passing to
     * {@linkcode ClientDatabaseBackend._getDocuments | ClientDatabaseBackend#_getDocuments}.
     *
     * The {@linkcode GetDocumentsOperation} and {@linkcode BackendGetOperation} interfaces derive from this one.
     */
    interface GetOperation extends DatabaseBackend.GetOperation<RegionDocument.Parent> {}

    /**
     * The interface for passing to {@linkcode RegionDocument.get}.
     * @see {@linkcode Document.Database2.GetDocumentsOperation}
     */
    interface GetDocumentsOperation extends Document.Database2.GetDocumentsOperation<GetOperation> {}

    /**
     * The interface for passing to {@linkcode DatabaseBackend.get | DatabaseBackend#get} for `RegionDocument` documents.
     * @see {@linkcode Document.Database2.BackendGetOperation}
     */
    interface BackendGetOperation extends Document.Database2.BackendGetOperation<GetOperation> {}

    /* ***********************************************
     *              CREATE OPERATIONS                *
     *************************************************/

    /**
     * A base (no property omission or optionality changes) {@linkcode DatabaseBackend.CreateOperation | DatabaseCreateOperation}
     * interface for `RegionDocument` documents.
     *
     * See {@linkcode DatabaseBackend.CreateOperation} for more information on this family of interfaces.
     *
     * @remarks This interface was previously typed for passing to {@linkcode RegionDocument.create}. The new name for that
     * interface is {@linkcode CreateDocumentsOperation}.
     */
    interface CreateOperation<Temporary extends boolean | undefined = boolean | undefined>
      extends DatabaseBackend.CreateOperation<RegionDocument.CreateInput, RegionDocument.Parent, Temporary> {}

    /**
     * The interface for passing to {@linkcode RegionDocument.create} or {@linkcode RegionDocument.createDocuments}.
     * @see {@linkcode Document.Database2.CreateDocumentsOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode CreateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.CreateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface CreateDocumentsOperation<Temporary extends boolean | undefined = boolean | undefined>
      extends Document.Database2.CreateDocumentsOperation<CreateOperation<Temporary>> {}

    /**
     * The interface for passing to the {@linkcode Document.createEmbeddedDocuments | #createEmbeddedDocuments} method of any Documents that
     * can contain `RegionDocument` documents. (see {@linkcode RegionDocument.Parent})
     * @see {@linkcode Document.Database2.CreateEmbeddedOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode CreateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.CreateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface CreateEmbeddedOperation extends Document.Database2.CreateEmbeddedOperation<CreateOperation> {}

    /**
     * The interface for passing to {@linkcode DatabaseBackend.create | DatabaseBackend#create} for `RegionDocument` documents.
     * @see {@linkcode Document.Database2.BackendCreateOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode CreateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.CreateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface BackendCreateOperation<Temporary extends boolean | undefined = boolean | undefined>
      extends Document.Database2.BackendCreateOperation<CreateOperation<Temporary>> {}

    /**
     * The interface passed to {@linkcode RegionDocument._preCreate | RegionDocument#_preCreate} and
     * {@link Hooks.PreCreateDocument | the `preCreateRegionDocument` hook}.
     * @see {@linkcode Document.Database2.PreCreateOptions}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode CreateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.CreateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface PreCreateOptions<Temporary extends boolean | undefined = boolean | undefined>
      extends Document.Database2.PreCreateOptions<CreateOperation<Temporary>> {}

    /**
     * The interface passed to {@linkcode RegionDocument._preCreateOperation}.
     * @see {@linkcode Document.Database2.PreCreateOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode CreateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.CreateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface PreCreateOperation<Temporary extends boolean | undefined = boolean | undefined>
      extends Document.Database2.PreCreateOperation<CreateOperation<Temporary>> {}

    /**
     * @deprecated The interface passed to {@linkcode RegionDocument._onCreateDocuments}. It will be removed in v14 along with the
     * method it is for.
     * @see {@linkcode Document.Database2.OnCreateDocumentsOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode CreateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.CreateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface OnCreateDocumentsOperation<Temporary extends boolean | undefined = boolean | undefined>
      extends Document.Database2.OnCreateDocumentsOperation<CreateOperation<Temporary>> {}

    /**
     * The interface passed to {@linkcode RegionDocument._onCreate | RegionDocument#_onCreate} and
     * {@link Hooks.CreateDocument | the `createRegionDocument` hook}.
     * @see {@linkcode Document.Database2.OnCreateOptions}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode CreateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.CreateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface OnCreateOptions extends Document.Database2.OnCreateOptions<CreateOperation> {}

    /**
     * The interface passed to {@linkcode RegionDocument._onCreateOperation} and `RegionDocument`-related collections'
     * `#_onModifyContents` methods.
     * @see {@linkcode Document.Database2.OnCreateOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode CreateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.CreateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface OnCreateOperation extends Document.Database2.OnCreateOperation<CreateOperation> {}

    /* ***********************************************
     *              UPDATE OPERATIONS                *
     *************************************************/

    /**
     * A base (no property omission or optionality changes) {@linkcode DatabaseBackend.UpdateOperation | DatabaseUpdateOperation}
     * interface for `RegionDocument` documents.
     *
     * See {@linkcode DatabaseBackend.UpdateOperation} for more information on this family of interfaces.
     *
     * @remarks This interface was previously typed for passing to {@linkcode RegionDocument.update | RegionDocument#update}.
     * The new name for that interface is {@linkcode UpdateOneDocumentOperation}.
     */
    interface UpdateOperation
      extends DatabaseBackend.UpdateOperation<RegionDocument.UpdateInput, RegionDocument.Parent> {}

    /**
     * The interface for passing to {@linkcode RegionDocument.update | RegionDocument#update}.
     * @see {@linkcode Document.Database2.UpdateOneDocumentOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode UpdateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.UpdateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface UpdateOneDocumentOperation extends Document.Database2.UpdateOneDocumentOperation<UpdateOperation> {}

    /**
     * The interface for passing to the {@linkcode Document.updateEmbeddedDocuments | #updateEmbeddedDocuments} method of any Documents that
     * can contain `RegionDocument` documents (see {@linkcode RegionDocument.Parent}). This interface is just an alias
     * for {@linkcode UpdateOneDocumentOperation}, as the same keys are provided by the method in both cases.
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode UpdateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.UpdateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface UpdateEmbeddedOperation extends UpdateOneDocumentOperation {}

    /**
     * The interface for passing to {@linkcode RegionDocument.updateDocuments}.
     * @see {@linkcode Document.Database2.UpdateManyDocumentsOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode UpdateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.UpdateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface UpdateManyDocumentsOperation extends Document.Database2.UpdateManyDocumentsOperation<UpdateOperation> {}

    /**
     * The interface for passing to {@linkcode DatabaseBackend.update | DatabaseBackend#update} for `RegionDocument` documents.
     * @see {@linkcode Document.Database2.BackendUpdateOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode UpdateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.UpdateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface BackendUpdateOperation extends Document.Database2.BackendUpdateOperation<UpdateOperation> {}

    /**
     * The interface passed to {@linkcode RegionDocument._preUpdate | RegionDocument#_preUpdate} and
     * {@link Hooks.PreUpdateDocument | the `preUpdateRegionDocument` hook}.
     * @see {@linkcode Document.Database2.PreUpdateOptions}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode UpdateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.UpdateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface PreUpdateOptions extends Document.Database2.PreUpdateOptions<UpdateOperation> {}

    /**
     * The interface passed to {@linkcode RegionDocument._preUpdateOperation}.
     * @see {@linkcode Document.Database2.PreUpdateOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode UpdateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.UpdateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface PreUpdateOperation extends Document.Database2.PreUpdateOperation<UpdateOperation> {}

    /**
     * @deprecated The interface passed to {@linkcode RegionDocument._onUpdateDocuments}. It will be removed in v14 along with the
     * method it is for.
     * @see {@linkcode Document.Database2.OnUpdateDocumentsOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode UpdateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.UpdateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface OnUpdateDocumentsOperation extends Document.Database2.OnUpdateDocumentsOperation<UpdateOperation> {}

    /**
     * The interface passed to {@linkcode RegionDocument._onUpdate | RegionDocument#_onUpdate} and
     * {@link Hooks.UpdateDocument | the `updateRegionDocument` hook}.
     * @see {@linkcode Document.Database2.OnUpdateOptions}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode UpdateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.UpdateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface OnUpdateOptions extends Document.Database2.OnUpdateOptions<UpdateOperation> {}

    /**
     * The interface passed to {@linkcode RegionDocument._onUpdateOperation} and `RegionDocument`-related collections'
     * `#_onModifyContents` methods.
     * @see {@linkcode Document.Database2.OnUpdateOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode UpdateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.UpdateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface OnUpdateOperation extends Document.Database2.OnUpdateOperation<UpdateOperation> {}

    /* ***********************************************
     *              DELETE OPERATIONS                *
     *************************************************/

    /**
     * A base (no property omission or optionality changes) {@linkcode DatabaseBackend.DeleteOperation | DatabaseDeleteOperation}
     * interface for `RegionDocument` documents.
     *
     * See {@linkcode DatabaseBackend.DeleteOperation} for more information on this family of interfaces.
     *
     * @remarks This interface was previously typed for passing to {@linkcode RegionDocument.delete | RegionDocument#delete}.
     * The new name for that interface is {@linkcode DeleteOneDocumentOperation}.
     */
    interface DeleteOperation extends DatabaseBackend.DeleteOperation<RegionDocument.Parent> {}

    /**
     * The interface for passing to {@linkcode RegionDocument.delete | RegionDocument#delete}.
     * @see {@linkcode Document.Database2.DeleteOneDocumentOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode DeleteOperation} for this Document or the
     * root {@linkcode DatabaseBackend.DeleteOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface DeleteOneDocumentOperation extends Document.Database2.DeleteOneDocumentOperation<DeleteOperation> {}

    /**
     * The interface for passing to the {@linkcode Document.deleteEmbeddedDocuments | #deleteEmbeddedDocuments} method of any Documents that
     * can contain `RegionDocument` documents (see {@linkcode RegionDocument.Parent}). This interface is just an alias
     * for {@linkcode DeleteOneDocumentOperation}, as the same keys are provided by the method in both cases.
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode DeleteOperation} for this Document or the
     * root {@linkcode DatabaseBackend.DeleteOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface DeleteEmbeddedOperation extends DeleteOneDocumentOperation {}

    /**
     * The interface for passing to {@linkcode RegionDocument.deleteDocuments}.
     * @see {@linkcode Document.Database2.DeleteManyDocumentsOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode DeleteOperation} for this Document or the
     * root {@linkcode DatabaseBackend.DeleteOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface DeleteManyDocumentsOperation extends Document.Database2.DeleteManyDocumentsOperation<DeleteOperation> {}

    /**
     * The interface for passing to {@linkcode DatabaseBackend.delete | DatabaseBackend#delete} for `RegionDocument` documents.
     * @see {@linkcode Document.Database2.BackendDeleteOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode DeleteOperation} for this Document or the
     * root {@linkcode DatabaseBackend.DeleteOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface BackendDeleteOperation extends Document.Database2.BackendDeleteOperation<DeleteOperation> {}

    /**
     * The interface passed to {@linkcode RegionDocument._preDelete | RegionDocument#_preDelete} and
     * {@link Hooks.PreDeleteDocument | the `preDeleteRegionDocument` hook}.
     * @see {@linkcode Document.Database2.PreDeleteOptions}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode DeleteOperation} for this Document or the
     * root {@linkcode DatabaseBackend.DeleteOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface PreDeleteOptions extends Document.Database2.PreDeleteOptions<DeleteOperation> {}

    /**
     * The interface passed to {@linkcode RegionDocument._preDeleteOperation}.
     * @see {@linkcode Document.Database2.PreDeleteOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode DeleteOperation} for this Document or the
     * root {@linkcode DatabaseBackend.DeleteOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface PreDeleteOperation extends Document.Database2.PreDeleteOperation<DeleteOperation> {}

    /**
     * @deprecated The interface passed to {@linkcode RegionDocument._onDeleteDocuments}. It will be removed in v14 along with the
     * method it is for.
     * @see {@linkcode Document.Database2.OnDeleteDocumentsOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode DeleteOperation} for this Document or the
     * root {@linkcode DatabaseBackend.DeleteOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface OnDeleteDocumentsOperation extends Document.Database2.OnDeleteDocumentsOperation<DeleteOperation> {}

    /**
     * The interface passed to {@linkcode RegionDocument._onDelete | RegionDocument#_onDelete} and
     * {@link Hooks.DeleteDocument | the `deleteRegionDocument` hook}.
     * @see {@linkcode Document.Database2.OnDeleteOptions}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode DeleteOperation} for this Document or the
     * root {@linkcode DatabaseBackend.DeleteOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface OnDeleteOptions extends Document.Database2.OnDeleteOptions<DeleteOperation> {}

    /**
     * The interface passed to {@linkcode RegionDocument._onDeleteOperation} and `RegionDocument`-related collections'
     * `#_onModifyContents` methods.
     * @see {@linkcode Document.Database2.OnDeleteOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode DeleteOperation} for this Document or the
     * root {@linkcode DatabaseBackend.DeleteOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface OnDeleteOperation extends Document.Database2.OnDeleteOperation<DeleteOperation> {}

    namespace Internal {
      interface OperationNameMap<Temporary extends boolean | undefined = boolean | undefined> {
        GetDocumentsOperation: RegionDocument.Database2.GetDocumentsOperation;
        BackendGetOperation: RegionDocument.Database2.BackendGetOperation;
        GetOperation: RegionDocument.Database2.GetOperation;

        CreateDocumentsOperation: RegionDocument.Database2.CreateDocumentsOperation<Temporary>;
        CreateEmbeddedOperation: RegionDocument.Database2.CreateEmbeddedOperation;
        BackendCreateOperation: RegionDocument.Database2.BackendCreateOperation<Temporary>;
        CreateOperation: RegionDocument.Database2.CreateOperation<Temporary>;
        PreCreateOptions: RegionDocument.Database2.PreCreateOptions<Temporary>;
        PreCreateOperation: RegionDocument.Database2.PreCreateOperation<Temporary>;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        OnCreateDocumentsOperation: RegionDocument.Database2.OnCreateDocumentsOperation<Temporary>;
        OnCreateOptions: RegionDocument.Database2.OnCreateOptions;
        OnCreateOperation: RegionDocument.Database2.OnCreateOperation;

        UpdateOneDocumentOperation: RegionDocument.Database2.UpdateOneDocumentOperation;
        UpdateEmbeddedOperation: RegionDocument.Database2.UpdateEmbeddedOperation;
        UpdateManyDocumentsOperation: RegionDocument.Database2.UpdateManyDocumentsOperation;
        BackendUpdateOperation: RegionDocument.Database2.BackendUpdateOperation;
        UpdateOperation: RegionDocument.Database2.UpdateOperation;
        PreUpdateOptions: RegionDocument.Database2.PreUpdateOptions;
        PreUpdateOperation: RegionDocument.Database2.PreUpdateOperation;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        OnUpdateDocumentsOperation: RegionDocument.Database2.OnUpdateDocumentsOperation;
        OnUpdateOptions: RegionDocument.Database2.OnUpdateOptions;
        OnUpdateOperation: RegionDocument.Database2.OnUpdateOperation;

        DeleteOneDocumentOperation: RegionDocument.Database2.DeleteOneDocumentOperation;
        DeleteEmbeddedOperation: RegionDocument.Database2.DeleteEmbeddedOperation;
        DeleteManyDocumentsOperation: RegionDocument.Database2.DeleteManyDocumentsOperation;
        BackendDeleteOperation: RegionDocument.Database2.BackendDeleteOperation;
        DeleteOperation: RegionDocument.Database2.DeleteOperation;
        PreDeleteOptions: RegionDocument.Database2.PreDeleteOptions;
        PreDeleteOperation: RegionDocument.Database2.PreDeleteOperation;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        OnDeleteDocumentsOperation: RegionDocument.Database2.OnDeleteDocumentsOperation;
        OnDeleteOptions: RegionDocument.Database2.OnDeleteOptions;
        OnDeleteOperation: RegionDocument.Database2.OnDeleteOperation;
      }
    }

    /* ***********************************************
     *             DocsV2 DEPRECATIONS               *
     *************************************************/

    /** @deprecated Use {@linkcode GetOperation} instead. This type will be removed in v14.  */
    type Get = GetOperation;

    /** @deprecated Use {@linkcode GetDocumentsOperation} instead. This type will be removed in v14.  */
    type GetOptions = GetDocumentsOperation;

    /** @deprecated Use {@linkcode CreateOperation} instead. This type will be removed in v14.  */
    type Create<Temporary extends boolean | undefined> = CreateOperation<Temporary>;

    /** @deprecated Use {@linkcode UpdateOperation} instead. This type will be removed in v14.  */
    type Update = UpdateOperation;

    /** @deprecated Use {@linkcode DeleteOperation} instead. This type will be removed in v14.  */
    type Delete = DeleteOperation;

    // CreateDocumentsOperation didn't change purpose or name

    /** @deprecated Use {@linkcode UpdateManyDocumentsOperation} instead. This type will be removed in v14 */
    type UpdateDocumentsOperation = UpdateManyDocumentsOperation;

    /** @deprecated Use {@linkcode DeleteManyDocumentsOperation} instead. This type will be removed in v14 */
    type DeleteDocumentsOperation = DeleteManyDocumentsOperation;

    // PreCreateOptions didn't change purpose or name

    // OnCreateOptions didn't change purpose or name

    // PreCreateOperation didn't change purpose or name

    // OnCreateOperation didn't change purpose or name

    // PreUpdateOptions didn't change purpose or name

    // OnUpdateOptions didn't change purpose or name

    // PreUpdateOperation didn't change purpose or name

    // OnUpdateOperation didn't change purpose or name

    // PreDeleteOptions didn't change purpose or name

    // OnDeleteOptions didn't change purpose or name

    // PreDeleteOperation didn't change purpose or name

    // OnDeleteOperation didn't change purpose or name

    /** @deprecated Use {@linkcode OnCreateDocumentsOperation} instead. This type will be removed in v14 */
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    type OnCreateDocumentsContext = OnCreateDocumentsOperation;

    /** @deprecated Use {@linkcode OnUpdateDocumentsOperation} instead. This type will be removed in v14 */
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    type OnUpdateDocumentsContext = OnUpdateDocumentsOperation;

    /** @deprecated Use {@linkcode OnDeleteOptions} instead. This type will be removed in v14 */
    type DeleteOptions = OnDeleteOptions;

    /** @deprecated Use {@linkcode OnCreateOptions} instead. This type will be removed in v14 */
    type CreateOptions = OnCreateOptions;

    /** @deprecated Use {@linkcode OnUpdateOptions} instead. This type will be removed in v14 */
    type UpdateOptions = OnUpdateOptions;

    /** @deprecated Use {@linkcode OnDeleteDocumentsOperation} instead. This type will be removed in v14 */
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    type DeleteDocumentsContext = OnDeleteDocumentsOperation;

    /** @deprecated use {@linkcode CreateDocumentsOperation} instead. This type will be removed in v14. */
    type DialogCreateOptions = CreateDocumentsOperation;
  }

  /**
   * If `Temporary` is true then {@linkcode RegionDocument.Implementation}, otherwise {@linkcode RegionDocument.Stored}.
   */
  type TemporaryIf<Temporary extends boolean | undefined> =
    true extends Extract<Temporary, true> ? RegionDocument.Implementation : RegionDocument.Stored;

  namespace Database {
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

    /** Operation for {@linkcode RegionDocument.createDocuments} */
    interface CreateDocumentsOperation<Temporary extends boolean | undefined>
      extends Document.Database.CreateDocumentsOperation<RegionDocument.Database.Create<Temporary>> {}

    /** Operation for {@linkcode RegionDocument.updateDocuments} */
    interface UpdateDocumentsOperation
      extends Document.Database.UpdateDocumentsOperation<RegionDocument.Database.Update> {}

    /** Operation for {@linkcode RegionDocument.deleteDocuments} */
    interface DeleteDocumentsOperation
      extends Document.Database.DeleteDocumentsOperation<RegionDocument.Database.Delete> {}

    /** Operation for {@linkcode RegionDocument.create} */
    interface CreateOperation<Temporary extends boolean | undefined>
      extends Document.Database.CreateDocumentsOperation<RegionDocument.Database.Create<Temporary>> {}

    /** Operation for {@link RegionDocument.update | `RegionDocument#update`} */
    interface UpdateOperation extends Document.Database.UpdateOperation<Update> {}

    interface DeleteOperation extends Document.Database.DeleteOperation<Delete> {}

    /** Options for {@linkcode RegionDocument.get} */
    interface GetOptions extends Document.Database.GetOptions {}

    /** Options for {@link RegionDocument._preCreate | `RegionDocument#_preCreate`} */
    interface PreCreateOptions extends Document.Database.PreCreateOptions<Create> {}

    /** Options for {@link RegionDocument._onCreate | `RegionDocument#_onCreate`} */
    interface OnCreateOptions extends Document.Database.CreateOptions<Create> {}

    /** Operation for {@linkcode RegionDocument._preCreateOperation} */
    interface PreCreateOperation extends Document.Database.PreCreateOperationStatic<RegionDocument.Database.Create> {}

    /** Operation for {@link RegionDocument._onCreateOperation | `RegionDocument#_onCreateOperation`} */
    interface OnCreateOperation extends RegionDocument.Database.Create {}

    /** Options for {@link RegionDocument._preUpdate | `RegionDocument#_preUpdate`} */
    interface PreUpdateOptions extends Document.Database.PreUpdateOptions<Update> {}

    /** Options for {@link RegionDocument._onUpdate | `RegionDocument#_onUpdate`} */
    interface OnUpdateOptions extends Document.Database.UpdateOptions<Update> {}

    /** Operation for {@linkcode RegionDocument._preUpdateOperation} */
    interface PreUpdateOperation extends RegionDocument.Database.Update {}

    /** Operation for {@link RegionDocument._onUpdateOperation | `RegionDocument._preUpdateOperation`} */
    interface OnUpdateOperation extends RegionDocument.Database.Update {}

    /** Options for {@link RegionDocument._preDelete | `RegionDocument#_preDelete`} */
    interface PreDeleteOptions extends Document.Database.PreDeleteOperationInstance<Delete> {}

    /** Options for {@link RegionDocument._onDelete | `RegionDocument#_onDelete`} */
    interface OnDeleteOptions extends Document.Database.DeleteOptions<Delete> {}

    /** Options for {@link RegionDocument._preDeleteOperation | `RegionDocument#_preDeleteOperation`} */
    interface PreDeleteOperation extends RegionDocument.Database.Delete {}

    /** Options for {@link RegionDocument._onDeleteOperation | `RegionDocument#_onDeleteOperation`} */
    interface OnDeleteOperation extends RegionDocument.Database.Delete {}

    /** Context for {@linkcode RegionDocument._onDeleteOperation} */
    interface OnDeleteDocumentsContext extends Document.ModificationContext<RegionDocument.Parent> {}

    /** Context for {@linkcode RegionDocument._onCreateDocuments} */
    interface OnCreateDocumentsContext extends Document.ModificationContext<RegionDocument.Parent> {}

    /** Context for {@linkcode RegionDocument._onUpdateDocuments} */
    interface OnUpdateDocumentsContext extends Document.ModificationContext<RegionDocument.Parent> {}

    /**
     * Options for {@link RegionDocument._preCreateDescendantDocuments | `RegionDocument#_preCreateDescendantDocuments`}
     * and {@link RegionDocument._onCreateDescendantDocuments | `RegionDocument#_onCreateDescendantDocuments`}
     */
    interface CreateOptions extends Document.Database.CreateOptions<RegionDocument.Database.Create> {}

    /**
     * Options for {@link RegionDocument._preUpdateDescendantDocuments | `RegionDocument#_preUpdateDescendantDocuments`}
     * and {@link RegionDocument._onUpdateDescendantDocuments | `RegionDocument#_onUpdateDescendantDocuments`}
     */
    interface UpdateOptions extends Document.Database.UpdateOptions<RegionDocument.Database.Update> {}

    /**
     * Options for {@link RegionDocument._preDeleteDescendantDocuments | `RegionDocument#_preDeleteDescendantDocuments`}
     * and {@link RegionDocument._onDeleteDescendantDocuments | `RegionDocument#_onDeleteDescendantDocuments`}
     */
    interface DeleteOptions extends Document.Database.DeleteOptions<RegionDocument.Database.Delete> {}

    /**
     * Create options for {@linkcode RegionDocument.createDialog}.
     */
    interface DialogCreateOptions extends InexactPartial<Create> {}
  }

  /**
   * The flags that are available for this document in the form `{ [scope: string]: { [key: string]: unknown } }`.
   */
  interface Flags extends Document.Internal.ConfiguredFlagsForName<Name> {}

  namespace Flags {
    /**
     * The valid scopes for the flags on this document e.g. `"core"` or `"dnd5e"`.
     */
    type Scope = Document.Internal.FlagKeyOf<Flags>;

    /**
     * The valid keys for a certain scope for example if the scope is "core" then a valid key may be `"sheetLock"` or `"viewMode"`.
     */
    type Key<Scope extends Flags.Scope> = Document.Internal.FlagKeyOf<Document.Internal.FlagGetKey<Flags, Scope>>;

    /**
     * Gets the type of a particular flag given a `Scope` and a `Key`.
     */
    type Get<Scope extends Flags.Scope, Key extends Flags.Key<Scope>> = Document.Internal.GetFlag<Flags, Scope, Key>;
  }

  /* ***********************************************
   *       CLIENT DOCUMENT TEMPLATE TYPES          *
   *************************************************/

  /** The interface {@linkcode RegionDocument.fromDropData} receives */
  interface DropData extends Document.Internal.DropData<Name> {}

  /**
   * @deprecated Foundry prior to v13 had a completely unused `options` parameter in the {@linkcode RegionDocument.fromDropData}
   * signature that has since been removed. This type will be removed in v14.
   */
  type DropDataOptions = never;

  /**
   * The interface for passing to {@linkcode RegionDocument.defaultName}
   * @see {@linkcode Document.DefaultNameContext}
   */
  interface DefaultNameContext extends Document.DefaultNameContext<Name, Parent> {}

  /**
   * The interface for passing to {@linkcode RegionDocument.createDialog}'s first parameter
   * @see {@linkcode Document.CreateDialogData}
   */
  interface CreateDialogData extends Document.CreateDialogData<CreateData> {}

  /**
   * @deprecated This is for a deprecated signature, and will be removed in v15.
   * The interface for passing to {@linkcode RegionDocument.createDialog}'s second parameter that still includes partial Dialog
   * options, instead of being purely a {@linkcode Database2.CreateDocumentsOperation | CreateDocumentsOperation}.
   */
  interface CreateDialogDeprecatedOptions<Temporary extends boolean | undefined = boolean | undefined>
    extends Database2.CreateDocumentsOperation<Temporary>,
      Document._PartialDialogV1OptionsForCreateDialog {}

  /**
   * The interface for passing to {@linkcode RegionDocument.createDialog}'s third parameter
   * @see {@linkcode Document.CreateDialogOptions}
   */
  interface CreateDialogOptions extends Document.CreateDialogOptions<Name> {}

  /**
   * The return type for {@linkcode RegionDocument.createDialog}.
   * @see {@linkcode Document.CreateDialogReturn}
   */
  // TODO: inline .Stored in v14 instead of taking Temporary
  type CreateDialogReturn<
    Temporary extends boolean | undefined,
    PassedConfig extends RegionDocument.CreateDialogOptions | undefined,
  > = Document.CreateDialogReturn<RegionDocument.TemporaryIf<Temporary>, PassedConfig>;

  /**
   * The return type for {@linkcode RegionDocument.deleteDialog | RegionDocument#deleteDialog}.
   * @see {@linkcode Document.DeleteDialogReturn}
   */
  type DeleteDialogReturn<PassedConfig extends DialogV2.ConfirmConfig | undefined> = Document.DeleteDialogReturn<
    RegionDocument.Stored,
    PassedConfig
  >;

  type PreCreateDescendantDocumentsArgs = Document.PreCreateDescendantDocumentsArgs<
    RegionDocument.Stored,
    RegionDocument.DirectDescendant,
    RegionDocument.Metadata.Embedded
  >;

  type OnCreateDescendantDocumentsArgs = Document.OnCreateDescendantDocumentsArgs<
    RegionDocument.Stored,
    RegionDocument.DirectDescendant,
    RegionDocument.Metadata.Embedded
  >;

  type PreUpdateDescendantDocumentsArgs = Document.PreUpdateDescendantDocumentsArgs<
    RegionDocument.Stored,
    RegionDocument.DirectDescendant,
    RegionDocument.Metadata.Embedded
  >;

  type OnUpdateDescendantDocumentsArgs = Document.OnUpdateDescendantDocumentsArgs<
    RegionDocument.Stored,
    RegionDocument.DirectDescendant,
    RegionDocument.Metadata.Embedded
  >;

  type PreDeleteDescendantDocumentsArgs = Document.PreDeleteDescendantDocumentsArgs<
    RegionDocument.Stored,
    RegionDocument.DirectDescendant,
    RegionDocument.Metadata.Embedded
  >;

  type OnDeleteDescendantDocumentsArgs = Document.OnDeleteDescendantDocumentsArgs<
    RegionDocument.Stored,
    RegionDocument.DirectDescendant,
    RegionDocument.Metadata.Embedded
  >;

  /* ***********************************************
   *            REGION-SPECIFIC TYPES              *
   *************************************************/

  // TODO: <Data extends object>
  interface RegionEvent {
    /** The name of the event */
    name: string;

    /** The data of the event */
    data: object;

    /** The Region the event was triggered on */
    region: RegionDocument.Implementation;

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

  /** @internal */
  type _UpdateTokensOptions = NullishProps<{
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
  }>;

  interface UpdateTokensOptions extends _UpdateTokensOptions {}

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
        segments: Region.MovementSegment[];
      }
    | {
        token: TokenDocument.Implementation;
        combatant: Combatant.Implementation;
      }
    | _EventData;

  /** @internal */
  interface _EventData {
    readonly [K: string]: Document.Any | MaybeArray<_EventData>;
  }

  interface SegmentizeMovementPathWaypoint {
    /** The x-coordinate in pixels (integer). */
    x: number;

    /** The y-coordinate in pixels (integer). */
    y: number;

    /** The elevation in grid units. */
    elevation: number;

    /**
     * Teleport from the previous to this waypoint?
     * @defaultValue `false`.
     */
    teleport?: boolean | undefined;
  }

  interface MovementSegment {
    /** The type of this segment (see {@linkcode CONST.REGION_MOVEMENT_SEGMENTS}). */
    type: CONST.REGION_MOVEMENT_SEGMENTS;

    /** The waypoint that this segment starts from. */
    from: foundry.canvas.Canvas.ElevatedPoint;

    /** The waypoint that this segment goes to. */
    to: foundry.canvas.Canvas.ElevatedPoint;

    /** Teleport between the waypoints? */
    teleport: boolean;
  }

  /**
   * The arguments to construct the document.
   *
   * @deprecated Writing the signature directly has helped reduce circularities and therefore is
   * now recommended.
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  type ConstructorArgs = Document.ConstructorParameters<CreateData, Parent>;
}

export default RegionDocument;
