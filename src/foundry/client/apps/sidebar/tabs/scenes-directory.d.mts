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
    static override get defaultOptions(): DocumentDirectory.Options;

    protected override _render(
      force?: boolean,
      options?: Application.RenderOptions<DocumentDirectory.Options>,
    ): Promise<void>;

    protected override _getEntryContextOptions(): ContextMenu.Entry[];

    protected override _getFolderContextOptions(): ContextMenu.Entry[];
  }

  namespace SceneDirectory {
    type Any = AnySceneDirectory;
    type AnyConstructor = typeof AnySceneDirectory;
  }
}

declare abstract class AnySceneDirectory extends SceneDirectory {
  constructor(arg0: never, ...args: never[]);
}
