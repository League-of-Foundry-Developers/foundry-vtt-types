import type Document from "../../../common/abstract/document.d.mts";
import type { DataSchema } from "../../../common/data/fields.d.mts";
import type { fields } from "../../../common/data/module.d.mts";

declare global {
  namespace AmbientSoundDocument {
    /**
     * The implementation of the AmbientSoundDocument document instance configured through `CONFIG.AmbientSound.documentClass` in Foundry and
     * {@link DocumentClassConfig | `DocumentClassConfig`} in fvtt-types.
     */
    type Implementation = Document.ImplementationInstanceFor<"AmbientSound">;

    /**
     * The implementation of the AmbientSoundDocument document configured through `CONFIG.AmbientSound.documentClass` in Foundry and
     * {@link DocumentClassConfig | `DocumentClassConfig`} in fvtt-types.
     */
    type ImplementationClass = Document.ImplementationClassFor<"AmbientSound">;

    /**
     * A document's metadata is special information about the document ranging anywhere from its name,
     * whether it's indexed, or to the permissions a user has over it.
     */
    interface Metadata extends Document.MetadataFor<"AmbientSound"> {}

    /**
     * A document's parent is something that can contain it.
     * For example an `Item` can be contained by an `Actor` which makes `Actor` one of its possible parents.
     */
    type Parent = Scene.Implementation | null;

    /**
     * An instance of `AmbientSoundDocument` that comes from the database.
     */
    interface Stored extends Document.Stored<AmbientSoundDocument.Implementation> {}

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
     * The data put in {@link AmbientSoundDataModel._source | `AmbientSoundDataModel._source`}. This data is what was
     * persisted to the database and therefore it must be valid JSON.
     *
     * Both `Source` and `PersistedData` are equivalent.
     */
    interface PersistedData extends fields.SchemaField.PersistedData<Schema> {}

    /**
     * The data necessary to create a document. Used in places like {@link AmbientSoundDocument.create | `AmbientSoundDocument.create`}
     * and {@link AmbientSoundDocument | `new AmbientSoundDocument(...)`}.
     *
     * For example a {@link fields.SetField | `SetField`} can accept any {@link Iterable | `Iterable`}
     * with the right values. This means you can pass a `Set` instance, an array of values,
     * a generator, or any other iterable.
     */
    interface CreateData extends fields.SchemaField.CreateData<Schema> {}

    /**
     * The data after a {@link Document | `Document`} has been initialized, for example
     * {@link AmbientSoundDocument.name | `AmbientSoundDocument#name`}.
     *
     * This is data transformed from {@link AmbientSoundDocument.Source | `AmbientSoundDocument.Source`} and turned into more
     * convenient runtime data structures. For example a {@link fields.SetField | `SetField`} is
     * persisted to the database as an array of values but at runtime it is a `Set` instance.
     */
    interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

    /**
     * The data used to update a document, for example {@link AmbientSoundDocument.update | `AmbientSoundDocument#update`}.
     * It is a distinct type from {@link AmbientSoundDocument.CreateData | `DeepPartial<AmbientSoundDocument.CreateData>`} because
     * it has different rules for `null` and `undefined`.
     */
    interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

    /**
     * The schema for {@link AmbientSoundDocument | `AmbientSoundDocument`}. This is the source of truth for how an AmbientSoundDocument document
     * must be structured.
     *
     * Foundry uses this schema to validate the structure of the {@link AmbientSoundDocument | `AmbientSoundDocument`}. For example
     * a {@link fields.StringField | `StringField`} will enforce that the value is a string. More
     * complex fields like {@link fields.SetField | `SetField`} goes through various conversions
     * starting as an array in the database, initialized as a set, and allows updates with any
     * iterable.
     */
    interface Schema extends DataSchema {
      /**
       * The _id which uniquely identifies this AmbientSound document
       * @defaultValue `null`
       */
      _id: fields.DocumentIdField;

      /**
       * The x-coordinate position of the origin of the sound.
       * @defaultValue `0`
       */
      x: fields.NumberField<{ required: true; integer: true; nullable: false; initial: 0; label: "XCoord" }>;

      /**
       * The y-coordinate position of the origin of the sound.
       * @defaultValue `0`
       */
      y: fields.NumberField<{ required: true; integer: true; nullable: false; initial: 0; label: "YCoord" }>;

      /**
       * The radius of the emitted sound.
       * @defaultValue `0`
       */
      radius: fields.NumberField<{
        required: true;
        nullable: false;
        initial: 0;
        min: 0;
        step: 0.01;
        label: "SOUND.Radius";
      }>;

      /**
       * The audio file path that is played by this sound
       * @defaultValue `null`
       */
      path: fields.FilePathField<{ categories: ["AUDIO"]; label: "SOUND.SourcePath" }>;

      /**
       * Does this sound loop?
       * @defaultValue `false`
       */
      repeat: fields.BooleanField;

      /**
       * The audio volume of the sound, from 0 to 1
       * @defaultValue `0.5`
       */
      volume: fields.AlphaField<{ initial: 0.5; step: 0.01; label: "SOUND.MaxVol"; hint: "SOUND.MaxVolHint" }>;

      /**
       * Whether or not this sound source is constrained by Walls.
       * @defaultValue `true`
       */
      walls: fields.BooleanField<{ initial: true; label: "SOUND.Walls"; hint: "SOUND.WallsHint" }>;

      /**
       * Whether to adjust the volume of the sound heard by the listener based on how
       * close the listener is to the center of the sound source.
       * @defaultValue `true`
       */
      easing: fields.BooleanField<{ initial: true; label: "SOUND.Easing"; hint: "SOUND.EasingHint" }>;

      /**
       * Is the sound source currently hidden?
       * @defaultValue `false`
       */
      hidden: fields.BooleanField<{ label: "Hidden" }>;

      /**
       * A darkness range (min and max) for which the source should be active
       * @defaultValue see properties
       */
      darkness: fields.SchemaField<
        {
          /** @defaultValue `0` */
          min: fields.AlphaField<{ initial: 0 }>;

          /** @defaultValue `1` */
          max: fields.AlphaField<{ initial: 1 }>;
        },
        { label: "SOUND.DarknessRange"; hint: "SOUND.DarknessRangeHint" }
      >;

      /**
       * An object of optional key/value flags
       * @defaultValue `{}`
       */
      flags: fields.ObjectField.FlagsField<"AmbientSound">;
    }

    namespace DatabaseOperation {
      /** Options passed along in Get operations for AmbientSoundDocuments */
      interface Get extends foundry.abstract.types.DatabaseGetOperation<AmbientSoundDocument.Parent> {}
      /** Options passed along in Create operations for AmbientSoundDocuments */
      interface Create<Temporary extends boolean | undefined = boolean | undefined>
        extends foundry.abstract.types.DatabaseCreateOperation<
          AmbientSoundDocument.CreateData,
          AmbientSoundDocument.Parent,
          Temporary
        > {}
      /** Options passed along in Delete operations for AmbientSoundDocuments */
      interface Delete extends foundry.abstract.types.DatabaseDeleteOperation<AmbientSoundDocument.Parent> {}
      /** Options passed along in Update operations for AmbientSoundDocuments */
      interface Update
        extends foundry.abstract.types.DatabaseUpdateOperation<
          AmbientSoundDocument.UpdateData,
          AmbientSoundDocument.Parent
        > {}

      /** Options for {@link AmbientSoundDocument.createDocuments | `AmbientSoundDocument.createDocuments`} */
      type CreateOperation<Temporary extends boolean | undefined = boolean | undefined> =
        Document.Database.CreateOperation<Create<Temporary>>;
      /** Options for {@link AmbientSoundDocument._preCreateOperation | `AmbientSoundDocument._preCreateOperation`} */
      type PreCreateOperationStatic = Document.Database.PreCreateOperationStatic<Create>;
      /** Options for {@link AmbientSoundDocument#_preCreate | `AmbientSoundDocument#_preCreate`} */
      type PreCreateOperationInstance = Document.Database.PreCreateOperationInstance<Create>;
      /** Options for {@link AmbientSoundDocument#_onCreate | `AmbientSoundDocument#_onCreate`} */
      type OnCreateOperation = Document.Database.OnCreateOperation<Create>;

      /** Options for {@link AmbientSoundDocument.updateDocuments | `AmbientSoundDocument.updateDocuments`} */
      type UpdateOperation = Document.Database.UpdateOperation<Update>;
      /** Options for {@link AmbientSoundDocument._preUpdateOperation | `AmbientSoundDocument._preUpdateOperation`} */
      type PreUpdateOperationStatic = Document.Database.PreUpdateOperationStatic<Update>;
      /** Options for {@link AmbientSoundDocument#_preUpdate | `AmbientSoundDocument#_preUpdate`} */
      type PreUpdateOperationInstance = Document.Database.PreUpdateOperationInstance<Update>;
      /** Options for {@link AmbientSoundDocument#_onUpdate | `AmbientSoundDocument#_onUpdate`} */
      type OnUpdateOperation = Document.Database.OnUpdateOperation<Update>;

      /** Options for {@link AmbientSoundDocument.deleteDocuments | `AmbientSoundDocument.deleteDocuments`} */
      type DeleteOperation = Document.Database.DeleteOperation<Delete>;
      /** Options for {@link AmbientSoundDocument._preDeleteOperation | `AmbientSoundDocument._preDeleteOperation`} */
      type PreDeleteOperationStatic = Document.Database.PreDeleteOperationStatic<Delete>;
      /** Options for {@link AmbientSoundDocument#_preDelete | `AmbientSoundDocument#_preDelete`} */
      type PreDeleteOperationInstance = Document.Database.PreDeleteOperationInstance<Delete>;
      /** Options for {@link AmbientSoundDocument#_onDelete | `AmbientSoundDocument#_onDelete`} */
      type OnDeleteOperation = Document.Database.OnDeleteOperation<Delete>;
    }

    /**
     * @deprecated {@link AmbientSoundDocument.DatabaseOperation | `AmbientSoundDocument.DatabaseOperation`}
     */
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    interface DatabaseOperations extends Document.Database.Operations<AmbientSoundDocument> {}

    /**
     * @deprecated {@link AmbientSoundDocument.CreateData | `AmbientSoundDocument.CreateData`}
     */
    interface ConstructorData extends AmbientSoundDocument.CreateData {}

    /**
     * @deprecated {@link AmbientSoundDocument.implementation | `AmbientSoundDocument.ImplementationClass`}
     */
    type ConfiguredClass = ImplementationClass;

    /**
     * @deprecated {@link AmbientSoundDocument.Implementation | `AmbientSoundDocument.Implementation`}
     */
    type ConfiguredInstance = Implementation;
  }

  /**
   * The client-side AmbientSound document which extends the common BaseAmbientSound document model.
   *
   * @see {@link Scene}                   The Scene document type which contains AmbientSound documents
   * @see {@link AmbientSoundConfig}      The AmbientSound configuration application
   */
  class AmbientSoundDocument extends CanvasDocumentMixin(foundry.documents.BaseAmbientSound) {
    /**
     * @param data    - Initial data from which to construct the `AmbientSoundDocument`
     * @param context - Construction context options
     *
     * @deprecated Constructing `AmbientSoundDocument` directly is not advised. While `new AmbientSoundDocument(...)` would create a
     * temporary document it would not respect a system's subclass of `AmbientSoundDocument`, if any.
     *
     * You should use {@link AmbientSoundDocument.implementation | `new AmbientSoundDocument.implementation(...)`} instead which
     * will give you a system specific implementation of `AmbientSoundDocument`.
     */
    constructor(...args: Document.ConstructorParameters<AmbientSoundDocument.CreateData, AmbientSoundDocument.Parent>);

    /*
     * After this point these are not really overridden methods.
     * They are here because they're static properties but depend on the instance and so can't be
     * defined DRY-ly while also being easily overridable.
     */

    static override defaultName(
      context: Document.DefaultNameContext<"base", Exclude<AmbientSoundDocument.Parent, null>>,
    ): string;

    static override createDialog(
      data: Document.CreateDialogData<AmbientSoundDocument.CreateData>,
      context: Document.CreateDialogContext<string, Exclude<AmbientSoundDocument.Parent, null>>,
    ): Promise<AmbientSoundDocument.Stored | null | undefined>;

    static override fromDropData(
      data: Document.DropData<AmbientSoundDocument.Implementation>,
      options?: Document.FromDropDataOptions,
    ): Promise<AmbientSoundDocument.Implementation | undefined>;

    static override fromImport(
      source: AmbientSoundDocument.Source,
      context?: Document.FromImportContext<AmbientSoundDocument.Parent>,
    ): Promise<AmbientSoundDocument.Implementation>;
  }
}
