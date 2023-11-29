export {};

// TODO: Remove after foundry.abstract.DataModel is defined
// Currently that is in PR #2331 (branch v10/non-inferring-data-fields
declare namespace foundry {
  namespace data {
    namespace fields {
      class DataField {
        static get _defaults(): Record<string, unknown>;

        _cast(value: any): any;
      }
    }
  }
  namespace abstract {
    class DataModel {}
  }
}

declare global {
  class ShaderField extends foundry.data.fields.DataField {
    /**
     * @defaultValue
     * ```typescript
     * const defaults = super._defaults;
     * defaults.nullable = true;
     * defaults.initial = undefined;
     * return defaults;
     * ```
     */
    static override get _defaults(): Record<string, unknown>;

    /** @remarks "The value provided to a ShaderField must be an AbstractBaseShader subclass." */
    override _cast(value: any): AbstractBaseShader | Error;
  }

  /**
   * A Vision Mode which can be selected for use by a Token.
   * The selected Vision Mode alters the appearance of various aspects of the canvas while that Token is the POV.
   */
  abstract class VisionMode extends foundry.abstract.DataModel {
    /**
     * Construct a Vision Mode using provided configuration parameters and callback functions.
     * @param data    - Data which fulfills the model defined by the VisionMode schema.
     * @param options - Additional options passed to the DataModel constructor.
     */
    constructor(data: Partial<any>, options?: object);

    /** {@inheritDoc} */
    static defineSchema(): any;

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
    abstract _activate(source: VisionSource): void;

    /**
     * Special deactivation handling that could be implemented by VisionMode subclasses
     * @param source - Deactivate this VisionMode for a specific source
     */
    abstract _deactivate(source: VisionSource): void;

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
}
