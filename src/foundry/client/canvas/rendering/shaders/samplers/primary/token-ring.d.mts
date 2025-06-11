import type { Identity, NullishProps } from "#utils";
import type { TokenRing } from "#client/canvas/placeables/tokens/_module.d.mts";
import type { OccludableSamplerShader, PrimaryBaseSamplerShader } from "../../_module.mjs";
import type { BatchRenderer } from "../../../batching/_module.mjs";

/**
 * The shader definition which powers the TokenRing.
 */
declare class TokenRingSamplerShader extends PrimaryBaseSamplerShader {
  /**
   * @defaultValue `"tokenRingBatch"`
   */
  static override classPluginName: string;

  static override batchGeometry: typeof PIXI.BatchGeometry;

  /**
   * @defaultValue `super.batchVertexSize + 14`
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

  static override batchDefaultUniforms: BatchRenderer.BatchDefaultUniformsFunction;

  protected static override _preRenderBatch: BatchRenderer.PreRenderBatchFunction;

  protected static override _packInterleavedGeometry(
    /**
     * @privateRemarks Calls super, which is the grandparent class in this case, with no new keys
     */
    element: TokenRingSamplerShader.BatchData,
    attributeBuffer: PIXI.ViewableBuffer,
    indexBuffer: Uint16Array,
    aIndex: number,
    iIndex: number,
  ): void;

  protected static override _batchVertexShader: string;

  protected static override _batchFragmentShader: string;

  static #TokenRingSamplerShader: true;
}

declare namespace TokenRingSamplerShader {
  interface Any extends AnyTokenRingSamplerShader {}
  interface AnyConstructor extends Identity<typeof AnyTokenRingSamplerShader> {}

  /** @internal */
  type RingContainerObject = NullishProps<{
    object: NullishProps<{
      ring: TokenRing;
    }>;
  }>;

  interface BatchData extends OccludableSamplerShader.OccludableBatchData {
    /**
     * @remarks This key is required to be an object as `TokenRingSamplerShader._packInterleavedGeometry` does `element.object.object || {}`.
     * All `TokenRing` keys are then accessed via optional chaining with `??` defaults.
     */
    object: RingContainerObject;
  }
}

export default TokenRingSamplerShader;

declare abstract class AnyTokenRingSamplerShader extends TokenRingSamplerShader {
  constructor(...args: never);
}
