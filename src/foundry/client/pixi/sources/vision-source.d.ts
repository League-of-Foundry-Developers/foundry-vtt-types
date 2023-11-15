import type { ConfiguredObjectClassForName } from "../../../../types/helperTypes";
import type { VisionMode } from "../../config";
// TODO: After #2084
// import type { AdaptiveVisionShader } from "../webgl/shaders/vision"
type AdaptiveVisionShader = unknown;

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

    /** The allowed radius of vision */
    radius: number;

    /**  A secondary radius used for limited angles */
    externalRadius: number;

    /** Is this vision source a temporary preview? */
    isPreview: boolean;
  }

  /**
   * A specialized subclass of the PointSource abstraction which is used to control the rendering of vision sources.
   */
  class VisionSource extends PointSource {
    /** @param object - The Token object that generates this vision source */
    constructor(object: InstanceType<ConfiguredObjectClassForName<"Token">>);

    /** The current background mesh for this source */
    background: PIXI.Mesh | null;

    /** The current vision illumination mesh for this source */
    illumination: PIXI.Mesh | null;

    /** The current vision coloration mesh for this source  */
    coloration: PIXI.Mesh | null;

    /** The vision mode linked to this VisionSource */
    visionMode: VisionMode | null;

    static override sourceType: "sight";

    /**
     * Keys in the VisionSourceData structure which, when modified, change the appearance of the source
     * @defaultValue `["radius", "color", "attenuation", "brightness", "contrast", "saturation", "visionMode"]`
     * @internal
     */
    protected static _appearanceKeys: string[];

    static override EDGE_OFFSET: -2;

    /**
     * The object of data which configures how the source is rendered
     * @defaultValue `{}`
     */
    data: Partial<VisionSourceData>;

    /** The constrained LOS polygon that is generated by the origin and radius of this source. */
    fov: PointSourcePolygon;

    /**
     * Track which uniforms need to be reset
     * @defaultValue `{ background: false, illumination: false, coloration: false }`
     * @internal
     */
    protected _resetUniforms: { background: boolean; illumination: boolean; coloration: boolean };

    /**
     * To track if a source is temporarily shutdown to avoid glitches
     * @defaultValue `{ background: false, illumination: false, coloration: false }`
     * @internal
     */
    protected _shutdown: { background: boolean; illumination: boolean; coloration: boolean };

    /** Is this VisionSource a temporary preview which should not produce fog exploration? */
    get isPreview(): boolean;

    /**
     * Initialize the source with provided object data.
     * @param data - Initial data provided to the point source
     * @returns A reference to the initialized source
     */
    initialize(data?: Partial<VisionSourceData>): this;

    /** Responsible for assigning the Vision Mode and handling exceptions based on vision special status. */
    protected _initializeVisionMode(): void;

    /** If this vision source background is rendered into the lighting container. */
    get preferred(): boolean;

    /** {@inheritdoc} */
    override _getPolygonConfiguration(): PointSourcePolygonConfig;

    /** Create a restricted FOV polygon by limiting the radius of the unrestricted LOS polygon. */
    protected _createRestrictedPolygon(): PointSourcePolygon;

    /**
     * Initialize the shaders used for this source, swapping to a different shader if the vision effect has changed.
     * @internal
     */
    protected _initializeShaders(): void;

    /**
     * Initialize the blend mode and vertical sorting of this source relative to others in the container.
     * @internal
     */
    protected _initializeBlending(): void;

    /**
     * Process new input data provided to the LightSource.
     * @param data - Initial data provided to the vision source
     * @returns      The changes compared to the prior data
     * @internal
     */
    protected _initializeData(data: Partial<VisionSourceData>): Partial<VisionSourceData>;

    /** {@inheritdoc} */
    _createMeshes(): void;

    /** {@inheritdoc} */
    destroy(): void;

    /** {@inheritdoc} */
    refreshSource(): void;

    /**
     * Render the containers used to represent this light source within the LightingLayer.
     */
    drawMeshes(): VisionSource.LightContainer;

    /**
     * Draw the background mesh which provide special vision.
     * @returns The rendered light container
     */
    drawBackground(): PIXI.Mesh | null;

    /**
     * Draw the illumination mesh which provide vision.
     * @returns The rendered light container
     */
    drawVision(): PIXI.Mesh | null;

    /**
     * Draw and return a container used to depict the visible color tint of the light source on the LightingLayer
     * @returns An updated color container for the source
     */
    drawColor(): PIXI.Mesh | null;

    /* -------------------------------------------- */
    /*  Shader Management                           */
    /* -------------------------------------------- */

    /** Update all layer uniforms. */
    protected _updateUniforms(): void;

    /**
     * Update shader uniforms by providing data from this PointSource
     * @internal
     */
    protected _updateColorationUniforms(): void;

    /**
     * Update shader uniforms by providing data from this PointSource
     * @internal
     */
    protected _updateIlluminationUniforms(): void;

    /**
     * Update shader uniforms by providing data from this PointSource
     * @internal
     */
    protected _updateBackgroundUniforms(): void;

    /**
     * Update shader uniforms shared by all shader types
     * @param shader - The shader being updated
     * @internal
     */
    _updateCommonUniforms(shader: AdaptiveVisionShader): void;

    /**
     * Generic time animation with Vision Sources.
     * @param  dt - Delta time.
     */
    animateTime(dt): void;
  }
}

declare namespace VisionSource {
  interface LightContainer {
    background: PIXI.Mesh | null;
    vision: PIXI.Mesh | null;
    color: PIXI.Mesh | null;
  }
}
