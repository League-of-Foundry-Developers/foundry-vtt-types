import type { Identity } from "#utils";
import type { RenderFlagsMixin } from "../render-flags.d.mts";

declare class BaseRuler extends RenderFlagsMixin() {
  #BaseRuler: true;
}

declare namespace BaseRuler {
  interface Any extends AnyBaseRuler {}
  interface AnyConstructor extends Identity<typeof AnyBaseRuler> {}
}

export default BaseRuler;

declare abstract class AnyBaseRuler extends BaseRuler {
  constructor(...args: never);
}
