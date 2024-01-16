import type { FieldReturnType, PropertiesToSource, ToObjectFalseType } from "../../../../types/helperTypes.d.mts";
import type DocumentData from "../../abstract/data.d.mts";
import type { documents } from "../../module.d.mts";
import type * as fields from "../fields.d.mts";
import type { TokenDataConstructorData, TokenDataProperties, TokenDataSchema } from "./tokenData.d.mts";

export type FieldExclusions =
  | "_id"
  | "actorId"
  | "actorData"
  | "img"
  | "x"
  | "y"
  | "elevation"
  | "effects"
  | "overlayEffect"
  | "hidden";

export interface PrototypeTokenDataSchema extends Omit<TokenDataSchema, FieldExclusions> {
  randomImg: fields.BooleanField;
  img: FieldReturnType<
    fields.VideoField,
    { default: typeof foundry.CONST.DEFAULT_TOKEN; validate: (src: unknown) => boolean }
  >;
}

export interface PrototypeTokenDataProperties extends Omit<TokenDataProperties, FieldExclusions> {
  /**
   * Uses a random "wildcard" image path which is resolved with a Token is created
   * @defaultValue `false`
   */
  randomImg: boolean;

  /**
   * A file path to an image or video file used to depict the Token
   * @defaultValue `CONST.DEFAULT_TOKEN`
   */
  img: string | null;
}

export interface PrototypeTokenDataConstructorData extends Omit<TokenDataConstructorData, FieldExclusions> {
  /**
   * Uses a random "wildcard" image path which is resolved with a Token is created
   * @defaultValue `false`
   */
  randomImg?: boolean | null | undefined;

  /**
   * A file path to an image or video file used to depict the Token
   * @defaultValue `CONST.DEFAULT_TOKEN`
   */
  img?: string | null | undefined;
}

export type PrototypeTokenDataSource = PropertiesToSource<PrototypeTokenDataProperties>;

export declare class PrototypeTokenData extends DocumentData<
  PrototypeTokenDataSchema,
  PrototypeTokenDataProperties,
  PrototypeTokenDataSource,
  PrototypeTokenDataConstructorData,
  documents.BaseActor
> {
  override _initialize(): void;

  override toObject(source?: true): ReturnType<this["toJSON"]> & { actorId: documents.BaseActor["id"] };
  toObject(source: false): {
    [Key in keyof PrototypeTokenDataSchema as string extends Key ? never : Key]: Key extends keyof this
      ? ToObjectFalseType<this[Key]>
      : undefined;
  } & { actorId: documents.BaseActor["id"] };
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PrototypeTokenData extends PrototypeTokenDataProperties {}
