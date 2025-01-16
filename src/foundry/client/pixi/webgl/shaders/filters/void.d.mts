export {};

declare global {
  /**
   * A minimalist filter (just used for blending)
   */
  class VoidFilter extends AbstractBaseFilter {
    static override fragmentShader: string;
  }

  namespace VoidFilter {
    interface Any extends AnyVoidFilter {}
    type AnyConstructor = typeof AnyVoidFilter;
  }
}

declare abstract class AnyVoidFilter extends VoidFilter {
  constructor(arg0: never, ...args: never[]);
}
