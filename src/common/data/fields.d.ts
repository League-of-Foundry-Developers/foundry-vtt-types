import * as CONST from '../constants';
import { hasImageExtension, isColorString, isJSON } from './validators';
import { Document } from '../abstract/module';
import { FieldReturnType } from '../abstract/helperTypes';

interface BooleanField extends DocumentField<boolean> {
  type: typeof Boolean;
  required: true;
  default: false;
}

/**
 * A required boolean field which may be used in a Document.
 */
export declare const BOOLEAN_FIELD: BooleanField;

interface ColorField extends DocumentField<string> {
  type: typeof String;
  required: false;
  nullable: true;
  validate: typeof isColorString;
  validationError: '{name} {field} "{value}" is not a valid hexadecimal color string';
}

/**
 * A standard string color field which may be used in a Document.
 */
export declare const COLOR_FIELD: ColorField;

interface ImageField extends DocumentField<string> {
  type: typeof String;
  required: false;
  nullable: true;
  validate: typeof hasImageExtension;
  validationError: '{name} {field} "{value}" does not have a valid image file extension';
}

/**
 * A standard string field for an image file path which may be used in a Document.
 */
export declare const IMAGE_FIELD: ImageField;

interface VideoField extends DocumentField<string> {
  type: typeof String;
  required: false;
  nullable: true;
  validate: (src: string | null) => boolean;
  validationError: '{name} {field} "{value}" does not have a valid image or video file extension';
}

/**
 * A standard string field for a video or image file path may be used in a Document.
 */
export declare const VIDEO_FIELD: VideoField;

interface AudioField extends DocumentField<string> {
  type: typeof String;
  required: false;
  nullable: true;
  validate: (src: string | null) => boolean;
  validationError: '{name} {field} "{value}" does not have a valid audio file extension';
}

/**
 * A standard string field for an audio file path which may be used in a Document.
 */
export declare const AUDIO_FIELD: AudioField;

interface IntegerField extends DocumentField<number> {
  type: typeof Number;
  required: false;
  validate: typeof Number.isInteger;
  validationError: '{name} {field} "{value}" does not have an integer value';
}

/**
 * A standard integer field which may be used in a Document.
 */
export declare const INTEGER_FIELD: IntegerField;

interface JSONField extends DocumentField<string> {
  type: typeof String;
  required: false;
  clean: (s: unknown) => string;
  validate: typeof isJSON;
  validationError: '{name} {field} "{value}" is not a valid JSON string';
}

/**
 * A string field which contains serialized JSON data that may be used in a Document.
 */
export declare const JSON_FIELD: JSONField;

interface NonnegativeIntegerField extends DocumentField<number> {
  type: typeof Number;
  required: false;
  validate: (n: unknown) => boolean;
  validationError: '{name} {field} "{value}" does not have an non-negative integer value';
}

/**
 * A non-negative integer field which may be used in a Document.
 */
export declare const NONNEGATIVE_INTEGER_FIELD: NonnegativeIntegerField;

interface PositiveIntegerField extends DocumentField<number> {
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
export declare const POSITIVE_INTEGER_FIELD: PositiveIntegerField;

interface ObjectField extends DocumentField<object> {
  type: typeof Object;
  default: {};
  required: true;
}

/**
 * A template for a required inner-object field which may be used in a Document.
 */
export declare const OBJECT_FIELD: ObjectField;

interface StringField extends DocumentField<string> {
  type: typeof String;
  required: false;
  nullable: false;
}

/**
 * An optional string field which may be included by a Document.
 */
export declare const STRING_FIELD: StringField;

interface NumericField extends DocumentField<number> {
  type: typeof Number;
  required: false;
  nullable: true;
}

/**
 * An optional numeric field which may be included in a Document.
 */
export declare const NUMERIC_FIELD: NumericField;

interface RequiredNumber extends DocumentField<number> {
  type: typeof Number;
  required: true;
  nullable: false;
  default: 0;
}

/**
 * A required numeric field which may be included in a Document and may not be null.
 */
export declare const REQUIRED_NUMBER: RequiredNumber;

interface RequiredPositiveNumber extends DocumentField<number> {
  type: typeof Number;
  required: true;
  nullable: false;
  validate: (n: unknown) => boolean;
  validationError: '{name} {field} "{value}" is not a positive number';
}

/**
 * A required numeric field which must be a positive finite value that may be included in a Document.
 */
export declare const REQUIRED_POSITIVE_NUMBER: RequiredPositiveNumber;

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
 * A required numeric field which represents an angle of rotation in degrees between 0 and 360.
 */
export declare const ANGLE_FIELD: AngleField;

interface AlphaField extends DocumentField<number> {
  type: typeof Number;
  required: true;
  nullable: false;
  default: 1;
  validate: (n: number) => boolean;
  validationError: '{name} {field} "{value}" is not a number between 0 and 1';
}

/**
 * A required numeric field which represents a uniform number between 0 and 1.
 */
export declare const ALPHA_FIELD: AlphaField;

interface RequiredString extends DocumentField<string> {
  type: typeof String;
  required: true;
  nullable: false;
  clean: (v: unknown) => string; // TODO: may also return undefined?
}

/**
 * A string field which requires a non-blank value and may not be null.
 */
export declare const REQUIRED_STRING: RequiredString;

interface BlankString extends DocumentField<string> {
  type: typeof String;
  required: true;
  nullable: false;
  clean: (v: unknown) => string;
  default: '';
}

/**
 * A string field which is required, but may be left blank as an empty string.
 */
export declare const BLANK_STRING: BlankString;

interface IntegerSortField extends DocumentField<number> {
  type: typeof Number;
  required: true;
  default: 0;
  validate: typeof Number.isInteger;
  validationError: '{name} {field} "{value}" is not an integer';
}

/**
 * A field used for integer sorting of a Document relative to its siblings
 */
export declare const INTEGER_SORT_FIELD: IntegerSortField;

interface TimestampField extends DocumentField<number> {
  type: typeof Number;
  required: false;
  default: typeof Date.now;
  nullable: false;
}

/**
 * A numeric timestamp field which may be used in a Document.
 */
export declare const TIMESTAMP_FIELD: TimestampField;

/**
 * Validate that the ID of a Document object is either null (not yet saved) or a valid string.
 * @param id - The _id to test
 * @returns Is it valid?
 */
declare function _validateId(id: string | null): boolean;

interface DocumentId extends DocumentField<string | null> {
  type: typeof String;
  required: true;
  default: null;
  nullable: false;
  validate: typeof _validateId;
  validationError: '{name} {field} "{value}" is not a valid document ID string';
}

/**
 * The standard identifier for a Document.
 */
export declare const DOCUMENT_ID: DocumentId;

interface DocumentPermissions extends DocumentField<Partial<Record<string, ValueOf<typeof CONST.ENTITY_PERMISSIONS>>>> {
  type: typeof Object;
  required: true;
  nullable: false;
  default: { default: typeof CONST.ENTITY_PERMISSIONS.NONE };
  validate: typeof _validatePermissions;
  validationError: '{name} {field} "{value}" is not a mapping of user IDs and document permission levels';
}

/**
 * The standard permissions object which may be included by a Document.
 */
export declare const DOCUMENT_PERMISSIONS: DocumentPermissions;

/**
 * Validate the structure of the permissions object: all anykeys are valid IDs and all values are permission levels
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
  validationError: `{name} {field} "{value}" is not a valid ${T['type']['documentName']} id`;
}

/**
 * Create a foreign key field which references a primary Document id
 */
export declare function foreignDocumentField<T extends ForeignDocumentFieldOptions>(
  options: T
): ForeignDocumentField<T>;

interface EmbeddedCollectionFieldOptions {
  required?: boolean;
  default?: any[];
}

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
 * Create a special field which contains a Collection of embedded Documents
 * @param document - The Document class definition
 * @param options  - Additional field options
 *                   (default: `{}`)
 */
export declare function embeddedCollectionField<
  ConcreteDocumentConstructor extends { readonly documentName: string } & ConstructorOf<Document<any, any>>,
  Options extends EmbeddedCollectionFieldOptions
>(
  document: ConcreteDocumentConstructor,
  options?: Options
): EmbeddedCollectionField<ConcreteDocumentConstructor, Options>;

/**
 * Return a document field which is a modification of a static field type
 */
export declare function field<T extends DocumentField<any>, U extends Partial<DocumentField<any>>>(
  field: T,
  options?: U
): FieldReturnType<T, U>;
