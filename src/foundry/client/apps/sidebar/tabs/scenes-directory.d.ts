/**
 * A directory listing of active game scenes
 */
declare class SceneDirectory extends SidebarDirectory<"Scene"> {
  static override documentName: "Scene";

  /**
   * @defaultValue `"templates/sidebar/scene-partial.html"`
   */
  static override documentPartial: string;

  protected override _render(
    force?: boolean,
    options?: Application.RenderOptions<SidebarDirectory.Options>
  ): Promise<void>;

  protected override _getEntryContextOptions(): ContextMenuEntry[];
}
