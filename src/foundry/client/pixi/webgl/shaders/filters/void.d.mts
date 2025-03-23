import type { Identity } from "../../../../../../utils/index.d.mts";

declare global {
  /**
   * A minimalist filter (just used for blending)
   */
  class VoidFilter extends AbstractBaseFilter {
    static override fragmentShader: string;
  }

  namespace VoidFilter {
    interface Any extends AnyVoidFilter {}
    interface AnyConstructor extends Identity<typeof AnyVoidFilter> {}
  }
}

declare abstract class AnyVoidFilter extends VoidFilter {
  constructor(...args: never);
}
