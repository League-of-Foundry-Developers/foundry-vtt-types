import { ConfiguredFlags, FieldReturnType, PropertiesToSource } from '../../../../types/helperTypes';
import { DocumentData } from '../../abstract/module.mjs';
import { CONST, documents } from '../../module.mjs';
import * as fields from '../fields.mjs';
import { ChatSpeakerData, ChatSpeakerDataConstructorData } from './chatSpeakerData';

interface ChatMessageDataSchema extends DocumentSchema {
  _id: typeof fields.DOCUMENT_ID;
  type: DocumentField<CONST.ChatMessageType> & {
    type: typeof Number;
    required: true;
    default: typeof CONST.CHAT_MESSAGE_TYPES.OTHER;
    validate: typeof _validateChatMessageType;
    validationError: 'The provided ChatMessage type must be in CONST.CHAT_MESSAGE_TYPES';
  };
  user: fields.ForeignDocumentField<{ type: typeof documents.BaseUser; required: true }>;
  timestamp: FieldReturnType<typeof fields.TIMESTAMP_FIELD, { required: true }>;
  flavor: typeof fields.STRING_FIELD;
  content: typeof fields.BLANK_STRING;
  speaker: DocumentField<ChatSpeakerData> & { type: typeof ChatSpeakerData; required: true; default: {} };
  whisper: DocumentField<string[]> & {
    type: typeof String[];
    clean: (users: Array<{ id: string | null } | string>) => string[];
    required: true;
    default: string[];
  };
  blind: typeof fields.BOOLEAN_FIELD;
  roll: typeof fields.JSON_FIELD;
  sound: typeof fields.AUDIO_FIELD;
  emote: typeof fields.BOOLEAN_FIELD;
  flags: typeof fields.OBJECT_FIELD;
}

interface ChatMessageDataProperties {
  /**
   * The _id which uniquely identifies this ChatMessage document
   */
  _id: string | null;

  /**
   * The message type from CONST.CHAT_MESSAGE_TYPES
   * @defaultValue `CONST.CHAT_MESSAGE_TYPES.OTHER`
   */
  type: CONST.ChatMessageType;

  /**
   * The _id of the User document who generated this message
   */
  user: string | null;

  /**
   * The timestamp at which point this message was generated
   * @defaultValue `Date.now()`
   */
  timestamp: number;

  /**
   * An optional flavor text message which summarizes this message
   */
  flavor?: string;

  /**
   * The HTML content of this chat message
   * @defaultValue `""`
   */
  content: string;

  /**
   * A ChatSpeakerData object which describes the origin of the ChatMessage
   */
  speaker: ChatSpeakerData;

  /**
   * An array of User _id values to whom this message is privately whispered
   * @defaultValue `[]`
   */
  whisper: string[];

  /**
   * Is this message sent blindly where the creating User cannot see it?
   * @defaultValue `false`
   */
  blind: boolean;

  /**
   * The serialized content of a Roll instance which belongs to the ChatMessage
   * @defaultValue `undefined`
   */
  roll?: string;

  /**
   * The URL of an audio file which plays when this message is received
   * @defaultValue `undefined`
   */
  sound?: string | null;

  /**
   * Is this message styled as an emote?
   * @defaultValue `false`
   */
  emote: boolean;

  /**
   * An object of optional key/value flags
   * @defaultValue `{}`
   */
  flags: ConfiguredFlags<'ChatMessage'>;
}

export interface ChatMessageDataConstructorData {
  /**
   * The _id which uniquely identifies this ChatMessage document
   */
  _id?: string | null;

  /**
   * The message type from CONST.CHAT_MESSAGE_TYPES
   * @defaultValue `CONST.CHAT_MESSAGE_TYPES.OTHER`
   */
  type?: CONST.ChatMessageType | null;

  /**
   * The _id of the User document who generated this message
   */
  user?: string | null;

  /**
   * The timestamp at which point this message was generated
   * @defaultValue `Date.now()`
   */
  timestamp?: number | null;

  /**
   * An optional flavor text message which summarizes this message
   */
  flavor?: string | null;

  /**
   * The HTML content of this chat message
   * @defaultValue `""`
   */
  content?: string | null;

  /**
   * A ChatSpeakerData object which describes the origin of the ChatMessage
   */
  speaker?: ChatSpeakerDataConstructorData | null;

  /**
   * An array of User _id values to whom this message is privately whispered
   * @defaultValue `[]`
   */
  whisper?: Array<{ id: string | null } | string> | null;

  /**
   * Is this message sent blindly where the creating User cannot see it?
   * @defaultValue `false`
   */
  blind?: boolean | null;

  /**
   * The serialized content of a Roll instance which belongs to the ChatMessage
   * @defaultValue `undefined`
   */
  roll?: string | null;

  /**
   * The URL of an audio file which plays when this message is received
   * @defaultValue `undefined`
   */
  sound?: string | null;

  /**
   * Is this message styled as an emote?
   * @defaultValue `false`
   */
  emote?: boolean | null;

  /**
   * An object of optional key/value flags
   * @defaultValue `{}`
   */
  flags?: ConfiguredFlags<'ChatMessage'> | null;
}

/**
 * An embedded data object which defines the properties of a light source animation
 */
export declare class ChatMessageData extends DocumentData<
  ChatMessageDataSchema,
  ChatMessageDataProperties,
  PropertiesToSource<ChatMessageDataProperties>,
  ChatMessageDataConstructorData,
  documents.BaseChatMessage
> {
  static defineSchema(): ChatMessageDataSchema;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export declare interface ChatMessageData extends ChatMessageDataProperties {}

/**
 * Validate that a ChatMessage has a valid type
 * @param type - The assigned message type
 * @returns Is it valid?
 */
declare function _validateChatMessageType(type: number): boolean;
