/**
 * The End User License Agreement
 * Display the license agreement and prompt the user to agree before moving forwards
 */
declare class EULA extends Application {
  /**
   * @defaultValue
   * ```typescript
   * {
   *   ...super.defaultOptions,
   *   id: 'eula',
   *   template: 'templates/setup/eula.html',
   *   title: 'End User License Agreement',
   *   width: 720,
   *   popOut: true,
   * }
   * ```
   */
  static get defaultOptions(): typeof Application['defaultOptions'];

  /**
   * A reference to the setup URL used under the current route prefix, if any
   * @defaultValue `'license'`
   */
  get licenseURL(): string;

  /** @override */
  getData(): EULA.Data | Promise<EULA.Data>;

  /** @override */
  protected _renderOuter(options: Application.RenderOptions): Promise<JQuery<JQuery.Node>>;

  /** @override */
  activateListeners(html: JQuery): void;

  /**
   * Handle refusal of the EULA by checking the decline button
   * @param event - The originating click event
   */
  protected _onDecline(event: JQuery.ClickEvent): void;

  /**
   * Validate form submission before sending it onwards to the server
   */
  protected _onSubmit(event: Event): number | void;
}

declare namespace EULA {
  interface Data {
    html: string;
  }
}
