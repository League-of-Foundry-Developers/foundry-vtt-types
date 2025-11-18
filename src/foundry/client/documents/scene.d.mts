import type { InexactPartial, MaybeArray, Merge } from "#utils";
import type { documents } from "#client/client.d.mts";
import type { Document, DatabaseBackend } from "#common/abstract/_module.d.mts";
import type { DataSchema } from "#common/data/fields.d.mts";
import type { LightData, TextureData } from "#common/data/data.d.mts";
import type ImageHelper from "#client/helpers/media/image-helper.d.mts";
import type { Canvas } from "#client/canvas/_module.d.mts";
import type { DialogV2 } from "#client/applications/api/_module.d.mts";

/** @privateRemarks `ClientDatabaseBackend` only used for links */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ClientDatabaseBackend } from "#client/data/_module.d.mts";

/** @privateRemarks `ClientDocumentMixin` and `DocumentCollection` only used for links */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ClientDocumentMixin } from "#client/documents/abstract/_module.d.mts";

import fields = foundry.data.fields;

declare namespace Scene {
  /**
   * The document's name.
   */
  type Name = "Scene";

  /**
   * The context used to create a `Scene`.
   */
  interface ConstructionContext extends Document.ConstructionContext<Parent> {}

  /**
   * The documents embedded within `Scene`.
   */
  type Hierarchy = Readonly<Document.HierarchyOf<Schema>>;

  /**
   * The implementation of the `Scene` document instance configured through
   * {@linkcode CONFIG.Scene.documentClass} in Foundry and {@linkcode DocumentClassConfig} or
   * {@linkcode ConfiguredScene | fvtt-types/configuration/ConfiguredScene} in fvtt-types.
   */
  type Implementation = Document.ImplementationFor<Name>;

  /**
   * The implementation of the `Scene` document configured through
   * {@linkcode CONFIG.Scene.documentClass} in Foundry and {@linkcode DocumentClassConfig} in fvtt-types.
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
        name: "Scene";
        collection: "scenes";
        indexed: true;
        compendiumIndexFields: ["_id", "name", "thumb", "sort", "folder"];
        embedded: Metadata.Embedded;
        label: string;
        labelPlural: string;
        preserveOnImport: ["_id", "sort", "ownership", "active"];
        schemaVersion: string;
      }>
    > {}

  namespace Metadata {
    /**
     * The embedded metadata
     */
    interface Embedded {
      AmbientLight: "lights";
      AmbientSound: "sounds";
      Drawing: "drawings";
      MeasuredTemplate: "templates";
      Note: "notes";
      Region: "regions";
      Tile: "tiles";
      Token: "tokens";
      Wall: "walls";
    }
  }

  /**
   * A document's parent is something that can contain it.
   * For example an `Item` can be contained by an `Actor` which makes `Actor` one of its possible parents.
   */
  type Parent = null;

  /**
   * A document's direct descendants are documents that are contained directly within its schema.
   * This is a union of all such instances, or never if the document doesn't have any descendants.
   */
  type DirectDescendantName =
    | "AmbientLight"
    | "AmbientSound"
    | "Drawing"
    | "MeasuredTemplate"
    | "Note"
    | "Region"
    | "Tile"
    | "Token"
    | "Wall";

  /**
   * A document's direct descendants are documents that are contained directly within its schema.
   * This is a union of all such instances, or never if the document doesn't have any descendants.
   */
  type DirectDescendant =
    | AmbientLightDocument.Implementation
    | AmbientSoundDocument.Implementation
    | DrawingDocument.Implementation
    | MeasuredTemplateDocument.Implementation
    | NoteDocument.Implementation
    | RegionDocument.Implementation
    | TileDocument.Implementation
    | TokenDocument.Implementation
    | WallDocument.Implementation;

  /**
   * A document's direct descendants are documents that are contained directly within its schema.
   * This is a union of all such classes, or never if the document doesn't have any descendants.
   */
  type DirectDescendantClass =
    | AmbientLightDocument.ImplementationClass
    | AmbientSoundDocument.ImplementationClass
    | DrawingDocument.ImplementationClass
    | MeasuredTemplateDocument.ImplementationClass
    | NoteDocument.ImplementationClass
    | RegionDocument.ImplementationClass
    | TileDocument.ImplementationClass
    | TokenDocument.ImplementationClass
    | WallDocument.ImplementationClass;

  /**
   * A document's descendants are any documents that are contained within, either within its schema
   * or its descendant's schemas.
   * This is a union of all such instances, or never if the document doesn't have any descendants.
   */
  type Descendant = DirectDescendant | RegionDocument.Descendant | TokenDocument.Descendant;

  /**
   * A document's descendants are any child documents, grandchild documents, etc.
   * This is a union of all classes, or never if the document doesn't have any descendants.
   */
  type DescendantClass = DirectDescendantClass | RegionDocument.DescendantClass | TokenDocument.DescendantClass;

  /**
   * Types of `CompendiumCollection` this document might be contained in.
   * Note that `this.pack` will always return a string; this is the type for `game.packs.get(this.pack)`
   */
  type Pack = foundry.documents.collections.CompendiumCollection.ForDocument<"Scene">;

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
      Scene.Implementation,
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
   * The world collection that contains `Scene`s. Will be `never` if none exists.
   */
  type CollectionClass = foundry.documents.collections.Scenes.ImplementationClass;

  /**
   * The world collection that contains `Scene`s. Will be `never` if none exists.
   */
  type Collection = foundry.documents.collections.Scenes.Implementation;

  /**
   * An instance of `Scene` that comes from the database but failed validation meaning that
   * its `system` and `_source` could theoretically be anything.
   */
  type Invalid = Document.Internal.Invalid<Implementation>;

  /**
   * An instance of `Scene` that comes from the database.
   */
  type Stored = Document.Internal.Stored<Scene.Implementation>;

  /**
   * The data put in {@linkcode Scene._source | Scene#_source}. This data is what was
   * persisted to the database and therefore it must be valid JSON.
   *
   * For example a {@linkcode fields.SetField | SetField} is persisted to the database as an array
   * but initialized as a {@linkcode Set}.
   */
  interface Source extends fields.SchemaField.SourceData<Schema> {}

  /**
   * The data necessary to create a document. Used in places like {@linkcode Scene.create}
   * and {@linkcode Scene | new Scene(...)}.
   *
   * For example a {@linkcode fields.SetField | SetField} can accept any {@linkcode Iterable}
   * with the right values. This means you can pass a `Set` instance, an array of values,
   * a generator, or any other iterable.
   */
  interface CreateData extends fields.SchemaField.CreateData<Schema> {}

  /**
   * Used in the {@linkcode Scene.create} and {@linkcode Scene.createDocuments} signatures, and
   * {@linkcode Scene.Database2.CreateOperation} and its derivative interfaces.
   */
  type CreateInput = CreateData | Implementation;

  /**
   * The helper type for the return of {@linkcode Scene.create}, returning (a single | an array of) (temporary | stored)
   * `Scene`s.
   *
   * `| undefined` is included in the non-array branch because if a `.create` call with non-array data is cancelled by the `preCreate`
   * method or hook, `shift`ing the return of `.createDocuments` produces `undefined`
   */
  type CreateReturn<Data extends MaybeArray<CreateInput>, Temporary extends boolean | undefined> =
    Data extends Array<CreateInput> ? Array<Scene.TemporaryIf<Temporary>> : Scene.TemporaryIf<Temporary> | undefined;

  /**
   * The data after a {@linkcode Document} has been initialized, for example
   * {@linkcode Scene.name | Scene#name}.
   *
   * This is data transformed from {@linkcode Scene.Source} and turned into more
   * convenient runtime data structures. For example a {@linkcode fields.SetField | SetField} is
   * persisted to the database as an array of values but at runtime it is a `Set` instance.
   */
  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

  /**
   * The data used to update a document, for example {@linkcode Scene.update | Scene#update}.
   * It is a distinct type from {@linkcode Scene.CreateData | DeepPartial<Scene.CreateData>} because
   * it has different rules for `null` and `undefined`.
   */
  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  /**
   * Used in the {@linkcode Scene.update | Scene#update} and
   * {@linkcode Scene.updateDocuments} signatures, and {@linkcode Scene.Database2.UpdateOperation}
   * and its derivative interfaces.
   */
  type UpdateInput = UpdateData | Implementation;

  interface EnvironmentDataSchemaDefaults {
    hue: number;
    intensity: number;
    luminosity: number;
    saturation: number;
    shadows: number;
  }

  interface EnvironmentDataSchema<Defaults extends EnvironmentDataSchemaDefaults> extends DataSchema {
    /**
     * The normalized hue angle.
     * @defaultValue `0` for `environment.base`, `257/360` for `environment.dark`
     */
    hue: fields.HueField<{
      required: true;
      initial: Defaults["hue"];
      label: "SCENES.ENVIRONMENT.Hue";
      hint: "SCENES.ENVIRONMENT.HueHint";
    }>;

    /**
     * The intensity of the tinting (0 = no tinting).
     * @defaultValue `0`
     */
    intensity: fields.AlphaField<{
      required: true;
      nullable: false;
      initial: Defaults["intensity"];
      label: "SCENES.ENVIRONMENT.Intensity";
      hint: "SCENES.ENVIRONMENT.IntensityHint";
    }>;

    /**
     * The luminosity.
     * @defaultValue `0` in `environment.base`, `0.25` in `environment.dark`
     */
    luminosity: fields.NumberField<{
      required: true;
      nullable: false;
      initial: Defaults["luminosity"];
      min: -1;
      max: 1;
      label: "SCENES.ENVIRONMENT.Luminosity";
      hint: "SCENES.ENVIRONMENT.LuminosityHint";
    }>;

    /**
     * The saturation.
     * @defaultValue `0`
     */
    saturation: fields.NumberField<{
      required: true;
      nullable: false;
      initial: Defaults["saturation"];
      min: -1;
      max: 1;
      label: "SCENES.ENVIRONMENT.Saturation";
      hint: "SCENES.ENVIRONMENT.SaturationHint";
    }>;

    /**
     * The strength of the shadows.
     * @defaultValue `0`
     */
    shadows: fields.NumberField<{
      required: true;
      nullable: false;
      initial: Defaults["shadows"];
      min: 0;
      max: 1;
      label: "SCENES.ENVIRONMENT.Shadows";
      hint: "SCENES.ENVIRONMENT.ShadowsHint";
    }>;
  }

  interface EnvironmentDataSchemaDefaults {
    hue: number;
    intensity: number;
    luminosity: number;
    saturation: number;
    shadows: number;
  }

  interface EnvironmentDataSchema<Defaults extends EnvironmentDataSchemaDefaults> extends DataSchema {
    /**
     * The normalized hue angle.
     * @defaultValue `0` for `environment.base`, `257/360` for `environment.dark`
     */
    hue: fields.HueField<{
      required: true;
      initial: Defaults["hue"];
      label: "SCENES.ENVIRONMENT.Hue";
      hint: "SCENES.ENVIRONMENT.HueHint";
    }>;

    /**
     * The intensity of the tinting (0 = no tinting).
     * @defaultValue `0`
     */
    intensity: fields.AlphaField<{
      required: true;
      nullable: false;
      initial: Defaults["intensity"];
      label: "SCENES.ENVIRONMENT.Intensity";
      hint: "SCENES.ENVIRONMENT.IntensityHint";
    }>;

    /**
     * The luminosity.
     * @defaultValue `0` in `environment.base`, `0.25` in `environment.dark`
     */
    luminosity: fields.NumberField<{
      required: true;
      nullable: false;
      initial: Defaults["luminosity"];
      min: -1;
      max: 1;
      label: "SCENES.ENVIRONMENT.Luminosity";
      hint: "SCENES.ENVIRONMENT.LuminosityHint";
    }>;

    /**
     * The saturation.
     * @defaultValue `0`
     */
    saturation: fields.NumberField<{
      required: true;
      nullable: false;
      initial: Defaults["saturation"];
      min: -1;
      max: 1;
      label: "SCENES.ENVIRONMENT.Saturation";
      hint: "SCENES.ENVIRONMENT.SaturationHint";
    }>;

    /**
     * The strength of the shadows.
     * @defaultValue `0`
     */
    shadows: fields.NumberField<{
      required: true;
      nullable: false;
      initial: Defaults["shadows"];
      min: 0;
      max: 1;
      label: "SCENES.ENVIRONMENT.Shadows";
      hint: "SCENES.ENVIRONMENT.ShadowsHint";
    }>;
  }

  /**
   * The schema for {@linkcode Scene}. This is the source of truth for how an Scene document
   * must be structured.
   *
   * Foundry uses this schema to validate the structure of the {@linkcode Scene}. For example
   * a {@linkcode fields.StringField | StringField} will enforce that the value is a string. More
   * complex fields like {@linkcode fields.SetField | SetField} goes through various conversions
   * starting as an array in the database, initialized as a set, and allows updates with any
   * iterable.
   */
  interface Schema extends DataSchema {
    /**
     * The _id which uniquely identifies this Scene document
     * @defaultValue `null`
     */
    _id: fields.DocumentIdField;

    /**
     * The name of this scene
     * @defaultValue `""`
     */
    name: fields.StringField<{ required: true; blank: false; textSearch: true }>;

    /**
     * Is this scene currently active? Only one scene may be active at a given time
     * @defaultValue `false`
     */
    active: fields.BooleanField;

    /**
     * Is this scene displayed in the top navigation bar?
     * @defaultValue `true`
     */
    navigation: fields.BooleanField<{ initial: true }>;

    /**
     * The sorting order of this Scene in the navigation bar relative to siblings
     * @defaultValue `0`
     */
    navOrder: fields.NumberField<{ required: true; nullable: false; integer: true; initial: 0 }>;

    /**
     * A string which overrides Scene name for display in the navigation bar
     * @defaultValue `""`
     */
    navName: fields.HTMLField<{ textSearch: true }>;

    /**
     * An image or video file that provides the background texture for the scene.
     * @defaultValue see {@linkcode TextureData}
     */
    background: TextureData;

    /**
     * An image or video file path providing foreground media for the scene
     * @defaultValue `null`
     */
    foreground: fields.FilePathField<{ categories: ["IMAGE", "VIDEO"]; virtual: true }>;

    /**
     * The elevation of the foreground layer where overhead tiles reside
     * @defaultValue `null`
     * @remarks If falsey, {@link Scene.prepareBaseData | `Scene#prepareBaseData`} initializes this to `this.grid.distance * 4`, with the comment:
     *
     * "A temporary assumption until a more robust long-term solution when we implement Scene Levels."
     */
    foregroundElevation: fields.NumberField<{ required: false; positive: true; integer: true }>;

    /**
     * A thumbnail image which depicts the scene at lower resolution
     * @defaultValue `null`
     */
    thumb: fields.FilePathField<{ categories: ["IMAGE"] }>;

    /**
     * The width of the scene canvas, normally the width of the background media
     * @defaultValue `4000`
     */
    width: fields.NumberField<{ integer: true; positive: true; initial: 4000 }>;

    /**
     * The height of the scene canvas, normally the height of the background media
     * @defaultValue `3000`
     */
    height: fields.NumberField<{ integer: true; positive: true; initial: 3000 }>;

    /**
     * The proportion of canvas padding applied around the outside of the scene
     * dimensions to provide additional buffer space
     * @defaultValue `0.25`
     */
    padding: fields.NumberField<{ required: true; nullable: false; min: 0; max: 0.5; step: 0.05; initial: 0.25 }>;

    /**
     * The initial view coordinates for the scene
     */
    initial: fields.SchemaField<{
      /** @defaultValue `null` */
      x: fields.NumberField<{ integer: true; required: true }>;

      /** @defaultValue `null` */
      y: fields.NumberField<{ integer: true; required: true }>;

      /** @defaultValue `0.5` */
      scale: fields.NumberField<{ required: true; positive: true }>;
    }>;

    /**
     * The color of the canvas displayed behind the scene background
     * @defaultValue `"#999999"`
     */
    backgroundColor: fields.ColorField<{ nullable: false; initial: "#999999" }>;

    /**
     * Grid configuration for the scene
     * @defaultValue see properties
     * @remarks Initialized in {@link Scene.prepareBaseData | `Scene#prepareBaseData`} to `Scene.#getGrid(this)`, which returns {@linkcode BaseGrid} or a subclass
     */
    grid: fields.SchemaField<
      GridSchema,
      // eslint-disable-next-line @typescript-eslint/no-empty-object-type
      {},
      // eslint-disable-next-line @typescript-eslint/no-deprecated
      fields.SchemaField.Internal.AssignmentType<GridSchema, fields.SchemaField.DefaultOptions>,
      foundry.grid.BaseGrid
    >;

    /**
     * Do Tokens require vision in order to see the Scene environment?
     * @defaultValue `true`
     */
    tokenVision: fields.BooleanField<{ initial: true }>;

    /**
     * Fog-exploration settings and other data
     */
    fog: fields.SchemaField<FogSchema>;

    /**
     * The environment data applied to the Scene.
     */
    environment: fields.SchemaField<EnvironmentSchema>;

    /**
     * A collection of embedded Drawing objects.
     * @defaultValue `[]`
     */
    drawings: fields.EmbeddedCollectionField<typeof documents.BaseDrawing, Scene.Implementation>;

    /**
     * A collection of embedded Tile objects.
     * @defaultValue `[]`
     */
    tokens: fields.EmbeddedCollectionField<typeof documents.BaseToken, Scene.Implementation>;

    /**
     * A collection of embedded Token objects.
     * @defaultValue `[]`
     */
    lights: fields.EmbeddedCollectionField<typeof documents.BaseAmbientLight, Scene.Implementation>;

    /**
     * A collection of embedded AmbientLight objects.
     * @defaultValue `[]`
     */
    notes: fields.EmbeddedCollectionField<typeof documents.BaseNote, Scene.Implementation>;

    /**
     * A collection of embedded Note objects.
     * @defaultValue `[]`
     */
    sounds: fields.EmbeddedCollectionField<typeof documents.BaseAmbientSound, Scene.Implementation>;

    /**
     * A collection of embedded Region documents.
     * @defaultValue `[]`
     */
    regions: fields.EmbeddedCollectionField<typeof documents.BaseRegion, Scene.Implementation>;

    /**
     * A collection of embedded AmbientSound objects.
     * @defaultValue `[]`
     */
    templates: fields.EmbeddedCollectionField<typeof documents.BaseMeasuredTemplate, Scene.Implementation>;

    /**
     * A collection of embedded MeasuredTemplate objects.
     * @defaultValue `[]`
     */
    tiles: fields.EmbeddedCollectionField<typeof documents.BaseTile, Scene.Implementation>;

    /**
     * A collection of embedded Wall objects
     * @defaultValue `[]`
     */
    walls: fields.EmbeddedCollectionField<typeof documents.BaseWall, Scene.Implementation>;

    /**
     * A linked Playlist document which should begin automatically playing when this Scene becomes active.
     * @defaultValue `null`
     */
    playlist: fields.ForeignDocumentField<typeof documents.BasePlaylist>;

    /**
     * A linked PlaylistSound document from the selected playlist that will
     * begin automatically playing when this Scene becomes active
     * @defaultValue `null`
     * @remarks This is `idOnly` because {@link fields.ForeignDocumentField | `ForeignDocumentField`} doesn't know how to get embedded documents;
     * {@link Scene.prepareBaseData | `Scene#prepareBaseData`} attempts to `get()` this ID from the provided `playlist`, if any, making this
     * `PlaylistSound.Implementation | undefined | null` at runtime
     */
    playlistSound: fields.ForeignDocumentField<typeof documents.BasePlaylistSound, { idOnly: true }>;

    /**
     * A JournalEntry document which provides narrative details about this Scene
     * @defaultValue `null`
     */
    journal: fields.ForeignDocumentField<typeof documents.BaseJournalEntry>;

    /**
     * A document ID for a JournalEntryPage which provides narrative details about this Scene
     * @defaultValue `null`
     */
    journalEntryPage: fields.ForeignDocumentField<typeof documents.BaseJournalEntryPage, { idOnly: true }>;

    /**
     * A named weather effect which should be rendered in this Scene.
     * @defaultValue `""`
     */
    weather: fields.StringField<{ required: true }>;

    /**
     * The _id of a Folder which contains this Actor
     * @defaultValue `null`
     */
    folder: fields.ForeignDocumentField<typeof documents.BaseFolder>;

    /**
     * The numeric sort value which orders this Actor relative to its siblings
     * @defaultValue `0`
     */
    sort: fields.IntegerSortField;

    /**
     * An object which configures ownership of this Scene
     * @defaultValue see {@linkcode fields.DocumentOwnershipField}
     */
    ownership: fields.DocumentOwnershipField;

    /**
     * An object of optional key/value flags
     * @defaultValue `{}`
     */
    flags: fields.DocumentFlagsField<Name>;

    /**
     * An object of creation and access information
     * @defaultValue see {@linkcode fields.DocumentStatsField}
     */
    _stats: fields.DocumentStatsField;
  }

  interface FogSchema extends DataSchema {
    /**
     * Should fog exploration progress be tracked for this Scene?
     * @defaultValue `true`
     */
    exploration: fields.BooleanField<{ initial: true }>;

    /**
     * The timestamp at which fog of war was last reset for this Scene.
     * @defaultValue `undefined`
     */
    reset: fields.NumberField<{ required: false; initial: undefined }>;

    /**
     * A special overlay image or video texture which is used for fog of war
     * @defaultValue `null`
     */
    overlay: fields.FilePathField<{ categories: ["IMAGE", "VIDEO"]; virtual: true }>;

    /**
     * Fog-exploration coloration data
     */
    colors: fields.SchemaField<FogColorSchema>;
  }

  interface FogData extends fields.SchemaField.InitializedData<FogSchema> {}

  interface FogColorSchema extends DataSchema {
    /**
     * A color tint applied to explored regions of fog of war
     * @defaultValue `null`
     */
    explored: fields.ColorField;

    /**
     * A color tint applied to unexplored regions of fog of war
     * @defaultValue `null`
     */
    unexplored: fields.ColorField;
  }

  interface FogColorData extends fields.SchemaField.InitializedData<FogColorSchema> {}

  interface EnvironmentSchema extends DataSchema {
    /**
     * The ambient darkness level in this Scene, where 0 represents midday (maximum illumination) and 1 represents midnight (maximum darkness)
     * @defaultValue `0`
     */
    darknessLevel: fields.AlphaField<{ initial: 0 }>;

    /**
     * The darkness level lock state.
     * @defaultValue `false`
     */
    darknessLock: fields.BooleanField<{ initial: false }>;

    /**
     * The global light data configuration.
     */
    globalLight: fields.SchemaField<{
      /**
       * Is the global light enabled?
       * @defaultValue `false`
       */
      enabled: fields.BooleanField<{ required: true; initial: false }>;

      /**
       * @see {@linkcode LightData.Schema.alpha}
       * @privateRemarks The field is defined in Foundry by pulling from the {@linkcode LightData} schema
       */
      alpha: LightData.Schema["alpha"];

      /**
       * Is the global light in bright mode?
       * @defaultValue `false`
       * @remarks This is `boolean` here instead {@linkcode LightData} schema's `number`, because the global light has infinite range
       */
      bright: fields.BooleanField<{ required: true; initial: false }>;

      /**
       * @see {@linkcode LightData.Schema.color}
       * @privateRemarks The field is defined in Foundry by pulling from the {@linkcode LightData} schema
       */
      color: LightData.Schema["color"];

      /**
       * @see {@linkcode LightData.Schema.coloration}
       * @privateRemarks The field is defined in Foundry by pulling from the {@linkcode LightData} schema
       */
      coloration: LightData.Schema["coloration"];

      /**
       * The luminosity applied in the shader
       * @defaultValue `0`
       * @remarks Doesn't pull from the {@linkcode LightData} schema, unlike its siblings, as it has a different `initial`
       */
      luminosity: fields.NumberField<{ required: true; nullable: false; initial: 0; min: 0; max: 1 }>;

      /**
       * @see {@linkcode LightData.Schema.saturation}
       * @privateRemarks The field is defined in Foundry by pulling from the {@linkcode LightData} schema
       */
      saturation: LightData.Schema["saturation"];

      /**
       * @see {@linkcode LightData.Schema.contrast}
       * @privateRemarks The field is defined in Foundry by pulling from the {@linkcode LightData} schema
       */
      contrast: LightData.Schema["contrast"];

      /**
       * @see {@linkcode LightData.Schema.shadows}
       * @privateRemarks The field is defined in Foundry by pulling from the {@linkcode LightData} schema
       */
      shadows: LightData.Schema["shadows"];

      /**
       * @see {@linkcode LightData.Schema.darkness}
       * @privateRemarks The field is defined in Foundry by pulling from the {@linkcode LightData} schema
       */
      darkness: LightData.Schema["darkness"];
    }>;

    /**
     * If cycling between {@linkcode base} and {@linkcode dark} is activated.
     * @defaultValue `true`
     */
    cycle: fields.BooleanField<{ initial: true }>;

    /**
     * The base (darkness level 0) ambience lighting data.
     */
    base: fields.SchemaField<EnvironmentDataSchema<{ hue: 0; intensity: 0; luminosity: 0; saturation: 0; shadows: 0 }>>;

    /**
     * The dark (darkness level 1) ambience lighting data.
     * @privateRemarks The `hue` default is actually `257/360` but you can't do division in types. This precision should be more than sufficient.
     */
    dark: fields.SchemaField<
      EnvironmentDataSchema<{ hue: 0.71388889; intensity: 0; luminosity: -0.25; saturation: 0; shadows: 0 }>
    >;
  }

  interface EnvironmentData extends fields.SchemaField.InitializedData<EnvironmentSchema> {}

  interface GridSchema extends DataSchema {
    /**
     * The type of grid, a number from CONST.GRID_TYPES.
     * @defaultValue {@linkcode foundry.packages.BaseSystem.grid | game.system.grid.type}
     */
    type: fields.NumberField<
      {
        required: true;
        choices: CONST.GRID_TYPES[];
        initial: () => CONST.GRID_TYPES;
        validationError: "must be a value in CONST.GRID_TYPES";
      },
      // FIXME: overrides required to enforce branded type
      CONST.GRID_TYPES | null | undefined,
      CONST.GRID_TYPES,
      CONST.GRID_TYPES
    >;

    /**
     * The grid size which represents the width (or height) of a single grid space.
     * @defaultValue `100`
     */
    size: fields.NumberField<{
      required: true;
      nullable: false;
      integer: true;
      min: typeof CONST.GRID_MIN_SIZE;
      initial: 100;
      validationError: `must be an integer number of pixels, ${typeof CONST.GRID_MIN_SIZE} or greater`;
    }>;

    /**
     * The line style of the grid.
     * @remarks This field has no special validation, but provided values should match keys of {@linkcode CONFIG.Canvas.gridStyles}
     * @defaultValue `"solidLines"`
     */
    style: fields.StringField<{ required: true; blank: false; initial: "solidLines" }>;

    /**
     * The thickness of the grid lines.
     * @defaultValue `1`
     */
    thickness: fields.NumberField<{ required: true; nullable: false; positive: true; integer: true; initial: 1 }>;

    /**
     * A string representing the color used to render the grid lines.
     * @defaultValue `"#000000"`
     */
    color: fields.ColorField<{ required: true; nullable: false; initial: "#000000" }>;

    /**
     * A number between 0 and 1 for the opacity of the grid lines.
     * @defaultValue `0.2`
     */
    alpha: fields.AlphaField<{ initial: 0.2 }>;

    /**
     * The number of distance units which are represented by a single grid space.
     * @defaultValue `game.system.grid.distance`
     */
    distance: fields.NumberField<{ required: true; nullable: false; positive: true; initial: () => number }>;

    /**
     * A label for the units of measure which are used for grid distance.
     * @defaultValue `game.system.grid.units`
     */
    units: fields.StringField<{ required: true; initial: () => string }>;
  }

  namespace Database2 {
    /* ***********************************************
     *                GET OPERATIONS                 *
     *************************************************/

    /**
     * A base (no property omission or optionality changes) {@linkcode DatabaseBackend.GetOperation | GetOperation} interface for
     * `Scene` documents. Valid for passing to
     * {@linkcode ClientDatabaseBackend._getDocuments | ClientDatabaseBackend#_getDocuments}.
     *
     * The {@linkcode GetDocumentsOperation} and {@linkcode BackendGetOperation} interfaces derive from this one.
     */
    interface GetOperation extends DatabaseBackend.GetOperation<Scene.Parent> {}

    /**
     * The interface for passing to {@linkcode Scene.get}.
     * @see {@linkcode Document.Database2.GetDocumentsOperation}
     */
    interface GetDocumentsOperation extends Document.Database2.GetDocumentsOperation<GetOperation> {}

    /**
     * The interface for passing to {@linkcode DatabaseBackend.get | DatabaseBackend#get} for `Scene` documents.
     * @see {@linkcode Document.Database2.BackendGetOperation}
     */
    interface BackendGetOperation extends Document.Database2.BackendGetOperation<GetOperation> {}

    /* ***********************************************
     *              CREATE OPERATIONS                *
     *************************************************/

    /**
     * A base (no property omission or optionality changes) {@linkcode DatabaseBackend.CreateOperation | DatabaseCreateOperation}
     * interface for `Scene` documents.
     *
     * See {@linkcode DatabaseBackend.CreateOperation} for more information on this family of interfaces.
     *
     * @remarks This interface was previously typed for passing to {@linkcode Scene.create}. The new name for that
     * interface is {@linkcode CreateDocumentsOperation}.
     */
    interface CreateOperation<Temporary extends boolean | undefined = boolean | undefined>
      extends DatabaseBackend.CreateOperation<Scene.CreateInput, Scene.Parent, Temporary> {}

    /**
     * The interface for passing to {@linkcode Scene.create} or {@linkcode Scene.createDocuments}.
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
     * @deprecated `Scene` documents are never embedded. This interface exists for consistency with other documents.
     *
     * The interface for passing to the {@linkcode Document.createEmbeddedDocuments | #createEmbeddedDocuments} method of any Documents that
     * can contain `Scene` documents. (see {@linkcode Scene.Parent})
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
     * The interface for passing to {@linkcode DatabaseBackend.create | DatabaseBackend#create} for `Scene` documents.
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
     * The interface passed to {@linkcode Scene._preCreate | Scene#_preCreate} and
     * {@link Hooks.PreCreateDocument | the `preCreateScene` hook}.
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
     * The interface passed to {@linkcode Scene._preCreateOperation}.
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
     * @deprecated The interface passed to {@linkcode Scene._onCreateDocuments}. It will be removed in v14 along with the
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
     * The interface passed to {@linkcode Scene._onCreate | Scene#_onCreate} and
     * {@link Hooks.CreateDocument | the `createScene` hook}.
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
     * The interface passed to {@linkcode Scene._onCreateOperation} and `Scene`-related collections'
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
     * interface for `Scene` documents.
     *
     * See {@linkcode DatabaseBackend.UpdateOperation} for more information on this family of interfaces.
     *
     * @remarks This interface was previously typed for passing to {@linkcode Scene.update | Scene#update}.
     * The new name for that interface is {@linkcode UpdateOneDocumentOperation}.
     */
    interface UpdateOperation extends DatabaseBackend.UpdateOperation<Scene.UpdateInput, Scene.Parent> {}

    /**
     * The interface for passing to {@linkcode Scene.update | Scene#update}.
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
     * @deprecated `Scene` documents are never embedded. This interface exists for consistency with other documents.
     *
     * The interface for passing to the {@linkcode Document.updateEmbeddedDocuments | #updateEmbeddedDocuments} method of any Documents that
     * can contain `Scene` documents (see {@linkcode Scene.Parent}). This interface is just an alias
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
     * The interface for passing to {@linkcode Scene.updateDocuments}.
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
     * The interface for passing to {@linkcode DatabaseBackend.update | DatabaseBackend#update} for `Scene` documents.
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
     * The interface passed to {@linkcode Scene._preUpdate | Scene#_preUpdate} and
     * {@link Hooks.PreUpdateDocument | the `preUpdateScene` hook}.
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
     * The interface passed to {@linkcode Scene._preUpdateOperation}.
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
     * @deprecated The interface passed to {@linkcode Scene._onUpdateDocuments}. It will be removed in v14 along with the
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
     * The interface passed to {@linkcode Scene._onUpdate | Scene#_onUpdate} and
     * {@link Hooks.UpdateDocument | the `updateScene` hook}.
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
     * The interface passed to {@linkcode Scene._onUpdateOperation} and `Scene`-related collections'
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
     * interface for `Scene` documents.
     *
     * See {@linkcode DatabaseBackend.DeleteOperation} for more information on this family of interfaces.
     *
     * @remarks This interface was previously typed for passing to {@linkcode Scene.delete | Scene#delete}.
     * The new name for that interface is {@linkcode DeleteOneDocumentOperation}.
     */
    interface DeleteOperation extends DatabaseBackend.DeleteOperation<Scene.Parent> {}

    /**
     * The interface for passing to {@linkcode Scene.delete | Scene#delete}.
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
     * @deprecated `Scene` documents are never embedded. This interface exists for consistency with other documents.
     *
     * The interface for passing to the {@linkcode Document.deleteEmbeddedDocuments | #deleteEmbeddedDocuments} method of any Documents that
     * can contain `Scene` documents (see {@linkcode Scene.Parent}). This interface is just an alias
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
     * The interface for passing to {@linkcode Scene.deleteDocuments}.
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
     * The interface for passing to {@linkcode DatabaseBackend.delete | DatabaseBackend#delete} for `Scene` documents.
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
     * The interface passed to {@linkcode Scene._preDelete | Scene#_preDelete} and
     * {@link Hooks.PreDeleteDocument | the `preDeleteScene` hook}.
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
     * The interface passed to {@linkcode Scene._preDeleteOperation}.
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
     * @deprecated The interface passed to {@linkcode Scene._onDeleteDocuments}. It will be removed in v14 along with the
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
     * The interface passed to {@linkcode Scene._onDelete | Scene#_onDelete} and
     * {@link Hooks.DeleteDocument | the `deleteScene` hook}.
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
     * The interface passed to {@linkcode Scene._onDeleteOperation} and `Scene`-related collections'
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
        GetDocumentsOperation: Scene.Database2.GetDocumentsOperation;
        BackendGetOperation: Scene.Database2.BackendGetOperation;
        GetOperation: Scene.Database2.GetOperation;

        CreateDocumentsOperation: Scene.Database2.CreateDocumentsOperation<Temporary>;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        CreateEmbeddedOperation: Scene.Database2.CreateEmbeddedOperation;
        BackendCreateOperation: Scene.Database2.BackendCreateOperation<Temporary>;
        CreateOperation: Scene.Database2.CreateOperation<Temporary>;
        PreCreateOptions: Scene.Database2.PreCreateOptions<Temporary>;
        PreCreateOperation: Scene.Database2.PreCreateOperation<Temporary>;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        OnCreateDocumentsOperation: Scene.Database2.OnCreateDocumentsOperation<Temporary>;
        OnCreateOptions: Scene.Database2.OnCreateOptions;
        OnCreateOperation: Scene.Database2.OnCreateOperation;

        UpdateOneDocumentOperation: Scene.Database2.UpdateOneDocumentOperation;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        UpdateEmbeddedOperation: Scene.Database2.UpdateEmbeddedOperation;
        UpdateManyDocumentsOperation: Scene.Database2.UpdateManyDocumentsOperation;
        BackendUpdateOperation: Scene.Database2.BackendUpdateOperation;
        UpdateOperation: Scene.Database2.UpdateOperation;
        PreUpdateOptions: Scene.Database2.PreUpdateOptions;
        PreUpdateOperation: Scene.Database2.PreUpdateOperation;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        OnUpdateDocumentsOperation: Scene.Database2.OnUpdateDocumentsOperation;
        OnUpdateOptions: Scene.Database2.OnUpdateOptions;
        OnUpdateOperation: Scene.Database2.OnUpdateOperation;

        DeleteOneDocumentOperation: Scene.Database2.DeleteOneDocumentOperation;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        DeleteEmbeddedOperation: Scene.Database2.DeleteEmbeddedOperation;
        DeleteManyDocumentsOperation: Scene.Database2.DeleteManyDocumentsOperation;
        BackendDeleteOperation: Scene.Database2.BackendDeleteOperation;
        DeleteOperation: Scene.Database2.DeleteOperation;
        PreDeleteOptions: Scene.Database2.PreDeleteOptions;
        PreDeleteOperation: Scene.Database2.PreDeleteOperation;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        OnDeleteDocumentsOperation: Scene.Database2.OnDeleteDocumentsOperation;
        OnDeleteOptions: Scene.Database2.OnDeleteOptions;
        OnDeleteOperation: Scene.Database2.OnDeleteOperation;
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
   * If `Temporary` is true then {@linkcode Scene.Implementation}, otherwise {@linkcode Scene.Stored}.
   */
  type TemporaryIf<Temporary extends boolean | undefined> =
    true extends Extract<Temporary, true> ? Scene.Implementation : Scene.Stored;

  namespace Database {
    /** Options passed along in Get operations for Scenes */
    interface Get extends foundry.abstract.types.DatabaseGetOperation<Scene.Parent> {}

    /** Options passed along in Create operations for Scenes */
    interface Create<Temporary extends boolean | undefined = boolean | undefined>
      extends foundry.abstract.types.DatabaseCreateOperation<Scene.CreateData, Scene.Parent, Temporary> {}

    /** Options passed along in Delete operations for Scenes */
    interface Delete extends foundry.abstract.types.DatabaseDeleteOperation<Scene.Parent> {}

    /** Options passed along in Update operations for Scenes */
    interface Update extends foundry.abstract.types.DatabaseUpdateOperation<Scene.UpdateData, Scene.Parent> {
      thumb?: (string | null)[];
      autoReposition?: boolean;
      animateDarkness?: number;
    }

    /** Operation for {@linkcode Scene.createDocuments} */
    interface CreateDocumentsOperation<Temporary extends boolean | undefined>
      extends Document.Database.CreateDocumentsOperation<Scene.Database.Create<Temporary>> {}

    /** Operation for {@linkcode Scene.updateDocuments} */
    interface UpdateDocumentsOperation extends Document.Database.UpdateDocumentsOperation<Scene.Database.Update> {}

    /** Operation for {@linkcode Scene.deleteDocuments} */
    interface DeleteDocumentsOperation extends Document.Database.DeleteDocumentsOperation<Scene.Database.Delete> {}

    /** Operation for {@linkcode Scene.create} */
    interface CreateOperation<Temporary extends boolean | undefined>
      extends Document.Database.CreateDocumentsOperation<Scene.Database.Create<Temporary>> {}

    /** Operation for {@link Scene.update | `Scene#update`} */
    interface UpdateOperation extends Document.Database.UpdateOperation<Update> {}

    interface DeleteOperation extends Document.Database.DeleteOperation<Delete> {}

    /** Options for {@linkcode Scene.get} */
    interface GetOptions extends Document.Database.GetOptions {}

    /** Options for {@link Scene._preCreate | `Scene#_preCreate`} */
    interface PreCreateOptions extends Document.Database.PreCreateOptions<Create> {}

    /** Options for {@link Scene._onCreate | `Scene#_onCreate`} */
    interface OnCreateOptions extends Document.Database.CreateOptions<Create> {}

    /** Operation for {@linkcode Scene._preCreateOperation} */
    interface PreCreateOperation extends Document.Database.PreCreateOperationStatic<Scene.Database.Create> {}

    /** Operation for {@link Scene._onCreateOperation | `Scene#_onCreateOperation`} */
    interface OnCreateOperation extends Scene.Database.Create {}

    /** Options for {@link Scene._preUpdate | `Scene#_preUpdate`} */
    interface PreUpdateOptions extends Document.Database.PreUpdateOptions<Update> {}

    /** Options for {@link Scene._onUpdate | `Scene#_onUpdate`} */
    interface OnUpdateOptions extends Document.Database.UpdateOptions<Update> {}

    /** Operation for {@linkcode Scene._preUpdateOperation} */
    interface PreUpdateOperation extends Scene.Database.Update {}

    /** Operation for {@link Scene._onUpdateOperation | `Scene._preUpdateOperation`} */
    interface OnUpdateOperation extends Scene.Database.Update {}

    /** Options for {@link Scene._preDelete | `Scene#_preDelete`} */
    interface PreDeleteOptions extends Document.Database.PreDeleteOperationInstance<Delete> {}

    /** Options for {@link Scene._onDelete | `Scene#_onDelete`} */
    interface OnDeleteOptions extends Document.Database.DeleteOptions<Delete> {}

    /** Options for {@link Scene._preDeleteOperation | `Scene#_preDeleteOperation`} */
    interface PreDeleteOperation extends Scene.Database.Delete {}

    /** Options for {@link Scene._onDeleteOperation | `Scene#_onDeleteOperation`} */
    interface OnDeleteOperation extends Scene.Database.Delete {}

    /** Context for {@linkcode Scene._onDeleteOperation} */
    interface OnDeleteDocumentsContext extends Document.ModificationContext<Scene.Parent> {}

    /** Context for {@linkcode Scene._onCreateDocuments} */
    interface OnCreateDocumentsContext extends Document.ModificationContext<Scene.Parent> {}

    /** Context for {@linkcode Scene._onUpdateDocuments} */
    interface OnUpdateDocumentsContext extends Document.ModificationContext<Scene.Parent> {}

    /**
     * Options for {@link Scene._preCreateDescendantDocuments | `Scene#_preCreateDescendantDocuments`}
     * and {@link Scene._onCreateDescendantDocuments | `Scene#_onCreateDescendantDocuments`}
     */
    interface CreateOptions extends Document.Database.CreateOptions<Scene.Database.Create> {}

    /**
     * Options for {@link Scene._preUpdateDescendantDocuments | `Scene#_preUpdateDescendantDocuments`}
     * and {@link Scene._onUpdateDescendantDocuments | `Scene#_onUpdateDescendantDocuments`}
     */
    interface UpdateOptions extends Document.Database.UpdateOptions<Scene.Database.Update> {}

    /**
     * Options for {@link Scene._preDeleteDescendantDocuments | `Scene#_preDeleteDescendantDocuments`}
     * and {@link Scene._onDeleteDescendantDocuments | `Scene#_onDeleteDescendantDocuments`}
     */
    interface DeleteOptions extends Document.Database.DeleteOptions<Scene.Database.Delete> {}

    /**
     * Create options for {@linkcode Scene.createDialog}.
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

  /** The interface {@linkcode Scene.fromDropData} receives */
  interface DropData extends Document.Internal.DropData<Name> {}

  /**
   * @deprecated Foundry prior to v13 had a completely unused `options` parameter in the {@linkcode Scene.fromDropData}
   * signature that has since been removed. This type will be removed in v14.
   */
  type DropDataOptions = never;

  /**
   * The interface for passing to {@linkcode Scene.defaultName}
   * @see {@linkcode Document.DefaultNameContext}
   */
  interface DefaultNameContext extends Document.DefaultNameContext<Name, Parent> {}

  /**
   * The interface for passing to {@linkcode Scene.createDialog}'s first parameter
   * @see {@linkcode Document.CreateDialogData}
   */
  interface CreateDialogData extends Document.CreateDialogData<CreateData> {}

  /**
   * @deprecated This is for a deprecated signature, and will be removed in v15.
   * The interface for passing to {@linkcode Scene.createDialog}'s second parameter that still includes partial Dialog
   * options, instead of being purely a {@linkcode Database2.CreateDocumentsOperation | CreateDocumentsOperation}.
   */
  interface CreateDialogDeprecatedOptions<Temporary extends boolean | undefined = boolean | undefined>
    extends Database2.CreateDocumentsOperation<Temporary>,
      Document._PartialDialogV1OptionsForCreateDialog {}

  /**
   * The interface for passing to {@linkcode Scene.createDialog}'s third parameter
   * @see {@linkcode Document.CreateDialogOptions}
   */
  interface CreateDialogOptions extends Document.CreateDialogOptions<Name> {}

  /**
   * The return type for {@linkcode Scene.createDialog}.
   * @see {@linkcode Document.CreateDialogReturn}
   */
  // TODO: inline .Stored in v14 instead of taking Temporary
  type CreateDialogReturn<
    Temporary extends boolean | undefined,
    PassedConfig extends Scene.CreateDialogOptions | undefined,
  > = Document.CreateDialogReturn<Scene.TemporaryIf<Temporary>, PassedConfig>;

  /**
   * The return type for {@linkcode Scene.deleteDialog | Scene#deleteDialog}.
   * @see {@linkcode Document.DeleteDialogReturn}
   */
  type DeleteDialogReturn<PassedConfig extends DialogV2.ConfirmConfig | undefined> = Document.DeleteDialogReturn<
    Scene.Stored,
    PassedConfig
  >;

  type PreCreateDescendantDocumentsArgs =
    | Document.Internal.PreCreateDescendantDocumentsArgs<
        Scene.Stored,
        Scene.DirectDescendantName,
        Scene.Metadata.Embedded
      >
    | TokenDocument.PreCreateDescendantDocumentsArgs
    | RegionDocument.PreCreateDescendantDocumentsArgs;

  type OnCreateDescendantDocumentsArgs =
    | Document.Internal.OnCreateDescendantDocumentsArgs<
        Scene.Stored,
        Scene.DirectDescendantName,
        Scene.Metadata.Embedded
      >
    | TokenDocument.OnCreateDescendantDocumentsArgs
    | RegionDocument.OnCreateDescendantDocumentsArgs;

  type PreUpdateDescendantDocumentsArgs =
    | Document.Internal.PreUpdateDescendantDocumentsArgs<
        Scene.Stored,
        Scene.DirectDescendantName,
        Scene.Metadata.Embedded
      >
    | TokenDocument.PreUpdateDescendantDocumentsArgs
    | RegionDocument.PreUpdateDescendantDocumentsArgs;

  type OnUpdateDescendantDocumentsArgs =
    | Document.Internal.OnUpdateDescendantDocumentsArgs<
        Scene.Stored,
        Scene.DirectDescendantName,
        Scene.Metadata.Embedded
      >
    | TokenDocument.OnUpdateDescendantDocumentsArgs
    | RegionDocument.OnUpdateDescendantDocumentsArgs;

  type PreDeleteDescendantDocumentsArgs =
    | Document.Internal.PreDeleteDescendantDocumentsArgs<
        Scene.Stored,
        Scene.DirectDescendantName,
        Scene.Metadata.Embedded
      >
    | TokenDocument.PreDeleteDescendantDocumentsArgs
    | RegionDocument.PreDeleteDescendantDocumentsArgs;

  type OnDeleteDescendantDocumentsArgs =
    | Document.Internal.OnDeleteDescendantDocumentsArgs<
        Scene.Stored,
        Scene.DirectDescendantName,
        Scene.Metadata.Embedded
      >
    | TokenDocument.OnDeleteDescendantDocumentsArgs
    | RegionDocument.OnDeleteDescendantDocumentsArgs;

  /* ***********************************************
   *             SCENE-SPECIFIC TYPES              *
   *************************************************/

  interface Dimensions {
    /** The width of the canvas. */
    width: number;

    /** The height of the canvas. */
    height: number;

    /** The grid size. */
    size: number;

    /** The canvas rectangle. */
    rect: Canvas.Rectangle;

    /** The X coordinate of the scene rectangle within the larger canvas. */
    sceneX: number;

    /** The Y coordinate of the scene rectangle within the larger canvas. */
    sceneY: number;

    /** The width of the scene. */
    sceneWidth: number;

    /** The height of the scene. */
    sceneHeight: number;

    /** The scene rectangle. */
    sceneRect: Canvas.Rectangle;

    /** The number of distance units in a single grid space. */
    distance: number;

    /** The factor to convert distance units to pixels */
    distancePixels: number;

    /** The units of distance */
    units: string;

    /** The aspect ratio of the scene rectangle. */
    ratio: number;

    /** The length of the longest line that can be drawn on the canvas. */
    maxR: number;

    /** The number of grid rows on the canvas */
    rows: number;

    /** The number of grid columns on the canvas */
    columns: number;
  }

  interface _ThumbnailCreationData {
    /**
     * A background image to use for thumbnail creation, otherwise the current scene
     * background is used.
     *
     * @remarks This cannot be `null` because Foundry writes `const newImage = img !== undefined;`.
     */
    img: string;

    /**
     * The desired thumbnail width. Default is 300px
     * @defaultValue `300`
     */
    width: number | null;

    /**
     * The desired thumbnail height. Default is 100px;
     * @defaultValue `100`
     */
    height: number | null;

    /**
     * Which image format should be used? image/png, image/jpeg, or image/webp
     * @defaultValue `"image/webp"`
     *
     * @remarks Foundry writes `image/jpg` but this functions the same as `image/png`.
     * The correct MIME type is `image/jpeg`.
     */
    format: foundry.helpers.media.ImageHelper.IMAGE_MIME_TYPES;

    /**
     * What compression quality should be used for jpeg or webp, between 0 and 1
     * @defaultValue `0.8`
     */
    quality: number;
  }

  interface ThumbnailCreationData extends InexactPartial<_ThumbnailCreationData> {}

  /**
   * The arguments to construct the document.
   *
   * @deprecated Writing the signature directly has helped reduce circularities and therefore is
   * now recommended.
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  type ConstructorArgs = Document.ConstructorParameters<CreateData, Parent>;
}

/**
 * The client-side Scene document which extends the common BaseScene model.
 *
 * @see {@linkcode Scenes}            The world-level collection of Scene documents
 * @see {@linkcode SceneConfig}       The Scene configuration application
 */
declare class Scene extends foundry.documents.BaseScene.Internal.ClientDocument {
  /**
   * @param data    - Initial data from which to construct the `Scene`
   * @param context - Construction context options
   */
  constructor(data: Scene.CreateData, context?: Scene.ConstructionContext);

  /**
   * Track the viewed position of each scene (while in memory only, not persisted)
   * When switching back to a previously viewed scene, we can automatically pan to the previous position.
   * @defaultValue `{}`
   * @internal
   * @remarks This is intentionally public because it is used in Canvas._initializeCanvasPosition() and Canvas.pan()
   */
  _viewPosition: Canvas.ViewPosition;

  /**
   * Track whether the scene is the active view
   * @defaultValue `this.active`
   * @internal
   */
  protected _view: boolean;

  /**
   * The grid instance.
   */
  // Note: Foundry overrides the schema to set `grid` to a grid subclass in `Scene.#getGrid`
  grid: foundry.grid.BaseGrid;

  /**
   * Determine the canvas dimensions this Scene would occupy, if rendered
   * @defaultValue `{}`
   * @remarks Technically `undefined` prior to the first time {@link Scene.prepareBaseData | `Scene#prepareBaseData`} is called
   */
  dimensions: Scene.Dimensions;

  /**
   * Provide a thumbnail image path used to represent this document.
   */
  get thumbnail(): string | null;

  /**
   * A convenience accessor for whether the Scene is currently viewed
   */
  get isView(): boolean;

  /**
   * Pull the specified users to this Scene.
   * @param users - An array of User documents or IDs.
   */
  pullUsers(users?: (User.Implementation | string)[]): void;

  /**
   * Set this scene as currently active
   * @returns A Promise which resolves to the current scene once it has been successfully activated
   */
  activate(): Promise<this | undefined>;

  /**
   * Set this scene as the current view
   * @remarks If `canvas.loading`, returns a `ui.notifications.warn`, thence the `| number` in the return type
   */
  view(): Promise<this | number>;

  /**
   * Unview the current Scene, clearing the game canvas.
   */
  unview(): Promise<this | undefined>;

  /**
   * @param createData - (default: `{}`)
   * @param options    - (default: `{}`)
   */
  override clone<Save extends boolean | undefined = false>(
    data?: Scene.CreateData,
    context?: Document.CloneContext<Save>,
  ): Document.Clone<this, Save>;

  override reset(): void;

  /**
   * @remarks If `source` is falsey, and the grid is hexagonal with the `legacyHex` flag set,
   * does some conversion on `object.grid.size` (leaving it numeric, no type change) before returning
   */
  override toObject(source?: boolean): Scene.Source;

  /**
   * @remarks
   * - Transforms `this.grid` from source data to a {@linkcode BaseGrid} (or subclass) instance
   * - Sets `this.dimensions` to `this.getDimensions()`
   * - If a `playlist` is set, attempts to initialize `this.playlistSound` to a Document reference (it's an `idOnly` field in the schema)
   * - Sets `this.foregroundElevation` to `this.grid.distance * 4` if its otherwise falsey
   */
  override prepareBaseData(): void;

  /**
   * Get the Canvas dimensions which would be used to display this Scene.
   * Apply padding to enlarge the playable space and round to the nearest 2x grid size to ensure symmetry.
   * The rounding accomplishes that the padding buffer around the map always contains whole grid spaces.
   */
  getDimensions(): Scene.Dimensions;

  /** @remarks If the scene has a `journal`, forwards to that journal's `#_onClickDocumentLink` */
  override _onClickDocumentLink(event: MouseEvent): ClientDocument.OnClickDocumentLinkReturn;

  /**
   * Clear the movement history of all Tokens within this Scene.
   */
  clearMovementHistories(): Promise<void>;

  /**
   * For all Tokens in this Scene identify the Regions that each Token is contained in and update the regions of each
   * Token accordingly.
   * or
   * For the given Tokens in this Scene identify the Regions that each Token is contained in and update the regions of
   * each Token accordingly.
   *
   * This function doesn't need to be called by the systems/modules unless
   * {@link TokenDocument.testInsideRegion | `foundry.documents.TokenDocument#testInsideRegion`} is overridden and non-Token properties other than
   * `Scene#grid.type` and `Scene#grid.size` change that are used in the override of
   * {@link TokenDocument.TestInsideRegion | `foundry.documents.TokenDocument#testInsideRegion`}.
   * @param tokens - The Tokens whose regions should be updates
   * @returns The array of Tokens whose regions changed
   */
  updateTokenRegions(tokens?: Iterable<TokenDocument.Implementation>): Promise<TokenDocument.Implementation[]>;

  /** @deprecated Foundry made this method truly private in v13 (this warning will be removed in v14) */
  protected _repositionObject(sceneUpdateData: never): never;

  // _preCreate, _preCreateOperation, _onCreate, and _preUpdate, _onUpdateOperation, _onUpdate, and _onDelete are all overridden but with no signature changes.
  // For type simplicity they are left off. These methods historically have been the source of a large amount of computation from tsc.

  /**
   * Handle Scene activation workflow if the active state is changed to true
   * @param active - Is the scene now active?
   */
  protected _onActivate(active: boolean): Promise<this | Canvas>;

  /**
   * @remarks To make it possible for narrowing one parameter to jointly narrow other parameters
   * this method must be overridden like so:
   * ```typescript
   * class SwadeScene extends Scene {
   *   protected override _preCreateDescendantDocuments(...args: Scene.PreCreateDescendantDocumentsArgs) {
   *     super._preCreateDescendantDocuments(...args);
   *
   *     const [parent, collection, data, options, userId] = args;
   *     if (collection === "tokens") {
   *         options; // Will be narrowed.
   *     }
   *   }
   * }
   * ```
   */
  protected override _preCreateDescendantDocuments(...args: Scene.PreCreateDescendantDocumentsArgs): void;

  /**
   * @remarks To make it possible for narrowing one parameter to jointly narrow other parameters
   * this method must be overridden like so:
   * ```typescript
   * class LancerScene extends Scene {
   *   protected override _preUpdateDescendantDocuments(...args: Scene.OnUpdateDescendantDocuments) {
   *     super._preUpdateDescendantDocuments(...args);
   *
   *     const [parent, collection, changes, options, userId] = args;
   *     if (collection === "tokens") {
   *         options; // Will be narrowed.
   *     }
   *   }
   * }
   * ```
   */
  protected override _preUpdateDescendantDocuments(...args: Scene.PreUpdateDescendantDocumentsArgs): void;

  /**
   * @remarks To make it possible for narrowing one parameter to jointly narrow other parameters
   * this method must be overridden like so:
   * ```typescript
   * class Ptr2eScene extends Scene {
   *   protected override _onUpdateDescendantDocuments(...args: Scene.OnUpdateDescendantDocumentsArgs) {
   *     super._onUpdateDescendantDocuments(...args);
   *
   *     const [parent, collection, documents, changes, options, userId] = args;
   *     if (collection === "tokens") {
   *         options; // Will be narrowed.
   *     }
   *   }
   * }
   * ```
   */
  protected override _onUpdateDescendantDocuments(...args: Scene.OnUpdateDescendantDocumentsArgs): void;

  /**
   * @remarks To make it possible for narrowing one parameter to jointly narrow other parameters
   * this method must be overridden like so:
   * ```typescript
   * class KultScene extends Scene {
   *   protected override _preDeleteDescendantDocuments(...args: Scene.PreDeleteDescendantDocumentsArgs) {
   *     super._preDeleteDescendantDocuments(...args);
   *
   *     const [parent, collection, ids, options, userId] = args;
   *     if (collection === "tokens") {
   *         options; // Will be narrowed.
   *     }
   *   }
   * }
   * ```
   */
  protected override _preDeleteDescendantDocuments(...args: Scene.PreDeleteDescendantDocumentsArgs): void;

  override toCompendium<Options extends ClientDocument.ToCompendiumOptions | undefined = undefined>(
    pack?: foundry.documents.collections.CompendiumCollection.Any | null,
    options?: Options,
  ): ClientDocument.ToCompendiumReturnType<"Scene", Options>;

  /**
   * Create a 300px by 100px thumbnail image for this scene background
   * @param data - (default: `{}`)
   * @returns The created thumbnail data.
   */
  createThumbnail(data?: Scene.ThumbnailCreationData): Promise<ImageHelper.ThumbnailReturn>;

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

  /**
   * @remarks To make it possible for narrowing one parameter to jointly narrow other parameters
   * this method must be overridden like so:
   * ```typescript
   * class GurpsScene extends Scene {
   *   protected override _onCreateDescendantDocuments(...args: Scene.OnCreateDescendantDocumentsArgs) {
   *     super._onCreateDescendantDocuments(...args);
   *
   *     const [parent, collection, documents, data, options, userId] = args;
   *     if (collection === "tokens") {
   *         options; // Will be narrowed.
   *     }
   *   }
   * }
   * ```
   */
  protected override _onCreateDescendantDocuments(...args: Scene.OnCreateDescendantDocumentsArgs): void;

  /**
   * @remarks To make it possible for narrowing one parameter to jointly narrow other parameters
   * this method must be overridden like so:
   * ```typescript
   * class BladesScene extends Scene {
   *   protected override _onDeleteDescendantDocuments(...args: Scene.OnUpdateDescendantDocuments) {
   *     super._onDeleteDescendantDocuments(...args);
   *
   *     const [parent, collection, documents, ids, options, userId] = args;
   *     if (collection === "tokens") {
   *         options; // Will be narrowed.
   *     }
   *   }
   * }
   * ```
   */
  protected override _onDeleteDescendantDocuments(...args: Scene.OnDeleteDescendantDocumentsArgs): void;

  static override defaultName(context?: Scene.DefaultNameContext): string;

  static override createDialog<
    Temporary extends boolean | undefined = undefined,
    Options extends Scene.CreateDialogOptions | undefined = undefined,
  >(
    data?: Scene.CreateDialogData,
    createOptions?: Scene.Database2.CreateDocumentsOperation<Temporary>,
    options?: Options,
  ): Promise<Scene.CreateDialogReturn<Temporary, Options>>;

  /**
   * @deprecated "The `ClientDocument.createDialog` signature has changed. It now accepts database operation options in its second
   * parameter, and options for {@linkcode DialogV2.prompt} in its third parameter." (since v13, until v15)
   *
   * @see {@linkcode Scene.CreateDialogDeprecatedOptions}
   */
  static override createDialog<
    Temporary extends boolean | undefined = undefined,
    Options extends Scene.CreateDialogOptions | undefined = undefined,
  >(
    data: Scene.CreateDialogData,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    createOptions: Scene.CreateDialogDeprecatedOptions<Temporary>,
    options?: Options,
  ): Promise<Scene.CreateDialogReturn<Temporary, Options>>;

  override deleteDialog<Options extends DialogV2.ConfirmConfig | undefined = undefined>(
    options?: Options,
    operation?: Scene.Database2.DeleteOneDocumentOperation,
  ): Promise<Scene.DeleteDialogReturn<Options>>;

  /**
   * @deprecated "`options` is now an object containing entries supported by {@linkcode DialogV2.confirm | DialogV2.confirm}."
   * (since v13, until v15)
   *
   * @see {@linkcode Document.DeleteDialogDeprecatedConfig}
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  override deleteDialog<Options extends Document.DeleteDialogDeprecatedConfig | undefined = undefined>(
    options?: Options,
    operation?: Scene.Database2.DeleteOneDocumentOperation,
  ): Promise<Scene.DeleteDialogReturn<Options>>;

  static override fromDropData(data: Scene.DropData): Promise<Scene.Implementation | undefined>;

  static override fromImport(
    source: Scene.Source,
    context?: Document.FromImportContext<Scene.Parent> | null,
  ): Promise<Scene.Implementation>;

  #Scene: true;
}

export default Scene;
