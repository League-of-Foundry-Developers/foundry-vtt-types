import type { Identity } from "#utils";
import type { DataModel } from "#common/abstract/_module.d.mts";
import type { fields } from "#client/data/_module.d.mts";

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Only used for links.
import type TokenTurnMarker from "#client/canvas/placeables/tokens/turn-marker.d.mts";

declare class TurnMarkerData extends DataModel<TurnMarkerData.Schema> {
  static override defineSchema(): TurnMarkerData.Schema;

  // DataModel template overrides
  static override _schema: fields.SchemaField<TurnMarkerData.Schema>;

  static override get schema(): fields.SchemaField<TurnMarkerData.Schema>;

  static override validateJoint(data: TurnMarkerData.AnimationData): void;

  static override fromSource(data: TurnMarkerData.CreateData, context?: DataModel.FromSourceOptions): TurnMarkerData;

  static override fromJSON(json: string): TurnMarkerData;
}

declare namespace TurnMarkerData {
  interface Any extends AnyTurnMarkerData {}
  interface AnyConstructor extends Identity<typeof AnyTurnMarkerData> {}

  interface Schema extends fields.DataSchema {
    /** The ID of the animation. */
    id: fields.StringField<{ blank: false; nullable: false }>;

    /** The label for the animation. */
    label: fields.StringField<{ blank: false; nullable: false }>;

    /** The configuration of the animation. */
    config: fields.SchemaField<ConfigSchema>;
  }

  interface CreateData extends fields.SchemaField.CreateData<Schema> {}

  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  /** @privateRemarks Foundry names this typedef `TurnMarkerAnimationData`, so going with this name over just `TurnMarkerData.Data` */
  interface AnimationData extends fields.SchemaField.InitializedData<Schema> {}

  interface ConfigSchema extends fields.DataSchema {
    /** A shader class to apply or null. */
    shader: fields.ShaderField;

    /** The spin speed for the animation. */
    spin: fields.NumberField<{ required: true; nullable: false; initial: 0 }>;

    /** The pulse settings. */
    pulse: fields.SchemaField<PulseSchema>;
  }

  interface ConfigData extends fields.SchemaField.InitializedData<ConfigSchema> {}

  interface PulseSchema extends fields.DataSchema {
    /** The speed of the pulse. */
    speed: fields.NumberField<{ required: true; nullable: false; initial: 0 }>;

    /**
     * The minimum pulse value.
     * @defaultValue `0.8`
     * @remarks The {@linkcode TokenTurnMarker.scale | scale} of the turn marker will shrink to this value before increasing again.
     */
    min: fields.NumberField<{ required: true; nullable: false; initial: 0.8 }>;

    /**
     * The maximum pulse value.
     * @defaultValue `1`
     * @remarks The {@linkcode TokenTurnMarker.scale | scale} of the turn marker will grow to this value before decreasing again.
     */
    max: fields.NumberField<{ required: true; nullable: false; initial: 1 }>;
  }
}

export default TurnMarkerData;

declare abstract class AnyTurnMarkerData extends TurnMarkerData {
  constructor(...args: never);
}
