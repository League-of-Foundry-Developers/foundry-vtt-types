import * as CONST from '../constants.mjs';
import { hasImageExtension, isColorString, isJSON } from './validators.mjs';
import { Document } from '../abstract/module.mjs';
import { FieldReturnType } from '../../../types/helperTypes';

/**
 * A required boolean field which may be used in a Document.
 * @remarks
 * Property type: `boolean`
 * Constructor type: `boolean | undefined | null`
 * Default: `false`
 */
export declare const BOOLEAN_FIELD: BooleanField;
interface BooleanField extends DocumentField<boolean> {
  type: typeof Boolean;
  required: true;
  default: false;
}

/**
 * A standard string color field which may be used in a Document.
 * @remarks
 * Property type: `string | undefined | null`
 * Constructor type: `string | undefined | null`
 */
export declare const COLOR_FIELD: ColorField;
interface ColorField extends DocumentField<string> {
  type: typeof String;
  required: false;
  nullable: true;
  validate: typeof isColorString;
  validationError: '{name} {field} "{value}" is not a valid hexadecimal color string';
}

/**
 * A standard string field for an image file path which may be used in a Document.
 * @remarks
 * Property type: `string | undefined | null`
 * Constructor type: `string | undefined | null`
 */
export declare const IMAGE_FIELD: ImageField;
interface ImageField extends DocumentField<string> {
  type: typeof String;
  required: false;
  nullable: true;
  validate: typeof hasImageExtension;
  validationError: '{name} {field} "{value}" does not have a valid image file extension';
}

/**
 * A standard string field for a video or image file path may be used in a Document.
 * @remarks
 * Property type: `string | undefined | null`
 * Constructor type: `string | undefined | null`
 */
export declare const VIDEO_FIELD: VideoField;
interface VideoField extends DocumentField<string> {
  type: typeof String;
  required: false;
  nullable: true;
  validate: (src: string | null) => boolean;
  validationError: '{name} {field} "{value}" does not have a valid image or video file extension';
}

/**
 * A standard string field for an audio file path which may be used in a Document.
 * @remarks
 * Property type: `string | undefined | null`
 * Constructor type: `string | undefined | null`
 */
export declare const AUDIO_FIELD: AudioField;
interface AudioField extends DocumentField<string> {
  type: typeof String;
  required: false;
  nullable: true;
  validate: (src: string | null) => boolean;
  validationError: '{name} {field} "{value}" does not have a valid audio file extension';
}

/**
 * A standard integer field which may be used in a Document.
 * @remarks
 * Property type: `number | undefined`
 * Constructor type: `number | undefined | null`
 */
export declare const INTEGER_FIELD: IntegerField;
interface IntegerField extends DocumentField<number> {
  type: typeof Number;
  required: false;
  validate: typeof Number.isInteger;
  validationError: '{name} {field} "{value}" does not have an integer value';
}

/**
 * A string field which contains serialized JSON data that may be used in a Document.
 * @remarks
 * Property type: `string | undefined`
 * Constructor type: `string | object | undefined | null`
 */
export declare const JSON_FIELD: JSONField;
interface JSONField extends DocumentField<string> {
  type: typeof String;
  required: false;
  clean: (s: unknown) => string;
  validate: typeof isJSON;
  validationError: '{name} {field} "{value}" is not a valid JSON string';
}

/**
 * A non-negative integer field which may be used in a Document.
 * @remarks
 * Property type: `number | undefined`
 * Constructor type: `number | undefined | null`
 */
export declare const NONNEGATIVE_INTEGER_FIELD: NonnegativeIntegerField;
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
 * @remarks
 * Property type: `number | undefined`
 * Constructor type: `number | undefined | null`
 */
export declare const POSITIVE_INTEGER_FIELD: PositiveIntegerField;
interface PositiveIntegerField extends DocumentField<number> {
  type: typeof Number;
  required: false;
  validate: (n: unknown) => boolean;
  validationError: '{name} {field} "{value}" does not have an non-negative integer value';
}

/**
 * A template for a required inner-object field which may be used in a Document.
 * @remarks
 * Property type: `object`
 * Constructor type: `object | undefined | null`
 * Default `{}`
 */
export declare const OBJECT_FIELD: ObjectField;
interface ObjectField extends DocumentField<object> {
  type: typeof Object;
  default: {};
  required: true;
}

/**
 * An optional string field which may be included by a Document.
 * @remarks
 * Property type: `string | undefined`
 * Constructor type: `string | undefined | null`
 */
export declare const STRING_FIELD: StringField;
interface StringField extends DocumentField<string> {
  type: typeof String;
  required: false;
  nullable: false;
}

/**
 * An optional numeric field which may be included in a Document.
 * @remarks
 * Property type: `number | undefined | null`
 * Constructor type: `number | undefined | null`
 */
export declare const NUMERIC_FIELD: NumericField;
interface NumericField extends DocumentField<number> {
  type: typeof Number;
  required: false;
  nullable: true;
}

/**
 * A required numeric field which may be included in a Document and may not be null.
 * @remarks
 * Property type: `number`
 * Constructor type: `number | undefined | null`
 * Default: `0`
 */
export declare const REQUIRED_NUMBER: RequiredNumber;
interface RequiredNumber extends DocumentField<number> {
  type: typeof Number;
  required: true;
  nullable: false;
  default: 0;
}

/**
 * A required numeric field which must be a positive finite value that may be included in a Document.
 * @remarks
 * Property type: `number`
 * Constructor type: `number`
 */
export declare const REQUIRED_POSITIVE_NUMBER: RequiredPositiveNumber;
interface RequiredPositiveNumber extends DocumentField<number> {
  type: typeof Number;
  required: true;
  nullable: false;
  validate: (n: unknown) => boolean;
  validationError: '{name} {field} "{value}" is not a positive number';
}

/**
 * A required numeric field which represents an angle of rotation in degrees between 0 and 360.
 * @remarks
 * Property type: `number`
 * Constructor type: `number | undefined | null`
 * Default: `360`
 */
export declare const ANGLE_FIELD: AngleField;
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
 * @remarks
 * Property type: `number`
 * Constructor type: `number | undefined | null`
 * Default: `1`
 */
export declare const ALPHA_FIELD: AlphaField;
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
 * @remarks
 * Property type: `string`
 * Constructor type: `string`
 */
export declare const REQUIRED_STRING: RequiredString;
interface RequiredString extends DocumentField<string> {
  type: typeof String;
  required: true;
  nullable: false;
  clean: <T>(v: T) => T extends undefined ? undefined : string;
}

/**
 * A string field which is required, but may be left blank as an empty string.
 * @remarks
 * Property type: `string`
 * Constructor type: `string | undefined | null`
 * Default: `''`
 */
export declare const BLANK_STRING: BlankString;
interface BlankString extends DocumentField<string> {
  type: typeof String;
  required: true;
  nullable: false;
  clean: (v: unknown) => string;
  default: '';
}

/**
 * A field used for integer sorting of a Document relative to its siblings
 * @remarks
 * Property type: `number`
 * Constructor type: `number | undefined | null`
 * Default: `0`
 */
export declare const INTEGER_SORT_FIELD: IntegerSortField;
interface IntegerSortField extends DocumentField<number> {
  type: typeof Number;
  required: true;
  default: 0;
  validate: typeof Number.isInteger;
  validationError: '{name} {field} "{value}" is not an integer';
}

/**
 * A numeric timestamp field which may be used in a Document.
 * @remarks
 * Property type: `number | undefined`
 * Constructor type: `number | undefined | null`
 * Default: `Date.now`
 */
export declare const TIMESTAMP_FIELD: TimestampField;
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
 * @remarks
 * Property type: `string | null`
 * Constructor type: `string | undefined | null`
 * Default: `null`
 */
export declare const DOCUMENT_ID: DocumentId;
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
 * @remarks
 * Property type: `Partial<Record<string, foundry.CONST.EntityPermission>>`
 * Constructor type: `Partial<Record<string, foundry.CONST.EntityPermission>> | undefined | null`
 * Default: `{ default: CONST.ENTITY_PERMISSIONS.NONE }`
 */
export declare const DOCUMENT_PERMISSIONS: DocumentPermissions;
interface DocumentPermissions extends DocumentField<Partial<Record<string, foundry.CONST.EntityPermission>>> {
  type: typeof Object;
  required: true;
  nullable: false;
  default: { default: typeof CONST.ENTITY_PERMISSIONS.NONE };
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
export declare function foreignDocumentField<T extends ForeignDocumentFieldOptions>(
  options: T
): ForeignDocumentField<T>;
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
export declare function embeddedCollectionField<
  ConcreteDocumentConstructor extends { readonly documentName: string } & ConstructorOf<Document<any, any>>,
  Options extends EmbeddedCollectionFieldOptions
>(
  document: ConcreteDocumentConstructor,
  options?: Options
): EmbeddedCollectionField<ConcreteDocumentConstructor, Options>;
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
 * Return a document field which is a modification of a static field type
 */
export declare function field<T extends DocumentField<any>, U extends Partial<DocumentField<any>>>(
  field: T,
  options?: U
): FieldReturnType<T, U>;
