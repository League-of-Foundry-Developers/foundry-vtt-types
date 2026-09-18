import type { FixedInstanceType } from "#utils";
import type TokenApplicationMixin from "#client/applications/sheets/token/mixin.d.mts";
import type { AllHooks } from "#client/hooks.mjs";
import type { Token } from "#client/canvas/placeables/_module.d.mts";

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
   * @see {@linkcode ChatBubbles.say | ChatBubbles#say}
   * @deprecated "The `chatBubble` hook is deprecated. Please use `chatBubbleHTML` instead, which now passes
   * an HTMLElement argument instead of jQuery." (since v13, until v15)
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
   * @remarks This is called by {@linkcode Hooks.callAll}.
   * @see {@linkcode ChatMessage.render | ChatMessage#render}
   */
  renderChatMessage: (message: ChatMessage.Implementation, html: JQuery, messageData: ChatMessage.MessageData) => void;
}

/**
 * A registry of the {@linkcode ApplicationV2}'s name to the instance. Used for hooks.
 */
export interface ApplicationV2Config {
  HandlebarsApplication: FixedInstanceType<
    foundry.applications.api.HandlebarsApplicationMixin.Mix<foundry.applications.api.ApplicationV2.AnyConstructor>
  >;
  TokenApplication: FixedInstanceType<TokenApplicationMixin.Mix<foundry.applications.api.ApplicationV2.AnyConstructor>>;
  PlaceablePalette: foundry.applications.sheets.palette.PlaceablePaletteMixin.AnyMixed;
}

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

/** @remarks Maps runtime rendered effect source class names to their instances for shader initialization hooks. */
export interface RenderedEffectSourceConfig {
  PointLightSource: foundry.canvas.sources.PointLightSource;
  PointDarknessSource: foundry.canvas.sources.PointDarknessSource;
  GlobalLightSource: foundry.canvas.sources.GlobalLightSource;
  PointVisionSource: foundry.canvas.sources.PointVisionSource;
}

/** @remarks Maps DocumentCollection subclass names to their document types for initialization errors. */
export interface DocumentCollectionConfig {
  Actors: "Actor";
  Items: "Item";
  Scenes: "Scene";
  Journal: "JournalEntry";
  RollTables: "RollTable";
  CardStacks: "Cards";
  Macros: "Macro";
  Playlists: "Playlist";
  ChatMessages: "ChatMessage";
  CombatEncounters: "Combat";
  FogExplorations: "FogExploration";
  Users: "User";
  WorldSettings: "Setting";
  Folders: "Folder";
  CompendiumFolderCollection: "Folder";
  CompendiumCollection: foundry.documents.collections.CompendiumCollection.DocumentName;
}

/** @remarks Maps embedded collection class names to document types for initialization errors. */
export interface EmbeddedCollectionConfig {
  EmbeddedCollection: foundry.abstract.Document.Type;
  EmbeddedCollectionDelta: foundry.abstract.Document.Type;
  SingletonEmbeddedCollection: foundry.abstract.Document.Type;
}
