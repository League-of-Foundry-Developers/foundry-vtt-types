import type { SimpleMerge, ValueOf } from "../../../../types/utils.d.mts";
import type { fields } from "../../../common/data/module.d.mts";

export {};

declare global {
  class ShaderField<
    const Options extends ShaderField.Options = ShaderField.DefaultOptions,
    const AssignmentType = ShaderField.AssignmentType<Options>,
    const InitializedType = ShaderField.InitializedType<Options>,
    const PersistedType extends typeof AbstractBaseShader | null | undefined = ShaderField.InitializedType<Options>,
  > extends foundry.data.fields.DataField<Options, AssignmentType, InitializedType, PersistedType> {
    /**
     * @defaultValue
     * ```typescript
     * const defaults = super._defaults;
     * defaults.nullable = true;
     * defaults.initial = undefined;
     * return defaults;
     * ```
     */
    static override get _defaults(): ShaderField.DefaultOptions;

    // TODO: _cast blatantly breaks inheritance so this is difficult to work with
    /** @remarks The value provided to a ShaderField must be an AbstractBaseShader subclass. */
    override _cast(value: any): Exclude<InitializedType, undefined | null>; // typeof AbstractBaseShader;
  }

  /**
   * A Vision Mode which can be selected for use by a Token.
   * The selected Vision Mode alters the appearance of various aspects of the canvas while that Token is the POV.
   */
  class VisionMode extends foundry.abstract.DataModel<VisionMode.Schema> {
    /**
     * Construct a Vision Mode using provided configuration parameters and callback functions.
     * @param data    - Data which fulfills the model defined by the VisionMode schema.
     * @param options - Additional options passed to the DataModel constructor.
     */
    constructor(data: Partial<any>, options?: object);

    static defineSchema(): VisionMode.Schema;

    /** The lighting illumination levels which are supported. */
    static LIGHTING_LEVELS: {
      DARKNESS: -2;
      HALFDARK: -1;
      UNLIT: 0;
      DIM: 1;
      BRIGHT: 2;
      BRIGHTEST: 3;
    };

    /**
     * Flags for how each lighting channel should be rendered for the currently active vision modes:
     * - Disabled: this lighting layer is not rendered, the shaders does not decide.
     * - Enabled: this lighting layer is rendered normally, and the shaders can choose if they should be rendered or not.
     * - Required: the lighting layer is rendered, the shaders does not decide.
     */
    static LIGHTING_VISIBILITY: {
      DISABLED: 0;
      ENABLED: 1;
      REQUIRED: 2;
    };

    /**
     * A flag for whether this vision source is animated
     * @defaultValue `false`
     */
    animated: boolean;

    /**
     * Special activation handling that could be implemented by VisionMode subclasses
     * @param source - Activate this VisionMode for a specific source
     */
    _activate(source: VisionSource): void;

    /**
     * Special deactivation handling that could be implemented by VisionMode subclasses
     * @param source - Deactivate this VisionMode for a specific source
     */
    _deactivate(source: VisionSource): void;

    /**
     * Special handling which is needed when this Vision Mode is activated for a VisionSource.
     * @param source - Activate this VisionMode for a specific source
     */
    activate(source: VisionSource): void;

    /**
     * Special handling which is needed when this Vision Mode is deactivated for a VisionSource.
     * @param source - Deactivate this VisionMode for a specific source
     */
    deactivate(source: VisionSource): void;

    /**
     * An animation function which runs every frame while this Vision Mode is active.
     * @param dt - The deltaTime passed by the PIXI Ticker
     */
    animate(dt: number): void;
  }

  namespace ShaderField {
    type Options = DataFieldOptions<typeof AbstractBaseShader>;

    type DefaultOptions = SimpleMerge<
      foundry.data.fields.DataField.DefaultOptions,
      {
        nullable: true;
        initial: undefined;
      }
    >;

    /**
     * A helper type for the given options type merged into the default options of the BooleanField class.
     * @typeParam Opts - the options that override the default options
     */
    type MergedOptions<Opts extends Options> = SimpleMerge<DefaultOptions, Opts>;

    /**
     * A shorthand for the assignment type of a BooleanField class.
     * @typeParam Opts - the options that override the default options
     */
    type AssignmentType<Opts extends Options> = foundry.data.fields.DataField.DerivedAssignmentType<
      typeof AbstractBaseShader,
      MergedOptions<Opts>
    >;

    /**
     * A shorthand for the initialized type of a BooleanField class.
     * @typeParam Opts - the options that override the default options
     */
    type InitializedType<Opts extends Options> = foundry.data.fields.DataField.DerivedInitializedType<
      typeof AbstractBaseShader,
      MergedOptions<Opts>
    >;
  }

  namespace VisionMode {
    type ShaderSchema = fields.SchemaField<{
      shader: ShaderField;
      uniforms: fields.ObjectField;
    }>;

    type LightingSchema = fields.SchemaField<{
      visibility: fields.NumberField;
      postProcessingModes: fields.ArrayField<fields.StringField>;
      uniforms: fields.ObjectField;
    }>;

    type LightingLevels = Record<
      ValueOf<typeof VisionMode.LIGHTING_LEVELS>,
      ValueOf<typeof VisionMode.LIGHTING_LEVELS>
    >;
    type LightingMultipliers = Record<ValueOf<typeof VisionMode.LIGHTING_LEVELS>, number>;

    interface Schema extends DataSchema {
      id: fields.StringField<{ blank: false }>;
      label: fields.StringField<{ blank: false }>;
      tokenConfig: fields.BooleanField<{ initial: true }>;
      canvas: fields.SchemaField<{
        shader: ShaderField;
        uniforms: fields.ObjectField;
      }>;
      lighting: fields.SchemaField<{
        background: LightingSchema;
        coloration: LightingSchema;
        illumination: LightingSchema;
        levels: fields.ObjectField<
          {
            validate: (o: unknown) => boolean;
            validationError: "may only contain a mapping of keys from VisionMode.LIGHTING_LEVELS";
          },
          LightingLevels,
          LightingLevels,
          LightingLevels
        >;
        multipliers: fields.ObjectField<
          {
            validate: (o: unknown) => boolean;
            validationError: "must provide a mapping of keys from VisionMode.LIGHTING_LEVELS to numeric multiplier values";
          },
          LightingMultipliers,
          LightingMultipliers,
          LightingMultipliers
        >;
      }>;
      vision: fields.SchemaField<{
        background: ShaderSchema;
        coloration: ShaderSchema;
        illumination: ShaderSchema;
        darkness: fields.SchemaField<{
          adaptive: fields.BooleanField<{ initial: true }>;
        }>;
        defaults: fields.ObjectField;
        preferred: fields.BooleanField<{ initial: false }>;
      }>;
    }
  }
}
