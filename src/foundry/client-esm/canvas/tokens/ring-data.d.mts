import type DataModel from "../../../common/abstract/data.d.mts";
import type { DataField, DataSchema } from "../../../common/data/fields.d.mts";
import type { AnyConstructor, SimpleMerge } from "fvtt-types/utils";
import type TokenRing from "./ring.d.mts";

import fields = foundry.data.fields;

/**
 * Dynamic Ring configuration data model.
 */
declare class DynamicRingData extends DataModel<DynamicRingData.Schema> {
  static override defineSchema(): DynamicRingData.Schema;
}

declare namespace DynamicRingData {
  interface Schema extends DataSchema {
    /** The id of this Token Ring configuration. */
    id: fields.StringField<{ blank: true }>;

    /** The label of this Token Ring configuration. */
    label: fields.StringField<{ blank: false }>;

    /** The spritesheet path which provides token ring frames for various sized creatures. */
    spritesheet: fields.FilePathField<{ categories: ["TEXT"]; required: true }>;

    /**
     * Registered special effects which can be applied to a token ring.
     * @defaultValue
     * ```
     * {
     *     RING_PULSE: "TOKEN.RING.EFFECTS.RING_PULSE",
     *     RING_GRADIENT: "TOKEN.RING.EFFECTS.RING_GRADIENT",
     *     BKG_WAVE: "TOKEN.RING.EFFECTS.BKG_WAVE",
     *     INVISIBILITY: "TOKEN.RING.EFFECTS.INVISIBILITY"
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
        };
      },
      Record<string, string>,
      Record<string, string>
    >;

    framework: fields.SchemaField<{
      /**
       * The manager class responsible for rendering token rings.
       * @defaultValue `TokenRing`
       */
      ringClass: ClassReferenceField<typeof TokenRing, { initial: typeof TokenRing; baseClass: typeof TokenRing }>;

      /**
       * The shader class used to render the TokenRing.
       * @defaultValue `TokenRingSamplerShader`
       */
      shaderClass: ClassReferenceField<
        typeof PrimaryBaseSamplerShader,
        { initial: typeof TokenRingSamplerShader; baseClass: typeof PrimaryBaseSamplerShader }
      >;
    }>;
  }

  interface RingData {
    /** The id of this Token Ring configuration. */
    id: string;

    /** The label of this Token Ring configuration. */
    label: string;

    /** The spritesheet path which provides token ring frames for various sized creatures. */
    spritesheet: string;

    /** Registered special effects which can be applied to a token ring. */
    effects: Record<string, string>;

    framework: {
      /**
       * The manager class responsible for rendering token rings.
       * @defaultValue `TokenRing`
       */
      ringClass: typeof TokenRing;

      /**
       * The shader class used to render the TokenRing.
       * @defaultValue `TokenRingSamplerShader`
       */
      shaderClass: typeof PrimaryBaseSamplerShader;
    };
  }

  namespace ClassReferenceField {
    /**
     * A shorthand for the options of a ClassReferenceField class.
     * @typeParam BaseClass - The base class constructor linked to this data field.
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
     * @typeParam BaseClass - The base class constructor linked to this data field.
     * @typeParam Options - the options that override the default options
     */
    type MergedOptions<
      BaseClass extends AnyConstructor,
      Options extends ClassReferenceField.Options<BaseClass>,
    > = SimpleMerge<DefaultOptions, Options>;

    /**
     * A shorthand for the assignment type of a ClassReferenceField class.
     * @typeParam BaseClass - The base class constructor linked to this data field.
     * @typeParam Options - the options that override the default options
     */
    type AssignmentType<
      BaseClass extends AnyConstructor,
      Options extends ClassReferenceField.Options<BaseClass>,
    > = DataField.DerivedAssignmentType<AnyConstructor, MergedOptions<BaseClass, Options>>;

    /**
     * A shorthand for the initialized type of a NumberField class.
     * @typeParam BaseClass - The base class constructor linked to this data field.
     * @typeParam Options - the options that override the default options
     */
    type InitializedType<
      BaseClass extends AnyConstructor,
      Options extends ClassReferenceField.Options<BaseClass>,
    > = DataField.DerivedInitializedType<BaseClass, MergedOptions<BaseClass, Options>>;
  }

  /**
   * A special subclass of [DataField]{@link DataField} used to reference a class definition.
   * @typeParam BaseClass - The base class constructor linked to this data field.
   * @typeParam Options         - the options of the ClassReferenceField instance
   * @typeParam AssignmentType  - the type of the allowed assignment values of the ClassReferenceField
   * @typeParam InitializedType - the type of the initialized values of the ClassReferenceField
   * @typeParam PersistedType   - the type of the persisted values of the ClassReferenceField
   */
  class ClassReferenceField<
    BaseClass extends AnyConstructor,
    Options extends ClassReferenceField.Options<BaseClass> = ClassReferenceField.DefaultOptions,
    AssignmentType = ClassReferenceField.AssignmentType<BaseClass, Options>,
    InitializedType = ClassReferenceField.InitializedType<BaseClass, Options>,
    PersistedType = InitializedType,
  > extends DataField<Options, AssignmentType, InitializedType, PersistedType> {
    #ClassReferenceField: true;

    constructor(options?: Options);

    static override get _defaults(): DataField.Options.Any;

    protected override _cast(value: AssignmentType): InitializedType;

    override getInitialValue(data: DataField.CleanOptions["source"]): InitializedType;
  }
}

export default DynamicRingData;
