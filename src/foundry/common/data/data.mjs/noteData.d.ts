import { ConfiguredFlags, FieldReturnType, PropertiesToSource } from '../../../../types/helperTypes';
import DocumentData from '../../abstract/data.mjs';
import * as documents from '../../documents.mjs';
import * as fields from '../fields.mjs';

interface NoteDataSchema extends DocumentSchema {
  _id: typeof fields.DOCUMENT_ID;
  entryId: fields.ForeignDocumentField<{ type: typeof documents.BaseJournalEntry; required: false }>;
  x: typeof fields.REQUIRED_NUMBER;
  y: typeof fields.REQUIRED_NUMBER;
  icon: FieldReturnType<
    typeof fields.IMAGE_FIELD,
    {
      required: true;
      default: typeof CONST.DEFAULT_NOTE_ICON;
    }
  >;
  iconSize: FieldReturnType<
    typeof fields.REQUIRED_NUMBER,
    {
      default: 40;
      validate: (n: unknown) => n is number;
      validationError: 'Invalid {name} {field} which must be an integer greater than 32';
    }
  >;
  iconTint: typeof fields.COLOR_FIELD;
  text: typeof fields.STRING_FIELD;
  fontFamily: FieldReturnType<
    typeof fields.REQUIRED_STRING,
    {
      default: typeof CONFIG['defaultFontFamily'];
    }
  >;
  fontSize: FieldReturnType<
    typeof fields.REQUIRED_NUMBER,
    {
      default: 48;
      validate: (n: unknown) => n is number;
      validationError: 'Invalid {name} {field} which must be an integer between 8 and 128';
    }
  >;
  textAnchor: DocumentField<number> & {
    type: typeof Number;
    required: true;
    default: typeof CONST.TEXT_ANCHOR_POINTS.BOTTOM;
    validate: (p: unknown) => p is foundry.CONST.TextAnchorPoint;
    validationError: 'Invalid {name} {field} which must be a value in CONST.TEXT_ANCHOR_POINTS';
  };
  textColor: FieldReturnType<typeof fields.COLOR_FIELD, { default: '#FFFFFF' }>;
  flags: typeof fields.OBJECT_FIELD;
}

interface NoteDataProperties {
  /**
   * The _id which uniquely identifies this BaseNote embedded document
   */
  _id: string | null;

  /**
   * The _id of a JournalEntry document which this Note represents
   * @defaultValue `null`
   */
  entryId: string | null;

  /**
   * The x-coordinate position of the center of the note icon
   * @defaultValue `0`
   */
  x: number;

  /**
   * The y-coordinate position of the center of the note icon
   * @defaultValue `0`
   */
  y: number;

  /**
   * An image icon path used to represent this note
   */
  icon: string | null;

  /**
   * The pixel size of the map note icon
   * @defaultValue `40`
   */
  iconSize: number;

  /**
   * An optional color string used to tint the map note icon
   */
  iconTint: string | null | undefined;

  /**
   * Optional text which overrides the title of the linked Journal Entry
   */
  text: string | undefined;

  /**
   * The font family used to display the text label on this note
   * @defaultValue `CONFIG?.defaultFontFamily || "Signika"`
   */
  fontFamily: string;

  /**
   * The font size used to display the text label on this note
   * @defaultValue `48`
   */
  fontSize: number;

  /**
   * A value in CONST.TEXT_ANCHOR_POINTS which defines where the text label anchors
   * to the note icon.
   * @defaultValue `CONST.TEXT_ANCHOR_POINTS.BOTTOM`
   */
  textAnchor: foundry.CONST.TextAnchorPoint;

  /**
   * The string that defines the color with which the note text is rendered
   * @defaultValue `#FFFFFF`
   */
  textColor: string | null;

  /**
   * An object of optional key/value flags
   * @defaultValue `{}`
   */
  flags: ConfiguredFlags<'Note'>;
}

interface NoteDataConstructorData {
  /**
   * The _id which uniquely identifies this BaseNote embedded document
   */
  _id?: string | null;

  /**
   * The _id of a JournalEntry document which this Note represents
   * @defaultValue `null`
   */
  entryId?: string | null;

  /**
   * The x-coordinate position of the center of the note icon
   * @defaultValue `0`
   */
  x?: number | null;

  /**
   * The y-coordinate position of the center of the note icon
   * @defaultValue `0`
   */
  y?: number | null;

  /**
   * An image icon path used to represent this note
   */
  icon?: string | null;

  /**
   * The pixel size of the map note icon
   * @defaultValue `40`
   */
  iconSize?: number | null;

  /**
   * An optional color string used to tint the map note icon
   */
  iconTint?: string | null;

  /**
   * Optional text which overrides the title of the linked Journal Entry
   */
  text?: string | null;

  /**
   * The font family used to display the text label on this note
   * @defaultValue `CONFIG?.defaultFontFamily || "Signika"`
   */
  fontFamily?: string | null;

  /**
   * The font size used to display the text label on this note
   * @defaultValue `48`
   */
  fontSize?: number | null;

  /**
   * A value in CONST.TEXT_ANCHOR_POINTS which defines where the text label anchors
   * to the note icon.
   * @defaultValue `CONST.TEXT_ANCHOR_POINTS.BOTTOM`
   */
  textAnchor?: foundry.CONST.TextAnchorPoint | null;

  /**
   * The string that defines the color with which the note text is rendered
   * @defaultValue `#FFFFFF`
   */
  textColor?: string | null;

  /**
   * An object of optional key/value flags
   * @defaultValue `{}`
   */
  flags?: ConfiguredFlags<'Note'> | null;
}

/**
 * The data schema for a Note embedded document.
 * @see BaseNote
 */
export declare class NoteData extends DocumentData<
  NoteDataSchema,
  NoteDataProperties,
  PropertiesToSource<NoteDataProperties>,
  NoteDataConstructorData,
  documents.BaseNote
> {
  static defineSchema(): NoteDataSchema;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export declare interface NoteData extends NoteDataProperties {}
