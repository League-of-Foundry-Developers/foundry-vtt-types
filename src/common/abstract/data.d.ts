import Document from './document';
import EmbeddedCollection from './embeddedCollection';
import { PropertyTypeToSourceParameterType } from './helperTypes';

declare global {
  /**
   * A schema entry which describes a field of DocumentData
   */
  interface DocumentField<T> {
    /**
     * An optional cleaning function which sanitizes input data to this field
     */
    clean?: (input: unknown) => T;

    collection?: boolean;

    /**
     * A static default value or a function which assigns a default value
     */
    default?: PropertyTypeToSourceParameterType<T> | ((data?: object) => T);

    /**
     * Is the field an embedded Document collection?
     */
    isCollection?: boolean;

    /**
     * Can the field be populated by a null value? Default is true.
     */
    nullable?: boolean;

    /**
     * Is this field required to have an assigned value? Default is false.
     */
    required: boolean;

    /**
     * An object which defines the data type of this field
     */
    type: object;

    /**
     * A function which asserts that the value of this field is valid
     */
    validate?: (value: T) => boolean;

    /**
     * An error message which is displayed if validation fails
     */
    validationError?: string;
  }

  /**
   * The schema of a Document
   */
  type DocumentSchema = Partial<Record<string, DocumentField<any>>>;
}

/**
 * An abstract pattern for a data object which is contained within every type of Document.
 */
declare abstract class DocumentData<
  ConcreteDocumentSchema extends DocumentSchema,
  SourceData extends object,
  ConcreteDocument extends Document<any, any> | null
> {
  /**
   * Define the data schema for documents of this type.
   */
  static get schema(): DocumentSchema;

  /**
   * Define the data schema for documents of this type.
   * The schema is populated the first time it is accessed and cached for future reuse.
   *
   * @remarks This method needs to be implemented by subclasses.
   */
  static defineSchema(): DocumentSchema;

  /**
   * Create a DocumentData instance using a provided serialized JSON string.
   * @param json - Serialized document data in string format
   * @returns constructed data instance
   */
  static fromJSON<ConcreteDocumentData extends DocumentData<any, any, any>>(
    this: ConcreteDocumentData,
    json: string
  ): ConcreteDocumentData;

  /**
   * Get the default value for a schema field, conditional on the provided data
   * @param field - The configured data field
   * @param data  - The provided data object
   * @returns The default value for the field
   */
  protected static _getFieldDefaultValue<ConcreteDocumentField extends DocumentField<any>>(
    field: ConcreteDocumentField,
    data: object
  ): ConcreteDocumentField extends { default?: undefined }
    ? undefined
    : ConcreteDocumentField extends { default: (data?: object) => infer V }
    ? V
    : ConcreteDocumentField['default'];

  /**
   *
   * @param data     - Initial data used to construct the data object
   *                   (default: `{}`)
   * @param document - The document to which this data object belongs
   *                   (default: `null`)
   */
  constructor(data?: DeepPartial<SourceData>, document?: ConcreteDocument | null);

  /**
   * The primary identifier for the Document to which this data object applies.
   * This identifier is unique within the parent collection which contains the Document.
   * @defaultValue `null`
   */
  _id: string | null;

  /**
   * The source data object. The contents of this object can be updated, but the object itself may not be replaced.
   */
  readonly _source: SourceData;

  /**
   * An immutable reverse-reference to the Document to which this data belongs, possibly null.
   */
  readonly document: ConcreteDocument | null;

  /**
   * Define the data schema for this document instance.
   */
  get schema(): DocumentSchema;

  /**
   * Reset the state of this data instance back to mirror the contained source data, erasing any changes.
   */
  reset(): void;

  /**
   * Extract the source data for the DocumentData into a simple object format that can be serialized.
   * @returns The document source data expressed as a plain object
   */
  toJSON(): ReturnType<this['toObject']>;

  /**
   * Copy and transform the DocumentData into a plain object.
   * Draw the values of the extracted object from the data source (by default) otherwise from its transformed values.
   * @param source - Draw values from the underlying data source rather than transformed values
   *                 (default: `true`)
   * @returns The extracted primitive object
   */
  // TODO: Do we need to address the case `source === false` explicitly?
  toObject(
    source?: boolean
  ): {
    [Key in keyof SourceData]: SourceData[Key] extends { toObject: (source?: boolean) => infer U }
      ? U
      : SourceData[Key];
  };

  /**
   * Update the data by applying a new data object. Data is compared against and merged with the existing data.
   * Updating data which already exists is strict - it must pass validation or else the update is rejected.
   * An object is returned which documents the set of changes which were applied to the original data.
   * @see foundry.utils.mergeObject
   * @param data    - New values with which to update the Data object
   *                  (default: `{}`)
   * @param options - Options which determine how the new data is merged
   *                  (default: `{}`)
   * @returns The changed keys and values which are different than the previous data
   */
  update<U>(
    data?: Expanded<U> extends DeepPartial<SourceData> ? U : DeepPartial<SourceData>,
    options?: UpdateOptions
  ): DeepPartial<U>;

  /**
   * Update an EmbeddedCollection using an array of provided document data
   * @param collection   - The EmbeddedCollection to update
   * @param documentData - An array of provided Document data
   * @param options      - Additional options which modify how the collection is updated
   *                       (default: `{}`)
   */
  updateCollection(
    collection: EmbeddedCollection<any>, // TODO: Improve
    documentData: DocumentData<any, any, any>[], // TODO: Improve
    options?: UpdateOptions
  ): void;

  /**
   * Validate the data contained in the document to check for type and content
   * This function throws an error if data within the document is not valid
   *
   * @param changes  - Only validate the keys of an object that was changed.
   * @param children - Validate the data of child embedded documents? Default is true.
   * @param clean    - Apply field-specific cleaning functions to the provided value.
   * @param replace  - Replace any invalid values with valid defaults? Default is false.
   * @param strict   - If strict, will throw errors for any invalid data. Default is false.
   * @returns An indicator for whether or not the document contains valid data
   */
  validate({
    changes,
    children,
    clean,
    replace,
    strict
  }: {
    changes: DeepPartial<SourceData>;
    children?: boolean;
    clean?: boolean;
    replace?: boolean;
    strict?: boolean;
  }): boolean;

  /**
   * Build and return the error message for an Invalid Field Value
   * @param name  - The named field that is invalid
   * @param field - The configured DocumentField from the Schema
   * @param value - The value that is invalid
   * @returns The error message
   */
  protected _getInvalidFieldValueErrorMessage(name: string, field: DocumentField<unknown>, value: unknown): string;

  /**
   * Build and return the error message for a Missing Field
   * @param name  - The named field that is missing
   * @param field - The configured DocumentField from the Schema
   * @returns The error message
   */
  protected _getMissingFieldErrorMessage(name: string, field: DocumentField<unknown>): string;
  /**
   * Initialize the instance by copying data from the source object to instance attributes.
   */
  protected _initialize(): void;

  /**
   * Initialize the source data object in-place
   */
  protected _initializeSource(data: DeepPartial<SourceData>): SourceData;

  /**
   * Initialize the value for a given data type
   * @param type  - The type of the data field
   * @param value - The un-initialized value
   * @returns The initialized value
   */
  protected _initializeType(type: undefined, value: unknown): void;
  protected _initializeType<Value extends object>(type: typeof Object, value: Value): Value;
  protected _initializeType<Type extends typeof String | typeof Number | typeof Boolean>(
    type: Type,
    value: ReturnType<Type> | Parameters<Type>[0]
  ): ReturnType<Type>;
  protected _initializeType<Value extends Array<any> | ConstructorParameters<typeof Array>>(
    type: typeof Array,
    value: Value
  ): Value extends Array<any> ? Value : Array<any>;
  protected _initializeType<Value extends number | string>(type: typeof Date, value: Value): number;
  protected _initializeType<Type extends ConstructorOf<Document<any, any>>>(
    type: Type,
    value: ConstructorParameters<Type>[0]
  ): InstanceType<Type>; // TODO: Actually this returns an instance of the subclass configured in CONFIG
  protected _initializeType<Type extends ConstructorOf<DocumentData<any, any, any>>>(
    type: Type,
    value: ConstructorParameters<Type>[0]
  ): InstanceType<Type>;

  /**
   * Jointly validate the overall document after each field has been individually validated.
   * Throw an Error if any issue is encountered.
   *
   * @remarks
   * The base implementation doesn't do anything. Supposedly, subclasses can implement their own validation here.
   */
  protected _validateDocument(): void;

  /**
   * Validate a single field in the data object.
   * Assert that required fields are present and that each value passes it's validator function if one is provided.
   * @param name     - The named field being validated
   * @param field    - The configured DocumentField from the Schema
   * @param value    - The current field value
   * @param children - Validate the data of child embedded documents? Default is true.
   */
  protected _validateField<Name extends keyof ConcreteDocumentSchema>(
    name: Name,
    field: ConcreteDocumentSchema[Name],
    value: unknown,
    { children }: { children?: true }
  ): void;
}

interface UpdateOptions {
  diff?: boolean;
  enforceTypes?: boolean;
  insertKeys?: boolean;
  insertValues?: boolean;
  recursive?: boolean;
}

export default DocumentData;
