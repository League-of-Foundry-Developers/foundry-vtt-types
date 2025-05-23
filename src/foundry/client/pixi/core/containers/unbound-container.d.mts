import type { Identity } from "#utils";

declare global {
  /**
   * UnboundContainers behave like PIXI.Containers except that they are not bound to their parent's transforms.
   * However, they normally propagate their own transformations to their children.
   */
  class UnboundContainer extends PIXI.Container {
    transform: UnboundTransform;
  }

  namespace UnboundContainer {
    interface Any extends AnyUnboundContainer {}
    interface AnyConstructor extends Identity<typeof AnyUnboundContainer> {}
  }

  /**
   * A custom Transform class which is not bound to the parent worldTransform.
   * localTransform are working as usual.
   */
  class UnboundTransform extends PIXI.Transform {
    static override IDENTITY: UnboundTransform;

    override updateTransform(parentTransform: PIXI.Transform): void;
  }

  namespace UnboundTransform {
    interface Any extends AnyUnboundTransform {}
    interface AnyConstructor extends Identity<typeof AnyUnboundTransform> {}
  }
}

declare abstract class AnyUnboundContainer extends UnboundContainer {
  constructor(...args: never);
}

declare abstract class AnyUnboundTransform extends UnboundTransform {
  constructor(...args: never);
}
