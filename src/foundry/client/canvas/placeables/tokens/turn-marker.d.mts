import type { Identity } from "#utils";

declare class TokenTurnMarker extends PIXI.Container {
  #TokenTurnMarker: true;
}

declare namespace TokenTurnMarker {
  interface Any extends AnyTokenTurnMarker {}
  interface AnyConstructor extends Identity<typeof AnyTokenTurnMarker> {}
}

export default TokenTurnMarker;

declare abstract class AnyTokenTurnMarker extends TokenTurnMarker {
  constructor(...args: never);
}
