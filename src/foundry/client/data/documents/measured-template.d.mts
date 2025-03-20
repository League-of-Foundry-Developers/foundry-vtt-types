import type { documents } from "../../../client-esm/client.d.mts";
import type Document from "../../../common/abstract/document.d.mts";
import type { DataSchema } from "../../../common/data/fields.d.mts";
import type { fields } from "../../../common/data/module.d.mts";

declare global {
  namespace MeasuredTemplateDocument {
    /**
     * The implementation of the MeasuredTemplateDocument document instance configured through `CONFIG.MeasuredTemplateDocument.documentClass` in Foundry and
     * {@link DocumentClassConfig | `DocumentClassConfig`} or {@link ConfiguredMeasuredTemplateDocument | `fvtt-types/configuration/ConfiguredMeasuredTemplateDocument`} in fvtt-types.
     */
    type Implementation = Document.ImplementationFor<"MeasuredTemplate">;

    /**
     * The implementation of the MeasuredTemplateDocument document configured through `CONFIG.MeasuredTemplateDocument.documentClass` in Foundry and
     * {@link DocumentClassConfig | `DocumentClassConfig`} in fvtt-types.
     */
    type ImplementationClass = Document.ImplementationClassFor<"MeasuredTemplate">;

    /**
     * A document's metadata is special information about the document ranging anywhere from its name,
     * whether it's indexed, or to the permissions a user has over it.
     */
    interface Metadata extends Document.MetadataFor<"MeasuredTemplate"> {}

    /**
     * A document's parent is something that can contain it.
     * For example an `Item` can be contained by an `Actor` which makes `Actor` one of its possible parents.
     */
    type Parent = null;

    /**
     * An instance of `MeasuredTemplateDocument` that comes from the database.
     */
    interface Stored extends Document.Stored<MeasuredTemplateDocument.Implementation> {}

    /**
     * The data put in {@link MeasuredTemplate._source | `MeasuredTemplate#_source`}. This data is what was
     * persisted to the database and therefore it must be valid JSON.
     *
     * For example a {@link fields.SetField | `SetField`} is persisted to the database as an array
     * but initialized as a {@link Set | `Set`}.
     *
     * `Source` and `PersistedData` are equivalent.
     */
    interface Source extends PersistedData {}

    /**
     * The data put in {@link MeasuredTemplate._source | `MeasuredTemplate#_source`}. This data is what was
     * persisted to the database and therefore it must be valid JSON.
     *
     * `Source` and `PersistedData` are equivalent.
     */
    interface PersistedData extends fields.SchemaField.PersistedData<Schema> {}

    /**
     * The data necessary to create a document. Used in places like {@link MeasuredTemplateDocument.create | `MeasuredTemplateDocument.create`}
     * and {@link MeasuredTemplateDocument | `new MeasuredTemplateDocument(...)`}.
     *
     * For example a {@link fields.SetField | `SetField`} can accept any {@link Iterable | `Iterable`}
     * with the right values. This means you can pass a `Set` instance, an array of values,
     * a generator, or any other iterable.
     */
    interface CreateData extends fields.SchemaField.CreateData<Schema> {}

    /**
     * The data after a {@link foundry.abstract.Document | `Document`} has been initialized, for example
     * {@link MeasuredTemplateDocument.name | `MeasuredTemplateDocument#name`}.
     *
     * This is data transformed from {@link MeasuredTemplateDocument.Source | `MeasuredTemplateDocument.Source`} and turned into more
     * convenient runtime data structures. For example a {@link fields.SetField | `SetField`} is
     * persisted to the database as an array of values but at runtime it is a `Set` instance.
     */
    interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

    /**
     * The data used to update a document, for example {@link MeasuredTemplateDocument.update | `MeasuredTemplateDocument#update`}.
     * It is a distinct type from {@link MeasuredTemplateDocument.CreateData | `DeepPartial<MeasuredTemplateDocument.CreateData>`} because
     * it has different rules for `null` and `undefined`.
     */
    interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

    /**
     * The schema for {@link MeasuredTemplateDocument | `MeasuredTemplateDocument`}. This is the source of truth for how an MeasuredTemplateDocument document
     * must be structured.
     *
     * Foundry uses this schema to validate the structure of the {@link MeasuredTemplateDocument | `MeasuredTemplateDocument`}. For example
     * a {@link fields.StringField | `StringField`} will enforce that the value is a string. More
     * complex fields like {@link fields.SetField | `SetField`} goes through various conversions
     * starting as an array in the database, initialized as a set, and allows updates with any
     * iterable.
     */
    interface Schema extends DataSchema {
      /**
       * The _id which uniquely identifies this BaseMeasuredTemplate embedded document
       * @defaultValue `null`
       */
      _id: fields.DocumentIdField;

      /**
       * The _id of the user who created this measured template
       * @defaultValue `game?.user?.id`
       */
      author: fields.ForeignDocumentField<typeof documents.BaseUser, { initial: () => string | undefined }>;

      /**
       * The value in CONST.MEASURED_TEMPLATE_TYPES which defines the geometry type of this template
       * @defaultValue `CONST.MEASURED_TEMPLATE_TYPES.CIRCLE` (`"circle"`)
       */
      t: fields.StringField<
        {
          required: true;
          choices: CONST.MEASURED_TEMPLATE_TYPES[];
          label: "Type";
          initial: typeof CONST.MEASURED_TEMPLATE_TYPES.CIRCLE;
          validationError: "must be a value in CONST.MEASURED_TEMPLATE_TYPES";
        },
        //FIXME: Without these overrides, the branded type from `choices` is not respected, and the field types as `number`
        CONST.MEASURED_TEMPLATE_TYPES | null | undefined,
        CONST.MEASURED_TEMPLATE_TYPES,
        CONST.MEASURED_TEMPLATE_TYPES
      >;

      /**
       * The x-coordinate position of the origin of the template effect
       * @defaultValue `0`
       */
      x: fields.NumberField<{ required: true; integer: true; nullable: false; initial: 0; label: "XCoord" }>;

      /**
       * The y-coordinate position of the origin of the template effect
       * @defaultValue `0`
       */
      y: fields.NumberField<{ required: true; integer: true; nullable: false; initial: 0; label: "YCoord" }>;

      /**
       * The elevation of the template
       * @defaultValue `0`
       */
      elevation: fields.NumberField<{ required: true; nullable: false; initial: 0 }>;

      /**
       * The z-index of this template relative to other siblings
       * @defaultValue `0`
       */
      sort: fields.NumberField<{ required: true; integer: true; nullable: false; initial: 0 }>;

      /**
       * The distance of the template effect
       * @defaultValue `0`
       */
      distance: fields.NumberField<{
        required: true;
        nullable: false;
        initial: 0;
        min: 0;
        label: "Distance";
      }>;

      /**
       * The angle of rotation for the measured template
       * @defaultValue `0`
       */
      direction: fields.AngleField<{ label: "Direction" }>;

      /**
       * The angle of effect of the measured template, applies to cone types
       * @defaultValue `0`
       */
      angle: fields.AngleField<{ normalize: false; label: "Angle" }>;

      /**
       * The width of the measured template, applies to ray types
       * @defaultValue `0`
       */
      width: fields.NumberField<{ required: true; nullable: false; initial: 0; min: 0; step: 0.01; label: "Width" }>;

      /**
       * A color string used to tint the border of the template shape
       * @defaultValue `#000000`
       */
      borderColor: fields.ColorField<{ nullable: false; initial: "#000000" }>;

      /**
       * A color string used to tint the fill of the template shape
       * @defaultValue `game.user?.color.css || "#ffffff"`
       */
      fillColor: fields.ColorField<{ nullable: false; initial: () => string }>;

      /**
       * A repeatable tiling texture used to add a texture fill to the template shape
       * @defaultValue `null`
       */
      texture: fields.FilePathField<{ categories: ["IMAGE", "VIDEO"] }>;

      /**
       * Is the template currently hidden?
       * @defaultValue `false`
       */
      hidden: fields.BooleanField<{ label: "Hidden" }>;

      /**
       * An object of optional key/value flags
       * @defaultValue `{}`
       */
      flags: fields.ObjectField.FlagsField<"MeasuredTemplate">;
    }

    namespace DatabaseOperation {
      /** Options passed along in Get operations for MeasuredTemplateDocuments */
      interface Get extends foundry.abstract.types.DatabaseGetOperation<MeasuredTemplateDocument.Parent> {}
      /** Options passed along in Create operations for MeasuredTemplateDocuments */
      interface Create<Temporary extends boolean | undefined = boolean | undefined>
        extends foundry.abstract.types.DatabaseCreateOperation<
          MeasuredTemplateDocument.CreateData,
          MeasuredTemplateDocument.Parent,
          Temporary
        > {}
      /** Options passed along in Delete operations for MeasuredTemplateDocuments */
      interface Delete extends foundry.abstract.types.DatabaseDeleteOperation<MeasuredTemplateDocument.Parent> {}
      /** Options passed along in Update operations for MeasuredTemplateDocuments */
      interface Update
        extends foundry.abstract.types.DatabaseUpdateOperation<
          MeasuredTemplateDocument.UpdateData,
          MeasuredTemplateDocument.Parent
        > {}

      /** Options for {@link MeasuredTemplateDocument.createDocuments | `MeasuredTemplateDocument.createDocuments`} */
      type CreateOperation<Temporary extends boolean | undefined = boolean | undefined> =
        Document.Database.CreateOperation<Create<Temporary>>;
      /** Options for {@link MeasuredTemplateDocument._preCreateOperation | `MeasuredTemplateDocument._preCreateOperation`} */
      type PreCreateOperationStatic = Document.Database.PreCreateOperationStatic<Create>;
      /** Options for {@link MeasuredTemplateDocument._preCreate | `MeasuredTemplateDocument#_preCreate`} */
      type PreCreateOperationInstance = Document.Database.PreCreateOptions<Create>;
      /** Options for {@link MeasuredTemplateDocument._onCreate | `MeasuredTemplateDocument#_onCreate`} */
      type OnCreateOperation = Document.Database.CreateOptions<Create>;

      /** Options for {@link MeasuredTemplateDocument.updateDocuments | `MeasuredTemplateDocument.updateDocuments`} */
      type UpdateOperation = Document.Database.UpdateDocumentsOperation<Update>;
      /** Options for {@link MeasuredTemplateDocument._preUpdateOperation | `MeasuredTemplateDocument._preUpdateOperation`} */
      type PreUpdateOperationStatic = Document.Database.PreUpdateOperationStatic<Update>;
      /** Options for {@link MeasuredTemplateDocument._preUpdate | `MeasuredTemplateDocument#_preUpdate`} */
      type PreUpdateOperationInstance = Document.Database.PreUpdateOptions<Update>;
      /** Options for {@link MeasuredTemplateDocument._onUpdate | `MeasuredTemplateDocument#_onUpdate`} */
      type OnUpdateOperation = Document.Database.UpdateOptions<Update>;

      /** Options for {@link MeasuredTemplateDocument.deleteDocuments | `MeasuredTemplateDocument.deleteDocuments`} */
      type DeleteOperation = Document.Database.DeleteDocumentsOperation<Delete>;
      /** Options for {@link MeasuredTemplateDocument._preDeleteOperation | `MeasuredTemplateDocument._preDeleteOperation`} */
      type PreDeleteOperationStatic = Document.Database.PreDeleteOperationStatic<Delete>;
      /** Options for {@link MeasuredTemplateDocument._preDelete | `MeasuredTemplateDocument#_preDelete`} */
      type PreDeleteOperationInstance = Document.Database.PreDeleteOperationInstance<Delete>;
      /** Options for {@link MeasuredTemplateDocument._onDelete | `MeasuredTemplateDocument#_onDelete`} */
      type OnDeleteOperation = Document.Database.DeleteOptions<Delete>;
    }

    /**
     * @deprecated {@link MeasuredTemplateDocument.DatabaseOperation | `MeasuredTemplateDocument.DatabaseOperation`}
     */
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    interface DatabaseOperations extends Document.Database.Operations<MeasuredTemplateDocument> {}

    /**
     * @deprecated {@link MeasuredTemplateDocument.CreateData | `MeasuredTemplateDocument.CreateData`}
     */
    interface ConstructorData extends MeasuredTemplateDocument.CreateData {}

    /**
     * @deprecated {@link MeasuredTemplateDocument.implementation | `MeasuredTemplateDocument.ImplementationClass`}
     */
    type ConfiguredClass = ImplementationClass;

    /**
     * @deprecated {@link MeasuredTemplateDocument.Implementation | `MeasuredTemplateDocument.Implementation`}
     */
    type ConfiguredInstance = Implementation;
  }

  /**
   * The client-side MeasuredTemplate document which extends the common BaseMeasuredTemplate document model.
   *
   * @see {@link Scene | `Scene`}                     The Scene document type which contains MeasuredTemplate documents
   * @see {@link MeasuredTemplateConfig | `MeasuredTemplateConfig`}    The MeasuredTemplate configuration application
   */
  class MeasuredTemplateDocument extends CanvasDocumentMixin(foundry.documents.BaseMeasuredTemplate) {
    /**
     * @param data    - Initial data from which to construct the `MeasuredTemplateDocument`
     * @param context - Construction context options
     *
     * @deprecated Constructing `MeasuredTemplateDocument` directly is not advised. While `new MeasuredTemplateDocument(...)` would create a
     * temporary document it would not respect a system's subclass of `MeasuredTemplateDocument`, if any.
     *
     * You should use {@link MeasuredTemplateDocument.implementation | `new MeasuredTemplateDocument.implementation(...)`} instead which
     * will give you a system specific implementation of `MeasuredTemplateDocument`.
     */
    constructor(
      ...args: Document.ConstructorParameters<MeasuredTemplateDocument.CreateData, MeasuredTemplateDocument.Parent>
    );

    /**
     * Rotation is an alias for direction
     */
    get rotation(): this["direction"];

    /**
     * Is the current User the author of this template?
     */
    get isAuthor(): boolean;

    /*
     * After this point these are not really overridden methods.
     * They are here because they're static properties but depend on the instance and so can't be
     * defined DRY-ly while also being easily overridable.
     */

    static override defaultName(
      context: Document.DefaultNameContext<"base", NonNullable<MeasuredTemplateDocument.Parent>>,
    ): string;

    static override createDialog(
      data: Document.CreateDialogData<MeasuredTemplateDocument.CreateData>,
      context: Document.CreateDialogContext<string, NonNullable<MeasuredTemplateDocument.Parent>>,
    ): Promise<MeasuredTemplateDocument.Stored | null | undefined>;

    static override fromDropData(
      data: Document.DropData<MeasuredTemplateDocument.Implementation>,
      options?: Document.FromDropDataOptions,
    ): Promise<MeasuredTemplateDocument.Implementation | undefined>;

    static override fromImport(
      source: MeasuredTemplateDocument.Source,
      context?: Document.FromImportContext<MeasuredTemplateDocument.Parent>,
    ): Promise<MeasuredTemplateDocument.Implementation>;
  }
}
