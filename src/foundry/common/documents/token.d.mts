import type { AnyObject, InexactPartial, Merge } from "../../../types/utils.mts";
import type { DataModel } from "../abstract/data.d.mts";
import type Document from "../abstract/document.mts";
import type { DocumentMetadata } from "../abstract/document.mts";
import type * as CONST from "../constants.mts";
import type { LightData, TextureData } from "../data/data.mts";
import type { fields } from "../data/module.d.mts";
import type * as documents from "./_module.mts";

declare global {
  type TokenSightData = BaseToken.Properties["sight"];

  type TokenDetectionMode = BaseToken.Properties["detectionModes"][number];

  type TokenData = BaseToken.Properties;

  type TokenBarData = BaseToken.Properties["bar1"];
}

/**
 * The base Token model definition which defines common behavior of an Token document between both client and server.
 */
declare class BaseToken extends Document<BaseToken.Schema, BaseToken.Metadata, Scene.ConfiguredInstance | null> {
  constructor(data?: BaseToken.ConstructorData, context?: DocumentConstructionContext);

  static override metadata: Readonly<BaseToken.Metadata>;

  static override defineSchema(): BaseToken.Schema;

  /**
   * Validate the structure of the detection modes array
   * @param modes - Configured detection modes
   * @throws An error if the array is invalid
   */
  static #validateDetectionModes(modes: TokenDetectionMode[]): void;

  /**
   * The default icon used for newly created Token documents
   * @defaultValue `CONST.DEFAULT_TOKEN`
   */
  static DEFAULT_ICON: string;

  /**
   * Is a user able to update an existing Token?
   * @internal
   */
  static #canUpdate(user: documents.BaseUser, doc: BaseToken, data: BaseToken.UpdateData): boolean;

  override testUserPermission(
    user: documents.BaseUser,
    permission: keyof typeof CONST.DOCUMENT_OWNERSHIP_LEVELS | CONST.DOCUMENT_OWNERSHIP_LEVELS,
    options?: InexactPartial<{
      /**
       * Require the exact permission level requested?
       * @defaultValue `false`
       */
      exact: boolean;
    }>,
  ): boolean;

  updateSource(
    changes?: BaseToken.ConstructorData | undefined,
    options?: { dryRun?: boolean; fallback?: boolean; recursive?: boolean } | undefined,
  ): AnyObject;

  static override migrateData(source: AnyObject): AnyObject;

  static override shimData(
    data: AnyObject,
    options?: {
      /**
       * Apply shims to embedded models?
       * @defaultValue `true`
       */
      embedded?: boolean;
    },
  ): AnyObject;

  //TODO: Update with the Delta conditionality
  toObject(source: true): this["_source"];
  toObject(source?: boolean): ReturnType<this["schema"]["toObject"]>;
}

/**
 * A special subclass of EmbeddedDocumentField which allows construction of the ActorDelta to be lazily evaluated.
 */
export class ActorDeltaField<
  DocumentType extends Document.Any,
  Options extends fields.EmbeddedDocumentField.Options<DocumentType> = fields.EmbeddedDocumentField.DefaultOptions,
> extends fields.EmbeddedDocumentField<DocumentType, Options> {
  override initialize(
    value: fields.EmbeddedDocumentField.PersistedType<DocumentType, Options>,
    model: DataModel.Any,
    options?: InexactPartial<DataModel.ConstructorOptions>,
  ):
    | fields.EmbeddedDocumentField.InitializedType<DocumentType, Options>
    | (() => fields.EmbeddedDocumentField.InitializedType<DocumentType, Options> | null);
}

export default BaseToken;

declare namespace BaseToken {
  type Metadata = Merge<
    DocumentMetadata,
    {
      name: "Token";
      collection: "tokens";
      label: string;
      labelPlural: string;
      isEmbedded: true;
      embedded: {
        ActorDelta: "delta";
      };
      permissions: {
        create: "TOKEN_CREATE";
        update: (user: documents.BaseUser, doc: Document.Any, data: UpdateData) => boolean;
        delete: "TOKEN_DELETE";
      };
      schemaVersion: string;
    }
  >;

  type SchemaField = fields.SchemaField<Schema>;
  type ConstructorData = fields.SchemaField.InnerConstructorType<Schema>;
  type UpdateData = fields.SchemaField.InnerAssignmentType<Schema>;
  type Properties = fields.SchemaField.InnerInitializedType<Schema>;
  type Source = fields.SchemaField.InnerPersistedType<Schema>;

  // Needed because Omit wasn't working with schemas
  export interface SharedProtoSchema extends DataSchema {
    /**
     * The name used to describe the Token
     * @defaultValue `""`
     */
    name: fields.StringField<{ required: true; blank: true }>;

    /**
     * The display mode of the Token nameplate, from CONST.TOKEN_DISPLAY_MODES
     * @defaultValue `CONST.TOKEN_DISPLAY_MODES.NONE`
     */
    displayName: fields.NumberField<
      {
        required: true;
        initial: typeof CONST.TOKEN_DISPLAY_MODES.NONE;
        choices: CONST.TOKEN_DISPLAY_MODES[];
        validationError: "must be a value in CONST.TOKEN_DISPLAY_MODES";
      },
      CONST.TOKEN_DISPLAY_MODES | null | undefined,
      CONST.TOKEN_DISPLAY_MODES,
      CONST.TOKEN_DISPLAY_MODES
    >;

    /**
     * Does this Token uniquely represent a singular Actor, or is it one of many?
     * @defaultValue `false`
     */
    actorLink: fields.BooleanField;

    appendNumber: fields.BooleanField;

    prependAdjective: fields.BooleanField;

    /**
     * The token's texture on the canvas.
     * @defaultValue `BaseToken.DEFAULT_ICON`
     */
    texture: TextureData<{ initial: () => typeof BaseToken.DEFAULT_ICON; wildcard: true }>;

    /**
     * The width of the Token in grid units
     * @defaultValue `1`
     */
    width: fields.NumberField<{ positive: true; initial: 1; label: "Width" }>;

    /**
     * The height of the Token in grid units
     * @defaultValue `1`
     */
    height: fields.NumberField<{ positive: true; initial: 1; label: "Height" }>;

    /**
     * Prevent the Token image from visually rotating?
     * @defaultValue `false`
     */
    lockRotation: fields.BooleanField;

    /**
     * The rotation of the Token in degrees, from 0 to 360. A value of 0 represents a southward-facing Token.
     * @defaultValue `0`
     */
    rotation: fields.AngleField;

    /**
     * The opacity of the token image
     * @defaultValue `1`
     */
    alpha: fields.AlphaField;

    /**
     * A displayed Token disposition from CONST.TOKEN_DISPOSITIONS
     * @defaultValue `CONST.TOKEN_DISPOSITIONS.HOSTILE`
     */
    disposition: fields.NumberField<
      {
        required: true;
        choices: CONST.TOKEN_DISPOSITIONS[];
        initial: typeof CONST.TOKEN_DISPOSITIONS.HOSTILE;
        validationError: "must be a value in CONST.TOKEN_DISPOSITIONS";
      },
      CONST.TOKEN_DISPOSITIONS | null | undefined,
      CONST.TOKEN_DISPOSITIONS,
      CONST.TOKEN_DISPOSITIONS
    >;

    /**
     * The display mode of Token resource bars, from CONST.TOKEN_DISPLAY_MODES
     * @defaultValue `CONST.TOKEN_DISPLAY_MODES.NONE`
     */
    displayBars: fields.NumberField<
      {
        required: true;
        choices: CONST.TOKEN_DISPLAY_MODES[];
        initial: typeof CONST.TOKEN_DISPLAY_MODES.NONE;
        validationError: "must be a value in CONST.TOKEN_DISPLAY_MODES";
      },
      CONST.TOKEN_DISPLAY_MODES | null | undefined,
      CONST.TOKEN_DISPLAY_MODES,
      CONST.TOKEN_DISPLAY_MODES
    >;

    /**
     * The configuration of the Token's primary resource bar
     * @defaultValue
     * ```typescript
     * { attribute: null }
     * ```
     */
    bar1: fields.SchemaField<{
      /**
       * The attribute path within the Token's Actor data which should be displayed
       * @defaultValue `game?.system.primaryTokenAttribute || null`
       */
      attribute: fields.StringField<{ required: true; nullable: true; blank: false; initial: () => string | null }>;
    }>;

    /**
     * The configuration of the Token's secondary resource bar
     * @defaultValue
     * ```typescript
     * { attribute: null }
     * ```
     */
    bar2: fields.SchemaField<{
      /**
       * The attribute path within the Token's Actor data which should be displayed
       * @defaultValue `game?.system.secondaryTokenAttribute`
       */
      attribute: fields.StringField<{ required: true; nullable: true; blank: false; initial: () => string | null }>;
    }>;

    /**
     * Configuration of the light source that this Token emits
     * @defaultValue see {@link LightData}
     */
    light: fields.EmbeddedDataField<LightData>;

    /**
     * Configuration of sight and vision properties for the Token
     * @defaultValue see properties
     */
    sight: fields.SchemaField<{
      /**
       * Should vision computation and rendering be active for this Token?
       * @defaultValue true, when the token's sight range is greater than 0
       */
      enabled: fields.BooleanField<{ initial: () => boolean }>;

      /**
       * How far in distance units the Token can see without the aid of a light source
       * @defaultValue `null`
       */
      range: fields.NumberField<{ required: true; nullable: false; min: 0; step: 0.01; initial: 0 }>;

      /**
       * An angle at which the Token can see relative to their direction of facing
       * @defaultValue `360`
       */
      angle: fields.AngleField<{ initial: 360; base: 360 }>;

      /**
       * The vision mode which is used to render the appearance of the visible area
       * @defaultValue `"basic"`
       */
      visionMode: fields.StringField<{
        required: true;
        blank: false;
        initial: "basic";
        label: "TOKEN.VisionMode";
        hint: "TOKEN.VisionModeHint";
      }>;

      /**
       * A special color which applies a hue to the visible area
       * @defaultValue `null`
       */
      color: fields.ColorField<{ label: "TOKEN.VisionColor" }>;

      /**
       * A degree of attenuation which gradually fades the edges of the visible area
       * @defaultValue `0.1`
       */
      attenuation: fields.AlphaField<{
        initial: 0.1;
        label: "TOKEN.VisionAttenuation";
        hint: "TOKEN.VisionAttenuationHint";
      }>;

      /**
       * An advanced customization for the perceived brightness of the visible area
       * @defaultValue `0`
       */
      brightness: fields.NumberField<{
        required: true;
        nullable: false;
        initial: 0;
        min: -1;
        max: 1;
        label: "TOKEN.VisionBrightness";
        hint: "TOKEN.VisionBrightnessHint";
      }>;

      /**
       * An advanced customization of color saturation within the visible area
       * @defaultValue `0`
       */
      saturation: fields.NumberField<{
        required: true;
        nullable: false;
        initial: 0;
        min: -1;
        max: 1;
        label: "TOKEN.VisionSaturation";
        hint: "TOKEN.VisionSaturationHint";
      }>;

      /**
       * An advanced customization for contrast within the visible area
       * @defaultValue `0`
       */
      contrast: fields.NumberField<{
        required: true;
        nullable: false;
        initial: 0;
        min: -1;
        max: 1;
        label: "TOKEN.VisionContrast";
        hint: "TOKEN.VisionContrastHint";
      }>;
    }>;

    /**
     * An array of detection modes which are available to this Token
     * @defaultValue `[]`
     */
    detectionModes: fields.ArrayField<
      fields.SchemaField<{
        /**
         * The id of the detection mode, a key from CONFIG.Canvas.detectionModes
         * @defaultValue `""`
         */
        id: fields.StringField;

        /**
         * Whether or not this detection mode is presently enabled
         * @defaultValue `true`
         */
        enabled: fields.BooleanField<{ initial: true }>;

        /**
         * The maximum range in distance units at which this mode can detect targets
         * @defaultValue `0`
         */
        range: fields.NumberField<{ required: true; nullable: false; min: 0; step: 0.01; initial: 0 }>;
      }>,
      {
        validate: () => void;
      }
    >;

    /**
     * An object of optional key/value flags
     * @defaultValue `{}`
     */
    flags: fields.ObjectField.FlagsField<"Token">;
  }

  interface Schema extends SharedProtoSchema {
    /**
     * The Token _id which uniquely identifies it within its parent Scene
     * @defaultValue `null`
     */
    _id: fields.DocumentIdField;

    /**
     * The _id of an Actor document which this Token represents
     * @defaultValue `null`
     */
    actorId: fields.ForeignDocumentField<documents.BaseActor, { idOnly: true }>;

    /**
     * The ActorDelta embedded document which stores the differences between this
     * token and the base actor it represents.
     */
    delta: ActorDeltaField<documents.BaseActor>;

    /**
     * The x-coordinate of the top-left corner of the Token
     * @defaultValue `0`
     */
    x: fields.NumberField<{ required: true; integer: true; nullable: false; initial: 0; label: "XCoord" }>;

    /**
     * The y-coordinate of the top-left corner of the Token
     * @defaultValue `0`
     */
    y: fields.NumberField<{ required: true; integer: true; nullable: false; initial: 0; label: "YCoord" }>;

    /**
     * The vertical elevation of the Token, in distance units
     * @defaultValue `0`
     */
    elevation: fields.NumberField<{ required: true; nullable: false; initial: 0 }>;

    /**
     * An array of effect icon paths which are displayed on the Token
     * @defaultValue `[]`
     */
    effects: fields.ArrayField<fields.StringField>;

    /**
     * A single icon path which is displayed as an overlay on the Token
     * @defaultValue `""`
     */
    overlayEffect: fields.StringField;

    /**
     * Is the Token currently hidden from player view?
     * @defaultValue `false`
     */
    hidden: fields.BooleanField;
  }
}

declare namespace ActorDeltaField {}
