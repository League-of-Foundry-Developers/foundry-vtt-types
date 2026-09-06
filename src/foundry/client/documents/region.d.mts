import type { InexactPartial, MaybeArray, Merge } from "#utils";
import type { fields } from "#common/data/_module.d.mts";
import type { DatabaseBackend, Document, EmbeddedCollection } from "#common/abstract/_module.d.mts";
import type { BaseRegion } from "#common/documents/_module.d.mts";
import type { DialogV2 } from "#client/applications/api/_module.d.mts";
import type { RegionShape } from "#client/data/region-shapes/_module.d.mts";
import type { PolygonTree } from "#client/data/polygon-tree.d.mts";
import type { Canvas } from "#client/canvas/_module.d.mts";
import type { PointSourcePolygon } from "#client/canvas/geometry/_module.d.mts";

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Only used for links.
import type ClientDatabaseBackend from "#client/data/client-backend.d.mts";

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Only used for links.
import type ClientDocumentMixin from "#client/documents/abstract/client-document.d.mts";

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
   * Does this Region have a single shape that is not a hole?
   */
  get isSingleShape(): boolean;

  /**
   * The polygons of this Region.
   *
   * The value of this property must not be mutated.
   *
   * This property is updated only by a document update.
   * @remarks Foundry types the return as `ReadonlyArray` but does nothing to that effect at runtime;
   * A reference to the private, but unfrozen, array is returned.
   */
  get polygons(): PIXI.Polygon[];

  /**
   * The polygon tree of this Region.
   *
   * The value of this property must not be mutated.
   *
   * This property is updated only by a document update.
   */
  get polygonTree(): PolygonTree;

  /**
   * The Clipper paths of this Region.
   *
   * The value of this property must not be mutated.
   *
   * This property is updated only by a document update.
   * @remarks Foundry types the return as `ReadonlyArray` but does nothing to that effect at runtime;
   * A reference to the private, but unfrozen, array is returned.
   */
  get clipperPaths(): ReadonlyArray<ReadonlyArray<ClipperLib.IntPoint>>;

  /**
   * The Clipper polygon tree of this Region.
   *
   * The value of this property must not be mutated.
   */
  get clipperPolyTree(): ClipperLib.PolyTree;

  /**
   * The triangulation of this Region.
   *
   * The value of this property must not be mutated.
   *
   * This property is updated only by a document update.
   * @remarks Foundry types the return as `Readonly` but does nothing to that effect at runtime;
   * A reference to the private, but unfrozen, object is returned.
   */
  get triangulation(): RegionDocument.Triangulation;

  /**
   * The bounds of this Region.
   *
   * The value of this property must not be mutated.
   *
   * This property is updated only by a document update.
   * @remarks Despite the above exhortation, this returns a mutable reference to a private property.
   */
  get bounds(): PIXI.Rectangle;

  /**
   * The area of this Region.
   *
   * Alias for `this.polygonTree.area`.
   */
  get area(): number;

  /**
   * The tokens inside this region.
   * @remarks Marked by foundry as `@readonly`, but remains fully mutable at runtime.
   */
  tokens: Set<TokenDocument.Implementation>;

  override prepareBaseData(): void;

  /** @remarks Shares the cached polygon trees with the clone when neither shapes nor constraints changed. */
  override clone<Save extends boolean | undefined = false>(
    data?: RegionDocument.CreateData,
    context?: Document.CloneContext<Save>,
  ): Document.Clone<this, Save>;

  /**
   * Clamp the given elevation (of a token with a depth) to the elevation range of this Region.
   *
   * The elevation is clamped such that the head of the token is in the range if possible, but
   * the feet are never outside of the range.
   * @param elevation - The elevation (of the token)
   * @param depth     - The depth of the token (default: `0`)
   * @returns The clamped elevation
   */
  clampElevation(elevation: number, depth?: number): number;

  /**
   * Test whether the given point is inside this Region.
   * @param point - The point.
   * @returns Is the point inside this Region?
   */
  testPoint(point: Canvas.ElevatedPoint): boolean;

  /**
   * Test whether the given elevation is within the elevation range of this Region.
   * @param elevationRange - The elevation range.
   * @param elevation      - The elevation.
   * @returns Is the elevation within the elevation range of this Region?
   * @internal
   */
  static _testElevation(elevationRange: RegionDocument.ElevationRange, elevation: number): boolean;

  /**
   * Create the Clipper polygon tree for this Region.
   * @internal
   */
  _createClipperPolyTree(
    shapes: fields.ShapesField.InitializedElementType[],
    shapeConstraints: number[][] | null,
  ): ClipperLib.PolyTree;

  /**
   * Split the movement path into its segments.
   * @param waypoints - The waypoints of movement.
   * @param samples   - The points relative to the waypoints that are tested.
   *                    Whenever one of them is inside the region with respect to the
   *                    `tolerance`, the moved object is considered to be inside the region.
   * @param tolerance - The tolerance of point containment (see `distance` parameter
   *                    of `PolygonTree#testPoint`). (default: `0`)
   * @returns The movement split into its segments.
   */
  segmentizeMovementPath(
    waypoints: RegionDocument.SegmentizeMovementPathWaypoint[],
    samples: Canvas.Point[],
    tolerance?: number,
  ): RegionDocument.MovementSegment[];

  /**
   * Update the shape constraints of this Region. If `save` is true, the shape constraints are updated
   * only if the current User is designated for it.
   * @param options - Additional options
   * @remarks
   * @throws If `save` is passed for a non-persisted Region.
   */
  updateShapeConstraints(options?: RegionDocument.UpdateShapeConstraintsOptions): void;

  /**
   * Update the point sources of this Region document.
   * @param changes - The changes that will be applied to this Region. (default: `{}`)
   * @returns The computed shape constraint for each shape, if restricted/possible.
   * @internal
   */
  _computeShapeConstraints(changes?: RegionDocument.UpdateData): number[][] | null;

  /**
   * Compute the shape constraint for the given origin and config.
   * @param origin - The origin of the constraint.
   * @param config - The config of the constraint.
   * @returns The shape constraint.
   */
  protected _computeShapeConstraint(
    origin: Canvas.ElevatedPoint,
    config: PointSourcePolygon.Config,
  ): PointSourcePolygon.Any;

  // For type simplicity the following real override(s) are commented out.
  // These methods historically have been the source of a large amount of computation from tsc.

  // protected override _updateCommit(
  //   copy: RegionDocument.Source,
  //   diff: RegionDocument.UpdateData,
  //   options: foundry.abstract.DataModel.UpdateOptions,
  //   _state: fields.DataField.UpdateState,
  // ): void;

  // protected override _onUpdate(
  //   changed: RegionDocument.UpdateData,
  //   options: RegionDocument.Database.OnUpdateOptions,
  //   userId: string,
  // ): void;

  // protected static override _onCreateOperation(
  //   documents: RegionDocument.Stored[],
  //   operation: RegionDocument.Database.OnCreateOperation,
  //   user: User.Stored,
  // ): Promise<void>;

  // protected static override _onUpdateOperation(
  //   documents: RegionDocument.Stored[],
  //   operation: RegionDocument.Database.OnUpdateOperation,
  //   user: User.Stored,
  // ): Promise<void>;

  // protected static override _onDeleteOperation(
  //   documents: RegionDocument.Stored[],
  //   operation: RegionDocument.Database.OnDeleteOperation,
  //   user: User.Stored,
  // ): Promise<void>;

  /**
   * Called when the scene's grid is changed.
   * @param changed - The changes to the grid.
   * @internal
   */
  _onGridChange(changed: Scene.UpdateData["grid"]): void;

  /**
   * Clear the polygon tree.
   * @internal
   */
  _clearPolygonTree(): void;

  /**
   * Called when the polygon tree of the Region has changed.
   * @remarks Core's implementation is a no-op, this is soft abstract.
   */
  protected _onPolygonTreeChange(): void;

  /**
   * @remarks Dispatches {@linkcode CONST.REGION_EVENTS.BEHAVIOR_VIEWED} or
   * {@linkcode CONST.REGION_EVENTS.BEHAVIOR_UNVIEWED} when the rendered state actually flips.
   */
  protected override _refreshViewedState(): Promise<void>;

  /**
   * Create an emanation Region for the Token and attach it to the Token.
   * @param token      - The Token to attach the emanation Region to
   * @param range      - The range of the emanation in grid units
   * @param regionData - The Region data of the emanation
   * @param options    - Additional options
   * @returns The created Region document unless the creation was prevented
   * @remarks
   * @throws If `token` is not persisted.
   */
  static createTokenEmanation(
    token: TokenDocument.Implementation,
    range: number,
    regionData: RegionDocument.EmanationData,
    options?: RegionDocument.CreateTokenEmanationOptions,
  ): Promise<RegionDocument.Stored | undefined>;

  /**
   * Teleport a Token into this Region.
   *
   * The Token may be in the same Scene as this Region, or in a different Scene.
   * The current User must be an owner of the Token Document in order to teleport it.
   * For teleportation to a different Scene the current User requires `TOKEN_CREATE` and
   * `TOKEN_DELETE` permissions. If the Token is teleported to different Scene, it is deleted
   * and a new Token Document in the other Scene is created.
   *
   * This function can work with ephemeral (non-persisted) Region documents.
   * @param token - An existing Token Document to teleport
   * @returns The same Token Document if teleported within the same Scene, or a new Token Document if teleported to a different Scene
   * @throws If failed to teleport the Token document.
   */
  teleportToken(
    token: TokenDocument.Implementation,
    options?: RegionDocument.TeleportTokenOptions,
  ): Promise<TokenDocument.Implementation>;

  /**
   * Teleport Tokens into this Region.
   *
   * The Tokens may be in the same Scene as this Region, or in a different Scene.
   * The current User must be an owner of the Token Documents in order to teleport them.
   * For teleportation to a different Scene the current User requires `TOKEN_CREATE` and
   * `TOKEN_DELETE` permissions. If a Token is teleported to different Scene, it is deleted
   * and a new Token Document in the other Scene is created.
   *
   * This function can work ephemeral (non-persisted) Region documents.
   * @param tokens  - Existing Token Documents to teleport.
   * @param options - Additional options.
   * @returns The mapping of deleted to created Token Documents.
   * @example Teleport multiple tokens with random rotation
   * ```js
   * const updateData = new Map();
   * for ( const token of tokens ) {
   *   updateData.set(token, {
   *     rotation: Math.random() * 360
   *   });
   * }
   * await region.teleportTokens(tokens, {updateData});
   * ```
   * @throws If this Region is in a compendium, if the current User lacks the necessary permissions, if Token
   * Documents could not be created/updated/deleted, or if there is no valid placement.
   */
  teleportTokens(
    tokens: Iterable<TokenDocument.Implementation>,
    options?: RegionDocument.TeleportTokensOptions,
  ): Promise<Map<TokenDocument.Implementation, TokenDocument.Implementation>>;

  /**
   * Spawn Tokens into this Region.
   *
   * The current User must be an owner of the Token Documents and have the `TOKEN_CREATE` permission
   * in order to spawn them.
   *
   * This function can work ephemeral (non-persisted) Region documents.
   * @param tokenData - The Token data or Token Documents to spawn.
   * @param options   - Additional options.
   * @throws If this Region is in a compendium, if the current User lacks the `TOKEN_CREATE` permission, or if
   * there is no valid placement.
   * @example Spawn 10 tokens with random actor and random rotation in a placed circle with 30 grid units radius.
   * ```js
   * ui.notifications.info("Choose the placement for the spawn area.");
   * const spawnArea = await canvas.regions.placeRegion({
   *   name: "Spawn Area",
   *   shapes: [{
   *     type: "circle",
   *     x: 0,
   *     y: 0,
   *     radius: canvas.dimensions.distancePixels * 30
   *   }],
   *   restriction: {enabled: true},
   *   levels: [canvas.level.id]
   * }, {create: false});
   * if ( spawnArea ) {
   *   const {count: numTokensToSpawn=0} = await foundry.applications.api.DialogV2.input({
   *    window: {
   *       title: "How many tokens to you want to spawn?"
   *    },
   *    content: `<input type="number" name="count" min="0" step="1" value="10">`
   *   }) ?? {};
   *   const actors = game.actors.contents;
   *   const tokensToSpawn = [];
   *   for ( let i = 0; i < numTokensToSpawn; i++ ) {
   *     const actor = actors[Math.floor(Math.random() * actors.length)];
   *     const token = await actor.getTokenDocument({
   *       rotation: Math.random() * 360
   *     }, {parent: spawnArea.parent});
   *     tokensToSpawn.push(token);
   *   }
   *   const spawnedTokens = await spawnArea.spawnTokens(tokensToSpawn);
   * }
   * ```
   */
  spawnTokens(
    tokenData: Iterable<TokenDocument.CreateData | TokenDocument.Implementation>,
    options?: RegionDocument.SpawnTokensOptions,
  ): Promise<TokenDocument.Implementation[]>;

  /**
   * Activate the Socket event listeners.
   * @param socket - The active game socket
   * @internal
   */
  protected static _activateSocketListeners(socket: io.Socket): void;

  // For type simplicity the following real override(s) are commented out.
  // These methods historically have been the source of a large amount of computation from tsc.

  // protected static override _onCreateOperation(
  //   documents: RegionDocument.Stored[],
  //   operation: RegionDocument.Database.OnCreateOperation,
  //   user: User.Stored,
  // ): Promise<void>;

  // protected override _onUpdate(
  //   changed: RegionDocument.UpdateData,
  //   options: RegionDocument.Database.OnUpdateOptions,
  //   userId: string,
  // ): void;

  // protected static override _onUpdateOperation(
  //   documents: RegionDocument.Stored[],
  //   operation: RegionDocument.Database.OnUpdateOperation,
  //   user: User.Stored,
  // ): Promise<void>;

  // protected static override _onDeleteOperation(
  //   documents: RegionDocument.Stored[],
  //   operation: RegionDocument.Database.OnDeleteOperation,
  //   user: User.Stored,
  // ): Promise<void>;

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

  /**
   * Present a Dialog form to confirm the removal of a shape.
   * @param shapeOrIndex - The shape or shape index.
   * @param options      - Additional options passed to {@linkcode DialogV2.confirm} (default: `{}`)
   * @remarks
   * @throws If the shape does not belong to this Region, or the index is out of bounds.
   */
  removeShapeDialog(
    shapeOrIndex: fields.ShapesField.InitializedElementType | number,
    options?: DialogV2.ConfirmConfig,
  ): Promise<boolean>;

  /**
   * @deprecated "`RegionDocument#regionShapes` is deprecated. Use {@linkcode RegionDocument.shapes | RegionDocument#shapes}
   * instead." (since v14, until v16)
   */
  get regionShapes(): RegionShape.Any[];

  /** @remarks The {@linkcode RegionShape} wrappers of this Region's shapes, rebuilt whenever `shapes` changes. */
  get _regionShapes(): RegionShape.Any[];

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

  // Other Descendant Document operations are actually overridden above

  protected override _preCreateDescendantDocuments(...args: RegionDocument.PreCreateDescendantDocumentsArgs): void;

  // _onCreateDescendantDocuments omitted from the template due to real override above

  protected override _preUpdateDescendantDocuments(...args: RegionDocument.PreUpdateDescendantDocumentsArgs): void;

  // _onUpdateDescendantDocuments omitted from the template due to real override above

  protected override _preDeleteDescendantDocuments(...args: RegionDocument.PreDeleteDescendantDocumentsArgs): void;

  // _onDeleteDescendantDocuments omitted from the template due to real override above

  // `context` must contain a `parent`, so is required.
  static override defaultName(context: RegionDocument.DefaultNameContext): string;

  // `createOptions` must contain a  `parent`, so is required.
  static override createDialog<Options extends RegionDocument.CreateDialogOptions | undefined = undefined>(
    data: RegionDocument.CreateDialogData | undefined,
    createOptions: RegionDocument.Database.CreateDocumentsOperation,
    options?: Options,
  ): Promise<RegionDocument.CreateDialogReturn<Options>>;

  /**
   * @deprecated "The `ClientDocument.createDialog` signature has changed. It now accepts database operation options in its second
   * parameter, and options for {@linkcode DialogV2.prompt} in its third parameter." (since v13, until v15)
   *
   * @see {@linkcode RegionDocument.CreateDialogDeprecatedOptions}
   */
  static override createDialog<Options extends RegionDocument.CreateDialogOptions | undefined = undefined>(
    data: RegionDocument.CreateDialogData | undefined,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    createOptions: RegionDocument.CreateDialogDeprecatedOptions,
    options?: Options,
  ): Promise<RegionDocument.CreateDialogReturn<Options>>;

  override deleteDialog<Options extends DialogV2.ConfirmConfig | undefined = undefined>(
    options?: Options,
    operation?: RegionDocument.Database.DeleteOneDocumentOperation,
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
    operation?: RegionDocument.Database.DeleteOneDocumentOperation,
  ): Promise<RegionDocument.DeleteDialogReturn<Options>>;

  static override fromDropData(data: RegionDocument.DropData): Promise<RegionDocument.Implementation | undefined>;

  static override fromImport(
    source: RegionDocument.Source,
    context?: Document.FromImportContext<RegionDocument.Parent>,
  ): Promise<RegionDocument.Implementation>;

  override _onClickDocumentLink(event: MouseEvent): ClientDocument.OnClickDocumentLinkReturn;

  #RegionDocument: true;
}

declare namespace RegionDocument {
  /**
   * The document's name.
   */
  type Name = "Region";

  /**
   * One of the horizontal planes a Region contributes to its Scene, produced by its `defineSurface` behaviors.
   * @remarks Foundry's `RegionSurface` typedef omits `darkness`, which `Scene##updateSurfaces` does populate.
   */
  interface Surface {
    /** A key that uniquely identifies the surface */
    key: string;

    /** The region of the surface */
    region: RegionDocument.Implementation;

    /** The elevation of the surface */
    elevation: number;

    /** Does the surface restrict light? */
    light: boolean;

    /**
     * Does the surface restrict darkness?
     * @remarks Absent from the `RegionSurface` typedef in Foundry's `_types.mjs`.
     */
    darkness: boolean;

    /** Does the surface restrict movement? */
    move: boolean;

    /** Does the surface restrict sight? */
    sight: boolean;

    /** Does the surface restrict sound? */
    sound: boolean;

    /** Does the surface cause occlusion? */
    occlusion: boolean;

    /** Does the surface cause exposure? */
    exposure: boolean;

    /** Does the surface cause culling? */
    culling: boolean;
  }

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
  interface Metadata extends Merge<
    Document.Metadata.Default,
    Readonly<{
      name: "Region";
      collection: "regions";
      label: "DOCUMENT.Region";
      labelPlural: "DOCUMENT.Regions";
      isEmbedded: true;
      embedded: Metadata.Embedded;
      permissions: Metadata.Permissions;
      schemaVersion: "14.361";
    }>
  > {}

  namespace Metadata {
    /**
     * The embedded metadata
     */
    interface Embedded {
      RegionBehavior: "behaviors";
    }

    /**
     * The permissions for whether a certain user can create, update, or delete this document.
     */
    interface Permissions {
      create(user: User.Internal.Implementation, doc: Implementation, data: CreateData): boolean;
      update(user: User.Internal.Implementation, doc: Implementation, data: UpdateData): boolean;
      delete: "OWNER";
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
  type DirectDescendantName = "RegionBehavior";

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
   * A document's descendants are any child documents, grandchild documents, etc.
   * This is a union of all instances, or never if the document doesn't have any descendants.
   */
  type DescendantName = DirectDescendantName;

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
   * An embedded document is a document contained in another.
   * For example an `Item` can be contained by an `Actor` which means `Item` can be embedded in `Actor`.
   *
   * If this is `never` it is because there are no embeddable documents (or there's a bug!).
   *
   * @privateRemarks This is always the same as `DirectDescendant` and is provided as a convenient alias for users. It is not deprecated.
   */
  type Embedded = DirectDescendant;

  namespace Embedded {
    /**
     * An embedded document is a document contained in another.
     * For example an `Item` can be contained by an `Actor` which means `Item` can be embedded in `Actor`.
     *
     * If this is `never` it is because there are no embeddable documents (or there's a bug!).
     */
    type Name = keyof Metadata.Embedded;

    /**
     * A valid name to refer to a collection embedded in this document.
     * @remarks Functionally identical to `keyof `{@linkcode Metadata.Embedded}` | ValueOf<Metadata.Embedded>`
     */
    type CollectionName = Document.Embedded.CollectionName<Metadata.Embedded>;

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
     * The return type for {@linkcode RegionDocument.getCollectionName | RegionDocument#getCollectionName}. If the
     * passed name is not a known valid embedded document type/collection name for `RegionDocument`, returns `null`.
     */
    type GetCollectionNameReturn<Name extends string> = Name extends CollectionName
      ? Document.Embedded._CollectionNameForName<Metadata.Embedded, Name>
      : null;

    /**
     * The return type for {@linkcode RegionDocument.getEmbeddedDocument | RegionDocument#getEmbeddedDocument}.
     * See {@linkcode EmbeddedCollection.GetReturn}.
     */
    type GetReturn<
      EmbeddedName extends CollectionName,
      Options extends EmbeddedCollection.GetOptions | undefined,
    > = EmbeddedCollection.GetReturn<DocumentFor<EmbeddedName>, Options>;

    /**
     * @deprecated This type has been made internal. If you are actively using it for some reason, please let us know.
     * This type will be removed in v15.
     */
    type CollectionNameOf<Name extends Embedded.CollectionName> = Document.Embedded._CollectionNameForName<
      Metadata.Embedded,
      Name
    >;
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
   * {@linkcode RegionDocument.Database.CreateOperation} and its derivative interfaces.
   */
  type CreateInput = CreateData | Implementation;

  /**
   * The helper type for the return of {@linkcode RegionDocument.create}, returning (a single | an array of) (temporary | stored)
   * `RegionDocument`s.
   *
   * `| undefined` is included in the non-array branch because if a `.create` call with non-array data is cancelled by the `preCreate`
   * method or hook, `shift`ing the return of `.createDocuments` produces `undefined`
   */
  type CreateReturn<Data extends MaybeArray<CreateInput>> =
    Data extends Array<CreateInput> ? RegionDocument.Stored[] : RegionDocument.Stored | undefined;

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
   * {@linkcode RegionDocument.updateDocuments} signatures, and {@linkcode RegionDocument.Database.UpdateOperation}
   * and its derivative interfaces.
   */
  type UpdateInput = UpdateData | Implementation;

  /**
   * The schema for {@linkcode RegionDocument}. This is the source of truth for how a `Region` document
   * must be structured.
   *
   * Foundry uses this schema to validate the structure of the {@linkcode RegionDocument}. For example
   * a {@linkcode fields.StringField | StringField} will enforce that the value is a string. More
   * complex fields like {@linkcode fields.SetField | SetField} goes through various conversions
   * starting as an array in the database, initialized as a set, and allows updates with any
   * iterable.
   */
  interface Schema extends fields.DataSchema {
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
     * The color used to highlight the Region. A random color by default.
     * @defaultValue `Color.fromHSV([Math.random(), 0.8, 0.8]).css`
     */
    color: fields.ColorField<{
      required: true;
      nullable: false;
      initial: () => string;
    }>;

    /**
     * The shapes that make up the Region.
     * @defaultValue `[]`
     */
    shapes: fields.ShapesField;

    /**
     * The elevation range of the Region.
     * @defaultValue see properties
     */
    elevation: fields.SchemaField<
      ElevationSchema,
      {
        validate: (d: unknown) => boolean;
        validationError: "elevation.top may not be less than elevation.bottom";
      }
    >;

    /**
     * The IDs of the Scene levels that the Region is part of.
     * @defaultValue `new Set()`
     */
    levels: fields.SceneLevelsSetField;

    /**
     * The configuration of the constraint that walls impose on the shapes of the Region.
     * @defaultValue see properties
     */
    restriction: fields.SchemaField<RestrictionSchema>;

    /**
     * The configuration of the attachment of the Region to a placeable.
     * @defaultValue see properties
     */
    attachment: fields.SchemaField<AttachmentSchema>;

    /**
     * A collection of embedded RegionBehavior objects.
     */
    behaviors: fields.EmbeddedCollectionField<
      typeof foundry.documents.BaseRegionBehavior,
      RegionDocument.Implementation
    >;

    /**
     * The visibility of the Region, from CONST.REGION_VISIBILITY.
     * @defaultValue {@linkcode CONST.REGION_VISIBILITY.LAYER_UNLOCKED}
     */
    visibility: fields.NumberField<
      {
        required: true;
        initial: typeof CONST.REGION_VISIBILITY.LAYER_UNLOCKED;
        choices: CONST.REGION_VISIBILITY[];
      },
      CONST.REGION_VISIBILITY | null | undefined,
      CONST.REGION_VISIBILITY | null,
      CONST.REGION_VISIBILITY | null
    >;

    /**
     * Whether the true shapes of the Region or the grid spaces that it covers are highlighted.
     * @defaultValue `"shapes"`
     */
    highlightMode: fields.StringField<
      {
        required: true;
        initial: "shapes";
        choices: Record<RegionDocument.HighlightMode, string>;
      },
      // FIXME: Without these overrides, the literal union from `choices` is not respected, and the field types as `string`
      RegionDocument.HighlightMode | null | undefined,
      RegionDocument.HighlightMode,
      RegionDocument.HighlightMode
    >;

    /**
     * Are measurements displayed for the Region?
     * @defaultValue `false`
     */
    displayMeasurements: fields.BooleanField;

    /**
     * Is the Region currently hidden from player view?
     * @defaultValue `false`
     */
    hidden: fields.BooleanField;

    /**
     * Whether this region is locked.
     * @defaultValue `false`
     */
    locked: fields.BooleanField;

    /**
     * An object which configures ownership of this Region.
     * @defaultValue `{}`
     */
    ownership: fields.DocumentOwnershipField;

    /**
     * An object of optional key/value flags
     */
    flags: fields.DocumentFlagsField<Name>;

    /**
     * @defaultValue `null`
     * @internal
     * @remarks The cached polygon constraints computed from the Region's restriction settings, recomputed by
     * {@linkcode RegionDocument._computeShapeConstraints | RegionDocument#_computeShapeConstraints}.
     */
    _shapeConstraints: fields.ArrayField<
      fields.ArrayField<fields.NumberField<{ required: true; nullable: false; initial: undefined }>>,
      { nullable: true; initial: null }
    >;
  }

  /** The registered {@linkcode RegionDocument.Schema.highlightMode | highlightMode} choices. */
  interface HighlightModeChoices {
    shapes: "REGION.HIGHLIGHT_MODES.shapes.label";
    coverage: "REGION.HIGHLIGHT_MODES.coverage.label";
  }

  type HighlightMode = keyof HighlightModeChoices;

  /**
   * The elevation range {@linkcode RegionDocument._testElevation} tests against, which is
   * {@linkcode RegionDocument.elevation | RegionDocument#elevation} after
   * {@linkcode RegionDocument.prepareBaseData | prepareBaseData} has substituted the infinities.
   */
  interface ElevationRange {
    bottom: number;
    top: number;
    topInclusive: boolean;
  }

  /** @internal */
  interface UpdateShapeConstraintsOptions {
    /**
     * Persist the shape constraints changes?
     * @defaultValue `false`
     */
    save?: boolean | undefined;
  }

  /** The Region data of an emanation; {@linkcode RegionDocument.createTokenEmanation} supplies the rest. */
  interface EmanationData extends Omit<RegionDocument.CreateData, "shapes" | "elevation"> {}

  /** @internal */
  interface CreateTokenEmanationOptions {
    /**
     * Exclude the Token's own shape from the area of the emanation?
     * @defaultValue `false`
     */
    excludeToken?: boolean | undefined;

    /**
     * Should the emanation conform to the grid's metric?
     * @defaultValue `false`
     */
    gridBased?: boolean | undefined;

    /**
     * Optional creation options
     * @defaultValue `{}`
     */
    createOptions?: InexactPartial<Omit<DatabaseBackend.CreateOperation<CreateInput, Parent>, "parent">> | undefined;
  }

  /** @internal */
  interface _TokenPlacementOptions {
    /**
     * The placement.
     * @defaultValue `"random"`
     */
    placement: "random" | "center" | "relative";

    /**
     * Attempt to place the tokens at a snapped position.
     * @defaultValue `true`
     */
    snap: boolean;

    /** The relative offset position. */
    offset: Canvas.Point;

    /**
     * Avoid occupied grid spaces when placing randomly with snapping.
     * @defaultValue `true`
     */
    avoidOccupied: boolean;

    /**
     * The destination Level ID, which must be a Level this Region is in.
     * @defaultValue the Level of the Region if it is in only one Level
     */
    level: string;
  }

  /** @internal */
  interface _TeleportTokensOptions extends _TokenPlacementOptions {
    /**
     * Pan the canvas (with transition animation) to the destination if the token is controlled?
     * @defaultValue `true`
     */
    pan: boolean | TokenDocument.PanningOptions;

    /** Additonal update data. */
    updateData: Map<TokenDocument.Implementation, TokenDocument.UpdateData>;
  }

  interface TeleportTokensOptions extends InexactPartial<_TeleportTokensOptions> {}

  /**
   * {@linkcode RegionDocument.teleportToken | RegionDocument#teleportToken} takes update data for the one Token
   * it is given rather than a Map.
   */
  interface TeleportTokenOptions extends InexactPartial<Omit<_TeleportTokensOptions, "updateData">> {
    /** Additonal Token update data. */
    updateData?: TokenDocument.UpdateData | undefined;
  }

  /** @internal */
  interface _SpawnTokensOptions extends _TokenPlacementOptions {
    /**
     * Create the Token Documents in the database?
     * @defaultValue `true`
     */
    create: boolean;

    /** Optional creation options */
    createOptions: Partial<
      Omit<DatabaseBackend.CreateOperation<TokenDocument.CreateInput, Scene.Implementation>, "parent">
    >;
  }

  interface SpawnTokensOptions extends InexactPartial<_SpawnTokensOptions> {}

  interface RestrictionSchema extends fields.DataSchema {
    /**
     * Does this Region restrict its {@linkcode RestrictionSchema.type | type} at its boundary?
     * @defaultValue `false`
     */
    enabled: fields.BooleanField;

    /**
     * The single edge restriction type this Region imposes.
     * @defaultValue `"move"`
     */
    type: fields.StringField<
      { required: true; choices: typeof CONST.EDGE_RESTRICTION_TYPES; initial: "move" },
      CONST.EDGE_RESTRICTION_TYPES | null | undefined,
      CONST.EDGE_RESTRICTION_TYPES,
      CONST.EDGE_RESTRICTION_TYPES
    >;

    /**
     * Higher-priority restrictions take precedence over lower-priority ones where they overlap.
     * @defaultValue `0`
     */
    priority: fields.NumberField<{ required: true; nullable: false; integer: true; initial: 0; min: 0 }>;
  }

  interface RestrictionData extends fields.SchemaField.InitializedData<RestrictionSchema> {}

  interface AttachmentSchema extends fields.DataSchema {
    /**
     * The `_id` of the Token this Region is attached to, moving with it.
     * @defaultValue `null`
     */
    token: fields.ForeignDocumentField<
      typeof foundry.documents.BaseToken,
      { idOnly: true; nullable: true; initial: null }
    >;
  }

  interface ElevationSchema extends fields.DataSchema {
    /**
     * The bottom elevation level where the Region begins to take effect
     * @remarks if bottom is `null`, it is treated as `-Infinity`
     * @defaultValue `null`
     */
    bottom: fields.NumberField<{ required: true }>;

    /**
     * The top elevation level where the Region's effect ends
     * @remarks if top is `null`, it is treated as `Infinity`
     * @defaultValue `null`
     */
    top: fields.NumberField<{ required: true }>;

    /**
     * @defaultValue `false`
     * @remarks Does the Region include its own {@linkcode ElevationSchema.top | top} elevation?
     */
    topInclusive: fields.BooleanField;
  }

  namespace Database {
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
     * @see {@linkcode Document.Database.GetDocumentsOperation}
     */
    interface GetDocumentsOperation extends Document.Database.GetDocumentsOperation<GetOperation> {}

    /**
     * The interface for passing to {@linkcode DatabaseBackend.get | DatabaseBackend#get} for `RegionDocument` documents.
     * @see {@linkcode Document.Database.BackendGetOperation}
     */
    interface BackendGetOperation extends Document.Database.BackendGetOperation<GetOperation> {}

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
    interface CreateOperation
      extends
        DatabaseBackend.CreateOperation<RegionDocument.CreateInput, RegionDocument.Parent>,
        DatabaseBackend._CommonCanvasDocumentCreateProperties {}

    /**
     * The interface for passing to {@linkcode RegionDocument.create} or {@linkcode RegionDocument.createDocuments}.
     * @see {@linkcode Document.Database.CreateDocumentsOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode CreateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.CreateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface CreateDocumentsOperation extends Document.Database.CreateDocumentsOperation<CreateOperation> {}

    /**
     * The interface for passing to the {@linkcode Document.createEmbeddedDocuments | #createEmbeddedDocuments} method of any Documents that
     * can contain `RegionDocument` documents. (see {@linkcode RegionDocument.Parent})
     * @see {@linkcode Document.Database.CreateEmbeddedOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode CreateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.CreateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface CreateEmbeddedOperation extends Document.Database.CreateEmbeddedOperation<CreateOperation> {}

    /**
     * The interface for passing to {@linkcode DatabaseBackend.create | DatabaseBackend#create} for `RegionDocument` documents.
     * @see {@linkcode Document.Database.BackendCreateOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode CreateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.CreateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface BackendCreateOperation extends Document.Database.BackendCreateOperation<CreateOperation> {}

    /**
     * The interface passed to {@linkcode RegionDocument._preCreate | RegionDocument#_preCreate} and
     * {@link Hooks.PreCreateDocument | the `preCreateRegionDocument` hook}.
     * @see {@linkcode Document.Database.PreCreateOptions}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode CreateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.CreateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface PreCreateOptions extends Document.Database.PreCreateOptions<CreateOperation> {}

    /**
     * The interface passed to {@linkcode RegionDocument._preCreateOperation}.
     * @see {@linkcode Document.Database.PreCreateOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode CreateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.CreateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface PreCreateOperation extends Document.Database.PreCreateOperation<CreateOperation> {}

    /**
     * The interface passed to {@linkcode RegionDocument._onCreate | RegionDocument#_onCreate} and
     * {@link Hooks.CreateDocument | the `createRegionDocument` hook}.
     * @see {@linkcode Document.Database.OnCreateOptions}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode CreateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.CreateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface OnCreateOptions extends Document.Database.OnCreateOptions<CreateOperation> {}

    /**
     * The interface passed to {@linkcode RegionDocument._onCreateOperation} and `RegionDocument`-related collections'
     * `#_onModifyContents` methods.
     * @see {@linkcode Document.Database.OnCreateOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode CreateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.CreateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface OnCreateOperation extends Document.Database.OnCreateOperation<CreateOperation> {}

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
      extends
        DatabaseBackend.UpdateOperation<RegionDocument.UpdateInput, RegionDocument.Parent>,
        DatabaseBackend._CommonCanvasDocumentUpdateProperties {}

    /**
     * The interface for passing to {@linkcode RegionDocument.update | RegionDocument#update}.
     * @see {@linkcode Document.Database.UpdateOneDocumentOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode UpdateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.UpdateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface UpdateOneDocumentOperation extends Document.Database.UpdateOneDocumentOperation<UpdateOperation> {}

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
     * @see {@linkcode Document.Database.UpdateManyDocumentsOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode UpdateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.UpdateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface UpdateManyDocumentsOperation extends Document.Database.UpdateManyDocumentsOperation<UpdateOperation> {}

    /**
     * The interface for passing to {@linkcode DatabaseBackend.update | DatabaseBackend#update} for `RegionDocument` documents.
     * @see {@linkcode Document.Database.BackendUpdateOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode UpdateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.UpdateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface BackendUpdateOperation extends Document.Database.BackendUpdateOperation<UpdateOperation> {}

    /**
     * The interface passed to {@linkcode RegionDocument._preUpdate | RegionDocument#_preUpdate} and
     * {@link Hooks.PreUpdateDocument | the `preUpdateRegionDocument` hook}.
     * @see {@linkcode Document.Database.PreUpdateOptions}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode UpdateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.UpdateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface PreUpdateOptions extends Document.Database.PreUpdateOptions<UpdateOperation> {}

    /**
     * The interface passed to {@linkcode RegionDocument._preUpdateOperation}.
     * @see {@linkcode Document.Database.PreUpdateOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode UpdateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.UpdateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface PreUpdateOperation extends Document.Database.PreUpdateOperation<UpdateOperation> {}

    /**
     * The interface passed to {@linkcode RegionDocument._onUpdate | RegionDocument#_onUpdate} and
     * {@link Hooks.UpdateDocument | the `updateRegionDocument` hook}.
     * @see {@linkcode Document.Database.OnUpdateOptions}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode UpdateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.UpdateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface OnUpdateOptions extends Document.Database.OnUpdateOptions<UpdateOperation> {}

    /**
     * The interface passed to {@linkcode RegionDocument._onUpdateOperation} and `RegionDocument`-related collections'
     * `#_onModifyContents` methods.
     * @see {@linkcode Document.Database.OnUpdateOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode UpdateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.UpdateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface OnUpdateOperation extends Document.Database.OnUpdateOperation<UpdateOperation> {}

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
     * @see {@linkcode Document.Database.DeleteOneDocumentOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode DeleteOperation} for this Document or the
     * root {@linkcode DatabaseBackend.DeleteOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface DeleteOneDocumentOperation extends Document.Database.DeleteOneDocumentOperation<DeleteOperation> {}

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
     * @see {@linkcode Document.Database.DeleteManyDocumentsOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode DeleteOperation} for this Document or the
     * root {@linkcode DatabaseBackend.DeleteOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface DeleteManyDocumentsOperation extends Document.Database.DeleteManyDocumentsOperation<DeleteOperation> {}

    /**
     * The interface for passing to {@linkcode DatabaseBackend.delete | DatabaseBackend#delete} for `RegionDocument` documents.
     * @see {@linkcode Document.Database.BackendDeleteOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode DeleteOperation} for this Document or the
     * root {@linkcode DatabaseBackend.DeleteOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface BackendDeleteOperation extends Document.Database.BackendDeleteOperation<DeleteOperation> {}

    /**
     * The interface passed to {@linkcode RegionDocument._preDelete | RegionDocument#_preDelete} and
     * {@link Hooks.PreDeleteDocument | the `preDeleteRegionDocument` hook}.
     * @see {@linkcode Document.Database.PreDeleteOptions}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode DeleteOperation} for this Document or the
     * root {@linkcode DatabaseBackend.DeleteOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface PreDeleteOptions extends Document.Database.PreDeleteOptions<DeleteOperation> {}

    /**
     * The interface passed to {@linkcode RegionDocument._preDeleteOperation}.
     * @see {@linkcode Document.Database.PreDeleteOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode DeleteOperation} for this Document or the
     * root {@linkcode DatabaseBackend.DeleteOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface PreDeleteOperation extends Document.Database.PreDeleteOperation<DeleteOperation> {}

    /**
     * The interface passed to {@linkcode RegionDocument._onDelete | RegionDocument#_onDelete} and
     * {@link Hooks.DeleteDocument | the `deleteRegionDocument` hook}.
     * @see {@linkcode Document.Database.OnDeleteOptions}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode DeleteOperation} for this Document or the
     * root {@linkcode DatabaseBackend.DeleteOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface OnDeleteOptions extends Document.Database.OnDeleteOptions<DeleteOperation> {}

    /**
     * The interface passed to {@linkcode RegionDocument._onDeleteOperation} and `RegionDocument`-related collections'
     * `#_onModifyContents` methods.
     * @see {@linkcode Document.Database.OnDeleteOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode DeleteOperation} for this Document or the
     * root {@linkcode DatabaseBackend.DeleteOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface OnDeleteOperation extends Document.Database.OnDeleteOperation<DeleteOperation> {}

    namespace Internal {
      interface OperationNameMap {
        GetDocumentsOperation: RegionDocument.Database.GetDocumentsOperation;
        BackendGetOperation: RegionDocument.Database.BackendGetOperation;
        GetOperation: RegionDocument.Database.GetOperation;

        CreateDocumentsOperation: RegionDocument.Database.CreateDocumentsOperation;
        CreateEmbeddedOperation: RegionDocument.Database.CreateEmbeddedOperation;
        BackendCreateOperation: RegionDocument.Database.BackendCreateOperation;
        CreateOperation: RegionDocument.Database.CreateOperation;
        PreCreateOptions: RegionDocument.Database.PreCreateOptions;
        PreCreateOperation: RegionDocument.Database.PreCreateOperation;
        OnCreateOptions: RegionDocument.Database.OnCreateOptions;
        OnCreateOperation: RegionDocument.Database.OnCreateOperation;

        UpdateOneDocumentOperation: RegionDocument.Database.UpdateOneDocumentOperation;
        UpdateEmbeddedOperation: RegionDocument.Database.UpdateEmbeddedOperation;
        UpdateManyDocumentsOperation: RegionDocument.Database.UpdateManyDocumentsOperation;
        BackendUpdateOperation: RegionDocument.Database.BackendUpdateOperation;
        UpdateOperation: RegionDocument.Database.UpdateOperation;
        PreUpdateOptions: RegionDocument.Database.PreUpdateOptions;
        PreUpdateOperation: RegionDocument.Database.PreUpdateOperation;
        OnUpdateOptions: RegionDocument.Database.OnUpdateOptions;
        OnUpdateOperation: RegionDocument.Database.OnUpdateOperation;

        DeleteOneDocumentOperation: RegionDocument.Database.DeleteOneDocumentOperation;
        DeleteEmbeddedOperation: RegionDocument.Database.DeleteEmbeddedOperation;
        DeleteManyDocumentsOperation: RegionDocument.Database.DeleteManyDocumentsOperation;
        BackendDeleteOperation: RegionDocument.Database.BackendDeleteOperation;
        DeleteOperation: RegionDocument.Database.DeleteOperation;
        PreDeleteOptions: RegionDocument.Database.PreDeleteOptions;
        PreDeleteOperation: RegionDocument.Database.PreDeleteOperation;
        OnDeleteOptions: RegionDocument.Database.OnDeleteOptions;
        OnDeleteOperation: RegionDocument.Database.OnDeleteOperation;
      }
    }
  }

  /**
   * If `Temporary` is true then {@linkcode RegionDocument.Implementation}, otherwise {@linkcode RegionDocument.Stored}.
   * @deprecated `Document.create`/`Documents` can no longer return temporary documents as of v14. This type will be removed in v15.
   */
  type TemporaryIf<Temporary extends boolean | undefined> =
    true extends Extract<Temporary, true> ? RegionDocument.Implementation : RegionDocument.Stored;

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
   * options, instead of being purely a {@linkcode Database.CreateDocumentsOperation | CreateDocumentsOperation}.
   */
  interface CreateDialogDeprecatedOptions
    extends Database.CreateDocumentsOperation, Document._PartialDialogV1OptionsForCreateDialog {}

  /**
   * The interface for passing to {@linkcode RegionDocument.createDialog}'s third parameter
   * @see {@linkcode Document.CreateDialogOptions}
   */
  interface CreateDialogOptions extends Document.CreateDialogOptions<Name> {}

  /**
   * The return type for {@linkcode RegionDocument.createDialog}.
   * @see {@linkcode Document.CreateDialogReturn}
   */
  type CreateDialogReturn<Config extends RegionDocument.CreateDialogOptions | undefined> = Document.CreateDialogReturn<
    RegionDocument.Stored,
    Config
  >;

  /**
   * The return type for {@linkcode RegionDocument.deleteDialog | RegionDocument#deleteDialog}.
   * @see {@linkcode Document.DeleteDialogReturn}
   */
  type DeleteDialogReturn<Config extends DialogV2.ConfirmConfig | undefined> = Document.DeleteDialogReturn<
    RegionDocument.Stored,
    Config
  >;

  type PreCreateDescendantDocumentsArgs = Document.Internal.PreCreateDescendantDocumentsArgs<
    RegionDocument.Stored,
    RegionDocument.DirectDescendantName,
    RegionDocument.Metadata.Embedded
  >;

  type OnCreateDescendantDocumentsArgs = Document.Internal.OnCreateDescendantDocumentsArgs<
    RegionDocument.Stored,
    RegionDocument.DirectDescendantName,
    RegionDocument.Metadata.Embedded
  >;

  type PreUpdateDescendantDocumentsArgs = Document.Internal.PreUpdateDescendantDocumentsArgs<
    RegionDocument.Stored,
    RegionDocument.DirectDescendantName,
    RegionDocument.Metadata.Embedded
  >;

  type OnUpdateDescendantDocumentsArgs = Document.Internal.OnUpdateDescendantDocumentsArgs<
    RegionDocument.Stored,
    RegionDocument.DirectDescendantName,
    RegionDocument.Metadata.Embedded
  >;

  type PreDeleteDescendantDocumentsArgs = Document.Internal.PreDeleteDescendantDocumentsArgs<
    RegionDocument.Stored,
    RegionDocument.DirectDescendantName,
    RegionDocument.Metadata.Embedded
  >;

  type OnDeleteDescendantDocumentsArgs = Document.Internal.OnDeleteDescendantDocumentsArgs<
    RegionDocument.Stored,
    RegionDocument.DirectDescendantName,
    RegionDocument.Metadata.Embedded
  >;

  /* ***********************************************
   *            REGION-SPECIFIC TYPES              *
   *************************************************/

  interface Triangulation {
    vertices: Float32Array;
    indices: Uint16Array | Uint32Array;
  }

  // TODO: <Data extends object>
  interface RegionEvent {
    /** The name of the event */
    name: string;

    /** The data of the event */
    data: object;

    /** The Region the event was triggered on */
    region: RegionDocument.Implementation;

    /** The User that triggered the event */
    user: User.Stored;
  }

  interface TokenEnterExitEventData {
    /** The Token that entered/exited the Region */
    token: TokenDocument.Implementation;

    /** The movement if the Token entered/exited by moving out of the Region */
    movement: TokenDocument.MovementOperation | null;
  }

  interface TokenMoveEventData {
    /** The Token that moved into/out of/within the Region */
    token: TokenDocument.Implementation;

    /** The movement */
    movement: TokenDocument.MovementOperation;
  }

  interface TokenAnimateEventData {
    /** The Token that animated into/out of the Region */
    token: TokenDocument.Implementation;

    /** The position of the Token when it moved into/out of the Region */
    position: TokenDocument.Position;
  }

  interface TokenTurnEventData extends Combat.TurnEventContext {
    /** The Token that started/ended its Combat turn */
    token: TokenDocument.Implementation;

    /** The Combatant of the Token that started/ended its Combat turn */
    combatant: Combatant.Implementation;

    /** The Combat */
    combat: Combat.Implementation;
  }

  interface TokenRoundEventData extends Combat.RoundEventContext {
    /** The Token */
    token: TokenDocument.Implementation;

    /** The Combatant of the Token */
    combatant: Combatant.Implementation;

    /** The Combat */
    combat: Combat.Implementation;
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
        segments: RegionDocument.SegmentizeMovementPathWaypoint[];
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
   * now recommended. This type will be removed in v14.
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  type ConstructorArgs = Document.ConstructorParameters<CreateData, Parent>;
}

export default RegionDocument;
