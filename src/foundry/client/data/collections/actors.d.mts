import type { InexactPartial } from "../../../../types/utils.d.mts";

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
    get tokens(): Partial<Record<string, Actor.ConfiguredInstance>>;

    static documentName: "Actor";

    override fromCompendium<
      FolderOpt extends boolean = false,
      SortOpt extends boolean = true,
      OwnershipOpt extends boolean = false,
      IdOpt extends boolean = false,
    >(
      document: Actor.ConfiguredInstance | foundry.documents.BaseActor.ConstructorData,
      options?: InexactPartial<
        WorldCollection.FromCompendiumOptions<FolderOpt, SortOpt, OwnershipOpt, IdOpt> & {
          /**
           * Clear prototype token data to allow default token settings to be applied.
           * @defaultValue `true`
           */
          clearPrototypeToken: boolean;
        }
      >,
    ): Omit<
      Actor["_source"],
      | ClientDocument.OmitProperty<FolderOpt, "folder">
      | ClientDocument.OmitProperty<SortOpt, "sort" | "navigation" | "navOrder">
      | ClientDocument.OmitProperty<OwnershipOpt, "ownership">
      | (IdOpt extends false ? "_id" : never)
    >;
  }
}
