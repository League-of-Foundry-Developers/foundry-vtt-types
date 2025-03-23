import type { InterfaceToObject } from "../../../../utils/index.d.mts";
import type Document from "../../../common/abstract/document.d.mts";
import type { DataSchema } from "../../../common/data/fields.d.mts";
import type { fields, LightData } from "../../../common/data/module.d.mts";

declare global {
  namespace AmbientLightDocument {
    /**
     * The document's name.
     */
    type Name = "AmbientLight";

    /**
     * The arguments to construct the document.
     */
    interface ConstructorArgs extends Document.ConstructorParameters<CreateData, Parent> {}

    /**
     * The documents embedded within AmbientLight.
     */
    type Hierarchy = Readonly<Document.HierarchyOf<Schema>>;

    /**
     * The implementation of the AmbientLightDocument document instance configured through `CONFIG.AmbientLight.documentClass` in Foundry and
     * {@link DocumentClassConfig | `DocumentClassConfig`} in fvtt-types.
     */
    type Implementation = Document.ImplementationFor<Name>;

    /**
     * The implementation of the AmbientLightDocument document configured through `CONFIG.AmbientLight.documentClass` in Foundry and
     * {@link DocumentClassConfig | `DocumentClassConfig`} in fvtt-types.
     */
    type ImplementationClass = Document.ImplementationClassFor<Name>;

    /**
     * A document's metadata is special information about the document ranging anywhere from its name,
     * whether it's indexed, or to the permissions a user has over it.
     */
    interface Metadata extends Document.MetadataFor<Name> {}

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
     * Types of CompendiumCollection this document might be contained in.
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
     * An instance of `AmbientLightDocument` that comes from the database.
     */
    interface Stored extends Document.Stored<AmbientLightDocument.Implementation> {}

    /**
     * The data put in {@link AmbientLightDocument._source | `AmbientLightDocument#_source`}. This data is what was
     * persisted to the database and therefore it must be valid JSON.
     *
     * For example a {@link fields.SetField | `SetField`} is persisted to the database as an array
     * but initialized as a {@link Set | `Set`}.
     *
     * `Source` and `PersistedData` are equivalent.
     */
    interface Source extends PersistedData {}

    /**
     * The data put in {@link AmbientLightDocument._source | `AmbientLightDocument#_source`}. This data is what was
     * persisted to the database and therefore it must be valid JSON.
     *
     * `Source` and `PersistedData` are equivalent.
     */
    interface PersistedData extends fields.SchemaField.PersistedData<Schema> {}

    /**
     * The data necessary to create a document. Used in places like {@link AmbientLightDocument.create | `AmbientLightDocument.create`}
     * and {@link AmbientLightDocument | `new AmbientLightDocument(...)`}.
     *
     * For example a {@link fields.SetField | `SetField`} can accept any {@link Iterable | `Iterable`}
     * with the right values. This means you can pass a `Set` instance, an array of values,
     * a generator, or any other iterable.
     */
    interface CreateData extends fields.SchemaField.CreateData<Schema> {}

    /**
     * The data after a {@link foundry.abstract.Document | `Document`} has been initialized, for example
     * {@link AmbientLightDocument.name | `AmbientLightDocument#name`}.
     *
     * This is data transformed from {@link AmbientLightDocument.Source | `AmbientLightDocument.Source`} and turned into more
     * convenient runtime data structures. For example a {@link fields.SetField | `SetField`} is
     * persisted to the database as an array of values but at runtime it is a `Set` instance.
     */
    interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

    /**
     * The data used to update a document, for example {@link AmbientLightDocument.update | `AmbientLightDocument#update`}.
     * It is a distinct type from {@link AmbientLightDocument.CreateData | `DeepPartial<AmbientLightDocument.CreateData>`} because
     * it has different rules for `null` and `undefined`.
     */
    interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

    /**
     * The schema for {@link AmbientLightDocument | `AmbientLightDocument`}. This is the source of truth for how an AmbientLightDocument document
     * must be structured.
     *
     * Foundry uses this schema to validate the structure of the {@link AmbientLightDocument | `AmbientLightDocument`}. For example
     * a {@link fields.StringField | `StringField`} will enforce that the value is a string. More
     * complex fields like {@link fields.SetField | `SetField`} goes through various conversions
     * starting as an array in the database, initialized as a set, and allows updates with any
     * iterable.
     */
    interface Schema extends DataSchema {
      /**
       * The _id which uniquely identifies this BaseAmbientLight embedded document
       * @defaultValue `null`
       */
      _id: fields.DocumentIdField;

      /**
       * The x-coordinate position of the origin of the light
       * @defaultValue `0`
       */
      x: fields.NumberField<{ required: true; integer: true; nullable: false; initial: 0 }>;

      /**
       * The y-coordinate position of the origin of the light
       * @defaultValue `0`
       */
      y: fields.NumberField<{ required: true; integer: true; nullable: false; initial: 0 }>;

      /**
       * The elevation of the sound
       * @defaultValue `0`
       */
      elevation: fields.NumberField<{ required: true; nullable: false; initial: 0 }>;

      /**
       * The angle of rotation for the tile between 0 and 360
       * @defaultValue `0`
       */
      rotation: fields.AngleField;

      /**
       * Whether or not this light source is constrained by Walls
       * @defaultValue `true`
       */
      walls: fields.BooleanField<{ initial: true }>;

      /**
       * Whether or not this light source provides a source of vision
       * @defaultValue `false`
       */
      vision: fields.BooleanField;

      /**
       * Light configuration data
       * @defaultValue see {@link LightData | `LightData`}
       */
      config: fields.EmbeddedDataField<typeof LightData>;

      /**
       * Is the light source currently hidden?
       * @defaultValue `false`
       */
      hidden: fields.BooleanField;

      /**
       * An object of optional key/value flags
       * @defaultValue `{}`
       */
      flags: fields.ObjectField.FlagsField<Name, InterfaceToObject<CoreFlags>>;
    }

    namespace Database {
      /** Options passed along in Get operations for AmbientLightDocuments */
      interface Get extends foundry.abstract.types.DatabaseGetOperation<AmbientLightDocument.Parent> {}

      /** Options passed along in Create operations for AmbientLightDocuments */
      interface Create<Temporary extends boolean | undefined = boolean | undefined>
        extends foundry.abstract.types.DatabaseCreateOperation<
          AmbientLightDocument.CreateData,
          AmbientLightDocument.Parent,
          Temporary
        > {}

      /** Options passed along in Delete operations for AmbientLightDocuments */
      interface Delete extends foundry.abstract.types.DatabaseDeleteOperation<AmbientLightDocument.Parent> {}

      /** Options passed along in Update operations for AmbientLightDocuments */
      interface Update
        extends foundry.abstract.types.DatabaseUpdateOperation<
          AmbientLightDocument.UpdateData,
          AmbientLightDocument.Parent
        > {
        animate?: boolean;
      }

      /** Operation for {@link AmbientLightDocument.createDocuments | `AmbientLightDocument.createDocuments`} */
      interface CreateDocumentsOperation<Temporary extends boolean | undefined>
        extends Document.Database.CreateOperation<AmbientLightDocument.Database.Create<Temporary>> {}

      /** Operation for {@link AmbientLightDocument.updateDocuments | `AmbientLightDocument.updateDocuments`} */
      interface UpdateDocumentsOperation
        extends Document.Database.UpdateDocumentsOperation<AmbientLightDocument.Database.Update> {}

      /** Operation for {@link AmbientLightDocument.deleteDocuments | `AmbientLightDocument.deleteDocuments`} */
      interface DeleteDocumentsOperation
        extends Document.Database.DeleteDocumentsOperation<AmbientLightDocument.Database.Delete> {}

      /** Operation for {@link AmbientLightDocument.create | `AmbientLightDocument.create`} */
      interface CreateOperation<Temporary extends boolean | undefined>
        extends Document.Database.CreateOperation<AmbientLightDocument.Database.Create<Temporary>> {}

      /** Operation for {@link AmbientLightDocument.update | `AmbientLightDocument#update`} */
      interface UpdateOperation extends Document.Database.UpdateOperation<Update> {}

      interface DeleteOperation extends Document.Database.DeleteOperation<Delete> {}

      /** Options for {@link AmbientLightDocument.get | `AmbientLightDocument.get`} */
      interface GetOptions extends Document.Database.GetOptions {}

      /** Options for {@link AmbientLightDocument._preCreate | `AmbientLightDocument#_preCreate`} */
      interface PreCreateOptions extends Document.Database.PreCreateOptions<Create> {}

      /** Options for {@link AmbientLightDocument._onCreate | `AmbientLightDocument#_onCreate`} */
      interface OnCreateOptions extends Document.Database.CreateOptions<Create> {}

      /** Operation for {@link AmbientLightDocument._preCreateOperation | `AmbientLightDocument._preCreateOperation`} */
      interface PreCreateOperation
        extends Document.Database.PreCreateOperationStatic<AmbientLightDocument.Database.Create> {}

      /** Operation for {@link AmbientLightDocument._onCreateOperation | `AmbientLightDocument#_onCreateOperation`} */
      interface OnCreateOperation extends AmbientLightDocument.Database.Create {}

      /** Options for {@link AmbientLightDocument._preUpdate | `AmbientLightDocument#_preUpdate`} */
      interface PreUpdateOptions extends Document.Database.PreUpdateOptions<Update> {}

      /** Options for {@link AmbientLightDocument._onUpdate | `AmbientLightDocument#_onUpdate`} */
      interface OnUpdateOptions extends Document.Database.UpdateOptions<Update> {}

      /** Operation for {@link AmbientLightDocument._preUpdateOperation | `AmbientLightDocument._preUpdateOperation`} */
      interface PreUpdateOperation extends AmbientLightDocument.Database.Update {}

      /** Operation for {@link AmbientLightDocument._onUpdateOperation | `AmbientLightDocument._preUpdateOperation`} */
      interface OnUpdateOperation extends AmbientLightDocument.Database.Update {}

      /** Options for {@link AmbientLightDocument._preDelete | `AmbientLightDocument#_preDelete`} */
      interface PreDeleteOptions extends Document.Database.PreDeleteOperationInstance<Delete> {}

      /** Options for {@link AmbientLightDocument._onDelete | `AmbientLightDocument#_onDelete`} */
      interface OnDeleteOptions extends Document.Database.DeleteOptions<Delete> {}

      /** Options for {@link AmbientLightDocument._preDeleteOperation | `AmbientLightDocument#_preDeleteOperation`} */
      interface PreDeleteOperation extends AmbientLightDocument.Database.Delete {}

      /** Options for {@link AmbientLightDocument._onDeleteOperation | `AmbientLightDocument#_onDeleteOperation`} */
      interface OnDeleteOperation extends AmbientLightDocument.Database.Delete {}

      /** Context for {@link AmbientLightDocument._onDeleteOperation | `AmbientLightDocument._onDeleteOperation`} */
      interface OnDeleteDocumentsContext extends Document.ModificationContext<AmbientLightDocument.Parent> {}

      /** Context for {@link AmbientLightDocument._onCreateDocuments | `AmbientLightDocument._onCreateDocuments`} */
      interface OnCreateDocumentsContext extends Document.ModificationContext<AmbientLightDocument.Parent> {}

      /** Context for {@link AmbientLightDocument._onUpdateDocuments | `AmbientLightDocument._onUpdateDocuments`} */
      interface OnUpdateDocumentsContext extends Document.ModificationContext<AmbientLightDocument.Parent> {}

      /**
       * Options for {@link AmbientLightDocument._preCreateDescendantDocuments | `AmbientLightDocument#_preCreateDescendantDocuments`}
       * and {@link AmbientLightDocument._onCreateDescendantDocuments | `AmbientLightDocument#_onCreateDescendantDocuments`}
       */
      interface CreateOptions extends Document.Database.CreateOptions<AmbientLightDocument.Database.Create> {}

      /**
       * Options for {@link AmbientLightDocument._preUpdateDescendantDocuments | `AmbientLightDocument#_preUpdateDescendantDocuments`}
       * and {@link AmbientLightDocument._onUpdateDescendantDocuments | `AmbientLightDocument#_onUpdateDescendantDocuments`}
       */
      interface UpdateOptions extends Document.Database.UpdateOptions<AmbientLightDocument.Database.Update> {}

      /**
       * Options for {@link AmbientLightDocument._preDeleteDescendantDocuments | `AmbientLightDocument#_preDeleteDescendantDocuments`}
       * and {@link AmbientLightDocument._onDeleteDescendantDocuments | `AmbientLightDocument#_onDeleteDescendantDocuments`}
       */
      interface DeleteOptions extends Document.Database.DeleteOptions<AmbientLightDocument.Database.Delete> {}
    }

    interface Flags extends Document.ConfiguredFlagsForName<Name> {}

    namespace Flags {
      type Scope = Document.FlagKeyOf<Flags>;
      type Key<Scope extends Flags.Scope> = Document.FlagKeyOf<Document.FlagGetKey<Flags, Scope>>;
      type Get<Scope extends Flags.Scope, Key extends Flags.Key<Scope>> = Document.GetFlag<Name, Scope, Key>;
    }

    interface CoreFlags {
      core?: {
        /** @remarks If provided, will be used for any light animations emanating from this token */
        animationSeed?: number;
      };
    }

    /**
     * @deprecated {@link AmbientLightDocument.Database | `AmbientLightDocument.DatabaseOperation`}
     */
    interface DatabaseOperations
      // eslint-disable-next-line @typescript-eslint/no-deprecated, @typescript-eslint/no-empty-object-type
      extends Document.Database.Operations<AmbientLightDocument, {}, { animate: boolean }, {}> {}

    /**
     * @deprecated {@link AmbientLightDocument.CreateData | `AmbientLightDocument.CreateData`}
     */
    interface ConstructorData extends AmbientLightDocument.CreateData {}

    /**
     * @deprecated {@link AmbientLightDocument.implementation | `AmbientLightDocument.ImplementationClass`}
     */
    type ConfiguredClass = ImplementationClass;

    /**
     * @deprecated {@link AmbientLightDocument.Implementation | `AmbientLightDocument.Implementation`}
     */
    type ConfiguredInstance = Implementation;
  }

  /**
   * The client-side AmbientLight document which extends the common BaseAmbientLight model.
   *
   * @see {@link Scene | `Scene`}                     The Scene document type which contains AmbientLight documents
   * @see {@link AmbientLightConfig | `AmbientLightConfig`}        The AmbientLight configuration application
   */
  class AmbientLightDocument extends CanvasDocumentMixin(foundry.documents.BaseAmbientLight) {
    /**
     * @param data    - Initial data from which to construct the `AmbientLightDocument`
     * @param context - Construction context options
     */
    constructor(...args: AmbientLightDocument.ConstructorArgs);

    /**
     * @privateRemarks _onUpdate is overridden but with no signature changes from its implementation in BaseAmbientLight.
     */

    /**
     * Is this ambient light source global in nature?
     */
    get isGlobal(): boolean;

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

    // Descendant Document operations have been left out because AmbientLight does not have any descendant documents.

    static override defaultName(
      context: Document.DefaultNameContext<"base", NonNullable<AmbientLightDocument.Parent>>,
    ): string;

    static override createDialog(
      data: Document.CreateDialogData<AmbientLightDocument.CreateData>,
      context: Document.CreateDialogContext<string, NonNullable<AmbientLightDocument.Parent>>,
    ): Promise<AmbientLightDocument.Stored | null | undefined>;

    static override fromDropData(
      data: Document.DropData<AmbientLightDocument.Implementation>,
      options?: Document.FromDropDataOptions,
    ): Promise<AmbientLightDocument.Implementation | undefined>;

    static override fromImport(
      source: AmbientLightDocument.Source,
      context?: Document.FromImportContext<AmbientLightDocument.Parent>,
    ): Promise<AmbientLightDocument.Implementation>;
  }
}
