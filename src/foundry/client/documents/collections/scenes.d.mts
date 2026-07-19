import type { Identity, InexactPartial } from "#utils";
import type { Document } from "#common/abstract/_module.d.mts";
import type { WorldCollection } from "#client/documents/abstract/_module.d.mts";
import type { Sound } from "#client/audio/_module.d.mts";
import type { Application } from "#client/appv1/api/_module.d.mts";
import type { DocumentSheetV2 } from "#client/applications/api/_module.d.mts";
import type { DocumentSheetConfig } from "#client/applications/apps/_module.d.mts";

/**
 * The singleton collection of Scene documents which exist within the active World.
 * This Collection is accessible within the Game object as {@linkcode foundry.Game.scenes | game.scenes}.
 *
 * @see {@linkcode foundry.documents.Scene}: The Scene document
 * @see {@linkcode foundry.applications.sidebar.tabs.SceneDirectory}: The SceneDirectory sidebar directory
 */
declare class Scenes extends WorldCollection<"Scene"> {
  static override documentName: "Scene";

  /** @privateRemarks Fake type override */
  static override get instance(): Scenes.Implementation;

  /**
   * Return a reference to the Scene which is currently active
   */
  get active(): Scene.Stored | undefined;

  /**
   * Return the current Scene target.
   * This is the viewed scene if the canvas is active, otherwise it is the currently active scene.
   */
  get current(): Scene.Stored | undefined;

  /**
   * Return a reference to the Scene which is currently viewed
   */
  get viewed(): Scene.Stored | undefined;

  /**
   * Handle preloading the art assets for a Scene.
   * @param sceneId - The Scene ID to begin loading.
   * @param options - Additional options
   */
  preload(sceneId: string, options?: Scenes.PreloadOptions): Promise<Array<Sound | undefined>>;

  /**
   * Handle pre-loading the art assets for a Scene
   *
   * @param sceneId - The Scene id to begin loading
   * @param push    - Trigger other connected clients to also pre-load Scene resources (default: `false`)
   * @deprecated "You are passing the legacy `push` boolean to `Scenes#preload`. This is replaced by the `broadcast` option,
   * for example `game.scenes.preload(sceneId, {broadcast: true})`." (since v14, until v16)
   */
  preload(sceneId: string, push?: boolean): Promise<Array<Sound | undefined>>;

  static _activateSocketListeners(socket: io.Socket): void;

  override fromCompendium<Options extends WorldCollection.FromCompendiumOptions | undefined = undefined>(
    document: Scene.Implementation | Scene.Source,
    options?: Options,
  ): WorldCollection.FromCompendiumReturnType<"Scene", Options>;

  // `Scene`s do not have type data, so this collection does not require an `importDocument` fake override

  // Fake override for the purpose of typing `options`.
  static override registerSheet(
    scope: string,
    sheetClass: Application.AnyConstructor | DocumentSheetV2.AnyConstructor,
    options?: DocumentSheetConfig.RegisterSheetOptions<Scene.ImplementationClass>,
  ): void;

  // Fake override for the purpose of typing `options`.
  static override unregisterSheet(
    scope: string,
    sheetClass: Application.AnyConstructor | DocumentSheetV2.AnyConstructor,
    options?: DocumentSheetConfig.UnregisterSheetOptions<Scene.ImplementationClass>,
  ): void;

  static #Scenes: true;
}

declare namespace Scenes {
  /**
   * @deprecated There should only be a single implementation of this class in use at one time,
   * use {@linkcode Scenes.Implementation} instead. This will be removed in v15.
   */
  type Any = Internal.Any;

  /**
   * @deprecated There should only be a single implementation of this class in use at one time,
   * use {@linkcode Scenes.ImplementationClass} instead. This will be removed in v15.
   */
  type AnyConstructor = Internal.AnyConstructor;

  namespace Internal {
    interface Any extends AnyScenes {}
    interface AnyConstructor extends Identity<typeof AnyScenes> {}
  }

  interface ImplementationClass extends Document.Internal.ConfiguredCollectionClass<"Scene"> {}
  interface Implementation extends Document.Internal.ConfiguredCollection<"Scene"> {}

  /** @internal */
  interface _PreloadOptions {
    /** The Level ID to begin loading. Defaults to the initial level. */
    level: string;

    /**
     * Trigger other connected clients to also preload Scene/Level resources.
     * @defaultValue `false`.
     */
    broadcast: boolean;
  }

  interface PreloadOptions extends InexactPartial<_PreloadOptions> {}

  /** @deprecated Replaced by {@linkcode Scenes.ImplementationClass}. Will be removed in v15. */
  type ConfiguredClass = ImplementationClass;

  /** @deprecated Replaced by {@linkcode Scenes.Implementation}. Will be removed in v15. */
  type Configured = Implementation;
}

declare abstract class AnyScenes extends Scenes {
  constructor(...args: never);
}

export default Scenes;
