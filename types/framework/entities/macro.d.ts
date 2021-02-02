/**
 * The Collection of Macro entities
 */
declare class Macros extends EntityCollection<Macro> {
  /** @override */
  get entity(): string;

  /** @override */
  static get instance(): Macros;

  /** @override */
  get directory(): any; // MacroDirectory, type mismatch

  /**
   * Determine whether a given User is allowed to use JavaScript macros
   * @param user - The User entity to test
   * @returns Can the User use scripts?
   */
  static canUseScripts(user: User): boolean;

  /** @override */
  fromCompendium(data: Macro.Data): Macro.Data;
}

/**
 * The Macro entity which implements a triggered chat or script expression which can be quickly activated by the user.
 * All users have permission to create and use chat-based Macros, but users must be given special permission to use
 * script-based macros.
 *
 * @see {@link Macros}        The Collection of Macro entities
 * @see {@link MacroConfig}   The Macro Configuration sheet
 * @see {@link Hotbar}        The Hotbar interface application
 */
declare class Macro extends Entity<Macro.Data> {
  /** @override */
  static get config(): Entity.Config<Macro>;

  /**
   * Is the current User the author of this macro?
   */
  get isAuthor(): boolean;

  /** @override */
  static can(user: User, action: string, target: Macro): boolean;

  /**
   * Execute the Macro command
   */
  execute(): void;
}

declare namespace Macro {
  interface Data extends Entity.Data {
    actorIds: string[];
    author: string;
    command: string;
    img: string;
    name: string;
    permission: Entity.Permission;
    scope: string;
    type: 'script' | 'chat';
  }
}
