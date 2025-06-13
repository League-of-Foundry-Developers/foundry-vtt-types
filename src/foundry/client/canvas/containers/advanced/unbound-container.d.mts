import type { Identity } from "#utils";
import type { UnboundTransform } from "#client/canvas/geometry/_module.d.mts";

/**
 * UnboundContainers behave like PIXI.Containers except that they are not bound to their parent's transforms.
 * However, they normally propagate their own transformations to their children.
 */
declare class UnboundContainer extends PIXI.Container {
  transform: UnboundTransform;
}

declare namespace UnboundContainer {
  interface Any extends AnyUnboundContainer {}
  interface AnyConstructor extends Identity<typeof AnyUnboundContainer> {}
}

export default UnboundContainer;

declare abstract class AnyUnboundContainer extends UnboundContainer {
  constructor(...args: never);
}
