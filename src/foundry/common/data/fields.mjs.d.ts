import { DOCUMENT_PERMISSION_LEVELS } from "../constants.mjs";
import { isColorString, isJSON } from "./validators.mjs";
import { Document } from "../abstract/module.mjs";
import { FieldReturnType } from "../../../types/helperTypes";

/**
 * A required boolean field which may be used in a Document.
 */
export const BOOLEAN_FIELD: BooleanField;
/**
 * Property type: `boolean`
 * Constructor type: `boolean | null | undefined`
 * Default: `false`
 */
interface BooleanField extends DocumentField<boolean> {
  type: typeof Boolean;
  required: true;
  default: false;
}

/**
 * A standard string color field which may be used in a Document.
 */
export const COLOR_FIELD: ColorField;
/**
 * Property type: `string | null | undefined`
 * Constructor type: `string | null | undefined`
 */
interface ColorField extends DocumentField<string> {
  type: typeof String;
  required: false;
  nullable: true;
  validate: typeof isColorString;
  validationError: '{name} {field} "{value}" is not a valid hexadecimal color string';
}

/**
 * A standard string field for an image file path which may be used in a Document.
 */
export const IMAGE_FIELD: ImageField;
/**
 * Property type: `string | null | undefined`
 * Constructor type: `string | null | undefined`
 */
interface ImageField extends DocumentField<string> {
  type: typeof String;
  required: false;
  nullable: true;
  validate: (path: string) => boolean;
  validationError: '{name} {field} "{value}" does not have a valid image file extension';
}

/**
 * A standard string field for a video or image file path may be used in a Document.
 */
export const VIDEO_FIELD: VideoField;
/**
 * Property type: `string | null | undefined`
 * Constructor type: `string | null | undefined`
 */
interface VideoField extends DocumentField<string> {
  type: typeof String;
  required: false;
  nullable: true;
  validate: (src: string | null) => boolean;
  validationError: '{name} {field} "{value}" does not have a valid image or video file extension';
}

/**
 * A standard string field for an audio file path which may be used in a Document.
 */
export const AUDIO_FIELD: AudioField;
/**
 * Property type: `string | null | undefined`
 * Constructor type: `string | null | undefined`
 */
interface AudioField extends DocumentField<string> {
  type: typeof String;
  required: false;
  nullable: true;
  validate: (src: string | null) => boolean;
  validationError: '{name} {field} "{value}" does not have a valid audio file extension';
}

/**
 * A standard integer field which may be used in a Document.
 */
export const INTEGER_FIELD: IntegerField;
/**
 * Property type: `number | undefined`
 * Constructor type: `number | null | undefined`
 */
interface IntegerField extends DocumentField<number> {
  type: typeof Number;
  required: false;
  validate: typeof Number.isInteger;
  validationError: '{name} {field} "{value}" does not have an integer value';
}

/**
 * A string field which contains serialized JSON data that may be used in a Document.
 */
export const JSON_FIELD: JsonField;
/**
 * Property type: `string | undefined`
 * Constructor type: `string | object | null | undefined`
 */
interface JsonField extends DocumentField<string> {
  type: typeof String;
  required: false;
  clean: (s: unknown) => string;
  validate: typeof isJSON;
  validationError: '{name} {field} "{value}" is not a valid JSON string';
}

/**
 * A non-negative integer field which may be used in a Document.
 */
export const NONNEGATIVE_INTEGER_FIELD: NonnegativeIntegerField;
/**
 * Property type: `number | undefined`
 * Constructor type: `number | null | undefined`
 */
interface NonnegativeIntegerField extends DocumentField<number> {
  type: typeof Number;
  required: false;
  validate: (n: unknown) => boolean;
  validationError: '{name} {field} "{value}" does not have an non-negative integer value';
}

/**
 * A non-negative integer field which may be used in a Document.
 *
 * @remarks The validation actually checks for `> 0`, the JSDoc is incorrect in foundry.
 */
export const POSITIVE_INTEGER_FIELD: PositiveIntegerField;
/**
 * Property type: `number | undefined`
 * Constructor type: `number | null | undefined`
 */
interface PositiveIntegerField extends DocumentField<number> {
  type: typeof Number;
  required: false;
  validate: (n: unknown) => boolean;
  validationError: '{name} {field} "{value}" does not have an non-negative integer value';
}

/**
 * A template for a required inner-object field which may be used in a Document.
 */
export const OBJECT_FIELD: ObjectField;
/**
 * Property type: `object`
 * Constructor type: `object | null | undefined`
 * Default `{}`
 */
interface ObjectField extends DocumentField<object> {
  type: typeof Object;
  default: Record<string, never>;
  required: true;
}

/**
 * An optional string field which may be included by a Document.
 */
export const STRING_FIELD: StringField;
/**
 * Property type: `string | undefined`
 * Constructor type: `string | null | undefined`
 */
interface StringField extends DocumentField<string> {
  type: typeof String;
  required: false;
  nullable: false;
}

/**
 * An optional numeric field which may be included in a Document.
 */
export const NUMERIC_FIELD: NumericField;
/**
 * Property type: `number | null | undefined`
 * Constructor type: `number | null | undefined`
 */
interface NumericField extends DocumentField<number> {
  type: typeof Number;
  required: false;
  nullable: true;
}

/**
 * A required numeric field which may be included in a Document and may not be null.
 */
export const REQUIRED_NUMBER: RequiredNumber;
/**
 * Property type: `number`
 * Constructor type: `number | null | undefined`
 * Default: `0`
 */
interface RequiredNumber extends DocumentField<number> {
  type: typeof Number;
  required: true;
  nullable: false;
  default: 0;
}

/**
 * A field used to designate a non-negative number
 */
export const NONNEGATIVE_NUMBER_FIELD: NonnegativeNumberField;
/**
 * Property type: `number`
 * Constructor type: `number | null | undefined`
 * Default: `0`
 */
interface NonnegativeNumberField extends DocumentField<number> {
  type: typeof Number;
  required: true;
  nullable: false;
  default: 0;
  validate: (n: unknown) => boolean;
  validationError: '{name} {field} "{value}" must be a non-negative number';
}

/**
 * A required numeric field which must be a positive finite value that may be included in a Document.
 */
export const REQUIRED_POSITIVE_NUMBER: RequiredPositiveNumber;
/**
 * Property type: `number`
 * Constructor type: `number`
 */
interface RequiredPositiveNumber extends DocumentField<number> {
  type: typeof Number;
  required: true;
  nullable: false;
  validate: (n: unknown) => boolean;
  validationError: '{name} {field} "{value}" is not a positive number';
}

/**
 * A required numeric field which represents an angle of rotation in degrees between 0 and 360.
 */
export const ANGLE_FIELD: AngleField;
/**
 * Property type: `number`
 * Constructor type: `number | null | undefined`
 * Default: `360`
 */
interface AngleField extends DocumentField<number> {
  type: typeof Number;
  required: true;
  nullable: false;
  default: 360;
  clean: (n: unknown) => number;
  validate: (n: number) => boolean;
  validationError: '{name} {field} "{value}" is not a number between 0 and 360';
}

/**
 * A required numeric field which represents a uniform number between 0 and 1.
 */
export const ALPHA_FIELD: AlphaField;
/**
 * Property type: `number`
 * Constructor type: `number | null | undefined`
 * Default: `1`
 */
interface AlphaField extends DocumentField<number> {
  type: typeof Number;
  required: true;
  nullable: false;
  default: 1;
  validate: (n: number) => boolean;
  validationError: '{name} {field} "{value}" is not a number between 0 and 1';
}

/**
 * A string field which requires a non-blank value and may not be null.
 */
export const REQUIRED_STRING: RequiredString;
/**
 * Property type: `string`
 * Constructor type: `string`
 */
interface RequiredString extends DocumentField<string> {
  type: typeof String;
  required: true;
  nullable: false;
  clean: <T>(v: T) => T extends undefined ? undefined : string;
}

/**
 * A string field which is required, but may be left blank as an empty string.
 */
export const BLANK_STRING: BlankString;
/**
 * Property type: `string`
 * Constructor type: `string | null | undefined`
 * Default: `""`
 */
interface BlankString extends DocumentField<string> {
  type: typeof String;
  required: true;
  nullable: false;
  clean: (v: unknown) => string;
  default: "";
}

/**
 * A field used for integer sorting of a Document relative to its siblings
 */
export const INTEGER_SORT_FIELD: IntegerSortField;
/**
 * Property type: `number`
 * Constructor type: `number | null | undefined`
 * Default: `0`
 */
interface IntegerSortField extends DocumentField<number> {
  type: typeof Number;
  required: true;
  default: 0;
  validate: typeof Number.isInteger;
  validationError: '{name} {field} "{value}" is not an integer';
}

/**
 * A numeric timestamp field which may be used in a Document.
 */
export const TIMESTAMP_FIELD: TimestampField;
/**
 * Property type: `number | undefined`
 * Constructor type: `number | null | undefined`
 * Default: `Date.now()`
 */
interface TimestampField extends DocumentField<number> {
  type: typeof Number;
  required: false;
  default: typeof Date.now;
  nullable: false;
}

/**
 * Validate that the ID of a Document object is either null (not yet saved) or a valid string.
 * @param id - The _id to test
 * @returns Is it valid?
 */
declare function _validateId(id: string | null): boolean;

/**
 * The standard identifier for a Document.
 */
export const DOCUMENT_ID: DocumentId;
/**
 * Property type: `string | null`
 * Constructor type: `string | null | undefined`
 * Default: `null`
 */
interface DocumentId extends DocumentField<string | null> {
  type: typeof String;
  required: true;
  default: null;
  nullable: false;
  validate: typeof _validateId;
  validationError: '{name} {field} "{value}" is not a valid document ID string';
}

/**
 * The standard permissions object which may be included by a Document.
 */
export const DOCUMENT_PERMISSIONS: DocumentPermissions;
/**
 * Property type: `Partial<Record<string, DOCUMENT_PERMISSION_LEVELS>>`
 * Constructor type: `Partial<Record<string, DOCUMENT_PERMISSION_LEVELS>> | null | undefined`
 * Default: `{ default: DOCUMENT_PERMISSION_LEVELS.NONE }`
 */
interface DocumentPermissions extends DocumentField<Partial<Record<string, DOCUMENT_PERMISSION_LEVELS>>> {
  type: typeof Object;
  required: true;
  nullable: false;
  default: { default: typeof DOCUMENT_PERMISSION_LEVELS.NONE };
  validate: typeof _validatePermissions;
  validationError: '{name} {field} "{value}" is not a mapping of user IDs and document permission levels';
}

/**
 * Validate the structure of the permissions object: all keys are valid IDs and all values are permission levels
 * @param perms - The provided permissions object
 * @returns Is the object valid?
 */
declare function _validatePermissions(perms: object): boolean;

interface ForeignDocumentFieldOptions {
  type: {
    readonly documentName: string;
  };
  required?: boolean;
  nullable?: boolean;
  default?: any;
}

/**
 * Create a foreign key field which references a primary Document id
 */
export function foreignDocumentField<T extends ForeignDocumentFieldOptions>(options: T): ForeignDocumentField<T>;
/**
 * Default config:
 * ```
 * {
 *   type: String,
 *   required: false,
 *   nullable: true,
 *   default: null
 * }
 * ```
 * With default config:
 * Property type: `string | null`
 * Constructor type: `ForeignDocument | string | null | undefined`
 * Default: `null`
 */
interface ForeignDocumentField<T extends ForeignDocumentFieldOptions> extends DocumentField<string | null> {
  type: typeof String;
  required: T extends {
    required: true;
  }
    ? true
    : false;
  nullable: T extends {
    nullable?: true;
  }
    ? true
    : T extends {
        nullable: false;
      }
    ? false
    : boolean;
  default: T extends {
    default: infer U;
  }
    ? U
    : null;
  clean: (d: unknown) => string | null;
  validate: typeof _validateId;
  validationError: `{name} {field} "{value}" is not a valid ${T["type"]["documentName"]} id`;
}

interface EmbeddedCollectionFieldOptions {
  required?: boolean;
  default?: any[];
}

/**
 * Create a special field which contains a Collection of embedded Documents
 * @param document - The Document class definition
 * @param options  - Additional field options
 *                   (default: `{}`)
 */
export function embeddedCollectionField<
  ConcreteDocumentConstructor extends { readonly documentName: string } & ConstructorOf<Document<any, any>>,
  Options extends EmbeddedCollectionFieldOptions
>(
  document: ConcreteDocumentConstructor,
  options?: Options
): EmbeddedCollectionField<ConcreteDocumentConstructor, Options>;
/**
 * Default config:
 * ```
 * {
 *   type: {
 *     [documentName]: DocumentConstructor
 *   },
 *   required: true,
 *   default: [],
 *   isCollection: true
 * }
 * ```
 * With default config:
 * Property type: `EmbeddedCollection<DocumentConstructor, ParentDocumentData>`
 * Constructor type: `DocumentConstructorData[] | null | undefined`
 * Default: `new EmbeddedCollection(DocumentData, [], DocumentConstructor)`
 */
// TODO: Improve
interface EmbeddedCollectionField<
  ConcreteDocumentConstructor extends ConstructorOf<Document<any, any>>,
  Options extends EmbeddedCollectionFieldOptions = {}
> extends DocumentField<any> {
  type: Partial<Record<string, ConcreteDocumentConstructor>>;
  required: Options extends { required?: true } ? true : Options extends { required: false } ? false : boolean;
  default: Options extends { default?: Array<infer U> } ? Array<U> : unknown[];
  isCollection: true;
}

/**
 * A special field which contains a data object defined from the game System model.
 * @param document - The Document class definition
 */
export function systemDataField<
  DocumentSpecifier extends { readonly documentName: keyof Game.SystemData<any>["model"] }
>(document: DocumentSpecifier): SystemDataField;
/**
 * Default config:
 * ```
 * {
 *   type: Object,
 *   required: true,
 *   default: object // template object of object type from template.json
 * }
 * ```
 * Property type: `object`
 * Constructor type: `object | null | undefined`
 * Default: `{}`
 */
// TODO: Improve
interface SystemDataField extends DocumentField<any> {
  type: typeof Object;
  default: (data: { type?: string }) => Record<string, Record<string, unknown>>;
  required: true;
}

/**
 * Return a document field which is a modification of a static field type
 */
export function field<T extends DocumentField<any>, U extends Partial<DocumentField<any>>>(
  field: T,
  options?: U
): FieldReturnType<T, U>;
