import type { Identity } from "#utils";

declare class BaseTokenRuler {
  #BaseTokenRuler: true;
}

declare namespace BaseTokenRuler {
  interface Any extends AnyBaseTokenRuler {}
  interface AnyConstructor extends Identity<typeof AnyBaseTokenRuler> {}
}

export default BaseTokenRuler;

declare abstract class AnyBaseTokenRuler extends BaseTokenRuler {
  constructor(...args: never);
}
