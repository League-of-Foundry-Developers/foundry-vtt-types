import type { InterfaceToObject, AnyObject } from "fvtt-types/utils";
import type StringTerm from "../../../client-esm/dice/terms/string.d.mts";

declare global {
  /**
   * The Application responsible for configuring a single Token document within a parent Scene.
   */
  class TokenConfig<
    Options extends
      DocumentSheetOptions<TokenDocument.ConfiguredInstance> = DocumentSheetOptions<TokenDocument.ConfiguredInstance>,
  > extends DocumentSheet<Options, TokenDocument.ConfiguredInstance | Actor.ConfiguredInstance> {
    constructor(object: TokenDocument.ConfiguredInstance | Actor.ConfiguredInstance, options?: Partial<Options>);

    /**
     * The placed Token object in the Scene
     */
    token: TokenDocument.ConfiguredInstance | foundry.data.PrototypeToken;

    /**
     * A reference to the Actor which the token depicts
     */
    actor: Actor.ConfiguredInstance;

    /**
     * Maintain a copy of the original to show a real-time preview of changes.
     */
    preview: TokenDocument.ConfiguredInstance | foundry.data.PrototypeToken;

    /**
     * @defaultValue
     * ```typescript
     * foundry.utils.mergeObject(super.defaultOptions, {
     *   classes: ["sheet", "token-sheet"],
     *   template: "templates/scene/token-config.html",
     *   width: 480,
     *   height: "auto",
     *   tabs: [
     *     {navSelector: '.tabs[data-group="main"]', contentSelector: "form", initial: "character"},
     *     {navSelector: '.tabs[data-group="light"]', contentSelector: '.tab[data-tab="light"]', initial: "basic"}
     *     {navSelector: '.tabs[data-group="vision"]', contentSelector: '.tab[data-tab="vision"]', initial: "basic"}
     *   ],
     *   viewPermission: CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER,
     *   sheetConfig: true
     * })
     * ```
     */
    static override get defaultOptions(): DocumentSheetOptions<TokenDocument.ConfiguredInstance>;

    /**
     * A convenience accessor to test whether we are configuring the prototype Token for an Actor.
     */
    get isPrototype(): boolean;

    override get id(): string;

    override get title(): string;

    override render(force?: boolean, options?: Application.RenderOptions<Options>): this;

    protected override _render(force?: boolean, options?: Application.RenderOptions<Options>): Promise<void>;

    /**
     * Handle preview with a token.
     */
    protected _handleTokenPreview(force: boolean, options?: Options): Promise<void>;

    protected override _canUserView(user: User): boolean;

    override getData(options?: Partial<Options>): Promise<object>; // TODO: Implement GetDataReturnType

    protected _renderInner(data: ReturnType<this["getData"]>): Promise<JQuery<HTMLElement>>;

    /**
     * Get an Object of image paths and filenames to display in the Token sheet
     * @internal
     */
    protected _getAlternateTokenImages(): Promise<Record<string, string>>;

    override activateListeners(html: JQuery): void;

    override close(options?: FormApplication.CloseOptions): Promise<void>;

    protected override _getSubmitData(updateData?: AnyObject | null): InterfaceToObject<TokenConfig.FormData>;

    protected override _onChangeInput(event: JQuery.ChangeEvent): Promise<void>;

    /**
     * Mimic changes to the Token document as if they were true document updates.
     * @param change - The change to preview.
     */
    protected _previewChanges(change?: AnyObject): void;

    /**
     * Reset the temporary preview of the Token when the form is submitted or closed.
     */
    protected _resetPreview(): void;

    protected override _updateObject(event: Event, formData: TokenConfig.FormData): Promise<unknown>;

    /**
     * Handle Token assignment requests to update the default prototype Token
     * @param event - The left-click event on the assign token button
     * @internal
     */
    protected _onAssignToken(event: JQuery.ClickEvent): void;

    /**
     * Handle changing the attribute bar in the drop-down selector to update the default current and max value
     * @internal
     */
    protected _onBarChange(ev: JQuery.ChangeEvent): void;

    /**
     * Handle click events on a token configuration sheet action button
     * @param event - The originating click event
     */
    protected _onClickActionButton(event: PointerEvent): void;

    /**
     * Handle adding a detection mode.
     * @param modes - The existing detection modes
     */
    protected _onAddDetectionMode(modes: TokenDocument["detectionModes"]): void;

    /**
     * Handle removing a detection mode.
     * @param index - The index of the detection mode to remove.
     * @param modes - The existing detection modes.
     */
    protected _onRemoveDetectionMode(index: number, modes: TokenDocument["detectionModes"]): void;

    /**
     * Disable the user's ability to edit the token image field if wildcard images are enabled and that user does not have
     * file browser permissions.
     * @internal
     */
    protected _disableEditImage(): void;
  }

  namespace TokenConfig {
    type Any = AnyTokenConfig;
    type AnyConstructor = typeof AnyTokenConfig;

    interface FormData {
      // TODO: Update
      actorId: string;
      actorLink: boolean;
      alternateImages?: string;
      alpha: number;
      "bar1.attribute": string;
      "bar2.attribute": string;
      brightLight: number | null;
      brightSight: number | null;
      dimLight: number | null;
      dimSight: number | null;
      displayBars: foundry.CONST.TOKEN_DISPLAY_MODES;
      displayName: foundry.CONST.TOKEN_DISPLAY_MODES;
      disposition: foundry.CONST.TOKEN_DISPOSITIONS;
      elevation: number | null;
      height: number | null;
      img: string;
      lightAlpha: number;
      lightAngle: number | null;
      "lightAnimation.intensity": number;
      "lightAnimation.speed": number;
      "lightAnimation.type": string;
      lightColor: string;
      lockRotation: boolean;
      mirrorX: boolean;
      mirrorY: boolean;
      name: StringTerm;
      rotation: number | null;
      scale: number;
      sightAngle: number | null;
      tint: string;
      vision: boolean;
      width: number | null;
      x: number | null;
      y: number | null;
    }
  }

  /**
   * A sheet that alters the values of the default Token configuration used when new Token documents are created.
   */
  class DefaultTokenConfig<
    Options extends
      DocumentSheetOptions<TokenDocument.ConfiguredInstance> = DocumentSheetOptions<TokenDocument.ConfiguredInstance>,
  > extends TokenConfig<Options> {
    constructor(object?: unknown, options?: Partial<Options>);

    object: TokenDocument.ConfiguredInstance;

    /**
     * The named world setting that stores the default Token configuration
     * @defaultValue `"defaultToken"`
     */
    static SETTING: string;

    /**
     * @defaultValue
     * ```typescript
     * foundry.utils.mergeObject(super.defaultOptions, {
     *   template: "templates/scene/default-token-config.html",
     *   sheetConfig: false
     * })
     * ```
     */
    static override get defaultOptions(): DocumentSheetOptions<TokenDocument.ConfiguredInstance>;

    override get id(): string;

    override get title(): string;

    override get isEditable(): boolean;

    protected override _canUserView(user: User): boolean;

    override getData(options: unknown): Promise<object>; // TODO: Implement GetDataReturnType

    override _getSubmitData(
      updateData?: Parameters<TokenConfig["_getSubmitData"]>[0],
    ): ReturnType<TokenConfig["_getSubmitData"]>;

    override _updateObject(event: Event, formData?: object): Promise<unknown>;

    override activateListeners(html: JQuery): void;

    /**
     * Reset the form to default values
     */
    reset(): void;

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    protected override _onBarChange(): Promise<void>;

    protected override _onAddDetectionMode(modes: TokenDocument["detectionModes"]): void;

    protected override _onRemoveDetectionMode(index: number, modes: TokenDocument["detectionModes"]): void;
  }

  namespace DefaultTokenConfig {
    type Any = AnyDefaultTokenConfig;
    type AnyConstructor = typeof AnyDefaultTokenConfig;
  }
}

declare abstract class AnyTokenConfig extends TokenConfig<DocumentSheetOptions<TokenDocument.ConfiguredInstance>> {
  constructor(arg0: never, ...args: never[]);
}

declare abstract class AnyDefaultTokenConfig extends DefaultTokenConfig<
  DocumentSheetOptions<TokenDocument.ConfiguredInstance>
> {
  constructor(arg0: never, ...args: never[]);
}
