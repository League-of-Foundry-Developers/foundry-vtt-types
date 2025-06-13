import type { Identity } from "#utils";

/**
 * A custom Transform class which is not bound to the parent worldTransform.
 * localTransform are working as usual.
 */
declare class UnboundTransform extends PIXI.Transform {
  static override IDENTITY: UnboundTransform;

  override updateTransform(parentTransform: PIXI.Transform): void;
}

declare namespace UnboundTransform {
  interface Any extends AnyUnboundTransform {}
  interface AnyConstructor extends Identity<typeof AnyUnboundTransform> {}
}

export default UnboundTransform;

declare abstract class AnyUnboundTransform extends UnboundTransform {
  constructor(...args: never);
}
