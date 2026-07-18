import type { Identity } from "#utils";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";
import type ApplicationV2 from "../api/application.d.mts";
import type FormDataExtended from "../ux/form-data-extended.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      ActiveEffectConfig: ActiveEffectConfig.Any;
    }
  }
}

/**
 * The Application responsible for configuring a single ActiveEffect document within a parent Actor or Item.
 */
declare class ActiveEffectConfig<
  RenderContext extends ActiveEffectConfig.RenderContext = ActiveEffectConfig.RenderContext,
  Configuration extends ActiveEffectConfig.Configuration = ActiveEffectConfig.Configuration,
  RenderOptions extends ActiveEffectConfig.RenderOptions = ActiveEffectConfig.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  ActiveEffect.Implementation,
  RenderContext,
  Configuration,
  RenderOptions
> {
  /**
   * @defaultValue
   * ```js
   * {
   *   classes: ["active-effect-config"],
   *   window: {
   *     contentClasses: ["standard-form"],
   *     icon: "fa-solid fa-person-rays"
   *   },
   *   position: {width: 560},
   *   form: {closeOnSubmit: true},
   *   actions: {
   *     addChange: ActiveEffectConfig.#onAddChange,
   *     deleteChange: ActiveEffectConfig.#onDeleteChange
   *   }
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: DocumentSheetV2.DefaultOptions;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * @defaultValue
   * ```js
   * {
   *   sheet: {
   *     tabs: [
   *       {id: "details", icon: "fa-solid fa-book"},
   *       {id: "duration", icon: "fa-solid fa-clock"},
   *       {id: "changes", icon: "fa-solid fa-gears"}
   *     ],
   *     initial: "details",
   *     labelPrefix: "EFFECT.TABS"
   *   }
   * }
   * ```
   */
  static override TABS: Record<string, ApplicationV2.TabsConfiguration>;

  protected override _attachFrameListeners(): void;

  protected override _preparePartContext(
    partId: string,
    context: ApplicationV2.RenderContextOf<this>,
  ): Promise<ApplicationV2.RenderContextOf<this>>;

  /**
   * Prepare render context for a single change object.
   * @param context - Data for rendering the change row
   */
  protected _renderChange(context: ActiveEffectConfig.RenderChangeContext): Promise<string>;

  /**
   * Prepare display context for the ActiveEffect's `start` data.
   * @remarks TODO: Typed loosely because fvtt-types
   * doesn't yet type the v14 `start` schema field on `ActiveEffect`.
   */
  protected _prepareStartContext(): Promise<Record<string, unknown> | null>;

  protected override _processFormData(
    event: SubmitEvent | null,
    form: HTMLFormElement,
    formData: FormDataExtended,
  ): object;

  /**
   * Process submission data for a single change object.
   * @param change - The submitted change object with the value deserialized
   * @param index  - The object's index in the submitted array
   */
  protected _processChangeSubmission(change: ActiveEffect.ChangeData, index: number): void;

  protected override _onChangeForm(formConfig: ApplicationV2.FormConfiguration, event: Event): void;
}

declare namespace ActiveEffectConfig {
  interface Any extends AnyActiveEffectConfig {}
  interface AnyConstructor extends Identity<typeof AnyActiveEffectConfig> {}

  interface RenderChangeContext {
    /** A copy of the change from the Effect's source array */
    change: ActiveEffect.ChangeData;

    /** The change object's index in the array */
    index: number;

    /**
     * The defined fields of the change data
     * @remarks Typed as a generic schema because `system` is a dynamic, subtype-dependent
     * {@linkcode foundry.data.fields.TypeDataField}.
     */
    fields: foundry.data.fields.DataSchema;

    /** The change type's default priority */
    defaultPriority: number | undefined;

    /** All change types and their localized labels */
    changeTypes: Record<string, string>;

    /**
     * The full definition of the change's type, if registered
     * @remarks TODO: Typed loosely because `ActiveEffect.CHANGE_TYPES` isn't yet typed by fvtt-types.
     */
    changeType?: unknown;
  }

  interface RenderContext
    extends HandlebarsApplicationMixin.RenderContext, DocumentSheetV2.RenderContext<ActiveEffect.Implementation> {
    tab?: ApplicationV2.Tab | undefined;
    tabClasses?: string | undefined;
    isActorEffect?: boolean | undefined;
    isItemEffect?: boolean | undefined;
    statuses?: { value: string; label: string }[] | undefined;
    showIconOptions?: { value: CONST.ACTIVE_EFFECT_SHOW_ICON; label: string }[] | undefined;

    /**
     * @remarks TODO: Typed loosely because fvtt-types
     * doesn't yet type the v14 `start` schema field on `ActiveEffect`.
     */
    start?: Record<string, unknown> | null | undefined;

    hasDuration?: boolean | undefined;
    durationUnits?: { value: CONST.ACTIVE_EFFECT_DURATION_UNITS; label: string; group: string }[] | undefined;
    expiryEvents?: Record<string, string> | undefined;
    changes?: string[] | undefined;
    buttons?: ApplicationV2.FormFooterButton[] | undefined;
  }

  interface Configuration
    extends HandlebarsApplicationMixin.Configuration, DocumentSheetV2.Configuration<ActiveEffect.Implementation> {}

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, DocumentSheetV2.RenderOptions {}
}

declare abstract class AnyActiveEffectConfig extends ActiveEffectConfig<
  ActiveEffectConfig.RenderContext,
  ActiveEffectConfig.Configuration,
  ActiveEffectConfig.RenderOptions
> {
  constructor(...args: never);
}

export default ActiveEffectConfig;
