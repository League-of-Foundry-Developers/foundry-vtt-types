import type { ConfiguredDocumentClass } from "../../../../types/helperTypes.d.mts";

declare global {
  /**
   * The singleton collection of Actor documents which exist within the active World.
   * This Collection is accessible within the Game object as game.actors.
   *
   * @see {@link Actor} The Actor document
   * @see {@link ActorDirectory} The ActorDirectory sidebar directory
   *
   * @example <caption>Retrieve an existing Actor by its id</caption>
   * ```typescript
   * let actor = game.actors.get(actorId);
   * ```
   */
  class Actors extends WorldCollection<typeof foundry.documents.BaseActor, "Actors"> {
    /**
     * A mapping of synthetic Token Actors which are currently active within the viewed Scene.
     * Each Actor is referenced by the Token.id.
     */
    get tokens(): Partial<Record<string, InstanceType<ConfiguredDocumentClass<typeof foundry.documents.BaseActor>>>>;

    static documentName: "Actor";

    override fromCompendium(
      document:
        | InstanceType<ConfiguredDocumentClass<typeof foundry.documents.BaseActor>>
        | foundry.documents.BaseActor.ConstructorData,
      options?: WorldCollection.FromCompendiumOptions | undefined,
    ): Omit<InstanceType<ConfiguredDocumentClass<typeof foundry.documents.BaseActor>>, "_id" | "folder">;
  }
}
