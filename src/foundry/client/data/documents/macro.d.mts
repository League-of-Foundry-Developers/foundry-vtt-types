import type { ConfiguredMacro } from "../../../../configuration/index.d.mts";
import type { InexactPartial } from "fvtt-types/utils";
import type { documents } from "../../../client-esm/client.d.mts";
import type Document from "../../../common/abstract/document.d.mts";
import type { DataSchema } from "../../../common/data/fields.d.mts";
import type { fields } from "../../../common/data/module.d.mts";
import type BaseMacro from "../../../common/documents/macro.d.mts";

declare global {
  namespace Macro {
    /**
     * The implementation of the Macro document instance configured through `CONFIG.Macro.documentClass` in Foundry and
     * {@link DocumentClassConfig | `DocumentClassConfig`} or {@link ConfiguredMacro | `configuration/ConfiguredMacro`} in fvtt-types.
     */
    type Implementation = Document.ConfiguredInstanceForName<"Macro">;

    /**
     * The implementation of the Macro document configured through `CONFIG.Macro.documentClass` in Foundry and
     * {@link DocumentClassConfig | `DocumentClassConfig`} in fvtt-types.
     */
    type ImplementationClass = Document.ConfiguredClassForName<"Macro">;

    /**
     * A document's metadata is special information about the document ranging anywhere from its name,
     * whether it's indexed, or to the permissions a user has over it.
     */
    interface Metadata extends Document.MetadataFor<"Macro"> {}

    type SubType = Game.Model.TypeNames<"Macro">;
    type ConfiguredSubTypes = Document.ConfiguredSubTypesOf<"Macro">;
    type Known = Macro.OfType<Macro.ConfiguredSubTypes>;
    type OfType<Type extends SubType> = Document.Internal.OfType<ConfiguredMacro<Type>, Macro<SubType>>;

    /**
     * A document's parent is something that can contain it.
     * For example an `Item` can be contained by an `Actor` which makes `Actor` one of its possible parents.
     */
    type Parent = null;

    /**
     * An instance of `Macro` that comes from the database.
     */
    interface Stored<out Subtype extends SubType = SubType> extends Document.Stored<OfType<Subtype>> {}

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
     * The data put in {@link Macro._source | `Macro._source`}. This data is what was
     * persisted to the database and therefore it must be valid JSON.
     *
     * Both `Source` and `PersistedData` are equivalent.
     */
    interface PersistedData extends fields.SchemaField.PersistedData<Schema> {}

    /**
     * The data necessary to create a document. Used in places like {@link Macro.create | `Macro.create`}
     * and {@link Macro | `new Macro(...)`}.
     *
     * For example a {@link fields.SetField | `SetField`} can accept any {@link Iterable | `Iterable`}
     * with the right values. This means you can pass a `Set` instance, an array of values,
     * a generator, or any other iterable.
     */
    interface CreateData extends fields.SchemaField.CreateData<Schema> {}

    /**
     * The data after a {@link Document | `Document`} has been initialized, for example
     * {@link Macro.name | `Macro#name`}.
     *
     * This is data transformed from {@link Macro.Source | `Macro.Source`} and turned into more
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
     * The schema for {@link Macro | `Macro`}. This is the source of truth for how an Macro document
     * must be structured.
     *
     * Foundry uses this schema to validate the structure of the {@link Macro | `Macro`}. For example
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
      name: fields.StringField<{
        required: true;
        blank: false;
        label: "Name";
        textSearch: true;
      }>;

      /**
       * A Macro subtype from CONST.MACRO_TYPES
       * @defaultValue `CONST.MACRO_TYPES.CHAT`
       */
      type: fields.DocumentTypeField<
        typeof BaseMacro,
        {
          initial: typeof CONST.MACRO_TYPES.CHAT;
          label: "Type";
        }
      >;

      /**
       * The _id of a User document which created this Macro *
       * @defaultValue `game?.user?.id`
       */
      author: fields.ForeignDocumentField<typeof documents.BaseUser, { initial: () => string }>;

      /**
       * An image file path which provides the thumbnail artwork for this Macro
       * @defaultValue `BaseMacro.DEFAULT_ICON`
       */
      img: fields.FilePathField<{
        categories: ["IMAGE"];
        initial: () => typeof BaseMacro.DEFAULT_ICON;
        label: "Image";
      }>;

      /**
       * The scope of this Macro application from CONST.MACRO_SCOPES
       * @defaultValue `"global"`
       */
      scope: fields.StringField<{
        required: true;
        choices: CONST.MACRO_SCOPES[];
        initial: (typeof CONST.MACRO_SCOPES)[0];
        validationError: "must be a value in CONST.MACRO_SCOPES";
        label: "Scope";
      }>;

      /**
       * The string content of the macro command
       * @defaultValue `""`
       */
      command: fields.StringField<{
        required: true;
        blank: true;
        label: "Command";
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
       * @defaultValue see {@link fields.DocumentOwnershipField}
       */
      ownership: fields.DocumentOwnershipField;

      /**
       * An object of optional key/value flags
       * @defaultValue `{}`
       */
      flags: fields.ObjectField.FlagsField<"Macro">;

      /**
       * An object of creation and access information
       * @defaultValue see {@link fields.DocumentStatsField}
       */
      _stats: fields.DocumentStatsField;
    }

    namespace DatabaseOperation {
      /** Options passed along in Get operations for Macros */
      interface Get extends foundry.abstract.types.DatabaseGetOperation<Macro.Parent> {}
      /** Options passed along in Create operations for Macros */
      interface Create<Temporary extends boolean | undefined = boolean | undefined>
        extends foundry.abstract.types.DatabaseCreateOperation<Macro.CreateData, Macro.Parent, Temporary> {}
      /** Options passed along in Delete operations for Macros */
      interface Delete extends foundry.abstract.types.DatabaseDeleteOperation<Macro.Parent> {}
      /** Options passed along in Update operations for Macros */
      interface Update extends foundry.abstract.types.DatabaseUpdateOperation<Macro.UpdateData, Macro.Parent> {}

      /** Options for {@link Macro.createDocuments | `Macro.createDocuments`} */
      type CreateOperation<Temporary extends boolean | undefined = boolean | undefined> =
        Document.Database.CreateOperation<Create<Temporary>>;
      /** Options for {@link Macro._preCreateOperation | `Macro._preCreateOperation`} */
      type PreCreateOperationStatic = Document.Database.PreCreateOperationStatic<Create>;
      /** Options for {@link Macro#_preCreate | `Macro#_preCreate`} */
      type PreCreateOperationInstance = Document.Database.PreCreateOperationInstance<Create>;
      /** Options for {@link Macro#_onCreate | `Macro#_onCreate`} */
      type OnCreateOperation = Document.Database.OnCreateOperation<Create>;

      /** Options for {@link Macro.updateDocuments | `Macro.updateDocuments`} */
      type UpdateOperation = Document.Database.UpdateOperation<Update>;
      /** Options for {@link Macro._preUpdateOperation | `Macro._preUpdateOperation`} */
      type PreUpdateOperationStatic = Document.Database.PreUpdateOperationStatic<Update>;
      /** Options for {@link Macro#_preUpdate | `Macro#_preUpdate`} */
      type PreUpdateOperationInstance = Document.Database.PreUpdateOperationInstance<Update>;
      /** Options for {@link Macro#_onUpdate | `Macro#_onUpdate`} */
      type OnUpdateOperation = Document.Database.OnUpdateOperation<Update>;

      /** Options for {@link Macro.deleteDocuments | `Macro.deleteDocuments`} */
      type DeleteOperation = Document.Database.DeleteOperation<Delete>;
      /** Options for {@link Macro._preDeleteOperation | `Macro._preDeleteOperation`} */
      type PreDeleteOperationStatic = Document.Database.PreDeleteOperationStatic<Delete>;
      /** Options for {@link Macro#_preDelete | `Macro#_preDelete`} */
      type PreDeleteOperationInstance = Document.Database.PreDeleteOperationInstance<Delete>;
      /** Options for {@link Macro#_onDelete | `Macro#_onDelete`} */
      type OnDeleteOperation = Document.Database.OnDeleteOperation<Delete>;
    }

    interface Scope {
      /** An Actor who is the protagonist of the executed action. */
      actor: Actor;

      /**  A Token which is the protagonist of the executed action. */
      token: Token;

      /** An optional event passed to the executed macro. */
      event: Event | RegionDocument.RegionEvent;

      /**
       * @remarks Additional arguments passed as part of the scope
       */
      [arg: string]: unknown;
    }

    /**
     * @deprecated - {@link Macro.DatabaseOperation}
     */
    interface DatabaseOperations extends Document.Database.Operations<Macro> {}

    /**
     * @deprecated {@link Macro.Types | `Macro.SubType`}
     */
    type TypeNames = Macro.SubType;

    /**
     * @deprecated {@link Macro.CreateData | `Macro.CreateData`}
     */
    interface ConstructorData extends Macro.CreateData {}

    /**
     * @deprecated {@link Macro.implementation | `Macro.ImplementationClass`}
     */
    type ConfiguredClass = ImplementationClass;

    /**
     * @deprecated {@link Macro.Implementation | `Macro.Implementation`}
     */
    type ConfiguredInstance = Implementation;
  }

  /**
   * The client-side Macro document which extends the common BaseMacro model.
   *
   * @see {@link Macros}            The world-level collection of Macro documents
   * @see {@link MacroConfig}       The Macro configuration application
   *
   * @param data - Initial data provided to construct the Macro document
   */
  class Macro<out SubType extends Macro.SubType = Macro.SubType> extends ClientDocumentMixin(
    foundry.documents.BaseMacro,
  )<SubType> {
    /**
     * @param data    - Initial data from which to construct the `Macro`
     * @param context - Construction context options
     *
     * @deprecated Constructing `Macro` directly is not advised. While `new Macro(...)` would create a
     * temporary document it would not respect a system's subclass of `Macro`, if any.
     *
     * You should use {@link Macro.implementation | `new Macro.implementation(...)`} instead which
     * will give you a system specific implementation of `Macro`.
     */
    constructor(...args: Document.ConstructorParameters<Macro.CreateData, Macro.Parent>);

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
     * @returns A promising containing a created {@link ChatMessage} (or `undefined`) if a chat
     *          macro or the return value if a script macro. A void return is possible if the user
     *          is not permitted to execute macros or a script macro execution fails.
     */
    execute(scope?: InexactPartial<Macro.Scope>): Promise<ChatMessage | void> | Promise<unknown> | void;

    #executeScript();

    _onClickDocumentLink(event: MouseEvent): ReturnType<this["execute"]>;

    /*
     * After this point these are not really overridden methods.
     * They are here because they're static properties but depend on the instance and so can't be
     * defined DRY-ly while also being easily overridable.
     */

    static override defaultName(context?: Document.DefaultNameContext<Macro.SubType, Macro.Parent>): string;

    static override createDialog(
      data?: Macro.CreateData,
      context?: Document.CreateDialogContext<Macro.SubType, Macro.Parent>,
    ): Promise<Macro.Stored | null | undefined>;

    static override fromDropData(
      data: Document.DropData<Macro.Implementation>,
      options?: Document.FromDropDataOptions,
    ): Promise<Macro.Implementation | undefined>;

    static override fromImport(
      source: Macro.Source,
      context?: Document.FromImportContext<Macro.Parent>,
    ): Promise<Macro.Implementation>;
  }
}
