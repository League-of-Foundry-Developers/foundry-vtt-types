import type { Transform } from "pixi.js";

declare global {
  /**
   * UnboundContainers behave like PIXI.Containers except that they are not bound to their parent's transforms.
   * However, they normally propagate their own transformations to their children.
   */
  class UnboundContainer extends PIXI.Container {
    transform: UnboundTransform;
  }

  /**
   * A custom Transform class which is not bound to the parent worldTransform.
   * localTransform are working as usual.
   */
  class UnboundTransform extends PIXI.Transform {
    static override IDENTITY: UnboundTransform;

    override updateTransform(parentTransform: Transform): void;
  }
}
