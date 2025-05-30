import type { AllHooks } from "#client/hooks.mjs";

export interface HookConfig extends AllHooks {}

export interface DeprecatedHookConfig {
  /**
   * A hook event that fires when a chat bubble is initially configured.
   * @param token   - The speaking token
   * @param html    - The HTML for the chat bubble
   * @param message - The spoken message text
   * @param options - additional options
   * @remarks This is called when creating a {@linkcode ChatBubble}, but before displaying it.
   * @remarks This is called by {@linkcode Hooks.call}.
   * @remarks An explicit return value of `false` prevents the chat bubble being shown.
   * @see {@link ChatBubbles.say | `ChatBubbles#say`}
   * @deprecated since v13 until v15
   */
  chatBubble: (
    token: Token.Implementation,
    html: JQuery,
    message: string,
    options: foundry.canvas.animation.ChatBubbles.Options,
  ) => boolean | void;

  /**
   * A hook event that fires for each ChatMessage which is rendered for addition to the ChatLog.
   * This hook allows for final customization of the message HTML before it is added to the log.
   * @param message        - The ChatMessage document being rendered
   * @param html           - The pending HTML as a jQuery object
   * @param messageData    - The input data provided for template rendering
   * @remarks This is called by {@linkcode Hooks.call}, but its return is not checked;
   * returning `false` only prevents later hooks running
   * @see {@link ChatMessage.render | `ChatMessage#render`}
   */
  renderChatMessage: (
    message: ChatMessage.Implementation,
    html: JQuery,
    messageData: ChatMessage.MessageData,
  ) => boolean | void;

  /**
   * @deprecated - This hook appears to have been deleted.
   */
  getSceneNavigationContext: (
    app: foundry.applications.ui.SceneNavigation,
    contextOptions: foundry.applications.ux.ContextMenu.Entry<HTMLElement>[],
  ) => boolean | void;

  /**
   * @deprecated This hook does not currently exist due to a bug in {@linkcode WeatherEffects.hookName}
   * where it currently is `"FullCanvasObject"` instead of the correct `"WeatherEffects"`.
   * See: https://github.com/foundryvtt/foundryvtt/issues/12930
   */
  drawWeatherEffects: Hooks.DrawLayer<WeatherEffects>;

  /**
   * @deprecated This hook does not currently exist due to a bug in {@linkcode WeatherEffects.hookName}
   * where it currently is `"FullCanvasObject"` instead of the correct `"WeatherEffects"`.
   * See: https://github.com/foundryvtt/foundryvtt/issues/12930
   */
  tearDownEffects: Hooks.TearDownLayer<WeatherEffects>;

  /**
   * @deprecated This hook only exists due to a bug in {@linkcode WeatherEffects.hookName} where it
   * is `"FullCanvasObject"` instead of the correct `"WeatherEffects"`.
   * See: https://github.com/foundryvtt/foundryvtt/issues/12930
   */
  drawFullCanvasObject: Hooks.DrawLayer<WeatherEffects>;

  /**
   * @deprecated This hook only exists due to a bug in {@linkcode WeatherEffects.hookName} where it
   * is `"FullCanvasObject"` instead of the correct `"WeatherEffects"`.
   * See: https://github.com/foundryvtt/foundryvtt/issues/12930
   */
  tearDownCanvasObject: Hooks.TearDownLayer<WeatherEffects>;
}

/**
 * A registry of the {@linkcode ApplicationV2}'s name to the instance. Used for hooks.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ApplicationV2Config {}

/**
 * A registry of the {@linkcode Application}'s name to the instance. Used for hooks.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ApplicationConfig {}

/**
 * A registry of the {@linkcode PlaceableObject}'s {@linkcode PlaceableObject.embeddedName | embeddedName}
 * to the instance. Used for hooks.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface PlaceableObjectConfig {}

/**
 * A registry of the {@linkcode CanvasGroupMixin | CanvasGroup}'s {@linkcode CanvasGroupMixin.AnyMixed.hookName | hookName}
 * to the instance. Used for hooks.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CanvasGroupConfig {}

/**
 * A registry of the {@linkcode CanvasLayer}'s {@linkcode CanvasLayer.hookName | hookName}
 * to the instance. Used for hooks.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CanvasLayerConfig {}

/**
 * A registry of the {@linkcode InteractionLayer}'s {@linkcode InteractionLayer.hookName | hookName}
 * to the instance. Used for hooks.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface InteractionLayerConfig {}

/**
 * A registry of the {@linkcode PlaceablesLayer}'s {@linkcode PlaceablesLayer.hookName | hookName}
 * to the instance. Used for hooks.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface PlaceablesLayerConfig {}
