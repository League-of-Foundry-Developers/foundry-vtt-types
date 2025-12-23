import type { AnyObject, Brand, ConcreteKeys, Identity, InterfaceToObject } from "#utils";
import type { fields } from "#common/data/_module.d.mts";
import type { DataModel } from "#common/abstract/_module.d.mts";
import type { PointVisionSource } from "#client/canvas/sources/_module.d.mts";
import type { fields as clientFields } from "#client/data/_module.d.mts";

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
  protected _activate(source: PointVisionSource.Internal.Any): void;

  /**
   * Special deactivation handling that could be implemented by `VisionMode` subclasses
   * @param source - Deactivate this `VisionMode` for a specific source
   */
  protected _deactivate(source: PointVisionSource.Internal.Any): void;

  /**
   * Special handling which is needed when this Vision Mode is activated for a VisionSource.
   * @param source - Activate this `VisionMode` for a specific source
   */
  activate(source: PointVisionSource.Internal.Any): void;

  /**
   * Special handling which is needed when this Vision Mode is deactivated for a VisionSource.
   * @param source - Deactivate this `VisionMode` for a specific source
   */
  deactivate(source: PointVisionSource.Internal.Any): void;

  /**
   * An animation function which runs every frame while this Vision Mode is active.
   * @param dt - The deltaTime passed by the PIXI Ticker
   * @deprecated Always throws as of 13.346, see remarks
   * @remarks Calls {@linkcode foundry.canvas.sources.RenderedEffectSource.animateTime | RenderedEffectSource#animateTime} with `this` set to this {@linkcode VisionMode}
   * @throws Because of the above, as of 13.346 this will **always** throw: it tries to access `this.animation.seed`, but `VisionMode`s don't have an `#animation` object.
   * See {@link https://github.com/foundryvtt/foundryvtt/issues/13227}.
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
    shader: clientFields.ShaderField;
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
        validate: (o: AnyObject) => o is LightingLevels;
        validationError: "may only contain a mapping of keys from VisionMode.LIGHTING_LEVELS";
      },
      LightingLevels,
      LightingLevels,
      LightingLevels
    >;
    multipliers: fields.ObjectField<
      {
        validate: (o: AnyObject) => o is LightingMultipliers;
        validationError: "must provide a mapping of keys from VisionMode.LIGHTING_LEVELS to numeric multiplier values";
      },
      LightingMultipliers,
      LightingMultipliers,
      LightingMultipliers
    >;
  }

  type LightingLevels = Record<CONST.LIGHTING_LEVELS | `${CONST.LIGHTING_LEVELS}`, CONST.LIGHTING_LEVELS>;
  type LightingMultipliers = Record<CONST.LIGHTING_LEVELS | `${CONST.LIGHTING_LEVELS}`, number>;

  interface Schema extends fields.DataSchema {
    id: fields.StringField<{ blank: false }>;
    label: fields.StringField<{ blank: false }>;
    tokenConfig: fields.BooleanField<{ initial: true }>;
    canvas: fields.SchemaField<{
      shader: clientFields.ShaderField;
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

/**
 * @deprecated "Kept here for full compatibility" (since v13, until v14)
 * @remarks Access via {@linkcode foundry.data.fields.ShaderField} instead
 */
declare const ShaderField: clientFields.ShaderField;

export {
  VisionMode as default,
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  ShaderField,
};

declare class AnyVisionMode extends VisionMode {
  constructor(...args: never);
}
