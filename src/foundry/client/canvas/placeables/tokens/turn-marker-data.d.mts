import type { Identity } from "#utils";
import type { DataModel } from "#common/abstract/_module.d.mts";

declare class TurnMarkerData extends DataModel<TurnMarkerData.Schema> {}

declare namespace TurnMarkerData {
  interface Any extends AnyTurnMarkerData {}
  interface AnyConstructor extends Identity<typeof AnyTurnMarkerData> {}

  interface Schema extends foundry.data.fields.DataSchema {}
}

export default TurnMarkerData;

declare abstract class AnyTurnMarkerData extends TurnMarkerData {
  constructor(...args: never);
}
