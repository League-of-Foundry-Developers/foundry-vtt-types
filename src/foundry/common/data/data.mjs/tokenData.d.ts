import DocumentData from '../../abstract/data.mjs';
import { FieldReturnType, PropertiesToSource } from '../../../../types/helperTypes';
import { CONST, documents } from '../../module.mjs';
import * as fields from '../fields.mjs';
import { AnimationData, AnimationDataConstructorData } from './animationData';
import { TokenBarData, TokenBarDataConstructorData } from './tokenBarData';
import { ActorDataSource } from './actorData.js';

interface VisionFieldOptions {
  validate: (d: number) => boolean;
  validationError: 'Invalid {name} {field} distance which must be a number with absolute value less than 1000';
}

export interface TokenDataSchema extends DocumentSchema {
  _id: typeof fields.DOCUMENT_ID;
  name: typeof fields.STRING_FIELD;
  displayName: DocumentField<CONST.TokenDisplayMode> & {
    type: typeof Number;
    required: true;
    default: typeof CONST.TOKEN_DISPLAY_MODES.NONE;
    validate: (m: any) => boolean;
    validationError: 'Invalid {name} {field} which must be a value in CONST.TOKEN_DISPLAY_MODES';
  };
  actorId: fields.ForeignDocumentField<{ type: documents.BaseActor; required: true }>;
  actorLink: typeof fields.BOOLEAN_FIELD;
  actorData: typeof fields.OBJECT_FIELD;
  img: FieldReturnType<typeof fields.VIDEO_FIELD, { default: () => string }>;
  tint: typeof fields.COLOR_FIELD;
  width: FieldReturnType<typeof fields.REQUIRED_POSITIVE_NUMBER, { default: number }>;
  height: FieldReturnType<typeof fields.REQUIRED_POSITIVE_NUMBER, { default: number }>;
  scale: DocumentField<number> & {
    type: typeof Number;
    required: true;
    default: 1;
    validate: (s: unknown) => boolean;
    validationError: 'Invalid {name} {field} which must be a number between 0.25 and 10';
  };
  mirrorX: typeof fields.BOOLEAN_FIELD;
  mirrorY: typeof fields.BOOLEAN_FIELD;
  x: typeof fields.REQUIRED_NUMBER;
  y: typeof fields.REQUIRED_NUMBER;
  elevation: typeof fields.REQUIRED_NUMBER;
  lockRotation: typeof fields.BOOLEAN_FIELD;
  rotation: FieldReturnType<typeof fields.ANGLE_FIELD, { default: number }>;
  effects: DocumentField<string[]> & {
    type: typeof String[];
    required: true;
    default: string[];
  };
  overlayEffect: typeof fields.STRING_FIELD;
  alpha: typeof fields.ALPHA_FIELD;
  hidden: typeof fields.BOOLEAN_FIELD;
  vision: DocumentField<boolean> & {
    type: typeof Boolean;
    required: true;
    default: (data: { readonly dimSight?: number; readonly brightSight?: number }) => boolean;
  };
  dimSight: FieldReturnType<typeof fields.REQUIRED_NUMBER, VisionFieldOptions>;
  brightSight: FieldReturnType<typeof fields.REQUIRED_NUMBER, VisionFieldOptions>;
  dimLight: FieldReturnType<typeof fields.REQUIRED_NUMBER, VisionFieldOptions>;
  brightLight: FieldReturnType<typeof fields.REQUIRED_NUMBER, VisionFieldOptions>;
  sightAngle: typeof fields.ANGLE_FIELD;
  lightAngle: typeof fields.ANGLE_FIELD;
  lightColor: typeof fields.COLOR_FIELD;
  lightAlpha: FieldReturnType<typeof fields.ALPHA_FIELD, { default: 0.25 }>;
  lightAnimation: DocumentField<AnimationData> & {
    type: typeof AnimationData;
    required: true;
    default: {};
  };
  disposition: DocumentField<CONST.TokenDisposition> & {
    type: typeof Number;
    required: true;
    default: typeof CONST.TOKEN_DISPOSITIONS.HOSTILE;
    validate: (n: any) => boolean;
    validationError: 'Invalid {name} {field} which must be a value in CONST.TOKEN_DISPOSITIONS';
  };
  displayBars: DocumentField<CONST.TokenDisplayMode> & {
    type: typeof Number;
    required: true;
    default: typeof CONST.TOKEN_DISPLAY_MODES.NONE;
    validate: (m: any) => boolean;
    validationError: 'Invalid {name} {field} which must be a value in CONST.TOKEN_DISPLAY_MODES';
  };
  bar1: DocumentField<TokenBarData> & {
    type: typeof TokenBarData;
    required: true;
    default: () => { attribute: Game['system']['data']['primaryTokenAttribute'] | null };
  };
  bar2: DocumentField<TokenBarData> & {
    type: typeof TokenBarData;
    required: true;
    default: () => { attribute: Game['system']['data']['secondaryTokenAttribute'] | null };
  };
  flags: typeof fields.OBJECT_FIELD;
}

export interface TokenDataProperties {
  /**
   * The Token _id which uniquely identifies it within its parent Scene
   * @defaultValue `null`
   */
  _id: string | null;

  /**
   * The name used to describe the Token
   */
  name?: string;

  /**
   * The display mode of the Token nameplate, from CONST.TOKEN_DISPLAY_MODES
   * @defaultValue `CONST.TOKEN_DISPLAY_MODES.NONE`
   */
  displayName: CONST.TokenDisplayMode;

  /**
   * The _id of an Actor document which this Token represents
   * @defaultValue `null`
   */
  actorId: string | null;

  /**
   * Does this Token uniquely represent a singular Actor, or is it one of many?
   * @defaultValue `false`
   */
  actorLink: boolean;

  /**
   * Token-level data which overrides the base data of the associated Actor
   * @defaultValue `{}`
   */
  actorData: Partial<ActorDataSource>;

  /**
   * A file path to an image or video file used to depict the Token
   * @defaultValue `this.DEFAULT_ICON`
   */
  img: string | null;

  /**
   * An optional color tint applied to the Token image
   */
  tint?: string | null;

  /**
   * The width of the Token in grid units
   * @defaultValue `1`
   */
  width: number;

  /**
   * The height of the Token in grid units
   * @defaultValue `1`
   */
  height: number;

  /**
   * A scale factor applied to the Token image, between 0.25 and 3
   * @defaultValue `1`
   */
  scale: number;

  /**
   * Flip the Token image horizontally?
   * @defaultValue `false`
   */
  mirrorX: boolean;

  /**
   * Flip the Token image vertically?
   * @defaultValue `false`
   */
  mirrorY: boolean;

  /**
   * The x-coordinate of the top-left corner of the Token
   * @defaultValue `0`
   */
  x: number;

  /**
   * The y-coordinate of the top-left corner of the Token
   * @defaultValue `0`
   */
  y: number;

  /**
   * The vertical elevation of the Token, in distance units
   * @defaultValue `0`
   */
  elevation: number;

  /**
   * Prevent the Token image from visually rotating?
   * @defaultValue `false`
   */
  lockRotation: boolean;

  /**
   * The rotation of the Token in degrees, from 0 to 360. A value of 0 represents a southward-facing Token.
   * @defaultValue `0`
   */
  rotation: number;

  /**
   * An array of effect icon paths which are displayed on the Token
   * @defaultValue `[]`
   */
  effects: string[];

  /**
   * A single icon path which is displayed as an overlay on the Token
   */
  overlayEffect?: string;

  /**
   * The opacity of the token image
   * @defaultValue `1`
   */
  alpha: number;

  /**
   * Is the Token currently hidden from player view?
   * @defaultValue `false`
   */
  hidden: boolean;

  /**
   * Is this Token a source of vision?
   * @defaultValue Whether dimSight or brightSight have a value greater 0.
   */
  vision: boolean;

  /**
   * How far in distance units the Token can naturally see as if in dim light
   * @defaultValue `0`
   */
  dimSight: number;

  /**
   * How far in distance units the Token can naturally see as if in bright light
   * @defaultValue `0`
   */
  brightSight: number;

  /**
   * How far in distance units this Token emits dim light
   * @defaultValue `0`
   */
  dimLight: number;

  /**
   * How far in distance units this Token emits bright light
   * @defaultValue `0`
   */
  brightLight: number;

  /**
   * The angle at which this Token is able to see, if it has vision
   * @defaultValue `360`
   */
  sightAngle: number;

  /**
   * The angle at which this Token is able to emit light
   * @defaultValue `360`
   */
  lightAngle: number;

  /**
   * The color of the token's emitted light as an HTML hexadecimal color string
   */
  lightColor: string | undefined | null;

  /**
   * The intensity of any light emitted by the token
   * @defaultValue `0.25`
   */
  lightAlpha: number;

  /**
   * A data object which configures token light animation settings
   * @defaultValue `{}`
   */
  lightAnimation: AnimationData;

  /**
   * A displayed Token disposition from CONST.TOKEN_DISPOSITIONS
   * @defaultValue `CONST.TOKEN_DISPOSITIONS.HOSTILE`
   */
  disposition: CONST.TokenDisposition;

  /**
   * The display mode of Token resource bars, from CONST.TOKEN_DISPLAY_MODES
   * @defaultValue `CONST.TOKEN_DISPLAY_MODES.NONE`
   */
  displayBars: CONST.TokenDisplayMode;

  /**
   * The configuration of the Token's primary resource bar
   * @defaultValue `{ attribute: game?.system.data.primaryTokenAttribute || null }`
   */
  bar1: TokenBarData;

  /**
   * The configuration of the Token's secondary resource bar
   * @defaultValue `{ attribute: game?.system.data.secondaryTokenAttribute || null }`
   */
  bar2: TokenBarData;

  /**
   * An object of optional key/value flags
   * @defaultValue `{}`
   */
  flags: TokenFlags;
}

export interface TokenDataConstructorData {
  /**
   * The Token _id which uniquely identifies it within its parent Scene
   * @defaultValue `null`
   */
  _id?: string | null;

  /**
   * The name used to describe the Token
   */
  name?: string | null;

  /**
   * The display mode of the Token nameplate, from CONST.TOKEN_DISPLAY_MODES
   * @defaultValue `CONST.TOKEN_DISPLAY_MODES.NONE`
   */
  displayName?: CONST.TokenDisplayMode | null;

  /**
   * The _id of an Actor document which this Token represents
   * @defaultValue `null`
   */
  actorId?: string | null;

  /**
   * Does this Token uniquely represent a singular Actor, or is it one of many?
   * @defaultValue `false`
   */
  actorLink?: boolean;

  /**
   * Token-level data which overrides the base data of the associated Actor
   * @defaultValue `{}`
   */
  actorData?: Partial<ActorDataSource> | null;

  /**
   * A file path to an image or video file used to depict the Token
   * @defaultValue `this.DEFAULT_ICON`
   */
  img?: string | null;

  /**
   * An optional color tint applied to the Token image
   */
  tint?: string | null;

  /**
   * The width of the Token in grid units
   * @defaultValue `1`
   */
  width?: number | null;

  /**
   * The height of the Token in grid units
   * @defaultValue `1`
   */
  height?: number | null;

  /**
   * A scale factor applied to the Token image, between 0.25 and 3
   * @defaultValue `1`
   */
  scale?: number | null;

  /**
   * Flip the Token image horizontally?
   * @defaultValue `false`
   */
  mirrorX?: boolean | null;

  /**
   * Flip the Token image vertically?
   * @defaultValue `false`
   */
  mirrorY?: boolean | null;

  /**
   * The x-coordinate of the top-left corner of the Token
   * @defaultValue `0`
   */
  x?: number | null;

  /**
   * The y-coordinate of the top-left corner of the Token
   * @defaultValue `0`
   */
  y?: number | null;

  /**
   * The vertical elevation of the Token, in distance units
   * @defaultValue `0`
   */
  elevation?: number | null;

  /**
   * Prevent the Token image from visually rotating?
   * @defaultValue `false`
   */
  lockRotation?: boolean | null;

  /**
   * The rotation of the Token in degrees, from 0 to 360. A value of 0 represents a southward-facing Token.
   * @defaultValue `0`
   */
  rotation?: number | null;

  /**
   * An array of effect icon paths which are displayed on the Token
   * @defaultValue `[]`
   */
  effects?: string[] | null;

  /**
   * A single icon path which is displayed as an overlay on the Token
   */
  overlayEffect?: string | null;

  /**
   * The opacity of the token image
   * @defaultValue `1`
   */
  alpha?: number | null;

  /**
   * Is the Token currently hidden from player view?
   * @defaultValue `false`
   */
  hidden?: boolean | null;

  /**
   * Is this Token a source of vision?
   * @defaultValue Whether dimSight or brightSight have a value greater 0.
   */
  vision?: boolean | null;

  /**
   * How far in distance units the Token can naturally see as if in dim light
   * @defaultValue `0`
   */
  dimSight?: number | null;

  /**
   * How far in distance units the Token can naturally see as if in bright light
   * @defaultValue `0`
   */
  brightSight?: number | null;

  /**
   * How far in distance units this Token emits dim light
   * @defaultValue `0`
   */
  dimLight?: number | null;

  /**
   * How far in distance units this Token emits bright light
   * @defaultValue `0`
   */
  brightLight?: number | null;

  /**
   * The angle at which this Token is able to see, if it has vision
   * @defaultValue `360`
   */
  sightAngle?: number | null;

  /**
   * The angle at which this Token is able to emit light
   * @defaultValue `360`
   */
  lightAngle?: number | null;

  /**
   * The color of the token's emitted light as an HTML hexadecimal color string
   */
  lightColor?: string | null;

  /**
   * The intensity of any light emitted by the token
   * @defaultValue `0.25`
   */
  lightAlpha?: number | null;

  /**
   * A data object which configures token light animation settings
   * @defaultValue `{}`
   */
  lightAnimation?: AnimationDataConstructorData | null;

  /**
   * A displayed Token disposition from CONST.TOKEN_DISPOSITIONS
   * @defaultValue `CONST.TOKEN_DISPOSITIONS.HOSTILE`
   */
  disposition?: CONST.TokenDisposition | null;

  /**
   * The display mode of Token resource bars, from CONST.TOKEN_DISPLAY_MODES
   * @defaultValue `CONST.TOKEN_DISPLAY_MODES.NONE`
   */
  displayBars?: CONST.TokenDisplayMode | null;

  /**
   * The configuration of the Token's primary resource bar
   * @defaultValue `{ attribute: game?.system.data.primaryTokenAttribute || null }`
   */
  bar1?: TokenBarDataConstructorData | null;

  /**
   * The configuration of the Token's secondary resource bar
   * @defaultValue `{ attribute: game?.system.data.secondaryTokenAttribute || null }`
   */
  bar2?: TokenBarDataConstructorData | null;

  /**
   * An object of optional key/value flags
   * @defaultValue `{}`
   */
  flags?: TokenFlags | null;
}

/**
 * The data schema for a Token document.
 */
export class TokenData extends DocumentData<
  TokenDataSchema,
  TokenDataProperties,
  PropertiesToSource<TokenDataProperties>,
  TokenDataConstructorData,
  documents.BaseToken
> {
  static defineSchema(): TokenDataSchema;

  /**
   * The default icon used for newly created Item documents
   * @defaultValue `CONST.DEFAULT_TOKEN`
   */
  static DEFAULT_ICON: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export declare interface TokenData extends TokenDataProperties {}

declare global {
  interface TokenFlags {
    [key: string]: unknown;
  }
}
