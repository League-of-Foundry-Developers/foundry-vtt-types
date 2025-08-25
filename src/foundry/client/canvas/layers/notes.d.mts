import type { AnyObject, FixedInstanceType, Identity, InexactPartial, NullishProps } from "#utils";
import type { Canvas } from "#client/canvas/_module.d.mts";
import type { PlaceablesLayer } from "./_module.d.mts";
import type { Note } from "#client/canvas/placeables/_module.d.mts";
import type { SceneControls } from "#client/applications/ui/_module.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface PlaceablesLayerConfig {
      NotesLayer: NotesLayer.Implementation;
    }
  }
}

/**
 * The Notes Layer which contains Note canvas objects
 */
declare class NotesLayer extends PlaceablesLayer<"Note"> {
  /**
   * @privateRemarks This is not overridden in foundry but reflects the real behavior.
   */
  static get instance(): Canvas["notes"];

  /**
   * @defaultValue
   * ```js
   * foundry.utils.mergeObject(super.layerOptions, {
   *  name: "notes",
   *  zIndex: 800
   * })
   * ```
   */
  static override get layerOptions(): NotesLayer.LayerOptions;

  /**
   * @privateRemarks This is not overridden in foundry but reflects the real behavior.
   */
  override options: NotesLayer.LayerOptions;

  static override documentName: "Note";

  /**
   * The named core setting which tracks the toggled visibility state of map notes
   */
  static TOGGLE_SETTING: "notesDisplayToggle";

  override get hookName(): "NotesLayer";

  /** @defaultValue `game.settings.get("core", "notesDisplayToggle")` */
  override interactiveChildren: boolean;

  protected override _getCopyableObjects(options: PlaceablesLayer.GetCopyableObjectsOptions): Note.Implementation[];

  protected override _deactivate(): void;

  protected override _draw(options: AnyObject): Promise<void>;

  /**
   * Register game settings used by the NotesLayer
   */
  static registerSettings(): void;

  /**
   * @deprecated Removed without replacement in v13. This warning will be removed in v14.
   */
  hintMapNotes(): never;

  /**
   * Pan to a given note on the layer.
   * @param note    - The note to pan to.
   * @param options - Options which modify the pan operation.
   * @returns A Promise which resolves once the pan animation has concluded.
   */
  panToNote(note: Note.Implementation, options?: NotesLayer.PanToNoteOptions): Promise<void>;

  static override prepareSceneControls(): SceneControls.Control;

  protected override _onClickLeft(event: Canvas.Event.Pointer): Promise<void>;

  /**
   * Handle JournalEntry document drop data
   */
  protected _onDropData(event: DragEvent, data: NotesLayer.DropData): Promise<false | Note.Implementation>;
}

declare namespace NotesLayer {
  /** @deprecated There should only be a single implementation of this class in use at one time, use {@linkcode Implementation} instead */
  type Any = Internal.Any;

  /** @deprecated There should only be a single implementation of this class in use at one time, use {@linkcode ImplementationClass} instead */
  type AnyConstructor = Internal.AnyConstructor;

  namespace Internal {
    interface Any extends AnyNotesLayer {}
    interface AnyConstructor extends Identity<typeof AnyNotesLayer> {}
  }

  interface ImplementationClass extends Identity<CONFIG["Canvas"]["layers"]["notes"]["layerClass"]> {}
  interface Implementation extends FixedInstanceType<ImplementationClass> {}

  interface LayerOptions extends PlaceablesLayer.LayerOptions<Note.ImplementationClass> {
    name: "notes";
    zIndex: 800;
  }

  /** @internal */
  interface _DropDataCommon {
    uuid: string;
  }

  interface DropDataJournalEntry extends _DropDataCommon, Canvas.DropPosition {
    type: "JournalEntry";
  }

  interface DropDataJournalEntryPage extends _DropDataCommon, Canvas.DropPosition {
    type: "JournalEntryPage";
    anchor: { name: string };
  }

  type DropData = DropDataJournalEntry | DropDataJournalEntryPage;

  /** @internal */
  type _PanToNoteOptions = NullishProps<{
    /**
     * The resulting zoom level.
     * @defaultValue `1.5`
     * @remarks The above is a parameter default only; `null` will be eventually be handled by
     * {@link Canvas#_constrainView}, where it will be replaced with `canvas.stage.scale.x`
     */
    scale: number;
  }> &
    InexactPartial<{
      /**
       * The speed of the pan animation in milliseconds.
       * @defaultValue `250`
       * @remarks Can't be `null` as it only has a parameter default
       */
      duration: number;
    }>;

  interface PanToNoteOptions extends _PanToNoteOptions {}
}

export default NotesLayer;

declare abstract class AnyNotesLayer extends NotesLayer {
  constructor(...args: never);
}
