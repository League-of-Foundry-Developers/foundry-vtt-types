import type { Brand, ConcreteKeys, Identity, InterfaceToObject, SimpleMerge } from "#utils";
import type { fields } from "#common/data/_module.d.mts";
import type { AbstractBaseShader } from "#client/canvas/rendering/shaders/_module.d.mts";
import type { DataModel } from "#common/abstract/_module.d.mts";
import type { PointVisionSource } from "#client/canvas/sources/_module.d.mts";

declare class ShaderField<
  const Options extends ShaderField.Options = ShaderField.DefaultOptions,
  const AssignmentType = ShaderField.AssignmentType<Options>,
  const InitializedType = ShaderField.InitializedType<Options>,
  const PersistedType extends typeof AbstractBaseShader | null | undefined = ShaderField.InitializedType<Options>,
> extends fields.DataField<Options, AssignmentType, InitializedType, PersistedType> {
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

  /**
   * @remarks
   * @throws If the value provided is not an {@linkcode AbstractBaseShader} subclass.
   */
  override _cast(value: unknown): AssignmentType; // typeof AbstractBaseShader;
}

declare namespace ShaderField {
  type Options = fields.DataField.Options<typeof AbstractBaseShader>;

  type DefaultOptions = SimpleMerge<
    fields.DataField.DefaultOptions,
    {
      nullable: true;
      initial: undefined;
    }
  >;

  /**
   * A helper type for the given options type merged into the default options of the BooleanField class.
   * @template Opts - the options that override the default options
   */
  type MergedOptions<Opts extends Options> = SimpleMerge<DefaultOptions, Opts>;

  /**
   * A shorthand for the assignment type of a BooleanField class.
   * @template Opts - the options that override the default options
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  type AssignmentType<Opts extends Options> = fields.DataField.DerivedAssignmentType<
    typeof AbstractBaseShader,
    MergedOptions<Opts>
  >;

  /**
   * A shorthand for the initialized type of a BooleanField class.
   * @template Opts - the options that override the default options
   */
  type InitializedType<Opts extends Options> = fields.DataField.DerivedInitializedType<
    typeof AbstractBaseShader,
    MergedOptions<Opts>
  >;
}

/**
 * A Vision Mode which can be selected for use by a Token.
 * The selected Vision Mode alters the appearance of various aspects of the canvas while that Token is the POV.
 */
declare class VisionMode extends DataModel<
  VisionMode.Schema,
  DataModel.Any | null,
  InterfaceToObject<VisionMode.ExtraConstructorOptions>
> {
  // A constructor override has been omitted as there are no typing changes

  static override defineSchema(): VisionMode.Schema;

  /** The lighting illumination levels which are supported. */
  static LIGHTING_LEVELS: typeof CONST.LIGHTING_LEVELS;

  /**
   * Flags for how each lighting channel should be rendered for the currently active vision modes:
   * - Disabled: this lighting layer is not rendered, the shaders does not decide.
   * - Enabled: this lighting layer is rendered normally, and the shaders can choose if they should be rendered or not.
   * - Required: the lighting layer is rendered, the shaders does not decide.
   */
  static LIGHTING_VISIBILITY: VisionMode.LightingVisibility;

  /**
   * A flag for whether this vision source is animated
   * @defaultValue `false`
   */
  animated: boolean;

  /**
   * Does this vision mode enable light sources?
   * True unless it disables lighting entirely.
   */
  get perceivesLight(): boolean;

  /**
   * Special activation handling that could be implemented by `VisionMode` subclasses
   * @param source - Activate this `VisionMode` for a specific source
   */
  protected _activate(source: PointVisionSource.Any): void;

  /**
   * Special deactivation handling that could be implemented by `VisionMode` subclasses
   * @param source - Deactivate this `VisionMode` for a specific source
   */
  protected _deactivate(source: PointVisionSource.Any): void;

  /**
   * Special handling which is needed when this Vision Mode is activated for a VisionSource.
   * @param source - Activate this `VisionMode` for a specific source
   */
  activate(source: PointVisionSource.Any): void;

  /**
   * Special handling which is needed when this Vision Mode is deactivated for a VisionSource.
   * @param source - Deactivate this `VisionMode` for a specific source
   */
  deactivate(source: PointVisionSource.Any): void;

  /**
   * An animation function which runs every frame while this Vision Mode is active.
   * @param dt - The deltaTime passed by the PIXI Ticker
   * @remarks Calls {@linkcode foundry.canvas.sources.RenderedEffectSource.animateTime | RenderedEffectSource#animateTime} with `this` set to this `VisionMode`
   */
  animate(dt: number): void;
}

declare namespace VisionMode {
  interface Any extends AnyVisionMode {}
  interface AnyConstructor extends Identity<typeof AnyVisionMode> {}

  type ConfiguredModes = ConcreteKeys<CONFIG["Canvas"]["visionModes"]>;

  type LIGHTING_VISIBILITY = Brand<number, "VisionMode.LIGHTING_VISIBILITY">;

  interface ExtraConstructorOptions {
    /** @defaultValue `false` */
    animated?: boolean | undefined;
  }

  interface LightingVisibility {
    /** Disabled: this lighting layer is not rendered, the shaders does not decide. */
    DISABLED: 0 & LIGHTING_VISIBILITY;

    /** Enabled: this lighting layer is rendered normally, and the shaders can choose if they should be rendered or not. */
    ENABLED: 1 & LIGHTING_VISIBILITY;

    /** Required: the lighting layer is rendered, the shaders does not decide. */
    REQUIRED: 2 & LIGHTING_VISIBILITY;
  }

  interface ShaderSchema extends fields.DataSchema {
    shader: ShaderField;
    uniforms: fields.ObjectField;
  }

  interface LightingTypeSchema extends fields.DataSchema {
    visibility: fields.NumberField;
    postProcessingModes: fields.ArrayField<fields.StringField>;
    uniforms: fields.ObjectField;
  }

  /** @privateRemarks Pulled out simplify creating {@linkcode LightingData} */
  interface LightingSchema extends fields.DataSchema {
    background: fields.SchemaField<LightingTypeSchema>;
    coloration: fields.SchemaField<LightingTypeSchema>;
    illumination: fields.SchemaField<LightingTypeSchema>;
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
  }

  type LightingLevels = Record<CONST.LIGHTING_LEVELS, CONST.LIGHTING_LEVELS>;
  type LightingMultipliers = Record<CONST.LIGHTING_LEVELS, number>;

  interface Schema extends fields.DataSchema {
    id: fields.StringField<{ blank: false }>;
    label: fields.StringField<{ blank: false }>;
    tokenConfig: fields.BooleanField<{ initial: true }>;
    canvas: fields.SchemaField<{
      shader: ShaderField;
      uniforms: fields.ObjectField;
    }>;
    lighting: fields.SchemaField<LightingSchema>;
    vision: fields.SchemaField<{
      background: fields.SchemaField<ShaderSchema>;
      coloration: fields.SchemaField<ShaderSchema>;
      illumination: fields.SchemaField<ShaderSchema>;
      darkness: fields.SchemaField<{
        adaptive: fields.BooleanField<{ initial: true }>;
      }>;
      defaults: fields.SchemaField<{
        color: fields.ColorField<{ required: false; initial: undefined }>;
        attenuation: fields.AlphaField<{ required: false; initial: undefined }>;
        brightness: fields.NumberField<{
          required: false;
          initial: undefined;
          nullable: false;
          min: -1;
          max: 1;
        }>;
        saturation: fields.NumberField<{
          required: false;
          initial: undefined;
          nullable: false;
          min: -1;
          max: 1;
        }>;
        contrast: fields.NumberField<{
          required: false;
          initial: undefined;
          nullable: false;
          min: -1;
          max: 1;
        }>;
      }>;
      preferred: fields.BooleanField<{ initial: false }>;
    }>;
  }

  interface LightingData extends fields.SchemaField.InitializedData<LightingSchema> {}

  interface CreateData extends fields.SchemaField.CreateData<Schema> {}

  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  interface SourceData extends fields.SchemaField.SourceData<Schema> {}
}

export { VisionMode as default, ShaderField };

declare class AnyVisionMode extends VisionMode {
  constructor(...args: never);
}
