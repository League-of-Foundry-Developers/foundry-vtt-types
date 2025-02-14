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

    protected override _getEntryContextOptions(): foundry.applications.ui.ContextMenu.Entry<JQuery>[];

    protected override _getFolderContextOptions(): foundry.applications.ui.ContextMenu.Entry<JQuery>[];
  }

  namespace SceneDirectory {
    type Any = AnySceneDirectory;
    type AnyConstructor = typeof AnySceneDirectory;
  }
}

declare abstract class AnySceneDirectory extends SceneDirectory {
  constructor(arg0: never, ...args: never[]);
}
