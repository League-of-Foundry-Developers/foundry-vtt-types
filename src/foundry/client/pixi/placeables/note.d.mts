import type { HandleEmptyObject } from "../../../../types/helperTypes.d.mts";
import type { NullishProps } from "../../../../types/utils.d.mts";
import type { ConfiguredObjectClassOrDefault } from "../../config.d.mts";

declare global {
  /**
   * A Note is an implementation of PlaceableObject which represents an annotated location within the Scene.
   * Each Note links to a JournalEntry document and represents its location on the map.
   * @see {@link NoteDocument}
   * @see {@link NotesLayer}
   */
  class Note<
    ControlOptions extends Note.ControlOptions = Note.ControlOptions,
    DestroyOptions extends Note.DestroyOptions | boolean = Note.DestroyOptions | boolean,
    DrawOptions extends Note.DrawOptions = Note.DrawOptions,
    ReleaseOptions extends Note.ReleaseOptions = Note.ReleaseOptions,
  > extends PlaceableObject<
    NoteDocument.ConfiguredInstance,
    ControlOptions,
    DestroyOptions,
    DrawOptions,
    ReleaseOptions
  > {
    static override embeddedName: "Note";

    static override RENDER_FLAGS: {
      /** @defaultValue `{ propagate: ["refresh"] }` */
      redraw: RenderFlag<Partial<Note.RenderFlags>>;

      /** @defaultValue `{ propagate: ["refreshState", "refreshPosition", "refreshTooltip", "refreshElevation"], alias: true }` */
      refresh: RenderFlag<Partial<Note.RenderFlags>>;

      /** @defaultValue `{ propagate: ["refreshVisibility"] }` */
      refreshState: RenderFlag<Partial<Note.RenderFlags>>;

      /** @defaultValue `{}` */
      refreshVisibility: RenderFlag<Partial<Note.RenderFlags>>;

      /** @defaultValue `{}` */
      refreshPosition: RenderFlag<Partial<Note.RenderFlags>>;

      /** @defaultValue `{}` */
      refreshTooltip: RenderFlag<Partial<Note.RenderFlags>>;

      /** @defaultValue `{ propagate: ["refreshVisibility"] }` */
      refreshElevation: RenderFlag<Partial<Note.RenderFlags>>;

      /**
       * @deprecated since v12, until v14
       * @defaultValue `{ propagate: ["refreshTooltip"], deprecated: {since: 12, until: 14}, alias: true }` */
      refreshText: RenderFlag<Partial<Note.RenderFlags>>;
    };

    /**
     * The control icon.
     * @remarks Foundry does not mark this override, despite it being one
     */
    override controlIcon: ControlIcon | null | undefined;

    /**
     * The tooltip.
     */
    tooltip: PreciseText;

    override get bounds(): PIXI.Rectangle;

    /**
     * The associated JournalEntry which is described by this note
     */
    get entry(): JournalEntry.ConfiguredInstance;

    /**
     * The specific JournalEntryPage within the associated JournalEntry referenced by this Note.
     */
    get page(): JournalEntryPage.ConfiguredInstance;

    /**
     * Determine whether the Note is visible to the current user based on their perspective of the Scene.
     * Visibility depends on permission to the underlying journal entry, as well as the perspective of controlled Tokens.
     * If Token Vision is required, the user must have a token with vision over the note to see it.
     */
    get isVisible(): boolean;

    protected override _draw(options?: HandleEmptyObject<DrawOptions>): Promise<void>;

    /**
     * Draw the control icon.
     */
    protected _drawControlIcon(): ControlIcon;

    /**
     * Draw the tooltip.
     */
    protected _drawTooltip(): PreciseText;

    /**
     * Refresh the tooltip.
     */
    protected _refreshTooltip(): void;

    /**
     * Define a PIXI TextStyle object which is used for the tooltip displayed for this Note
     */
    protected _getTextStyle(): PIXI.TextStyle;

    protected override _applyRenderFlags(flags: NullishProps<Note.RenderFlags>): void;

    /**
     * Refresh the visibility.
     */
    protected _refreshVisibility(): void;

    /**
     * Refresh the state of the Note. Called the Note enters a different interaction state.
     */
    protected _refreshState(): void;

    /**
     * Refresh the position of the Note. Called with the coordinates change.
     */
    protected _refreshPosition(): void;

    /**
     * Refresh the elevation of the control icon.
     */
    protected _refreshElevation(): void;

    /**
     * @privateRemarks _onUpdate is overridden but with no signature changes.
     * For type simplicity it is left off. These methods historically have been the source of a large amount of computation from tsc.
     */

    protected override _canHover(user?: User.ConfiguredInstance): boolean;

    protected override _canView(user?: User.ConfiguredInstance): boolean;

    protected override _canConfigure(user?: User.ConfiguredInstance): boolean;

    protected override _onClickLeft2(event: PIXI.FederatedEvent): ImagePopout | undefined;

    /**
     * The text label used to annotate this Note
     * @deprecated since v12, until v14
     * @remarks "Note#text has been deprecated. Use Note#document#label instead."
     */
    get text(): string;

    /**
     * The Map Note icon size
     * @deprecated since v12, until v14
     * @remarks "Note#size has been deprecated. Use Note#document#iconSize instead."
     */
    get size(): number;
  }

  namespace Note {
    type AnyConstructor = typeof AnyNote;

    interface ControlOptions extends PlaceableObject.ControlOptions {}

    interface DestroyOptions extends PlaceableObject.DestroyOptions {}

    interface DrawOptions extends PlaceableObject.DrawOptions {}

    interface ReleaseOptions extends PlaceableObject.ReleaseOptions {}

    type ConfiguredClass = ConfiguredObjectClassOrDefault<typeof Note>;
    type ConfiguredInstance = InstanceType<ConfiguredClass>;

    interface RenderFlags extends PlaceableObject.RenderFlags {
      refreshVisibility: boolean;

      refreshPosition: boolean;

      refreshTooltip: boolean;

      refreshElevation: boolean;
      /** @deprecated since v12, until v14 */
      refreshText: boolean;
    }
  }
}

declare abstract class AnyNote extends Note {
  constructor(arg0: never, ...args: never[]);
}
