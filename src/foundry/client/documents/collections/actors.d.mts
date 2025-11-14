import type { Identity } from "#utils";
import type Document from "#common/abstract/document.d.mts";
import type { WorldCollection } from "#client/documents/abstract/_module.d.mts";

/**
 * The singleton collection of Actor documents which exist within the active World.
 * This Collection is accessible within the Game object as {@linkcode foundry.Game.actors | game.actors}.
 *
 * @see {@linkcode foundry.documents.Actor} The Actor document
 * @see {@linkcode foundry.applications.sidebar.tabs.ActorDirectory} The ActorDirectory sidebar directory
 *
 * @example
 * Retrieve an existing Actor by its `id`
 * ```ts
 * let actor = game.actors.get(actorId);
 * ```
 */
declare class Actors extends WorldCollection<"Actor"> {
  /**
   * A mapping of synthetic Token Actors which are currently active within the viewed Scene.
   * Each Actor is referenced by the Token.id.
   */
  get tokens(): Record<string, Actor.Stored>;

  static override documentName: "Actor";

  /** @privateRemarks Fake type override */
  static override get instance(): Actors.Implementation;

  /**
   * @remarks This override doesn't change the type at all, just updates {@link ActiveEffect.origin | `ActiveEffect` origins} if
   * {@linkcode WorldCollection.FromCompendiumOptions.keepId | keepId} is `true`
   */
  override fromCompendium<Options extends WorldCollection.FromCompendiumOptions | undefined = undefined>(
    document: Actor.Implementation | Actor.CreateData,
    options?: Options,
  ): WorldCollection.FromCompendiumReturnType<"Actor", Options>;
}

declare namespace Actors {
  /**
   * @deprecated There should only be a single implementation of this class in use at one time,
   * use {@linkcode Actors.Implementation} instead. This will be removed in v15.
   */
  type Any = Internal.Any;

  /**
   * @deprecated There should only be a single implementation of this class in use at one time,
   * use {@linkcode Actors.ImplementationClass} instead. This will be removed in v15.
   */
  type AnyConstructor = Internal.AnyConstructor;

  namespace Internal {
    interface Any extends AnyActors {}
    interface AnyConstructor extends Identity<typeof AnyActors> {}
  }

  interface ImplementationClass extends Document.Internal.ConfiguredCollectionClass<"Actor"> {}
  interface Implementation extends Document.Internal.ConfiguredCollection<"Actor"> {}

  interface FromCompendiumOptions extends WorldCollection.FromCompendiumOptions {
    /** @deprecated Removed without replacement in v13. This warning will be removed in v14. */
    clearPrototypeToken?: never;
  }

  /** @deprecated Replaced by {@linkcode Actors.ImplementationClass}. Will be removed in v15. */
  type ConfiguredClass = ImplementationClass;

  /** @deprecated Replaced by {@linkcode Actors.Implementation}. Will be removed in v15. */
  type Configured = Implementation;
}

export default Actors;

declare abstract class AnyActors extends Actors {
  constructor(...args: never);
}
