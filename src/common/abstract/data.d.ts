import EmbeddedCollection from './embeddedCollection';

/**
 * A schema entry which describes a field of DocumentData
 */
export interface DocumentField<T> {
  /**
   * An object which defines the data type of this field
   */
  type: ConstructorOf<T>;

  /**
   * Is this field required to have an assigned value? Default is false.
   */
  required?: boolean;

  /**
   * Can the field be populated by a null value? Default is true.
   */
  nullable?: boolean;

  /**
   * A static default value or a function which assigns a default value
   */
  default?: T | (() => T);

  collection?: boolean;

  /**
   * An optional cleaning function which sanitizes input data to this field
   */
  clean?: (input: unknown) => T;

  /**
   * A function which asserts that the value of this field is valid
   */
  validate?: (value: T) => boolean;

  /**
   * An error message which is displayed if validation fails
   */
  validationError?: string;

  /**
   * Is the field an embedded Document collection?
   */
  isCollection?: boolean;
}

export type DocumentSchema = Partial<Record<string, DocumentField<any>>>;

/**
 * An abstract pattern for a data object which is contained within every type of Document.
 */
declare abstract class DocumentData {}

export default DocumentData;
