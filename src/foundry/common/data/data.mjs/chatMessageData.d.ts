import {
  ConfiguredDocumentClass,
  ConfiguredFlags,
  FieldReturnType,
  PropertiesToSource
} from "../../../../types/helperTypes";
import { DocumentData } from "../../abstract/module.mjs";
import { documents } from "../../module.mjs";
import * as fields from "../fields.mjs";
import { ChatSpeakerData, ChatSpeakerDataConstructorData } from "./chatSpeakerData";

interface ChatMessageDataSchema extends DocumentSchema {
  _id: fields.DocumentId;
  type: DocumentField<foundry.CONST.CHAT_MESSAGE_TYPES> & {
    type: typeof Number;
    required: true;
    default: typeof foundry.CONST.CHAT_MESSAGE_TYPES.OTHER;
    validate: typeof _validateChatMessageType;
    validationError: "The provided ChatMessage type must be in CONST.CHAT_MESSAGE_TYPES";
  };
  user: fields.ForeignDocumentField<{ type: typeof documents.BaseUser; required: true }>;
  timestamp: FieldReturnType<fields.TimestampField, { required: true }>;
  flavor: fields.StringField;
  content: fields.BlankString;
  speaker: DocumentField<ChatSpeakerData> & {
    type: typeof ChatSpeakerData;
    required: true;
    default: Record<string, never>;
  };
  whisper: DocumentField<string[]> & {
    type: [typeof String];
    clean: (users: Array<{ id: string } | string>) => string[];
    required: true;
    default: string[];
  };
  blind: fields.BooleanField;
  roll: fields.JsonField;
  sound: fields.AudioField;
  emote: fields.BooleanField;
  flags: fields.ObjectField;
}

interface ChatMessageDataProperties {
  /**
   * The _id which uniquely identifies this ChatMessage document
   * @defaultValue `null`
   */
  _id: string | null;

  /**
   * The message type from CONST.CHAT_MESSAGE_TYPES
   * @defaultValue `CONST.CHAT_MESSAGE_TYPES.OTHER`
   */
  type: foundry.CONST.CHAT_MESSAGE_TYPES;

  /**
   * The _id of the User document who generated this message
   * @defaultValue `null`
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
  flavor: string | undefined;

  /**
   * The HTML content of this chat message
   * @defaultValue `""`
   */
  content: string;

  /**
   * A ChatSpeakerData object which describes the origin of the ChatMessage
   * @defaultValue `new ChatSpeakerData({})`
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
   */
  roll: string | undefined;

  /**
   * The URL of an audio file which plays when this message is received
   */
  sound: string | null | undefined;

  /**
   * Is this message styled as an emote?
   * @defaultValue `false`
   */
  emote: boolean;

  /**
   * An object of optional key/value flags
   * @defaultValue `{}`
   */
  flags: ConfiguredFlags<"ChatMessage">;
}

interface ChatMessageDataConstructorData {
  /**
   * The _id which uniquely identifies this ChatMessage document
   * @defaultValue `null`
   */
  _id?: string | null | undefined;

  /**
   * The message type from CONST.CHAT_MESSAGE_TYPES
   * @defaultValue `CONST.CHAT_MESSAGE_TYPES.OTHER`
   */
  type?: foundry.CONST.CHAT_MESSAGE_TYPES | null | undefined;

  /**
   * The _id of the User document who generated this message
   * @defaultValue `null`
   */
  user?: InstanceType<ConfiguredDocumentClass<typeof documents.BaseUser>> | string | null | undefined;

  /**
   * The timestamp at which point this message was generated
   * @defaultValue `Date.now()`
   */
  timestamp?: number | null | undefined;

  /**
   * An optional flavor text message which summarizes this message
   */
  flavor?: string | null | undefined;

  /**
   * The HTML content of this chat message
   * @defaultValue `""`
   */
  content?: string | null | undefined;

  /**
   * A ChatSpeakerData object which describes the origin of the ChatMessage
   * @defaultValue `new ChatSpeakerData({})`
   */
  speaker?: ChatSpeakerDataConstructorData | null | undefined;

  /**
   * An array of User _id values to whom this message is privately whispered
   * @defaultValue `[]`
   */
  whisper?: Array<{ id: string } | string> | null | undefined;

  /**
   * Is this message sent blindly where the creating User cannot see it?
   * @defaultValue `false`
   */
  blind?: boolean | null | undefined;

  /**
   * The serialized content of a Roll instance which belongs to the ChatMessage
   */
  roll?: string | object | null | undefined;

  /**
   * The URL of an audio file which plays when this message is received
   */
  sound?: string | null | undefined;

  /**
   * Is this message styled as an emote?
   * @defaultValue `false`
   */
  emote?: boolean | null | undefined;

  /**
   * An object of optional key/value flags
   * @defaultValue `{}`
   */
  flags?: ConfiguredFlags<"ChatMessage"> | null | undefined;
}

type ChatMessageDataSource = PropertiesToSource<ChatMessageDataProperties>;

/**
 * An embedded data object which defines the properties of a light source animation
 */
export class ChatMessageData extends DocumentData<
  ChatMessageDataSchema,
  ChatMessageDataProperties,
  ChatMessageDataSource,
  ChatMessageDataConstructorData,
  documents.BaseChatMessage
> {
  static override defineSchema(): ChatMessageDataSchema;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ChatMessageData extends ChatMessageDataProperties {}

/**
 * Validate that a ChatMessage has a valid type
 * @param type - The assigned message type
 * @returns Is it valid?
 */
declare function _validateChatMessageType(type: number): boolean;
