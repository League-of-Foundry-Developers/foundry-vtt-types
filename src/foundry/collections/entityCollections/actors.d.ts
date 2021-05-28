// TODO: Remove when updating this class!!!
// eslint-disable-next-line
// @ts-nocheck

/**
 * The Collection of Actor entities.
 *
 * @see {@link Actor} The Actor entity.
 * @see {@link ActorDirectory} All Actors which exist in the world are rendered within the ActorDirectory sidebar tab.
 *
 * @example <caption>Retrieve an existing Actor by its id</caption>
 * ```typescript
 * if (game.actors === undefined) throw "Too early to use an enitiy collection";
 * let actor = game.actors.get(actorId);
 * ```
 */
declare class Actors extends EntityCollection<Actor> {
  /**
   * A mapping of synthetic Token Actors which are currently active within the viewed Scene.
   * Each Actor is referenced by the Token.id.
   */
  tokens: {
    [id: string]: Actor;
  };

  /** @override */
  get entity(): string;

  /* -------------------------------------------- */
  /*  Sheet Registration Methods                  */
  /* -------------------------------------------- */

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
    sheetClass: ConstructorOf<Application>,
    {
      label,
      types,
      makeDefault
    }?: {
      label?: string;
      types?: string[];
      makeDefault?: boolean;
    }
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
    sheetClass: ConstructorOf<Application>,
    {
      types
    }?: {
      types?: string[];
    }
  ): void;

  /**
   * Return an Array of currently registered sheet classes for this Entity type
   */
  static get registeredSheets(): Array<ConstructorOf<ActorSheet>>;
}
