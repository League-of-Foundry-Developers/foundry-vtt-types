/* eslint-disable import-x/export */

import type { Brand } from "fvtt-types/utils";

export namespace behaviors {
  type BehaviorOrder = Brand<number, "PIXI.particles.behaviors.BehaviorOrder">;

  /**
   * Standard behavior order values, specifying when/how they are used. Other numeric values can be used,
   * but only the Spawn value will be handled in a special way. All other values will be sorted numerically.
   * Behaviors with the same value will not be given any specific sort order, as they are assumed to not
   * interfere with each other.
   */
  const BehaviorOrder: {
    /**
     * Spawn - initial placement and/or rotation. This happens before rotation/translation due to
     * emitter rotation/position is applied.
     */
    Spawn: 0 & BehaviorOrder;

    /** Normal priority, for things that don't matter when they are applied. */
    Normal: 2 & BehaviorOrder;

    /** Delayed priority, for things that need to read other values in order to act correctly. */
    Late: 5 & BehaviorOrder;
  };
}

export * from "@pixi/particle-emitter";
