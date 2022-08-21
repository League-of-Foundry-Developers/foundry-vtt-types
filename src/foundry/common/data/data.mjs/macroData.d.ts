import {
  ConfiguredDocumentClass,
  ConfiguredFlags,
  FieldReturnType,
  PropertiesToSource
} from "../../../../types/helperTypes";
import { DocumentData } from "../../abstract/module.mjs";
import * as documents from "../../documents.mjs";
import * as fields from "../fields.mjs";

interface MacroDataSchema extends DocumentSchema {
  _id: fields.DocumentId;
  name: fields.RequiredString;
  type: DocumentField<foundry.CONST.MACRO_TYPES> & {
    type: String;
    required: true;
    default: typeof foundry.CONST.MACRO_TYPES.CHAT;
    validate: (t: unknown) => t is foundry.CONST.MACRO_TYPES;
    validationError: "The provided Macro type must be in CONST.MACRO_TYPES";
  };
  author: fields.ForeignDocumentField<{
    type: typeof documents.BaseUser;
    default: () => Game["user"];
  }>;
  img: FieldReturnType<fields.ImageField, { required: true; default: typeof MacroData.DEFAULT_ICON }>;
  scope: DocumentField<foundry.CONST.MACRO_SCOPES> & {
    type: String;
    required: true;
    default: typeof foundry.CONST.MACRO_SCOPES[0];
    validate: (t: unknown) => t is foundry.CONST.MACRO_SCOPES;
    validationError: "The provided Macro scope must be in CONST.MACRO_SCOPES";
  };
  command: fields.BlankString;
  folder: fields.ForeignDocumentField<{ type: typeof documents.BaseFolder }>;
  sort: fields.IntegerSortField;
  permission: fields.DocumentPermissions;
  flags: fields.ObjectField;
}

interface MacroDataProperties {
  /**
   * The _id which uniquely identifies this Macro document
   * @defaultValue `null`
   */
  _id: string | null;

  /**
   * The name of this Macro
   */
  name: string;

  /**
   * A Macro subtype from CONST.MACRO_TYPES
   * @defaultValue `foundry.CONST.MACRO_TYPES.CHAT`
   */
  type: foundry.CONST.MACRO_TYPES;

  /**
   * The _id of a User document which created this Macro *
   * @defaultValue `game?.user`
   */
  author: string;

  /**
   * An image file path which provides the thumbnail artwork for this Macro
   * @defaultValue `CONST.DEFAULT_MACRO_ICON`
   */
  img: string | null;

  /**
   * The scope of this Macro application from CONST.MACRO_SCOPES
   * @defaultValue `CONST.MACRO_SCOPES[0]` ("global")
   */
  scope: foundry.CONST.MACRO_SCOPES;

  /**
   * The string content of the macro command
   * @defaultValue `""`
   */
  command: string;

  /**
   * The _id of a Folder which contains this Macro
   * @defaultValue `null`
   */
  folder: string | null;

  /**
   * The numeric sort value which orders this Macro relative to its siblings
   * @defaultValue `0`
   */
  sort: number;

  /**
   * An object which configures user permissions to this Macro
   * @defaultValue `{ default: CONST.DOCUMENT_OWNERSHIP_LEVELS.NONE }`
   */
  permission: Partial<Record<string, foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS>>;

  /**
   * An object of optional key/value flags
   * @defaultValue `{}`
   */
  flags: ConfiguredFlags<"Macro">;
}

interface MacroDataConstructorData {
  /**
   * The _id which uniquely identifies this Macro document
   * @defaultValue `null`
   */
  _id?: string | null | undefined;

  /**
   * The name of this Macro
   */
  name: string;

  /**
   * A Macro subtype from CONST.MACRO_TYPES
   * @defaultValue `foundry.CONST.MACRO_TYPES.CHAT`
   */
  type?: foundry.CONST.MACRO_TYPES | null | undefined;

  /**
   * The _id of a User document which created this Macro *
   * @defaultValue `game?.user`
   */
  author?: InstanceType<ConfiguredDocumentClass<typeof documents.BaseUser>> | string | null | undefined;

  /**
   * An image file path which provides the thumbnail artwork for this Macro
   * @defaultValue `CONST.DEFAULT_MACRO_ICON`
   */
  img?: string | null | undefined;

  /**
   * The scope of this Macro application from CONST.MACRO_SCOPES
   * @defaultValue `CONST.MACRO_SCOPES[0]` ("global")
   */
  scope?: foundry.CONST.MACRO_SCOPES | null | undefined;

  /**
   * The string content of the macro command
   * @defaultValue `""`
   */
  command?: string | null | undefined;

  /**
   * The _id of a Folder which contains this Macro
   * @defaultValue `null`
   */
  folder?: InstanceType<ConfiguredDocumentClass<typeof documents.BaseFolder>> | string | null | undefined;

  /**
   * The numeric sort value which orders this Macro relative to its siblings
   * @defaultValue `0`
   */
  sort?: number | null | undefined;

  /**
   * An object which configures user permissions to this Macro
   * @defaultValue `{ default: CONST.DOCUMENT_OWNERSHIP_LEVELS.NONE }`
   */
  permission?: Partial<Record<string, foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS>> | null | undefined;

  /**
   * An object of optional key/value flags
   * @defaultValue `{}`
   */
  flags?: ConfiguredFlags<"Macro"> | null | undefined;
}

type MacroDataSource = PropertiesToSource<MacroDataProperties>;

/**
 * The data schema for a Macro document.
 * @see BaseMacro
 */
export class MacroData extends DocumentData<
  MacroDataSchema,
  MacroDataProperties,
  MacroDataSource,
  MacroDataConstructorData,
  documents.BaseMacro
> {
  constructor(data: MacroDataConstructorData, document?: documents.BaseMacro | null);

  static override defineSchema(): MacroDataSchema;

  /**
   * The default icon used for newly created Macro documents.
   * @defaultValue `"icons/svg/dice-target.svg"`
   */
  static DEFAULT_ICON: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MacroData extends MacroDataProperties {}
