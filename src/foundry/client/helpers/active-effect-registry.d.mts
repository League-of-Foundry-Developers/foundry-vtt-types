import type { Identity } from "#utils";
import type { IterableWeakSet } from "#common/utils/_module.d.mts";

/**
 * A singleton helper class that tracks the duration and expiry of {@linkcode ActiveEffect}s
 */
declare class ActiveEffectRegistry extends IterableWeakSet<ActiveEffect.Implementation> {
  /**
   * Has the registry been populated for the first time?
   */
  get initialized(): boolean;

  /**
   * Populate the registry for the first time.
   * @internal
   */
  _initialize(): void;

  /**
   * Register a single ActiveEffect document. If the document is already registered but no longer eligible for
   * registration, it will be deleted.
   */
  override add(effect: ActiveEffect.Implementation): this;

  /**
   * Register the ActiveEffects embedded on an Actor or Item.
   */
  addFromParent(document: Actor.Implementation | Item.Implementation): this;

  /**
   * Unregister the ActiveEffects embedded on an Actor or Item.
   * @returns Did any deletions occur?
   */
  deleteFromParent(document: Actor.Implementation | Item.Implementation): boolean;

  /**
   * Refresh the durations of registered ActiveEffects and perform the configured action for expired effects.
   * @param event   - The expiry or other event that triggered this call
   * @param context - Additional contextual data relevant to the event
   * @see {@linkcode CONFIG.ActiveEffect.expiryAction}
   */
  refresh(event: string, context?: ActiveEffectRegistry.RefreshContext): Promise<void>;

  #ActiveEffectRegistry: true;
}

declare namespace ActiveEffectRegistry {
  interface Any extends AnyActiveEffectRegistry {}
  interface AnyConstructor extends Identity<typeof AnyActiveEffectRegistry> {}

  interface RefreshContext {
    /** The Combat associated with this event */
    combat?: Combat.Implementation | undefined;

    /** Limit the refresh to effects belonging to the provided list of actors. */
    actors?: Set<Actor.Implementation> | undefined;
  }
}

declare abstract class AnyActiveEffectRegistry extends ActiveEffectRegistry {
  constructor(...args: never);
}

export default ActiveEffectRegistry;
