/**
 * A form designed for creating and editing an Active Effect on an Actor or Item entity.
 *
 * @param object  - The target active effect being configured
 * @param options - Additional options which modify this application instance
 * @typeParam D - The data structure used to render the handlebars template.
 * @typeParam O - the type of the ActiveEffect which should be managed by this form sheet
 */
declare class ActiveEffectConfig<
  D extends object = ActiveEffectConfig.Data,
  O extends ActiveEffect = D extends ActiveEffectConfig.Data<infer T> ? T : ActiveEffect
> extends FormApplication<D, O> {
  /** @override */
  static get defaultOptions(): FormApplication.Options;

  /** @override */
  get title(): string;

  /** @override */
  getData(options?: Application.RenderOptions): D | Promise<D>;

  /** @override */
  activateListeners(html: JQuery): void;

  /**
   * Provide centralized handling of mouse clicks on control buttons.
   * Delegate responsibility out to action-specific handlers depending on the button action.
   * @param event - The originating click event
   */
  protected _onEffectControl(event: JQuery.ClickEvent): this | void;

  /**
   * Handle adding a new change to the changes array.
   * @param button - The clicked action button
   */
  protected _addEffectChange(button: HTMLElement): void;

  /** @override */
  protected _updateObject(event: Event, formData?: object): ReturnType<O['update']>;
}

declare namespace ActiveEffectConfig {
  interface Data<O extends ActiveEffect = ActiveEffect> {
    effect: Duplicated<O['data']>;
    isActorEffect: boolean;
    isItemEffect: boolean;
    submitText: string;
    modes: Record<keyof typeof ACTIVE_EFFECT_MODES, string>;
  }
}
