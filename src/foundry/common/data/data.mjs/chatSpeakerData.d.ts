import { FieldReturnType, PropertiesToSource } from '../../../../types/helperTypes';
import { DocumentData } from '../../abstract/module.mjs';
import { BaseChatMessage, BaseScene } from '../../documents.mjs';
import { ForeignDocumentField } from '../fields.mjs';
import * as fields from '../fields.mjs';

interface ChatSpeakerDataSchema extends DocumentSchema {
  scene: ForeignDocumentField<{ type: BaseScene; required: false }>;
  actor: ForeignDocumentField<{ type: BaseScene; required: false }>;
  token: FieldReturnType<typeof fields.DOCUMENT_ID, { required: false }>;
  alias: typeof fields.STRING_FIELD;
}

interface ChatSpeakerDataProperties {
  /**
   * The _id of the Scene where this message was created
   */
  scene: string | null;

  /**
   * The _id of the Actor who generated this message
   */
  actor: string | null;

  /**
   * The _id of the Token who generated this message
   */
  token: string | null;

  /**
   * An overridden alias name used instead of the Actor or Token name
   */
  alias?: string;
}

interface ChatSpeakerDataConstructorData {
  /**
   * The _id of the Scene where this message was created
   */
  scene?: string | null;

  /**
   * The _id of the Actor who generated this message
   */
  actor?: string | null;

  /**
   * The _id of the Token who generated this message
   */
  token?: string | null;

  /**
   * An overridden alias name used instead of the Actor or Token name
   */
  alias?: string | null;
}

/**
 * An embedded data object which defines the properties of a light source animation
 */
export declare class ChatSpeakerData extends DocumentData<
  ChatSpeakerDataSchema,
  ChatSpeakerDataProperties,
  PropertiesToSource<ChatSpeakerDataProperties>,
  ChatSpeakerDataConstructorData,
  BaseChatMessage // Todo: This is wrong
> {
  static defineSchema(): ChatSpeakerDataSchema;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export declare interface ChatSpeakerData extends ChatSpeakerDataProperties {}
