import DocumentData from '../../abstract/data.mjs';
import { FieldReturnType } from '../../../../types/helperTypes';
import { CONST, documents } from '../../module.mjs';
import * as fields from '../fields.mjs';
import { AnimationData } from './animationData';
import { TokenBarData } from './tokenBarData';

interface VisionFieldOptions {
  validate: (d: number) => boolean;
  validationError: 'Invalid {name} {field} distance which must be a number with absolute value less than 1000';
}

interface TokenDataSchema extends DocumentSchema {
  _id: typeof fields.DOCUMENT_ID;
  name: typeof fields.STRING_FIELD;
  displayName: DocumentField<number> & {
    type: Number;
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
    type: Number;
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
    type: String[];
    required: true;
    default: string[];
  };
  overlayEffect: typeof fields.STRING_FIELD;
  alpha: typeof fields.ALPHA_FIELD;
  hidden: typeof fields.BOOLEAN_FIELD;
  vision: DocumentField<boolean> & {
    type: Boolean;
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
  lightAlpha: typeof fields.ALPHA_FIELD;
  lightAnimation: DocumentField<AnimationData> & {
    type: AnimationData;
    required: true;
    default: {};
  };
  disposition: DocumentField<number> & {
    type: Number;
    required: true;
    default: typeof CONST.TOKEN_DISPOSITIONS.HOSTILE;
    validate: (n: any) => boolean;
    validationError: 'Invalid {name} {field} which must be a value in CONST.TOKEN_DISPOSITIONS';
  };
  displayBars: DocumentField<number> & {
    type: Number;
    required: true;
    default: typeof CONST.TOKEN_DISPLAY_MODES.NONE;
    validate: (m: any) => boolean;
    validationError: 'Invalid {name} {field} which must be a value in CONST.TOKEN_DISPLAY_MODES';
  };
  bar1: DocumentField<TokenBarData> & {
    type: TokenBarData;
    required: true;
    default: () => { attribute: typeof game['system']['data']['primaryTokenAttribute'] | null };
  };
  bar2: DocumentField<TokenBarData> & {
    type: TokenBarData;
    required: true;
    default: () => { attribute: typeof game['system']['data']['secondaryTokenAttribute'] | null };
  };
  flags: typeof fields.OBJECT_FIELD;
}

interface TokenDataProperties {
  /**
   * The Token _id which uniquely identifies it within its parent Scene
   */
  _id: string;

  /**
   * The name used to describe the Token
   */
  name?: string;

  /**
   * The display mode of the Token nameplate, from CONST.TOKEN_DISPLAY_MODES
   * @defaultValue `CONST.TOKEN_DISPLAY_MODES.NONE`
   */
  displayName: typeof CONST.TOKEN_DISPLAY_MODES;

  /**
   * The _id of an Actor document which this Token represents
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
  actorData: unknown;

  /**
   * A file path to an image or video file used to depict the Token
   * @defaultValue `this.DEFAULT_ICON`
   */
  img: string;

  /**
   * An optional color tint applied to the Token image
   */
  tint: string;
}

/**
 * The data schema for a Token document.
 */
export class TokenData extends DocumentData<TokenDataSchema, TokenDataProperties, documents.BaseToken> {
  static defineSchema(): TokenDataSchema;

  /**
   * The default icon used for newly created Item documents
   */
  static DEFAULT_ICON: typeof CONST.DEFAULT_TOKEN;
}
