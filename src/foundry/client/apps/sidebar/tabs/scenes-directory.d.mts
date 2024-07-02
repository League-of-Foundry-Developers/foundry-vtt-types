export {};

declare global {
  /**
   * A directory listing of active game scenes
   */
  class SceneDirectory extends DocumentDirectory<"Scene"> {
    static override documentName: "Scene";

    /**
     * @defaultValue `"templates/sidebar/scene-partial.html"`
     */
    static override entryPartial: string;

    /**
     * @defaultValue
     * ```typescript
     * const options = super.defaultOptions;
     * options.renderUpdateKeys.push("background");
     * return options;
     * ```
     */
    static override get defaultOptions(): DocumentDirectoryOptions;

    protected override _render(
      force?: boolean,
      options?: Application.RenderOptions<DocumentDirectoryOptions>,
    ): Promise<void>;

    protected override _getEntryContextOptions(): ContextMenuEntry[];

    protected override _getFolderContextOptions(): ContextMenuEntry[];
  }
}
