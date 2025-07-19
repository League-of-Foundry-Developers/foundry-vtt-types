import type { InexactPartial, Merge, NullishProps } from "#utils";
import type Document from "#common/abstract/document.d.mts";
import type { DataSchema } from "#common/data/fields.d.mts";
import type { BaseShapeData } from "#common/data/data.mjs";
import type BaseRegion from "#common/documents/region.mjs";
import type { Region } from "#client/canvas/placeables/_module.d.mts";

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

  /**
   * @remarks To make it possible for narrowing one parameter to jointly narrow other parameters
   * this method must be overridden like so:
   * ```typescript
   * class GurpsRegionDocument extends RegionDocument {
   *   protected override _onCreateDescendantDocuments(...args: RegionDocument.OnCreateDescendantDocumentsArgs) {
   *     super._onCreateDescendantDocuments(...args);
   *
   *     const [parent, collection, documents, data, options, userId] = args;
   *     if (collection === "behaviors") {
   *         options; // Will be narrowed.
   *     }
   *   }
   * }
   * ```
   */
  protected override _onCreateDescendantDocuments(...args: RegionDocument.OnCreateDescendantDocumentsArgs): void;

  /**
   * @remarks To make it possible for narrowing one parameter to jointly narrow other parameters
   * this method must be overridden like so:
   * ```typescript
   * class Ptr2eRegionDocument extends RegionDocument {
   *   protected override _onUpdateDescendantDocuments(...args: RegionDocument.OnUpdateDescendantDocumentsArgs) {
   *     super._onUpdateDescendantDocuments(...args);
   *
   *     const [parent, collection, documents, changes, options, userId] = args;
   *     if (collection === "behaviors") {
   *         options; // Will be narrowed.
   *     }
   *   }
   * }
   * ```
   */
  protected override _onUpdateDescendantDocuments(...args: RegionDocument.OnUpdateDescendantDocumentsArgs): void;

  /**
   * @remarks To make it possible for narrowing one parameter to jointly narrow other parameters
   * this method must be overridden like so:
   * ```typescript
   * class BladesRegionDocument extends RegionDocument {
   *   protected override _onDeleteDescendantDocuments(...args: RegionDocument.OnUpdateDescendantDocuments) {
   *     super._onDeleteDescendantDocuments(...args);
   *
   *     const [parent, collection, documents, ids, options, userId] = args;
   *     if (collection === "behaviors") {
   *         options; // Will be narrowed.
   *     }
   *   }
   * }
   * ```
   */
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

  /**
   * @remarks To make it possible for narrowing one parameter to jointly narrow other parameters
   * this method must be overridden like so:
   * ```typescript
   * class SwadeRegionDocument extends RegionDocument {
   *   protected override _preCreateDescendantDocuments(...args: RegionDocument.PreCreateDescendantDocumentsArgs) {
   *     super._preCreateDescendantDocuments(...args);
   *
   *     const [parent, collection, data, options, userId] = args;
   *     if (collection === "behaviors") {
   *         options; // Will be narrowed.
   *     }
   *   }
   * }
   * ```
   */
  protected override _preCreateDescendantDocuments(...args: RegionDocument.PreCreateDescendantDocumentsArgs): void;

  /**
   * @remarks To make it possible for narrowing one parameter to jointly narrow other parameters
   * this method must be overridden like so:
   * ```typescript
   * class LancerRegionDocument extends RegionDocument {
   *   protected override _preUpdateDescendantDocuments(...args: RegionDocument.OnUpdateDescendantDocuments) {
   *     super._preUpdateDescendantDocuments(...args);
   *
   *     const [parent, collection, changes, options, userId] = args;
   *     if (collection === "behaviors") {
   *         options; // Will be narrowed.
   *     }
   *   }
   * }
   * ```
   */
  protected override _preUpdateDescendantDocuments(...args: RegionDocument.PreUpdateDescendantDocumentsArgs): void;

  /**
   * @remarks To make it possible for narrowing one parameter to jointly narrow other parameters
   * this method must be overridden like so:
   * ```typescript
   * class KultRegionDocument extends RegionDocument {
   *   protected override _preDeleteDescendantDocuments(...args: RegionDocument.PreDeleteDescendantDocumentsArgs) {
   *     super._preDeleteDescendantDocuments(...args);
   *
   *     const [parent, collection, ids, options, userId] = args;
   *     if (collection === "behaviors") {
   *         options; // Will be narrowed.
   *     }
   *   }
   * }
   * ```
   */
  protected override _preDeleteDescendantDocuments(...args: RegionDocument.PreDeleteDescendantDocumentsArgs): void;

  /** @remarks `context` must contain a `pack` or `parent`. */
  static override defaultName(context: RegionDocument.DefaultNameContext): string;

  /** @remarks `createOptions` must contain a `pack` or `parent`. */
  static override createDialog(
    data: RegionDocument.CreateDialogData | undefined,
    createOptions: RegionDocument.Database.DialogCreateOptions,
    options?: RegionDocument.CreateDialogOptions,
  ): Promise<RegionDocument.Stored | null | undefined>;

  override deleteDialog(
    options?: InexactPartial<foundry.applications.api.DialogV2.ConfirmConfig>,
    operation?: Document.Database.DeleteOperationForName<"Region">,
  ): Promise<this | false | null | undefined>;

  static override fromDropData(
    data: RegionDocument.DropData,
    options?: RegionDocument.DropDataOptions,
  ): Promise<RegionDocument.Implementation | undefined>;

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
   * The context used to create a `Region`.
   */
  interface ConstructionContext extends Document.ConstructionContext<Parent> {}

  /**
   * The documents embedded within `RegionDocument`.
   */
  type Hierarchy = Readonly<Document.HierarchyOf<Schema>>;

  /**
   * The implementation of the `RegionDocument` document instance configured through `CONFIG.Region.documentClass` in Foundry and
   * {@linkcode DocumentClassConfig} or {@link ConfiguredRegion | `fvtt-types/configuration/ConfiguredRegion`} in fvtt-types.
   */
  type Implementation = Document.ImplementationFor<Name>;

  /**
   * The implementation of the `RegionDocument` document configured through `CONFIG.Region.documentClass` in Foundry and
   * {@linkcode DocumentClassConfig} in fvtt-types.
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
   * This is a fixed string per document type and is primarily useful for {@link ClientDocumentMixin | `Descendant Document Events`}.
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
   * The data put in {@link RegionDocument._source | `RegionDocument#_source`}. This data is what was
   * persisted to the database and therefore it must be valid JSON.
   *
   * For example a {@link fields.SetField | `SetField`} is persisted to the database as an array
   * but initialized as a {@linkcode Set}.
   */
  interface Source extends fields.SchemaField.SourceData<Schema> {}

  /**
   * The data necessary to create a document. Used in places like {@linkcode RegionDocument.create}
   * and {@link RegionDocument | `new RegionDocument(...)`}.
   *
   * For example a {@link fields.SetField | `SetField`} can accept any {@linkcode Iterable}
   * with the right values. This means you can pass a `Set` instance, an array of values,
   * a generator, or any other iterable.
   */
  interface CreateData extends fields.SchemaField.CreateData<Schema> {}

  /**
   * The data after a {@link foundry.abstract.Document | `Document`} has been initialized, for example
   * {@link RegionDocument.name | `RegionDocument#name`}.
   *
   * This is data transformed from {@linkcode RegionDocument.Source} and turned into more
   * convenient runtime data structures. For example a {@link fields.SetField | `SetField`} is
   * persisted to the database as an array of values but at runtime it is a `Set` instance.
   */
  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

  /**
   * The data used to update a document, for example {@link RegionDocument.update | `RegionDocument#update`}.
   * It is a distinct type from {@link RegionDocument.CreateData | `DeepPartial<RegionDocument.CreateData>`} because
   * it has different rules for `null` and `undefined`.
   */
  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  /**
   * The schema for {@linkcode RegionDocument}. This is the source of truth for how an Region document
   * must be structured.
   *
   * Foundry uses this schema to validate the structure of the {@linkcode RegionDocument}. For example
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
      extends Document.Database.CreateOperation<RegionDocument.Database.Create<Temporary>> {}

    /** Operation for {@linkcode RegionDocument.updateDocuments} */
    interface UpdateDocumentsOperation
      extends Document.Database.UpdateDocumentsOperation<RegionDocument.Database.Update> {}

    /** Operation for {@linkcode RegionDocument.deleteDocuments} */
    interface DeleteDocumentsOperation
      extends Document.Database.DeleteDocumentsOperation<RegionDocument.Database.Delete> {}

    /** Operation for {@linkcode RegionDocument.create} */
    interface CreateOperation<Temporary extends boolean | undefined>
      extends Document.Database.CreateOperation<RegionDocument.Database.Create<Temporary>> {}

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
   * If `Temporary` is true then `RegionDocument.Implementation`, otherwise `RegionDocument.Stored`.
   */
  type TemporaryIf<Temporary extends boolean | undefined> = true extends Temporary
    ? RegionDocument.Implementation
    : RegionDocument.Stored;

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

  interface DropData extends Document.Internal.DropData<Name> {}
  interface DropDataOptions extends Document.DropDataOptions {}

  interface DefaultNameContext extends Document.DefaultNameContext<Name, NonNullable<Parent>> {}

  interface CreateDialogData extends Document.CreateDialogData<CreateData> {}
  interface CreateDialogOptions extends Document.CreateDialogOptions<Name> {}

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
    readonly [K: string]: Document.Any | _EventData | _EventData[];
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
