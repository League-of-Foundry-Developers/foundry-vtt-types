import type { AnyObject, InexactPartial, Merge } from "#utils";
import type { documents } from "#client-esm/client.d.mts";
import type Document from "#common/abstract/document.d.mts";
import type { DataSchema } from "#common/data/fields.d.mts";
import type { LightData, TextureData } from "#common/data/data.mjs";

import fields = foundry.data.fields;

declare global {
  namespace Scene {
    /**
     * The document's name.
     */
    type Name = "Scene";

    /**
     * The arguments to construct the document.
     */
    type ConstructorArgs = Document.ConstructorParameters<CreateData, Parent>;

    /**
     * The documents embedded within `Scene`.
     */
    type Hierarchy = Readonly<Document.HierarchyOf<Schema>>;

    /**
     * The implementation of the `Scene` document instance configured through `CONFIG.Scene.documentClass` in Foundry and
     * {@linkcode DocumentClassConfig} or {@link ConfiguredScene | `fvtt-types/configuration/ConfiguredScene`} in fvtt-types.
     */
    type Implementation = Document.ImplementationFor<"Scene">;

    /**
     * The implementation of the `Scene` document configured through `CONFIG.Scene.documentClass` in Foundry and
     * {@linkcode DocumentClassConfig} in fvtt-types.
     */
    type ImplementationClass = Document.ImplementationClassFor<"Scene">;

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
    type Pack = CompendiumCollection.ForDocument<"Scene">;

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
      // TODO(LukeAbby): There's a circularity. Should be `Document.Embedded.CollectionDocumentFor<Metadata.Embedded, CollectionName>`
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      type DocumentFor<CollectionName extends Embedded.CollectionName> = Document.Any;

      /**
       * Gets the collection for an embedded document.
       */
      type CollectionFor<CollectionName extends Embedded.CollectionName> = Document.Embedded.CollectionFor<
        // TODO(LukeAbby): This should be `TokenDocument.Implementation` but this causes a circularity.
        Document.Any,
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
     * The world collection that contains `Scene`s. Will be `never` if none exists.
     */
    type CollectionClass = Scenes.ConfiguredClass;

    /**
     * The world collection that contains `Scene`s. Will be `never` if none exists.
     */
    type Collection = Scenes.Configured;

    /**
     * An instance of `Scene` that comes from the database but failed validation meaning that
     * its `system` and `_source` could theoretically be anything.
     */
    interface Invalid extends Document.Invalid<Scene.Implementation> {}

    /**
     * An instance of `Scene` that comes from the database.
     */
    interface Stored extends Document.Stored<Scene.Implementation> {}

    /**
     * The data put in {@link Scene._source | `Scene#_source`}. This data is what was
     * persisted to the database and therefore it must be valid JSON.
     *
     * For example a {@link fields.SetField | `SetField`} is persisted to the database as an array
     * but initialized as a {@linkcode Set}.
     */
    interface Source extends fields.SchemaField.SourceData<Schema> {}

    /**
     * @deprecated Replaced with {@linkcode Scene.Source}
     */
    type PersistedData = Source;

    /**
     * The data necessary to create a document. Used in places like {@linkcode Scene.create}
     * and {@link Scene | `new Scene(...)`}.
     *
     * For example a {@link fields.SetField | `SetField`} can accept any {@linkcode Iterable}
     * with the right values. This means you can pass a `Set` instance, an array of values,
     * a generator, or any other iterable.
     */
    interface CreateData extends fields.SchemaField.CreateData<Schema> {}

    /**
     * The data after a {@link foundry.abstract.Document | `Document`} has been initialized, for example
     * {@link Scene.name | `Scene#name`}.
     *
     * This is data transformed from {@linkcode Scene.Source} and turned into more
     * convenient runtime data structures. For example a {@link fields.SetField | `SetField`} is
     * persisted to the database as an array of values but at runtime it is a `Set` instance.
     */
    interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

    /**
     * The data used to update a document, for example {@link Scene.update | `Scene#update`}.
     * It is a distinct type from {@link Scene.CreateData | `DeepPartial<Scene.CreateData>`} because
     * it has different rules for `null` and `undefined`.
     */
    interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

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
     * a {@link fields.StringField | `StringField`} will enforce that the value is a string. More
     * complex fields like {@link fields.SetField | `SetField`} goes through various conversions
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
      // FIXME: This field is `required` with no `initial`, so actually required for construction; Currently an AssignmentType override is required to enforce this
      name: fields.StringField<{ required: true; blank: false; textSearch: true }, string>;

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
      foreground: fields.FilePathField<{ categories: ["IMAGE", "VIDEO"] }>;

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
        x: fields.NumberField<{ integer: true; nullable: true }>;

        /** @defaultValue `null` */
        y: fields.NumberField<{ integer: true; nullable: true }>;

        /** @defaultValue `0.5` */
        scale: fields.NumberField<{ nullable: true; min: 0.25; max: 3; initial: 0.5 }>;
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
        | foundry.grid.BaseGrid
        | fields.SchemaField.Internal.InitializedType<GridSchema, fields.SchemaField.DefaultOptions>
      >;

      /**
       * Do Tokens require vision in order to see the Scene environment?
       * @defaultValue `true`
       */
      tokenVision: fields.BooleanField<{ initial: true }>;

      /**
       * @remarks Fog data for this scene
       */
      fog: fields.SchemaField<{
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
        overlay: fields.FilePathField<{ categories: ["IMAGE", "VIDEO"] }>;

        colors: fields.SchemaField<{
          /**
           * A color tint applied to explored regions of fog of war
           * @defaultValue `null`
           */
          explored: fields.ColorField<{ label: "SCENES.FogExploredColor" }>;

          /**
           * A color tint applied to unexplored regions of fog of war
           * @defaultValue `null`
           */
          unexplored: fields.ColorField<{ label: "SCENES.FogUnexploredColor" }>;
        }>;
      }>;

      /**
       * The environment data applied to the Scene.
       */
      environment: fields.SchemaField<{
        /**
         * The environment darkness level.
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
           * @see {@linkcode foundry.data.LightData.Schema.alpha}
           * @privateRemarks The field is defined in Foundry by pulling from the {@linkcode foundry.data.LightData} schema
           */
          alpha: LightData.Schema["alpha"];

          /**
           * Is the global light in bright mode?
           * @defaultValue `false`
           * @remarks This is `boolean` here instead {@linkcode foundry.data.LightData} schema's `number`, because the global light has infinite range
           */
          bright: fields.BooleanField<{ required: true; initial: false }>;

          /**
           * @see {@linkcode foundry.data.LightData.Schema.color}
           * @privateRemarks The field is defined in Foundry by pulling from the {@linkcode foundry.data.LightData} schema
           */
          color: LightData.Schema["color"];

          /**
           * @see {@linkcode foundry.data.LightData.Schema.coloration}
           * @privateRemarks The field is defined in Foundry by pulling from the {@linkcode foundry.data.LightData} schema
           */
          coloration: LightData.Schema["coloration"];

          /**
           * The luminosity applied in the shader
           * @defaultValue `0`
           * @remarks Doesn't pull from the {@linkcode foundry.data.LightData} schema, unlike its siblings, as it has a different `initial`
           */
          luminosity: fields.NumberField<{ required: true; nullable: false; initial: 0; min: 0; max: 1 }>;

          /**
           * @see {@linkcode foundry.data.LightData.Schema.saturation}
           * @privateRemarks The field is defined in Foundry by pulling from the {@linkcode foundry.data.LightData} schema
           */
          saturation: LightData.Schema["saturation"];

          /**
           * @see {@linkcode foundry.data.LightData.Schema.contrast}
           * @privateRemarks The field is defined in Foundry by pulling from the {@linkcode foundry.data.LightData} schema
           */
          contrast: LightData.Schema["contrast"];

          /**
           * @see {@linkcode foundry.data.LightData.Schema.shadows}
           * @privateRemarks The field is defined in Foundry by pulling from the {@linkcode foundry.data.LightData} schema
           */
          shadows: LightData.Schema["shadows"];

          /**
           * @see {@linkcode foundry.data.LightData.Schema.darkness}
           * @privateRemarks The field is defined in Foundry by pulling from the {@linkcode foundry.data.LightData} schema
           */
          darkness: LightData.Schema["darkness"];
        }>;

        /**
         * If cycling between Night and Day is activated.
         * @defaultValue `true`
         */
        cycle: fields.BooleanField<{ initial: true }>;

        /**
         * The base (darkness level 0) ambience lighting data.
         */
        base: fields.SchemaField<
          EnvironmentDataSchema<{ hue: 0; intensity: 0; luminosity: 0; saturation: 0; shadows: 0 }>
        >;

        /**
         * The dark (darkness level 1) ambience lighting data.
         * @privateRemarks The `hue` default is actually `257/360` but you can't do division in types. This precision should be more than sufficient.
         */
        dark: fields.SchemaField<
          EnvironmentDataSchema<{ hue: 0.71388889; intensity: 0; luminosity: -0.25; saturation: 0; shadows: 0 }>
        >;
      }>;

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
      flags: fields.ObjectField.FlagsField<Name>;

      /**
       * An object of creation and access information
       * @defaultValue see {@linkcode fields.DocumentStatsField}
       */
      _stats: fields.DocumentStatsField;
    }

    interface GridSchema extends DataSchema {
      /**
       * The type of grid, a number from CONST.GRID_TYPES.
       * @defaultValue `game.system.grid.type`
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
       * @remarks The style of grid line used. This field has no special validation, but provided values
       * should match keys of {@linkcode CONFIG.Canvas.gridStyles}
       * @defaultValue `"solidLines"`
       */
      style: fields.StringField<{ required: true; blank: false; initial: "solidLines" }>;

      /**
       * @remarks The width of drawn grid lines
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
        extends Document.Database.CreateOperation<Scene.Database.Create<Temporary>> {}

      /** Operation for {@linkcode Scene.updateDocuments} */
      interface UpdateDocumentsOperation extends Document.Database.UpdateDocumentsOperation<Scene.Database.Update> {}

      /** Operation for {@linkcode Scene.deleteDocuments} */
      interface DeleteDocumentsOperation extends Document.Database.DeleteDocumentsOperation<Scene.Database.Delete> {}

      /** Operation for {@linkcode Scene.create} */
      interface CreateOperation<Temporary extends boolean | undefined>
        extends Document.Database.CreateOperation<Scene.Database.Create<Temporary>> {}

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
    }

    /**
     * The flags that are available for this document in the form `{ [scope: string]: { [key: string]: unknown } }`.
     */
    interface Flags extends Document.ConfiguredFlagsForName<Name> {}

    namespace Flags {
      /**
       * The valid scopes for the flags on this document e.g. `"core"` or `"dnd5e"`.
       */
      type Scope = Document.FlagKeyOf<Flags>;

      /**
       * The valid keys for a certain scope for example if the scope is "core" then a valid key may be `"sheetLock"` or `"viewMode"`.
       */
      type Key<Scope extends Flags.Scope> = Document.FlagKeyOf<Document.FlagGetKey<Flags, Scope>>;

      /**
       * Gets the type of a particular flag given a `Scope` and a `Key`.
       */
      type Get<Scope extends Flags.Scope, Key extends Flags.Key<Scope>> = Document.GetFlag<Name, Scope, Key>;
    }

    type PreCreateDescendantDocumentsArgs =
      | Document.PreCreateDescendantDocumentsArgs<Scene.Stored, Scene.DirectDescendant, Scene.Metadata.Embedded>
      | TokenDocument.PreCreateDescendantDocumentsArgs
      | RegionDocument.PreCreateDescendantDocumentsArgs;

    type OnCreateDescendantDocumentsArgs =
      | Document.OnCreateDescendantDocumentsArgs<Scene.Stored, Scene.DirectDescendant, Scene.Metadata.Embedded>
      | TokenDocument.OnCreateDescendantDocumentsArgs
      | RegionDocument.OnCreateDescendantDocumentsArgs;

    type PreUpdateDescendantDocumentsArgs =
      | Document.PreUpdateDescendantDocumentsArgs<Scene.Stored, Scene.DirectDescendant, Scene.Metadata.Embedded>
      | TokenDocument.PreUpdateDescendantDocumentsArgs
      | RegionDocument.PreUpdateDescendantDocumentsArgs;

    type OnUpdateDescendantDocumentsArgs =
      | Document.OnUpdateDescendantDocumentsArgs<Scene.Stored, Scene.DirectDescendant, Scene.Metadata.Embedded>
      | TokenDocument.OnUpdateDescendantDocumentsArgs
      | RegionDocument.OnUpdateDescendantDocumentsArgs;

    type PreDeleteDescendantDocumentsArgs =
      | Document.PreDeleteDescendantDocumentsArgs<Scene.Stored, Scene.DirectDescendant, Scene.Metadata.Embedded>
      | TokenDocument.PreDeleteDescendantDocumentsArgs
      | RegionDocument.PreDeleteDescendantDocumentsArgs;

    type OnDeleteDescendantDocumentsArgs =
      | Document.OnDeleteDescendantDocumentsArgs<Scene.Stored, Scene.DirectDescendant, Scene.Metadata.Embedded>
      | TokenDocument.OnDeleteDescendantDocumentsArgs
      | RegionDocument.OnDeleteDescendantDocumentsArgs;

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

    interface _ThumbnailCreationData extends ImageHelper.TextureToImageOptions {
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
       * @remarks Foundry writes `image/jpg` but this functions the same as `image/png  `.
       * The correct MIME type is `image/jpeg`.
       */
      format: ImageHelper.Format | null;

      /**
       * What compression quality should be used for jpeg or webp, between 0 and 1
       * @defaultValue `0.8`
       */
      quality: number | null;
    }

    interface ThumbnailCreationData extends InexactPartial<_ThumbnailCreationData> {}

    /**
     * @deprecated Replaced with {@link Scene.Database | `Scene.DatabaseOperation`}
     */
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    interface DatabaseOperations extends Document.Database.Operations<Scene.Implementation> {}

    /**
     * @deprecated Replaced with {@linkcode Scene.CreateData}
     */
    interface ConstructorData extends Scene.CreateData {}

    /**
     * @deprecated Replaced with {@link Scene.implementation | `Scene.ImplementationClass`}
     */
    type ConfiguredClass = ImplementationClass;

    /**
     * @deprecated Replaced with {@linkcode Scene.Implementation}
     */
    type ConfiguredInstance = Implementation;
  }

  /**
   * The client-side Scene document which extends the common BaseScene model.
   *
   * @see {@linkcode Scenes}            The world-level collection of Scene documents
   * @see {@linkcode SceneConfig}       The Scene configuration application
   *
   */
  class Scene extends ClientDocumentMixin(foundry.documents.BaseScene) {
    /**
     * @param data    - Initial data from which to construct the `Scene`
     * @param context - Construction context options
     */
    constructor(...args: Scene.ConstructorArgs);

    /**
     * Track the viewed position of each scene (while in memory only, not persisted)
     * When switching back to a previously viewed scene, we can automatically pan to the previous position.
     * @defaultValue `{}`
     * @remarks This is intentionally public because it is used in Canvas._initializeCanvasPosition() and Canvas.pan()
     */
    _viewPosition: Canvas.ViewPosition;

    /**
     * Track whether the scene is the active view
     * @defaultValue `this.active`
     */
    protected _view: boolean;

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
     * @param createData - (default: `{}`)
     * @param options    - (default: `{}`)
     */
    // data: not null (property access), context: not null (destructured)
    override clone<Save extends boolean | null | undefined = false>(
      data?: Scene.CreateData,
      context?: Document.CloneContext<Save>,
    ): Save extends true ? Promise<this> : this;

    override reset(): void;

    /**
     * @remarks If `source` is falsey, and the grid is hexagonal with the `legacyHex` flag set,
     * does some conversion on `object.grid.size` (leaving it numeric, no type change) before returning
     */
    override toObject(source?: boolean | null): fields.SchemaField.SourceData<Scene.Schema>;

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

    // _preCreate, _preCreateOperation, _onCreate, and _preUpdate, _onUpdate, _preDelete, and _onDelete are all overridden but with no signature changes.
    // For type simplicity they are left off. These methods historically have been the source of a large amount of computation from tsc.

    /**
     * Handle repositioning of placed objects when the Scene dimensions change
     * @private
     */
    protected _repositionObject(sceneUpdateData: Scene.UpdateData): Scene.UpdateData;

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

    // options: not null (parameter default only, destructured in super)
    override toCompendium<Options extends ClientDocument.ToCompendiumOptions | undefined = undefined>(
      pack?: CompendiumCollection<CompendiumCollection.Metadata> | null,
      options?: Options,
    ): ClientDocument.ToCompendiumReturnType<"Scene", Options>;

    /**
     * Create a 300px by 100px thumbnail image for this scene background
     * @param data - (default: `{}`)
     * @returns The created thumbnail data.
     */
    // data: not null (destructured)
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

    // context: not null (destructured)
    static override defaultName(context?: Document.DefaultNameContext<"Scene", Scene.Parent>): string;

    // data: not null (parameter default only), context: not null (destructured)
    static override createDialog(
      data?: Document.CreateDialogData<Scene.CreateData>,
      context?: Document.CreateDialogContext<"Scene", Scene.Parent>,
    ): Promise<Scene.Stored | null | undefined>;

    // options: not null (parameter default only)
    static override fromDropData(
      data: Document.DropData<Scene.Implementation>,
      options?: AnyObject,
    ): Promise<Scene.Implementation | undefined>;

    static override fromImport(
      source: Scene.Source,
      context?: Document.FromImportContext<Scene.Parent> | null,
    ): Promise<Scene.Implementation>;
  }

  /** @deprecated Replaced with {@linkcode Scene.Dimensions} */
  type SceneDimensions = Scene.Dimensions;
}
