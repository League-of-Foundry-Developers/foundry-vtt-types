import type { BatchGeometry } from "pixi.js";

export {};

declare global {
  /**
   * The shader definition which powers the TokenRing.
   */
  class TokenRingSamplerShader extends PrimaryBaseSamplerShader {
    /**
     * @defaultValue `"tokenRingBatch"`
     */
    static override classPluginName: string;

    static override batchGeometry: typeof BatchGeometry;

    /**
     * @defaultValue `super.batchVertexSize + 11`
     */
    static override batchVertexSize: number;

    /**
     * @defaultValue `super.reservedTextureUnits + 1`
     */
    static override reservedTextureUnits: number;

    /**
     * A null UVs array used for nulled texture position.
     * @defaultValue `[0, 0, 0, 0, 0, 0, 0, 0]`
     */
    static nullUvs: Float32Array;

    static override batchDefaultUniforms(maxTex: AbstractBaseShader.UniformValue): AbstractBaseShader.Uniforms;

    protected static override _preRenderBatch(): ((batchRenderer: typeof BatchRenderer) => void) | undefined;

    protected static override _packInterleavedGeometry(
      element: PIXI.IBatchableElement,
      attributeBuffer: PIXI.ViewableBuffer,
      indexBuffer: Uint16Array,
      aIndex: number,
      iIndex: number,
    ): void;

    protected static override _batchVertexShader: string;

    protected static override _batchFragmentShader: string;
  }
}