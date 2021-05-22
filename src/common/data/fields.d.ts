import * as CONST from '../constants';
import { hasImageExtension, isColorString, isJSON } from './validators';
import { Document } from '../abstract/module';
import { FieldReturnType } from '../abstract/helperTypes';

interface BooleanField extends DocumentField<boolean> {
  default: false;
  required: true;
  type: typeof Boolean;
}

/**
 * A required boolean field which may be used in a Document.
 */
export declare const BOOLEAN_FIELD: BooleanField;

interface ColorField extends DocumentField<string> {
  nullable: true;
  required: false;
  type: typeof String;
  validate: typeof isColorString;
  validationError: '{name} {field} field must be a valid CSS color string';
}

/**
 * A standard string color field which may be used in a Document.
 */
export declare const COLOR_FIELD: ColorField;

interface ImageField extends DocumentField<string> {
  nullable: true;
  required: false;
  type: typeof String;
  validate: typeof hasImageExtension;
  validationError: 'The provided {name} {field} field does not have a valid image file extension';
}

/**
 * A standard string field for an image file path which may be used in a Document.
 */
export declare const IMAGE_FIELD: ImageField;

interface VideoField extends DocumentField<string> {
  nullable: true;
  required: false;
  type: typeof String;
  validate: (src: string | null) => boolean;
  validationError: 'The provided {name} {field} field does not have a valid image or video file extension';
}

/**
 * A standard string field for a video or image file path may be used in a Document.
 */
export declare const VIDEO_FIELD: VideoField;

interface AudiField extends DocumentField<string> {
  nullable: true;
  required: false;
  type: typeof String;
  validate: (src: string | null) => boolean;
  validationError: 'The provided {name} {field} field does not have a valid audio file extension';
}

/**
 * A standard string field for an audio file path which may be used in a Document.
 */
export declare const AUDIO_FIELD: AudiField;

interface IntegerField extends DocumentField<number> {
  required: false;
  type: typeof Number;
  validate: typeof Number.isInteger;
  validationError: 'The provided {name} {field} field does not have an integer value';
}

/**
 * A standard integer field which may be used in a Document.
 */
export declare const INTEGER_FIELD: IntegerField;

interface JSONField extends DocumentField<string> {
  clean: (s: unknown) => string;
  required: false;
  type: typeof String;
  validate: typeof isJSON;
  validationError: 'The provided {name} {field} field is not a valid JSON string';
}

/**
 * A string field which contains serialized JSON data that may be used in a Document.
 */
export declare const JSON_FIELD: JSONField;

interface NonnegativeIntegerField extends DocumentField<number> {
  required: false;
  type: typeof Number;
  validate: (n: unknown) => boolean;
  validationError: 'The provided {name} {field} field does not have an non-negative integer value';
}

/**
 * A non-negative integer field which may be used in a Document.
 */
export declare const NONNEGATIVE_INTEGER_FIELD: NonnegativeIntegerField;

interface PositiveIntegerField extends DocumentField<number> {
  required: false;
  type: typeof Number;
  validate: (n: unknown) => boolean;
  validationError: 'The provided {name} {field} field does not have an non-negative integer value';
}

/**
 * A non-negative integer field which may be used in a Document.
 *
 * @remarks The validation actually checks for `> 0`, the JSDoc is incorrect in foundry.
 */
export declare const POSITIVE_INTEGER_FIELD: PositiveIntegerField;

interface ObjectField extends DocumentField<object> {
  default: {};
  required: true;
  type: typeof Object;
}

/**
 * A template for a required inner-object field which may be used in a Document.
 */
export declare const OBJECT_FIELD: ObjectField;

interface StringField extends DocumentField<string> {
  nullable: false;
  required: false;
  type: typeof String;
}

/**
 * An optional string field which may be included by a Document.
 */
export declare const STRING_FIELD: StringField;

interface NumericField extends DocumentField<number> {
  nullable: true;
  required: false;
  type: typeof Number;
}

/**
 * An optional numeric field which may be included in a Document.
 */
export declare const NUMERIC_FIELD: NumericField;

interface RequiredNumber extends DocumentField<number> {
  default: 0;
  nullable: false;
  required: true;
  type: typeof Number;
}

/**
 * A required numeric field which may be included in a Document and may not be null.
 */
export declare const REQUIRED_NUMBER: RequiredNumber;

interface RequiredPositiveNumber extends DocumentField<number> {
  nullable: false;
  required: true;
  type: typeof Number;
  validate: (n: unknown) => boolean;
  validationError: 'Invalid {name} {field} which must be a positive number';
}

/**
 * A required numeric field which must be a positive finite value that may be included in a Document.
 */
export declare const REQUIRED_POSITIVE_NUMBER: RequiredPositiveNumber;

interface AngleField extends DocumentField<number> {
  clean: (n: unknown) => number;
  default: 360;
  nullable: false;
  required: true;
  type: typeof Number;
  validate: (n: number) => boolean;
  validationError: 'Invalid {name} {field} which must be a number between 0 and 360';
}

/**
 * A required numeric field which represents an angle of rotation in degrees between 0 and 360.
 */
export declare const ANGLE_FIELD: AngleField;

interface AlphaField extends DocumentField<number> {
  default: 1;
  nullable: false;
  required: true;
  type: typeof Number;
  validate: (n: number) => boolean;
  validationError: 'Invalid {name} {field} which must be a number between 0 and 1';
}

/**
 * A required numeric field which represents a uniform number between 0 and 1.
 */
export declare const ALPHA_FIELD: AlphaField;

interface RequiredString extends DocumentField<string> {
  clean: (v: unknown) => string; // TODO: may also return undefined?
  nullable: false;
  required: true;
  type: typeof String;
}

/**
 * A string field which requires a non-blank value and may not be null.
 */
export declare const REQUIRED_STRING: RequiredString;

interface BlankString extends DocumentField<string> {
  clean: (v: unknown) => string;
  default: '';
  nullable: false;
  required: true;
  type: typeof String;
}

/**
 * A string field which is required, but may be left blank as an empty string.
 */
export declare const BLANK_STRING: BlankString;

interface IntegerSortField extends DocumentField<number> {
  default: 0;
  required: true;
  type: typeof Number;
  validate: typeof Number.isInteger;
  validationError: 'The provided {name} {field} field does not have an integer value';
}

/**
 * A field used for integer sorting of a Document relative to its siblings
 */
export declare const INTEGER_SORT_FIELD: IntegerSortField;

interface TimestampField extends DocumentField<number> {
  default: typeof Date.now;
  nullable: false;
  required: false;
  type: typeof Number;
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
  default: null;
  nullable: false;
  required: true;
  type: typeof String;
  validate: typeof _validateId;
  validationError: 'Invalid value provided for {name} id';
}

/**
 * The standard identifier for a Document.
 */
export declare const DOCUMENT_ID: DocumentId;

interface DocumentPermissions extends DocumentField<Partial<Record<string, ValueOf<typeof CONST.ENTITY_PERMISSIONS>>>> {
  default: { default: typeof CONST.ENTITY_PERMISSIONS.NONE };
  nullable: false;
  required: true;
  type: typeof Object;
  validate: typeof _validatePermissions;
  validationError: 'Invalid data structure encountered for {name} permissions';
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

interface ForeignDocumentField<
  T extends {
    default?: any;
    nullable?: boolean;
    required?: boolean;
    type: {
      readonly documentName: string;
    };
  }
> extends DocumentField<string | null> {
  clean: (d: unknown) => string | null;
  default: T extends {
    default: infer U;
  }
    ? U
    : null;
  nullable: T extends {
    nullable?: true;
  }
    ? true
    : T extends {
        nullable: false;
      }
    ? false
    : boolean;
  required: T extends {
    required: true;
  }
    ? true
    : false;
  type: typeof String;
  validate: typeof _validateId;
  validationError: `Invalid {name} {field} which must be a ${T['type']['documentName']} document id`;
}

/**
 * Create a foreign key field which references a primary Document id
 */
export declare function foreignDocumentField<
  T extends {
    default?: any;
    nullable?: boolean;
    required?: boolean;
    type: { readonly documentName: string };
  }
>(options: T): ForeignDocumentField<T>;

// TODO: Improve
interface EmbeddedCollectionField<
  ConcreteDocumentConstructor extends ConstructorOf<Document<any, any>>,
  Options extends { default?: any[]; required?: boolean }
> extends DocumentField<any> {
  default: Options extends { default?: Array<infer U> } ? Array<U> : never;
  isCollection: true;
  required: Options extends { required?: true } ? true : Options extends { required: false } ? false : boolean;
  type: Partial<Record<string, ConcreteDocumentConstructor>>;
}

/**
 * Create a special field which contains a Collection of embedded Documents
 * @param document - The Document class definition
 * @param options  - Additional field options
 *                   (default: `{}`)
 */
export declare function embeddedCollectionField<
  ConcreteDocumentConstructor extends { readonly documentName: string } & ConstructorOf<Document<any, any>>,
  Options extends { default?: any[]; required?: boolean }
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
