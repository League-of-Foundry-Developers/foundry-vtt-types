import type { Identity } from "#utils";
import type PrimaryCanvasContainer from "./primary-canvas-container.d.mts";

/**
 * A lightweight primary-canvas container designed for particle effects.
 * This container intentionally avoids any internal sorting or depth participation. Children render in insertion order.
 */
declare class PrimaryCanvasParticleContainer extends PrimaryCanvasContainer {
  protected override _onAddedPrimary(): void;

  protected override _onRemovedPrimary(): void;

  protected override _onElevationChange(): void;

  /**
   * @remarks Particles are not depth renderable
   */
  protected override _shouldRenderDepth(): false;
}

declare namespace PrimaryCanvasParticleContainer {
  interface Any extends AnyPrimaryCanvasParticleContainer {}
  interface AnyConstructor extends Identity<typeof AnyPrimaryCanvasParticleContainer> {}
}

export default PrimaryCanvasParticleContainer;

declare abstract class AnyPrimaryCanvasParticleContainer extends PrimaryCanvasParticleContainer {
  constructor(...args: never);
}
