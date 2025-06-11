import type { Identity } from "#utils";
import type { BaseTokenRuler } from "./_module.d.mts";

declare class TokenRuler extends BaseTokenRuler {
  #TokenRuler: true;
}

declare namespace TokenRuler {
  interface Any extends AnyTokenRuler {}
  interface AnyConstructor extends Identity<typeof AnyTokenRuler> {}
}

export default TokenRuler;

declare abstract class AnyTokenRuler extends TokenRuler {
  constructor(...args: never);
}
