import type { Identity } from "#utils";
import type Document from "#common/abstract/document.d.mts";

/**
 * The singleton collection of Actor documents which exist within the active World.
 * This Collection is accessible within the Game object as game.actors.
 *
 * @see {@linkcode Actor} The Actor document
 * @see {@linkcode ActorDirectory} The ActorDirectory sidebar directory
 *
 * @example <caption>Retrieve an existing Actor by its id</caption>
 * ```typescript
 * let actor = game.actors.get(actorId);
 * ```
 */
declare class Actors extends foundry.documents.abstract.WorldCollection<"Actor", "Actors"> {
  /**
   * A mapping of synthetic Token Actors which are currently active within the viewed Scene.
   * Each Actor is referenced by the Token.id.
   */
  get tokens(): Partial<Record<string, Actor.Implementation>>;

  static documentName: "Actor";

  override fromCompendium<Options extends foundry.documents.abstract.WorldCollection.FromCompendiumOptions | undefined>(
    document: Actor.Implementation | foundry.documents.BaseActor.CreateData,
    options?: Options,
  ): foundry.documents.abstract.WorldCollection.FromCompendiumReturnType<"Actor", Options>;
}

declare namespace Actors {
  interface Any extends AnyActors {}
  interface AnyConstructor extends Identity<typeof AnyActors> {}

  interface ImplementationClass extends Document.Internal.ConfiguredCollectionClass<"Actor"> {}
  interface Implementation extends Document.Internal.ConfiguredCollection<"Actor"> {}

  interface FromCompendiumOptions extends foundry.documents.abstract.WorldCollection.FromCompendiumOptions {
    /**
     * Clear prototype token data to allow default token settings to be applied.
     * @defaultValue `true`
     */
    clearPrototypeToken: boolean;
  }

  /**
   * @deprecated Replaced by {@linkcode Actors.ImplementationClass}.
   */
  type ConfiguredClass = ImplementationClass;

  /**
   * @deprecated Replaced by {@linkcode Actors.Implementation}.
   */
  type Configured = Implementation;
}

declare abstract class AnyActors extends Actors {
  constructor(...args: never);
}

export default Actors;
