import {
  ConfiguredDocumentClass,
  ConfiguredFlags,
  FieldReturnType,
  PropertiesToSource
} from "../../../../types/helperTypes";
import DocumentData from "../../abstract/data.mjs";
import * as documents from "../../documents.mjs";
import * as fields from "../fields.mjs";

interface NoteDataSchema extends DocumentSchema {
  _id: fields.DocumentId;
  entryId: fields.ForeignDocumentField<{ type: typeof documents.BaseJournalEntry; required: false }>;
  x: fields.RequiredNumber;
  y: fields.RequiredNumber;
  icon: FieldReturnType<fields.ImageField, { required: true; default: typeof NoteData.DEFAULT_ICON }>;
  iconSize: FieldReturnType<
    fields.RequiredNumber,
    {
      default: 40;
      validate: (n: unknown) => n is number;
      validationError: "Invalid {name} {field} which must be an integer greater than 32";
    }
  >;
  iconTint: fields.ColorField;
  text: fields.StringField;
  fontFamily: FieldReturnType<
    fields.RequiredString,
    {
      default: () => typeof CONFIG["defaultFontFamily"];
    }
  >;
  fontSize: FieldReturnType<
    fields.RequiredNumber,
    {
      default: 48;
      validate: (n: unknown) => n is number;
      validationError: "Invalid {name} {field} which must be an integer between 8 and 128";
    }
  >;
  textAnchor: DocumentField<typeof foundry.CONST.TEXT_ANCHOR_POINTS> & {
    type: typeof Number;
    required: true;
    default: typeof foundry.CONST.TEXT_ANCHOR_POINTS.BOTTOM;
    validate: (p: unknown) => p is foundry.CONST.TEXT_ANCHOR_POINTS;
    validationError: "Invalid {name} {field} which must be a value in CONST.TEXT_ANCHOR_POINTS";
  };
  textColor: FieldReturnType<fields.ColorField, { default: "#FFFFFF" }>;
  flags: fields.ObjectField;
}

interface NoteDataProperties {
  /**
   * The _id which uniquely identifies this BaseNote embedded document
   * @defaultValue `null`
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
   * @defaultValue `CONST.DEFAULT_NOTE_ICON`
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
  textAnchor: foundry.CONST.TEXT_ANCHOR_POINTS;

  /**
   * The string that defines the color with which the note text is rendered
   * @defaultValue `#FFFFFF`
   */
  textColor: string | null;

  /**
   * An object of optional key/value flags
   * @defaultValue `{}`
   */
  flags: ConfiguredFlags<"Note">;
}

interface NoteDataConstructorData {
  /**
   * The _id which uniquely identifies this BaseNote embedded document
   * @defaultValue `null`
   */
  _id?: string | null | undefined;

  /**
   * The _id of a JournalEntry document which this Note represents
   * @defaultValue `null`
   */
  entryId?: InstanceType<ConfiguredDocumentClass<typeof documents.BaseJournalEntry>> | string | null | undefined;

  /**
   * The x-coordinate position of the center of the note icon
   * @defaultValue `0`
   */
  x?: number | null | undefined;

  /**
   * The y-coordinate position of the center of the note icon
   * @defaultValue `0`
   */
  y?: number | null | undefined;

  /**
   * An image icon path used to represent this note
   * @defaultValue `CONST.DEFAULT_NOTE_ICON`
   */
  icon?: string | null | undefined;

  /**
   * The pixel size of the map note icon
   * @defaultValue `40`
   */
  iconSize?: number | null | undefined;

  /**
   * An optional color string used to tint the map note icon
   */
  iconTint?: string | null | undefined;

  /**
   * Optional text which overrides the title of the linked Journal Entry
   */
  text?: string | null | undefined;

  /**
   * The font family used to display the text label on this note
   * @defaultValue `CONFIG?.defaultFontFamily || "Signika"`
   */
  fontFamily?: string | null | undefined;

  /**
   * The font size used to display the text label on this note
   * @defaultValue `48`
   */
  fontSize?: number | null | undefined;

  /**
   * A value in CONST.TEXT_ANCHOR_POINTS which defines where the text label anchors
   * to the note icon.
   * @defaultValue `CONST.TEXT_ANCHOR_POINTS.BOTTOM`
   */
  textAnchor?: foundry.CONST.TEXT_ANCHOR_POINTS | null | undefined;

  /**
   * The string that defines the color with which the note text is rendered
   * @defaultValue `#FFFFFF`
   */
  textColor?: string | null | undefined;

  /**
   * An object of optional key/value flags
   * @defaultValue `{}`
   */
  flags?: ConfiguredFlags<"Note"> | null | undefined;
}

type NoteDataSource = PropertiesToSource<NoteDataProperties>;

/**
 * The data schema for a Note embedded document.
 * @see BaseNote
 */
export class NoteData extends DocumentData<
  NoteDataSchema,
  NoteDataProperties,
  NoteDataSource,
  NoteDataConstructorData,
  documents.BaseNote
> {
  static override defineSchema(): NoteDataSchema;

  /**
   * The default icon used for newly created Note documents.
   * @defaultValue `"icons/svg/book.svg"`
   */
  static DEFAULT_ICON: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface NoteData extends NoteDataProperties {}
