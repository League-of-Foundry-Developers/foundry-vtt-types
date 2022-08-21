import {
  ConfiguredData,
  ConfiguredDocumentClass,
  ConfiguredFlags,
  ConfiguredSource,
  FieldReturnType,
  PropertiesToSource
} from "../../../../types/helperTypes";
import EmbeddedCollection from "../../abstract/embedded-collection.mjs";
import { DocumentData } from "../../abstract/module.mjs";
import * as documents from "../../documents.mjs";
import { PrototypeTokenData } from "../data.mjs";
import * as fields from "../fields.mjs";
import { PrototypeTokenDataConstructorData } from "./prototypeTokenData";

interface ActorDataSchema extends DocumentSchema {
  _id: fields.DocumentId;
  name: fields.RequiredString;
  type: DocumentField<string> & {
    type: typeof String;
    required: true;
    validate: (t: unknown) => boolean;
    validationError: "The provided Actor type must be in the array of types defined by the game system";
  };
  img: FieldReturnType<fields.ImageField, { default: () => string }>;
  data: fields.SystemDataField;
  token: DocumentField<PrototypeTokenData> & {
    type: typeof PrototypeTokenData;
    required: true;
    default: (data: unknown) => { name: string; img: string };
  };
  items: fields.EmbeddedCollectionField<typeof documents.BaseItem>;
  effects: fields.EmbeddedCollectionField<typeof documents.BaseActiveEffect>;
  folder: fields.ForeignDocumentField<{ type: typeof documents.BaseFolder }>;
  sort: fields.IntegerSortField;
  permission: fields.DocumentPermissions;
  flags: fields.ObjectField;
}

interface ActorDataBaseProperties {
  /**
   * The _id which uniquely identifies this Actor document
   * @defaultValue `null`
   */
  _id: string | null;

  /**
   * The name of this Actor
   */
  name: string;

  /**
   * An Actor subtype which configures the system data model applied
   */
  type: string;

  /**
   * An image file path which provides the artwork for this Actor
   * @defaultValue `ActorDataConstructor.DEFAULT_ICON`
   */
  img: string | null;

  /**
   * The system data object which is defined by the system template.json model
   * @defaultValue template from template.json for type or `{}`
   */
  data: object;

  /**
   * Default Token settings which are used for Tokens created from this Actor
   * @defaultValue `new PrototypeTokenData({ this.data.name, this.data.img })`
   */
  token: PrototypeTokenData;

  /**
   * A Collection of Item embedded Documents
   * @defaultValue `new EmbeddedCollection(ItemData, [], BaseItem.implementation)`
   */
  items: EmbeddedCollection<ConfiguredDocumentClass<typeof documents.BaseItem>, ActorData>;

  /**
   * A collection of ActiveEffect embedded Documents
   * @defaultValue `new EmbeddedCollection(ActiveEffectData, [], BaseActiveEffect.implementation)`
   */
  effects: EmbeddedCollection<ConfiguredDocumentClass<typeof documents.BaseActiveEffect>, ActorData>;

  /**
   * The _id of a Folder which contains this Actor
   * @defaultValue `null`
   */
  folder: string | null;

  /**
   * The numeric sort value which orders this Actor relative to its siblings
   * @defaultValue `0`
   */
  sort: number;

  /**
   * An object which configures user permissions to this Actor
   * @defaultValue `{ default: CONST.DOCUMENT_OWNERSHIP_LEVELS.NONE }`
   */
  permission: Partial<Record<string, foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS>>;

  /**
   * An object of optional key/value flags
   * @defaultValue `{}`
   */
  flags: ConfiguredFlags<"Actor">;
}

interface ActorDataConstructorData {
  /**
   * The _id which uniquely identifies this Actor document
   * @defaultValue `null`
   */
  _id?: string | null | undefined;

  /**
   * The name of this Actor
   */
  name: string;

  /**
   * An Actor subtype which configures the system data model applied
   */
  type: ActorDataSource["type"];

  /**
   * An image file path which provides the artwork for this Actor
   * @defaultValue `ActorDataConstructor.DEFAULT_ICON`
   */
  img?: string | null | undefined;

  /**
   * The system data object which is defined by the system template.json model
   * @defaultValue template from template.json for type or `{}`
   */
  data?: DeepPartial<ActorDataSource["data"]> | null | undefined;

  /**
   * Default Token settings which are used for Tokens created from this Actor
   * @defaultValue `new PrototypeTokenData({ this.data.name, this.data.img })`
   */
  token?: PrototypeTokenDataConstructorData | null | undefined;

  /**
   * A Collection of Item embedded Documents
   * @defaultValue `new EmbeddedCollection(ItemData, [], BaseItem.implementation)`
   */
  items?: ConstructorParameters<ConfiguredDocumentClass<typeof documents.BaseItem>>[0][] | null | undefined;

  /**
   * A collection of ActiveEffect embedded Documents
   * @defaultValue `new EmbeddedCollection(ActiveEffectData, [], BaseActiveEffect.implementation)`
   */
  effects?: ConstructorParameters<ConfiguredDocumentClass<typeof documents.BaseActiveEffect>>[0][] | null | undefined;

  /**
   * The _id of a Folder which contains this Actor
   * @defaultValue `null`
   */
  folder?: InstanceType<ConfiguredDocumentClass<typeof documents.BaseFolder>> | string | null | undefined;

  /**
   * The numeric sort value which orders this Actor relative to its siblings
   * @defaultValue `0`
   */
  sort?: number | null | undefined;

  /**
   * An object which configures user permissions to this Actor
   * @defaultValue `{ default: CONST.DOCUMENT_OWNERSHIP_LEVELS.NONE }`
   */
  permission?: Partial<Record<string, foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS>> | null | undefined;

  /**
   * An object of optional key/value flags
   * @defaultValue `{}`
   */
  flags?: ConfiguredFlags<"Actor"> | null | undefined;
}

type ActorDataBaseSource = PropertiesToSource<ActorDataBaseProperties>;
type ActorDataProperties = ActorDataBaseProperties & ConfiguredData<"Actor">;
type ActorDataSource = ActorDataBaseSource & ConfiguredSource<"Actor">;

type DocumentDataConstructor = Pick<typeof DocumentData, keyof typeof DocumentData>;

interface ActorDataConstructor extends DocumentDataConstructor {
  new (data: ActorDataConstructorData, document?: documents.BaseActor | null): ActorData;

  defineSchema(): ActorDataSchema;

  /**
   * The default icon used for newly created Actor documents
   * @defaultValue `CONST.DEFAULT_TOKEN`
   */
  DEFAULT_ICON: string;
}

/**
 * The data schema for an Actor document.
 * @see BaseActor
 */
export type ActorData = DocumentData<
  ActorDataSchema,
  ActorDataProperties,
  ActorDataSource,
  ActorDataConstructorData,
  documents.BaseActor
> &
  ActorDataProperties & {
    _initializeSource(data: ActorDataConstructorData): ActorDataSource;

    _initialize(): void;
  };

export const ActorData: ActorDataConstructor;
