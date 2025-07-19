import type { InexactPartial, Merge } from "#utils";
import type { documents } from "#client/client.d.mts";
import type Document from "#common/abstract/document.d.mts";
import type { DataSchema } from "#common/data/fields.d.mts";
import type BaseNote from "#common/documents/note.d.mts";
import type { TextureData } from "#common/data/data.mjs";

import fields = foundry.data.fields;

declare namespace NoteDocument {
  /**
   * The document's name.
   */
  type Name = "Note";

  /**
   * The context used to create a `Note`.
   */
  interface ConstructionContext extends Document.ConstructionContext<Parent> {}

  /**
   * The documents embedded within `NoteDocument`.
   */
  type Hierarchy = Readonly<Document.HierarchyOf<Schema>>;

  /**
   * The implementation of the `NoteDocument` document instance configured through `CONFIG.Note.documentClass` in Foundry and
   * {@linkcode DocumentClassConfig} or {@link ConfiguredNoteDocument | `fvtt-types/configuration/ConfiguredNoteDocument`} in fvtt-types.
   */
  type Implementation = Document.ImplementationFor<Name>;

  /**
   * The implementation of the `NoteDocument` document configured through `CONFIG.Note.documentClass` in Foundry and
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
        name: "Note";
        collection: "notes";
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
      create(user: User.Internal.Implementation, doc: Implementation, data: CreateData): boolean;
      delete: "OWNER";
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
   *
   * Will be `never` if cannot be contained in a `CompendiumCollection`.
   */
  // Note: Takes any document in the heritage chain (i.e. itself or any parent, transitive or not) that can be contained in a compendium.
  type Pack = foundry.documents.collections.CompendiumCollection.ForDocument<"Scene">;

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
   * An instance of `NoteDocument` that comes from the database but failed validation meaning that
   * its `system` and `_source` could theoretically be anything.
   */
  type Invalid = Document.Internal.Invalid<Implementation>;

  /**
   * An instance of `NoteDocument` that comes from the database.
   */
  type Stored = Document.Internal.Stored<NoteDocument.Implementation>;

  /**
   * The data put in {@link NoteDocument._source | `NoteDocument#_source`}. This data is what was
   * persisted to the database and therefore it must be valid JSON.
   *
   * For example a {@link fields.SetField | `SetField`} is persisted to the database as an array
   * but initialized as a {@linkcode Set}.
   */
  interface Source extends fields.SchemaField.SourceData<Schema> {}

  /**
   * The data necessary to create a document. Used in places like {@linkcode NoteDocument.create}
   * and {@link NoteDocument | `new NoteDocument(...)`}.
   *
   * For example a {@link fields.SetField | `SetField`} can accept any {@linkcode Iterable}
   * with the right values. This means you can pass a `Set` instance, an array of values,
   * a generator, or any other iterable.
   */
  interface CreateData extends fields.SchemaField.CreateData<Schema> {}

  /**
   * The data after a {@link foundry.abstract.Document | `Document`} has been initialized, for example
   * {@link NoteDocument.name | `NoteDocument#name`}.
   *
   * This is data transformed from {@linkcode NoteDocument.Source} and turned into more
   * convenient runtime data structures. For example a {@link fields.SetField | `SetField`} is
   * persisted to the database as an array of values but at runtime it is a `Set` instance.
   */
  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

  /**
   * The data used to update a document, for example {@link NoteDocument.update | `NoteDocument#update`}.
   * It is a distinct type from {@link NoteDocument.CreateData | `DeepPartial<NoteDocument.CreateData>`} because
   * it has different rules for `null` and `undefined`.
   */
  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  /**
   * The schema for {@linkcode NoteDocument}. This is the source of truth for how an NoteDocument document
   * must be structured.
   *
   * Foundry uses this schema to validate the structure of the {@linkcode NoteDocument}. For example
   * a {@link fields.StringField | `StringField`} will enforce that the value is a string. More
   * complex fields like {@link fields.SetField | `SetField`} goes through various conversions
   * starting as an array in the database, initialized as a set, and allows updates with any
   * iterable.
   */
  interface Schema extends DataSchema {
    /**
     * The _id which uniquely identifies this BaseNote embedded document
     * @defaultValue `null`
     */
    _id: fields.DocumentIdField;

    /**
     * The _id of a JournalEntry document which this Note represents
     * @defaultValue `null`
     */
    entryId: fields.ForeignDocumentField<typeof documents.BaseJournalEntry, { idOnly: true }>;

    /**
     * The _id of a specific JournalEntryPage document which this Note represents
     * @defaultValue `null`
     */
    pageId: fields.ForeignDocumentField<typeof documents.BaseJournalEntryPage, { idOnly: true }>;

    /**
     * The x-coordinate position of the center of the note icon
     * @defaultValue `0`
     */
    x: fields.NumberField<{ required: true; integer: true; nullable: false; initial: 0 }>;

    /**
     * The y-coordinate position of the center of the note icon
     * @defaultValue `0`
     */
    y: fields.NumberField<{ required: true; integer: true; nullable: false; initial: 0 }>;

    /**
     * The elevation of the note
     * @defaultValue `0`
     */
    elevation: fields.NumberField<{ required: true; nullable: false; initial: 0 }>;

    /**
     * The z-index of this note relative to other siblings
     * @defaultValue `0`
     */
    sort: fields.NumberField<{ required: true; integer: true; nullable: false; initial: 0 }>;

    /**
     * An image icon used to represent this note
     * @defaultValue `BaseNote.DEFAULT_ICON`
     */
    texture: TextureData<{
      categories: ["IMAGE"];
      initial: {
        src: () => typeof BaseNote.DEFAULT_ICON;
        anchorX: 0.5;
        anchorY: 0.5;
        fit: "contain";
      };
    }>;

    /**
     * The pixel size of the map note icon
     * @defaultValue `40`
     */
    iconSize: fields.NumberField<{
      required: true;
      nullable: false;
      integer: true;
      min: 32;
      initial: 40;
      validationError: "must be an integer greater than 32";
    }>;

    /**
     * Optional text which overrides the title of the linked Journal Entry
     * @defaultValue `""`
     */
    text: fields.StringField<{ textSearch: true }>;

    /**
     * The font family used to display the text label on this note, defaults to CONFIG.defaultFontFamily
     * @defaultValue `globalThis.CONFIG?.defaultFontFamily || "Signika"`
     */
    fontFamily: fields.StringField<{ required: true; initial: () => string }>;

    /**
     * The font size used to display the text label on this note
     * @defaultValue `32`
     */
    fontSize: fields.NumberField<{
      required: true;
      integer: true;
      min: 8;
      max: 128;
      initial: 32;
      validationError: "must be an integer between 8 and 128";
    }>;

    /**
     * A value in CONST.TEXT_ANCHOR_POINTS which defines where the text label anchors to the note icon.
     * @defaultValue `CONST.TEXT_ANCHOR_POINTS.BOTTOM`
     */
    textAnchor: fields.NumberField<
      {
        required: true;
        choices: CONST.TEXT_ANCHOR_POINTS[];
        initial: typeof CONST.TEXT_ANCHOR_POINTS.BOTTOM;
        validationError: "must be a value in CONST.TEXT_ANCHOR_POINTS";
      },
      CONST.TEXT_ANCHOR_POINTS | null | undefined,
      CONST.TEXT_ANCHOR_POINTS | null,
      CONST.TEXT_ANCHOR_POINTS | null
    >;

    /**
     * The string that defines the color with which the note text is rendered
     * @defaultValue `#FFFFFF`
     */
    textColor: fields.ColorField<{ required: true; nullable: false; initial: "#FFFFFF" }>;

    /**
     * Whether this map pin is globally visible or requires LoS to see.
     * @defaultValue `false`
     */
    global: fields.BooleanField;

    /**
     * An object of optional key/value flags
     * @defaultValue `{}`
     */
    flags: fields.DocumentFlagsField<Name>;
  }

  namespace Database {
    /** Options passed along in Get operations for NoteDocuments */
    interface Get extends foundry.abstract.types.DatabaseGetOperation<NoteDocument.Parent> {}

    /** Options passed along in Create operations for NoteDocuments */
    interface Create<Temporary extends boolean | undefined = boolean | undefined>
      extends foundry.abstract.types.DatabaseCreateOperation<NoteDocument.CreateData, NoteDocument.Parent, Temporary> {}

    /** Options passed along in Delete operations for NoteDocuments */
    interface Delete extends foundry.abstract.types.DatabaseDeleteOperation<NoteDocument.Parent> {}

    /** Options passed along in Update operations for NoteDocuments */
    interface Update
      extends foundry.abstract.types.DatabaseUpdateOperation<NoteDocument.UpdateData, NoteDocument.Parent> {}

    /** Operation for {@linkcode NoteDocument.createDocuments} */
    interface CreateDocumentsOperation<Temporary extends boolean | undefined>
      extends Document.Database.CreateOperation<NoteDocument.Database.Create<Temporary>> {}

    /** Operation for {@linkcode NoteDocument.updateDocuments} */
    interface UpdateDocumentsOperation
      extends Document.Database.UpdateDocumentsOperation<NoteDocument.Database.Update> {}

    /** Operation for {@linkcode NoteDocument.deleteDocuments} */
    interface DeleteDocumentsOperation
      extends Document.Database.DeleteDocumentsOperation<NoteDocument.Database.Delete> {}

    /** Operation for {@linkcode NoteDocument.create} */
    interface CreateOperation<Temporary extends boolean | undefined>
      extends Document.Database.CreateOperation<NoteDocument.Database.Create<Temporary>> {}

    /** Operation for {@link NoteDocument.update | `NoteDocument#update`} */
    interface UpdateOperation extends Document.Database.UpdateOperation<Update> {}

    interface DeleteOperation extends Document.Database.DeleteOperation<Delete> {}

    /** Options for {@linkcode NoteDocument.get} */
    interface GetOptions extends Document.Database.GetOptions {}

    /** Options for {@link NoteDocument._preCreate | `NoteDocument#_preCreate`} */
    interface PreCreateOptions extends Document.Database.PreCreateOptions<Create> {}

    /** Options for {@link NoteDocument._onCreate | `NoteDocument#_onCreate`} */
    interface OnCreateOptions extends Document.Database.CreateOptions<Create> {}

    /** Operation for {@linkcode NoteDocument._preCreateOperation} */
    interface PreCreateOperation extends Document.Database.PreCreateOperationStatic<NoteDocument.Database.Create> {}

    /** Operation for {@link NoteDocument._onCreateOperation | `NoteDocument#_onCreateOperation`} */
    interface OnCreateOperation extends NoteDocument.Database.Create {}

    /** Options for {@link NoteDocument._preUpdate | `NoteDocument#_preUpdate`} */
    interface PreUpdateOptions extends Document.Database.PreUpdateOptions<Update> {}

    /** Options for {@link NoteDocument._onUpdate | `NoteDocument#_onUpdate`} */
    interface OnUpdateOptions extends Document.Database.UpdateOptions<Update> {}

    /** Operation for {@linkcode NoteDocument._preUpdateOperation} */
    interface PreUpdateOperation extends NoteDocument.Database.Update {}

    /** Operation for {@link NoteDocument._onUpdateOperation | `NoteDocument._preUpdateOperation`} */
    interface OnUpdateOperation extends NoteDocument.Database.Update {}

    /** Options for {@link NoteDocument._preDelete | `NoteDocument#_preDelete`} */
    interface PreDeleteOptions extends Document.Database.PreDeleteOperationInstance<Delete> {}

    /** Options for {@link NoteDocument._onDelete | `NoteDocument#_onDelete`} */
    interface OnDeleteOptions extends Document.Database.DeleteOptions<Delete> {}

    /** Options for {@link NoteDocument._preDeleteOperation | `NoteDocument#_preDeleteOperation`} */
    interface PreDeleteOperation extends NoteDocument.Database.Delete {}

    /** Options for {@link NoteDocument._onDeleteOperation | `NoteDocument#_onDeleteOperation`} */
    interface OnDeleteOperation extends NoteDocument.Database.Delete {}

    /** Context for {@linkcode NoteDocument._onDeleteOperation} */
    interface OnDeleteDocumentsContext extends Document.ModificationContext<NoteDocument.Parent> {}

    /** Context for {@linkcode NoteDocument._onCreateDocuments} */
    interface OnCreateDocumentsContext extends Document.ModificationContext<NoteDocument.Parent> {}

    /** Context for {@linkcode NoteDocument._onUpdateDocuments} */
    interface OnUpdateDocumentsContext extends Document.ModificationContext<NoteDocument.Parent> {}

    /**
     * Options for {@link NoteDocument._preCreateDescendantDocuments | `NoteDocument#_preCreateDescendantDocuments`}
     * and {@link NoteDocument._onCreateDescendantDocuments | `NoteDocument#_onCreateDescendantDocuments`}
     */
    interface CreateOptions extends Document.Database.CreateOptions<NoteDocument.Database.Create> {}

    /**
     * Options for {@link NoteDocument._preUpdateDescendantDocuments | `NoteDocument#_preUpdateDescendantDocuments`}
     * and {@link NoteDocument._onUpdateDescendantDocuments | `NoteDocument#_onUpdateDescendantDocuments`}
     */
    interface UpdateOptions extends Document.Database.UpdateOptions<NoteDocument.Database.Update> {}

    /**
     * Options for {@link NoteDocument._preDeleteDescendantDocuments | `NoteDocument#_preDeleteDescendantDocuments`}
     * and {@link NoteDocument._onDeleteDescendantDocuments | `NoteDocument#_onDeleteDescendantDocuments`}
     */
    interface DeleteOptions extends Document.Database.DeleteOptions<NoteDocument.Database.Delete> {}

    /**
     * Create options for {@linkcode NoteDocument.createDialog}.
     */
    interface DialogCreateOptions extends InexactPartial<Create> {}
  }

  /**
   * If `Temporary` is true then `NoteDocument.Implementation`, otherwise `NoteDocument.Stored`.
   */
  type TemporaryIf<Temporary extends boolean | undefined> = true extends Temporary
    ? NoteDocument.Implementation
    : NoteDocument.Stored;

  /**
   * The flags that are available for this document in the form `{ [scope: string]: { [key: string]: unknown } }`.
   */
  interface Flags extends Document.Internal.ConfiguredFlagsForName<Name> {}

  namespace Flags {
    /**
     * The valid scopes for the flags on this document e.g. `"core"` or `"dnd5e"`.
     */
    type Scope = Document.Internal.FlagKeyOf<Flags>;

    /**
     * The valid keys for a certain scope for example if the scope is "core" then a valid key may be `"sheetLock"` or `"viewMode"`.
     */
    type Key<Scope extends Flags.Scope> = Document.Internal.FlagKeyOf<Document.Internal.FlagGetKey<Flags, Scope>>;

    /**
     * Gets the type of a particular flag given a `Scope` and a `Key`.
     */
    type Get<Scope extends Flags.Scope, Key extends Flags.Key<Scope>> = Document.Internal.GetFlag<Flags, Scope, Key>;
  }

  interface DropData extends Document.Internal.DropData<Name> {}
  interface DropDataOptions extends Document.DropDataOptions {}

  interface DefaultNameContext extends Document.DefaultNameContext<Name, NonNullable<Parent>> {}

  interface CreateDialogData extends Document.CreateDialogData<CreateData> {}
  interface CreateDialogOptions extends Document.CreateDialogOptions<Name> {}

  /**
   * The arguments to construct the document.
   *
   * @deprecated Writing the signature directly has helped reduce circularities and therefore is
   * now recommended.
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  type ConstructorArgs = Document.ConstructorParameters<CreateData, Parent>;
}

/**
 * The client-side Note document which extends the common BaseNote model.
 * Each Note document contains NoteData which defines its data schema.
 *
 * @see {@linkcode Scene}               The Scene document type which contains Note embedded documents
 * @see {@linkcode NoteConfig}          The Note configuration application
 */
declare class NoteDocument extends BaseNote.Internal.CanvasDocument {
  /**
   * @param data    - Initial data from which to construct the `NoteDocument`
   * @param context - Construction context options
   */
  // Note(LukeAbby): Optional as there are currently no required properties on `CreateData`.
  constructor(data?: NoteDocument.CreateData, context?: NoteDocument.ConstructionContext);

  /** @remarks `createOptions` must contain a `pack` or `parent`. */
  static override createDialog(
    data: NoteDocument.CreateDialogData | undefined,
    createOptions: NoteDocument.Database.DialogCreateOptions,
    dialogoptions?: NoteDocument.CreateDialogOptions,
  ): Promise<NoteDocument.Stored | null | undefined>;

  override deleteDialog(
    options?: InexactPartial<foundry.applications.api.DialogV2.ConfirmConfig>,
    operation?: Document.Database.DeleteOperationForName<"Note">,
  ): Promise<this | false | null | undefined>;

  /**
   * The associated JournalEntry which is referenced by this Note
   */
  get entry(): JournalEntry.Implementation | undefined;

  /**
   * The specific JournalEntryPage within the associated JournalEntry referenced by this Note.
   */
  get page(): JournalEntryPage.Implementation | undefined;

  /**
   * The text label used to annotate this Note
   */
  get label(): string;

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

  // Descendant Document operations have been left out because Note does not have any descendant documents.

  /** @remarks `context` must contain a `pack` or `parent`. */
  static override defaultName(context: NoteDocument.DefaultNameContext): string;

  static override fromDropData(
    data: NoteDocument.DropData,
    options?: NoteDocument.DropDataOptions,
  ): Promise<NoteDocument.Implementation | undefined>;

  static override fromImport(
    source: NoteDocument.Source,
    context?: Document.FromImportContext<NoteDocument.Parent> | null,
  ): Promise<NoteDocument.Implementation>;

  override _onClickDocumentLink(event: MouseEvent): ClientDocument.OnClickDocumentLinkReturn;

  // Embedded document operations have been left out because Note does not have any embedded documents.
}

export default NoteDocument;
