import EmbeddedCollection from '../../abstract/embedded-collection.mjs';
import {
  ConfiguredData,
  ConfiguredDocumentClass,
  ConfiguredSource,
  FieldReturnType,
  PropertiesToSource
} from '../../../../types/helperTypes';
import { DocumentData } from '../../abstract/module.mjs';
import * as documents from '../../documents.mjs';
import * as fields from '../fields.mjs';
import { PrototypeTokenData } from '../data.mjs';

interface ActorDataSchema extends DocumentSchema {
  _id: typeof fields.DOCUMENT_ID;
  name: typeof fields.REQUIRED_STRING;
  type: DocumentField<string> & {
    type: typeof String;
    required: true;
    validate: (t: unknown) => boolean;
    validationError: 'The provided Actor type must be in the array of types defined by the game system';
  };
  img: FieldReturnType<typeof fields.IMAGE_FIELD, { default: () => string }>;
  data: FieldReturnType<typeof fields.OBJECT_FIELD, { default: (data: { type: string }) => any }>; // TODO
  token: {
    type: typeof PrototypeTokenData;
    required: true;
    default: (data: unknown) => { name: string; img: string };
  };
  items: fields.EmbeddedCollectionField<typeof documents.BaseItem>;
  effects: fields.EmbeddedCollectionField<typeof documents.BaseActiveEffect>;
  folder: fields.ForeignDocumentField<{ type: typeof documents.BaseFolder }>;
  sort: typeof fields.INTEGER_SORT_FIELD;
  permission: typeof fields.DOCUMENT_PERMISSIONS;
  flags: typeof fields.OBJECT_FIELD;
}

interface ActorDataBaseProperties {
  /**
   * The _id which uniquely identifies this Actor document
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
   */
  img: string | null;

  /**
   * The system data object which is defined by the system template.json model
   */
  data: object;

  /**
   * Default Token settings which are used for Tokens created from this Actor
   */
  token: PrototypeTokenData;

  /**
   * A Collection of Item embedded Documents
   */
  items: EmbeddedCollection<ConfiguredDocumentClass<typeof documents.BaseItem>, ActorData>;

  /**
   * A collection of ActiveEffect embedded Documents
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
   * @defaultValue `{ default: CONST.ENTITY_PERMISSIONS.NONE }`
   */
  permission: Partial<Record<string, ValueOf<typeof CONST.ENTITY_PERMISSIONS>>>;

  /**
   * An object of optional key/value flags
   * @defaultValue `{}`
   */
  flags: Record<string, unknown>;
}

type ActorDataBaseSource = PropertiesToSource<ActorDataBaseProperties>;
type ActorDataProperties = ActorDataBaseProperties & ConfiguredData<'Actor'>;
type ActorDataSource = ActorDataBaseSource & ConfiguredSource<'Actor'>;

type DocumentDataConstructor = typeof DocumentData;

interface ActorDataConstructor extends DocumentDataConstructor {
  new (data?: DeepPartial<ActorDataSource>, document?: documents.BaseActor | null): ActorData;

  defineSchema(): ActorDataSchema;

  /**
   * The default icon used for newly created Actor documents
   * @defaultValue `CONST.DEFAULT_TOKEN`
   */
  DEFAULT_ICON: string;
}

/**
 * The data schema for a Actor document.
 * @see BaseActor
 */
export type ActorData = DocumentData<ActorDataSchema, ActorDataProperties, ActorDataSource, documents.BaseActor> &
  ActorDataProperties & {
    _initializeSource(data: DeepPartial<ActorDataSource>): ActorDataSource;
  };
export declare const ActorData: ActorDataConstructor;
