import type { BASIS as _BASIS } from "@pixi/basis";

declare global {
  /**
   * @remarks The factory for the Basis Universal transcoder, `v2_1_0`. Foundry bundles it at
   * `scripts/ktx2/basis_transcoder.js` and loads it through
   * {@linkcode foundry.canvas.TextureLoader.initializeBasisTranscoder}.
   */
  var BASIS: _BASIS;
}
