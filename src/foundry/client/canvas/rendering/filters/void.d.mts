import type { Identity } from "#utils";
import type { AbstractBaseFilter } from "./_module.d.mts";

/**
 * A minimalist filter (just used for blending)
 */
declare class VoidFilter extends AbstractBaseFilter {
  static override fragmentShader: string;
}

declare namespace VoidFilter {
  interface Any extends AnyVoidFilter {}
  interface AnyConstructor extends Identity<typeof AnyVoidFilter> {}
}

export default VoidFilter;

declare abstract class AnyVoidFilter extends VoidFilter {
  constructor(...args: never);
}
