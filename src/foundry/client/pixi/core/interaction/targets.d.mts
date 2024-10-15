export {};

interface SetReplacementMembers<T> {
  add(value: T): void;
  delete(value: T): void;
  clear(): void;
}

type PatchedSet<T> = Omit<Set<T>, "add" | "delete" | "clear"> & SetReplacementMembers<T>;

interface PatchedSetConstructor {
  new <T = any>(values?: readonly T[] | null): PatchedSet<T>;
  readonly prototype: PatchedSet<any>;
}

declare const Set: PatchedSetConstructor;

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
