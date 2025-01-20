export {};

// This class exists make it as sound as possible to override these parts of the class and make them
// completely unrelated. It's done this way specifically to avoid situations with broken inheritance.
declare class LenientSet<T> extends globalThis.Set<T> {
  add(value: T): any;
  delete(value: T): any;
}

declare const Set: typeof LenientSet;

declare global {
  /**
   * A subclass of Set which manages the Token ids which the User has targeted.
   * @see User#targets
   */
  class UserTargets extends Set<TokenDocument.ObjectInstance> {
    constructor(user: UserTargets["user"]);

    user: User.ConfiguredInstance;

    /**
     * Return the Token IDs which are user targets
     */
    get ids(): string[];

    /**
     * @remarks Returns void, but Set<T>.add returns boolean
     */
    override add(token: TokenDocument.ObjectInstance): void;

    override clear(): void;

    /**
     * @remarks Returns void, but Set<T>.delete returns boolean
     */
    override delete(token: TokenDocument.ObjectInstance): void;
  }
}
