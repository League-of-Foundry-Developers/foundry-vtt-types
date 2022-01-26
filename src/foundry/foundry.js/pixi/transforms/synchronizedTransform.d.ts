/**
 * An extension of PIXI.Transform.
 * This uses a different DisplayObject than the current parent as the reference for the worldTransform.
 */
declare class SynchronizedTransform extends PIXI.Transform {
  constructor(transform: PIXI.Transform);

  /**
   * A list of attributes from the transform reference which should be synchronized
   * @defaultValue
   * ```javascript
   * [
   *   "localTransform", "position", "scale", "pivot", "skew", "_rotation",
   *   "_cx", "_sx", "_cy", "_sy", "_localID", "_currentLocalID"
   * ];
   * ```
   */
  static synchronizedAttributes: string[];

  /**
   * A Transform instance which defines the reference point for the worldTransform
   */
  get reference(): PIXI.Transform;

  set reference(value: PIXI.Transform);

  /** @internal */
  protected _reference: PIXI.Transform;

  /** @internal */
  protected _syncLocalID: number;

  /** @override */
  updateTransform(parentTransform: PIXI.Transform): void;

  /** @override */
  updateLocalTransform(): void;
}
