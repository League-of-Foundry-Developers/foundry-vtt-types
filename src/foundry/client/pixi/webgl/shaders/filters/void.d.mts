export {};

declare abstract class AnyVoidFilter extends VoidFilter {
  constructor(arg0: never, ...args: never[]);
}

declare global {
  namespace VoidFilter {
    type AnyConstructor = typeof AnyVoidFilter;
  }

  /**
   * A minimalist filter (just used for blending)
   */
  class VoidFilter extends AbstractBaseFilter {
    static override fragmentShader: string;
  }
}
