import type Document from "../../../common/abstract/document.d.mts";
import type { DataSchema } from "../../../common/data/fields.d.mts";
import type { fields, LightData } from "../../../common/data/module.d.mts";

declare global {
  namespace AmbientLightDocument {
    /**
     * The implementation of the AmbientLightDocument document instance configured through `CONFIG.AmbientLight.documentClass` in Foundry and
     * {@link DocumentClassConfig | `DocumentClassConfig`} in fvtt-types.
     */
    type Implementation = Document.ConfiguredInstanceForName<"AmbientLight">;

    /**
     * The implementation of the AmbientLightDocument document configured through `CONFIG.AmbientLight.documentClass` in Foundry and
     * {@link DocumentClassConfig | `DocumentClassConfig`} in fvtt-types.
     */
    type ImplementationClass = Document.ConfiguredClassForName<"AmbientLight">;

    /**
     * A document's metadata is special information about the document ranging anywhere from its name,
     * whether it's indexed, or to the permissions a user has over it.
     */
    interface Metadata extends Document.MetadataFor<"AmbientLight"> {}

    /**
     * A document's parent is something that can contain it.
     * For example an `Item` can be contained by an `Actor` which makes `Actor` one of its possible parents.
     */
    type Parent = Scene.Implementation | null;

    /**
     * An instance of `AmbientLightDocument` that comes from the database.
     */
    interface Stored extends Document.Stored<AmbientLightDocument.Implementation> {}

    /**
     * The data put in {@link Document._source | `Document._source`}. This data is what was
     * persisted to the database and therefore it must be valid JSON.
     *
     * For example a {@link fields.SetField | `SetField`} is persisted to the database as an array
     * but initialized as a {@link Set | `Set`}.
     *
     * Both `Source` and `PersistedData` are equivalent.
     */
    interface Source extends PersistedData {}

    /**
     * The data put in {@link AmbientLightDocument._source | `AmbientLightDocument._source`}. This data is what was
     * persisted to the database and therefore it must be valid JSON.
     *
     * Both `Source` and `PersistedData` are equivalent.
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
     * The data after a {@link Document | `Document`} has been initialized, for example
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
      x: fields.NumberField<{ required: true; integer: true; nullable: false; initial: 0; label: "XCoord" }>;

      /**
       * The y-coordinate position of the origin of the light
       * @defaultValue `0`
       */
      y: fields.NumberField<{ required: true; integer: true; nullable: false; initial: 0; label: "YCoord" }>;

      /**
       * The angle of rotation for the tile between 0 and 360
       * @defaultValue `0`
       */
      rotation: fields.AngleField<{ label: "LIGHT.Rotation" }>;

      /**
       * Whether or not this light source is constrained by Walls
       * @defaultValue `true`
       */
      walls: fields.BooleanField<{ initial: true; label: "LIGHT.Walls"; hint: "LIGHT.WallsHint" }>;

      /**
       * Whether or not this light source provides a source of vision
       * @defaultValue `false`
       */
      vision: fields.BooleanField<{ label: "LIGHT.Vision"; hint: "LIGHT.VisionHint" }>;

      /**
       * Light configuration data
       * @defaultValue see {@link LightData}
       */
      config: fields.EmbeddedDataField<typeof LightData>;

      /**
       * Is the light source currently hidden?
       * @defaultValue `false`
       */
      hidden: fields.BooleanField<{ label: "Hidden" }>;

      /**
       * An object of optional key/value flags
       * @defaultValue `{}`
       */
      flags: fields.ObjectField.FlagsField<"AmbientLight">;
    }

    namespace DatabaseOperation {
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

      /** Options for {@link AmbientLightDocument.createDocuments} */
      type CreateOperation<Temporary extends boolean | undefined = boolean | undefined> =
        Document.Database.CreateOperation<Create<Temporary>>;
      /** Options for {@link AmbientLightDocument._preCreateOperation} */
      type PreCreateOperationStatic = Document.Database.PreCreateOperationStatic<Create>;
      /** Options for {@link AmbientLightDocument#_preCreate} */
      type PreCreateOperationInstance = Document.Database.PreCreateOperationInstance<Create>;
      /** Options for {@link AmbientLightDocument#_onCreate} */
      type OnCreateOperation = Document.Database.OnCreateOperation<Create>;

      /** Options for {@link AmbientLightDocument.updateDocuments} */
      type UpdateOperation = Document.Database.UpdateOperation<Update>;
      /** Options for {@link AmbientLightDocument._preUpdateOperation} */
      type PreUpdateOperationStatic = Document.Database.PreUpdateOperationStatic<Update>;
      /** Options for {@link AmbientLightDocument#_preUpdate} */
      type PreUpdateOperationInstance = Document.Database.PreUpdateOperationInstance<Update>;
      /** Options for {@link AmbientLightDocument#_onUpdate} */
      type OnUpdateOperation = Document.Database.OnUpdateOperation<Update>;

      /** Options for {@link AmbientLightDocument.deleteDocuments} */
      type DeleteOperation = Document.Database.DeleteOperation<Delete>;
      /** Options for {@link AmbientLightDocument._preDeleteOperation} */
      type PreDeleteOperationStatic = Document.Database.PreDeleteOperationStatic<Delete>;
      /** Options for {@link AmbientLightDocument#_preDelete} */
      type PreDeleteOperationInstance = Document.Database.PreDeleteOperationInstance<Delete>;
      /** Options for {@link AmbientLightDocument#_onDelete} */
      type OnDeleteOperation = Document.Database.OnDeleteOperation<Delete>;
    }

    /**
     * @deprecated {@link AmbientLightDocument.DatabaseOperation}
     */
    /* eslint-disable @typescript-eslint/no-empty-object-type */
    interface DatabaseOperations
      extends Document.Database.Operations<AmbientLightDocument, {}, { animate: boolean }, {}> {}
    /* eslint-enable @typescript-eslint/no-empty-object-type */

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
   * @see {@link Scene}                     The Scene document type which contains AmbientLight documents
   * @see {@link AmbientLightConfig}        The AmbientLight configuration application
   */
  class AmbientLightDocument extends CanvasDocumentMixin(foundry.documents.BaseAmbientLight) {
    /**
     * @privateRemarks _onUpdate is overridden but with no signature changes.
     * For type simplicity it is left off. These methods historically have been the source of a large amount of computation from tsc.
     */

    /**
     * Is this ambient light source global in nature?
     */
    get isGlobal(): boolean;

    /*
     * After this point these are not really overridden methods.
     * They are here because they're static properties but depend on the instance and so can't be
     * defined DRY-ly while also being easily overridable.
     */

    static override defaultName(context?: Document.DefaultNameContext<"base", AmbientLightDocument.Parent>): string;

    static override createDialog(
      data: AmbientLightDocument.CreateData,
      context?: Document.CreateDialogContext<"base", AmbientLightDocument.Parent>,
    ): Promise<AmbientLightDocument.Implementation | null | undefined>;

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
