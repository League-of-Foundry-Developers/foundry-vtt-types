/**
 * A form designed for creating and editing an Active Effect on an Actor or Item entity.
 *
 * @typeParam P - the type of the options object
 * @typeParam D - The data structure used to render the handlebars template.
 * @typeParam O - the type of the ActiveEffect which should be managed by this form sheet
 */
declare class ActiveEffectConfig<
  P extends FormApplication.Options = FormApplication.Options,
  D extends object = ActiveEffectConfig.Data,
  O extends ActiveEffect = D extends ActiveEffectConfig.Data<infer T> ? T : ActiveEffect
> extends FormApplication<P, D, O> {
  /** @override */
  static get defaultOptions(): typeof FormApplication['defaultOptions'];

  /**
   * @param object  - The target active effect being configured
   * @param options - Additional options which modify this application instance
   */
  constructor(object: O, options?: Partial<P>);

  /** @override */
  get title(): string;

  /** @override */
  activateListeners(html: JQuery): void;

  /** @override */
  getData(options?: Application.RenderOptions): D | Promise<D>;

  /**
   * Handle adding a new change to the changes array.
   * @param button - The clicked action button
   */
  protected _addEffectChange(button: HTMLElement): void;

  /**
   * Provide centralized handling of mouse clicks on control buttons.
   * Delegate responsibility out to action-specific handlers depending on the button action.
   * @param event - The originating click event
   */
  protected _onEffectControl(event: JQuery.ClickEvent): this | void;

  /** @override */
  protected _updateObject(event: Event, formData?: object): ReturnType<O['update']>;
}

declare namespace ActiveEffectConfig {
  /**
   * @typeParam A - the type of the ActiveEffect
   */
  interface Data<A extends ActiveEffect = ActiveEffect> {
    effect: Duplicated<A['data']>;
    isActorEffect: boolean;
    isItemEffect: boolean;
    modes: Record<keyof typeof ACTIVE_EFFECT_MODES, string>;
    submitText: string;
  }
}
