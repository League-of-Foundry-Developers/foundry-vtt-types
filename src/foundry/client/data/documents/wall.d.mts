import type { Merge } from "../../../../utils/index.d.mts";
import type Document from "../../../common/abstract/document.d.mts";
import type { DataSchema } from "../../../common/data/fields.d.mts";
import type { fields } from "../../../common/data/module.d.mts";

declare global {
  namespace WallDocument {
    /**
     * The document's name.
     */
    type Name = "Wall";

    /**
     * The arguments to construct the document.
     */
    interface ConstructorArgs extends Document.ConstructorParameters<CreateData, Parent> {}

    /**
     * The documents embedded within `WallDocument`.
     */
    type Hierarchy = Readonly<Document.HierarchyOf<Schema>>;

    /**
     * The implementation of the `WallDocument` document instance configured through `CONFIG.Wall.documentClass` in Foundry and
     * {@link DocumentClassConfig | `DocumentClassConfig`} or {@link ConfiguredWallDocument | `fvtt-types/configuration/ConfiguredWallDocument`} in fvtt-types.
     */
    type Implementation = Document.ImplementationFor<Name>;

    /**
     * The implementation of the `WallDocument` document configured through `CONFIG.Wall.documentClass` in Foundry and
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
          name: "Wall";
          collection: "walls";
          label: string;
          labelPlural: string;
          permissions: Metadata.Permissions;
          schemaVersion: string;
        }>
      > {}

    namespace Metadata {
      /**
       * The permissions for whether a certain user can create, update, or delete this document.
       */
      interface Permissions {
        update(user: User.Internal.Implementation, doc: Implementation, data: UpdateData): boolean;
      }
    }

    /**
     * A document's parent is something that can contain it.
     * For example an `Item` can be contained by an `Actor` which makes `Actor` one of its possible parents.
     */
    type Parent = Scene.Implementation | null;

    /**
     * A document's descendants are any child documents, grandchild documents, etc.
     * This is a union of all instances, or never if the document doesn't have any descendants.
     */
    type Descendants = never;

    /**
     * A document's descendants are any child documents, grandchild documents, etc.
     * This is a union of all classes, or never if the document doesn't have any descendants.
     */
    type DescendantClasses = never;

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
    type Embedded = Document.ImplementationFor<EmbeddedName>;

    /**
     * An embedded document is a document contained in another.
     * For example an `Item` can be contained by an `Actor` which means `Item` can be embedded in `Actor`.
     *
     * If this is `never` it is because there are no embeddable documents (or there's a bug!).
     */
    type EmbeddedName = Document.EmbeddableNamesFor<Metadata>;

    type CollectionNameOf<CollectionName extends EmbeddedName> = CollectionName extends keyof Metadata["embedded"]
      ? Metadata["embedded"][CollectionName]
      : CollectionName;

    type EmbeddedCollectionName = Document.CollectionNamesFor<Metadata>;

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
     * An instance of `WallDocument` that comes from the database.
     */
    interface Stored extends Document.Stored<WallDocument.Implementation> {}

    /**
     * The data put in {@link foundry.abstract.DataModel._source | `DataModel#_source`}. This data is what was
     * persisted to the database and therefore it must be valid JSON.
     *
     * For example a {@link fields.SetField | `SetField`} is persisted to the database as an array
     * but initialized as a {@link Set | `Set`}.
     *
     * `Source` and `PersistedData` are equivalent.
     */
    interface Source extends PersistedData {}

    /**
     * The data put in {@link WallDocument._source | `WallDocument#_source`}. This data is what was
     * persisted to the database and therefore it must be valid JSON.
     *
     * `Source` and `PersistedData` are equivalent.
     */
    interface PersistedData extends fields.SchemaField.PersistedData<Schema> {}

    /**
     * The data necessary to create a document. Used in places like {@link WallDocument.create | `WallDocument.create`}
     * and {@link WallDocument | `new WallDocument(...)`}.
     *
     * For example a {@link fields.SetField | `SetField`} can accept any {@link Iterable | `Iterable`}
     * with the right values. This means you can pass a `Set` instance, an array of values,
     * a generator, or any other iterable.
     */
    //TODO: ensure `c` is required for creation
    interface CreateData extends fields.SchemaField.CreateData<Schema> {}

    /**
     * The data after a {@link foundry.abstract.Document | `Document`} has been initialized, for example
     * {@link WallDocument.name | `WallDocument#name`}.
     *
     * This is data transformed from {@link WallDocument.Source | `WallDocument.Source`} and turned into more
     * convenient runtime data structures. For example a {@link fields.SetField | `SetField`} is
     * persisted to the database as an array of values but at runtime it is a `Set` instance.
     */
    interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

    /**
     * The data used to update a document, for example {@link WallDocument.update | `WallDocument#update`}.
     * It is a distinct type from {@link WallDocument.CreateData | `DeepPartial<WallDocument.CreateData>`} because
     * it has different rules for `null` and `undefined`.
     */
    interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

    interface ThresholdSchema extends DataSchema {
      /**
       * Minimum distance from a light source for which this wall blocks light
       */
      light: fields.NumberField<{ required: true; nullable: true; initial: null; positive: true }>;

      /**
       * Minimum distance from a vision source for which this wall blocks vision
       */
      sight: fields.NumberField<{ required: true; nullable: true; initial: null; positive: true }>;

      /**
       * Minimum distance from a sound source for which this wall blocks sound
       */
      sound: fields.NumberField<{ required: true; nullable: true; initial: null; positive: true }>;

      /**
       * Whether to attenuate the source radius when passing through the wall
       */
      attenuation: fields.BooleanField;
    }

    /**
     * The schema for {@link WallDocument | `WallDocument`}. This is the source of truth for how an WallDocument document
     * must be structured.
     *
     * Foundry uses this schema to validate the structure of the {@link WallDocument | `WallDocument`}. For example
     * a {@link fields.StringField | `StringField`} will enforce that the value is a string. More
     * complex fields like {@link fields.SetField | `SetField`} goes through various conversions
     * starting as an array in the database, initialized as a set, and allows updates with any
     * iterable.
     */
    interface Schema extends DataSchema {
      /**
       * The _id which uniquely identifies this BaseWall embedded document
       * @defaultValue `null`
       */
      _id: fields.DocumentIdField;

      /**
       * The wall coordinates, a length-4 array of finite numbers [x0,y0,x1,y1]
       */
      c: fields.ArrayField<
        fields.NumberField<{ required: true; integer: true; nullable: false }>,
        {
          validate: (c: unknown) => c is [x0: number, y0: number, x1: number, y1: number];
          validationError: "must be a length-4 array of integer coordinates";
        },
        // TODO(LukeAbby): Make the array shape easier to override.
        fields.ArrayField.AssignmentElementType<fields.NumberField<{ required: true; integer: true; nullable: false }>>,
        fields.ArrayField.InitializedElementType<
          fields.NumberField<{ required: true; integer: true; nullable: false }>
        >,
        //FIXME: This field is `required` with no `initial`, so actually required for construction; Currently an AssignmentType override is required to enforce this
        [x0: number, y0: number, x1: number, y1: number],
        [x0: number, y0: number, x1: number, y1: number],
        fields.ArrayField.PersistedElementType<fields.NumberField<{ required: true; integer: true; nullable: false }>>,
        [x0: number, y0: number, x1: number, y1: number]
      >;

      /**
       * The illumination restriction type of this wall
       * @defaultValue `CONST.WALL_SENSE_TYPES.NORMAL` (`20`)
       */
      light: fields.NumberField<
        {
          required: true;
          choices: CONST.WALL_SENSE_TYPES[];
          initial: typeof CONST.WALL_SENSE_TYPES.NORMAL;
          validationError: "must be a value in CONST.WALL_SENSE_TYPES";
        },
        //FIXME: Without these overrides, the branded type from `choices` is not respected, and the field types as `number`
        CONST.WALL_SENSE_TYPES | null | undefined,
        CONST.WALL_SENSE_TYPES | null,
        CONST.WALL_SENSE_TYPES | null
      >;

      /**
       * The movement restriction type of this wall
       * @defaultValue `CONST.WALL_MOVEMENT_TYPES.NORMAL` (`20`)
       */
      move: fields.NumberField<
        {
          required: true;
          choices: CONST.WALL_MOVEMENT_TYPES[];
          initial: typeof CONST.WALL_MOVEMENT_TYPES.NORMAL;
          validationError: "must be a value in CONST.WALL_MOVEMENT_TYPES";
        },
        //FIXME: Without these overrides, the branded type from `choices` is not respected, and the field types as `number`
        CONST.WALL_MOVEMENT_TYPES | null | undefined,
        CONST.WALL_MOVEMENT_TYPES | null,
        CONST.WALL_MOVEMENT_TYPES | null
      >;

      /**
       * The visual restriction type of this wall
       * @defaultValue `CONST.WALL_SENSE_TYPES.NORMAL` (`20`)
       */
      sight: fields.NumberField<
        {
          required: true;
          choices: CONST.WALL_SENSE_TYPES[];
          initial: typeof CONST.WALL_SENSE_TYPES.NORMAL;
          validationError: "must be a value in CONST.WALL_SENSE_TYPES";
        },
        //FIXME: Without these overrides, the branded type from `choices` is not respected, and the field types as `number`
        CONST.WALL_SENSE_TYPES | null | undefined,
        CONST.WALL_SENSE_TYPES | null,
        CONST.WALL_SENSE_TYPES | null
      >;

      /**
       * The auditory restriction type of this wall
       * @defaultValue `CONST.WALL_SENSE_TYPES.NORMAL` (`20`)
       */
      sound: fields.NumberField<
        {
          required: true;
          choices: CONST.WALL_SENSE_TYPES[];
          initial: typeof CONST.WALL_SENSE_TYPES.NORMAL;
          validationError: "must be a value in CONST.WALL_SENSE_TYPES";
        },
        //FIXME: Without these overrides, the branded type from `choices` is not respected, and the field types as `number`
        CONST.WALL_SENSE_TYPES | null | undefined,
        CONST.WALL_SENSE_TYPES | null,
        CONST.WALL_SENSE_TYPES | null
      >;

      /**
       * The direction of effect imposed by this wall
       * @defaultValue `CONST.WALL_DIRECTIONS.BOTH` (`0`)
       */
      dir: fields.NumberField<
        {
          required: true;
          choices: CONST.WALL_DIRECTIONS[];
          initial: typeof CONST.WALL_DIRECTIONS.BOTH;
          validationError: "must be a value in CONST.WALL_DIRECTIONS";
        },
        //FIXME: Without these overrides, the branded type from `choices` is not respected, and the field types as `number`
        CONST.WALL_DIRECTIONS | null | undefined,
        CONST.WALL_DIRECTIONS | null,
        CONST.WALL_DIRECTIONS | null
      >;

      /**
       * The type of door which this wall contains, if any
       * @defaultValue `CONST.WALL_DOOR_TYPES.NONE` (`0`)
       */
      door: fields.NumberField<
        {
          required: true;
          choices: CONST.WALL_DOOR_TYPES[];
          initial: typeof CONST.WALL_DOOR_TYPES.NONE;
          validationError: "must be a value in CONST.WALL_DOOR_TYPES";
        },
        //FIXME: Without these overrides, the branded type from `choices` is not respected, and the field types as `number`
        CONST.WALL_DOOR_TYPES | null | undefined,
        CONST.WALL_DOOR_TYPES | null,
        CONST.WALL_DOOR_TYPES | null
      >;

      /**
       * The state of the door this wall contains, if any
       * @defaultValue `CONST.WALL_DOOR_STATES.CLOSED` (`0`)
       */
      ds: fields.NumberField<
        {
          required: true;
          choices: CONST.WALL_DOOR_STATES[];
          initial: typeof CONST.WALL_DOOR_STATES.CLOSED;
          validationError: "must be a value in CONST.WALL_DOOR_STATES";
        },
        //FIXME: Without these overrides, the branded type from `choices` is not respected, and the field types as `number`
        CONST.WALL_DOOR_STATES | null | undefined,
        CONST.WALL_DOOR_STATES | null,
        CONST.WALL_DOOR_STATES | null
      >;

      /**
       * @remarks TThis isn't enforced by the field, but should be in `keyof CONFIG.Wall.doorSounds`
       * @defaultValue `undefined`
       */
      doorSound: fields.StringField<{ required: false; blank: true; initial: undefined }>;

      /**
       * Configuration of threshold data for this wall
       * @defaultValue see properties
       */
      threshold: fields.SchemaField<ThresholdSchema>;

      /**
       * An object of optional key/value flags
       * @defaultValue `{}`
       */
      flags: fields.ObjectField.FlagsField<Name>;
    }

    namespace Database {
      /** Options passed along in Get operations for WallDocuments */
      interface Get extends foundry.abstract.types.DatabaseGetOperation<WallDocument.Parent> {}

      /** Options passed along in Create operations for WallDocuments */
      interface Create<Temporary extends boolean | undefined = boolean | undefined>
        extends foundry.abstract.types.DatabaseCreateOperation<
          WallDocument.CreateData,
          WallDocument.Parent,
          Temporary
        > {}

      /** Options passed along in Delete operations for WallDocuments */
      interface Delete extends foundry.abstract.types.DatabaseDeleteOperation<WallDocument.Parent> {}

      /** Options passed along in Update operations for WallDocuments */
      interface Update
        extends foundry.abstract.types.DatabaseUpdateOperation<WallDocument.UpdateData, WallDocument.Parent> {}

      /** Operation for {@link WallDocument.createDocuments | `WallDocument.createDocuments`} */
      interface CreateDocumentsOperation<Temporary extends boolean | undefined>
        extends Document.Database.CreateOperation<WallDocument.Database.Create<Temporary>> {}

      /** Operation for {@link WallDocument.updateDocuments | `WallDocument.updateDocuments`} */
      interface UpdateDocumentsOperation
        extends Document.Database.UpdateDocumentsOperation<WallDocument.Database.Update> {}

      /** Operation for {@link WallDocument.deleteDocuments | `WallDocument.deleteDocuments`} */
      interface DeleteDocumentsOperation
        extends Document.Database.DeleteDocumentsOperation<WallDocument.Database.Delete> {}

      /** Operation for {@link WallDocument.create | `WallDocument.create`} */
      interface CreateOperation<Temporary extends boolean | undefined>
        extends Document.Database.CreateOperation<WallDocument.Database.Create<Temporary>> {}

      /** Operation for {@link WallDocument.update | `WallDocument#update`} */
      interface UpdateOperation extends Document.Database.UpdateOperation<Update> {}

      interface DeleteOperation extends Document.Database.DeleteOperation<Delete> {}

      /** Options for {@link WallDocument.get | `WallDocument.get`} */
      interface GetOptions extends Document.Database.GetOptions {}

      /** Options for {@link WallDocument._preCreate | `WallDocument#_preCreate`} */
      interface PreCreateOptions extends Document.Database.PreCreateOptions<Create> {}

      /** Options for {@link WallDocument._onCreate | `WallDocument#_onCreate`} */
      interface OnCreateOptions extends Document.Database.CreateOptions<Create> {}

      /** Operation for {@link WallDocument._preCreateOperation | `WallDocument._preCreateOperation`} */
      interface PreCreateOperation extends Document.Database.PreCreateOperationStatic<WallDocument.Database.Create> {}

      /** Operation for {@link WallDocument._onCreateOperation | `WallDocument#_onCreateOperation`} */
      interface OnCreateOperation extends WallDocument.Database.Create {}

      /** Options for {@link WallDocument._preUpdate | `WallDocument#_preUpdate`} */
      interface PreUpdateOptions extends Document.Database.PreUpdateOptions<Update> {}

      /** Options for {@link WallDocument._onUpdate | `WallDocument#_onUpdate`} */
      interface OnUpdateOptions extends Document.Database.UpdateOptions<Update> {}

      /** Operation for {@link WallDocument._preUpdateOperation | `WallDocument._preUpdateOperation`} */
      interface PreUpdateOperation extends WallDocument.Database.Update {}

      /** Operation for {@link WallDocument._onUpdateOperation | `WallDocument._preUpdateOperation`} */
      interface OnUpdateOperation extends WallDocument.Database.Update {}

      /** Options for {@link WallDocument._preDelete | `WallDocument#_preDelete`} */
      interface PreDeleteOptions extends Document.Database.PreDeleteOperationInstance<Delete> {}

      /** Options for {@link WallDocument._onDelete | `WallDocument#_onDelete`} */
      interface OnDeleteOptions extends Document.Database.DeleteOptions<Delete> {}

      /** Options for {@link WallDocument._preDeleteOperation | `WallDocument#_preDeleteOperation`} */
      interface PreDeleteOperation extends WallDocument.Database.Delete {}

      /** Options for {@link WallDocument._onDeleteOperation | `WallDocument#_onDeleteOperation`} */
      interface OnDeleteOperation extends WallDocument.Database.Delete {}

      /** Context for {@link WallDocument._onDeleteOperation | `WallDocument._onDeleteOperation`} */
      interface OnDeleteDocumentsContext extends Document.ModificationContext<WallDocument.Parent> {}

      /** Context for {@link WallDocument._onCreateDocuments | `WallDocument._onCreateDocuments`} */
      interface OnCreateDocumentsContext extends Document.ModificationContext<WallDocument.Parent> {}

      /** Context for {@link WallDocument._onUpdateDocuments | `WallDocument._onUpdateDocuments`} */
      interface OnUpdateDocumentsContext extends Document.ModificationContext<WallDocument.Parent> {}

      /**
       * Options for {@link WallDocument._preCreateDescendantDocuments | `WallDocument#_preCreateDescendantDocuments`}
       * and {@link WallDocument._onCreateDescendantDocuments | `WallDocument#_onCreateDescendantDocuments`}
       */
      interface CreateOptions extends Document.Database.CreateOptions<WallDocument.Database.Create> {}

      /**
       * Options for {@link WallDocument._preUpdateDescendantDocuments | `WallDocument#_preUpdateDescendantDocuments`}
       * and {@link WallDocument._onUpdateDescendantDocuments | `WallDocument#_onUpdateDescendantDocuments`}
       */
      interface UpdateOptions extends Document.Database.UpdateOptions<WallDocument.Database.Update> {}

      /**
       * Options for {@link WallDocument._preDeleteDescendantDocuments | `WallDocument#_preDeleteDescendantDocuments`}
       * and {@link WallDocument._onDeleteDescendantDocuments | `WallDocument#_onDeleteDescendantDocuments`}
       */
      interface DeleteOptions extends Document.Database.DeleteOptions<WallDocument.Database.Delete> {}
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

    /**
     * @deprecated {@link WallDocument.Database | `WallDocument.DatabaseOperation`}
     */
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    interface DatabaseOperations extends Document.Database.Operations<WallDocument> {}

    /**
     * @deprecated {@link WallDocument.CreateData | `WallDocument.CreateData`}
     */
    interface ConstructorData extends WallDocument.CreateData {}

    /**
     * @deprecated {@link WallDocument.implementation | `WallDocument.ImplementationClass`}
     */
    type ConfiguredClass = ImplementationClass;

    /**
     * @deprecated {@link WallDocument.Implementation | `WallDocument.Implementation`}
     */
    type ConfiguredInstance = Implementation;
  }

  /**
   * The client-side Wall document which extends the common BaseWall model.
   *
   * @see {@link Scene | `Scene`}            The Scene document type which contains Wall embedded documents
   * @see {@link WallConfig | `WallConfig`}       The Wall configuration application
   */
  class WallDocument extends CanvasDocumentMixin(foundry.documents.BaseWall) {
    /**
     * @param data    - Initial data from which to construct the `WallDocument`
     * @param context - Construction context options
     */
    constructor(...args: WallDocument.ConstructorArgs);

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

    // Descendant Document operations have been left out because Wall does not have any descendant documents.

    static override defaultName(context: Document.DefaultNameContext<"base", NonNullable<WallDocument.Parent>>): string;

    static override createDialog(
      data: Document.CreateDialogData<WallDocument.CreateData>,
      context: Document.CreateDialogContext<string, NonNullable<WallDocument.Parent>>,
    ): Promise<WallDocument.Stored | null | undefined>;

    static override fromDropData(
      data: Document.DropData<WallDocument.Implementation>,
      options?: Document.FromDropDataOptions,
    ): Promise<WallDocument.Implementation | undefined>;

    static override fromImport(
      source: WallDocument.Source,
      context?: Document.FromImportContext<WallDocument.Parent>,
    ): Promise<WallDocument.Implementation>;

    // Embedded document operations have been left out because Wall does not have any embedded documents.
  }
}
