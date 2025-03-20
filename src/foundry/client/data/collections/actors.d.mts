import type { Identity } from "fvtt-types/utils";

declare global {
  /**
   * The singleton collection of Actor documents which exist within the active World.
   * This Collection is accessible within the Game object as game.actors.
   *
   * @see {@link Actor | `Actor`} The Actor document
   * @see {@link ActorDirectory | `ActorDirectory`} The ActorDirectory sidebar directory
   *
   * @example <caption>Retrieve an existing Actor by its id</caption>
   * ```typescript
   * let actor = game.actors.get(actorId);
   * ```
   */
  class Actors extends WorldCollection<Actor.ImplementationClass, "Actors"> {
    /**
     * A mapping of synthetic Token Actors which are currently active within the viewed Scene.
     * Each Actor is referenced by the Token.id.
     */
    get tokens(): Partial<Record<string, Actor.Implementation>>;

    static documentName: "Actor";

    override fromCompendium<Options extends WorldCollection.FromCompendiumOptions | undefined>(
      document: Actor.Implementation | foundry.documents.BaseActor.CreateData,
      options?: Options,
    ): WorldCollection.FromCompendiumReturnType<Actor.ImplementationClass, Options>;
  }

  namespace Actors {
    interface Any extends AnyActors {}
    interface AnyConstructor extends Identity<typeof AnyActors> {}

    interface FromCompendiumOptions extends WorldCollection.FromCompendiumOptions {
      /**
       * Clear prototype token data to allow default token settings to be applied.
       * @defaultValue `true`
       */
      clearPrototypeToken: boolean;
    }
  }
}

declare abstract class AnyActors extends Actors {
  constructor(arg0: never, ...args: never[]);
}
