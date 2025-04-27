import type { InterfaceToObject, AnyObject, Identity } from "fvtt-types/utils";

declare global {
  /**
   * The Application responsible for configuring a single Token document within a parent Scene.
   */
  class TokenConfig<
    Options extends
      DocumentSheet.Options<TokenDocument.Implementation> = DocumentSheet.Options<TokenDocument.Implementation>,
  > extends DocumentSheet<TokenDocument.Implementation | Actor.Implementation, Options> {
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
    static override get defaultOptions(): DocumentSheet.Options<TokenDocument.Implementation>;

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
    protected _onAddDetectionMode(modes: TokenDocument.Implementation["detectionModes"]): void;

    /**
     * Handle removing a detection mode.
     * @param index - The index of the detection mode to remove.
     * @param modes - The existing detection modes.
     */
    protected _onRemoveDetectionMode(index: number, modes: TokenDocument.Implementation["detectionModes"]): void;

    /**
     * Disable the user's ability to edit the token image field if wildcard images are enabled and that user does not have
     * file browser permissions.
     * @internal
     */
    protected _disableEditImage(): void;
  }

  namespace TokenConfig {
    interface Any extends AnyTokenConfig {}
    interface AnyConstructor extends Identity<typeof AnyTokenConfig> {}

    /** @internal */
    type _FormData = Pick<
      TokenDocument.Implementation,
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
      "bar1.attribute": TokenDocument.Implementation["bar1"]["attribute"];
      "bar2.attribute": TokenDocument.Implementation["bar2"]["attribute"];
      "light.alpha": TokenDocument.Implementation["light"]["alpha"];
      "light.angle": TokenDocument.Implementation["light"]["angle"];
      "light.animation.intensity": TokenDocument.Implementation["light"]["animation"]["intensity"];
      "light.animation.reverse": TokenDocument.Implementation["light"]["animation"]["reverse"];
      "light.animation.speed": TokenDocument.Implementation["light"]["animation"]["speed"];
      "light.animation.type": TokenDocument.Implementation["light"]["animation"]["type"];
      "light.attenuation": TokenDocument.Implementation["light"]["attenuation"];
      "light.bright": TokenDocument.Implementation["light"]["bright"];
      "light.color": TokenDocument.Implementation["light"]["color"];
      "light.coloration": TokenDocument.Implementation["light"]["coloration"];
      "light.contrast": TokenDocument.Implementation["light"]["contrast"];
      "light.dim": TokenDocument.Implementation["light"]["dim"];
      "light.luminosity": TokenDocument.Implementation["light"]["luminosity"];
      "light.saturation": TokenDocument.Implementation["light"]["saturation"];
      "light.shadows": TokenDocument.Implementation["light"]["shadows"];
      "occludable.radius": TokenDocument.Implementation["occludable"]["radius"];
      "ring.colors.background": TokenDocument.Implementation["ring"]["colors"]["background"];
      "ring.colors.ring": TokenDocument.Implementation["ring"]["colors"]["ring"];
      "ring.effects": TokenDocument.Implementation["ring"]["effects"];
      "ring.enabled": TokenDocument.Implementation["ring"]["enabled"];
      "ring.subject.scale": TokenDocument.Implementation["ring"]["subject"]["scale"];
      "ring.subject.texture": TokenDocument.Implementation["ring"]["subject"]["texture"];
      "sight.attenuation": TokenDocument.Implementation["sight"]["attenuation"];
      "sight.color": TokenDocument.Implementation["sight"]["color"];
      "sight.contrast": TokenDocument.Implementation["sight"]["contrast"];
      "sight.enabled": TokenDocument.Implementation["sight"]["enabled"];
      "texture.anchorX": TokenDocument.Implementation["texture"]["anchorX"];
      "texture.anchorY": TokenDocument.Implementation["texture"]["anchorY"];
      "texture.fit": TokenDocument.Implementation["texture"]["fit"];
      "texture.scaleX": TokenDocument.Implementation["texture"]["scaleX"];
      "texture.scaleY": TokenDocument.Implementation["texture"]["scaleY"];
      "texture.src": TokenDocument.Implementation["texture"]["src"];
      "texture.tint": TokenDocument.Implementation["texture"]["tint"];
    }
  }

  /**
   * A sheet that alters the values of the default Token configuration used when new Token documents are created.
   */
  class DefaultTokenConfig<
    Options extends
      DocumentSheet.Options<TokenDocument.Implementation> = DocumentSheet.Options<TokenDocument.Implementation>,
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
    static override get defaultOptions(): DocumentSheet.Options<TokenDocument.Implementation>;

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

    protected override _onAddDetectionMode(modes: TokenDocument.Implementation["detectionModes"]): void;

    protected override _onRemoveDetectionMode(
      index: number,
      modes: TokenDocument.Implementation["detectionModes"],
    ): void;
  }

  namespace DefaultTokenConfig {
    interface Any extends AnyDefaultTokenConfig {}
    interface AnyConstructor extends Identity<typeof AnyDefaultTokenConfig> {}
  }
}

declare abstract class AnyTokenConfig extends TokenConfig<DocumentSheet.Options<TokenDocument.Implementation>> {
  constructor(...args: never);
}

declare abstract class AnyDefaultTokenConfig extends DefaultTokenConfig<
  DocumentSheet.Options<TokenDocument.Implementation>
> {
  constructor(...args: never);
}
