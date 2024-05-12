import type { DataModel, DatabaseBackend } from "../abstract/module.d.mts";
import type { fields } from "./module.d.mts";
import type * as documents from "../documents/module.mjs";

declare global {
  type LightAnimationData = {
    /** The animation type which is applied */
    type: string;
    /** The speed of the animation, a number between 0 and 10 */
    speed: number;
    /** The intensity of the animation, a number between 1 and 10 */
    intensity: number;
    /** Reverse the direction of animation. */
    reverse: boolean;
  };
}

declare namespace LightData {
  type LightAnimationDataSchema = {
    type: fields.StringField;
    speed: fields.NumberField;
    intensity: fields.NumberField;
    reverse: fields.BooleanField;
  };

  type DarknessSchema = {
    min: fields.NumberField;
    max: fields.NumberField;
  };

  type Schema = {
    alpha: fields.AlphaField;
    angle: fields.AngleField;
    bright: fields.NumberField;
    color: fields.ColorField;
    coloration: fields.NumberField;
    dim: fields.NumberField;
    attenuation: fields.AlphaField;
    luminosity: fields.NumberField;
    saturation: fields.NumberField;
    contrast: fields.NumberField;
    shadows: fields.NumberField;
    animation: fields.SchemaField<LightAnimationDataSchema>;
    darkness: fields.SchemaField<DarknessSchema>;
  };
}

export class LightData extends DataModel<fields.SchemaField<LightData.Schema>> {
  static defineSchema(): LightData.Schema;

  static migrateData(source: object): object;
}

declare namespace ShapeData {
  type Schema = {
    type: fields.StringField;
    width: fields.NumberField;
    height: fields.NumberField;
    radius: fields.NumberField;
    points: fields.ArrayField;
  };

  type TYPES = {
    RECTANGLE: "r";
    CIRCLE: "c";
    ELLIPSE: "e";
    POLYGON: "p";
  };
}

export class ShapeData extends DataModel<fields.SchemaField<ShapeData.Schema>> {
  static defineSchema(): ShapeData.Schema;

  static TYPES: ShapeData.TYPES;
}

declare namespace TextureData {
  type Schema = {
    src: fields.FilePathField;
    scaleX: fields.NumberField;
    scaleY: fields.NumberField;
    offsetX: fields.NumberField;
    offsetY: fields.NumberField;
    rotation: fields.AngleField;
    tint: fields.ColorField;
  };
}

export class TextureData extends fields.SchemaField<TextureData.Schema> {
  constructor(options: DataFieldOptions, srcOptions: FilePathFieldOptions);
}

declare namespace PrototypeToken {
  type Schema = {};
}

export class PrototypeToken extends DataModel<fields.SchemaField<PrototypeToken.Schema>, documents.BaseActor> {
  constructor(data: unknown, options: unknown);

  /** @defaultValue `{}` */
  apps: Record<string, Application>;

  get actor(): this["parent"];

  // TODO: Merge in `actorId: string | undefined`
  toObject(source: true): this["_source"];
  toObject(source?: boolean | undefined): ReturnType<this["schema"]["toObject"]>;

  static get database(): DatabaseBackend;

  static migrateData(source: object): object;

  static shimData(data: object, options?: { embedded?: boolean } | undefined): object;

  update(data: unknown, options: unknown): unknown;

  getFlag(args: unknown): unknown;

  setFlag(args: unknown): unknown;

  unsetFlag(args: unknown): Promise<unknown>;

  testUserPermission(
    user: documents.BaseUser,
    permission: unknown,
    { exact }: { exact: boolean },
  ): ReturnType<this["actor"]["testUserPermission"]>;

  get isOwner(): boolean;
}

declare namespace TombstoneData {
  type Schema = {
    _id: fields.DocumentIdField;
    _tombstone: fields.BooleanField;
    _stats: fields.DocumentStatsField;
  };
}

export class TombstoneData extends DataModel<fields.SchemaField<TombstoneData.Schema>> {
  static defineSchema(): TombstoneData.Schema;
}
