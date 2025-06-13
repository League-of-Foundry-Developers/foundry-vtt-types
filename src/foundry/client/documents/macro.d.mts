import type { ConfiguredMacro } from "fvtt-types/configuration";
import type { Merge, NullishProps } from "#utils";
import type { documents } from "#client/client.d.mts";
import type Document from "#common/abstract/document.d.mts";
import type { DataSchema } from "#common/data/fields.d.mts";
import type BaseMacro from "#common/documents/macro.d.mts";
import type { Token } from "#client/canvas/placeables/_module.d.mts";

import fields = foundry.data.fields;

declare namespace Macro {
  /**
   * The document's name.
   */
  type Name = "Macro";

  /**
   * The arguments to construct the document.
   */
  type ConstructorArgs = Document.ConstructorParameters<CreateData, Parent>;

  /**
   * The documents embedded within `Macro`.
   */
  type Hierarchy = Readonly<Document.HierarchyOf<Schema>>;

  /**
   * The implementation of the `Macro` document instance configured through `CONFIG.Macro.documentClass` in Foundry and
   * {@linkcode DocumentClassConfig} or {@link ConfiguredMacro | `fvtt-types/configuration/ConfiguredMacro`} in fvtt-types.
   */
  type Implementation = Document.ImplementationFor<Name>;

  /**
   * The implementation of the `Macro` document configured through `CONFIG.Macro.documentClass` in Foundry and
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
        name: "Macro";
        collection: "macros";
        indexed: true;
        compendiumIndexFields: ["_id", "name", "img", "sort", "folder"];
        label: string;
        labelPlural: string;
        coreTypes: ["script", "chat"]; // This isn't `CONST.MACRO_TYPES[]` due to the semantics of `Merge`.
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
      update(user: User.Internal.Implementation, doc: Implementation): boolean;
      delete: "OWNER";
    }
  }

  /**
   * The subtypes of `Macro` that Foundry provides. `Macro` does not have `system` and therefore
   * there is no way for a user to configure custom subtypes. Nevertheless Foundry has a number of
   * built in subtypes usable for `Macro`.
   *
   * `Macro` has two subtypes `"chat"` and `"script"`. A `Macro` with type `"chat"` will create a
   * `ChatMessage` whereas a `"script"` allows executing arbitrary JavaScript code
   */
  type SubType = foundry.Game.Model.TypeNames<Name>;

  /**
   * @deprecated `Macro` does not have `system` and therefore there is no way for a user to
   * configure custom subtypes.
   *
   * This type exists only to be informative.
   */
  type ConfiguredSubTypes = never;

  /**
   * @deprecated `Macro` does not have `system` and therefore there is no way for a user to
   * configure custom subtypes. This means `Known` as a concept does not apply to it.
   *
   * This type exists only to be informative.
   */
  type Known = never;

  /**
   * `OfType` returns an instance of `Macro` with the corresponding type. This works with both the
   * builtin `Macro` class or a custom subclass if that is set up in
   * {@link ConfiguredMacro | `fvtt-types/configuration/ConfiguredMacro`}.
   *
   * Note that `Macro` does not have a `system` property and therefore there is no way for a user
   * to configure custom subtypes. See {@linkcode Macro.SubType} for more information.
   */
  // eslint-disable-next-line @typescript-eslint/no-restricted-types
  type OfType<Type extends SubType> = Document.Internal.OfType<ConfiguredMacro<Type>, () => Macro<Type>>;

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
   * The world collection that contains `Macro`s. Will be `never` if none exists.
   */
  type CollectionClass = foundry.documents.collections.Macros.ConfiguredClass;

  /**
   * The world collection that contains `Folder`s. Will be `never` if none exists.
   */
  type Collection = foundry.documents.collections.Macros.Configured;

  /**
   * An instance of `Macro` that comes from the database but failed validation meaning that
   * its `system` and `_source` could theoretically be anything.
   */
  interface Invalid<out SubType extends Macro.SubType = Macro.SubType>
    extends Document.Internal.Invalid<OfType<SubType>> {}

  /**
   * An instance of `Macro` that comes from the database.
   */
  interface Stored<out SubType extends Macro.SubType = Macro.SubType>
    extends Document.Internal.Stored<OfType<SubType>> {}

  /**
   * The data put in {@link Macro._source | `Macro#_source`}. This data is what was
   * persisted to the database and therefore it must be valid JSON.
   *
   * For example a {@link fields.SetField | `SetField`} is persisted to the database as an array
   * but initialized as a {@linkcode Set}.
   */
  interface Source extends fields.SchemaField.SourceData<Schema> {}

  /**
   * The data necessary to create a document. Used in places like {@linkcode Macro.create}
   * and {@link Macro | `new Macro(...)`}.
   *
   * For example a {@link fields.SetField | `SetField`} can accept any {@linkcode Iterable}
   * with the right values. This means you can pass a `Set` instance, an array of values,
   * a generator, or any other iterable.
   */
  interface CreateData extends fields.SchemaField.CreateData<Schema> {}

  /**
   * The data after a {@link foundry.abstract.Document | `Document`} has been initialized, for example
   * {@link Macro.name | `Macro#name`}.
   *
   * This is data transformed from {@linkcode Macro.Source} and turned into more
   * convenient runtime data structures. For example a {@link fields.SetField | `SetField`} is
   * persisted to the database as an array of values but at runtime it is a `Set` instance.
   */
  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

  /**
   * The data used to update a document, for example {@link Macro.update | `Macro#update`}.
   * It is a distinct type from {@link Macro.CreateData | `DeepPartial<Macro.CreateData>`} because
   * it has different rules for `null` and `undefined`.
   */
  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  /**
   * The schema for {@linkcode Macro}. This is the source of truth for how an Macro document
   * must be structured.
   *
   * Foundry uses this schema to validate the structure of the {@linkcode Macro}. For example
   * a {@link fields.StringField | `StringField`} will enforce that the value is a string. More
   * complex fields like {@link fields.SetField | `SetField`} goes through various conversions
   * starting as an array in the database, initialized as a set, and allows updates with any
   * iterable.
   */
  interface Schema extends DataSchema {
    /**
     * The _id which uniquely identifies this Macro document
     * @defaultValue `null`
     */
    _id: fields.DocumentIdField;

    /**
     * The name of this Macro
     * @defaultValue `""`
     */
    name: fields.StringField<{ required: true; blank: false; textSearch: true }>;

    /**
     * A Macro subtype from CONST.MACRO_TYPES
     * @defaultValue `CONST.MACRO_TYPES.CHAT`
     */
    type: fields.DocumentTypeField<typeof BaseMacro, { initial: typeof CONST.MACRO_TYPES.CHAT }>;

    /**
     * The _id of a User document which created this Macro *
     * @defaultValue `game?.user?.id`
     */
    // TODO: retype this to `DocumentAuthorField`
    author: fields.ForeignDocumentField<typeof documents.BaseUser, { initial: () => string }>;

    /**
     * An image file path which provides the thumbnail artwork for this Macro
     * @defaultValue `BaseMacro.DEFAULT_ICON`
     */
    img: fields.FilePathField<{
      categories: ["IMAGE"];
      initial: () => typeof BaseMacro.DEFAULT_ICON;
    }>;

    /**
     * The scope of this Macro application from CONST.MACRO_SCOPES
     * @defaultValue `"global"`
     * @privateRemarks This field (and `CONST.MACRO_SCOPES`) is entirely vestigial, it's never checked anywhere,
     * and its `<select>` in MacroConfig has been unconditionally disabled since at least 11.315
     */
    scope: fields.StringField<{
      required: true;
      choices: CONST.MACRO_SCOPES[];
      initial: (typeof CONST.MACRO_SCOPES)[0];
      validationError: "must be a value in CONST.MACRO_SCOPES";
    }>;

    /**
     * The string content of the macro command
     * @defaultValue `""`
     */
    command: fields.StringField<{
      required: true;
      blank: true;
    }>;

    /**
     * The _id of a Folder which contains this Macro
     * @defaultValue `null`
     */
    folder: fields.ForeignDocumentField<typeof documents.BaseFolder>;

    /**
     * The numeric sort value which orders this Macro relative to its siblings
     * @defaultValue `0`
     */
    sort: fields.IntegerSortField;

    /**
     * An object which configures ownership of this Macro
     * @defaultValue see {@linkcode fields.DocumentOwnershipField}
     */
    ownership: fields.DocumentOwnershipField;

    /**
     * An object of optional key/value flags
     * @defaultValue `{}`
     */
    // TODO: retype this to `DocumentFlagsField`
    flags: fields.ObjectField.FlagsField<Name>;

    /**
     * An object of creation and access information
     * @defaultValue see {@linkcode fields.DocumentStatsField}
     */
    _stats: fields.DocumentStatsField;
  }

  namespace Database {
    /** Options passed along in Get operations for Macros */
    interface Get extends foundry.abstract.types.DatabaseGetOperation<Macro.Parent> {}

    /** Options passed along in Create operations for Macros */
    interface Create<Temporary extends boolean | undefined = boolean | undefined>
      extends foundry.abstract.types.DatabaseCreateOperation<Macro.CreateData, Macro.Parent, Temporary> {}

    /** Options passed along in Delete operations for Macros */
    interface Delete extends foundry.abstract.types.DatabaseDeleteOperation<Macro.Parent> {}

    /** Options passed along in Update operations for Macros */
    interface Update extends foundry.abstract.types.DatabaseUpdateOperation<Macro.UpdateData, Macro.Parent> {}

    /** Operation for {@linkcode Macro.createDocuments} */
    interface CreateDocumentsOperation<Temporary extends boolean | undefined>
      extends Document.Database.CreateOperation<Macro.Database.Create<Temporary>> {}

    /** Operation for {@linkcode Macro.updateDocuments} */
    interface UpdateDocumentsOperation extends Document.Database.UpdateDocumentsOperation<Macro.Database.Update> {}

    /** Operation for {@linkcode Macro.deleteDocuments} */
    interface DeleteDocumentsOperation extends Document.Database.DeleteDocumentsOperation<Macro.Database.Delete> {}

    /** Operation for {@linkcode Macro.create} */
    interface CreateOperation<Temporary extends boolean | undefined>
      extends Document.Database.CreateOperation<Macro.Database.Create<Temporary>> {}

    /** Operation for {@link Macro.update | `Macro#update`} */
    interface UpdateOperation extends Document.Database.UpdateOperation<Update> {}

    interface DeleteOperation extends Document.Database.DeleteOperation<Delete> {}

    /** Options for {@linkcode Macro.get} */
    interface GetOptions extends Document.Database.GetOptions {}

    /** Options for {@link Macro._preCreate | `Macro#_preCreate`} */
    interface PreCreateOptions extends Document.Database.PreCreateOptions<Create> {}

    /** Options for {@link Macro._onCreate | `Macro#_onCreate`} */
    interface OnCreateOptions extends Document.Database.CreateOptions<Create> {}

    /** Operation for {@linkcode Macro._preCreateOperation} */
    interface PreCreateOperation extends Document.Database.PreCreateOperationStatic<Macro.Database.Create> {}

    /** Operation for {@link Macro._onCreateOperation | `Macro#_onCreateOperation`} */
    interface OnCreateOperation extends Macro.Database.Create {}

    /** Options for {@link Macro._preUpdate | `Macro#_preUpdate`} */
    interface PreUpdateOptions extends Document.Database.PreUpdateOptions<Update> {}

    /** Options for {@link Macro._onUpdate | `Macro#_onUpdate`} */
    interface OnUpdateOptions extends Document.Database.UpdateOptions<Update> {}

    /** Operation for {@linkcode Macro._preUpdateOperation} */
    interface PreUpdateOperation extends Macro.Database.Update {}

    /** Operation for {@link Macro._onUpdateOperation | `Macro._preUpdateOperation`} */
    interface OnUpdateOperation extends Macro.Database.Update {}

    /** Options for {@link Macro._preDelete | `Macro#_preDelete`} */
    interface PreDeleteOptions extends Document.Database.PreDeleteOperationInstance<Delete> {}

    /** Options for {@link Macro._onDelete | `Macro#_onDelete`} */
    interface OnDeleteOptions extends Document.Database.DeleteOptions<Delete> {}

    /** Options for {@link Macro._preDeleteOperation | `Macro#_preDeleteOperation`} */
    interface PreDeleteOperation extends Macro.Database.Delete {}

    /** Options for {@link Macro._onDeleteOperation | `Macro#_onDeleteOperation`} */
    interface OnDeleteOperation extends Macro.Database.Delete {}

    /** Context for {@linkcode Macro._onDeleteOperation} */
    interface OnDeleteDocumentsContext extends Document.ModificationContext<Macro.Parent> {}

    /** Context for {@linkcode Macro._onCreateDocuments} */
    interface OnCreateDocumentsContext extends Document.ModificationContext<Macro.Parent> {}

    /** Context for {@linkcode Macro._onUpdateDocuments} */
    interface OnUpdateDocumentsContext extends Document.ModificationContext<Macro.Parent> {}

    /**
     * Options for {@link Macro._preCreateDescendantDocuments | `Macro#_preCreateDescendantDocuments`}
     * and {@link Macro._onCreateDescendantDocuments | `Macro#_onCreateDescendantDocuments`}
     */
    interface CreateOptions extends Document.Database.CreateOptions<Macro.Database.Create> {}

    /**
     * Options for {@link Macro._preUpdateDescendantDocuments | `Macro#_preUpdateDescendantDocuments`}
     * and {@link Macro._onUpdateDescendantDocuments | `Macro#_onUpdateDescendantDocuments`}
     */
    interface UpdateOptions extends Document.Database.UpdateOptions<Macro.Database.Update> {}

    /**
     * Options for {@link Macro._preDeleteDescendantDocuments | `Macro#_preDeleteDescendantDocuments`}
     * and {@link Macro._onDeleteDescendantDocuments | `Macro#_onDeleteDescendantDocuments`}
     */
    interface DeleteOptions extends Document.Database.DeleteOptions<Macro.Database.Delete> {}
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

  interface DropData extends Document.Internal.DropData<Name> {}
  interface DropDataOptions extends Document.DropDataOptions {}

  /** @internal */
  type _ScriptScope = NullishProps<{
    /** An Actor who is the protagonist of the executed action. */
    actor: Actor.Implementation;

    /** A Token which is the protagonist of the executed action. */
    token: Token.Implementation;

    /** The speaker data */
    speaker: ChatMessage.SpeakerData;

    /**
     * @remarks Sometimes provided by core:
     * - When called in {@link foundry.data.regionBehaviors.ExecuteMacroRegionBehaviorType._handleRegionEvent | `ExecuteMacroRegionBehaviorType#_handleRegionEvent`},
     * will be a {@linkcode Scene.Implementation} (possibly `null` if somehow called on a `RegionBehavior` whose `RegionDocument` doesn't have a parent `Scene`)
     */
    scene?: unknown;

    /**
     * @remarks Sometimes provided by core:
     * - When called in {@link foundry.data.regionBehaviors.ExecuteMacroRegionBehaviorType._handleRegionEvent | `ExecuteMacroRegionBehaviorType#_handleRegionEvent`},
     * will be a {@linkcode RegionDocument.Implementation} (possibly `null` if somehow called on a `RegionBehavior` without a parent `RegionDocument`)
     */
    region?: unknown;

    /**
     * @remarks Sometimes provided by core:
     * - When called in {@link foundry.data.regionBehaviors.ExecuteMacroRegionBehaviorType._handleRegionEvent | `ExecuteMacroRegionBehaviorType#_handleRegionEvent`},
     * will be a {@linkcode RegionBehavior.Implementation} (possibly `null` if somehow called on a `RegionBehaviorType` without a parent `RegionBehavior`)
     */
    behavior?: unknown;

    /**
     * @remarks Sometimes provided by core:
     * - When called in {@link Macro._onClickDocumentLink | `Macro#_onClickDocumentLink`},
     * will be a {@linkcode MouseEvent}
     * - When called in {@link foundry.data.regionBehaviors.ExecuteMacroRegionBehaviorType._handleRegionEvent | `ExecuteMacroRegionBehaviorType#_handleRegionEvent`},
     * will be a {@linkcode RegionDocument.RegionEvent}
     */
    event?: unknown;

    /**
     * @remarks Additional arguments passed as part of the scope. Numeric keys are disallowed (`##executeScript` throws).
     */
    [arg: string | symbol]: unknown;
  }>;

  interface ScriptScope extends _ScriptScope {}

  interface ChatScope extends Pick<ScriptScope, "speaker"> {}

  interface UnknownScope extends ScriptScope, ChatScope {}

  type ExecuteScope<SubType extends Macro.SubType> = SubType extends "chat" | "script"
    ? UnknownScope
    : (SubType extends "script" ? ScriptScope : never) | (SubType extends "chat" ? ScriptScope : never);

  // Note: If extra types ever get added this will need to be updated to account for them, even if
  // just to return `undefined`.
  type ExecuteReturn<SubType extends Macro.SubType> =
    | (SubType extends "chat" ? Promise<ChatMessage.Implementation | undefined | void> : never)
    | (SubType extends "script" ? Promise<unknown> | void : never);
}

/**
 * The client-side Macro document which extends the common BaseMacro model.
 *
 * @see {@linkcode Macros}            The world-level collection of Macro documents
 * @see {@linkcode MacroConfig}       The Macro configuration application
 *
 * @param data - Initial data provided to construct the Macro document
 */
declare class Macro<out SubType extends Macro.SubType = Macro.SubType> extends BaseMacro.Internal
  .ClientDocument<SubType> {
  /**
   * @param data    - Initial data from which to construct the `Macro`
   * @param context - Construction context options
   */
  constructor(...args: Macro.ConstructorArgs);

  /**
   * Is the current User the author of this macro?
   */
  get isAuthor(): boolean;

  /**
   * Test whether the current user is capable of executing a Macro script
   */
  get canExecute(): boolean;

  /**
   * Provide a thumbnail image path used to represent this document.
   */
  get thumbnail(): string | null;

  /**
   * Test whether the given User is capable of executing this Macro.
   * @param user - The User to test.
   * @returns Can this User execute this Macro?
   */
  canUserExecute(user: User.Implementation): boolean;

  /**
   * Execute the Macro command.
   * @param scope - Macro execution scope which is passed to script macros
   * @returns A promising containing a created {@linkcode ChatMessage} (or `undefined`) if a chat
   *          macro or the return value if a script macro. A void return is possible if the user
   *          is not permitted to execute macros or a script macro execution fails.
   * @remarks Forwards to either `#executeChat` or `#executeScript`
   */
  // scope: not null (parameter default only, destructured where forwarded)
  execute(scope?: Macro.ExecuteScope<SubType>): Macro.ExecuteReturn<SubType>;

  /** @remarks Returns `this.execute({event})` */
  override _onClickDocumentLink(event: MouseEvent): Macro.ExecuteReturn<SubType>;

  // _onCreate is overridden but with no signature changes from its definition in BaseMacro.

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

  // Descendant Document operations have been left out because Macro does not have any descendant documents.

  // context: not null (destructured)
  static override defaultName(context?: Document.DefaultNameContext<"Macro", Macro.Parent>): string;

  // data: not null (parameter default only), context: not null (destructured)
  static override createDialog(
    data?: Macro.CreateData,
    createOptions?: Document.Database.CreateOperationForName<"Macro">,
    options?: Document.CreateDialogOptions<"Macro">,
  ): Promise<Macro.Stored | null | undefined>;

  // options: not null (parameter default only)
  static override fromDropData(
    data: Macro.DropData,
    options?: Macro.DropDataOptions,
  ): Promise<Macro.Implementation | undefined>;

  static override fromImport(
    source: Macro.Source,
    context?: Document.FromImportContext<Macro.Parent> | null,
  ): Promise<Macro.Implementation>;

  #Macro: true;
}

export default Macro;
