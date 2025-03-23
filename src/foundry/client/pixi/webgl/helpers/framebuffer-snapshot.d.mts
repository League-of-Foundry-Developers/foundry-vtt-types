import type { Identity } from "fvtt-types/utils";

declare global {
  /**
   * Provide the necessary methods to get a snapshot of the framebuffer into a render texture.
   * Class meant to be used as a singleton.
   * Created with the precious advices of dev7355608.
   */
  class FramebufferSnapshot {
    /**
     * The RenderTexture that is the render destination for the framebuffer snapshot.
     */
    framebufferTexture: PIXI.RenderTexture;

    /**
     * Get the framebuffer texture snapshot.
     * @param renderer - The renderer for this context.
     * @returns The framebuffer snapshot.
     */
    getFramebufferTexture(renderer: PIXI.Renderer): PIXI.RenderTexture;
  }

  namespace FramebufferSnapshot {
    interface Any extends AnyFramebufferSnapshot {}
    interface AnyConstructor extends Identity<typeof AnyFramebufferSnapshot> {}
  }
}

declare abstract class AnyFramebufferSnapshot extends FramebufferSnapshot {
  constructor(...args: never);
}
