import type { AnyObject } from "../../../../types/utils.d.mts";

declare global {
  /**
   * A custom Transform class allowing to observe changes with a callback.
   * @privateRemarks Scope extends object is intentional; `"The scope bound to an ObservableTransform class must be a valid object/class."`
   */
  class ObservableTransform<CB extends (this: Scope) => unknown, Scope extends AnyObject> extends PIXI.Transform {
    /**
     *
     * @param callback - The callback called to observe changes.
     * @param scope    - The scope of the callback.
     */
    constructor(callback: CB, scope: Scope);

    /**
     * The callback which is observing the changes.
     */
    cb: CB;

    /**
     * The scope of the callback.
     */
    scope: Scope;

    protected override onChange(): void;

    protected override updateSkew(): void;
  }
  namespace ObservableTransform {
    type AnyConstructor = typeof AnyObservableTransform;
  }
}

declare abstract class AnyObservableTransform extends ObservableTransform<any, any> {
  constructor(arg0: never, ...args: never[]);
}
