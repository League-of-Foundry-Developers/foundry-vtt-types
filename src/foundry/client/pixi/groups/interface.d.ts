/**
 * A container group which displays interface elements rendered above other canvas groups.
 */
declare class InterfaceCanvasGroup extends PIXI.Container {
  constructor();

  sounds: SoundsLayer;

  notes: NotesLayer;

  controls: ControlsLayer;

  /** @defaultValue `true` */
  sortableChildren: boolean;

  /**
   * The name of this canvas group
   * @defaultValue `"interface"`
   */
  static groupName: string;

  /**
   * Create the member layers of the scene container
   * @internal
   */
  protected _createLayers(): void;
}
