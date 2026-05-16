import type { Identity } from "#utils";
import type { Token } from "#client/canvas/placeables/_module.d.mts";

/**
 * A subclass of Set which manages the Token ids which the User has targeted.
 * @see {@linkcode User.targets | foundry.documents.User#targets}
 */
declare class UserTargets extends Set<Token.Implementation> {
  constructor(user: UserTargets["user"]);

  /** @privateRemarks Temporary users' {@linkcode User.targets | targets} work without error, locally. */
  user: User.Implementation;

  /**
   * Return the Token IDs which are user targets
   */
  get ids(): string[];

  override add(token: Token.Implementation): this;

  override clear(): void;

  override delete(token: Token.Implementation): boolean;
}

declare namespace UserTargets {
  interface Any extends AnyUserTargets {}
  interface AnyConstructor extends Identity<typeof AnyUserTargets> {}
}

export default UserTargets;

declare abstract class AnyUserTargets extends UserTargets {
  constructor(...args: never);
}
