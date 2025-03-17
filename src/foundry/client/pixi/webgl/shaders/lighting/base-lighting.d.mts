import type { Identity } from "../../../../../../utils/index.d.mts";

declare global {
  /**
   * This class defines an interface which all adaptive lighting shaders extend.
   */
  class AdaptiveLightingShader extends AbstractBaseShader {
    /**
     * Has this lighting shader a forced default color?
     * @defaultValue `false`
     */
    static forceDefaultColor: boolean;

    /**
     * Called before rendering.
     * */
    update(): void;

    /**
     * Common attributes for vertex shaders.
     */
    static VERTEX_ATTRIBUTES: string;

    /**
     * Common uniforms for vertex shaders.
     */
    static VERTEX_UNIFORMS: string;

    /**
     * Common varyings shared by vertex and fragment shaders.
     */
    static VERTEX_FRAGMENT_VARYINGS: string;

    /**
     * Common functions used by the vertex shaders.
     * @remarks Foundry labeled as abstract
     */
    static VERTEX_FUNCTIONS: string;

    /**
     * Common uniforms shared by fragment shaders.
     */
    static FRAGMENT_UNIFORMS: string;

    /**
     * Common functions used by the fragment shaders.
     * @remarks Foundry labeled as abstract but provided a default value?
     */
    static FRAGMENT_FUNCTIONS: string;

    static override CONSTANTS: string;

    static override vertexShader: string;

    /**
     * Construct adaptive shader according to shader type
     * @param shaderType - shader type to construct : coloration, illumination, background, etc.
     * @returns the constructed shader adaptive block
     */
    static getShaderTechniques(shaderType: AdaptiveLightingShader.ShaderTypes): string;

    /**
     * The coloration technique coloration shader fragment
     */
    static get COLORATION_TECHNIQUES(): string;

    /**
     * The coloration technique illumination shader fragment
     */
    static get ILLUMINATION_TECHNIQUES(): string;

    /**
     * The coloration technique background shader fragment
     */
    static get BACKGROUND_TECHNIQUES(): string;

    /**
     * The adjustments made into fragment shaders
     */
    static get ADJUSTMENTS(): string;

    /**
     * Contrast adjustment
     */
    static CONTRAST: string;

    /**
     * Saturation adjustment
     */
    static SATURATION: string;

    /**
     * Exposure adjustment
     */
    static EXPOSURE: string;

    /**
     * Switch between an inner and outer color, by comparing distance from center to ratio
     * Apply a strong gradient between the two areas if attenuation uniform is set to true
     */
    static SWITCH_COLOR: string;

    /**
     * Shadow adjustment
     */
    static SHADOW: string;

    /**
     * Transition between bright and dim colors, if requested
     */
    static TRANSITION: string;

    /**
     * Incorporate falloff if a attenuation uniform is requested
     */
    static FALLOFF: string;

    /**
     * Compute illumination uniforms
     */
    static COMPUTE_ILLUMINATION: string;

    /**
     * Initialize fragment with common properties
     */
    static FRAGMENT_BEGIN: string;

    /**
     * Shader final
     */
    static FRAGMENT_END: string;

    /**
     * A mapping of available coloration techniques
     * @privateRemarks This type would have at least the `id` keys Branded if not for subclasses overriding the entries
     */
    static SHADER_TECHNIQUES: Record<string, AdaptiveLightingShader.ShaderTechnique>;

    /**
     * Determine the correct penalty to apply for a given darkness level and luminosity
     * @param darknessLevel - The current darkness level on [0,1]
     * @param luminosity    - The light source luminosity on [-1,1]
     * @returns 0
     * @deprecated since v12, until v14
     * @remarks AdaptiveLightingShader#getDarknessPenalty is deprecated without replacement.
     * The darkness penalty is no longer applied on light and vision sources.
     */
    getDarknessPenalty(darknessLevel: number, luminosity: number): number;
  }

  namespace AdaptiveLightingShader {
    interface Any extends AnyAdaptiveLightingShader {}
    interface AnyConstructor extends Identity<typeof AnyAdaptiveLightingShader> {}

    type ShaderTypes = "coloration" | "illumination" | "background" | (string & {});

    interface ShaderTechnique {
      /** The numeric identifier of the technique */
      id: number;

      /** The localization string that labels the technique */
      label: string;

      /**  The coloration shader fragment when the technique is used */
      coloration?: string | undefined;

      /** The illumination shader fragment when the technique is used */
      illumination?: string | undefined;

      /** The background shader fragment when the technique is used */
      background?: string | undefined;
    }
  }
}

declare abstract class AnyAdaptiveLightingShader extends AdaptiveLightingShader {
  constructor(arg0: never, ...args: never[]);
}
