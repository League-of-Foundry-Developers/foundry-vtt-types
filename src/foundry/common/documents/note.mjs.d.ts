import Document, { DocumentMetadata } from '../abstract/document.mjs';
import * as fields from '../data/fields.mjs';
import * as documents from './module.mjs';
import * as CONST from '../constants.mjs';
import { TextureDataField } from '../data/data.mjs';
import { DataModel, DataSchema } from '../abstract/data.mjs';
import { ConfiguredDocumentClass, JSOr } from '../../../types/helperTypes.js';
import type { FlagsField } from '../data/flagsField.js';

interface BaseNoteSchema extends DataSchema {
  /**
   * The _id which uniquely identifies this BaseNote embedded document
   */
  _id: fields.DocumentIdField<{}>;

  /**
   * The _id of a JournalEntry document which this Note represents
   * (default: `null`)
   */
  entryId: fields.ForeignDocumentField<typeof documents.BaseJournalEntry, { idOnly: true }>;

  pageId: fields.ForeignDocumentField<typeof documents.BaseJournalEntryPage, { idOnly: true }>;

  /**
   * The x-coordinate position of the center of the note icon
   * (default: `0`)
   */
  x: fields.NumberField<{ required: true; integer: true; nullable: false; initial: 0; label: 'XCoord' }>;

  /**
   * The y-coordinate position of the center of the note icon
   * (default: `0`)
   */
  y: fields.NumberField<{ required: true; integer: true; nullable: false; initial: 0; label: 'YCoord' }>;

  /**
   * An image icon used to represent this note
   */
  texture: TextureDataField<{
    categories: ['IMAGE'];
    initial: () => typeof BaseNote.DEFAULT_ICON;
    label: 'NOTE.EntryIcon';
  }>;

  /**
   * The pixel size of the map note icon
   * (default: `40`)
   */
  iconSize: fields.NumberField<{
    required: true;
    integer: true;
    min: 32;
    initial: 40;

    validationError: 'must be an integer greater than 32';
    label: 'NOTE.IconSize';
  }>;

  /**
   * Optional text which overrides the title of the linked Journal Entry
   */
  text: fields.StringField<{ label: 'NOTE.TextLabel' }>;

  /**
   * The font family used to display the text label on this note, defaults to CONFIG.defaultFontFamily
   */
  fontFamily: fields.StringField<{
    required: true;
    label: 'NOTE.FontFamily';
    initial: () => JSOr<OptionalChaining<typeof CONFIG, 'defaultFontFamily'>, 'Signika'>;
  }>;

  /**
   * The font size used to display the text label on this note
   * (default: `36`)
   */
  fontSize: fields.NumberField<{
    required: true;
    integer: true;
    min: 8;
    max: 128;
    initial: 32;
    validationError: 'must be an integer between 8 and 128';
    label: 'NOTE.FontSize';
  }>;

  /**
   * A value in CONST.TEXT_ANCHOR_POINTS which defines where the text label anchors to the note icon.
   * (default: `1`)
   */
  textAnchor: fields.NumberField<{
    required: true;
    choices: ValueOf<typeof CONST.TEXT_ANCHOR_POINTS>[];
    initial: typeof CONST.TEXT_ANCHOR_POINTS.BOTTOM;
    label: 'NOTE.AnchorPoint';
    validationError: 'must be a value in CONST.TEXT_ANCHOR_POINTS';
  }>;

  /**
   * The string that defines the color with which the note text is rendered
   * (default: `'#FFFFFF'`)
   */
  textColor: fields.ColorField<{ initial: '#FFFFFF'; label: 'NOTE.TextColor' }>;

  /**
   * An object of optional key/value flags
   */
  flags: FlagsField<'Note', {}>;
}

type BaseNoteMetadata = Merge<
  DocumentMetadata,
  {
    name: 'Note';
    collection: 'notes';
    label: 'DOCUMENT.Note';
    labelPlural: 'DOCUMENT.Notes';
    permissions: {
      create: 'NOTE_CREATE';
    };
  }
>;

type BaseNoteShims = {
  /**
   * Migration to TextureData.
   * @deprecated since v10
   */
  icon: BaseNote['texture']['src'];

  /**
   * Migration to TextureData.
   * @deprecated since v10
   */
  iconHint: BaseNote['texture']['tint'];
};

/**
 * The Document definition for a Note.
 * Defines the DataSchema and common behaviors for a Note which are shared between both client and server.
 */
declare class BaseNote extends Document<
  BaseNoteSchema,
  InstanceType<ConfiguredDocumentClass<typeof documents.BaseScene>>,
  BaseNoteMetadata,
  BaseNoteShims
> {
  /* -------------------------------------------- */
  /*  Model Configuration                         */
  /* -------------------------------------------- */

  /** {@inheritdoc} */
  static override readonly metadata: BaseNoteMetadata;

  /** {@inheritdoc} */
  static override defineSchema(): BaseNoteSchema;

  /**
   * The default icon used for newly created Note documents.
   *
   * (initialized: `'icons/svg/book.svg'`)
   */
  static DEFAULT_ICON: string;

  /* -------------------------------------------- */
  /*  Model Methods                               */
  /* -------------------------------------------- */

  /** {@inheritdoc} */
  override testUserPermission(
    user: foundry.documents.BaseUser,
    permission: keyof typeof foundry.CONST.DOCUMENT_PERMISSION_LEVELS | foundry.CONST.DOCUMENT_PERMISSION_LEVELS,
    { exact }?: { exact?: boolean }
  ): boolean;

  /* -------------------------------------------- */
  /*  Deprecations and Compatibility              */
  /* -------------------------------------------- */

  /** {@inheritdoc} */
  static override migrateData(data: Record<string, unknown>): Record<string, unknown>;

  /* -------------------------------------------- */

  /** {@inheritdoc} */
  static override shimData(data: Record<string, unknown>, options: DataModel.ShimDataOptions): Record<string, unknown>;
}

export default BaseNote;
