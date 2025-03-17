import type { Identity } from "fvtt-types/utils";

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
  class UserTargets extends Set<Token.ConfiguredInstance> {
    constructor(user: User.ConfiguredInstance);

    user: User.ConfiguredInstance;

    /**
     * Return the Token IDs which are user targets
     */
    get ids(): string[];

    /**
     * @remarks Returns void, but Set<T>.add returns boolean
     */
    override add(token: Token.ConfiguredInstance): void;

    override clear(): void;

    /**
     * @remarks Returns void, but Set<T>.delete returns boolean
     */
    override delete(token: Token.ConfiguredInstance): void;
  }

  namespace UserTargets {
    interface Any extends AnyUserTargets {}
    interface AnyConstructor extends Identity<typeof AnyUserTargets> {}
  }
}

declare abstract class AnyUserTargets extends UserTargets {
  constructor(arg0: never, ...args: never[]);
}
