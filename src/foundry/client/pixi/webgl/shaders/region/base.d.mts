import type { Identity } from "fvtt-types/utils";

declare global {
  /**
   * The shader used by {@link RegionMesh | `RegionMesh`}.
   */
  class RegionShader extends AbstractBaseShader {
    /**
     * @defaultValue
     * ```
     *  `
     *   precision ${PIXI.settings.PRECISION_VERTEX} float;
     *
     *   attribute vec2 aVertexPosition;
     *
     *   uniform mat3 translationMatrix;
     *   uniform mat3 projectionMatrix;
     *   uniform vec2 canvasDimensions;
     *   uniform vec4 sceneDimensions;
     *   uniform vec2 screenDimensions;
     *
     *   varying vec2 vCanvasCoord; // normalized canvas coordinates
     *   varying vec2 vSceneCoord; // normalized scene coordinates
     *   varying vec2 vScreenCoord; // normalized screen coordinates
     *
     *   void main() {
     *     vec2 pixelCoord = aVertexPosition;
     *     vCanvasCoord = pixelCoord / canvasDimensions;
     *     vSceneCoord = (pixelCoord - sceneDimensions.xy) / sceneDimensions.zw;
     *     vec3 tPos = translationMatrix * vec3(aVertexPosition, 1.0);
     *     vScreenCoord = tPos.xy / screenDimensions;
     *     gl_Position = vec4((projectionMatrix * tPos).xy, 0.0, 1.0);
     *   }
     *  `
     * ```
     */
    static override vertexShader: string;

    /**
     * @defaultValue
     * ```
     *  `
     *   precision ${PIXI.settings.PRECISION_FRAGMENT} float;
     *
     *   uniform vec4 tintAlpha;
     *
     *   void main() {
     *     gl_FragColor = tintAlpha;
     *   }
     *  `
     * ```
     */
    static override fragmentShader: string;

    /**
     * @defaultValue
     * ```js
     * {
     *   canvasDimensions: [1, 1],
     *   sceneDimensions: [0, 0, 1, 1],
     *   screenDimensions: [1, 1],
     *   tintAlpha: [1, 1, 1, 1]
     * }
     * ```
     */
    static override defaultUniforms: AbstractBaseShader.Uniforms;

    protected override _preRender: AbstractBaseShader.PreRenderFunction;
  }

  namespace RegionShader {
    interface Any extends AnyRegionShader {}
    interface AnyConstructor extends Identity<typeof AnyRegionShader> {}
  }
}

declare abstract class AnyRegionShader extends RegionShader {
  constructor(...args: never);
}
