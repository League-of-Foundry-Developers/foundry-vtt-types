import type { ConfiguredDocumentClassForName } from "../../../../types/helperTypes";
import type { TokenData } from "../../../common/data/module.mjs";

declare global {
  /**
   * The Application responsible for configuring a single Token document within a parent Scene.
   * Note that due to an oversight, this class does not inherit from {@link DocumentSheet} as it was intended to, and will
   * be changed in v10.
   * @typeParam Options - The type of the options object
   */
  class TokenConfig<Options extends DocumentSheetOptions = DocumentSheetOptions> extends DocumentSheet<Options> {
    constructor(
      object:
        | InstanceType<ConfiguredDocumentClassForName<"Token">>
        | InstanceType<ConfiguredDocumentClassForName<"Actor">>,
      options?: Partial<Options>
    );

    /** The placed Token object in the Scene */
    token: InstanceType<ConfiguredDocumentClassForName<"Token">> | PrototypeTokenDocument;
    /** A reference to the Actor which the token depicts */
    actor: InstanceType<ConfiguredDocumentClassForName<"Actor">>;
    /** Preserve a copy of the original document before any changes are made. */
    // TODO: unsure about this type.
    original: TokenData["_source"];

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
     *   ],
     *   sheetConfig: true
     * })
     * ```
     */
    static override get defaultOptions(): DocumentSheetOptions;

    /**
     * A convenience accessor to test whether we are configuring the prototype Token for an Actor.
     */
    get isPrototype(): boolean;

    override get id(): string;

    override get title(): string;

    override render(force?: boolean, options?: Application.RenderOptions<Options>): this;

    protected override _canUserView(user: User): boolean;

    override getData(options?: Partial<Options>): MaybePromise<object>;

    protected override _renderInner(args: object): Promise<JQuery>;

    /**
     * Get an Object of image paths and filenames to display in the Token sheet
     * @internal
     */
    protected _getAlternateTokenImages(): Promise<Record<string, string>>;

    override activateListeners(html: JQuery): void;

    override close(options?: FormApplication.CloseOptions | undefined): Promise<void>;

    protected override _getSubmitData(updateData?: object | null | undefined): Record<string, unknown>;

    protected override _onChangeInput(event: JQuery.ChangeEvent<any, any, any, any>): Promise<void>;

    /**
     * Mimic changes to the Token document as if they were true document updates.
     * @param change - Data which simulates a document update
     * @param reset - To know if this preview change is a reset. Defaults to false.
     */
    protected _previewChanges(change: Parameters<foundry.documents.BaseToken["_onUpdate"]>[0], reset?: boolean): void;

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
    protected _onBarChange(event: JQuery.ChangeEvent): void;

    /**
     * Handle click events on a token configuration sheet action button
     * @param event - The originating click event */
    protected _onClickActionButton(event: JQuery.ClickEvent): void;
    /**
     * Disable the user's ability to edit the token image field if wildcard images are enabled and that user does not have
     * file browser permissions. */
    private _disableEditImage(): void;
  }

  namespace TokenConfig {
    interface FormData {
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
  class DefaultTokenConfig<Options extends DocumentSheetOptions> extends TokenConfig<Options> {
    constructor(object: unknown, options?: Partial<Options> | undefined);

    data: foundry.data.TokenData;

    object: InstanceType<ConfiguredDocumentClassForName<"Token">>;

    token: InstanceType<ConfiguredDocumentClassForName<"Token">>;

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
    static override get defaultOptions(): DocumentSheetOptions;

    override get id(): string;

    override get title(): string;

    override getData(options: unknown): MaybePromise<object>;

    override _getSubmitData(
      updateData?: Parameters<TokenConfig["_getSubmitData"]>[0]
    ): ReturnType<TokenConfig["_getSubmitData"]>;

    override _updateObject(event: Event, formData?: object): Promise<unknown>;

    override activateListeners(html: JQuery): void;

    /**
     * Reset the form to default values
     */
    reset(): void;

    protected override _onBarChange(): Promise<void>;
  }
}
