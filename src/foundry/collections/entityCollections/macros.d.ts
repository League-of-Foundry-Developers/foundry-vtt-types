/**
 * The Collection of Macro entities
 */
declare class Macros extends WorldCollection<Macro> {
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
