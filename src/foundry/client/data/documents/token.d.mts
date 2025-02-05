import type { DeepPartial, InexactPartial, InterfaceToObject } from "fvtt-types/utils";
import type { documents } from "../../../client-esm/client.d.mts";
import type Document from "../../../common/abstract/document.d.mts";
import type { DataSchema, SchemaField } from "../../../common/data/fields.d.mts";
import type { fields, LightData, TextureData } from "../../../common/data/module.d.mts";
import type { ActorDeltaField } from "../../../common/documents/token.d.mts";
import type BaseToken from "../../../common/documents/token.d.mts";

declare global {
  namespace TokenDocument {
    /**
     * The implementation of the TokenDocument document instance configured through `CONFIG.Token.documentClass` in Foundry and
     * {@link DocumentClassConfig | `DocumentClassConfig`} or {@link ConfiguredTokenDocument | `configuration/ConfiguredTokenDocument`} in fvtt-types.
     */
    type Implementation = Document.ConfiguredInstanceForName<"Token">;

    /**
     * The implementation of the TokenDocument document configured through `CONFIG.Token.documentClass` in Foundry and
     * {@link DocumentClassConfig | `DocumentClassConfig`} in fvtt-types.
     */
    type ImplementationClass = Document.ConfiguredClassForName<"Token">;

    /**
     * A document's metadata is special information about the document ranging anywhere from its name,
     * whether it's indexed, or to the permissions a user has over it.
     */
    interface Metadata extends Document.MetadataFor<"Token"> {}

    /**
     * A document's parent is something that can contain it.
     * For example an `Item` can be contained by an `Actor` which makes `Actor` one of its possible parents.
     */
    type Parent = Scene.Implementation | null;

    /**
     * An instance of `TokenDocument` that comes from the database.
     */
    interface Stored extends Document.Stored<TokenDocument.Implementation> {}

    /**
     * The data put in {@link Document._source | `Document._source`}. This data is what was
     * persisted to the database and therefore it must be valid JSON.
     *
     * For example a {@link fields.SetField | `SetField`} is persisted to the database as an array
     * but initialized as a {@link Set | `Set`}.
     *
     * Both `Source` and `PersistedData` are equivalent.
     */
    interface Source extends PersistedData {}

    /**
     * The data put in {@link TokenDocument._source | `TokenDocument._source`}. This data is what was
     * persisted to the database and therefore it must be valid JSON.
     *
     * Both `Source` and `PersistedData` are equivalent.
     */
    interface PersistedData extends fields.SchemaField.PersistedData<Schema> {}

    /**
     * The data necessary to create a document. Used in places like {@link TokenDocument.create | `TokenDocument.create`}
     * and {@link TokenDocument | `new TokenDocument(...)`}.
     *
     * For example a {@link fields.SetField | `SetField`} can accept any {@link Iterable | `Iterable`}
     * with the right values. This means you can pass a `Set` instance, an array of values,
     * a generator, or any other iterable.
     */
    interface CreateData extends fields.SchemaField.CreateData<Schema> {}

    /**
     * The data after a {@link Document | `Document`} has been initialized, for example
     * {@link TokenDocument.name | `TokenDocument#name`}.
     *
     * This is data transformed from {@link TokenDocument.Source | `TokenDocument.Source`} and turned into more
     * convenient runtime data structures. For example a {@link fields.SetField | `SetField`} is
     * persisted to the database as an array of values but at runtime it is a `Set` instance.
     */
    interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

    /**
     * The data used to update a document, for example {@link TokenDocument.update | `TokenDocument#update`}.
     * It is a distinct type from {@link TokenDocument.CreateData | `DeepPartial<TokenDocument.CreateData>`} because
     * it has different rules for `null` and `undefined`.
     */
    interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

    /**
     * Schema definition shared by {@link foundry.data.PrototypeToken | `PrototypeToken`}.
     * Foundry technically implements this through deletion, but it's easier for us to do by extension.
     */
    interface SharedProtoSchema extends DataSchema {
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
       * The token's texture on the canvas.
       * @defaultValue `BaseToken.DEFAULT_ICON`
       */
      texture: TextureData<{ initial: () => typeof BaseToken.DEFAULT_ICON; wildcard: true }>;

      /**
       * @defaultValue `CONST.TOKEN_HEXAGONAL_SHAPES.ELLIPSE_1`
       */
      hexagonalShape: fields.NumberField<{
        initial: typeof CONST.TOKEN_HEXAGONAL_SHAPES.ELLIPSE_1;
        choices: CONST.TOKEN_HEXAGONAL_SHAPES[];
      }>;

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
      light: fields.EmbeddedDataField<typeof LightData>;

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
       * @defaultValue see properties
       */
      occludable: fields.SchemaField<{
        /**
         * @defaultValue `0`
         */
        radius: fields.NumberField<{ nullable: false; min: 0; step: 0.01; initial: 0 }>;
      }>;

      /**
       * @defaultValue see properties
       */
      ring: fields.SchemaField<{
        /**
         * @defaultValue `false`
         */
        enabled: fields.BooleanField;

        /**
         * @defaultValue see properties
         */
        colors: fields.SchemaField<{
          /**
           * @defaultValue `null`
           */
          ring: fields.ColorField;

          /**
           * @defaultValue `null`
           */
          background: fields.ColorField;
        }>;

        /**
         * @defaultValue `1`
         */
        effects: fields.NumberField<{ initial: 1; min: 0; max: 8388607; integer: true }>;

        /**
         * @defaultValue see properties
         */
        subject: fields.SchemaField<{
          /**
           * @defaultValue `1`
           */
          scale: fields.NumberField<{ initial: 1; min: 0.5 }>;

          /**
           * @defaultValue `null`
           */
          texture: fields.FilePathField<{ categories: ["IMAGE"] }>;
        }>;
      }>;

      /**
       * @internal
       */
      _regions: fields.ArrayField<fields.ForeignDocumentField<typeof documents.BaseRegion, { idOnly: true }>>;

      /**
       * An object of optional key/value flags
       * @defaultValue `{}`
       */
      flags: fields.ObjectField.FlagsField<"Token", InterfaceToObject<CoreFlags>>;
    }

    /**
     * The schema for {@link TokenDocument | `TokenDocument`}. This is the source of truth for how an TokenDocument document
     * must be structured.
     *
     * Foundry uses this schema to validate the structure of the {@link TokenDocument | `TokenDocument`}. For example
     * a {@link fields.StringField | `StringField`} will enforce that the value is a string. More
     * complex fields like {@link fields.SetField | `SetField`} goes through various conversions
     * starting as an array in the database, initialized as a set, and allows updates with any
     * iterable.
     */
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
      actorId: fields.ForeignDocumentField<typeof documents.BaseActor, { idOnly: true }>;

      /**
       * The ActorDelta embedded document which stores the differences between this
       * token and the base actor it represents.
       */
      delta: ActorDeltaField<typeof documents.BaseActor>;

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

    namespace DatabaseOperation {
      /** Options passed along in Get operations for TokenDocuments */
      interface Get extends foundry.abstract.types.DatabaseGetOperation<TokenDocument.Parent> {}
      /** Options passed along in Create operations for TokenDocuments */
      interface Create<Temporary extends boolean | undefined = boolean | undefined>
        extends foundry.abstract.types.DatabaseCreateOperation<
          TokenDocument.CreateData,
          TokenDocument.Parent,
          Temporary
        > {}
      /** Options passed along in Delete operations for TokenDocuments */
      interface Delete extends foundry.abstract.types.DatabaseDeleteOperation<TokenDocument.Parent> {}
      /** Options passed along in Update operations for TokenDocuments */
      interface Update
        extends foundry.abstract.types.DatabaseUpdateOperation<TokenDocument.UpdateData, TokenDocument.Parent> {
        previousActorId?: string | null;
        animate?: boolean;
        _priorRegions?: Record<string, string[]>;
        _priorPosition?: Record<string, { x: number; y: number; elevation: number }>;
        teleport?: boolean;
        forced?: boolean;
      }

      /** Options for {@link TokenDocument.createDocuments | `TokenDocument.createDocuments`} */
      type CreateOperation<Temporary extends boolean | undefined = boolean | undefined> =
        Document.Database.CreateOperation<Create<Temporary>>;
      /** Options for {@link TokenDocument._preCreateOperation | `TokenDocument._preCreateOperation`} */
      type PreCreateOperationStatic = Document.Database.PreCreateOperationStatic<Create>;
      /** Options for {@link TokenDocument#_preCreate | `TokenDocument#_preCreate`} */
      type PreCreateOperationInstance = Document.Database.PreCreateOperationInstance<Create>;
      /** Options for {@link TokenDocument#_onCreate | `TokenDocument#_onCreate`} */
      type OnCreateOperation = Document.Database.OnCreateOperation<Create>;

      /** Options for {@link TokenDocument.updateDocuments | `TokenDocument.updateDocuments`} */
      type UpdateOperation = Document.Database.UpdateOperation<Update>;
      /** Options for {@link TokenDocument._preUpdateOperation | `TokenDocument._preUpdateOperation`} */
      type PreUpdateOperationStatic = Document.Database.PreUpdateOperationStatic<Update>;
      /** Options for {@link TokenDocument#_preUpdate | `TokenDocument#_preUpdate`} */
      type PreUpdateOperationInstance = Document.Database.PreUpdateOperationInstance<Update>;
      /** Options for {@link TokenDocument#_onUpdate | `TokenDocument#_onUpdate`} */
      type OnUpdateOperation = Document.Database.OnUpdateOperation<Update>;

      /** Options for {@link TokenDocument.deleteDocuments | `TokenDocument.deleteDocuments`} */
      type DeleteOperation = Document.Database.DeleteOperation<Delete>;
      /** Options for {@link TokenDocument._preDeleteOperation | `TokenDocument._preDeleteOperation`} */
      type PreDeleteOperationStatic = Document.Database.PreDeleteOperationStatic<Delete>;
      /** Options for {@link TokenDocument#_preDelete | `TokenDocument#_preDelete`} */
      type PreDeleteOperationInstance = Document.Database.PreDeleteOperationInstance<Delete>;
      /** Options for {@link TokenDocument#_onDelete | `TokenDocument#_onDelete`} */
      type OnDeleteOperation = Document.Database.OnDeleteOperation<Delete>;
    }

    interface CoreFlags {
      core?: {
        animationSeed?: number;
        randomizeVideo?: boolean;
      };
    }

    /**
     * @deprecated - {@link TokenDocument.DatabaseOperation}
     */
    interface DatabaseOperations extends Document.Database.Operations<TokenDocument> {}

    /**
     * @deprecated - {@link TokenDocument.DatabaseOperation}
     */
    interface DatabaseOperations extends Document.Database.Operations<TokenDocument> {}

    /**
     * @deprecated {@link TokenDocument.CreateData | `TokenDocument.CreateData`}
     */
    interface ConstructorData extends TokenDocument.CreateData {}

    /**
     * @deprecated {@link TokenDocument.implementation | `TokenDocument.ImplementationClass`}
     */
    type ConfiguredClass = ImplementationClass;

    /**
     * @deprecated {@link TokenDocument.Implementation | `TokenDocument.Implementation`}
     */
    type ConfiguredInstance = Implementation;
  }

  /**
   * The client-side Token document which extends the common BaseToken model.
   *
   * @see {@link Scene}               The Scene document type which contains Token embedded documents
   * @see {@link TokenConfig}      The Token configuration application
   */
  class TokenDocument extends CanvasDocumentMixin(foundry.documents.BaseToken) {
    static override metadata: TokenDocument.Metadata;

    static get implementation(): TokenDocument.ImplementationClass;

    /**
     * A singleton collection which holds a reference to the synthetic token actor by its base actor's ID.
     */
    actors(): Collection<Actor.Implementation>;

    /**
     * A lazily evaluated reference to the Actor this Token modifies.
     * If actorLink is true, then the document is the primary Actor document.
     * Otherwise the Actor document is a synthetic (ephemeral) document constructed using the Token's ActorDelta.
     */
    get actor(): Actor.Implementation | null;

    /**
     * A reference to the base, World-level Actor this token represents.
     */
    get baseActor(): Actor | undefined;

    /**
     * An indicator for whether or not the current User has full control over this Token document.
     */
    get isOwner(): boolean;

    /**
     * A convenient reference for whether this TokenDocument is linked to the Actor it represents, or is a synthetic copy
     */
    get isLinked(): boolean;

    /**
     * Does this TokenDocument have the SECRET disposition and is the current user lacking the necessary permissions
     * that would reveal this secret?
     */
    get isSecret(): boolean;

    /**
     * Return a reference to a Combatant that represents this Token, if one is present in the current encounter.
     */
    get combatant(): Combatant.Implementation | null;

    /**
     * An indicator for whether or not this Token is currently involved in the active combat encounter.
     */
    get inCombat(): boolean;

    /**
     * The Regions this Token is currently in.
     */
    regions: Set<RegionDocument.Implementation> | null;

    // TODO: Same as `DataModel._initialize`
    protected override _initialize(options?: any): void;

    override prepareBaseData(): void;

    override prepareEmbeddedDocuments(): void;

    override prepareDerivedData(): void;

    /**
     * Infer the subject texture path to use for a token ring.
     */
    protected _inferRingSubjectTexture(): string;

    /**
     * Prepare detection modes which are available to the Token.
     * Ensure that every Token has the basic sight detection mode configured.
     */
    protected _prepareDetectionModes(): void;

    /**
     * A helper method to retrieve the underlying data behind one of the Token's attribute bars
     * @param barName     - The named bar to retrieve the attribute for
     * @returns The attribute displayed on the Token bar, if any
     */
    getBarAttribute(
      barName: string,
      options?: InexactPartial<{
        /**
         * An alternative attribute path to get instead of the default one
         */
        alternative: string;
      }>,
    ): SingleAttributeBar | ObjectAttributeBar | null;

    /**
     * Test whether a Token has a specific status effect.
     * @param statusId - The status effect ID as defined in CONFIG.statusEffects
     * @returns Does the Actor of the Token have this status effect?
     */
    hasStatusEffect(statusId: string): boolean;

    /**
     * Add or remove this Token from a Combat encounter.
     * @param options - Additional options passed to TokenDocument.createCombatants or
     *                  TokenDocument.deleteCombatants
     *                  Default: `{}`
     *  @returns Is this Token now an active Combatant?
     */
    toggleCombatant({
      active,
      ...options
    }?: InexactPartial<
      CreateCombatantOptions & {
        /**
         * Require this token to be an active Combatant or to be removed.
         * Otherwise, the current combat state of the Token is toggled.
         */
        active: boolean;
      }
    >): Promise<boolean>;

    /**
     * Create or remove Combatants for an array of provided Token objects.
     * @param tokens  - The tokens which should be added to the Combat
     * @param options - Options which modify the toggle operation
     *                  Default: `{}`
     * @returns An array of created Combatant documents
     */
    static createCombatants(tokens: TokenDocument[], options?: CreateCombatantOptions): Promise<Combatant[]>;

    /**
     * Remove Combatants for the array of provided Tokens.
     * @param tokens  - The tokens which should removed from the Combat
     * @param options - Options which modify the operation
     *                  Default: `{}`
     * @returns An array of deleted Combatant documents
     */
    static deleteCombatants(tokens: TokenDocument[], options?: CreateCombatantOptions): Promise<Combatant[]>;

    /**
     * Convenience method to change a token vision mode.
     * @param visionMode - The vision mode to apply to this token.
     * @param defaults   - If the vision mode should be updated with its defaults.
     *                     Default = `true`
     */
    updateVisionMode(
      visionMode: typeof CONFIG.Canvas.visionModes,
      defaults?: boolean,
    ): Promise<ReturnType<this["update"]>>;

    override getEmbeddedCollection<DocType extends Document.Type>(
      embeddedName: DocType,
    ): Collection<Document.ConfiguredInstanceForName<DocType>>;

    /**
     * @privateRemarks _onCreate, _preUpdate, _onUpdate, _onDelete, preCreateOperation, _preUpdateOperation, _onCreateOperation,
     * _onUpdateOperation, _onDeleteOperation, _preCreateDescendantDocuments, _preUpdateDescendantDocuments, _preDeleteDescendantDocuments,
     * _onUpdateDescendantDocuments, and _onDeleteDescendantDocuments are all overridden but with no signature changes.
     * For type simplicity they are left off. These methods historically have been the source of a large amount of computation from tsc.
     */

    /**
     * Is to Token document updated such that the Regions the Token is contained in may change?
     * Called as part of the preUpdate workflow.
     * @param changes - The changes.
     * @returns Could this Token update change Region containment?
     */

    protected _couldRegionsChange(changes: SchemaField.AssignmentData<foundry.documents.BaseToken.Schema>): boolean;

    /**
     * When the base Actor for a TokenDocument changes, we may need to update its Actor instance
     */
    protected _onUpdateBaseActor(
      update?: DeepPartial<Actor.Implementation["_source"]>,
      options?: Document.OnUpdateOptions<"Actor">,
    ): void;

    /**
     * Whenever the token's actor delta changes, or the base actor changes, perform associated refreshes.
     * @param update  - The update delta.
     * @param options - The options provided to the update.
     */
    protected _onRelatedUpdate(
      update?: DeepPartial<Actor.Implementation["_source"]>,
      /** @privateRemarks foundry calls this field operation
       * but it's being passed options (and then ignores them)
       */
      operation?: Document.OnUpdateOptions<"Actor">,
    ): void;

    /**
     * Get an Array of attribute choices which could be tracked for Actors in the Combat Tracker
     * @param _path - (default: `[]`)
     */
    // TODO: There's some very complex handling for non-datamodel Actor system implementations if we want
    static getTrackedAttributes(data?: Actor.Implementation["system"], _path?: string[]): TrackedAttributesDescription;

    /**
     * Retrieve an Array of attribute choices from a plain object.
     * @param schema - The schema to explore for attributes.
     */
    protected static _getTrackedAttributesFromObject(data: object, _path?: string[]): TrackedAttributesDescription;

    /**
     * Retrieve an Array of attribute choices from a SchemaField.
     * @param schema - The schema to explore for attributes.
     */
    protected static _getTrackedAttributesFromSchema(
      schema: foundry.data.fields.SchemaField.Any,
      _path?: string[],
    ): TrackedAttributesDescription;

    /**
     * Retrieve any configured attributes for a given Actor type.
     * @param type - The Actor type.
     */
    static _getConfiguredTrackedAttributes(type: string): TrackedAttributesDescription | void;

    /**
     * Inspect the Actor data model and identify the set of attributes which could be used for a Token Bar
     * @param attributes - The tracked attributes which can be chosen from
     * @returns A nested object of attribute choices to display
     */
    static getTrackedAttributeChoices(attributes?: TrackedAttributesDescription): Record<string, string[]>;

    /**
     * @deprecated since v11
     * @remarks `"TokenDocument#getActor has been deprecated. Please use the`
     * `TokenDocument#actor getter to retrieve the Actor instance that the TokenDocument represents, or use`
     * `TokenDocument#delta#apply to generate a new synthetic Actor instance."`
     */
    getActor(): Actor.Implementation;

    /**
     * @deprecated since v11
     */
    get actorData(): this["delta"]["_source"];

    /**
     * @deprecated since v11
     */
    set actorData(actorData: this["delta"]["_source"]);

    /**
     * A helper function to toggle a status effect which includes an Active Effect template
     * @param effectData - The Active Effect data, including statusId
     * @param options    - Options to configure application of the Active Effect
     *                     (default: `{}`)
     * @returns Whether the Active Effect is now on or off
     * @deprecated since v12
     * @remarks `TokenDocument#toggleActiveEffect is deprecated in favor of Actor#toggleStatusEffect"`
     */
    toggleActiveEffect(
      effectData: CONFIG.StatusEffect,
      options?: InexactPartial<ToggleActiveEffectOptions> | undefined,
    ): Promise<boolean>;
  }

  // The getBarAttribute monkeypatch is simply inside the data model definition at `src\foundry\common\data\data.d.mts`

  interface TrackedAttributesDescription {
    /** A list of property path arrays to attributes with both a value and a max property. */
    bar: string[][];
    /** A list of property path arrays to attributes that have only a value property. */
    value: string[][];
  }

  interface CreateCombatantOptions {
    /**
     * A specific Combat instance which should be modified. If undefined,
     * the current active combat will be modified if one exists. Otherwise, a new
     * Combat encounter will be created if the requesting user is a Gamemaster.
     */
    combat?: Combat | undefined;
  }
}

interface SingleAttributeBar {
  type: "value";
  attribute: string;
  value: number;
  editable: boolean;
}

interface ObjectAttributeBar {
  type: "bar";
  attribute: string;
  value: number;
  max: number;
  editable: boolean;
}

interface ToggleActiveEffectOptions {
  /**
   * Should the Active Effect icon be displayed as an overlay on the token?
   * @defaultValue `false`
   */
  overlay: boolean;

  /** Force a certain active state for the effect. */
  active: boolean;
}
