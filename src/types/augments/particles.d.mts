/* eslint-disable import/export */

import * as pixiParticles from "@pixi/particle-emitter";
import type { Brand } from "src/utils/index.d.mts";

export namespace behaviors {
  type BehaviorOrder = Brand<number, "PIXI.particles.behaviors.BehaviorOrder">;
  const BehaviorOrder: Record<keyof pixiParticles.behaviors.BehaviorOrder, BehaviorOrder>;
}

export * from "@pixi/particle-emitter";
