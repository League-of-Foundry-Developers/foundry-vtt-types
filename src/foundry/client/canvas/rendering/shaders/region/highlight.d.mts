import type { Identity } from "#utils";
import type { AbstractBaseShader, RegionShader } from "../_module.mjs";

/**
 * Shader for the Region highlight.
 */
declare class HighlightRegionShader extends RegionShader {
  /**
   * @defaultValue
   * ```
   *  `\
   *   precision ${PIXI.settings.PRECISION_VERTEX} float;
   *
   *   ${this.CONSTANTS}
   *
   *   attribute vec2 aVertexPosition;
   *
   *   uniform mat3 translationMatrix;
   *   uniform mat3 projectionMatrix;
   *   uniform vec2 canvasDimensions;
   *   uniform vec4 sceneDimensions;
   *   uniform vec2 screenDimensions;
   *   uniform mediump float hatchThickness;
   *
   *   varying vec2 vCanvasCoord; // normalized canvas coordinates
   *   varying vec2 vSceneCoord; // normalized scene coordinates
   *   varying vec2 vScreenCoord; // normalized screen coordinates
   *   varying float vHatchOffset;
   *
   *   void main() {
   *     vec2 pixelCoord = aVertexPosition;
   *     vCanvasCoord = pixelCoord / canvasDimensions;
   *     vSceneCoord = (pixelCoord - sceneDimensions.xy) / sceneDimensions.zw;
   *     vec3 tPos = translationMatrix * vec3(aVertexPosition, 1.0);
   *     vScreenCoord = tPos.xy / screenDimensions;
   *     gl_Position = vec4((projectionMatrix * tPos).xy, 0.0, 1.0);
   *     vHatchOffset = (pixelCoord.x + pixelCoord.y) / (SQRT2 * 2.0 * hatchThickness);
   *   }
   *  `
   * ```
   */
  static override vertexShader: string;

  /**
   * @defaultValue
   * ```
   *  `\
   *   precision ${PIXI.settings.PRECISION_FRAGMENT} float;
   *
   *   varying float vHatchOffset;
   *
   *   uniform vec4 tintAlpha;
   *   uniform float resolution;
   *   uniform bool hatchEnabled;
   *   uniform mediump float hatchThickness;
   *
   *   void main() {
   *     gl_FragColor = tintAlpha;
   *     if ( !hatchEnabled ) return;
   *     float x = abs(vHatchOffset - floor(vHatchOffset + 0.5)) * 2.0;
   *     float s = hatchThickness * resolution;
   *     float y0 = clamp((x + 0.5) * s + 0.5, 0.0, 1.0);
   *     float y1 = clamp((x - 0.5) * s + 0.5, 0.0, 1.0);
   *     gl_FragColor *= mix(0.3333, 1.0, y0 - y1);
   *   }
   *  `
   * ```
   */
  static override fragmentShader: string;

  /**
   * @defaultValue
   * ```js
   * {
   *   ...super.defaultUniforms,
   *   resolution: 1,
   *   hatchEnabled: false,
   *   hatchThickness: 1
   * }
   * ```
   */
  static override defaultUniforms: AbstractBaseShader.Uniforms;

  protected override _preRender: AbstractBaseShader.PreRenderFunction;
}

declare namespace HighlightRegionShader {
  interface Any extends AnyHighlightRegionShader {}
  interface AnyConstructor extends Identity<typeof AnyHighlightRegionShader> {}
}

export default HighlightRegionShader;

declare abstract class AnyHighlightRegionShader extends HighlightRegionShader {
  constructor(...args: never);
}
