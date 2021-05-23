/**
 * The client side Updater application
 * This displays the progress of patching/update progress for the VTT
 */
declare class UpdateNotes extends Application {
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
  static get defaultOptions(): typeof Application['defaultOptions'];

  constructor(target: UpdateNotes['target'], options?: Partial<Application.Options>);

  target: UpdateNotes.Target;

  /** @override */
  get title(): string;

  /** @override */
  activateListeners(html: JQuery): void;

  /**
   * @param options - (unused)
   * @override
   */
  getData(options?: Application.RenderOptions): Promise<{ notes: UpdateNotes['target']['notes'] }>;
}

declare namespace UpdateNotes {
  interface Target {
    notes: string;
    version: string;
  }
}
