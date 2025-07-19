import type { InexactPartial, Merge } from "#utils";
import type Document from "#common/abstract/document.d.mts";
import type { DataSchema } from "#common/data/fields.d.mts";
import type BaseAmbientSound from "#common/documents/ambient-sound.mjs";

import fields = foundry.data.fields;

declare namespace AmbientSoundDocument {
  /**
   * The document's name.
   */
  type Name = "AmbientSound";

  /**
   * The context used to create an `AmbientSoundDocument`.
   */
  interface ConstructionContext extends Document.ConstructionContext<Parent> {}

  /**
   * The documents embedded within `AmbientSoundDocument`.
   */
  type Hierarchy = Readonly<Document.HierarchyOf<Schema>>;

  /**
   * The implementation of the `AmbientSoundDocument` document instance configured through `CONFIG.AmbientSound.documentClass` in Foundry and
   * {@linkcode DocumentClassConfig} in fvtt-types.
   */
  type Implementation = Document.ImplementationFor<Name>;

  /**
   * The implementation of the `AmbientSoundDocument` document configured through `CONFIG.AmbientSound.documentClass` in Foundry and
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
        name: "AmbientSound";
        collection: "sounds";
        label: string;
        labelPlural: string;
        isEmbedded: true;
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
   * An instance of `AmbientSoundDocument` that comes from the database but failed validation meaning that
   * its `system` and `_source` could theoretically be anything.
   */
  type Invalid = Document.Internal.Invalid<Implementation>;

  /**
   * An instance of `AmbientSoundDocument` that comes from the database.
   */
  type Stored = Document.Internal.Stored<AmbientSoundDocument.Implementation>;

  /**
   * The data put in {@link AmbientSoundDocument._source | `AmbientSoundDocument#_source`}. This data is what was
   * persisted to the database and therefore it must be valid JSON.
   *
   * For example a {@link fields.SetField | `SetField`} is persisted to the database as an array
   * but initialized as a {@linkcode Set}.
   */
  interface Source extends fields.SchemaField.SourceData<Schema> {}

  /**
   * The data necessary to create a document. Used in places like {@linkcode AmbientSoundDocument.create}
   * and {@link AmbientSoundDocument | `new AmbientSoundDocument(...)`}.
   *
   * For example a {@link fields.SetField | `SetField`} can accept any {@linkcode Iterable}
   * with the right values. This means you can pass a `Set` instance, an array of values,
   * a generator, or any other iterable.
   */
  interface CreateData extends fields.SchemaField.CreateData<Schema> {}

  /**
   * The data after a {@link foundry.abstract.Document | `Document`} has been initialized, for example
   * {@link AmbientSoundDocument.name | `AmbientSoundDocument#name`}.
   *
   * This is data transformed from {@linkcode AmbientSoundDocument.Source} and turned into more
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
   * The schema for {@linkcode AmbientSoundDocument}. This is the source of truth for how an AmbientSoundDocument document
   * must be structured.
   *
   * Foundry uses this schema to validate the structure of the {@linkcode AmbientSoundDocument}. For example
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
    x: fields.NumberField<{ required: true; integer: true; nullable: false; initial: 0 }>;

    /**
     * The y-coordinate position of the origin of the sound.
     * @defaultValue `0`
     */
    y: fields.NumberField<{ required: true; integer: true; nullable: false; initial: 0 }>;

    /**
     * The elevation of the sound.
     * @defaultValue `0`
     */
    elevation: fields.NumberField<{ required: true; nullable: false; initial: 0 }>;

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
    }>;

    /**
     * The audio file path that is played by this sound
     * @defaultValue `null`
     */
    path: fields.FilePathField<{ categories: ["AUDIO"] }>;

    /**
     * Does this sound loop?
     * @defaultValue `false`
     */
    repeat: fields.BooleanField;

    /**
     * The audio volume of the sound, from 0 to 1
     * @defaultValue `0.5`
     */
    volume: fields.AlphaField<{ initial: 0.5; step: 0.01 }>;

    /**
     * Whether or not this sound source is constrained by Walls.
     * @defaultValue `true`
     */
    walls: fields.BooleanField<{ initial: true }>;

    /**
     * Whether to adjust the volume of the sound heard by the listener based on how
     * close the listener is to the center of the sound source.
     * @defaultValue `true`
     */
    easing: fields.BooleanField<{ initial: true }>;

    /**
     * Is the sound source currently hidden?
     * @defaultValue `false`
     */
    hidden: fields.BooleanField;

    /**
     * A darkness range (min and max) for which the source should be active
     * @defaultValue see properties
     */
    darkness: fields.SchemaField<{
      /** @defaultValue `0` */
      min: fields.AlphaField<{ initial: 0 }>;

      /** @defaultValue `1` */
      max: fields.AlphaField<{ initial: 1 }>;
    }>;

    /**
     * Special effects to apply to the sound
     * @defaultValue see properties
     */
    effects: fields.SchemaField<{
      /**
       * An effect configuration to apply to the sound when not muffled by walls (either clear of, or fully constrained by, walls)
       * @defaultValue see properties of {@link EffectsConfigSchema | `AmbientSoundDocument.EffectsConfigSchema`}
       */
      base: fields.SchemaField<EffectsConfigSchema>;

      /**
       * An effect configuration to apply to the sound when muffled by walls
       * @defaultValue see properties of {@link EffectsConfigSchema | `AmbientSoundDocument.EffectsConfigSchema`}
       */
      muffled: fields.SchemaField<EffectsConfigSchema>;
    }>;

    /**
     * An object of optional key/value flags
     * @defaultValue `{}`
     */
    flags: fields.DocumentFlagsField<Name>;
  }

  interface EffectsConfigSchema extends DataSchema {
    /**
     * @defaultValue `undefined`
     * @remarks This isn't enforced by the model, but in practice should only have values in `keyof CONFIG["soundEffects"]`
     */
    type: fields.StringField;

    /** @defaultValue `5` */
    intensity: fields.NumberField<{ required: true; integer: true; initial: 5; min: 1; max: 10 }>;
  }

  namespace Database {
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

    /** Operation for {@linkcode AmbientSoundDocument.createDocuments} */
    interface CreateDocumentsOperation<Temporary extends boolean | undefined>
      extends Document.Database.CreateOperation<AmbientSoundDocument.Database.Create<Temporary>> {}

    /** Operation for {@linkcode AmbientSoundDocument.updateDocuments} */
    interface UpdateDocumentsOperation
      extends Document.Database.UpdateDocumentsOperation<AmbientSoundDocument.Database.Update> {}

    /** Operation for {@linkcode AmbientSoundDocument.deleteDocuments} */
    interface DeleteDocumentsOperation
      extends Document.Database.DeleteDocumentsOperation<AmbientSoundDocument.Database.Delete> {}

    /** Operation for {@linkcode AmbientSoundDocument.create} */
    interface CreateOperation<Temporary extends boolean | undefined>
      extends Document.Database.CreateOperation<AmbientSoundDocument.Database.Create<Temporary>> {}

    /** Operation for {@link AmbientSoundDocument.update | `AmbientSoundDocument#update`} */
    interface UpdateOperation extends Document.Database.UpdateOperation<Update> {}

    interface DeleteOperation extends Document.Database.DeleteOperation<Delete> {}

    /** Options for {@linkcode AmbientSoundDocument.get} */
    interface GetOptions extends Document.Database.GetOptions {}

    /** Options for {@link AmbientSoundDocument._preCreate | `AmbientSoundDocument#_preCreate`} */
    interface PreCreateOptions extends Document.Database.PreCreateOptions<Create> {}

    /** Options for {@link AmbientSoundDocument._onCreate | `AmbientSoundDocument#_onCreate`} */
    interface OnCreateOptions extends Document.Database.CreateOptions<Create> {}

    /** Operation for {@linkcode AmbientSoundDocument._preCreateOperation} */
    interface PreCreateOperation
      extends Document.Database.PreCreateOperationStatic<AmbientSoundDocument.Database.Create> {}

    /** Operation for {@link AmbientSoundDocument._onCreateOperation | `AmbientSoundDocument#_onCreateOperation`} */
    interface OnCreateOperation extends AmbientSoundDocument.Database.Create {}

    /** Options for {@link AmbientSoundDocument._preUpdate | `AmbientSoundDocument#_preUpdate`} */
    interface PreUpdateOptions extends Document.Database.PreUpdateOptions<Update> {}

    /** Options for {@link AmbientSoundDocument._onUpdate | `AmbientSoundDocument#_onUpdate`} */
    interface OnUpdateOptions extends Document.Database.UpdateOptions<Update> {}

    /** Operation for {@linkcode AmbientSoundDocument._preUpdateOperation} */
    interface PreUpdateOperation extends AmbientSoundDocument.Database.Update {}

    /** Operation for {@link AmbientSoundDocument._onUpdateOperation | `AmbientSoundDocument._preUpdateOperation`} */
    interface OnUpdateOperation extends AmbientSoundDocument.Database.Update {}

    /** Options for {@link AmbientSoundDocument._preDelete | `AmbientSoundDocument#_preDelete`} */
    interface PreDeleteOptions extends Document.Database.PreDeleteOperationInstance<Delete> {}

    /** Options for {@link AmbientSoundDocument._onDelete | `AmbientSoundDocument#_onDelete`} */
    interface OnDeleteOptions extends Document.Database.DeleteOptions<Delete> {}

    /** Options for {@link AmbientSoundDocument._preDeleteOperation | `AmbientSoundDocument#_preDeleteOperation`} */
    interface PreDeleteOperation extends AmbientSoundDocument.Database.Delete {}

    /** Options for {@link AmbientSoundDocument._onDeleteOperation | `AmbientSoundDocument#_onDeleteOperation`} */
    interface OnDeleteOperation extends AmbientSoundDocument.Database.Delete {}

    /** Context for {@linkcode AmbientSoundDocument._onDeleteOperation} */
    interface OnDeleteDocumentsContext extends Document.ModificationContext<AmbientSoundDocument.Parent> {}

    /** Context for {@linkcode AmbientSoundDocument._onCreateDocuments} */
    interface OnCreateDocumentsContext extends Document.ModificationContext<AmbientSoundDocument.Parent> {}

    /** Context for {@linkcode AmbientSoundDocument._onUpdateDocuments} */
    interface OnUpdateDocumentsContext extends Document.ModificationContext<AmbientSoundDocument.Parent> {}

    /**
     * Options for {@link AmbientSoundDocument._preCreateDescendantDocuments | `AmbientSoundDocument#_preCreateDescendantDocuments`}
     * and {@link AmbientSoundDocument._onCreateDescendantDocuments | `AmbientSoundDocument#_onCreateDescendantDocuments`}
     */
    interface CreateOptions extends Document.Database.CreateOptions<AmbientSoundDocument.Database.Create> {}

    /**
     * Options for {@link AmbientSoundDocument._preUpdateDescendantDocuments | `AmbientSoundDocument#_preUpdateDescendantDocuments`}
     * and {@link AmbientSoundDocument._onUpdateDescendantDocuments | `AmbientSoundDocument#_onUpdateDescendantDocuments`}
     */
    interface UpdateOptions extends Document.Database.UpdateOptions<AmbientSoundDocument.Database.Update> {}

    /**
     * Options for {@link AmbientSoundDocument._preDeleteDescendantDocuments | `AmbientSoundDocument#_preDeleteDescendantDocuments`}
     * and {@link AmbientSoundDocument._onDeleteDescendantDocuments | `AmbientSoundDocument#_onDeleteDescendantDocuments`}
     */
    interface DeleteOptions extends Document.Database.DeleteOptions<AmbientSoundDocument.Database.Delete> {}

    /**
     * Create options for {@linkcode AmbientSoundDocument.createDialog}.
     */
    interface DialogCreateOptions extends InexactPartial<Create> {}
  }

  /**
   * If `Temporary` is true then `AmbientSoundDocument.Implementation`, otherwise `AmbientSoundDocument.Stored`.
   */
  type TemporaryIf<Temporary extends boolean | undefined> = true extends Temporary
    ? AmbientSoundDocument.Implementation
    : AmbientSoundDocument.Stored;

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

  interface Effect {
    type: keyof CONFIG["soundEffects"];

    /**
     * @defaultValue `5`
     * @remarks Can't be `null` as {@link BiquadFilterNode} and {@link ConvolverNode} constructors both only have parameter defaults
     */
    intensity?: number | undefined;
  }

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
 * The client-side AmbientSound document which extends the common BaseAmbientSound document model.
 *
 * @see {@linkcode Scene}                   The Scene document type which contains AmbientSound documents
 * @see {@linkcode AmbientSoundConfig}      The AmbientSound configuration application
 */
declare class AmbientSoundDocument extends BaseAmbientSound.Internal.CanvasDocument {
  /**
   * @param data    - Initial data from which to construct the `AmbientSoundDocument`
   * @param context - Construction context options
   */
  constructor(
    // Note(LukeAbby): Optional as there are currently no required properties on `CreateData`.
    data?: AmbientSoundDocument.CreateData,
    context?: AmbientSoundDocument.ConstructionContext,
  );

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

  /** @remarks `context` must contain a `pack` or `parent`. */
  static override defaultName(context: AmbientSoundDocument.DefaultNameContext): string;

  /** @remarks `createOptions` must contain a `pack` or `parent`. */
  static override createDialog(
    data: AmbientSoundDocument.CreateDialogData | undefined,
    createOptions: AmbientSoundDocument.Database.DialogCreateOptions,
    options?: AmbientSoundDocument.CreateDialogOptions,
  ): Promise<AmbientSoundDocument.Stored | null | undefined>;

  override deleteDialog(
    options?: InexactPartial<foundry.applications.api.DialogV2.ConfirmConfig>,
    operation?: Document.Database.DeleteOperationForName<"AmbientSound">,
  ): Promise<this | false | null | undefined>;

  static override fromDropData(
    data: AmbientSoundDocument.DropData,
    options?: AmbientSoundDocument.DropDataOptions,
  ): Promise<AmbientSoundDocument.Implementation | undefined>;

  static override fromImport(
    source: AmbientSoundDocument.Source,
    context?: Document.FromImportContext<AmbientSoundDocument.Parent> | null,
  ): Promise<AmbientSoundDocument.Implementation>;

  override _onClickDocumentLink(event: MouseEvent): ClientDocument.OnClickDocumentLinkReturn;
}

export default AmbientSoundDocument;
