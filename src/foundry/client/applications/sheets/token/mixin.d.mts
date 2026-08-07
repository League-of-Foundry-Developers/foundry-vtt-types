import type HandlebarsApplicationMixin from "#client/applications/api/handlebars-application.mjs";
import type { PrototypeToken } from "#common/data/data.mjs";
import type { FixedInstanceType, IntentionalPartial, Mixin, RemoveIndexSignatures } from "#utils";
import type ApplicationV2 from "../../api/application.d.mts";
import type FormDataExtended from "../../ux/form-data-extended.d.mts";
import type { HTMLMultiCheckboxElement } from "../../elements/multi-select.d.mts";
import type { DataSchema, NumberField } from "#common/data/fields.d.mts";
import type { AdaptiveLightingShader } from "#client/canvas/rendering/shaders/_module.d.mts";
import type CombatConfiguration from "#client/data/combat-config.d.mts";

/**
 * The mixed application class augmented with shared Token configuration functionality.
 *
 * @remarks This does NOT exist at runtime. This is only here to be used as a type when relevant as well as to avoid
 * issues with anonymous mixin classes.
 *
 * @privateRemarks `_prepareContext` and `_preparePartContext` are inherited from the composed base rather than
 * redeclared here. Their self-referential application signatures cause TypeScript to exceed its stack depth when
 * checking a concrete class composed through this mixin.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare class TokenApplication {
  /** @privateRemarks All mixin classes should accept anything for its constructor. */
  constructor(...args: any[]);

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  readonly [ApplicationV2.Internal.__RenderContext]: {};

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  readonly [ApplicationV2.Internal.__Configuration]: {};

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  readonly [ApplicationV2.Internal.__RenderOptions]: {};

  // Mixin override.
  static DEFAULT_OPTIONS: ApplicationV2.DefaultOptions;

  // Mixin override.
  static PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  // Mixin override.
  static TABS: Record<string, ApplicationV2.TabsConfiguration>;

  /**
   * Localized Token Display Modes
   */
  static get DISPLAY_MODES(): Record<CONST.TOKEN_DISPLAY_MODES, string>;

  /**
   * Localized Token Dispositions
   */
  static get TOKEN_DISPOSITIONS(): Record<CONST.TOKEN_DISPOSITIONS, string>;

  /**
   * Localized Token Turn Marker modes
   */
  static get TURN_MARKER_MODES(): Record<CONST.TOKEN_TURN_MARKER_MODES, string>;

  /**
   * Localized Token Shapes
   */
  static get TOKEN_SHAPES(): Record<CONST.TOKEN_SHAPES, string>;

  /**
   * Maintain a copy of the original to show a real-time preview of changes.
   */
  protected _preview: TokenApplicationMixin.Token | null;

  /**
   * Is the token a PrototypeToken?
   */
  isPrototype: boolean;

  /**
   * A reference to the Actor the token depicts
   *
   * @throws If the mixed class does not implement this getter.
   */
  get actor(): Actor.Implementation | null;

  /**
   * The TokenDocument or PrototypeToken
   *
   * @throws If the mixed class does not implement this getter.
   */
  get token(): TokenApplicationMixin.Token;

  /**
   * The schema fields for this token DataModel
   *
   * @throws If the mixed class does not implement this getter.
   */
  protected get _fields(): DataSchema;

  /**
   * Prepare data to be displayed in the Identity tab.
   */
  protected _prepareIdentityTab(): TokenApplicationMixin.IdentityTabContext;

  /**
   * Prepare data to be displayed in the Appearance tab.
   *
   * @privateRemarks {@linkcode foundry.applications.sheets.TokenConfig._prepareAppearanceTab | TokenConfig} declares an
   * `options` parameter that is never passed — `_preparePartContext` invokes the tab preparers with no arguments — so
   * it is omitted here.
   */
  protected _prepareAppearanceTab(): Promise<TokenApplicationMixin.AppearanceTabContext>;

  /**
   * Prepare data to be displayed in the Vision tab.
   */
  protected _prepareVisionTab(): Promise<TokenApplicationMixin.VisionTabContext>;

  /**
   * Prepare data to be displayed in the Vision tab.
   */
  protected _prepareLightTab(): Promise<TokenApplicationMixin.LightTabContext>;

  /**
   * Prepare data to be displayed in the Resources tab.
   */
  protected _prepareResourcesTab(): Promise<TokenApplicationMixin.ResourcesTabContext>;

  /**
   * Prepare form submission buttons.
   */
  protected _prepareButtons(): ApplicationV2.FormFooterButton[];

  // Mixin override.
  protected _processFormData(
    event: SubmitEvent | null,
    form: HTMLFormElement,
    formData: FormDataExtended,
  ): TokenApplicationMixin.SubmitData;

  // Mixin override.
  protected _onChangeForm(formConfig: ApplicationV2.FormConfiguration, event: Event): void;

  /**
   * Process several fields from form submission data into proper model changes.
   * @param submitData - Form submission data passed through {@linkcode foundry.applications.ux.FormDataExtended}
   */
  protected _processChanges(submitData: TokenApplicationMixin.SubmitData): void;

  static #TokenApplicationStatic: true;
  #TokenApplication: true;
}

/**
 * A mixin for UI shared between TokenDocument and PrototypeToken sheets
 */
declare function TokenApplicationMixin<BaseClass extends TokenApplicationMixin.BaseClass>(
  BaseApplication: BaseClass,
): TokenApplicationMixin.Mix<BaseClass>;

declare namespace TokenApplicationMixin {
  type AnyMixedConstructor = ReturnType<typeof TokenApplicationMixin<BaseClass>>;
  interface AnyMixed extends FixedInstanceType<AnyMixedConstructor> {}

  type BaseClass = ApplicationV2.Internal.Constructor;
  type Mix<BaseClass extends TokenApplicationMixin.BaseClass> = Mixin<
    typeof TokenApplication,
    HandlebarsApplicationMixin.Mix<BaseClass>
  >;

  type Token = TokenDocument.Implementation | PrototypeToken;

  /**
   * @remarks The tab members are `IntentionalPartial`ed because each is only set for the one part that consumes it.
   */
  interface RenderContext<
    ConcreteToken extends TokenApplicationMixin.Token,
  > extends IntentionalPartial<PreparePartContext> {
    tabClasses: string;

    /** @remarks The value of {@linkcode TokenApplication._fields | #_fields}. */
    fields: ConcreteToken["schema"]["fields"];

    isPrototype: boolean;

    /** @remarks The value of {@linkcode TokenApplication.DISPLAY_MODES}. */
    displayModes: Record<CONST.TOKEN_DISPLAY_MODES, string>;

    buttons: ApplicationV2.FormFooterButton[];
  }

  /**
   * @remarks Added by {@linkcode TokenApplication._preparePartContext | #_preparePartContext}, which merges in the
   * context of whichever `_prepare<PartId>Tab` method matches the part being rendered.
   */
  interface PreparePartContext
    extends IdentityTabContext, AppearanceTabContext, VisionTabContext, LightTabContext, ResourcesTabContext {
    /** @remarks Only added when the part being rendered is also a tab of the `sheet` group. */
    tab: ApplicationV2.Tab;
  }

  /** @remarks Added for the `identity` part. */
  interface IdentityTabContext {
    isGM: boolean;

    /** @remarks The Actors the current User owns, sorted by name. */
    actors: ActorChoice[];

    /**
     * @remarks The localized `"COMMON.Default"`, suffixed with the inferred movement action's label when one applies.
     * A PrototypeToken never infers one, so it always receives the bare label.
     */
    defaultMovementActionLabel: string;

    /**
     * @remarks Localized {@linkcode CONFIG.Token.Movement.Actions} labels, limited to the actions selectable for this
     * token plus whichever one it currently has.
     */
    movementActions: Record<string, string>;

    /** @remarks The value of {@linkcode TokenApplication.TOKEN_DISPOSITIONS}. */
    dispositions: Record<CONST.TOKEN_DISPOSITIONS, string>;
  }

  /** An entry of {@linkcode IdentityTabContext.actors}. */
  interface ActorChoice {
    value: string;

    label: string;
  }

  /** @remarks Added for the `appearance` part. */
  interface AppearanceTabContext {
    /**
     * @remarks `undefined` for a PrototypeToken, which has no shape to configure.
     * {@linkcode foundry.applications.sheets.TokenConfig | TokenConfig} narrows this to the shapes its parent Scene's
     * grid type permits.
     */
    shapes: Record<CONST.TOKEN_SHAPES, string> | undefined;

    hasAlternates: boolean;

    /** @remarks The Actor's alternate token images keyed by path, or `{}` unless the Actor uses a wildcard image. */
    alternateImages: Record<string, string>;

    colorationTechniques: typeof AdaptiveLightingShader.SHADER_TECHNIQUES;

    randomImgEnabled: boolean;

    /** @remarks The absolute value of the source texture's `scaleX`. */
    scale: number;

    mirrorX: boolean;

    mirrorY: boolean;

    textureFitModes: Record<CONST.TEXTURE_DATA_FIT_MODES, string>;

    ringEffectsInput: RingEffectsInput;

    /**
     * @remarks The ring subject texture when the ring is enabled, otherwise `false`; `null` means no subject texture is
     * configured. Drives the warning that the base texture is being overridden.
     */
    usingSubject: string | null | false;
  }

  /**
   * Render the Token ring effects input using a multi-checkbox element.
   *
   * @remarks The `inputConfig`'s `value` arrives as the numeric ring-effects bitmask and is rewritten in place to the
   * array of enabled effect names before the element is created.
   */
  type RingEffectsInput = (
    field: NumberField,
    inputConfig: foundry.applications.fields.FormInputConfig<number>,
  ) => HTMLMultiCheckboxElement;

  /** @remarks Added for the `vision` part. */
  interface VisionTabContext {
    /** @remarks The `sight` subschema's fields. */
    sightFields: DataSchema;

    /** @remarks {@linkcode CONFIG.Canvas.visionModes} labels keyed by mode id, limited to those with `tokenConfig`. */
    visionModes: Record<string, string>;

    /** @remarks Sorted by localized label. */
    detectionModes: DetectionModeContext[];
  }

  /** An entry of {@linkcode VisionTabContext.detectionModes}. */
  interface DetectionModeContext {
    id: string;

    /** @remarks `null` stands in for an infinite range. */
    range: number | null;

    label: string;

    /** @remarks Whether this mode is present in the token's own source data rather than derived. */
    source: boolean;

    enabled: boolean;
  }

  /** @remarks Added for the `light` part. */
  interface LightTabContext {
    /** @remarks The `light` subschema's fields. */
    lightFields: DataSchema;

    /**
     * @remarks {@linkcode CONFIG.Canvas.darknessAnimations} when the token's light is negative, otherwise
     * {@linkcode CONFIG.Canvas.lightAnimations}.
     */
    lightAnimations:
      | RemoveIndexSignatures<CONFIG.Canvas.LightAnimations>
      | RemoveIndexSignatures<CONFIG.Canvas.DarknessAnimations>;
  }

  /** @remarks Added for the `resources` part. */
  interface ResourcesTabContext {
    barAttributes: TokenDocument.TrackedAttributesChoice[];

    /** @remarks `undefined` for a PrototypeToken, which does not implement `getBarAttribute`. */
    bar1: TokenDocument.GetBarAttributeReturn | undefined;

    /** @remarks `undefined` for a PrototypeToken, which does not implement `getBarAttribute`. */
    bar2: TokenDocument.GetBarAttributeReturn | undefined;

    /** @remarks The value of {@linkcode TokenApplication.TURN_MARKER_MODES}. */
    turnMarkerModes: Record<CONST.TOKEN_TURN_MARKER_MODES, string>;

    turnMarkerAnimations: CombatConfiguration["turnMarkerAnimations"];
  }

  /**
   * @remarks The expanded form submission data {@linkcode TokenApplication._processChanges | #_processChanges} rewrites
   * in place. It is the token's source data plus the `scale`/`mirrorX`/`mirrorY` form-only fields, which
   * `_processChanges` folds into `texture` and then deletes.
   */
  interface SubmitData extends TokenDocument.UpdateData {
    scale?: number | undefined;

    mirrorX?: boolean | undefined;

    mirrorY?: boolean | undefined;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Configuration {}

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface RenderOptions {}
}

export default TokenApplicationMixin;
