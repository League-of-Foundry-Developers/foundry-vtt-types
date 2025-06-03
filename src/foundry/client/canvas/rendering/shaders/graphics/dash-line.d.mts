import type { Identity, InexactPartial } from "#utils";

/**
 * A modified version of the PIXI.smooth.DashLineShader that supports an offset.
 * @internal
 */
declare class DashLineShader extends PIXI.smooth.SmoothGraphicsShader {
  /**
   * @param options - The options
   */
  constructor(options?: DashLineShader.ConstructorOptions);

  static #DashLineShader: true;
}

declare namespace DashLineShader {
  interface Any extends AnyDashLineShader {}
  interface AnyConstructor extends Identity<typeof AnyDashLineShader> {}

  /** @internal */
  type _ConstructorOptions = InexactPartial<{
    /**
     * The length of the dash
     * @defaultValue `8.0`
     */
    dash: number;

    /**
     * The length of the gap
     * @defaultValue `5.0`
     */
    gap: number;

    /**
     * The offset of the dashes
     * @defaultValue `0.0`
     */
    offset: number;
  }>;

  interface ConstructorOptions extends _ConstructorOptions {}
}

export default DashLineShader;

declare abstract class AnyDashLineShader extends DashLineShader {
  constructor(...args: never);
}
