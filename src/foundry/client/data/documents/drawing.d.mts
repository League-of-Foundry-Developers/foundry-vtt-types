import type { documents } from "../../../client-esm/client.d.mts";
import type Document from "../../../common/abstract/document.d.mts";
import type { DataSchema } from "../../../common/data/fields.d.mts";
import type { fields, ShapeData } from "../../../common/data/module.d.mts";

declare global {
  namespace DrawingDocument {
    /**
     * The implementation of the DrawingDocument document instance configured through `CONFIG.Drawing.documentClass` in Foundry and
     * {@link DocumentClassConfig | `DocumentClassConfig`} or {@link ConfiguredDrawingDocument | `fvtt-types/configuration/ConfiguredDrawingDocument`} in fvtt-types.
     */
    type Implementation = Document.ImplementationInstanceFor<"Drawing">;

    /**
     * The implementation of the DrawingDocument document configured through `CONFIG.DrawingDocument.documentClass` in Foundry and
     * {@link DocumentClassConfig | `DocumentClassConfig`} in fvtt-types.
     */
    type ImplementationClass = Document.ImplementationClassFor<"Drawing">;

    /**
     * A document's metadata is special information about the document ranging anywhere from its name,
     * whether it's indexed, or to the permissions a user has over it.
     */
    interface Metadata extends Document.MetadataFor<"Drawing"> {}

    /**
     * A document's parent is something that can contain it.
     * For example an `Item` can be contained by an `Actor` which makes `Actor` one of its possible parents.
     */
    type Parent = Scene.Implementation | null;

    /**
     * An instance of `DrawingDocument` that comes from the database.
     */
    interface Stored extends Document.Stored<DrawingDocument.Implementation> {}

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
     * The data put in {@link DrawingDataModel._source | `DrawingDataModel._source`}. This data is what was
     * persisted to the database and therefore it must be valid JSON.
     *
     * Both `Source` and `PersistedData` are equivalent.
     */
    interface PersistedData extends fields.SchemaField.PersistedData<Schema> {}

    /**
     * The data necessary to create a document. Used in places like {@link DrawingDocument.create | `DrawingDocument.create`}
     * and {@link DrawingDocument | `new DrawingDocument(...)`}.
     *
     * For example a {@link fields.SetField | `SetField`} can accept any {@link Iterable | `Iterable`}
     * with the right values. This means you can pass a `Set` instance, an array of values,
     * a generator, or any other iterable.
     */
    interface CreateData extends fields.SchemaField.CreateData<Schema> {}

    /**
     * The data after a {@link Document | `Document`} has been initialized, for example
     * {@link DrawingDocument.name | `DrawingDocument#name`}.
     *
     * This is data transformed from {@link DrawingDocument.Source | `DrawingDocument.Source`} and turned into more
     * convenient runtime data structures. For example a {@link fields.SetField | `SetField`} is
     * persisted to the database as an array of values but at runtime it is a `Set` instance.
     */
    interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

    /**
     * The data used to update a document, for example {@link DrawingDocument.update | `DrawingDocument#update`}.
     * It is a distinct type from {@link DrawingDocument.CreateData | `DeepPartial<DrawingDocument.CreateData>`} because
     * it has different rules for `null` and `undefined`.
     */
    interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

    /**
     * The schema for {@link DrawingDocument | `DrawingDocument`}. This is the source of truth for how an DrawingDocument document
     * must be structured.
     *
     * Foundry uses this schema to validate the structure of the {@link DrawingDocument | `DrawingDocument`}. For example
     * a {@link fields.StringField | `StringField`} will enforce that the value is a string. More
     * complex fields like {@link fields.SetField | `SetField`} goes through various conversions
     * starting as an array in the database, initialized as a set, and allows updates with any
     * iterable.
     */
    interface Schema extends DataSchema {
      /**
       * The _id which uniquely identifies this BaseDrawing embedded document
       * @defaultValue `null`
       */
      _id: fields.DocumentIdField;

      /**
       * The _id of the user who created the drawing
       * @defaultValue `game.user?.id`
       */
      author: fields.ForeignDocumentField<
        typeof documents.BaseUser,
        { nullable: false; initial: () => string | undefined }
      >;

      /**
       * The geometric shape of the drawing
       * @defaultValue see {@link ShapeData.Schema | `ShapeData.Schema`}
       */
      shape: fields.EmbeddedDataField<typeof ShapeData>;

      /**
       * The x-coordinate position of the top-left corner of the drawn shape
       * @defaultValue `0`
       */
      x: fields.NumberField<{ required: true; nullable: false; initial: 0; label: "XCoord" }>;

      /**
       * The y-coordinate position of the top-left corner of the drawn shape
       * @defaultValue `0`
       */
      y: fields.NumberField<{ required: true; nullable: false; initial: 0; label: "YCoord" }>;

      /**
       * The elevation of the drawing
       * @defaultValue `0`
       */
      elevation: fields.NumberField<{ required: true; nullable: false; initial: 0 }>;

      /**
       * The z-index of this drawing relative to other siblings
       * @defaultValue `0`
       */
      sort: fields.NumberField<{ required: true; integer: true; nullable: false; initial: 0 }>;

      /**
       * The angle of rotation for the drawing figure
       * @defaultValue `0`
       */
      rotation: fields.AngleField<{ label: "DRAWING.Rotation" }>;

      /**
       * An amount of bezier smoothing applied, between 0 and 1
       * @defaultValue `0`
       */
      bezierFactor: fields.AlphaField<{
        initial: 0;
        label: "DRAWING.SmoothingFactor";
        max: 0.5;
        hint: "DRAWING.SmoothingFactorHint";
      }>;

      /**
       * The fill type of the drawing shape, a value from CONST.DRAWING_FILL_TYPES
       * @defaultValue `CONST.DRAWING_FILL_TYPES.NONE`
       */
      fillType: fields.NumberField<
        {
          required: true;
          nullable: false;
          initial: typeof CONST.DRAWING_FILL_TYPES.NONE;
          choices: CONST.DRAWING_FILL_TYPES[];
          label: "DRAWING.FillTypes";
          validationError: "must be a value in CONST.DRAWING_FILL_TYPES";
        },
        CONST.DRAWING_FILL_TYPES | null | undefined,
        CONST.DRAWING_FILL_TYPES,
        CONST.DRAWING_FILL_TYPES
      >;

      /**
       * An optional color string with which to fill the drawing geometry
       * @defaultValue `game.user?.color.css || "#ffffff"`
       */
      fillColor: fields.ColorField<{ nullable: false; initial: () => string; label: "DRAWING.FillColor" }>;

      /**
       * The opacity of the fill applied to the drawing geometry
       * @defaultValue `0.5`
       */
      fillAlpha: fields.AlphaField<{ initial: 0.5; label: "DRAWING.FillOpacity" }>;

      /**
       * The width in pixels of the boundary lines of the drawing geometry
       * @defaultValue `8`
       */
      strokeWidth: fields.NumberField<{
        nullable: false;
        integer: true;
        initial: 8;
        min: 0;
        label: "DRAWING.LineWidth";
      }>;

      /**
       * The color of the boundary lines of the drawing geometry
       * @defaultValue `game.user?.color.css || "#ffffff"`
       */
      strokeColor: fields.ColorField<{ nullable: false; initial: () => string; label: "DRAWING.StrokeColor" }>;

      /**
       * The opacity of the boundary lines of the drawing geometry
       * @defaultValue `1`
       */
      strokeAlpha: fields.AlphaField<{ initial: 1; label: "DRAWING.LineOpacity" }>;

      /**
       * The path to a tiling image texture used to fill the drawing geometry
       * @defaultValue `null`
       */
      texture: fields.FilePathField<{ categories: ["IMAGE"]; label: "DRAWING.FillTexture" }>;

      /**
       * Optional text which is displayed overtop of the drawing
       * @defaultValue `undefined`
       */
      text: fields.StringField<{ label: "DRAWING.TextLabel" }>;

      /**
       * The font family used to display text within this drawing, defaults to CONFIG.defaultFontFamily
       * @defaultValue `globalThis.CONFIG?.defaultFontFamily || "Signika"`
       */
      fontFamily: fields.StringField<{ blank: false; label: "DRAWING.FontFamily"; initial: () => string }>;

      /**
       * The font size used to display text within this drawing
       * @defaultValue `48`
       */
      fontSize: fields.NumberField<{
        nullable: false;
        integer: true;
        min: 8;
        max: 256;
        initial: 48;
        label: "DRAWING.FontSize";
        validationError: "must be an integer between 8 and 256";
      }>;

      /**
       * The color of text displayed within this drawing
       * @defaultValue `#FFFFFF`
       */
      textColor: fields.ColorField<{ nullable: false; initial: "#FFFFFF"; label: "DRAWING.TextColor" }>;

      /**
       * The opacity of text displayed within this drawing
       * @defaultValue `1`
       */
      textAlpha: fields.AlphaField<{ label: "DRAWING.TextOpacity" }>;

      /**
       * Is the drawing currently hidden?
       * @defaultValue `false`
       */
      hidden: fields.BooleanField;

      /**
       * Is the drawing currently locked?
       * @defaultValue `false`
       */
      locked: fields.BooleanField;

      /**
       * An object of optional key/value flags
       * @defaultValue `{}`
       */
      flags: fields.ObjectField.FlagsField<"Drawing">;
    }

    namespace DatabaseOperation {
      /** Options passed along in Get operations for DrawingDocuments */
      interface Get extends foundry.abstract.types.DatabaseGetOperation<DrawingDocument.Parent> {}
      /** Options passed along in Create operations for DrawingDocuments */
      interface Create<Temporary extends boolean | undefined = boolean | undefined>
        extends foundry.abstract.types.DatabaseCreateOperation<
          DrawingDocument.CreateData,
          DrawingDocument.Parent,
          Temporary
        > {}
      /** Options passed along in Delete operations for DrawingDocuments */
      interface Delete extends foundry.abstract.types.DatabaseDeleteOperation<DrawingDocument.Parent> {}
      /** Options passed along in Update operations for DrawingDocuments */
      interface Update
        extends foundry.abstract.types.DatabaseUpdateOperation<DrawingDocument.UpdateData, DrawingDocument.Parent> {}

      /** Options for {@link DrawingDocument.createDocuments | `DrawingDocument.createDocuments`} */
      type CreateOperation<Temporary extends boolean | undefined = boolean | undefined> =
        Document.Database.CreateOperation<Create<Temporary>>;
      /** Options for {@link DrawingDocument._preCreateOperation | `DrawingDocument._preCreateOperation`} */
      type PreCreateOperationStatic = Document.Database.PreCreateOperationStatic<Create>;
      /** Options for {@link DrawingDocument._preCreate | `DrawingDocument#_preCreate`} */
      type PreCreateOperationInstance = Document.Database.PreCreateOptions<Create>;
      /** Options for {@link DrawingDocument._onCreate | `DrawingDocument#_onCreate`} */
      type OnCreateOperation = Document.Database.CreateOptions<Create>;

      /** Options for {@link DrawingDocument.updateDocuments | `DrawingDocument.updateDocuments`} */
      type UpdateOperation = Document.Database.UpdateDocumentsOperation<Update>;
      /** Options for {@link DrawingDocument._preUpdateOperation | `DrawingDocument._preUpdateOperation`} */
      type PreUpdateOperationStatic = Document.Database.PreUpdateOperationStatic<Update>;
      /** Options for {@link DrawingDocument._preUpdate | `DrawingDocument#_preUpdate`} */
      type PreUpdateOperationInstance = Document.Database.PreUpdateOptions<Update>;
      /** Options for {@link DrawingDocument._onUpdate | `DrawingDocument#_onUpdate`} */
      type OnUpdateOperation = Document.Database.UpdateOptions<Update>;

      /** Options for {@link DrawingDocument.deleteDocuments | `DrawingDocument.deleteDocuments`} */
      type DeleteOperation = Document.Database.DeleteDocumentsOperation<Delete>;
      /** Options for {@link DrawingDocument._preDeleteOperation | `DrawingDocument._preDeleteOperation`} */
      type PreDeleteOperationStatic = Document.Database.PreDeleteOperationStatic<Delete>;
      /** Options for {@link DrawingDocument._preDelete | `DrawingDocument#_preDelete`} */
      type PreDeleteOperationInstance = Document.Database.PreDeleteOperationInstance<Delete>;
      /** Options for {@link DrawingDocument._onDelete | `DrawingDocument#_onDelete`} */
      type OnDeleteOperation = Document.Database.DeleteOptions<Delete>;
    }

    /**
     * @deprecated {@link DrawingDocument.DatabaseOperation | `DrawingDocument.DatabaseOperation`}
     */
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    interface DatabaseOperations extends Document.Database.Operations<DrawingDocument> {}

    /**
     * @deprecated {@link DrawingDocument.CreateData | `DrawingDocument.CreateData`}
     */
    interface ConstructorData extends DrawingDocument.CreateData {}

    /**
     * @deprecated {@link DrawingDocument.implementation | `DrawingDocument.ImplementationClass`}
     */
    type ConfiguredClass = ImplementationClass;

    /**
     * @deprecated {@link DrawingDocument.Implementation | `DrawingDocument.Implementation`}
     */
    type ConfiguredInstance = Implementation;
  }

  /**
   * The client-side Drawing document which extends the common BaseDrawing model.
   *
   * @see {@link Scene | `Scene`}               The Scene document type which contains Drawing embedded documents
   * @see {@link DrawingConfig | `DrawingConfig`}       The Drawing configuration application
   */
  class DrawingDocument extends CanvasDocumentMixin(foundry.documents.BaseDrawing) {
    /**
     * @param data    - Initial data from which to construct the `DrawingDocument`
     * @param context - Construction context options
     *
     * @deprecated Constructing `DrawingDocument` directly is not advised. While `new DrawingDocument(...)` would create a
     * temporary document it would not respect a system's subclass of `DrawingDocument`, if any.
     *
     * You should use {@link DrawingDocument.implementation | `new DrawingDocument.implementation(...)`} instead which
     * will give you a system specific implementation of `DrawingDocument`.
     */
    constructor(...args: Document.ConstructorParameters<DrawingDocument.CreateData, DrawingDocument.Parent>);

    /**
     * Is the current User the author of this drawing?
     */
    get isAuthor(): boolean;

    /*
     * After this point these are not really overridden methods.
     * They are here because they're static properties but depend on the instance and so can't be
     * defined DRY-ly while also being easily overridable.
     */

    static override defaultName(
      context: Document.DefaultNameContext<"base", NonNullable<DrawingDocument.Parent>>,
    ): string;

    static override createDialog(
      data: Document.CreateDialogData<DrawingDocument.CreateData>,
      context: Document.CreateDialogContext<string, NonNullable<DrawingDocument.Parent>>,
    ): Promise<DrawingDocument.Stored | null | undefined>;

    static override fromDropData(
      data: Document.DropData<DrawingDocument.Implementation>,
      options?: Document.FromDropDataOptions,
    ): Promise<DrawingDocument.Implementation | undefined>;

    static override fromImport(
      source: DrawingDocument.Source,
      context?: Document.FromImportContext<DrawingDocument.Parent>,
    ): Promise<DrawingDocument.Implementation>;
  }
}
