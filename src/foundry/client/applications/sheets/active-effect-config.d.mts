import type { DeepPartial, Identity, IntentionalPartial } from "#utils";
import type ApplicationV2 from "../api/application.d.mts";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";
import type FormDataExtended from "../ux/form-data-extended.d.mts";
import type { DataSchema } from "#common/data/fields.d.mts";

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
  static override DEFAULT_OPTIONS: DocumentSheetV2.DefaultOptions;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  static override TABS: Record<string, ApplicationV2.TabsConfiguration>;

  protected override _attachFrameListeners(): void;

  protected override _preparePartContext(
    partId: string,
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<RenderOptions>,
  ): Promise<ApplicationV2.RenderContextOf<this>>;

  /**
   * Prepare render context for a single change object.
   * @param context - Data for rendering the change row
   */
  protected _renderChange(context: ActiveEffectConfig.RenderChangeContext): Promise<string>;

  /**
   * Prepare display context for {@linkcode ActiveEffectConfig.StartContext | EffectStartData}.
   */
  protected _prepareStartContext(): Promise<ActiveEffectConfig.StartContext | null>;

  protected override _processFormData(
    event: SubmitEvent | null,
    form: HTMLFormElement,
    formData: FormDataExtended,
  ): DocumentSheetV2.SubmitData<ActiveEffect.Implementation>;

  /**
   * Process submission data for a single change object.
   * @param change - The submitted change object with the value deserialized
   * @param index  - The object's index in the submitted array
   */
  protected _processChangeSubmission(change: ActiveEffect.ChangeData, index: number): void;

  protected override _onChangeForm(formConfig: ApplicationV2.FormConfiguration, event: Event): void;

  static #ActiveEffectConfig: true;
}

declare namespace ActiveEffectConfig {
  interface Any extends AnyActiveEffectConfig {}
  interface AnyConstructor extends Identity<typeof AnyActiveEffectConfig> {}

  /**
   * @remarks Every added member comes from
   * {@linkcode ActiveEffectConfig._preparePartContext | #_preparePartContext}, which only sets the members
   * the part being rendered consumes, so they are all `IntentionalPartial`ed.
   */
  interface RenderContext
    extends
      HandlebarsApplicationMixin.RenderContext,
      DocumentSheetV2.RenderContext<ActiveEffect.Implementation>,
      IntentionalPartial<PreparePartContext> {}

  /** @remarks Added by {@linkcode ActiveEffectConfig._preparePartContext | #_preparePartContext} */
  interface PreparePartContext {
    /** @remarks Only added when the part being rendered is also a tab of the `sheet` group. */
    tab: ApplicationV2.Tab;

    /** @remarks Added for the `details` part. */
    isActorEffect: boolean;

    /** @remarks Added for the `details` part. */
    isItemEffect: boolean;

    /** @remarks Added for the `details` part; the registered {@linkcode CONFIG.statusEffects}. */
    statuses: StatusChoice[];

    /** @remarks Added for the `details` part, in reverse {@linkcode CONST.ACTIVE_EFFECT_SHOW_ICON} order. */
    showIconOptions: ShowIconChoice[];

    /** @remarks Added for the `duration` part; `null` when the effect has no recorded start. */
    start: StartContext | null;

    /** @remarks Added for the `duration` part. */
    hasDuration: boolean;

    /** @remarks Added for the `duration` part, grouped into time-based and combat-based units. */
    durationUnits: DurationUnitChoice[];

    /** @remarks Added for the `duration` part; localized expiry event labels sorted by label. */
    expiryEvents: Record<string, string>;

    /**
     * @remarks Added for the `changes` part; one rendered HTML string per change, produced by
     * {@linkcode ActiveEffectConfig._renderChange | #_renderChange}.
     */
    changes: string[];

    /** @remarks Added for the `footer` part. */
    buttons: ApplicationV2.FormFooterButton[];

    /** @remarks Added for the `tabs` part. */
    tabClasses: string;
  }

  /** An entry of {@linkcode PreparePartContext.statuses}. */
  interface StatusChoice {
    value: string;

    label: string;
  }

  /** An entry of {@linkcode PreparePartContext.showIconOptions}. */
  interface ShowIconChoice {
    value: CONST.ACTIVE_EFFECT_SHOW_ICON;

    label: string;
  }

  /** An entry of {@linkcode PreparePartContext.durationUnits}. */
  interface DurationUnitChoice {
    value: CONST.ACTIVE_EFFECT_DURATION_UNITS;

    label: string;

    group: string;
  }

  /** The context passed to {@linkcode ActiveEffectConfig._renderChange | ActiveEffectConfig#_renderChange}. */
  interface RenderChangeContext {
    /**
     * A copy of the change from the Effect's source array
     *
     * @remarks Mutated in place: a non-string `value` is JSON-stringified, and `keyPath`, `typePath`,
     * `valuePath`, `phasePath` and `priorityPath` are added.
     */
    change: ActiveEffect.ChangeData;

    /** The change object's index in the array */
    index: number;

    /** The defined fields of the change data */
    fields: DataSchema;

    /** The change type's default priority */
    defaultPriority: number;

    /** All change types and their localized labels */
    changeTypes: Record<string, string>;

    /**
     * @remarks Set by {@linkcode ActiveEffectConfig._renderChange | #_renderChange} rather than passed in;
     * `undefined` for an unregistered change type.
     */
    changeType?: ActiveEffect.ChangeTypeConfig | undefined;
  }

  /**
   * The display context prepared by
   * {@linkcode ActiveEffectConfig._prepareStartContext | ActiveEffectConfig#_prepareStartContext}.
   *
   * @remarks Spreads the effect's `_source.start`, overwriting its `combat`, `combatant` and `time`.
   */
  interface StartContext {
    /** The Combatant's initiative roll at the time the Effect first started */
    initiative: number | null;

    /** The round of the Combat when the Effect first started */
    round: number | null;

    /** The turn of the Combat when the Effect first started */
    turn: number | null;

    /** @remarks The elapsed world time since the effect started, formatted with the `"ago"` calendar format. */
    time: string;

    combat: Combat.Implementation | null;

    combatant: Combatant.Implementation | null;

    /** @remarks `"???"` when the combatant is hidden from the current User. */
    combatantName: string;

    /**
     * @remarks `"???"` when the combatant is hidden, or the localization of `"EFFECT.START.NoInitiative"`
     * when it has no initiative.
     */
    combatantInitiative: number | string;
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
