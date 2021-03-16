/**
 * The client side Updater application
 * This displays the progress of patching/update progress for the VTT
 */
declare class UpdateNotes extends Application {
  constructor(target: UpdateNotes['target'], options?: Partial<Application.Options>);

  target: UpdateNotes.Target;

  /**
   * @override
   * @defaultValue
   * ```typescript
   * mergeObject(super.defaultOptions, {
   *   id: "update-notes",
   *   template: "templates/setup/update-notes.html",
   *   width: 600
   * });
   * ```
   */
  static get defaultOptions(): Application.Options;

  /** @override */
  get title(): string;

  /**
   * @param options - (unused)
   * @override
   */
  getData(options?: Application.RenderOptions): Promise<{ notes: UpdateNotes['target']['notes'] }>;

  /** @override */
  activateListeners(html: JQuery): void;
}

declare namespace UpdateNotes {
  interface Target {
    notes: string;
    version: string;
  }
}
