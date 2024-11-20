import type { AnyObject, InexactPartial, Merge } from "../../../types/utils.d.mts";
import type Document from "../abstract/document.d.mts";
import type * as CONST from "../constants.mts";
import type * as fields from "../data/fields.d.mts";
import type * as documents from "./_module.mts";

/**
 * The Macro Document.
 * Defines the DataSchema and common behaviors for a Macro which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare class BaseMacro extends Document<BaseMacro.Schema, BaseMacro.Metadata, any> {
  /**
   * @privateRemarks Manual override of the return due to TS limitations with static `this`
   */
  static get TYPES(): BaseMacro.TypeNames[];

  /**
   * @param data    - Initial data from which to construct the Macro
   * @param context - Construction context options
   */
  // TODO(LukeAbby): This constructor is a symptom of a circular error.
  // constructor(data: BaseMacro.ConstructorData, context?: Document.ConstructionContext<BaseMacro.Parent>);

  override parent: BaseMacro.Parent;

  static override metadata: Readonly<BaseMacro.Metadata>;

  static override defineSchema(): BaseMacro.Schema;

  /**
   * The default icon used for newly created Macro documents.
   */
  static DEFAULT_ICON: "icons/svg/dice-target.svg";

  static override migrateData(source: AnyObject): AnyObject;

  static override validateJoint(data: Record<string, unknown>): void;

  static override canUserCreate(user: foundry.documents.BaseUser): boolean;

  override testUserPermission(
    user: documents.BaseUser,
    permission: keyof typeof CONST.DOCUMENT_OWNERSHIP_LEVELS | CONST.DOCUMENT_OWNERSHIP_LEVELS,
    options?: InexactPartial<{
      /**
       * Require the exact permission level requested?
       * @defaultValue `false`
       */
      exact: boolean;
    }>,
  ): boolean;

  /**
   * @privateRemarks _preCreate all overridden but with no signature changes.
   * For type simplicity it is left off. These methods historically have been the source of a large amount of computation from tsc.
   */
}
export default BaseMacro;

declare namespace BaseMacro {
  type Parent = null;

  type TypeNames = Game.Model.TypeNames<"Macro">;

  type Metadata = Merge<
    Document.Metadata.Default,
    {
      name: "Macro";
      collection: "macros";
      indexed: true;
      compendiumIndexFields: ["_id", "name", "img", "sort", "folder"];
      label: string;
      labelPlural: string;
      coreTypes: CONST.MACRO_TYPES[];
      permissions: {
        create: (user: documents.BaseUser, doc: Document.Any) => boolean;
        update: (user: documents.BaseUser, doc: Document.Any) => boolean;
      };
      schemaVersion: string;
    }
  >;

  type SchemaField = fields.SchemaField<Schema>;
  type ConstructorData = fields.SchemaField.InnerConstructorType<Schema>;
  type UpdateData = fields.SchemaField.InnerAssignmentType<Schema>;
  type Properties = fields.SchemaField.InnerInitializedType<Schema>;
  type Source = fields.SchemaField.InnerPersistedType<Schema>;

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
}
