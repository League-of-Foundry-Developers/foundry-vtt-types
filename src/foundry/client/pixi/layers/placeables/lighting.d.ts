export {};

/**
 * The Lighting Layer which ambient light sources as part of the CanvasEffectsGroup.
 */
declare global {
  class LightingLayer extends PlaceablesLayer<"AmbientLight"> {
    /**
     * @privateRemarks This is not overridden in foundry but reflects the real behavior.
     */
    static get instance(): Canvas["lighting"];

    static override documentName: "AmbientLight";

    /**
     * @privateRemarks This is not overridden in foundry but reflects the real behavior.
     */
    override options: LightingLayer.LayerOptions;

    /**
     * @defaultValue
     * ```
     * foundry.utils.mergeObject(super.layerOptions, {
     *  name: "lighting",
     *  rotatableObjects: true,
     *  zIndex: 300
     * })
     * ```
     */
    static override get layerOptions(): LightingLayer.LayerOptions;

    override get hookName(): string;

    override _activate(): void;

    protected override _onDragLeftStart(event: PIXI.FederatedEvent): ReturnType<AmbientLight["draw"]>;

    protected override _onDragLeftMove(event: PIXI.FederatedEvent): Promise<void>;

    protected override _onDragLeftCancel(event: PointerEvent): Promise<void>;

    protected _onMouseWheel(event: WheelEvent): void;

    /**
     * Actions to take when the darkness level of the Scene is changed
     * @param darkness - The new darkness level
     * @param prior    - The prior darkness level
     */
    protected _onDarknessChange(darkness: number, prior: number): void;

    /**
     * @deprecated since v10, will be removed in v12
     * @remarks "LightingLayer#background has been refactored to EffectsCanvasGroup#background"
     */
    get background(): EffectsCanvasGroup["background"];

    /**
     * @deprecated since v10, will be removed in v12
     * @remarks "LightingLayer#illumination has been refactored to EffectsCanvasGroup#illumination"
     */
    get illumination(): EffectsCanvasGroup["illumination"];

    /**
     * @deprecated since v10, will be removed in v12
     * @remarks "LightingLayer#channels has been refactored to EffectsCanvasGroup#lightingChannelColors"
     * @remarks lightingChannelColors was removed in v11 without this deprecation being updated
     */
    get channels(): undefined;

    /**
     * @deprecated since v10, will be removed in v12
     * @remarks "LightingLayer#coloration has been refactored to EffectsCanvasGroup#coloration"
     */
    get coloration(): EffectsCanvasGroup["coloration"];

    /**
     * @deprecated since v10, will be removed in v12
     * @remarks "LightingLayer#darknessLevel has been refactored to Canvas#darknessLevel"
     */
    get darknessLevel(): Canvas["darknessLevel"];

    /**
     * @deprecated since v10, will be removed in v12
     * @remarks "LightingLayer#globalLight has been refactored to CanvasIlluminationEffects#globalLight"
     */
    get globalLight(): CanvasIlluminationEffects["globalLight"];

    /**
     * @deprecated since v10, will be removed in v12
     * @remarks "LightingLayer#sources has been refactored to EffectsCanvasGroup#lightSources"
     */
    get sources(): EffectsCanvasGroup["lightSources"];

    /**
     * @deprecated since v10, will be removed in v12
     * @remarks "LightingLayer#version has been refactored to EffectsCanvasGroup#lightingVersion"
     * @remarks lightingVersion was removed in v11 without this deprecation being updated
     */
    get version(): undefined;

    /**
     * @deprecated since v10, will be removed in v12
     * @remarks "LightingLayer#activateAnimation has been refactored to EffectsCanvasGroup#activateAnimation"
     */
    activateAnimation(): void;

    /**
     * @deprecated since v10, will be removed in v12
     * @remarks "LightingLayer#deactivateAnimation has been refactored to EffectsCanvasGroup#deactivateAnimation"
     */
    deactivateAnimation(): void;

    /**
     * @deprecated since v10, will be removed in v12
     * @remarks "LightingLayer#animateDarkness has been refactored to EffectsCanvasGroup#animateDarkness"
     */
    animateDarkness: EffectsCanvasGroup["animateDarkness"];

    /**
     * @deprecated since v10, will be removed in v12
     * @remarks "LightingLayer#initializeSources has been refactored to EffectsCanvasGroup#initializeLightSources"
     */
    initializeSources(): ReturnType<EffectsCanvasGroup["initializeLightSources"]>;

    /**
     * @deprecated since v10, will be removed in v12
     * @remarks "LightingLayer#refresh has been refactored to EffectsCanvasGroup#refreshLighting"
     */
    refresh: EffectsCanvasGroup["refreshLighting"];
  }

  namespace LightingLayer {
    interface LayerOptions extends PlaceablesLayer.LayerOptions<"AmbientLight"> {
      name: "lighting";
    }
  }
}
