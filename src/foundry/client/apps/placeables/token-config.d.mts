import type { InterfaceToObject, AnyObject } from "fvtt-types/utils";

declare global {
  /**
   * The Application responsible for configuring a single Token document within a parent Scene.
   */
  class TokenConfig<
    Options extends
      DocumentSheetOptions<TokenDocument.Implementation> = DocumentSheetOptions<TokenDocument.Implementation>,
  > extends DocumentSheet<Options, TokenDocument.Implementation | Actor.Implementation> {
    constructor(object: TokenDocument.Implementation | Actor.Implementation, options?: Partial<Options>);

    /**
     * The placed Token object in the Scene
     */
    token: TokenDocument.Implementation | foundry.data.PrototypeToken;

    /**
     * A reference to the Actor which the token depicts
     */
    actor: Actor.Implementation;

    /**
     * Maintain a copy of the original to show a real-time preview of changes.
     */
    preview: TokenDocument.Implementation | foundry.data.PrototypeToken;

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
    static override get defaultOptions(): DocumentSheetOptions<TokenDocument.Implementation>;

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

    protected override _canUserView(user: User.Implementation): boolean;

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

    /** @internal */
    type _FormData = Pick<
      TokenDocument,
      | "actorId"
      | "actorLink"
      | "alpha"
      | "detectionModes"
      | "displayBars"
      | "displayName"
      | "disposition"
      | "elevation"
      | "lockRotation"
      | "name"
      | "rotation"
      | "sort"
      | "x"
      | "y"
    >;

    interface FormData extends _FormData {
      "bar1.attribute": TokenDocument["bar1"]["attribute"];
      "bar2.attribute": TokenDocument["bar2"]["attribute"];
      "light.alpha": TokenDocument["light"]["alpha"];
      "light.angle": TokenDocument["light"]["angle"];
      "light.animation.intensity": TokenDocument["light"]["animation"]["intensity"];
      "light.animation.reverse": TokenDocument["light"]["animation"]["reverse"];
      "light.animation.speed": TokenDocument["light"]["animation"]["speed"];
      "light.animation.type": TokenDocument["light"]["animation"]["type"];
      "light.attenuation": TokenDocument["light"]["attenuation"];
      "light.bright": TokenDocument["light"]["bright"];
      "light.color": TokenDocument["light"]["color"];
      "light.coloration": TokenDocument["light"]["coloration"];
      "light.contrast": TokenDocument["light"]["contrast"];
      "light.dim": TokenDocument["light"]["dim"];
      "light.luminosity": TokenDocument["light"]["luminosity"];
      "light.saturation": TokenDocument["light"]["saturation"];
      "light.shadows": TokenDocument["light"]["shadows"];
      "occludable.radius": TokenDocument["occludable"]["radius"];
      "ring.colors.background": TokenDocument["ring"]["colors"]["background"];
      "ring.colors.ring": TokenDocument["ring"]["colors"]["ring"];
      "ring.effects": TokenDocument["ring"]["effects"];
      "ring.enabled": TokenDocument["ring"]["enabled"];
      "ring.subject.scale": TokenDocument["ring"]["subject"]["scale"];
      "ring.subject.texture": TokenDocument["ring"]["subject"]["texture"];
      "sight.attenuation": TokenDocument["sight"]["attenuation"];
      "sight.color": TokenDocument["sight"]["color"];
      "sight.contrast": TokenDocument["sight"]["contrast"];
      "sight.enabled": TokenDocument["sight"]["enabled"];
      "texture.anchorX": TokenDocument["texture"]["anchorX"];
      "texture.anchorY": TokenDocument["texture"]["anchorY"];
      "texture.fit": TokenDocument["texture"]["fit"];
      "texture.scaleX": TokenDocument["texture"]["scaleX"];
      "texture.scaleY": TokenDocument["texture"]["scaleY"];
      "texture.src": TokenDocument["texture"]["src"];
      "texture.tint": TokenDocument["texture"]["tint"];
    }
  }

  /**
   * A sheet that alters the values of the default Token configuration used when new Token documents are created.
   */
  class DefaultTokenConfig<
    Options extends
      DocumentSheetOptions<TokenDocument.Implementation> = DocumentSheetOptions<TokenDocument.Implementation>,
  > extends TokenConfig<Options> {
    constructor(object?: unknown, options?: Partial<Options>);

    object: TokenDocument.Implementation;

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
    static override get defaultOptions(): DocumentSheetOptions<TokenDocument.Implementation>;

    override get id(): string;

    override get title(): string;

    override get isEditable(): boolean;

    protected override _canUserView(user: User.Implementation): boolean;

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

declare abstract class AnyTokenConfig extends TokenConfig<DocumentSheetOptions<TokenDocument.Implementation>> {
  constructor(arg0: never, ...args: never[]);
}

declare abstract class AnyDefaultTokenConfig extends DefaultTokenConfig<
  DocumentSheetOptions<TokenDocument.Implementation>
> {
  constructor(arg0: never, ...args: never[]);
}
