import type { AnyObject, Merge } from "#utils";
import type { documents } from "#client-esm/client.d.mts";
import type Document from "#common/abstract/document.d.mts";
import type { DataSchema } from "#common/data/fields.d.mts";
import type { ShapeData } from "#common/data/data.mjs";

import fields = foundry.data.fields;
import type BaseDrawing from "#common/documents/drawing.mjs";

declare global {
  namespace DrawingDocument {
    /**
     * The document's name.
     */
    type Name = "Drawing";

    /**
     * The arguments to construct the document.
     */
    type ConstructorArgs = Document.ConstructorParameters<CreateData, Parent>;

    /**
     * The documents embedded within `DrawingDocument`.
     */
    type Hierarchy = Readonly<Document.HierarchyOf<Schema>>;

    /**
     * The implementation of the `DrawingDocument` document instance configured through `CONFIG.Drawing.documentClass` in Foundry and
     * {@linkcode DocumentClassConfig} or {@link ConfiguredDrawingDocument | `fvtt-types/configuration/ConfiguredDrawingDocument`} in fvtt-types.
     */
    type Implementation = Document.ImplementationFor<"Drawing">;

    /**
     * The implementation of the `DrawingDocument` document configured through `CONFIG.DrawingDocument.documentClass` in Foundry and
     * {@linkcode DocumentClassConfig} in fvtt-types.
     */
    type ImplementationClass = Document.ImplementationClassFor<"Drawing">;

    /**
     * A document's metadata is special information about the document ranging anywhere from its name,
     * whether it's indexed, or to the permissions a user has over it.
     */
    interface Metadata
      extends Merge<
        Document.Metadata.Default,
        Readonly<{
          name: "Drawing";
          collection: "drawings";
          label: string;
          labelPlural: string;
          isEmbedded: true;
          permissions: Metadata.Permissions;
          schemaVersion: string;
        }>
      > {}

    namespace Metadata {
      /**
       * The permissions for whether a certain user can create, update, or delete this document.
       */
      interface Permissions {
        create: "DRAWING_CREATE";
        update(user: User.Internal.Implementation, doc: Implementation, data: UpdateData): boolean;
        delete(user: User.Internal.Implementation, doc: Implementation, data: UpdateData): boolean;
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
    // Note: Takes any document in the heritage chain (i.e. itself or any parent, transitive or not) that can be contained in a compendium.
    type Pack = CompendiumCollection.ForDocument<"Scene">;

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
     * An instance of `DrawingDocument` that comes from the database but failed validation meaning that
     * its `system` and `_source` could theoretically be anything.
     */
    interface Invalid extends Document.Invalid<DrawingDocument.Implementation> {}

    /**
     * An instance of `DrawingDocument` that comes from the database.
     */
    interface Stored extends Document.Stored<DrawingDocument.Implementation> {}

    /**
     * The data put in {@link DrawingDocument._source | `DrawingDocument#_source`}. This data is what was
     * persisted to the database and therefore it must be valid JSON.
     *
     * For example a {@link fields.SetField | `SetField`} is persisted to the database as an array
     * but initialized as a {@linkcode Set}.
     */
    interface Source extends fields.SchemaField.SourceData<Schema> {}

    /**
     * @deprecated Replaced with {@linkcode DrawingDocument.Source}
     */
    type PersistedData = Source;

    /**
     * The data necessary to create a document. Used in places like {@linkcode DrawingDocument.create}
     * and {@link DrawingDocument | `new DrawingDocument(...)`}.
     *
     * For example a {@link fields.SetField | `SetField`} can accept any {@linkcode Iterable}
     * with the right values. This means you can pass a `Set` instance, an array of values,
     * a generator, or any other iterable.
     */
    interface CreateData extends fields.SchemaField.CreateData<Schema> {}

    /**
     * The data after a {@link foundry.abstract.Document | `Document`} has been initialized, for example
     * {@link DrawingDocument.name | `DrawingDocument#name`}.
     *
     * This is data transformed from {@linkcode DrawingDocument.Source} and turned into more
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
     * The schema for {@linkcode DrawingDocument}. This is the source of truth for how an DrawingDocument document
     * must be structured.
     *
     * Foundry uses this schema to validate the structure of the {@linkcode DrawingDocument}. For example
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
       * @defaultValue see {@linkcode ShapeData.Schema}
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
        // FIXME: Without these overrides, the branded type from `choices` is not respected, and the field types as `number`
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

    namespace Database {
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

      /** Operation for {@linkcode DrawingDocument.createDocuments} */
      interface CreateDocumentsOperation<Temporary extends boolean | undefined>
        extends Document.Database.CreateOperation<DrawingDocument.Database.Create<Temporary>> {}

      /** Operation for {@linkcode DrawingDocument.updateDocuments} */
      interface UpdateDocumentsOperation
        extends Document.Database.UpdateDocumentsOperation<DrawingDocument.Database.Update> {}

      /** Operation for {@linkcode DrawingDocument.deleteDocuments} */
      interface DeleteDocumentsOperation
        extends Document.Database.DeleteDocumentsOperation<DrawingDocument.Database.Delete> {}

      /** Operation for {@linkcode DrawingDocument.create} */
      interface CreateOperation<Temporary extends boolean | undefined>
        extends Document.Database.CreateOperation<DrawingDocument.Database.Create<Temporary>> {}

      /** Operation for {@link DrawingDocument.update | `DrawingDocument#update`} */
      interface UpdateOperation extends Document.Database.UpdateOperation<Update> {}

      interface DeleteOperation extends Document.Database.DeleteOperation<Delete> {}

      /** Options for {@linkcode DrawingDocument.get} */
      interface GetOptions extends Document.Database.GetOptions {}

      /** Options for {@link DrawingDocument._preCreate | `DrawingDocument#_preCreate`} */
      interface PreCreateOptions extends Document.Database.PreCreateOptions<Create> {}

      /** Options for {@link DrawingDocument._onCreate | `DrawingDocument#_onCreate`} */
      interface OnCreateOptions extends Document.Database.CreateOptions<Create> {}

      /** Operation for {@linkcode DrawingDocument._preCreateOperation} */
      interface PreCreateOperation
        extends Document.Database.PreCreateOperationStatic<DrawingDocument.Database.Create> {}

      /** Operation for {@link DrawingDocument._onCreateOperation | `DrawingDocument#_onCreateOperation`} */
      interface OnCreateOperation extends DrawingDocument.Database.Create {}

      /** Options for {@link DrawingDocument._preUpdate | `DrawingDocument#_preUpdate`} */
      interface PreUpdateOptions extends Document.Database.PreUpdateOptions<Update> {}

      /** Options for {@link DrawingDocument._onUpdate | `DrawingDocument#_onUpdate`} */
      interface OnUpdateOptions extends Document.Database.UpdateOptions<Update> {}

      /** Operation for {@linkcode DrawingDocument._preUpdateOperation} */
      interface PreUpdateOperation extends DrawingDocument.Database.Update {}

      /** Operation for {@link DrawingDocument._onUpdateOperation | `DrawingDocument._preUpdateOperation`} */
      interface OnUpdateOperation extends DrawingDocument.Database.Update {}

      /** Options for {@link DrawingDocument._preDelete | `DrawingDocument#_preDelete`} */
      interface PreDeleteOptions extends Document.Database.PreDeleteOperationInstance<Delete> {}

      /** Options for {@link DrawingDocument._onDelete | `DrawingDocument#_onDelete`} */
      interface OnDeleteOptions extends Document.Database.DeleteOptions<Delete> {}

      /** Options for {@link DrawingDocument._preDeleteOperation | `DrawingDocument#_preDeleteOperation`} */
      interface PreDeleteOperation extends DrawingDocument.Database.Delete {}

      /** Options for {@link DrawingDocument._onDeleteOperation | `DrawingDocument#_onDeleteOperation`} */
      interface OnDeleteOperation extends DrawingDocument.Database.Delete {}

      /** Context for {@linkcode DrawingDocument._onDeleteOperation} */
      interface OnDeleteDocumentsContext extends Document.ModificationContext<DrawingDocument.Parent> {}

      /** Context for {@linkcode DrawingDocument._onCreateDocuments} */
      interface OnCreateDocumentsContext extends Document.ModificationContext<DrawingDocument.Parent> {}

      /** Context for {@linkcode DrawingDocument._onUpdateDocuments} */
      interface OnUpdateDocumentsContext extends Document.ModificationContext<DrawingDocument.Parent> {}

      /**
       * Options for {@link DrawingDocument._preCreateDescendantDocuments | `DrawingDocument#_preCreateDescendantDocuments`}
       * and {@link DrawingDocument._onCreateDescendantDocuments | `DrawingDocument#_onCreateDescendantDocuments`}
       */
      interface CreateOptions extends Document.Database.CreateOptions<DrawingDocument.Database.Create> {}

      /**
       * Options for {@link DrawingDocument._preUpdateDescendantDocuments | `DrawingDocument#_preUpdateDescendantDocuments`}
       * and {@link DrawingDocument._onUpdateDescendantDocuments | `DrawingDocument#_onUpdateDescendantDocuments`}
       */
      interface UpdateOptions extends Document.Database.UpdateOptions<DrawingDocument.Database.Update> {}

      /**
       * Options for {@link DrawingDocument._preDeleteDescendantDocuments | `DrawingDocument#_preDeleteDescendantDocuments`}
       * and {@link DrawingDocument._onDeleteDescendantDocuments | `DrawingDocument#_onDeleteDescendantDocuments`}
       */
      interface DeleteOptions extends Document.Database.DeleteOptions<DrawingDocument.Database.Delete> {}
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
     * @deprecated Replaced with {@link DrawingDocument.Database | `DrawingDocument.DatabaseOperation`}
     */
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    interface DatabaseOperations extends Document.Database.Operations<DrawingDocument.Implementation> {}

    /**
     * @deprecated Replaced with {@linkcode DrawingDocument.CreateData}
     */
    interface ConstructorData extends DrawingDocument.CreateData {}

    /**
     * @deprecated Replaced with {@link DrawingDocument.implementation | `DrawingDocument.ImplementationClass`}
     */
    type ConfiguredClass = ImplementationClass;

    /**
     * @deprecated Replaced with {@linkcode DrawingDocument.Implementation}
     */
    type ConfiguredInstance = Implementation;
  }

  /**
   * The client-side Drawing document which extends the common BaseDrawing model.
   *
   * @see {@linkcode Scene}               The Scene document type which contains Drawing embedded documents
   * @see {@linkcode DrawingConfig}       The Drawing configuration application
   */
  class DrawingDocument extends BaseDrawing.Internal.CanvasDocument {
    /**
     * @param data    - Initial data from which to construct the `DrawingDocument`
     * @param context - Construction context options
     */
    constructor(...args: DrawingDocument.ConstructorArgs);

    /**
     * Is the current User the author of this drawing?
     */
    get isAuthor(): boolean;

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

    // Descendant Document operations have been left out because Drawing does not have any descendant documents.

    // context: not null (destructured)
    static override defaultName(
      context?: Document.DefaultNameContext<"Drawing", NonNullable<DrawingDocument.Parent>>,
    ): string;

    /** @remarks `context.parent` is required as creation requires one */
    static override createDialog(
      data: Document.CreateDialogData<DrawingDocument.CreateData> | undefined,
      context: Document.CreateDialogContext<"Drawing", NonNullable<DrawingDocument.Parent>>,
    ): Promise<DrawingDocument.Stored | null | undefined>;

    // options: not null (parameter default only)
    static override fromDropData(
      data: Document.DropData<DrawingDocument.Implementation>,
      options?: AnyObject,
    ): Promise<DrawingDocument.Implementation | undefined>;

    static override fromImport(
      source: DrawingDocument.Source,
      context?: Document.FromImportContext<DrawingDocument.Parent> | null,
    ): Promise<DrawingDocument.Implementation>;

    override _onClickDocumentLink(event: MouseEvent): ClientDocument.OnClickDocumentLinkReturn;
  }
}
