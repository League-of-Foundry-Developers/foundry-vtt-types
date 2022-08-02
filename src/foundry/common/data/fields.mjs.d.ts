import { DOCUMENT_OWNERSHIP_LEVELS } from '../constants.mjs';
import DataModel, { DataSchema } from '../abstract/data.mjs';
import type {
  ConfiguredSource,
  ConfiguredData,
  DocumentConstructor,
  StructuralClass,
  SystemDocumentType
} from '../../../types/helperTypes.js';
import EmbeddedCollection from '../abstract/embedded-collection.mjs';
import type { Context } from '../abstract/document.mjs.js';

type InitialType<T> = T | null | undefined | ((initialData: unknown) => T | null | undefined);

export declare namespace DataField {
  export type RequiredOptions<T> = DataField.DefaultOptions<T> & {
    /** The name of this data field within the schema that contains it */
    name: string;

    /** A data validation function which accepts one argument with the current value. */
    validate(value: T): boolean | void;
  };

  export type Options<ExtendsOptions extends AnyExtendsOptions> = Partial<
    RequiredOptions<ExtendsOptions['SourceType']>
  > &
    ExtendsOptions['ExtraOptions'];

  export type DefaultOptions<T> = {
    /** Is this field required to be populated? */
    required: boolean;

    /** Can this field have null values? */
    nullable: boolean;

    /** Should the prepared value of the field be read-only, preventing it from being changed unless a change to the _source data is applied. */
    readonly: boolean;

    /** The initial value of a field, or a function which assigns that initial value. */
    initial: InitialType<T>;

    /** A localizable label displayed on forms which render this field. */
    label: string;

    /** Localizable help text displayed on forms which render this field. */
    hint: string;

    /** A custom validation error string. When displayed will be prepended with the document name, field name, and candidate value. */
    validationError: string;
  };

  export type FoundryDefaultOptions = {
    required: false;
    nullable: false;
    readonly: false;
    initial: undefined;
    label: '';
    hint: '';
    validationError: 'is not a valid value';
  };

  export type Any = DataField<any, any>;

  export type AnyConstructor = Pick<typeof DataField, keyof typeof DataField> & {
    new (...args: any): Any;
  };

  export type ApplyableProperties<
    Field extends DataField.Any,
    Options extends object,
    Result extends object
  > = keyof Field extends unknown
    ? Field[keyof Field] extends (options: Options) => Result
      ? keyof Field
      : never
    : never;

  export type InitialTypeFor<Field extends Any> = Field['initial'] extends () => infer R ? R : Field['initial'];

  export type InitializedTypeFor<Field extends Any> = InternalInitializedTypeFor<Field, ExtendsOptionsFor<Field>>;

  type InternalInitializedTypeFor<Field extends Any, ExtendsOptions extends AnyExtendsOptions> =
    | ExtendsOptions['InitializedType']
    | ExtraTypes<Field>;

  export type SourceTypeFor<Field extends Any> = ExpandDeep<InternalSourceTypeFor<Field, ExtendsOptionsFor<Field>>>;

  type InternalSourceTypeFor<Field extends Any, ExtendsOptions extends AnyExtendsOptions> =
    | Exclude<ExtendsOptions['SourceType'], undefined | null>
    | ExtraTypes<Field>;

  type ExtraTypes<Field extends Any> =
    | (false extends ('required' extends keyof Field ? Field['required'] : never) ? undefined : never)
    | (true extends ('nullable' extends keyof Field ? Field['nullable'] : never) ? null : never);

  export type OptionsFor<Field extends typeof DataField> = Field extends abstract new (...args: any[]) => DataField<
    infer Options,
    any
  >
    ? Options
    : never;

  // `infer Options` is required here as opposed to `any`.
  // The reason why is probably immensely cursed and related to structurally defining the class.
  export type ExtendsOptionsFor<Field extends Any> = Field extends DataField<infer Options, infer ExtendsOptions>
    ? ExtendsOptions
    : never;

  export type OptionalExtendsOptions = {
    InitializedType?: any;
    ValidateType?: any;
  };

  export type ExtendsOptions<
    SourceType extends JSONValue,
    DefaultOptionsValue extends DataField.DefaultOptions<SourceType> & InexactPartial<ExtraOptions>,
    ExtraOptions extends object = {},
    OptionalOptions extends OptionalExtendsOptions = {}
  > = {
    SourceType: SourceType;
    ExtraOptions: ExtraOptions;

    DefaultOptionsValue: DefaultOptionsValue;
  } & SimpleMerge<
    {
      InitializedType: SourceType;
      ValidateType: Error | undefined;
    },
    Pick<OptionalOptions, keyof OptionalExtendsOptions & keyof OptionalOptions>
  >;

  export type AnyExtendsOptions = ExtendsOptions<any, any, any, any>;
}

export declare abstract class DataField<
  Options extends DataField.Options<ExtendsOptions>,
  ExtendsOptions extends DataField.AnyExtendsOptions
> extends _InternalDataField<Options, ExtendsOptions> {
  constructor(options: Options);

  // This private property is added so that statements such as `X extends DataField<any, infer ExtendsOptions> ? ... : ...` can function correctly.
  // Essentially Typescript will infer the type parameter structurally by looking properties and because we're only using transforms of the type parameter it can't figure it out.
  // See:
  // - https://github.com/microsoft/TypeScript/issues/40796
  // - https://github.com/Microsoft/TypeScript/wiki/FAQ#why-doesnt-type-inference-work-on-this-interface-interface-foot--
  #extendsOptions: ExtendsOptions;

  /**
   * Default parameters for this field type
   *
   * @remarks To get type and runtime characteristics synced your implementation's return value and type MUST be synced up with `ExtendsOptions`.
   * If your implementation looks like this:
   * ```ts
   * class SomeField<
   *   Options extends DataField.Options<ExtendsOptions>,
   *   ExtendsOptions extends DataField.AnyExtendsOption
   * > {
   *   protected static get _defaults(): DefaultOptions {
   *     return mergeObject(super._defaults, {
   *       readonly: true,
   *       initial: "foo",
   *       exampleProp: "abc"
   *     });
   *   }
   * }
   * ```
   * `ExtendsOptions` should be `DataField.ExtendsOptions<{}>`
   * `ExtraOptions` should be `{ exampleProp: string }`
   * `DefaultOptionsValue` should be `SimpleMerge<DataField.FoundryDefaultOptions, { readonly: true, initial: "foo", exampleProp: "abc" }>`
   * `DefaultOptions` should be `SimpleMerge<DataField.DefaultOptions<T>, {}>`
   */
  protected static get _defaults(): DataField.DefaultOptions<unknown>;

  //   /**
  //    * Apply a function to this DataField which propagates through recursively to any contained data schema.
  //    * @param fn - The function to apply
  //    * @param value - The current value of this field
  //    * @returns The results object
  //    */
  //   apply<Result extends Record<string, never>>(
  //     fn: DataField.ApplyableProperties<this, {}, Result> | ((options: {}) => Result),
  //     value: DataField.InternalInitializedTypeFor<this, ExtendsOptions>
  //   ): Result;

  //   /**
  //    * {@inheritdoc}
  //    *
  //    * @param options - Additional options passed to the applied function
  //    */
  //   apply<Result extends Record<string, unknown>, Options extends Record<string, unknown>>(
  //     fn: DataField.ApplyableProperties<this, Options, Result> | ((options: Options) => Result),
  //     value: DataField.InternalSourceTypeFor<this, ExtendsOptions>,
  //     options: Options
  //   ): Result;

  // Data has the same type as DataModel.cleanData's source
  /**
   * Coerce source data to ensure that it conforms to the correct data type for the field.
   * Data coercion operations should be simple and synchronous as these are applied whenever a DataModel is constructed.
   * For one-off cleaning of user-provided input the sanitize method should be used.
   * @param value - The initial value
   * @param data - The source data object
   * @param options - Additional options for how the field is cast
   * @returns - The cast value
   */
  clean(
    value: unknown,
    data: Record<string, unknown>,
    options: Record<string, unknown>
  ): DataField.InternalSourceTypeFor<this, ExtendsOptions>;

  //   abstract _cast(value: unknown): DataField.SourceTypeFor<this>;

  /**
   * Attempt to retrieve a valid initial value for the DataField.
   * @param data - The source data object for which an initial value is required
   * @returns - A valid initial value
   * @throws - An error if there is no valid initial value defined
   */
  getInitialValue(data: Record<string, unknown>): DataField.InitialTypeFor<this>;

  /**
   * Validate a candidate input for this field, ensuring it meets the field requirements.
   * A validation failure can be provided as a raised Error (with a string message) or by returning false.
   * A validator which returns true denotes that the result is certainly valid and further validations are unnecessary.
   * @param value - The initial value
   * @param options - Options which affect validation behavior
   * @returns - An Error instance if the value is not valid
   */
  validate(
    value: DataField.InternalInitializedTypeFor<this, ExtendsOptions>,
    options: Record<string, unknown>
  ): ExtendsOptions['ValidateType'];

  /**
   * Special validation rules which supersede regular field validation.
   * This validator screens for certain values which are otherwise incompatible with this field like null or undefined.
   * @param value - The candidate value
   * @returns - A boolean to indicate with certainty whether the value is valid. Otherwise, return void.
   * @throws - May throw a specific error if the value is not valid
   */
  protected _validateSpecial(value: DataField.InternalInitializedTypeFor<this, ExtendsOptions>): boolean | void;

  /**
   * A default type-specific validator that can be overridden by child classes
   * @param value - The candidate value
   * @returns - A boolean to indicate with certainty whether the value is valid. Otherwise, return void.
   * @throws - May throw a specific error if the value is not valid
   */
  protected _validateType(value: DataField.InternalInitializedTypeFor<this, ExtendsOptions>): boolean | void;

  //   /**
  //    * Initialize the original source data into a mutable copy for the DataModel instance.
  //    * @param model - The DataModel instance that this field belongs to
  //    * @param name - The field name of this instance within the model
  //    * @param value - The source value of the field
  //    * @returns - An initialized copy of the source data
  //    */
  //   initialize(
  //     model: DataModel.Any,
  //     name: string,
  //     value: DataField.SourceTypeFor<this>
  //   ): DataField.InternalInitializedTypeFor<this, ExtendsOptions>;

  /**
   * Export the current value of the field into a serializable object.
   * @param model - The DataModel instance that this field belongs to
   * @param name - The field name of this instance within the model
   * @param value - The initialized value of the field
   * @returns - An exported representation of the field
   */
  toObject(
    model: DataModel.Any,
    name: string,
    value: DataField.InternalInitializedTypeFor<this, ExtendsOptions>
  ): DataField.InternalSourceTypeFor<this, ExtendsOptions>;
}

type JSONValue = object | number | string | boolean | null | undefined;

// `_InternalDataField` exists so that on `DataField` the extra generic parameters are not visible.
// These generic parameter to do the calculations seems to HAVE to exist to work around extremely buggy behavior between forms that should be equivalent;
// - `new () => ...`
// - `new <_Computation = ...>() => _Computation`

// @ts-expect-error subclassing StructuralClass gives an error
declare class _InternalDataField<
  Options extends DataField.Options<ExtendsOptions>,
  ExtendsOptions extends DataField.AnyExtendsOptions,
  // any should be eliminated because `RemoveIndex<any>` will not add the base properties and merging in `any` would make it too generic.
  _Options extends DataField.Options<ExtendsOptions> = RemoveIndex<
    IsAny<Options> extends true ? DataField.Options<ExtendsOptions> : Options
  >,
  _ExtendsOptions extends DataField.AnyExtendsOptions = RemoveIndex<
    IsAny<ExtendsOptions> extends true ? DataField.AnyExtendsOptions : ExtendsOptions
  >,
  _ComputedDataField extends Record<string, unknown> = {
    options: _Options;
    computed: SimpleMerge<_ExtendsOptions['DefaultOptionsValue'], Pick<_Options, RequiredProperties<_Options>>>;
  } & SimpleMerge<_ExtendsOptions['DefaultOptionsValue'], Pick<_Options, RequiredProperties<_Options>>>
> extends StructuralClass<_ComputedDataField> {}

type SimpleMerge<T, U> = Omit<T, keyof U> & U;

export namespace BooleanField {
  export type Type = boolean;

  export type DefaultOptionsValue = SimpleMerge<
    DataField.FoundryDefaultOptions,
    {
      required: true;
      nullable: false;
      initial: false;
    }
  >;

  export type ExtendsOptions = DataField.ExtendsOptions<BooleanField.Type, BooleanField.DefaultOptionsValue>;
}

/**
 * A subclass of [DataField]{@link DataField} which deals with boolean-typed data.
 */
export declare class BooleanField<
  Options extends DataField.Options<ExtendsOptions>,
  ExtendsOptions extends DataField.AnyExtendsOptions = BooleanField.ExtendsOptions
> extends DataField<Options, ExtendsOptions> {
  _cast(value: string | object | any): DataField.SourceTypeFor<this>;
}

export type DataFieldChoices<T> =
  | readonly T[]
  | {
      [option in Extract<T, string | number | symbol>]: string;
    }
  | (() => T[]);

export type DataFieldChoicesOptions<Choices extends DataFieldChoices<any>> = Choices extends unknown
  ? Choices extends () => readonly any[]
    ? ReturnType<Choices>[number]
    : Choices extends readonly any[]
    ? Choices[number]
    : keyof Choices
  : never;

export type ChoicesOptions<
  ExtendsOptions extends DataField.AnyExtendsOptions,
  Choices extends DataFieldChoices<any> | undefined
> = SimpleMerge<
  DataField.Options<ExtendsOptions>,
  CalculateChoicesMerge<
    [Choices] extends [undefined]
      ? 'choices' extends keyof ExtendsOptions['DefaultOptionsValue']
        ? ExtendsOptions['DefaultOptionsValue']['choices']
        : undefined
      : Choices
  >
>;

type CalculateChoicesMerge<Choices extends DataFieldChoices<any> | undefined> = Choices extends unknown
  ? Choices extends undefined
    ? { choices?: undefined }
    : {
        choices: Choices;
        initial?: InitialType<DataFieldChoicesOptions<Exclude<Choices, undefined>>>;
      }
  : never;

export namespace NumberField {
  export type Type = number;

  export type DefaultOptionsValue = SimpleMerge<
    DataField.FoundryDefaultOptions,
    {
      initial: null;
      nullable: true;
      min: undefined;
      max: undefined;
      step: undefined;
      integer: false;
      positive: false;
      choices: undefined;
    }
  >;

  export type ExtraOptions = Partial<{
    /** A minimum allowed value */
    min: number;

    /** A maximum allowed value */
    max: number;

    /** A permitted step size */
    step: number;

    /** Must the number be an integer? */
    integer: boolean;

    /** Must the number be positive? */
    positive: boolean;

    /** An array of values or an object of values/labels which represent allowed choices for the field. A function may be provided which dynamically returns the array of choices. */
    choices: DataFieldChoices<number>;
  }>;

  export type ExtendsOptions<Choices extends DataFieldChoices<NumberField.Type> | undefined> = SimpleMerge<
    DataField.ExtendsOptions<
      Choices extends undefined ? NumberField.Type : DataFieldChoicesOptions<Exclude<Choices, undefined>>,
      any,
      NumberField.ExtraOptions
    >,
    // We are purposefully violating an invariant here which is that DefaultOptionsValue.initial should be assignable to SourceType.
    // When `choices` is defined this is not always true.
    {
      // If choices are provided, the field should not be null by default
      DefaultOptionsValue: SimpleMerge<
        NumberField.DefaultOptionsValue,
        Choices extends undefined
          ? {}
          : {
              nullable: false;
            }
      >;
    }
  >;
}

export type CoalesceUnknown<T, D> = [unknown] extends [T] ? D : T;

/**
 * A subclass of [DataField]{@link DataField} which deals with number-typed data.
 */
export declare class NumberField<
  Options extends ChoicesOptions<ExtendsOptions, CoalesceUnknown<Choices, undefined>>,
  Choices extends DataFieldChoices<NumberField.Type> | undefined = Options['choices'],
  ExtendsOptions extends DataField.AnyExtendsOptions = NumberField.ExtendsOptions<CoalesceUnknown<Choices, undefined>>
> extends DataField<Options, ExtendsOptions> {
  constructor(options: Options & { choices?: Choices });

  _cast(value: any): DataField.SourceTypeFor<this>;

  /**
   * Test whether a provided value is a valid choice from the allowed choice set
   * @param value - The provided value
   * @returns - Is the choice valid?
   */
  #isValidChoice(value: DataField.SourceTypeFor<this>): boolean;
}

export namespace StringField {
  export type Type = string;

  export type DefaultOptionsValue = SimpleMerge<
    DataField.FoundryDefaultOptions,
    {
      initial: '';
      blank: true;
      trim: true;
      nullable: false;
      choices: undefined;
    }
  >;

  export type ExtraOptions = Partial<{
    /** Is the string allowed to be blank (empty)? */
    blank: boolean;

    /** Should any provided string be trimmed as part of cleaning? */
    trim: boolean;

    /** An array of values or an object of values/labels which represent allowed choices for the field. A function may be provided which dynamically returns the array of choices. */
    choices: DataFieldChoices<string>;
  }>;

  export type ExtendsOptions<Choices extends DataFieldChoices<StringField.Type> | undefined> = SimpleMerge<
    DataField.ExtendsOptions<
      Choices extends undefined ? StringField.Type : DataFieldChoicesOptions<Exclude<Choices, undefined>>,
      any,
      StringField.ExtraOptions
    >,
    {
      // If choices are provided, the field should not be null or blank by default
      DefaultOptionsValue: SimpleMerge<
        StringField.DefaultOptionsValue,
        Choices extends undefined
          ? {}
          : {
              nullable: false;
              blank: false;
            }
      >;
    }
  >;
}

/**
 * A subclass of [DataField]{@link DataField} which deals with string-typed data.
 */
export declare class StringField<
  Options extends ChoicesOptions<ExtendsOptions, CoalesceUnknown<Choices, undefined>>,
  Choices extends DataFieldChoices<StringField.Type> | undefined = Options['choices'],
  ExtendsOptions extends DataField.AnyExtendsOptions = StringField.ExtendsOptions<CoalesceUnknown<Choices, undefined>>
> extends DataField<Options, ExtendsOptions> {
  // This constructor overload is not a mistake. Yes `Options & { choices: Choices }` should be functionally equivalent to `Options`. However by explicitly including Choices in the type this seems to be enough to get Typescript to infer Choices concretely rather than always being EXACTLY `DataFieldChoices<StringField.Type> | undefined` when inferring.
  // See: https://tsplay.dev/N91BqN
  constructor(options: Options & { choices?: Choices });

  _cast(value: unknown): DataField.InternalSourceTypeFor<this, ExtendsOptions>;

  /**
   * Test whether a provided value is a valid choice from the allowed choice set
   * @param value - The provided value
   * @returns - Is the choice valid?
   */
  #isValidChoice(value: StringField.Type): boolean;
}

export declare namespace ObjectField {
  export type Type = Record<string, unknown>;

  export type DefaultOptionsValue = SimpleMerge<
    DataField.FoundryDefaultOptions,
    {
      required: true;
      nullable: false;
      initial: {};
    }
  >;

  export type ExtraOptions = {};

  export type ExtendsOptions = DataField.ExtendsOptions<Type, DefaultOptionsValue, ExtraOptions>;
}

/**
 * A subclass of [DataField]{@link DataField} which deals with object-typed data.
 */
export declare class ObjectField<
  Options extends DataField.Options<ExtendsOptions>,
  ExtendsOptions extends DataField.AnyExtendsOptions = ObjectField.ExtendsOptions
> extends DataField<Options, ExtendsOptions> {
  _cast(value: object): DataField.SourceTypeFor<this>;
}

export declare namespace ArrayField {
  export type DefaultOptionsValue = SimpleMerge<
    DataField.FoundryDefaultOptions,
    {
      required: true;
      nullable: false;
      initial: [];
    }
  >;

  export type ExtraOptions = {};

  export type AnyExtendsOptions = DataField.ExtendsOptions<any, any, any, any> & {
    InputElement: any;
  };
  export type ExtendsOptions<Element> = DataField.ExtendsOptions<Array<Element>, DefaultOptionsValue, ExtraOptions> & {
    InputElement: Element;
  };
}

type ArrayElement<T> = T extends (infer I)[] ? I : never;

/**
 * A subclass of [DataField]{@link DataField} which deals with array-typed data.
 */
export declare class ArrayField<
  InputElement extends ExtendsOptions['InputElement'],
  Options extends DataField.Options<ExtendsOptions>,
  ExtendsOptions extends ArrayField.AnyExtendsOptions = SimpleMerge<
    ArrayField.ExtendsOptions<DataField.Any>,
    {
      SourceType: Array<DataField.SourceTypeFor<InputElement>>;
      InitializedType: Array<DataField.InitializedTypeFor<InputElement>>;
    }
  >
> extends DataField<Options, ExtendsOptions> {
  constructor(element: InputElement, options: Options);

  /**
   * Validate the contained element type of the ArrayField
   * @param element - The type of Array element
   * @returns - The validated element type
   * @throws - An error if the element is not a valid type
   */
  protected static _validateElementType(element: unknown): void;

  _cast(
    value: ArrayElement<DataField.SourceTypeFor<this>> | DataField.SourceTypeFor<this>
  ): DataField.SourceTypeFor<this>;

  /**
   * Validate every element of the ArrayField
   * @param value   - The array to validate
   * @param options - Validation options
   * @returns - An array of element-specific errors
   */
  protected _validateElements(value: ExtendsOptions['InputElement'][], options: Record<string, unknown>): Error[];

  /** @override */
  //   override initialize(
  //     model: DataModel.Any,
  //     name: string,
  //     value: DataField.SourceTypeFor<this>
  //   ): ExtendsOptions['InitializedType'];

  /** @override */
  //   override toObject(
  //     model: DataModel.Any,
  //     name: string,
  //     value: ExtendsOptions['InitializedType']
  //   ): DataField.InternalSourceTypeFor<this, ExtendsOptions>;
}

export declare namespace SetField {
  export type DefaultOptionsValue = ArrayField.DefaultOptionsValue;
  export type ExtraOptions = ArrayField.ExtraOptions;
  export type AnyExtendsOptions = ArrayField.AnyExtendsOptions;
  export type ExtendsOptions<Element> = ArrayField.ExtendsOptions<Element>;
}

/**
 * A subclass of [ArrayField]{@link ArrayField} which supports a set of contained elements.
 * Elements in this set are treated as fungible and may be represented in any order or discarded if invalid.
 */
export declare class SetField<
  InputElement extends ExtendsOptions['InputElement'],
  Options extends DataField.Options<ExtendsOptions>,
  ExtendsOptions extends SetField.AnyExtendsOptions = SimpleMerge<
    SetField.ExtendsOptions<InputElement>,
    {
      InputElement: DataField.Any;
      InitializedType: Set<DataField.ExtendsOptionsFor<InputElement>['InitializedType']>;
    }
  >
> extends ArrayField<InputElement, Options, ExtendsOptions> {}

export declare namespace SchemaField {
  export type DefaultOptionsValue = ObjectField.DefaultOptionsValue;

  export type ExtraOptions = ObjectField.ExtraOptions;

  export type OptionalDataSchema = Record<string, DataField<any, any> & RequiredProps<DataField<any, any>, 'initial'>>;

  export type ExtendsOptions<Schema extends DataSchema> = DataField.ExtendsOptions<
    Partial<DataModel.SchemaToSourceInput<Schema>>,
    DefaultOptionsValue,
    ExtraOptions,
    {
      ValidateType: Record<string, Error> | Error;
      InitializedType: DataModel.SchemaToData<Schema>;
    }
  >;

  export type DataSchema = Record<string, DataField.Any>;

  /**
   * Includes `DataField#apply`'s options.
   */
  export type ApplyToSchemaOptions = Partial<{
    partial: boolean;
    filter: boolean;
  }> &
    Record<string, unknown>;

  export type CleanSchemaOptions = {
    /** Allow partial cleaning of source data, ignoring absent fields */
    partial: boolean;
  };

  export type ValidateSchemaOptions = {
    partial: boolean;
    fallback: boolean;
  };

  export type DataValidationOptions = {
    /**
     * Attempt to replace invalid values with valid defaults?
     * (default: `false`)
     */
    fallback: boolean;

    /**
     * Allow partial source data, ignoring absent fields?
     * (default: `false`)
     */
    partial: boolean;
  };
}

/**
 * A subclass of [ObjectField]{@link ObjectField} which supports an inner schema of keys and DataField values.
 */
declare class SchemaField<
  ConcreteSchema extends DataSchema,
  Options extends DataField.Options<ExtendsOptions>,
  ExtendsOptions extends DataField.AnyExtendsOptions = SchemaField.ExtendsOptions<ConcreteSchema>
> extends ObjectField<Options, ExtendsOptions> {
  //   initial: 'initial' extends RequiredProperties<Options>
  //     ? Extract<ObjectField<Options, ExtendsOptions>, { initial: unknown }>['initial']
  //     : () => ReturnType<any>; // typeof SchemaField.cleanSchema

  /* -------------------------------------------- */

  /**
   * Validate the structure of the provided Data Schema definition.
   * @param schema - The provided data schema
   * @returns The validated schema
   */
  static #validateDataSchemaFormat(schema: unknown): DataSchema;

  /* -------------------------------------------- */

  /**
   * The inner data schema which this field contains.
   */
  schema: ConcreteSchema;

  //   /* -------------------------------------------- */

  //   /** {@inheritdoc} */
  //   _cleanType(value, data, options) {
  //     value = super._cleanType(value, data, options);
  //     return this.constructor.cleanSchema(this.schema, value || {}, options);
  //   }

  //   /** @override */
  //   override initialize(model, name, value) {
  //     if (!value) return value;
  //     const data = {};
  //     for (let [k, field] of Object.entries(this.schema)) {
  //       data[k] = field.initialize(model, `${name}.${k}`, value[k]);
  //     }
  //     return data;
  //   }

  //   /** @override */
  //   override toObject(model, name, value) {
  //     const data = {};
  //     for (let [k, field] of Object.entries(this.schema)) {
  //       data[k] = field.toObject(model, `${name}.${k}`, value[k]);
  //     }
  //     return data;
  //   }

  //   /** @override */
  //   override apply(fn, data = {}, options = {}) {
  //     return this.constructor.applyToSchema(this.schema, fn, data, options);
  //   }

  //   /**
  //    * {@inheritdoc}
  //    */
  //   override _validateType(value, options = {}) {
  //     if (!(value instanceof Object)) throw new Error('must be an object');
  //     const errors = this.constructor.validateSchema(this.schema, value, options);
  //     if (!isEmpty(errors)) throw new MultiValidationError(errors);
  //   }

  //   /* ---------------------------------------- */
  //   /*  Schema Management Helpers               */
  //   /* ---------------------------------------- */

  //   /**
  //    * Apply a transformation function to a certain Data Schema.
  //    * Used by both the SchemaField and the top-level DataModel itself.
  //    * @param {DataSchema} schema       The data schema to which the function is applied
  //    * @param {function|string} fn      A function to apply or a string which references a named function which
  //    *                                  must exist on every DataField subclass
  //    * @param {object} [data={}]        Input data which is passed to the applied function
  //    * @param {object} [options={}]     Options which are passed to the applied function
  //    * @returns {object}                An object with the hierarchical structure of the data schema containing the
  //    *                                  returned values of the applied function
  //    */
  //   static applyToSchema(schema, fn, data = {}, options = {}) {
  //     const results = {};
  //     for (const [key, field] of Object.entries(schema)) {
  //       if (options.partial && !(key in data)) continue;
  //       const r = field.apply(fn, data[key], options);
  //       if (!options.filter || !isEmpty(r)) results[key] = r;
  //     }
  //     return results;
  //   }

  //   /**
  //    * Clean a data source object to conform to a specific provided schema.
  //    * @param {DataSchema} schema       The data schema to which the function is applied
  //    * @param {object} source           The source data object
  //    * @param {object} [options={}]     Additional options which modify data cleaning behavior
  //    * @param {boolean} [options.partial=false]   Allow partial cleaning of source data, ignoring absent fields
  //    * @returns {object}                The cleaned source data
  //    */
  //   static cleanSchema(schema, source, { partial = false } = {}) {
  //     // Clean each field which belongs to the schema
  //     for (const [name, field] of Object.entries(schema)) {
  //       if (!(name in source) && partial) continue;
  //       source[name] = field.clean(source[name], source, { partial });
  //     }

  //     // Delete any keys which do not
  //     for (const k of Object.keys(source)) {
  //       if (!(k in schema)) delete source[k];
  //     }
  //     return source;
  //   }

  //   /* ---------------------------------------- */

  /**
   * Validate an object of data against its provided schema.
   * @param schema - The schema against which to validate
   * @param source - The source data to validate
   *                 (default: `{}`)
   * @param options - Additional options which modify validation behavior
   *                  (default: `{}`)
   * @returns An object of any validation Errors which occurred corresponding to the field structure of the provided schema
   */
  static validateSchema(
    schema: DataSchema,
    source?: Record<string, unknown>,
    options?: SchemaField.DataValidationOptions
  ): Record<string, Error>;
}

export declare namespace EmbeddedDataField {
  export type DefaultOptionsValue = SchemaField.DefaultOptionsValue;

  export type ExtraOptions = SchemaField.ExtraOptions;

  export type DataModelConstructor = Pick<typeof DataModel, keyof typeof DataModel> &
    (new <Parent extends AnyDocument | null>(data?: any, context?: Context<any>) => DataModel.Any);

  export type ExtendsOptions<Model extends DataModelConstructor> = SchemaField.ExtendsOptions<
    ReturnType<Model['defineSchema']>
  >;
}

/**
 * A subclass of [ObjectField]{@link ObjectField} which embeds some other DataModel definition as an inner object.
 */
export declare class EmbeddedDataField<
  Model extends EmbeddedDataField.DataModelConstructor,
  Options extends DataField.Options<ExtendsOptions>,
  ExtendsOptions extends DataField.AnyExtendsOptions = EmbeddedDataField.ExtendsOptions<Model>
> extends SchemaField<ReturnType<Model['defineSchema']>, Options, ExtendsOptions> {
  constructor(model: Model, options: Options);

  model: Model;
}

export declare namespace EmbeddedCollectionField {
  export type Type = foundry.abstract.Document.AnyConstructor;

  export type ExtendsOptions<Element extends Type> = SimpleMerge<
    ArrayField.AnyExtendsOptions,
    {
      InputElement: Type;
      SourceType: InstanceType<Element>['_source'][];
      InitializedType: EmbeddedCollection<Element, DataModel.Any>;
    }
  >;

  export type AnyExtendsOptions = ArrayField.AnyExtendsOptions;
}

/**
 * A subclass of [ArrayField]{@link ArrayField} which supports an embedded Document collection.
 * Invalid elements will be dropped from the collection during validation rather than failing for the field entirely.
 */
export declare class EmbeddedCollectionField<
  InputElement extends ExtendsOptions['InputElement'],
  Options extends DataField.Options<ExtendsOptions>,
  ExtendsOptions extends EmbeddedCollectionField.AnyExtendsOptions = EmbeddedCollectionField.ExtendsOptions<InputElement>
> extends ArrayField<InputElement, Options, ExtendsOptions> {
  /**
   * A reference to the DataModel subclass of the embedded document element
   */
  get model(): Extract<InputElement, EmbeddedCollectionField.Type>['implementation'];

  /**
   * The DataSchema of the contained Document model.
   */
  schema: Extract<InputElement, EmbeddedCollectionField.Type>['schema'];
}

export declare namespace DocumentIdField {
  export type Type = StringField.Type;

  export type DefaultOptionsValue = SimpleMerge<
    StringField.DefaultOptionsValue,
    {
      required: true;
      blank: false;
      nullable: true;
      initial: null;
      readonly: true;
      validationError: 'is not a valid Document ID string';
    }
  >;

  export type ExtraOptions = StringField.ExtraOptions;

  export type ExtendsOptions = SimpleMerge<
    StringField.ExtendsOptions<undefined>,
    {
      DefaultOptionsValue: DefaultOptionsValue;
    }
  >;
}

/**
 * A subclass of [StringField]{@link StringField} which provides the primary _id for a Document.
 * The field may be initially null, but it must be non-null when it is saved to the database.
 */
export declare class DocumentIdField<
  Options extends DataField.Options<ExtendsOptions>,
  ExtendsOptions extends DataField.AnyExtendsOptions = DocumentIdField.ExtendsOptions
> extends StringField<Options, undefined, ExtendsOptions> {}

export declare namespace ForeignDocumentField {
  export type Type = Pick<typeof DataModel, keyof typeof DataModel> &
    (abstract new <Parent extends DataModel.Any>(data?: any, context?: Context<any>) => DataModel.Any);

  export type DefaultOptionsValue = SimpleMerge<
    DocumentIdField.DefaultOptionsValue,
    {
      nullable: true;
      readonly: false;
      idOnly: false;
    }
  >;

  export type ExtraOptions = DocumentIdField.ExtraOptions &
    Partial<{
      idOnly: boolean;
    }>;

  export type ExtendsOptions<Model extends Type, Options extends DataField.Options<any>> = SimpleMerge<
    DocumentIdField.ExtendsOptions,
    {
      DefaultOptionsValue: DefaultOptionsValue;
      ExtraOptions: ExtraOptions;
      SourceType: DocumentIdField.Type;
      InitializedType: 'idOnly' extends keyof Options ? (Options['idOnly'] extends true ? string : Model) : Model;
    }
  >;
}

/**
 * A special class of [StringField]{@link StringField} field which references another DataModel by its id.
 * This field may also be null to indicate that no foreign model is linked.
 */
export declare class ForeignDocumentField<
  Model extends ForeignDocumentField.Type,
  Options extends DataField.Options<ExtendsOptions>,
  ExtendsOptions extends DataField.AnyExtendsOptions = ForeignDocumentField.ExtendsOptions<Model, Options>
> extends DocumentIdField<Options, ExtendsOptions> {
  constructor(model: Model, options: Options);

  model: Model;
}

export declare namespace SystemDataField {
  export type Type = ObjectField.Type;

  export type DefaultOptionsValue = SimpleMerge<ObjectField.DefaultOptionsValue, { required: true }>;

  export type ExtraOptions = ObjectField.ExtraOptions;

  export type ExtendsOptions<
    ConcreteDocument extends DocumentConstructor & { metadata: { name: SystemDocumentType } }
  > = SimpleMerge<
    ObjectField.ExtendsOptions,
    {
      SourceType: DeepPartial<ConfiguredSource<ConcreteDocument['metadata']['name']>>;
      InitializedType: ConfiguredData<ConcreteDocument['metadata']['name']>;
    }
  >;
}

/**
 * A subclass of [StringField]{@link StringField} which provides the primary _id for a Document.
 * The field may be initially null, but it must be non-null when it is saved to the database.
 */
export declare class SystemDataField<
  ConcreteDocument extends DocumentConstructor & { metadata: { name: SystemDocumentType } },
  Options extends DataField.Options<ExtendsOptions>,
  ExtendsOptions extends DataField.AnyExtendsOptions = SystemDataField.ExtendsOptions<ConcreteDocument>
> extends ObjectField<Options, ExtendsOptions> {
  constructor(document: ConcreteDocument, options: Options);

  document: ConcreteDocument;

  protected static get _defaults(): SystemDataField.DefaultOptionsValue;

  /**
   * A convenience accessor for the name of the document type associated with this SystemDataField
   */
  get documentName(): ConcreteDocument['documentName'];

  /**
   * Get the DataModel definition that should be used for this type of document.
   * @param type - The Document instance type
   * @returns - The DataModel class, or null
   */
  getModelForType(type: string): typeof DataModel | null;

  /** @override */
  //   override getInitialValue(data: Record<string, unknown>): DataField.InternalSourceTypeFor<this, ExtendsOptions>;
}

export declare namespace ColorField {
  export type Type = StringField.Type;

  export type DefaultOptionsValue = SimpleMerge<
    StringField.DefaultOptionsValue,
    {
      nullable: true;
      initial: null;
      blank: false;
      validationError: 'is not a valid hexadecimal color string';
    }
  >;

  export type ExtraOptions = StringField.ExtraOptions;

  export type ExtendsOptions<Choices extends DataFieldChoices<ColorField.Type> | undefined> = SimpleMerge<
    StringField.ExtendsOptions<Choices>,
    {
      DefaultOptionsValue: DefaultOptionsValue;
    }
  >;
}

/**
 * A special [StringField]{@link StringField} which records a standardized CSS color string.
 */
export declare class ColorField<
  Options extends ChoicesOptions<ExtendsOptions, CoalesceUnknown<Choices, undefined>>,
  Choices extends DataFieldChoices<ColorField.Type> | undefined = Options['choices'],
  ExtendsOptions extends DataField.AnyExtendsOptions = ColorField.ExtendsOptions<CoalesceUnknown<Choices, undefined>>
> extends StringField<Options, Choices, ExtendsOptions> {
  protected static get _defaults(): ColorField.DefaultOptionsValue;
}

export declare namespace FilePathField {
  export type Type = StringField.Type;

  export type DefaultOptionsValue = SimpleMerge<
    StringField.DefaultOptionsValue,
    {
      categories: [];
      base64: false;
      nullable: true;
      blank: false;
      initial: null;
    }
  >;

  export type ExtraOptions = StringField.ExtraOptions &
    Partial<{
      /** A set of categories in CONST.FILE_CATEGORIES which this field supports */
      categories: Array<keyof typeof CONST['FILE_CATEGORIES']>;

      /** Is embedded base64 data supported in lieu of a file path? */
      base64: boolean;
    }>;

  export type ExtendsOptions<Choices extends DataFieldChoices<FilePathField.Type> | undefined> = SimpleMerge<
    StringField.ExtendsOptions<Choices>,
    {
      DefaultOptionsValue: DefaultOptionsValue;
      ExtraOptions: ExtraOptions;
    }
  >;
}

export declare class FilePathField<
  Options extends ChoicesOptions<ExtendsOptions, CoalesceUnknown<Choices, undefined>>,
  Choices extends DataFieldChoices<FilePathField.Type> | undefined = Options['choices'],
  ExtendsOptions extends DataField.AnyExtendsOptions = FilePathField.ExtendsOptions<CoalesceUnknown<Choices, undefined>>
> extends StringField<Options, Choices, ExtendsOptions> {
  protected static get _defaults(): FilePathField.DefaultOptionsValue;
}

export declare namespace AngleField {
  export type Type = NumberField.Type;

  export type DefaultOptionsValue = SimpleMerge<
    NumberField.DefaultOptionsValue,
    {
      required: true;
      nullable: false;
      initial: 0;
      base: 0;
      min: 0;
      max: 360;
      validationError: 'is not a number between 0 and 360';
    }
  >;

  export type ExtraOptions = NumberField.ExtraOptions &
    Partial<{
      /** Whether the base angle should be treated as 360 or as 0 */
      base: number;
    }>;

  export type ExtendsOptions<Choices extends DataFieldChoices<AngleField.Type> | undefined> = SimpleMerge<
    NumberField.ExtendsOptions<Choices>,
    {
      DefaultOptionsValue: DefaultOptionsValue;
      ExtraOptions: ExtraOptions;
    }
  >;
}

/**
 * A special [NumberField]{@link NumberField} which represents an angle of rotation in degrees between 0 and 360.
 */
export declare class AngleField<
  Options extends ChoicesOptions<ExtendsOptions, CoalesceUnknown<Choices, undefined>>,
  Choices extends DataFieldChoices<AngleField.Type> | undefined = Options['choices'],
  ExtendsOptions extends DataField.AnyExtendsOptions = AngleField.ExtendsOptions<CoalesceUnknown<Choices, undefined>>
> extends NumberField<Options, Choices, ExtendsOptions> {}

export namespace AlphaField {
  export type Type = NumberField.Type;

  export type DefaultOptionsValue = SimpleMerge<
    NumberField.DefaultOptionsValue,
    {
      required: true;
      nullable: false;
      initial: 1;
      min: 0;
      max: 1;
      validationError: 'is not a number between 0 and 1';
    }
  >;

  export type ExtraOptions = NumberField.ExtraOptions;

  export type ExtendsOptions<Choices extends DataFieldChoices<AlphaField.Type> | undefined> = SimpleMerge<
    NumberField.ExtendsOptions<Choices>,
    {
      DefaultOptionsValue: DefaultOptionsValue;
    }
  >;
}

/**
 * A special [NumberField]{@link NumberField} represents a number between 0 and 1.
 */
export declare class AlphaField<
  Options extends ChoicesOptions<ExtendsOptions, CoalesceUnknown<Choices, undefined>>,
  Choices extends DataFieldChoices<AlphaField.Type> | undefined = Options['choices'],
  ExtendsOptions extends DataField.AnyExtendsOptions = AlphaField.ExtendsOptions<undefined>
> extends NumberField<Options, Choices, ExtendsOptions> {}

export namespace DocumentOwnershipField {
  export type Type = ObjectField.Type;

  export type DefaultOptionsValue = SimpleMerge<
    ObjectField.DefaultOptionsValue,
    {
      initial: { default: typeof DOCUMENT_OWNERSHIP_LEVELS.NONE };
      validationError: 'is not a mapping of user IDs and document permission levels';
    }
  >;

  export type ExtraOptions = ObjectField.ExtraOptions;

  export type ExtendsOptions = SimpleMerge<
    ObjectField.ExtendsOptions,
    {
      DefaultOptionsValue: DefaultOptionsValue;
    }
  >;
}

/**
 * A special [ObjectField]{@link ObjectField} which captures a mapping of User IDs to Document permission levels.
 */
export declare class DocumentOwnershipField<
  Options extends DataField.Options<ExtendsOptions>,
  ExtendsOptions extends DataField.AnyExtendsOptions = DocumentOwnershipField.ExtendsOptions
> extends ObjectField<Options> {}

export declare namespace JSONField {
  export type Type = StringField.Type;

  export type DefaultOptionsValue = SimpleMerge<
    StringField.DefaultOptionsValue,
    {
      blank: false;
      validationError: 'is not a valid JSON string';
    }
  >;

  export type ExtraOptions = StringField.ExtraOptions;

  export type ExtendsOptions<Choices extends DataFieldChoices<JSONField.Type> | undefined = undefined> = SimpleMerge<
    StringField.ExtendsOptions<Choices>,
    {
      DefaultOptionsValue: DefaultOptionsValue;
    }
  >;
}

/**
 * A special [StringField]{@link StringField} which contains serialized JSON data.
 */
export declare class JSONField<
  Options extends ChoicesOptions<ExtendsOptions, CoalesceUnknown<Choices, undefined>>,
  Choices extends DataFieldChoices<JSONField.Type> | undefined = Options['choices'],
  ExtendsOptions extends DataField.AnyExtendsOptions = JSONField.ExtendsOptions<CoalesceUnknown<Choices, undefined>>
> extends StringField<Options, Choices, ExtendsOptions> {}

export namespace HTMLField {
  export type Type = StringField.Type;

  export type DefaultOptionsValue = SimpleMerge<
    StringField.DefaultOptionsValue,
    {
      required: true;
      blank: true;
    }
  >;

  export type ExtraOptions = StringField.ExtraOptions;

  export type ExtendsOptions<Choices extends DataFieldChoices<HTMLField.Type> | undefined = undefined> = SimpleMerge<
    StringField.ExtendsOptions<Choices>,
    {
      DefaultOptionsValue: DefaultOptionsValue;
    }
  >;
}

/**
 * A subclass of [StringField]{@link StringField} which contains a sanitized HTML string.
 * This class does not override any StringField behaviors, but is used by the server-side to identify fields which
 * require sanitization of user input.

 */
export declare class HTMLField<
  Options extends ChoicesOptions<ExtendsOptions, CoalesceUnknown<Choices, undefined>>,
  Choices extends DataFieldChoices<HTMLField.Type> | undefined = Options['choices'],
  ExtendsOptions extends DataField.AnyExtendsOptions = HTMLField.ExtendsOptions<CoalesceUnknown<Choices, undefined>>
> extends StringField<Options, Choices, ExtendsOptions> {}

/* ---------------------------------------- */
/*  DEPRECATIONS                            */
/* ---------------------------------------- */

/**
 * @deprecated since v10
 * @see AngleField
 */
export const ANGLE_FIELD: AngleField<{}>;

/**
 * @deprecated since v10
 * @see AlphaField
 */
export const ALPHA_FIELD: AlphaField<{}>;

/**
 * @deprecated since v10
 * @see FilePathField
 */
export const AUDIO_FIELD: FilePathField<{ categories: ['AUDIO'] }>;

/**
 * @deprecated since v10
 * @see StringField
 */
export const BLANK_STRING: StringField<{
  required: true;
  nullable: false;
  blank: true;
}>;

/**
 * @deprecated since v10
 * @see BooleanField
 */
export const BOOLEAN_FIELD: BooleanField<{}>;

/**
 * @deprecated since v10
 * @see ColorField
 */
export const COLOR_FIELD: ColorField<{}>;

/**
 * @deprecated since v10
 * @see DocumentIdField
 */
export const DOCUMENT_ID: DocumentIdField<{}>;

/**
 * @deprecated since v10
 * @see DocumentOwnershipField
 */
export const DOCUMENT_PERMISSIONS: DocumentOwnershipField<{}>;

// SET CATEGORIES
/**
 * @deprecated since v10
 * @see FilePathField
 */
export const IMAGE_FIELD: FilePathField<{ categories: ['IMAGE'] }>;

/**
 * @deprecated since v10
 * @see NumberField
 */
export const INTEGER_FIELD: NumberField<{
  integer: true;
  validationError: 'does not have an integer value';
}>;

/**
 * @deprecated since v10
 * @see NumberField
 */
export const INTEGER_SORT_FIELD: NumberField<{
  required: true;
  initial: 0;
  integer: true;
  validationError: 'is not an integer';
}>;

/**
 * @deprecated since v10
 * @see NumberField
 */
export const NONNEGATIVE_INTEGER_FIELD: NumberField<{
  min: 0;
  integer: true;
  validationError: 'does not have an non-negative integer value';
}>;

/**
 * @deprecated since v10
 * @see NumberField
 */
export const NONNEGATIVE_NUMBER_FIELD: NumberField<{
  min: 0;
  integer: true;
  validationError: 'does not have an non-negative integer value';
}>;

/**
 * @deprecated since v10
 * @see NumberField
 */
export const NUMERIC_FIELD: NumberField<{}>;

/**
 * @deprecated since v10
 * @see ObjectField
 */
export const OBJECT_FIELD: ObjectField<{}>;

/**
 * @deprecated since v10
 * @see NumberField
 */
export const POSITIVE_INTEGER_FIELD: NumberField<{
  min: 1;
  integer: true;
  validationError: 'does not have an non-negative integer value';
}>;

/**
 * @deprecated since v10
 * @see NumberField
 */
export const REQUIRED_NUMBER: NumberField<{
  required: true;
  nullable: false;
}>;

/**
 * @deprecated since v10
 * @see NumberField
 */
export const REQUIRED_POSITIVE_NUMBER: NumberField<{
  required: true;
  nullable: false;
  validate: (value: number) => boolean;
  validationError: 'is not a positive number';
}>;

/**
 * @deprecated since v10
 * @see StringField
 */
export const REQUIRED_STRING: StringField<{
  required: true;
  nullable: false;
  blank: false;
  validationError: 'must be a non-blank string';
}>;

/**
 * @deprecated since v10
 * @see StringField
 */
export const STRING_FIELD: StringField<{}>;

/**
 * @deprecated since v10
 * @see NumberField
 */
export const TIMESTAMP_FIELD: NumberField<{
  default: typeof Date.now;
  nullable: false;
}>;

/**
 * A string field which contains serialized JSON data that may be used in a Document.
 */
export const JSON_FIELD: JSONField<{}>;

/**
 * @deprecated since v10
 * @see FilePathField
 */
export const VIDEO_FIELD: FilePathField<{ categories: ['IMAGE', 'VIDEO'] }>;

/**
 * @deprecated since v10
 * @see SystemDataField
 */
export function systemDataField<Document extends DocumentConstructor & { metadata: { name: SystemDocumentType } }>(
  document: Document
): SystemDataField<Document, {}>;

/**
 * @deprecated since v10
 * @see ForeignDocumentField
 */
export function foreignDocumentField<
  Model extends ForeignDocumentField.Type,
  Options extends DataField.Options<ForeignDocumentField.ExtendsOptions<Model, Options>> & {
    type: {
      model: Model;
    };
  }
>(options: Options): ForeignDocumentField<Options['type']['model'], Options>;

/**
 * Create a special field which contains a Collection of embedded Documents
 * @param document - The Document class definition
 * @param options  - Additional field options
 *                   (default: `{}`)
 */
export function embeddedCollectionField<
  ConcreteDocumentConstructor extends EmbeddedCollectionField.Type,
  Options extends DataField.Options<EmbeddedCollectionField.ExtendsOptions<ConcreteDocumentConstructor>>
>(
  document: ConcreteDocumentConstructor,
  options?: Options
): EmbeddedCollectionField<ConcreteDocumentConstructor, Options>;

/**
 * Return a document field which is a modification of a static field type
 */
export function field<
  Type extends String | Number | Boolean | Object | unknown[] | object,
  Options extends Record<string, unknown>
>(field: { type: Type }, options?: Options): DataField.Any;
