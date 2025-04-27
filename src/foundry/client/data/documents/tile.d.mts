import type { InterfaceToObject, Merge } from "../../../../utils/index.d.mts";
import type Document from "../../../common/abstract/document.d.mts";
import type { DataSchema } from "../../../common/data/fields.d.mts";

import fields = foundry.data.fields;
import type { TextureData } from "@common/data/data.mjs";

declare global {
  namespace TileDocument {
    /**
     * The document's name.
     */
    type Name = "Tile";

    /**
     * The arguments to construct the document.
     */
    type ConstructorArgs = Document.ConstructorParameters<CreateData, Parent>;

    /**
     * The documents embedded within `Tile`.
     */
    type Hierarchy = Readonly<Document.HierarchyOf<Schema>>;

    /**
     * The implementation of the `TileDocument` document instance configured through `CONFIG.Tile.documentClass` in Foundry and
     * {@link DocumentClassConfig | `DocumentClassConfig`} or {@link ConfiguredTileDocument | `fvtt-types/configuration/ConfiguredTileDocument`} in fvtt-types.
     */
    type Implementation = Document.ImplementationFor<Name>;

    /**
     * The implementation of the `TileDocument` document configured through `CONFIG.Tile.documentClass` in Foundry and
     * {@link DocumentClassConfig | `DocumentClassConfig`} in fvtt-types.
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
          name: "Tile";
          collection: "tiles";
          label: string;
          labelPlural: string;
          schemaVersion: string;
        }>
      > {}

    // No need for Metadata namespace

    /**
     * A document's parent is something that can contain it.
     * For example an `Item` can be contained by an `Actor` which makes `Actor` one of its possible parents.
     */
    type Parent = Scene.Implementation | null;

    /**
     * A document's descendants are any child documents, grandchild documents, etc.
     * This is a union of all instances, or never if the document doesn't have any descendants.
     */
    type Descendant = never;

    /**
     * A document's descendants are any child documents, grandchild documents, etc.
     * This is a union of all classes, or never if the document doesn't have any descendants.
     */
    type DescendantClass = never;

    /**
     * Types of `CompendiumCollection` this document might be contained in.
     * Note that `this.pack` will always return a string; this is the type for `game.packs.get(this.pack)`
     */
    type Pack = CompendiumCollection.ForDocument<"Tile">;

    /**
     * An embedded document is a document contained in another.
     * For example an `Item` can be contained by an `Actor` which means `Item` can be embedded in `Actor`.
     *
     * If this is `never` it is because there are no embeddable documents (or there's a bug!).
     */
    type Embedded = never;

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
     * An instance of `TileDocument` that comes from the database but failed validation meaining that
     * its `system` and `_source` could theoretically be anything.
     */
    interface Invalid extends Document.Invalid<TileDocument.Implementation> {}

    /**
     * An instance of `TileDocument` that comes from the database.
     */
    interface Stored extends Document.Stored<TileDocument.Implementation> {}

    /**
     * The data put in {@link TileDocument._source | `TileDocument#_source`}. This data is what was
     * persisted to the database and therefore it must be valid JSON.
     *
     * For example a {@link fields.SetField | `SetField`} is persisted to the database as an array
     * but initialized as a {@link Set | `Set`}.
     */
    interface Source extends fields.SchemaField.SourceData<Schema> {}

    /**
     * @deprecated {@link TileDocument.Source | `TileDocument.Source`}
     */
    type PersistedData = Source;

    /**
     * The data necessary to create a document. Used in places like {@link TileDocument.create | `TileDocument.create`}
     * and {@link TileDocument | `new TileDocument(...)`}.
     *
     * For example a {@link fields.SetField | `SetField`} can accept any {@link Iterable | `Iterable`}
     * with the right values. This means you can pass a `Set` instance, an array of values,
     * a generator, or any other iterable.
     */
    // TODO: ensure `width` and `height` are required for creation
    interface CreateData extends fields.SchemaField.CreateData<Schema> {}

    /**
     * The data after a {@link foundry.abstract.Document | `Document`} has been initialized, for example
     * {@link TileDocument.name | `TileDocument#name`}.
     *
     * This is data transformed from {@link TileDocument.Source | `TileDocument.Source`} and turned into more
     * convenient runtime data structures. For example a {@link fields.SetField | `SetField`} is
     * persisted to the database as an array of values but at runtime it is a `Set` instance.
     */
    interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

    /**
     * The data used to update a document, for example {@link TileDocument.update | `TileDocument#update`}.
     * It is a distinct type from {@link TileDocument.CreateData | `DeepPartial<TileDocument.CreateData>`} because
     * it has different rules for `null` and `undefined`.
     */
    interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

    /**
     * The schema for {@link TileDocument | `TileDocument`}. This is the source of truth for how an TileDocument document
     * must be structured.
     *
     * Foundry uses this schema to validate the structure of the {@link TileDocument | `TileDocument`}. For example
     * a {@link fields.StringField | `StringField`} will enforce that the value is a string. More
     * complex fields like {@link fields.SetField | `SetField`} goes through various conversions
     * starting as an array in the database, initialized as a set, and allows updates with any
     * iterable.
     */
    interface Schema extends DataSchema {
      /**
       * The _id which uniquely identifies this Tile embedded document
       * @defaultValue `null`
       */
      _id: fields.DocumentIdField;

      /**
       * An image or video texture which this tile displays.
       */
      texture: TextureData<{ initial: { anchorX: 0.5; anchorY: 0.5; alphaThreshold: 0.75 } }>;

      /**
       * The pixel width of the tile
       */
      // FIXME: This field is `required` with no `initial`, so actually required for construction; Currently an AssignmentType override is required to enforce this
      width: fields.NumberField<{ required: true; min: 0; nullable: false; step: 0.1 }, number>;

      /**
       * The pixel height of the tile
       */
      // FIXME: This field is `required` with no `initial`, so actually required for construction; Currently an AssignmentType override is required to enforce this
      height: fields.NumberField<{ required: true; min: 0; nullable: false; step: 0.1 }, number>;

      /**
       * The x-coordinate position of the top-left corner of the tile
       * @defaultValue `0`
       */
      x: fields.NumberField<{ required: true; integer: true; nullable: false; initial: 0; label: "XCoord" }>;

      /**
       * The y-coordinate position of the top-left corner of the tile
       * @defaultValue `0`
       */
      y: fields.NumberField<{ required: true; integer: true; nullable: false; initial: 0; label: "YCoord" }>;

      /**
       * The elevation of the tile
       * @defaultValue `0`
       */
      elevation: fields.NumberField<{ required: true; nullable: false; initial: 0 }>;

      /**
       * The z-index of this tile relative to other siblings
       * @defaultValue `0`
       */
      sort: fields.NumberField<{ required: true; integer: true; nullable: false; initial: 0 }>;

      /**
       * The angle of rotation for the tile between 0 and 360
       * @defaultValue `0`
       */
      rotation: fields.AngleField;

      /**
       * The tile opacity
       * @defaultValue `1`
       */
      alpha: fields.AlphaField;

      /**
       * Is the tile currently hidden?
       * @defaultValue `false`
       */
      hidden: fields.BooleanField;

      /**
       * Is the tile currently locked?
       * @defaultValue `false`
       */
      locked: fields.BooleanField;

      /** @defaultValue see properties */
      restrictions: fields.SchemaField<{
        /** @defaultValue `false` */
        light: fields.BooleanField;

        /** @defaultValue `false` */
        weather: fields.BooleanField;
      }>;

      /**
       * The tile's occlusion settings
       * @defaultValue see properties
       */
      occlusion: fields.SchemaField<{
        /**
         * The occlusion mode from CONST.TILE_OCCLUSION_MODES
         * @defaultValue `1`
         */
        mode: fields.NumberField<
          {
            choices: CONST.OCCLUSION_MODES[];
            initial: typeof CONST.OCCLUSION_MODES.NONE;
            validationError: "must be a value in CONST.TILE_OCCLUSION_MODES";
          },
          // FIXME: Without these overrides, the branded type from `choices` is not respected, and the field types as `number`
          CONST.OCCLUSION_MODES | null | undefined,
          CONST.OCCLUSION_MODES | null,
          CONST.OCCLUSION_MODES | null
        >;

        /**
         * The occlusion alpha between 0 and 1
         * @defaultValue `0`
         */
        alpha: fields.AlphaField<{ initial: 0 }>;
      }>;

      /**
       * The tile's video settings
       * @defaultValue see properties
       */
      video: fields.SchemaField<{
        /**
         * Automatically loop the video?
         * @defaultValue `true`
         */
        loop: fields.BooleanField<{ initial: true }>;

        /**
         * Should the video play automatically?
         * @defaultValue `true`
         */
        autoplay: fields.BooleanField<{ initial: true }>;

        /**
         * The volume level of any audio that the video file contains
         * @defaultValue `0`
         */
        volume: fields.AlphaField<{ initial: 0; step: 0.01 }>;
      }>;

      /**
       * An object of optional key/value flags
       * @defaultValue `{}`
       */
      flags: fields.ObjectField.FlagsField<Name, InterfaceToObject<CoreFlags>>;
    }

    namespace Database {
      /** Options passed along in Get operations for TileDocuments */
      interface Get extends foundry.abstract.types.DatabaseGetOperation<TileDocument.Parent> {}

      /** Options passed along in Create operations for TileDocuments */
      interface Create<Temporary extends boolean | undefined = boolean | undefined>
        extends foundry.abstract.types.DatabaseCreateOperation<
          TileDocument.CreateData,
          TileDocument.Parent,
          Temporary
        > {}

      /** Options passed along in Delete operations for TileDocuments */
      interface Delete extends foundry.abstract.types.DatabaseDeleteOperation<TileDocument.Parent> {}

      /** Options passed along in Update operations for TileDocuments */
      interface Update
        extends foundry.abstract.types.DatabaseUpdateOperation<TileDocument.UpdateData, TileDocument.Parent> {}

      /** Operation for {@link TileDocument.createDocuments | `TileDocument.createDocuments`} */
      interface CreateDocumentsOperation<Temporary extends boolean | undefined>
        extends Document.Database.CreateOperation<TileDocument.Database.Create<Temporary>> {}

      /** Operation for {@link TileDocument.updateDocuments | `TileDocument.updateDocuments`} */
      interface UpdateDocumentsOperation
        extends Document.Database.UpdateDocumentsOperation<TileDocument.Database.Update> {}

      /** Operation for {@link TileDocument.deleteDocuments | `TileDocument.deleteDocuments`} */
      interface DeleteDocumentsOperation
        extends Document.Database.DeleteDocumentsOperation<TileDocument.Database.Delete> {}

      /** Operation for {@link TileDocument.create | `TileDocument.create`} */
      interface CreateOperation<Temporary extends boolean | undefined>
        extends Document.Database.CreateOperation<TileDocument.Database.Create<Temporary>> {}

      /** Operation for {@link TileDocument.update | `TileDocument#update`} */
      interface UpdateOperation extends Document.Database.UpdateOperation<Update> {}

      interface DeleteOperation extends Document.Database.DeleteOperation<Delete> {}

      /** Options for {@link TileDocument.get | `TileDocument.get`} */
      interface GetOptions extends Document.Database.GetOptions {}

      /** Options for {@link TileDocument._preCreate | `TileDocument#_preCreate`} */
      interface PreCreateOptions extends Document.Database.PreCreateOptions<Create> {}

      /** Options for {@link TileDocument._onCreate | `TileDocument#_onCreate`} */
      interface OnCreateOptions extends Document.Database.CreateOptions<Create> {}

      /** Operation for {@link TileDocument._preCreateOperation | `TileDocument._preCreateOperation`} */
      interface PreCreateOperation extends Document.Database.PreCreateOperationStatic<TileDocument.Database.Create> {}

      /** Operation for {@link TileDocument._onCreateOperation | `TileDocument#_onCreateOperation`} */
      interface OnCreateOperation extends TileDocument.Database.Create {}

      /** Options for {@link TileDocument._preUpdate | `TileDocument#_preUpdate`} */
      interface PreUpdateOptions extends Document.Database.PreUpdateOptions<Update> {}

      /** Options for {@link TileDocument._onUpdate | `TileDocument#_onUpdate`} */
      interface OnUpdateOptions extends Document.Database.UpdateOptions<Update> {}

      /** Operation for {@link TileDocument._preUpdateOperation | `TileDocument._preUpdateOperation`} */
      interface PreUpdateOperation extends TileDocument.Database.Update {}

      /** Operation for {@link TileDocument._onUpdateOperation | `TileDocument._preUpdateOperation`} */
      interface OnUpdateOperation extends TileDocument.Database.Update {}

      /** Options for {@link TileDocument._preDelete | `TileDocument#_preDelete`} */
      interface PreDeleteOptions extends Document.Database.PreDeleteOperationInstance<Delete> {}

      /** Options for {@link TileDocument._onDelete | `TileDocument#_onDelete`} */
      interface OnDeleteOptions extends Document.Database.DeleteOptions<Delete> {}

      /** Options for {@link TileDocument._preDeleteOperation | `TileDocument#_preDeleteOperation`} */
      interface PreDeleteOperation extends TileDocument.Database.Delete {}

      /** Options for {@link TileDocument._onDeleteOperation | `TileDocument#_onDeleteOperation`} */
      interface OnDeleteOperation extends TileDocument.Database.Delete {}

      /** Context for {@link TileDocument._onDeleteOperation | `TileDocument._onDeleteOperation`} */
      interface OnDeleteDocumentsContext extends Document.ModificationContext<TileDocument.Parent> {}

      /** Context for {@link TileDocument._onCreateDocuments | `TileDocument._onCreateDocuments`} */
      interface OnCreateDocumentsContext extends Document.ModificationContext<TileDocument.Parent> {}

      /** Context for {@link TileDocument._onUpdateDocuments | `TileDocument._onUpdateDocuments`} */
      interface OnUpdateDocumentsContext extends Document.ModificationContext<TileDocument.Parent> {}

      /**
       * Options for {@link TileDocument._preCreateDescendantDocuments | `TileDocument#_preCreateDescendantDocuments`}
       * and {@link TileDocument._onCreateDescendantDocuments | `TileDocument#_onCreateDescendantDocuments`}
       */
      interface CreateOptions extends Document.Database.CreateOptions<TileDocument.Database.Create> {}

      /**
       * Options for {@link TileDocument._preUpdateDescendantDocuments | `TileDocument#_preUpdateDescendantDocuments`}
       * and {@link TileDocument._onUpdateDescendantDocuments | `TileDocument#_onUpdateDescendantDocuments`}
       */
      interface UpdateOptions extends Document.Database.UpdateOptions<TileDocument.Database.Update> {}

      /**
       * Options for {@link TileDocument._preDeleteDescendantDocuments | `TileDocument#_preDeleteDescendantDocuments`}
       * and {@link TileDocument._onDeleteDescendantDocuments | `TileDocument#_onDeleteDescendantDocuments`}
       */
      interface DeleteOptions extends Document.Database.DeleteOptions<TileDocument.Database.Delete> {}
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

    interface CoreFlags {
      core?: {
        /**
         * @deprecated since v12, until 14
         * @remarks "Tiling Sprites are deprecated without replacement."
         */
        isTilingSprite?: boolean;

        /** @remarks If true, and texture.src is a video, it will jump to a random timestamp every time the tile is drawn */
        randomizeVideo?: boolean;
      };
    }

    /**
     * @deprecated {@link TileDocument.Database | `TileDocument.DatabaseOperation`}
     */
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    interface DatabaseOperations extends Document.Database.Operations<TileDocument.Implementation> {}

    /**
     * @deprecated {@link TileDocument.CreateData | `TileDocument.CreateData`}
     */
    interface ConstructorData extends TileDocument.CreateData {}

    /**
     * @deprecated {@link TileDocument.implementation | `TileDocument.ImplementationClass`}
     */
    type ConfiguredClass = ImplementationClass;

    /**
     * @deprecated {@link TileDocument.Implementation | `TileDocument.Implementation`}
     */
    type ConfiguredInstance = Implementation;
  }

  /**
   * The client-side Tile document which extends the common BaseTile model.
   *
   * @see {@link Scene | `Scene`}            The Scene document type which contains Tile embedded documents
   * @see {@link TileConfig | `TileConfig`}       The Tile configuration application
   */
  class TileDocument extends CanvasDocumentMixin(foundry.documents.BaseTile) {
    /**
     * @param data    - Initial data from which to construct the `TileDocument`
     * @param context - Construction context options
     */
    constructor(...args: TileDocument.ConstructorArgs);

    override prepareDerivedData(): void;

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

    // Descendant Document operations have been left out because Tile does not have any descendant documents.

    static override defaultName(context: Document.DefaultNameContext<"base", NonNullable<TileDocument.Parent>>): string;

    static override createDialog(
      data: Document.CreateDialogData<TileDocument.CreateData>,
      context: Document.CreateDialogContext<string, NonNullable<TileDocument.Parent>>,
    ): Promise<TileDocument.Stored | null | undefined>;

    static override fromDropData(
      data: Document.DropData<TileDocument.Implementation>,
      options?: Document.FromDropDataOptions,
    ): Promise<TileDocument.Implementation | undefined>;

    static override fromImport(
      source: TileDocument.Source,
      context?: Document.FromImportContext<TileDocument.Parent>,
    ): Promise<TileDocument.Implementation>;

    // Embedded document operations have been left out because Tile does not have any embedded documents.
  }
}
