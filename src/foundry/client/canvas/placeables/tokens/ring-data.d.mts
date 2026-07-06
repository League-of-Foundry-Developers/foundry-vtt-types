import type { AnyConstructor, SimpleMerge } from "#utils";
import type { DataModel } from "#common/abstract/_module.d.mts";
import type { DataField } from "#common/data/fields.d.mts";
import type { fields } from "#client/data/_module.d.mts";
import type { TokenRing } from "#client/canvas/placeables/tokens/_module.d.mts";
import type { PrimaryBaseSamplerShader, TokenRingSamplerShader } from "#client/canvas/rendering/shaders/_module.d.mts";

/**
 * Dynamic Ring configuration data model.
 */
declare class DynamicRingData extends DataModel<DynamicRingData.Schema> {
  static override defineSchema(): DynamicRingData.Schema;

  // DataModel template overrides
  static override _schema: fields.SchemaField<DynamicRingData.Schema>;

  static override get schema(): fields.SchemaField<DynamicRingData.Schema>;

  static override validateJoint(data: DynamicRingData.InitializedData): void;

  static override fromSource(data: DynamicRingData.CreateData, context?: DataModel.FromSourceOptions): DynamicRingData;

  static override fromJSON(json: string): DynamicRingData;
}

declare namespace DynamicRingData {
  interface Schema extends fields.DataSchema {
    /** The id of this Token Ring configuration. */
    id: fields.StringField<{ blank: true }>;

    /** The label of this Token Ring configuration. */
    label: fields.StringField<{ blank: false }>;

    /** The spritesheet path which provides token ring frames for various sized creatures. */
    spritesheet: fields.FilePathField<{ categories: ["TEXT"]; required: true }>;

    /**
     * Registered special effects which can be applied to a token ring.
     * @defaultValue
     * ```js
     * {
     *   RING_PULSE: "TOKEN.RING.EFFECTS.RING_PULSE",
     *   RING_GRADIENT: "TOKEN.RING.EFFECTS.RING_GRADIENT",
     *   BKG_WAVE: "TOKEN.RING.EFFECTS.BKG_WAVE",
     *   INVISIBILITY: "TOKEN.RING.EFFECTS.INVISIBILITY",
     *   COLOR_OVER_SUBJECT: "TOKEN.RING.EFFECTS.COLOR_OVER_SUBJECT",
     * }
     * ```
     */
    effects: fields.ObjectField<
      {
        initial: {
          RING_PULSE: "TOKEN.RING.EFFECTS.RING_PULSE";
          RING_GRADIENT: "TOKEN.RING.EFFECTS.RING_GRADIENT";
          BKG_WAVE: "TOKEN.RING.EFFECTS.BKG_WAVE";
          INVISIBILITY: "TOKEN.RING.EFFECTS.INVISIBILITY";
          COLOR_OVER_SUBJECT: "TOKEN.RING.EFFECTS.COLOR_OVER_SUBJECT";
        };
      },
      Record<string, string> | null | undefined,
      Record<string, string>
    >;

    framework: fields.SchemaField<FrameworkSchema>;
  }

  interface FrameworkSchema extends fields.DataSchema {
    /**
     * The manager class responsible for rendering token rings.
     * @defaultValue `TokenRing`
     * @remarks Stays `typeof TokenRing` as its constructor must take a `Token.Implementation` argument
     */
    ringClass: ClassReferenceField<typeof TokenRing, { initial: typeof TokenRing; baseClass: typeof TokenRing }>;

    /**
     * The shader class used to render the TokenRing.
     * @defaultValue `TokenRingSamplerShader`
     * @privateRemarks As with most if not all shaders in foundry, instantiated by `.create()`, so `AnyConstructor`.
     */
    shaderClass: ClassReferenceField<
      PrimaryBaseSamplerShader.AnyConstructor,
      {
        initial: typeof TokenRingSamplerShader;
        baseClass: PrimaryBaseSamplerShader.AnyConstructor;
      }
    >;
  }

  interface CreateData extends fields.SchemaField.CreateData<Schema> {}

  // TODO: better name?
  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}
}

/**
 * A special subclass of {@linkcode DataField} used to reference a class definition.
 * @template BaseClass - The base class constructor linked to this data field.
 * @template Options         - the options of the ClassReferenceField instance
 * @template AssignmentType  - the type of the allowed assignment values of the ClassReferenceField
 * @template InitializedType - the type of the initialized values of the ClassReferenceField
 * @template PersistedType   - the type of the persisted values of the ClassReferenceField
 */
declare class ClassReferenceField<
  BaseClass extends AnyConstructor,
  Options extends ClassReferenceField.Options<BaseClass> = ClassReferenceField.DefaultOptions,
  AssignmentType = ClassReferenceField.AssignmentType<BaseClass, Options>,
  InitializedType = ClassReferenceField.InitializedType<BaseClass, Options>,
  PersistedType = InitializedType,
> extends DataField<Options, AssignmentType, InitializedType, PersistedType> {
  constructor(options?: Options);

  static override get _defaults(): DataField.Options.Any;

  protected override _validateType(value: unknown): void;

  override getInitialValue(data?: unknown): InitializedType;

  #ClassReferenceField: true;
}

declare namespace ClassReferenceField {
  /**
   * A shorthand for the options of a ClassReferenceField class.
   * @template BaseClass - The base class constructor linked to this data field.
   */
  interface Options<BaseClass extends AnyConstructor> extends DataField.Options<BaseClass> {
    /**
     *The base class linked to this data field.
     */
    baseClass?: BaseClass;
  }

  type DefaultOptions = SimpleMerge<
    DataField.DefaultOptions,
    {
      required: true;
    }
  >;

  /**
   * A helper type for the given options type merged into the default options of the ClassReferenceField class.
   * @template BaseClass - The base class constructor linked to this data field.
   * @template Options - the options that override the default options
   */
  type MergedOptions<
    BaseClass extends AnyConstructor,
    Options extends ClassReferenceField.Options<BaseClass>,
  > = SimpleMerge<DefaultOptions, Options>;

  /**
   * A shorthand for the assignment type of a ClassReferenceField class.
   * @template BaseClass - The base class constructor linked to this data field.
   * @template Options - the options that override the default options
   */
  type AssignmentType<
    BaseClass extends AnyConstructor,
    Options extends ClassReferenceField.Options<BaseClass>,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
  > = DataField.DerivedAssignmentType<AnyConstructor, MergedOptions<BaseClass, Options>>;

  /**
   * A shorthand for the initialized type of a NumberField class.
   * @template BaseClass - The base class constructor linked to this data field.
   * @template Options - the options that override the default options
   */
  type InitializedType<
    BaseClass extends AnyConstructor,
    Options extends ClassReferenceField.Options<BaseClass>,
  > = DataField.DerivedInitializedType<BaseClass, MergedOptions<BaseClass, Options>>;
}

export default DynamicRingData;
