import type HandlebarsApplicationMixin from "#client/applications/api/handlebars-application.mjs";
import type { PrototypeToken } from "#common/data/data.mjs";
import type { AdaptiveLightingShader } from "#client/canvas/rendering/shaders/_module.d.mts";
import type { DeepPartial, FixedInstanceType, Mixin } from "#utils";
import type ApplicationV2 from "../../api/application.d.mts";
import type FormDataExtended from "../../ux/form-data-extended.d.mts";
import type { FormInputConfig } from "../../forms/fields.d.mts";
import type { HTMLMultiCheckboxElement } from "../../elements/multi-select.d.mts";

/**
 * @remarks This does NOT exist at runtime. This is only here to be used as a type when relevant as well as to avoid
 * issues with anonymous mixin classes.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare class TokenApplication {
  /** @privateRemarks All mixin classses should accept anything for its constructor. */
  constructor(...args: any[]);

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  readonly [ApplicationV2.Internal.__RenderContext]: {};

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  readonly [ApplicationV2.Internal.__Configuration]: {};

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  readonly [ApplicationV2.Internal.__RenderOptions]: {};

  /**
   * @defaultValue
   * ```js
   * {
   *   classes: ["token-config"],
   *   window: {
   *     contentClasses: ["standard-form"],
   *     icon: "fa-solid fa-circle-user"
   *   },
   *   position: {width: 560},
   *   form: {closeOnSubmit: true},
   *   actions: {
   *     overrideDetectionMode: TokenApplication.#onOverrideDetectionMode,
   *     removeDetectionMode: TokenApplication.#onRemoveDetectionMode
   *   }
   * }
   * ```
   */
  static DEFAULT_OPTIONS: DeepPartial<ApplicationV2.Configuration> & object;

  static PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * @defaultValue
   * ```js
   * {
   *   sheet: {
   *     tabs: [
   *       {id: "identity", icon: "fa-solid fa-memo-pad"},
   *       {id: "appearance", icon: "fa-solid fa-square-user"},
   *       {id: "vision", icon: "fa-solid fa-eye"},
   *       {id: "light", icon: "fa-solid fa-lightbulb"},
   *       {id: "resources", icon: "fa-solid fa-heart"}
   *     ],
   *     initial: "identity",
   *     labelPrefix: "TOKEN.TABS"
   *   }
   * }
   * ```
   */
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
  protected _preview: TokenDocument.Implementation | PrototypeToken | null;

  /**
   * Is the token a PrototypeToken?
   */
  isPrototype: boolean;

  /**
   * A reference to the Actor the token depicts
   */
  get actor(): Actor.Implementation | null;

  /**
   * The TokenDocument or PrototypeToken
   */
  get token(): TokenDocument.Implementation | PrototypeToken;

  /**
   * The schema fields for this token DataModel
   */
  protected get _fields(): TokenApplicationMixin.Token["schema"]["fields"];

  protected _prepareContext(
    options: DeepPartial<ApplicationV2.RenderOptionsOf<this>> & { isFirstRender: boolean },
  ): Promise<ApplicationV2.RenderContextOf<this>>;

  protected _preparePartContext(
    partId: string,
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<ApplicationV2.RenderOptionsOf<this>>,
  ): Promise<ApplicationV2.RenderContextOf<this>>;

  /**
   * Prepare data to be displayed in the Identity tab.
   */
  protected _prepareIdentityTab(): TokenApplicationMixin.IdentityTabContext;

  /**
   * Prepare data to be displayed in the Appearance tab.
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

  protected _processFormData(event: SubmitEvent | null, form: HTMLFormElement, formData: FormDataExtended): object;

  protected _onChangeForm(formConfig: ApplicationV2.FormConfiguration, event: Event): void;

  /**
   * Process several fields from form submission data into proper model changes.
   * @param submitData - Form submission data passed through {@linkcode foundry.applications.ux.FormDataExtended}
   */
  protected _processChanges(submitData: object): void;
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
  type Mix<BaseClass extends TokenApplicationMixin.BaseClass> = HandlebarsApplicationMixin.Mix<
    Mixin<typeof TokenApplication, BaseClass>
  >;

  type Token = TokenDocument.Implementation | PrototypeToken;

  interface IdentityTabContext {
    isGM: boolean;
    actors: { value: string; label: string }[];
    defaultMovementActionLabel: string;
    movementActions: Record<string, string>;
    dispositions: Record<CONST.TOKEN_DISPOSITIONS, string>;
  }

  interface AppearanceTabContext {
    shapes: Record<CONST.TOKEN_SHAPES, string> | undefined;
    hasAlternates: boolean;
    alternateImages: Record<string, string>;
    colorationTechniques: typeof AdaptiveLightingShader.SHADER_TECHNIQUES;
    randomImgEnabled: boolean;
    scale: number;
    mirrorX: boolean;
    mirrorY: boolean;
    textureFitModes: Record<CONST.TEXTURE_DATA_FIT_MODES, string>;
    ringEffectsInput: (
      field: foundry.data.fields.NumberField,
      inputConfig: FormInputConfig<string[]>,
    ) => HTMLMultiCheckboxElement;
    usingSubject: boolean;
  }

  interface VisionTabContext {
    sightFields: TokenDocument.SharedProtoSchema["sight"]["fields"];
    visionModes: Record<string, string>;

    /**
     * @remarks The `...rest` of each detection mode's data, beyond `range`, is spread in here as well, but the only
     * guaranteed common property between a mode's source and derived data is `enabled`.
     */
    detectionModes: { id: string; range: number | null; label: string; source: boolean; enabled: boolean }[];
  }

  interface LightTabContext {
    lightFields: TokenDocument.SharedProtoSchema["light"]["fields"];
    lightAnimations: typeof CONFIG.Canvas.darknessAnimations | typeof CONFIG.Canvas.lightAnimations;
  }

  interface ResourcesTabContext {
    barAttributes: TokenDocument.TrackedAttributesChoice[];
    bar1: TokenDocument.GetBarAttributeReturn | undefined;
    bar2: TokenDocument.GetBarAttributeReturn | undefined;
    turnMarkerModes: Record<CONST.TOKEN_TURN_MARKER_MODES, string>;
    turnMarkerAnimations: foundry.data.CombatConfiguration["turnMarkerAnimations"];
  }

  interface RenderContext<ConcreteToken extends TokenApplicationMixin.Token>
    extends
      Partial<IdentityTabContext>,
      Partial<AppearanceTabContext>,
      Partial<VisionTabContext>,
      Partial<LightTabContext>,
      Partial<ResourcesTabContext> {
    rootId: string;
    source: ConcreteToken["_source"];
    fields: ConcreteToken["schema"]["fields"];
    gridUnits: string;
    isPrototype: boolean;
    displayModes: Record<CONST.TOKEN_DISPLAY_MODES, string>;
    buttons: ApplicationV2.FormFooterButton[];
    tabClasses: string;
    tab?: ApplicationV2.Tab | undefined;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Configuration {}

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface RenderOptions {}
}

export default TokenApplicationMixin;
