import type { ConfiguredObjectClassForName } from "../../../../types/helperTypes";

declare global {
  interface VisionSourceData extends Exclude<PointSource.Data, "walls"> {
    x: number;

    y: number;

    /** An optional z-index sorting for the source */
    z: number;

    /** The angle of rotation for this point source */
    rotation: number;

    /** The angle of emission for this point source */
    angle: number;

    /** The allowed radius of bright vision or illumination */
    bright: number;

    /** The allowed radius of dim vision or illumination */
    dim: number;
  }

  /**
   * A specialized subclass of the PointSource abstraction which is used to control the rendering of vision sources.
   */
  class VisionSource extends PointSource {
    /** @param object - The Token object that generates this vision source */
    constructor(object: InstanceType<ConfiguredObjectClassForName<"Token">>);

    /**
     * The current vision mesh for this source
     * @defaultValue `this._createMesh(AdaptiveIlluminationShader)`
     */
    illumination: PIXI.Mesh;

    static override sourceType: "vision";

    /**
     * Keys in the VisionSourceData structure which, when modified, change the appearance of the source
     * @defaultValue `["dim", "bright"]`
     * @internal
     */
    protected static _appearanceKeys: string[];

    /**
     * The object of data which configures how the source is rendered
     * @defaultValue `{}`
     */
    data: Partial<VisionSourceData>;

    /**
     * The ratio of dim:bright as part of the source radius
     * @defaultValue `undefined`
     */
    ratio: number | undefined;

    /**
     * The rendered field-of-vision texture for the source for use within shaders.
     * @defaultValue `undefined`
     */
    fovTexture: PIXI.RenderTexture | undefined;

    /**
     * Track which uniforms need to be reset
     * @defaultValue `{ illumination: true }`
     * @internal
     */
    protected _resetUniforms: { illumination: boolean };

    /**
     * To track if a source is temporarily shutdown to avoid glitches
     * @defaultValue `{ illumination: false }`
     * @internal
     */
    protected _shutdown: { illumination: boolean };

    /**
     * Initialize the source with provided object data.
     * @param data - Initial data provided to the point source
     * @returns A reference to the initialized source
     */
    initialize(data?: Partial<VisionSourceData>): this;

    fov?: PIXI.Circle;

    /**
     * Initialize the blend mode and vertical sorting of this source relative to others in the container.
     * @internal
     */
    protected _initializeBlending(): void;

    /**
     * Process new input data provided to the LightSource.
     * @param data - Initial data provided to the vision source
     * @returns The changes compared to the prior data
     * @internal
     */
    protected _initializeData(data: Partial<VisionSourceData>): Partial<VisionSourceData>;

    /**
     * Draw the display of this source to remove darkness from the LightingLayer illumination container.
     * @see LightSource#drawLight
     * @returns The rendered light container
     */
    drawVision(): PIXI.Container | null;

    /**
     * Draw a Container used for exploring the FOV area of Token sight in the SightLayer
     */
    drawSight(): PIXI.Container;

    /**
     * Update shader uniforms by providing data from this PointSource
     * @param shader - The shader being updated
     * @internal
     */
    protected _updateIlluminationUniforms(shader: AdaptiveIlluminationShader): void;

    protected override _drawRenderTextureContainer(): PIXI.Container;
  }
}
