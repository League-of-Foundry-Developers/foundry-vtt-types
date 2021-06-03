// TODO
declare global {
  /**
   * The client-side Actor document which extends the common BaseActor abstraction.
   * Each Actor document contains ActorData which defines its data schema.
   *
   * @see {@link data.ActorData}              The Actor data schema
   * @see {@link documents.Actors}            The world-level collection of Actor documents
   * @see {@link applications.ActorConfig}    The Actor configuration application
   *
   * @param data - Initial data provided to construct the Actor document
   *
   * @example <caption>Create a new Actor</caption>
   * ```typescript
   * let actor = await Actor.create({
   *   name: "New Test Actor",
   *   type: "character",
   *   img: "artwork/character-profile.jpg"
   * });
   * ```
   *
   * @example <caption>Retrieve an existing Actor</caption>
   * ```typescript
   * let actor = game.actors.get(actorId);
   * ```
   */
  class Actor extends ClientDocumentMixin(foundry.documents.BaseActor) {
    /**
     * A convenient reference to the file path of the Actor's profile image
     */
    get img(): this['data']['img'];
  }
}

export {};
