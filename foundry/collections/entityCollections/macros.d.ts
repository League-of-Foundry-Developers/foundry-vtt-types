/**
 * The Collection of Macro entities
 */
declare class Macros extends EntityCollection<Macro> {
  /** @override */
  static get instance(): Macros;

  /**
   * Determine whether a given User is allowed to use JavaScript macros
   * @param user - The User entity to test
   * @returns Can the User use scripts?
   */
  static canUseScripts(user: User): boolean;

  /** @override */
  get directory(): any; // MacroDirectory, type mismatch

  /** @override */
  get entity(): string;

  /** @override */
  fromCompendium(data: Macro.Data): Macro.Data;
}
