import Document, { DocumentMetadata } from '../abstract/document.mjs';
import * as fields from '../data/fields.mjs';
import * as CONST from '../constants.mjs';
import * as documents from './module.mjs';
import { DataModel, DataSchema } from '../abstract/data.mjs';
import { FlagsField } from '../data/flagsField';

interface BaseChatMessageSchema extends DataSchema {
  /**
   * The _id which uniquely identifies this ChatMessage document
   */
  _id: fields.DocumentIdField<{}>;

  /**
   * The message type from CONST.CHAT_MESSAGE_TYPES
   * (default: `0`)
   */
  type: fields.NumberField<{
    required: true;
    choices: Array<ValueOf<typeof CONST.CHAT_MESSAGE_TYPES>>;
    initial: typeof CONST.CHAT_MESSAGE_TYPES.OTHER;
    validationError: 'must be a value in CONST.CHAT_MESSAGE_TYPES';
  }>;

  /**
   * The _id of the User document who generated this message
   */
  user: fields.ForeignDocumentField<
    typeof documents.BaseUser,
    {
      initial: () => string; // OptionalChaining<OptionalChaining<typeof game, 'user'>, 'id'>;
    }
  >;

  /**
   * The timestamp at which point this message was generated
   */
  timestamp: fields.NumberField<{ required: true; nullable: false; initial: typeof Date.now }>;

  /**
   * An optional flavor text message which summarizes this message
   */
  flavor: fields.HTMLField<{}>;

  /**
   * The HTML content of this chat message
   */
  content: fields.HTMLField<{}>;

  /**
   * A ChatSpeakerData object which describes the origin of the ChatMessage
   */
  speaker: fields.SchemaField<ChatSpeakerSchema, {}>;

  /**
   * An array of User _id values to whom this message is privately whispered
   */
  whisper: fields.ArrayField<fields.ForeignDocumentField<typeof documents.BaseUser, { idOnly: true }>, {}>;

  /**
   * Is this message sent blindly where the creating User cannot see it?
   * (default: `false`)
   */
  blind: fields.BooleanField<{}>;

  /**
   * Serialized content of any Roll instances attached to the ChatMessage
   */
  rolls: fields.ArrayField<fields.JSONField<{}>, {}>;

  /**
   * The URL of an audio file which plays when this message is received
   */
  sound: fields.FilePathField<{ categories: ['AUDIO'] }>;

  /**
   * Is this message styled as an emote?
   * (default: `false`)
   */
  emote: fields.BooleanField<{}>;

  /**
   * An object of optional key/value flags
   */
  flags: FlagsField<'ChatMessage', {}>;
}

interface ChatSpeakerSchema extends DataSchema {
  /** The _id of the Scene where this message was created */
  scene: fields.ForeignDocumentField<typeof documents.BaseScene, { idOnly: true }>;

  /** The _id of the Actor who generated this message */
  actor: fields.ForeignDocumentField<typeof documents.BaseActor, { idOnly: true }>;

  /** The _id of the Token who generated this message */
  token: fields.ForeignDocumentField<typeof documents.BaseToken, { idOnly: true }>;

  /** An overridden alias name used instead of the Actor or Token name */
  alias: fields.StringField<{}>;
}

type CanCreate = (user: documents.BaseUser, doc: BaseChatMessage) => boolean;
type CanUpdate = (
  user: documents.BaseUser,
  doc: BaseChatMessage,
  data: DeepPartial<DataModel.SchemaToSource<BaseChatMessage['schema']>>
) => boolean;
type CanDelete = CanCreate;

type BaseChatMessageMetadata = Merge<
  DocumentMetadata,
  {
    name: 'ChatMessage';
    collection: 'messages';
    label: 'DOCUMENT.ChatMessage';
    labelPlural: 'DOCUMENT.ChatMessages';
    isPrimary: true;
    permissions: {
      create: CanCreate;
      update: CanUpdate;
      delete: CanDelete;
    };
  }
>;

type BaseChatMessageShims = {
  /**
   * V10 migration from one roll to many
   * @deprecated since v10
   */
  roll: BaseChatMessage['rolls']['0'];
};

/**
 * The Document definition for a ChatMessage.
 * Defines the DataSchema and common behaviors for a ChatMessage which are shared between both client and server.
 */
declare class BaseChatMessage extends Document<
  BaseChatMessageSchema,
  null,
  BaseChatMessageMetadata,
  BaseChatMessageShims
> {
  /* -------------------------------------------- */
  /*  Model Configuration                         */
  /* -------------------------------------------- */

  /** {@inheritdoc} */
  static override readonly metadata: BaseChatMessageMetadata;

  /** {@inheritdoc} */
  static override defineSchema(): BaseChatMessageSchema;

  /**
   * Is a user able to create a new chat message?
   */
  static #canCreate: CanCreate;

  /**
   * Is a user able to update an existing chat message?
   */
  static #canUpdate: CanUpdate;

  /**
   * Is a user able to delete an existing chat message?
   */
  static #canDelete: CanDelete;

  /* -------------------------------------------- */
  /*  Deprecations and Compatibility              */
  /* -------------------------------------------- */

  /** {@inheritdoc} */
  static override migrateData(data: Record<string, unknown>): Record<string, unknown>;

  /* ---------------------------------------- */

  /** {@inheritdoc} */
  static override shimData(data: Record<string, unknown>, options: DataModel.ShimDataOptions): Record<string, unknown>;
}

export default BaseChatMessage;
