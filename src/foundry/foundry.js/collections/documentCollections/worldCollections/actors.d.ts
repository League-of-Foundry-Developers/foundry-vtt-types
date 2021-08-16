import { ConfiguredDocumentClass } from '../../../../../types/helperTypes';

declare global {
  /**
   * The singleton collection of Actor documents which exist within the active World.
   * This Collection is accessible within the Game object as game.actors.
   *
   * @see {@link Actor} The Actor entity
   * @see {@link ActorDirectory} The ActorDirectory sidebar directory
   *
   * @example <caption>Retrieve an existing Actor by its id</caption>
   * ```typescript
   * let actor = game.actors.get(actorId);
   * ```
   */
  class Actors extends WorldCollection<typeof foundry.documents.BaseActor, 'Actors'> {
    constructor(
      data?: StoredDocument<
        InstanceType<ConfiguredDocumentClass<typeof foundry.documents.BaseActor>>
      >['data']['_source'][]
    );
    /**
     * A mapping of synthetic Token Actors which are currently active within the viewed Scene.
     * Each Actor is referenced by the Token.id.
     */
    tokens: Partial<Record<string, InstanceType<ConfiguredDocumentClass<typeof foundry.documents.BaseActor>>>>;

    /** @override */
    static documentName: 'Actor';

    /** @override */
    fromCompendium(
      document:
        | InstanceType<ConfiguredDocumentClass<typeof foundry.documents.BaseActor>>
        | InstanceType<ConfiguredDocumentClass<typeof foundry.documents.BaseActor>>['data']['_source']
    ): Omit<
      InstanceType<ConfiguredDocumentClass<typeof foundry.documents.BaseActor>>['data']['_source'],
      '_id' | 'folder'
    >;

    /**
     * Register an Actor sheet class as a candidate which can be used to display Actors of a given type
     * See EntitySheetConfig.registerSheet for details
     *
     * @example <caption>Register a new ActorSheet subclass for use with certain Actor types.</caption>
     * ```typescript
     * Actors.registerSheet("dnd5e", ActorSheet5eCharacter, { types: ["character"], makeDefault: true });
     * ```
     */
    static registerSheet(
      scope: string,
      sheetClass: ConstructorOf<ActorSheet>,
      { label, types, makeDefault }?: { label?: string; types?: string[]; makeDefault?: boolean }
    ): void;

    /**
     * Unregister an Actor sheet class, removing it from the list of avaliable sheet Applications to use
     * See EntitySheetConfig.unregisterSheet for details
     *
     * @example <caption>Deregister the default ActorSheet subclass to replace it with others.</caption>
     * ```typescript
     * Actors.unregisterSheet("core", ActorSheet);
     * ```
     */
    static unregisterSheet(
      scope: string,
      sheetClass: ConstructorOf<ActorSheet>,
      { types }?: { types?: string[] }
    ): void;

    /**
     * Return an Array of currently registered sheet classes for this Entity type
     */
    static get registeredSheets(): typeof ActorSheet[];
  }
}
