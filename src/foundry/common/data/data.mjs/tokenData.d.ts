import {
  ConfiguredDocumentClass,
  ConfiguredFlags,
  FieldReturnType,
  PropertiesToSource
} from '../../../../types/helperTypes';
import DocumentData from '../../abstract/data.mjs';
import { CONST, documents } from '../../module.mjs';
import * as fields from '../fields.mjs';
import { ActorDataSource } from './actorData.js';
import { AnimationData, AnimationDataConstructorData } from './animationData';
import { TokenBarData, TokenBarDataConstructorData } from './tokenBarData';

interface VisionFieldOptions {
  validate: (d: number) => boolean;
  validationError: 'Invalid {name} {field} distance which must be a number with absolute value less than 1000';
}

interface TokenDataSchema extends DocumentSchema {
  _id: fields.DocumentId;
  name: fields.StringField;
  displayName: DocumentField<CONST.TOKEN_DISPLAY_MODES> & {
    type: typeof Number;
    required: true;
    default: typeof CONST.TOKEN_DISPLAY_MODES.NONE;
    validate: (m: any) => boolean;
    validationError: 'Invalid {name} {field} which must be a value in CONST.TOKEN_DISPLAY_MODES';
  };
  actorId: fields.ForeignDocumentField<{ type: documents.BaseActor; required: true }>;
  actorLink: fields.BooleanField;
  actorData: fields.ObjectField;
  img: FieldReturnType<fields.VideoField, { default: () => typeof TokenData.DEFAULT_ICON }>;
  tint: fields.ColorField;
  width: FieldReturnType<fields.RequiredPositiveNumber, { default: 1 }>;
  height: FieldReturnType<fields.RequiredPositiveNumber, { default: 1 }>;
  scale: DocumentField<number> & {
    type: typeof Number;
    required: true;
    default: 1;
    validate: (s: unknown) => boolean;
    validationError: 'Invalid {name} {field} which must be a number between 0.25 and 10';
  };
  mirrorX: fields.BooleanField;
  mirrorY: fields.BooleanField;
  x: fields.RequiredNumber;
  y: fields.RequiredNumber;
  elevation: fields.RequiredNumber;
  lockRotation: fields.BooleanField;
  rotation: FieldReturnType<fields.AngleField, { default: 0 }>;
  effects: DocumentField<string[]> & {
    type: [typeof String];
    required: true;
    default: string[];
  };
  overlayEffect: fields.StringField;
  alpha: fields.AlphaField;
  hidden: fields.BooleanField;
  vision: DocumentField<boolean> & {
    type: typeof Boolean;
    required: true;
    default: (data: { readonly dimSight?: number; readonly brightSight?: number }) => boolean;
  };
  dimSight: FieldReturnType<fields.RequiredNumber, VisionFieldOptions>;
  brightSight: FieldReturnType<fields.RequiredNumber, VisionFieldOptions>;
  dimLight: FieldReturnType<fields.RequiredNumber, VisionFieldOptions>;
  brightLight: FieldReturnType<fields.RequiredNumber, VisionFieldOptions>;
  sightAngle: fields.AngleField;
  lightAngle: fields.AngleField;
  lightColor: fields.ColorField;
  lightAlpha: FieldReturnType<fields.AlphaField, { default: 0.25 }>;
  lightAnimation: DocumentField<AnimationData> & {
    type: typeof AnimationData;
    required: true;
    default: Record<string, never>;
  };
  disposition: DocumentField<CONST.TOKEN_DISPOSITIONS> & {
    type: typeof Number;
    required: true;
    default: typeof CONST.TOKEN_DISPOSITIONS.HOSTILE;
    validate: (n: any) => boolean;
    validationError: 'Invalid {name} {field} which must be a value in CONST.TOKEN_DISPOSITIONS';
  };
  displayBars: DocumentField<CONST.TOKEN_DISPLAY_MODES> & {
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
  flags: fields.ObjectField;
}

interface TokenDataProperties {
  /**
   * The Token _id which uniquely identifies it within its parent Scene
   * @defaultValue `null`
   */
  _id: string | null;

  /**
   * The name used to describe the Token
   */
  name: string | undefined;

  /**
   * The display mode of the Token nameplate, from CONST.TOKEN_DISPLAY_MODES
   * @defaultValue `CONST.TOKEN_DISPLAY_MODES.NONE`
   */
  displayName: CONST.TOKEN_DISPLAY_MODES;

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
   * @defaultValue `TokenData.DEFAULT_ICON`
   */
  img: string | null;

  /**
   * An optional color tint applied to the Token image
   */
  tint: string | null | undefined;

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
  overlayEffect: string | undefined;

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
  lightColor: string | null | undefined;

  /**
   * The intensity of any light emitted by the token
   * @defaultValue `0.25`
   */
  lightAlpha: number;

  /**
   * A data object which configures token light animation settings
   * @defaultValue `new AnimationData({})`
   */
  lightAnimation: AnimationData;

  /**
   * A displayed Token disposition from CONST.TOKEN_DISPOSITIONS
   * @defaultValue `CONST.TOKEN_DISPOSITIONS.HOSTILE`
   */
  disposition: CONST.TOKEN_DISPOSITIONS;

  /**
   * The display mode of Token resource bars, from CONST.TOKEN_DISPLAY_MODES
   * @defaultValue `CONST.TOKEN_DISPLAY_MODES.NONE`
   */
  displayBars: CONST.TOKEN_DISPLAY_MODES;

  /**
   * The configuration of the Token's primary resource bar
   * @defaultValue `new TokenBarData({ attribute: game?.system.data.primaryTokenAttribute || null })`
   */
  bar1: TokenBarData;

  /**
   * The configuration of the Token's secondary resource bar
   * @defaultValue `new TokenBarData({ attribute: game?.system.data.secondaryTokenAttribute || null })`
   */
  bar2: TokenBarData;

  /**
   * An object of optional key/value flags
   * @defaultValue `{}`
   */
  flags: ConfiguredFlags<'Token'>;
}

interface TokenDataConstructorData {
  /**
   * The Token _id which uniquely identifies it within its parent Scene
   * @defaultValue `null`
   */
  _id?: string | null | undefined;

  /**
   * The name used to describe the Token
   */
  name?: string | null | undefined;

  /**
   * The display mode of the Token nameplate, from CONST.TOKEN_DISPLAY_MODES
   * @defaultValue `CONST.TOKEN_DISPLAY_MODES.NONE`
   */
  displayName?: CONST.TOKEN_DISPLAY_MODES | null | undefined;

  /**
   * The _id of an Actor document which this Token represents
   * @defaultValue `null`
   */
  actorId?: InstanceType<ConfiguredDocumentClass<typeof documents.BaseActor>> | string | null | undefined;

  /**
   * Does this Token uniquely represent a singular Actor, or is it one of many?
   * @defaultValue `false`
   */
  actorLink?: boolean;

  /**
   * Token-level data which overrides the base data of the associated Actor
   * @defaultValue `{}`
   */
  actorData?: Partial<ActorDataSource> | null | undefined;

  /**
   * A file path to an image or video file used to depict the Token
   * @defaultValue `TokenData.DEFAULT_ICON`
   */
  img?: string | null | undefined;

  /**
   * An optional color tint applied to the Token image
   */
  tint?: string | null | undefined;

  /**
   * The width of the Token in grid units
   * @defaultValue `1`
   */
  width?: number | null | undefined;

  /**
   * The height of the Token in grid units
   * @defaultValue `1`
   */
  height?: number | null | undefined;

  /**
   * A scale factor applied to the Token image, between 0.25 and 3
   * @defaultValue `1`
   */
  scale?: number | null | undefined;

  /**
   * Flip the Token image horizontally?
   * @defaultValue `false`
   */
  mirrorX?: boolean | null | undefined;

  /**
   * Flip the Token image vertically?
   * @defaultValue `false`
   */
  mirrorY?: boolean | null | undefined;

  /**
   * The x-coordinate of the top-left corner of the Token
   * @defaultValue `0`
   */
  x?: number | null | undefined;

  /**
   * The y-coordinate of the top-left corner of the Token
   * @defaultValue `0`
   */
  y?: number | null | undefined;

  /**
   * The vertical elevation of the Token, in distance units
   * @defaultValue `0`
   */
  elevation?: number | null | undefined;

  /**
   * Prevent the Token image from visually rotating?
   * @defaultValue `false`
   */
  lockRotation?: boolean | null | undefined;

  /**
   * The rotation of the Token in degrees, from 0 to 360. A value of 0 represents a southward-facing Token.
   * @defaultValue `0`
   */
  rotation?: number | null | undefined;

  /**
   * An array of effect icon paths which are displayed on the Token
   * @defaultValue `[]`
   */
  effects?: string[] | null | undefined;

  /**
   * A single icon path which is displayed as an overlay on the Token
   */
  overlayEffect?: string | null | undefined;

  /**
   * The opacity of the token image
   * @defaultValue `1`
   */
  alpha?: number | null | undefined;

  /**
   * Is the Token currently hidden from player view?
   * @defaultValue `false`
   */
  hidden?: boolean | null | undefined;

  /**
   * Is this Token a source of vision?
   * @defaultValue Whether dimSight or brightSight have a value greater 0.
   */
  vision?: boolean | null | undefined;

  /**
   * How far in distance units the Token can naturally see as if in dim light
   * @defaultValue `0`
   */
  dimSight?: number | null | undefined;

  /**
   * How far in distance units the Token can naturally see as if in bright light
   * @defaultValue `0`
   */
  brightSight?: number | null | undefined;

  /**
   * How far in distance units this Token emits dim light
   * @defaultValue `0`
   */
  dimLight?: number | null | undefined;

  /**
   * How far in distance units this Token emits bright light
   * @defaultValue `0`
   */
  brightLight?: number | null | undefined;

  /**
   * The angle at which this Token is able to see, if it has vision
   * @defaultValue `360`
   */
  sightAngle?: number | null | undefined;

  /**
   * The angle at which this Token is able to emit light
   * @defaultValue `360`
   */
  lightAngle?: number | null | undefined;

  /**
   * The color of the token's emitted light as an HTML hexadecimal color string
   */
  lightColor?: string | null | undefined;

  /**
   * The intensity of any light emitted by the token
   * @defaultValue `0.25`
   */
  lightAlpha?: number | null | undefined;

  /**
   * A data object which configures token light animation settings
   * @defaultValue `new AnimationData({})`
   */
  lightAnimation?: AnimationDataConstructorData | null | undefined;

  /**
   * A displayed Token disposition from CONST.TOKEN_DISPOSITIONS
   * @defaultValue `CONST.TOKEN_DISPOSITIONS.HOSTILE`
   */
  disposition?: CONST.TOKEN_DISPOSITIONS | null | undefined;

  /**
   * The display mode of Token resource bars, from CONST.TOKEN_DISPLAY_MODES
   * @defaultValue `CONST.TOKEN_DISPLAY_MODES.NONE`
   */
  displayBars?: CONST.TOKEN_DISPLAY_MODES | null | undefined;

  /**
   * The configuration of the Token's primary resource bar
   * @defaultValue `new TokenBarData({ attribute: game?.system.data.primaryTokenAttribute || null })`
   */
  bar1?: TokenBarDataConstructorData | null | undefined;

  /**
   * The configuration of the Token's secondary resource bar
   * @defaultValue `new TokenBarData({ attribute: game?.system.data.secondaryTokenAttribute || null })`
   */
  bar2?: TokenBarDataConstructorData | null | undefined;

  /**
   * An object of optional key/value flags
   * @defaultValue `{}`
   */
  flags?: ConfiguredFlags<'Token'> | null | undefined;
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
  /** @override */
  static defineSchema(): TokenDataSchema;

  /**
   * The default icon used for newly created Item documents
   * @defaultValue `CONST.DEFAULT_TOKEN`
   */
  static DEFAULT_ICON: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TokenData extends TokenDataProperties {}
