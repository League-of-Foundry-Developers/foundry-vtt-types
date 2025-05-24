import type { Identity } from "#utils";

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

    protected override _getEntryContextOptions(): foundry.applications.ux.ContextMenu.Entry<JQuery>[];

    protected override _getFolderContextOptions(): foundry.applications.ux.ContextMenu.Entry<JQuery>[];
  }

  namespace SceneDirectory {
    interface Any extends AnySceneDirectory {}
    interface AnyConstructor extends Identity<typeof AnySceneDirectory> {}
  }
}

declare abstract class AnySceneDirectory extends SceneDirectory {
  constructor(...args: never);
}
