import { ConfiguredDocumentClass } from '../../types/helperTypes';

declare global {
  /**
   * A subclass of Set which manages the Token ids which the User has targeted.
   * @see User#targets
   */
  class UserTargets extends Set<Token> {
    constructor(user: UserTargets['user']);

    user: InstanceType<ConfiguredDocumentClass<typeof User>>;

    /**
     * Return the Token IDs which are user targets
     */
    get ids(): string[];

    /**
     * @override
     * @remarks Returns void, but Set<T>.add returns boolean
     */
    add(token: Token): any;

    /** @override */
    clear(): void;

    /**
     * @override
     * @remarks Returns void, but Set<T>.delete returns boolean
     */
    delete(token: Token): any;

    /**
     * Dispatch the targetToken hook whenever the user's target set changes
     */
    protected _hook(token: Token, targeted: boolean): void;
  }
}
