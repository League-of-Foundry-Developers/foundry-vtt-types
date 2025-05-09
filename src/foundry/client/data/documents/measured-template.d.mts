import type { Merge } from "fvtt-types/utils";
import type { documents } from "#client-esm/client.d.mts";
import type Document from "#common/abstract/document.d.mts";
import type { DataSchema } from "#common/data/fields.d.mts";

import fields = foundry.data.fields;

declare global {
  namespace MeasuredTemplateDocument {
    /**
     * The document's name.
     */
    type Name = "MeasuredTemplate";

    /**
     * The arguments to construct the document.
     */
    type ConstructorArgs = Document.ConstructorParameters<CreateData, Parent>;

    /**
     * The documents embedded within `MeasuredTemplateDocument`.
     */
    type Hierarchy = Readonly<Document.HierarchyOf<Schema>>;

    /**
     * The implementation of the `MeasuredTemplateDocument` document instance configured through `CONFIG.MeasuredTemplateDocument.documentClass` in Foundry and
     * {@linkcode DocumentClassConfig} or {@link ConfiguredMeasuredTemplateDocument | `fvtt-types/configuration/ConfiguredMeasuredTemplateDocument`} in fvtt-types.
     */
    type Implementation = Document.ImplementationFor<Name>;

    /**
     * The implementation of the `MeasuredTemplateDocument` document configured through `CONFIG.MeasuredTemplateDocument.documentClass` in Foundry and
     * {@linkcode DocumentClassConfig} in fvtt-types.
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
          name: "MeasuredTemplate";
          collection: "templates";
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
        create(user: User.Internal.Implementation, doc: Implementation): boolean;
        update(user: User.Internal.Implementation, doc: Implementation, data: UpdateData): boolean;
        delete(user: User.Internal.Implementation, doc: Implementation, data: UpdateData): boolean;
      }
    }

    /**
     * A document's parent is something that can contain it.
     * For example an `Item` can be contained by an `Actor` which makes `Actor` one of its possible parents.
     */
    type Parent = null;

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
     * An instance of `MeasuredTemplateDocument` that comes from the database but failed validation meaning that
     * its `system` and `_source` could theoretically be anything.
     */
    interface Invalid extends Document.Invalid<MeasuredTemplateDocument.Implementation> {}

    /**
     * An instance of `MeasuredTemplateDocument` that comes from the database.
     */
    interface Stored extends Document.Stored<MeasuredTemplateDocument.Implementation> {}

    /**
     * The data put in {@link MeasuredTemplate._source | `MeasuredTemplate#_source`}. This data is what was
     * persisted to the database and therefore it must be valid JSON.
     *
     * For example a {@link fields.SetField | `SetField`} is persisted to the database as an array
     * but initialized as a {@linkcode Set}.
     */
    interface Source extends fields.SchemaField.SourceData<Schema> {}

    /**
     * @deprecated Replaced with {@linkcode MeasuredTemplateDocument.Source}
     */
    type PersistedData = Source;

    /**
     * The data necessary to create a document. Used in places like {@linkcode MeasuredTemplateDocument.create}
     * and {@link MeasuredTemplateDocument | `new MeasuredTemplateDocument(...)`}.
     *
     * For example a {@link fields.SetField | `SetField`} can accept any {@linkcode Iterable}
     * with the right values. This means you can pass a `Set` instance, an array of values,
     * a generator, or any other iterable.
     */
    interface CreateData extends fields.SchemaField.CreateData<Schema> {}

    /**
     * The data after a {@link foundry.abstract.Document | `Document`} has been initialized, for example
     * {@link MeasuredTemplateDocument.name | `MeasuredTemplateDocument#name`}.
     *
     * This is data transformed from {@linkcode MeasuredTemplateDocument.Source} and turned into more
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
     * The schema for {@linkcode MeasuredTemplateDocument}. This is the source of truth for how an MeasuredTemplateDocument document
     * must be structured.
     *
     * Foundry uses this schema to validate the structure of the {@linkcode MeasuredTemplateDocument}. For example
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
        // FIXME: Without these overrides, the branded type from `choices` is not respected, and the field types as `number`
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
      flags: fields.ObjectField.FlagsField<Name>;
    }

    namespace Database {
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

      /** Operation for {@linkcode MeasuredTemplateDocument.createDocuments} */
      interface CreateDocumentsOperation<Temporary extends boolean | undefined>
        extends Document.Database.CreateOperation<MeasuredTemplateDocument.Database.Create<Temporary>> {}

      /** Operation for {@linkcode MeasuredTemplateDocument.updateDocuments} */
      interface UpdateDocumentsOperation
        extends Document.Database.UpdateDocumentsOperation<MeasuredTemplateDocument.Database.Update> {}

      /** Operation for {@linkcode MeasuredTemplateDocument.deleteDocuments} */
      interface DeleteDocumentsOperation
        extends Document.Database.DeleteDocumentsOperation<MeasuredTemplateDocument.Database.Delete> {}

      /** Operation for {@linkcode MeasuredTemplateDocument.create} */
      interface CreateOperation<Temporary extends boolean | undefined>
        extends Document.Database.CreateOperation<MeasuredTemplateDocument.Database.Create<Temporary>> {}

      /** Operation for {@link MeasuredTemplateDocument.update | `MeasuredTemplateDocument#update`} */
      interface UpdateOperation extends Document.Database.UpdateOperation<Update> {}

      interface DeleteOperation extends Document.Database.DeleteOperation<Delete> {}

      /** Options for {@linkcode MeasuredTemplateDocument.get} */
      interface GetOptions extends Document.Database.GetOptions {}

      /** Options for {@link MeasuredTemplateDocument._preCreate | `MeasuredTemplateDocument#_preCreate`} */
      interface PreCreateOptions extends Document.Database.PreCreateOptions<Create> {}

      /** Options for {@link MeasuredTemplateDocument._onCreate | `MeasuredTemplateDocument#_onCreate`} */
      interface OnCreateOptions extends Document.Database.CreateOptions<Create> {}

      /** Operation for {@linkcode MeasuredTemplateDocument._preCreateOperation} */
      interface PreCreateOperation
        extends Document.Database.PreCreateOperationStatic<MeasuredTemplateDocument.Database.Create> {}

      /** Operation for {@link MeasuredTemplateDocument._onCreateOperation | `MeasuredTemplateDocument#_onCreateOperation`} */
      interface OnCreateOperation extends MeasuredTemplateDocument.Database.Create {}

      /** Options for {@link MeasuredTemplateDocument._preUpdate | `MeasuredTemplateDocument#_preUpdate`} */
      interface PreUpdateOptions extends Document.Database.PreUpdateOptions<Update> {}

      /** Options for {@link MeasuredTemplateDocument._onUpdate | `MeasuredTemplateDocument#_onUpdate`} */
      interface OnUpdateOptions extends Document.Database.UpdateOptions<Update> {}

      /** Operation for {@linkcode MeasuredTemplateDocument._preUpdateOperation} */
      interface PreUpdateOperation extends MeasuredTemplateDocument.Database.Update {}

      /** Operation for {@link MeasuredTemplateDocument._onUpdateOperation | `MeasuredTemplateDocument._preUpdateOperation`} */
      interface OnUpdateOperation extends MeasuredTemplateDocument.Database.Update {}

      /** Options for {@link MeasuredTemplateDocument._preDelete | `MeasuredTemplateDocument#_preDelete`} */
      interface PreDeleteOptions extends Document.Database.PreDeleteOperationInstance<Delete> {}

      /** Options for {@link MeasuredTemplateDocument._onDelete | `MeasuredTemplateDocument#_onDelete`} */
      interface OnDeleteOptions extends Document.Database.DeleteOptions<Delete> {}

      /** Options for {@link MeasuredTemplateDocument._preDeleteOperation | `MeasuredTemplateDocument#_preDeleteOperation`} */
      interface PreDeleteOperation extends MeasuredTemplateDocument.Database.Delete {}

      /** Options for {@link MeasuredTemplateDocument._onDeleteOperation | `MeasuredTemplateDocument#_onDeleteOperation`} */
      interface OnDeleteOperation extends MeasuredTemplateDocument.Database.Delete {}

      /** Context for {@linkcode MeasuredTemplateDocument._onDeleteOperation} */
      interface OnDeleteDocumentsContext extends Document.ModificationContext<MeasuredTemplateDocument.Parent> {}

      /** Context for {@linkcode MeasuredTemplateDocument._onCreateDocuments} */
      interface OnCreateDocumentsContext extends Document.ModificationContext<MeasuredTemplateDocument.Parent> {}

      /** Context for {@linkcode MeasuredTemplateDocument._onUpdateDocuments} */
      interface OnUpdateDocumentsContext extends Document.ModificationContext<MeasuredTemplateDocument.Parent> {}

      /**
       * Options for {@link MeasuredTemplateDocument._preCreateDescendantDocuments | `MeasuredTemplateDocument#_preCreateDescendantDocuments`}
       * and {@link MeasuredTemplateDocument._onCreateDescendantDocuments | `MeasuredTemplateDocument#_onCreateDescendantDocuments`}
       */
      interface CreateOptions extends Document.Database.CreateOptions<MeasuredTemplateDocument.Database.Create> {}

      /**
       * Options for {@link MeasuredTemplateDocument._preUpdateDescendantDocuments | `MeasuredTemplateDocument#_preUpdateDescendantDocuments`}
       * and {@link MeasuredTemplateDocument._onUpdateDescendantDocuments | `MeasuredTemplateDocument#_onUpdateDescendantDocuments`}
       */
      interface UpdateOptions extends Document.Database.UpdateOptions<MeasuredTemplateDocument.Database.Update> {}

      /**
       * Options for {@link MeasuredTemplateDocument._preDeleteDescendantDocuments | `MeasuredTemplateDocument#_preDeleteDescendantDocuments`}
       * and {@link MeasuredTemplateDocument._onDeleteDescendantDocuments | `MeasuredTemplateDocument#_onDeleteDescendantDocuments`}
       */
      interface DeleteOptions extends Document.Database.DeleteOptions<MeasuredTemplateDocument.Database.Delete> {}
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
     * @deprecated Replaced with {@link MeasuredTemplateDocument.Database | `MeasuredTemplateDocument.DatabaseOperation`}
     */
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    interface DatabaseOperations extends Document.Database.Operations<MeasuredTemplateDocument.Implementation> {}

    /**
     * @deprecated Replaced with {@linkcode MeasuredTemplateDocument.CreateData}
     */
    interface ConstructorData extends MeasuredTemplateDocument.CreateData {}

    /**
     * @deprecated Replaced with {@link MeasuredTemplateDocument.implementation | `MeasuredTemplateDocument.ImplementationClass`}
     */
    type ConfiguredClass = ImplementationClass;

    /**
     * @deprecated Replaced with {@linkcode MeasuredTemplateDocument.Implementation}
     */
    type ConfiguredInstance = Implementation;
  }

  /**
   * The client-side MeasuredTemplate document which extends the common BaseMeasuredTemplate document model.
   *
   * @see {@linkcode Scene}                     The Scene document type which contains MeasuredTemplate documents
   * @see {@linkcode MeasuredTemplateConfig}    The MeasuredTemplate configuration application
   */
  class MeasuredTemplateDocument extends CanvasDocumentMixin(foundry.documents.BaseMeasuredTemplate) {
    /**
     * @param data    - Initial data from which to construct the `MeasuredTemplateDocument`
     * @param context - Construction context options
     */
    constructor(...args: MeasuredTemplateDocument.ConstructorArgs);

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
     * They are here because Foundry's documents are complex and have lots of edge cases.
     * There are DRY ways of representing this but this ends up being harder to understand
     * for end users extending these functions, especially for static methods. There are also a
     * number of methods that don't make sense to call directly on `Document` like `createDocuments`,
     * as there is no data that can safely construct every possible document. Finally keeping definitions
     * separate like this helps against circularities.
     */

    // ClientDocument overrides

    // Descendant Document operations have been left out because MeasuredTemplate does not have any descendant documents.

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
